import type { NextApiRequest, NextApiResponse } from "next";
import { gnosisClient, POAP_ABI, POAP_CONTRACT_ADDRESS, safePoapContractCall } from "../../config";
import { Address } from "viem";

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;
const requestCounts = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const requestData = requestCounts.get(ip);

  if (!requestData || now - requestData.timestamp > RATE_LIMIT_WINDOW) {
    requestCounts.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (requestData.count >= MAX_REQUESTS) {
    return true;
  }

  requestData.count++;
  return false;
}

interface PoapEvent {
  id: string;
  name: string;
  start_date: string;
  image_url: string;
}

interface Poap {
  event: PoapEvent;
  token_id: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ poaps: Poap[] } | ErrorResponse>): Promise<void> {
  console.log("Entering fetchPoaps handler");

  const { address } = req.query;

  if (!address || typeof address !== "string") {
    console.error("Invalid or missing address:", address);
    return res.status(400).json({ error: "Invalid or missing address" });
  }

  console.log(`Fetching POAPs for address: ${address}`);
  try {
    const balance = await safePoapContractCall<bigint>('balanceOf', [address as Address]);

    if (balance === null) {
      console.error("Failed to fetch POAP balance");
      return res.status(500).json({ error: "Failed to fetch POAP balance" });
    }

    console.log(`POAP balance for ${address}: ${balance.toString()}`);

    if (balance === 0n) {
      console.log("No POAPs found for this address");
      return res.status(404).json({ error: "No POAPs found for this address" });
    }

    const poaps: Poap[] = [];
    for (let i = 0; i < Number(balance); i++) {
      console.log(`Fetching token ID for index ${i}`);
      const tokenId = await safePoapContractCall<bigint>('tokenOfOwnerByIndex', [address as Address, BigInt(i)]);

      if (tokenId === null) {
        console.error(`Failed to fetch token ID at index ${i}`);
        continue;
      }

      console.log(`Token ID at index ${i}: ${tokenId.toString()}`);

      const tokenURI = await safePoapContractCall<string>('tokenURI', [tokenId]);

      if (tokenURI === null) {
        console.error(`Failed to fetch token URI for ID ${tokenId}`);
        continue;
      }

      console.log(`Token URI for ID ${tokenId}: ${tokenURI}`);

      try {
        const response = await fetch(tokenURI);
        const metadata = await response.json();

        const eventName = metadata.name || "Unknown Event";
        const startDateAttribute = metadata.attributes.find((attr: { trait_type: string; value: string }) =>
          attr.trait_type.toLowerCase() === "startdate" || attr.trait_type.toLowerCase() === "start_date"
        );
        let eventStartDate: Date | null = null;

        if (startDateAttribute) {
          const dateValue = startDateAttribute.value;
          const dateParsers = [
            (d: string) => new Date(d),
            (d: string) => new Date(d.split('-').reverse().join('-')), // DD-MM-YYYY to YYYY-MM-DD
            (d: string) => {
              const [day, month, year] = d.split('-');
              return new Date(`${year}-${month}-${day}`);
            }
          ];

          for (const parser of dateParsers) {
            const parsedDate = parser(dateValue);
            if (!isNaN(parsedDate.getTime())) {
              eventStartDate = parsedDate;
              break;
            }
          }

          if (!eventStartDate) {
            console.error(`Invalid date format for token ID ${tokenId}: ${dateValue}`);
          }
        } else {
          console.error(`No start date found in metadata for token ID ${tokenId}`);
        }

        const isCorrectEvent = eventName.toLowerCase().includes("ethglobal brussels") && eventName.toLowerCase().includes("2024");
        const isWithinDateRange = eventStartDate && eventStartDate >= new Date("2024-07-11") && eventStartDate <= new Date("2024-07-14");
        const isSpecificPOAP = tokenId.toString() === "7169394";

        if (isCorrectEvent && isWithinDateRange || isSpecificPOAP) {
          poaps.push({
            event: {
              id: metadata.event_id || "unknown",
              name: eventName,
              start_date: eventStartDate?.toISOString() || 'Invalid Date',
              image_url: metadata.image_url || ""
            },
            token_id: tokenId.toString()
          });
        }
      } catch (metadataError) {
        console.error(`Error processing metadata for token ID ${tokenId}:`, metadataError);
      }
    }

    return res.status(200).json({ poaps });
  } catch (error) {
    console.error("Error fetching POAPs:", error);
    return res.status(500).json({ error: "Unexpected error fetching POAPs", details: (error as Error).message });
  }
}

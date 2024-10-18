import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from "next";

const provider = new ethers.providers.JsonRpcProvider("https://rpc.sepolia.org");
const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

const schemaUID = "0x5e9a817ef4627ae0c58e7704be84fa5a1f6d1c22f6d03ee89d3e0cf51ef53e6e";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { address, poaps } = req.body;

      if (!address || !poaps || !Array.isArray(poaps)) {
        return res.status(400).json({ error: 'Invalid input' });
      }

      if (!process.env.PRIVATE_KEY) {
        throw new Error("PRIVATE_KEY environment variable is not set");
      }

      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string);
      const signer = wallet.connect(provider);

      const eas = new EAS(EASContractAddress);
      eas.connect(signer);

      const schemaEncoder = new SchemaEncoder("address[] addresses,uint256[] tokenIds,string[] eventNames");
      const encodedData = schemaEncoder.encodeData([
        { name: "addresses", value: poaps.map(() => address), type: "address[]" },
        { name: "tokenIds", value: poaps.map(poap => poap.token_id), type: "uint256[]" },
        { name: "eventNames", value: poaps.map(poap => poap.event.name), type: "string[]" },
      ]);

      const tx = await eas.attest({
        schema: schemaUID,
        data: {
          recipient: ethers.constants.AddressZero,
          expirationTime: ethers.BigNumber.from(0),
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();

      console.log("New attestation UID:", newAttestationUID);

      res.status(200).json({ success: true, attestationUID: newAttestationUID });
    } catch (error) {
      console.error('Error in mission-enrollment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

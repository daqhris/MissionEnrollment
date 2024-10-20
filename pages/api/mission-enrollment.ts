import type { NextApiRequest, NextApiResponse } from "next";

// EAS-related imports and functionality have been removed
// TODO: Implement alternative solution or remove this functionality

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === 'POST') {
    try {
      const { address, poaps } = req.body;

      if (!address || !poaps || !Array.isArray(poaps)) {
        return res.status(400).json({ error: 'Invalid input' });
      }

      if (!process.env.PRIVATE_KEY) {
        throw new Error("PRIVATE_KEY environment variable is not set");
      }

      // TODO: Implement alternative solution for attestation
      // The following code has been commented out as it relies on the removed EAS SDK
      /*
      const schemaEncoder = new SchemaEncoder("address[] addresses,uint256[] tokenIds,string[] eventNames");
      const encodedData = schemaEncoder.encodeData([
        { name: "addresses", value: poaps.map(() => address), type: "address[]" },
        { name: "tokenIds", value: poaps.map(poap => poap.token_id), type: "uint256[]" },
        { name: "eventNames", value: poaps.map(poap => poap.event.name), type: "string[]" },
      ]);

      const tx = await eas.attest({
        schema: schemaUID,
        data: {
          recipient: "0x0000000000000000000000000000000000000000",
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();

      console.log("New attestation UID:", newAttestationUID);

      res.status(200).json({ success: true, attestationUID: newAttestationUID });
      */

      // Temporary response until alternative solution is implemented
      res.status(200).json({ success: true, message: "Attestation functionality is currently unavailable" });
    } catch (error) {
      console.error('Error in mission-enrollment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

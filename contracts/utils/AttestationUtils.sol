// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import "@ethereum-attestation-service/eas-contracts/contracts/ISchemaRegistry.sol";
import "@ethereum-attestation-service/eas-contracts/contracts/Common.sol";

library AttestationUtils {
    struct EAS {
        IEAS eas;
        ISchemaRegistry schemaRegistry;
    }

    error InvalidSchema();
    error InvalidReceiver();
    error InvalidTokenId();
    // InvalidSignature error is imported from Common.sol

    function submitAttestation(
        EAS memory eas,
        bytes32 schema,
        address receiver,
        uint256 tokenId,
        bytes memory signature  // Changed from calldata to memory
    ) internal returns (bytes32) {
        if (schema == bytes32(0)) revert InvalidSchema();
        if (receiver == address(0)) revert InvalidReceiver();
        if (tokenId == 0) revert InvalidTokenId();
        if (signature.length == 0) revert InvalidSignature();

        AttestationRequest memory request = AttestationRequest({
            schema: schema,
            data: AttestationRequestData({
                recipient: receiver,
                expirationTime: 0,
                revocable: true,
                refUID: bytes32(0),
                data: signature, // signature already contains the encoded data from AttestationService
                value: 0
            })
        });

        return eas.eas.attest(request);
    }

    function createENSSchema(EAS memory eas) internal returns (bytes32) {
        string memory schema = "address userAddress,string ensName,uint256 registrationDate";
        return _registerSchema(eas, schema);
    }

    function createMissionEnrollmentSchema(EAS memory eas) internal returns (bytes32) {
        string memory schema = "address userAddress,string verifiedName,string proofMethod,string eventName,string eventType,string assignedRole,string missionName,uint256 timestamp,address attester,string proofProtocol";
        return _registerSchema(eas, schema);
    }

    function createPOAPSchema(EAS memory eas) internal returns (bytes32) {
        string memory schema = "address userAddress,uint256 poapTokenId,string eventName,uint256 eventDate";
        return _registerSchema(eas, schema);
    }

    function _registerSchema(EAS memory eas, string memory schema) private returns (bytes32) {
        return eas.schemaRegistry.register(schema, ISchemaResolver(address(0)), true);
    }
}

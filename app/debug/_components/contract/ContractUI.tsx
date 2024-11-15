"use client";

// @refresh reset
import { useReducer, useState } from "react";
import { ContractReadMethods } from "./ContractReadMethods";
import { ContractVariables } from "./ContractVariables";
import { ContractWriteMethods } from "./ContractWriteMethods";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useNetworkColor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import type { ContractName } from "~~/utils/scaffold-eth/contract";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useAccount } from 'wagmi';
import { JsonRpcProvider, Wallet } from 'ethers';
type ContractUIProps = {
  contractName: ContractName;
  className?: string;
};

const EAS_CONTRACT_ADDRESS = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e';
const SCHEMA_UID = '0x46a1e77e9f1d74c8c60c8d8bd8129947b3c5f4d3e6e9497ae2e4701dd8e2c401';
const BASE_SEPOLIA_CHAIN_ID = 84532;
const ATTESTATION_SCHEMA = "address userAddress,string verifiedName,bool poapVerified,uint256 timestamp";

/**
 * UI component to interface with deployed contracts.
 **/
export const ContractUI = ({ contractName, className = "" }: ContractUIProps): JSX.Element => {
  const [refreshDisplayVariables, triggerRefreshDisplayVariables] = useReducer(value => !value, false);
  const { targetNetwork } = useTargetNetwork();
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(contractName);
  const getNetworkColor = useNetworkColor();
  const { address } = useAccount();
  const [attestationStatus, setAttestationStatus] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [attestationHistory, setAttestationHistory] = useState<Array<{ uid: string; timestamp: number }>>([]);

  const createAttestation = async () => {
    if (!address) {
      setAttestationStatus('Wallet not connected');
      return;
    }

    if (targetNetwork.id !== BASE_SEPOLIA_CHAIN_ID) {
      setAttestationStatus('Please switch to Base Sepolia network');
      return;
    }

    try {
      setIsCreating(true);
      setAttestationStatus('Initializing attestation...');

      const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL);
      const wallet = new Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY || '', provider);
      const eas = new EAS(EAS_CONTRACT_ADDRESS);
      eas.connect(wallet);

      setAttestationStatus('Creating attestation data...');
      const schemaEncoder = new SchemaEncoder(ATTESTATION_SCHEMA);
      const encodedData = schemaEncoder.encodeData([
        { name: "userAddress", value: address, type: "address" },
        { name: "verifiedName", value: "MISSION_ENROLLMENT_DAQHRIS_ETH", type: "string" },
        { name: "poapVerified", value: true, type: "bool" },
        { name: "timestamp", value: Math.floor(Date.now() / 1000), type: "uint256" },
      ]);

      setAttestationStatus('Submitting attestation...');
      const tx = await eas.attest({
        schema: SCHEMA_UID,
        data: {
          recipient: address,
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();
      setAttestationHistory(prev => [...prev, {
        uid: newAttestationUID,
        timestamp: Math.floor(Date.now() / 1000)
      }]);
      setAttestationStatus(`Attestation created with UID: ${newAttestationUID}`);
    } catch (err) {
      console.error('Error creating attestation:', err);
      setAttestationStatus('Failed to create attestation. Please check console for details.');
    } finally {
      setIsCreating(false);
    }
  };

  if (deployedContractLoading) {
    return (
      <div className="mt-14">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!deployedContractData) {
    return (
      <p className="text-3xl mt-14">
        {`No contract found by the name of "${String(contractName)}" on chain "${String(targetNetwork.name)}"!`}
      </p>
    );
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-6 px-6 lg:px-10 lg:gap-12 w-full max-w-7xl my-0 ${className}`}>
      <div className="col-span-5 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="col-span-1 flex flex-col">
          <div className="bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6 space-y-1 py-4">
            <div className="flex">
              <div className="flex flex-col gap-1">
                <span className="font-bold">{String(contractName)}</span>
                <Address address={deployedContractData.address} />
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-sm">Balance:</span>
                  <Balance address={deployedContractData.address} className="px-0 h-1.5 min-h-[0.375rem]" />
                </div>
              </div>
            </div>
            {targetNetwork && (
              <p className="my-0 text-sm">
                <span className="font-bold">Network</span>:{" "}
                <span style={{ color: getNetworkColor() }}>{targetNetwork.name}</span>
              </p>
            )}
          </div>
          <div className="bg-base-300 rounded-3xl px-6 lg:px-8 py-4 shadow-lg shadow-base-300">
            <ContractVariables
              refreshDisplayVariables={refreshDisplayVariables}
              deployedContractData={deployedContractData}
            />
          </div>
          <div className="bg-base-300 rounded-3xl px-6 lg:px-8 py-4 mt-4 shadow-lg shadow-base-300">
            <h3 className="text-lg font-bold mb-4">Attestation Contract</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Network Status</h4>
                <div className={`alert ${targetNetwork.id === BASE_SEPOLIA_CHAIN_ID ? 'alert-success' : 'alert-warning'} mt-2`}>
                  {targetNetwork.id === BASE_SEPOLIA_CHAIN_ID ? (
                    <span>Connected to Base Sepolia ✓</span>
                  ) : (
                    <span>Please switch to Base Sepolia network</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Schema</h4>
                <pre className="text-sm bg-base-200 p-2 rounded overflow-x-auto">
                  {ATTESTATION_SCHEMA}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold">Contract Address</h4>
                <code className="text-sm bg-base-200 p-2 rounded block overflow-x-auto">
                  {EAS_CONTRACT_ADDRESS}
                </code>
              </div>
              <button
                className={`btn btn-primary w-full ${isCreating ? 'loading' : ''}`}
                onClick={createAttestation}
                disabled={isCreating || !address || targetNetwork.id !== BASE_SEPOLIA_CHAIN_ID}
              >
                {isCreating ? 'Creating Attestation...' : 'Create Attestation'}
              </button>
              {attestationStatus && (
                <div className={`alert ${attestationStatus.includes('Failed') ? 'alert-error' : 'alert-info'} mt-2`}>
                  <span>{attestationStatus}</span>
                </div>
              )}
            </div>
          </div>
          {attestationHistory.length > 0 && (
            <div className="bg-base-300 rounded-3xl px-6 lg:px-8 py-4 mt-4 shadow-lg shadow-base-300">
              <h3 className="text-lg font-bold mb-4">Attestation History</h3>
              <div className="space-y-2">
                {attestationHistory.map((attestation, index) => (
                  <div key={index} className="bg-base-200 p-2 rounded">
                    <p className="text-sm break-all">UID: {attestation.uid}</p>
                    <p className="text-sm">Time: {new Date(attestation.timestamp * 1000).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="z-10">
            <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col mt-10 relative">
              <div className="h-[5rem] w-[5.5rem] bg-base-300 absolute self-start rounded-[22px] -top-[38px] -left-[1px] -z-10 py-[0.65rem] shadow-lg shadow-base-300">
                <div className="flex items-center justify-center space-x-2">
                  <p className="my-0 text-sm">Read</p>
                </div>
              </div>
              <div className="p-5 divide-y divide-base-300">
                <ContractReadMethods deployedContractData={deployedContractData} />
              </div>
            </div>
          </div>
          <div className="z-10">
            <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col mt-10 relative">
              <div className="h-[5rem] w-[5.5rem] bg-base-300 absolute self-start rounded-[22px] -top-[38px] -left-[1px] -z-10 py-[0.65rem] shadow-lg shadow-base-300">
                <div className="flex items-center justify-center space-x-2">
                  <p className="my-0 text-sm">Write</p>
                </div>
              </div>
              <div className="p-5 divide-y divide-base-300">
                <ContractWriteMethods
                  deployedContractData={deployedContractData}
                  onChange={triggerRefreshDisplayVariables}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

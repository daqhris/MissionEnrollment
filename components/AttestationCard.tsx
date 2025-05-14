import React from "react";
import type { Attestation } from "../types/attestation";
import tw from "tailwind-styled-components";
import { SCHEMA_UID_ORIGINAL, SCHEMA_UID_ENHANCED } from "../utils/constants";
import { formatBaseName, getFieldLabel, formatTimestamp } from "../utils/formatting";

const Card = tw.div`
  mt-6
  rounded-lg
  overflow-hidden
  bg-red-50
  shadow-md
`;

const Header = tw.div`
  bg-blue-600
  px-4
  py-2
  flex
  items-center
  justify-between
`;

const Title = tw.h3`
  font-bold
  text-lg
  text-white
  mb-0
`;

const SchemaTag = tw.span`
  text-xs
  bg-white
  text-blue-800
  px-2
  py-1
  rounded-full
  font-semibold
`;

const Content = tw.div`
  p-4
  space-y-3
`;

const Section = tw.div`
  border-b
  border-red-200
  pb-3
  mb-3
  last:border-0
`;

const Label = tw.p`
  text-sm
  text-gray-600
  font-semibold
  mb-1
`;

const Value = tw.p`
  text-sm
  break-all
  bg-red-100
  p-2
  rounded
  text-gray-800
`;

const Link = tw.a`
  text-blue-600
  hover:text-blue-800
  transition-colors
  duration-300
  underline
  text-sm
`;

type Props = {
  attestation: Attestation;
};

export const AttestationCard: React.FC<Props> = ({ attestation }) => {
  const decodedData = attestation.decodedDataJson ? JSON.parse(attestation.decodedDataJson) : {};
  
  const isEnhancedSchema = attestation.schemaId === SCHEMA_UID_ENHANCED;
  
  return (
    <Card>
      <Header>
        <Title>Attestation</Title>
        <SchemaTag>
          {isEnhancedSchema ? "Enhanced Schema #1157" : "Original Schema #910"}
        </SchemaTag>
      </Header>
      <Content>
        <Section>
          <Label>Attestation ID:</Label>
          <Value>{attestation.id}</Value>
        </Section>
        
        <Section>
          <Label>Basic Information:</Label>
          <div className="space-y-2">
            <div>
              <Label>Attester:</Label>
              <Value>{attestation.attester}</Value>
            </div>
            <div>
              <Label>Recipient:</Label>
              <Value>{attestation.recipient}</Value>
            </div>
            <div>
              <Label>Created:</Label>
              <Value>{formatTimestamp(attestation.time * 1000)}</Value>
            </div>
          </div>
        </Section>
        
        {decodedData && Object.keys(decodedData).length > 0 && (
          <Section>
            <Label>Attestation Data:</Label>
            <div className="space-y-2">
              {Object.entries(decodedData).map(([key, value]) => {
                const formattedKey = key.toLowerCase();
                const label = getFieldLabel(formattedKey) || key;
                let displayValue = value;
                
                if (formattedKey === 'verifiedname') {
                  displayValue = formatBaseName(String(value));
                }
                
                return (
                  <div key={key}>
                    <Label>{label}:</Label>
                    <Value>
                      {typeof displayValue === 'object' 
                        ? JSON.stringify(displayValue) 
                        : String(displayValue)}
                    </Value>
                  </div>
                );
              })}
            </div>
          </Section>
        )}
        
        {isEnhancedSchema && decodedData.verificationSource && (
          <Section>
            <Label>Enhanced Verification:</Label>
            <div className="space-y-2">
              <div>
                <Label>Verification Source:</Label>
                <Value>{decodedData.verificationSource}</Value>
              </div>
              {decodedData.verificationTimestamp && (
                <div>
                  <Label>Verification Time:</Label>
                  <Value>{formatTimestamp(decodedData.verificationTimestamp)}</Value>
                </div>
              )}
              {decodedData.verificationHash && (
                <div>
                  <Label>Verification Hash:</Label>
                  <Value>{decodedData.verificationHash}</Value>
                </div>
              )}
            </div>
          </Section>
        )}
        
        <div>
          <Link
            href={`https://base-sepolia.easscan.org/attestation/view/${attestation.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on EAS Explorer
          </Link>
        </div>
      </Content>
    </Card>
  );
};

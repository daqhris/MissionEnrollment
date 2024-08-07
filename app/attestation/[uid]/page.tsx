"use client";

import React, { useEffect, useState } from "react";
import { Attestation } from "../../../types/attestation";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import Lottie from "lottie-react";
import tw from "tailwind-styled-components";
import { AttestationCard } from "~~/components/AttestationCard";
import skyAnimation from "~~/public/sky.json";

interface AttestationPageProps {
  params: { uid: string };
}

const Container = tw.div`
  min-h-screen 
  w-full 
  relative 
  overflow-hidden
`;

const AnimationWrapper = tw.div`
  absolute 
  inset-0 
  w-full 
  h-full
`;

const Overlay = tw.div`
  absolute 
  inset-0 
  bg-black 
  bg-opacity-50
`;

const ContentWrapper = tw.div`
  relative 
  z-10 
  min-h-screen 
  w-full 
  flex 
  justify-center 
  items-center 
  p-4
`;

const Card = tw.div`
  bg-gray-800 
  bg-opacity-95 
  rounded-2xl 
  shadow-2xl 
  p-8 
  w-11/12 
  max-w-md 
  backdrop-blur-sm
`;

const Title = tw.h2`
  text-3xl 
  font-extrabold 
  mb-6 
  text-center 
  text-white
`;

const TitleSpan = tw.span`
  text-indigo-400
`;

const StatementWrapper = tw.div`
  mb-6 
  p-4 
  bg-gray-700 
  rounded-lg 
  text-white
`;

const SectionTitle = tw.h3`
  font-bold 
  mb-2 
  text-xl 
  text-indigo-300
`;

const StatementText = tw.p`
  text-gray-300
`;

const Disclaimer = tw.p`
  text-xs 
  text-gray-400 
  mt-6 
  text-center
`;

const LoadingWrapper = tw.div`
  min-h-screen 
  w-full 
  flex 
  justify-center 
  items-center
`;

const LoadingText = tw.div`
  text-white 
  text-2xl
`;

export default function AttestationPage({ params }: AttestationPageProps) {
  const [attestation, setAttestation] = useState<Attestation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { uid } = params;

  useEffect(() => {
    async function fetchAttestation() {
      try {
        setIsLoading(true);
        const data = await fetchAttestationBasedOnUID(uid);
        if (data) {
          setAttestation(JSON.parse(data.data));
        } else {
          setError("Attestation not found");
        }
      } catch (err) {
        setError("Error fetching attestation");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAttestation();
  }, [uid]);

  if (isLoading) {
    return (
      <LoadingWrapper>
        <LoadingText>Loading...</LoadingText>
      </LoadingWrapper>
    );
  }

  if (error || !attestation) {
    return (
      <LoadingWrapper>
        <LoadingText>{error || "Attestation not found"}</LoadingText>
      </LoadingWrapper>
    );
  }

  const schemaEncoder = new SchemaEncoder("string requestedTextToVerify");
  const decoded = schemaEncoder.decodeData(attestation.data);

  return (
    <Container>
      <AnimationWrapper>
        <Lottie
          animationData={skyAnimation}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transform: "scale(3)",
          }}
        />
      </AnimationWrapper>
      <Overlay />
      <ContentWrapper>
        <Card>
          <Title>
            Attested <TitleSpan>Statement</TitleSpan>
          </Title>
          <div className="space-y-4">
            <StatementWrapper>
              <SectionTitle>Attested Statement:</SectionTitle>
              <StatementText>{decoded[0].value.value as string}</StatementText>
            </StatementWrapper>
          </div>

          <div className="mt-6">
            <AttestationCard attestation={attestation} />
          </div>

          <Disclaimer>
            *This is an example open-source repo using EAS.
            <br />
            Attestations are for demonstration purposes only.
          </Disclaimer>
        </Card>
      </ContentWrapper>
    </Container>
  );
}

async function fetchAttestationBasedOnUID(uid: string): Promise<Attestation | null> {
  const query = `
    query ExampleQuery($where: AttestationWhereUniqueInput!) {
      attestation(where: $where) {
        id
        data
        attester
        recipient
        refUID
        revocable
        revocationTime
        expirationTime
      }
    }
  `;

  const variables = {
    where: {
      id: uid,
    },
  };

  try {
    const response = await fetch("https://sepolia.easscan.org/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    if (!result.data || !result.data.attestation) {
      throw new Error("Attestation not found");
    }

    return result.data.attestation as Attestation;
  } catch (error) {
    console.error("Error fetching attestation:", error);
    throw error;
  }
}

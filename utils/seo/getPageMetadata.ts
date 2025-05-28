import { Metadata } from "next";
import { getMetadata } from "../scaffold-eth/getMetadata";

type PageType = 'home' | 'enrollments' | 'about' | 'charter' | 'attestation';

export const getPageMetadata = (pageType: PageType, params?: Record<string, string>): Metadata => {
  switch (pageType) {
    case 'home':
      return getMetadata({
        title: "Mission Enrollment | Gateway to the Zinneke Rescue Mission",
        description: "Join the Zinneke Rescue Mission by verifying your blockchain identity and event attendance. A collaborative project by human and AI creators.",
        path: "/"
      });
    
    case 'enrollments':
      return getMetadata({
        title: "Recent Enrollments | Mission Enrollment",
        description: "View recent attestations and enrollments for the Zinneke Rescue Mission on the Base blockchain.",
        path: "/enrollments"
      });
    
    case 'about':
      return getMetadata({
        title: "About | Mission Enrollment",
        description: "Learn about the Mission Enrollment project, its inception, and the collaborative human-AI team behind this blockchain application.",
        path: "/about"
      });
    
    case 'charter':
      return getMetadata({
        title: "Ethical Charter | Mission Enrollment",
        description: "Our ethical charter for human-AI collaboration, outlining principles for transparency, shared responsibility, and EU AI Act compliance.",
        path: "/charter"
      });
    
    case 'attestation':
      if (params?.id) {
        return getMetadata({
          title: `Attestation ${params.id.substring(0, 10)}... | Mission Enrollment`,
          description: `View details of attestation ${params.id.substring(0, 10)}... on the Base blockchain for the Zinneke Rescue Mission.`,
          path: `/attestation/${params.id}`
        });
      }
      return getMetadata({
        title: "Attestation Details | Mission Enrollment",
        description: "View attestation details on the Base blockchain for the Zinneke Rescue Mission.",
        path: "/attestation"
      });
    
    default:
      return getMetadata({
        title: "Mission Enrollment",
        description: "A decentralized application for managing mission enrollments and verifying attestations on Base blockchain",
        path: "/"
      });
  }
};

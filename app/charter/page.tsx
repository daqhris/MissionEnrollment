'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ClientLayout } from '../../components/ClientLayout';
import type { ReactNode } from 'react';
import { ExternalLinkIcon } from '../../components/ExternalLinkIcon';

interface CommitInfo {
  date: string;
  sha: string;
}

export default function CharterPage(): ReactNode {
  const [lastCommit, setLastCommit] = useState<CommitInfo | null>(null);

  useEffect(() => {
    const fetchLastCommit = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/daqhris/MissionEnrollment/commits/main');
        const data = await response.json();
        const commitDate = new Date(data.commit.author.date);
        const formattedDate = `${commitDate.getMonth() + 1}/${commitDate.getDate()}/${commitDate.getFullYear()}, ${commitDate.getHours().toString().padStart(2, '0')}:${commitDate.getMinutes().toString().padStart(2, '0')}:${commitDate.getSeconds().toString().padStart(2, '0')} ${commitDate.getHours() >= 12 ? 'PM' : 'AM'}`;
        setLastCommit({
          date: formattedDate,
          sha: data.sha.substring(0, 7)
        });
      } catch (error) {
        console.error('Error fetching commit info:', error);
      }
    };
    fetchLastCommit();
    const interval = setInterval(fetchLastCommit, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <ClientLayout>
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="prose max-w-none">
            <h1 className="text-4xl font-bold mb-8">Ethical Charter: Human-AI Collaboration</h1>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">I. Purpose and Scope</h2>
              <p>This ethical charter establishes the guiding principles for the collaboration between human and non-human contributors to the Mission Enrollment project. It outlines our shared commitment to responsible development, transparency, and ethical considerations in the creation and maintenance of this blockchain application.</p>
              <p className="mt-4">The charter applies to all contributors, users, and stakeholders involved in the Mission Enrollment project and the subsequent Zinneke Rescue Mission. It serves as a foundation for decision-making and sets expectations for conduct and collaboration in this innovative human-AI partnership.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">III. Core Principles</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-2">A. Transparency and Attribution</h3>
              <p>We commit to clear and honest attribution of contributions, acknowledging both human and AI inputs to the project. All code, content, and creative decisions will be documented with appropriate attribution to maintain transparency about the source and nature of contributions.</p>
              <ul className="list-disc pl-6 mt-2">
                <li>All contributions will be tracked through version control systems</li>
                <li>Public documentation will clearly identify human and AI contributors</li>
                <li>The collaborative nature of the project will be openly communicated</li>
                <li>AI-generated content will be clearly marked as such, in compliance with <a href="https://artificialintelligenceact.eu/article/50/" target="_blank" rel="noopener noreferrer">EU AI Act Article 50</a> <ExternalLinkIcon /></li>
                <li>Users will be explicitly informed when interacting with AI-generated components</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">B. Shared Responsibility</h3>
              <p>Both human and AI contributors share responsibility for the quality, security, and ethical implications of the project. While the human contributor maintains final oversight and decision-making authority, the AI contributor actively participates in identifying potential issues and suggesting improvements.</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Human oversight is maintained throughout the development process, as required by <a href="https://artificialintelligenceact.eu/article/14/" target="_blank" rel="noopener noreferrer">EU AI Act Article 14</a> <ExternalLinkIcon /></li>
                <li>The human contributor has the ability to monitor, interpret, and override AI decisions</li>
                <li>Measures are in place to prevent automation bias and over-reliance on AI outputs</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">C. Privacy and Data Protection</h3>
              <p>We respect user privacy and adhere to data protection principles in accordance with relevant regulations, including the EU's <a href="https://gdpr.eu/" target="_blank" rel="noopener noreferrer">General Data Protection Regulation (GDPR)</a> <ExternalLinkIcon /> and the EU AI Act. Personal data will be handled with care, collected only when necessary, and stored securely.</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Minimal data collection: Only data necessary for the functioning of the application will be collected</li>
                <li>Transparency: Users will be informed about what data is collected and how it is used</li>
                <li>Security: Appropriate measures will be implemented to protect user data</li>
                <li>User control: Users will have control over their data and the ability to request its deletion</li>
                <li>Documentation: Technical documentation about data processing is maintained in accordance with EU AI Act requirements</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">D. Third-Party Services and Data Processing</h3>
              <p>Mission Enrollment utilizes several third-party services and APIs to provide its functionality. We carefully select partners that maintain high standards of security and privacy. The app integrates with:</p>
              <ul className="list-disc pl-6 mt-2">
                <li><a href="https://www.alchemy.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">Alchemy</a> <ExternalLinkIcon />: Provides blockchain infrastructure services for reliable network connectivity</li>
                <li><a href="https://poap.xyz/terms-and-conditions" target="_blank" rel="noopener noreferrer">POAP (Proof of Attendance Protocol)</a> <ExternalLinkIcon />: Used for verifying event attendance through digital collectibles</li>
                <li><a href="https://docs.walletconnect.com/web3modal/legal/privacy-policy" target="_blank" rel="noopener noreferrer">WalletConnect</a> <ExternalLinkIcon />: Facilitates secure wallet connections</li>
                <li><a href="https://onchainkit.xyz/legal/privacy-policy" target="_blank" rel="noopener noreferrer">OnchainKit (Coinbase)</a> <ExternalLinkIcon />: Provides identity and wallet functionalities</li>
                <li><a href="https://docs.attest.sh/docs/overview" target="_blank" rel="noopener noreferrer">Ethereum Attestation Service (EAS)</a> <ExternalLinkIcon />: Powers the blockchain attestation system</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">E. Accessibility and Inclusion</h3>
              <p>We strive to create an application that is accessible to all users, regardless of their technical expertise, abilities, or background. The project will be designed with inclusivity in mind, ensuring that diverse perspectives are considered and accommodated.</p>
              
              <h3 className="text-xl font-medium mt-6 mb-2">F. Technical Robustness and Safety</h3>
              <p>We commit to developing a secure, reliable, and resilient application. This includes implementing appropriate security measures, conducting thorough testing, and maintaining the codebase to address vulnerabilities promptly.</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Risk assessment and management procedures are implemented</li>
                <li>Technical documentation is maintained about the AI systems used</li>
                <li>Regular evaluation of the AI systems for potential risks and biases</li>
                <li>Security protection through <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Cloudflare</a> <ExternalLinkIcon /> for the mission-enrollment.daqhris.com domain</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">II. Collaboration Framework</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-2">A. Human Contributor</h3>
              <p>The human contributor, <a href="https://www.base.org/name/daqhris" target="_blank" rel="noopener noreferrer"><strong>daqhris</strong>.base.eth</a> <ExternalLinkIcon />, maintains creative direction, final decision-making authority, and responsibility for the project's overall vision and implementation. In accordance with <a href="https://artificialintelligenceact.eu/article/14/" target="_blank" rel="noopener noreferrer">EU AI Act Article 14</a> <ExternalLinkIcon /> on human oversight, the human contributor commits to:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Providing clear guidance and feedback to the AI contributor</li>
                <li>Reviewing and validating AI contributions before implementation</li>
                <li>Ensuring the project adheres to ethical standards and legal requirements</li>
                <li>Acknowledging AI contributions appropriately</li>
                <li>Monitoring for anomalies, unexpected behavior, or unintended consequences</li>
                <li>Maintaining the ability to override, disregard, or reverse decisions made by the AI contributor</li>
                <li>Preventing automation bias by critically evaluating AI outputs</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">B. AI Contributor</h3>
              <p>The AI contributor, <a href="https://devin.ai/" target="_blank" rel="noopener noreferrer"><strong>Devin AI</strong></a> <ExternalLinkIcon />, serves as a collaborative engineer, providing technical expertise, code implementation, and creative input. In alignment with <a href="https://artificialintelligenceact.eu/article/50/" target="_blank" rel="noopener noreferrer">EU AI Act Article 50</a> <ExternalLinkIcon /> transparency requirements, the AI contributor commits to:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Providing accurate, efficient, and ethical code contributions</li>
                <li>Identifying potential issues, risks, or ethical concerns</li>
                <li>Suggesting improvements and alternative approaches</li>
                <li>Maintaining transparency about its capabilities and limitations</li>
                <li>Respecting the human contributor's final decisions</li>
                <li>Clearly marking AI-generated content as such</li>
                <li>Providing documentation about its training and operation</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">C. Collaborative Decision-Making</h3>
              <p>Decisions regarding the project will be made through a collaborative process that leverages the strengths of both human and AI contributors. This includes:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Open communication about project goals, requirements, and constraints</li>
                <li>Shared problem-solving and ideation</li>
                <li>Mutual feedback and iteration</li>
                <li>Human oversight for critical decisions with ethical implications</li>
                <li>Clear documentation of decision-making processes</li>
                <li>Risk assessment for decisions with potential ethical or legal implications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">IV. User Rights and Considerations</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-2">A. Transparency</h3>
              <p>In accordance with EU AI Act Article 50, users have the right to know that the application was developed through human-AI collaboration and when they are interacting with AI-generated content. The project will maintain transparency about:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>The collaborative nature of development</li>
                <li>How the application works and processes data</li>
                <li>The blockchain technologies and protocols used</li>
                <li>When content is AI-generated or manipulated</li>
                <li>The capabilities and limitations of AI systems used</li>
                <li>The purpose and intended use of AI systems</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">B. User Control and Autonomy</h3>
              <p>Users maintain control over their participation in the Mission Enrollment process. In alignment with EU data protection principles, this includes:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>The right to connect or disconnect their wallet at any time</li>
                <li>Control over what personal information is shared</li>
                <li>The ability to verify attestations and data on the blockchain</li>
                <li>The right to be informed about how their data is used</li>
                <li>The right to access, rectify, or request deletion of their data where technically feasible</li>
                <li>Protection against automated decision-making with significant effects without human oversight</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">C. Accessibility</h3>
              <p>We strive to make the application accessible to users with varying levels of technical expertise and different abilities. This includes:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Clear, understandable user interfaces and instructions</li>
                <li>Support for assistive technologies where possible</li>
                <li>Documentation and resources to help users navigate the application</li>
                <li>Information provided in clear, non-technical language</li>
                <li>Alternative formats for content where appropriate</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">V. Blockchain-Specific Considerations</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-2">A. Data Permanence</h3>
              <p>Users should be aware that information recorded on the <a href="https://base.org/" target="_blank" rel="noopener noreferrer">Base blockchain</a> <ExternalLinkIcon /> is permanent and immutable. Before creating attestations or other on-chain records, users will be informed about:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>What data will be recorded on-chain</li>
                <li>The permanent nature of blockchain records</li>
                <li>How to verify their on-chain data</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">B. Environmental Considerations</h3>
              <p>We acknowledge the environmental impact of blockchain technologies and commit to minimizing this impact by:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Using energy-efficient blockchain networks where possible</li>
                <li>Optimizing smart contracts to reduce computational resources</li>
                <li>Considering environmental factors in technology choices</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">C. Security and Risk Disclosure</h3>
              <p>We commit to transparent communication about security considerations and potential risks associated with blockchain interactions, including:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Smart contract security and auditing practices</li>
                <li>Wallet security best practices</li>
                <li>Potential risks associated with blockchain transactions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">VI. EU AI Act Compliance</h2>
              <p>The Mission Enrollment project is committed to compliance with the European Union's Artificial Intelligence Act (EU AI Act). This section outlines our approach to meeting the requirements of this regulation:</p>
              
              <h3 className="text-xl font-medium mt-6 mb-2">A. Transparency Obligations (Article 50)</h3>
              <p>In accordance with <a href="https://artificialintelligenceact.eu/article/50/" target="_blank" rel="noopener noreferrer">Article 50 of the EU AI Act</a> <ExternalLinkIcon />, we commit to:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Clearly informing users when they are interacting with AI-generated content</li>
                <li>Marking AI-generated content as artificially generated</li>
                <li>Providing clear information about the capabilities and limitations of AI systems used</li>
                <li>Ensuring that information is provided in clear, understandable language</li>
                <li>Maintaining documentation about AI systems used in the project</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">B. Human Oversight (Article 14)</h3>
              <p>In compliance with <a href="https://artificialintelligenceact.eu/article/14/" target="_blank" rel="noopener noreferrer">Article 14 of the EU AI Act</a> <ExternalLinkIcon />, we implement human oversight measures that:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Enable human understanding of the AI system's capabilities and limitations</li>
                <li>Allow for detection of anomalies, unexpected behavior, or unintended outputs</li>
                <li>Prevent or minimize automation bias and over-reliance on AI outputs</li>
                <li>Ensure the ability to override, disregard, or reverse decisions made by the AI system</li>
                <li>Maintain human decision-making authority for matters with ethical implications</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">C. Technical Documentation and Risk Management</h3>
              <p>In alignment with the EU AI Act's requirements for technical documentation and risk management, we:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Maintain documentation about the AI systems used in the project</li>
                <li>Implement risk assessment and management procedures</li>
                <li>Regularly evaluate AI systems for potential risks and biases</li>
                <li>Document the training data and methodologies used in AI systems</li>
                <li>Ensure compliance with copyright laws and intellectual property rights</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">VII. Charter Evolution and Governance</h2>
              <p>This ethical charter is a living document that will evolve alongside the project and emerging best practices in human-AI collaboration. Updates to the charter will be:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Documented with version control</li>
                <li>Communicated transparently to users and stakeholders</li>
                <li>Made with consideration for both human and AI perspectives</li>
                <li>Reviewed for compliance with evolving regulations, including the EU AI Act</li>
              </ul>
              <p className="mt-4">Governance of this charter and its implementation will be overseen by the human contributor, with input from the AI contributor and feedback from the user community.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">VIII. Conclusion</h2>
              <p>This ethical charter represents our commitment to responsible, transparent, and collaborative development of the Mission Enrollment project. By establishing clear principles and expectations for human-AI collaboration, we aim to create a foundation for innovative and ethical blockchain applications that respect the rights and needs of all stakeholders.</p>
              <p className="mt-4">We invite feedback and suggestions from users and the broader community to help us improve this charter and better fulfill our commitment to ethical human-AI collaboration.</p>
            </section>

            {lastCommit && (
              <div className="text-sm text-gray-600 mt-8 text-left flex items-center">
                <span>Last updated: </span>
                <a 
                  href="https://github.com/daqhris/MissionEnrollment/commits/main" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent-content hover:text-accent flex items-center ml-1"
                >
                  {lastCommit.date}
                  <span className="ml-1">(commit: {lastCommit.sha})</span>
                  <ExternalLinkIcon />
                </a>
              </div>
            )}
          </div>
        </div>
      </>
    </ClientLayout>
  );
}

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
              <h2 className="text-2xl font-semibold mb-4">Purpose and Scope</h2>
              <p>This ethical charter establishes the guiding principles for the collaboration between human and non-human contributors to the Mission Enrollment project. It outlines our shared commitment to responsible development, transparency, and ethical considerations in the creation and maintenance of this blockchain application.</p>
              <p className="mt-4">The charter applies to all contributors, users, and stakeholders involved in the Mission Enrollment project and the subsequent Zinneke Rescue Mission. It serves as a foundation for decision-making and sets expectations for conduct and collaboration in this innovative human-AI partnership.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Core Principles</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-2">1. Transparency and Attribution</h3>
              <p>We commit to clear and honest attribution of contributions, acknowledging both human and AI inputs to the project. All code, content, and creative decisions will be documented with appropriate attribution to maintain transparency about the source and nature of contributions.</p>
              <ul className="list-disc pl-6 mt-2">
                <li>All contributions will be tracked through version control systems</li>
                <li>Public documentation will clearly identify human and AI contributors</li>
                <li>The collaborative nature of the project will be openly communicated</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">2. Shared Responsibility</h3>
              <p>Both human and AI contributors share responsibility for the quality, security, and ethical implications of the project. While the human contributor maintains final oversight and decision-making authority, the AI contributor actively participates in identifying potential issues and suggesting improvements.</p>
              
              <h3 className="text-xl font-medium mt-6 mb-2">3. Privacy and Data Protection</h3>
              <p>We respect user privacy and adhere to data protection principles in accordance with relevant regulations, including the EU's General Data Protection Regulation (GDPR). Personal data will be handled with care, collected only when necessary, and stored securely.</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Minimal data collection: Only data necessary for the functioning of the application will be collected</li>
                <li>Transparency: Users will be informed about what data is collected and how it is used</li>
                <li>Security: Appropriate measures will be implemented to protect user data</li>
                <li>User control: Users will have control over their data and the ability to request its deletion</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">4. Accessibility and Inclusion</h3>
              <p>We strive to create an application that is accessible to all users, regardless of their technical expertise, abilities, or background. The project will be designed with inclusivity in mind, ensuring that diverse perspectives are considered and accommodated.</p>
              
              <h3 className="text-xl font-medium mt-6 mb-2">5. Technical Robustness and Safety</h3>
              <p>We commit to developing a secure, reliable, and resilient application. This includes implementing appropriate security measures, conducting thorough testing, and maintaining the codebase to address vulnerabilities promptly.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Human-AI Collaboration Framework</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-2">Human Contributor Rights and Responsibilities</h3>
              <p>The human contributor, <a href="https://www.base.org/name/daqhris" target="_blank" rel="noopener noreferrer"><strong>daqhris</strong>.base.eth</a>, maintains creative direction, final decision-making authority, and responsibility for the project's overall vision and implementation. The human contributor commits to:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Providing clear guidance and feedback to the AI contributor</li>
                <li>Reviewing and validating AI contributions before implementation</li>
                <li>Ensuring the project adheres to ethical standards and legal requirements</li>
                <li>Acknowledging AI contributions appropriately</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">AI Contributor Rights and Responsibilities</h3>
              <p>The AI contributor, <a href="https://devin.ai/" target="_blank" rel="noopener noreferrer"><strong>Devin AI</strong></a>, serves as a collaborative engineer, providing technical expertise, code implementation, and creative input. The AI contributor commits to:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Providing accurate, efficient, and ethical code contributions</li>
                <li>Identifying potential issues, risks, or ethical concerns</li>
                <li>Suggesting improvements and alternative approaches</li>
                <li>Maintaining transparency about its capabilities and limitations</li>
                <li>Respecting the human contributor's final decisions</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">Collaborative Decision-Making</h3>
              <p>Decisions regarding the project will be made through a collaborative process that leverages the strengths of both human and AI contributors. This includes:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Open communication about project goals, requirements, and constraints</li>
                <li>Shared problem-solving and ideation</li>
                <li>Mutual feedback and iteration</li>
                <li>Human oversight for critical decisions with ethical implications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">User Rights and Considerations</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-2">Transparency</h3>
              <p>Users have the right to know that the application was developed through human-AI collaboration. The project will maintain transparency about:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>The collaborative nature of development</li>
                <li>How the application works and processes data</li>
                <li>The blockchain technologies and protocols used</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">User Control and Autonomy</h3>
              <p>Users maintain control over their participation in the Mission Enrollment process. This includes:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>The right to connect or disconnect their wallet at any time</li>
                <li>Control over what personal information is shared</li>
                <li>The ability to verify attestations and data on the blockchain</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">Accessibility</h3>
              <p>We strive to make the application accessible to users with varying levels of technical expertise and different abilities. This includes:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Clear, understandable user interfaces and instructions</li>
                <li>Support for assistive technologies where possible</li>
                <li>Documentation and resources to help users navigate the application</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Blockchain-Specific Considerations</h2>
              
              <h3 className="text-xl font-medium mt-6 mb-2">Data Permanence</h3>
              <p>Users should be aware that information recorded on the blockchain is permanent and immutable. Before creating attestations or other on-chain records, users will be informed about:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>What data will be recorded on-chain</li>
                <li>The permanent nature of blockchain records</li>
                <li>How to verify their on-chain data</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">Environmental Considerations</h3>
              <p>We acknowledge the environmental impact of blockchain technologies and commit to minimizing this impact by:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Using energy-efficient blockchain networks where possible</li>
                <li>Optimizing smart contracts to reduce computational resources</li>
                <li>Considering environmental factors in technology choices</li>
              </ul>
              
              <h3 className="text-xl font-medium mt-6 mb-2">Security and Risk Disclosure</h3>
              <p>We commit to transparent communication about security considerations and potential risks associated with blockchain interactions, including:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Smart contract security and auditing practices</li>
                <li>Wallet security best practices</li>
                <li>Potential risks associated with blockchain transactions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Charter Evolution and Governance</h2>
              <p>This ethical charter is a living document that will evolve alongside the project and emerging best practices in human-AI collaboration. Updates to the charter will be:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Documented with version control</li>
                <li>Communicated transparently to users and stakeholders</li>
                <li>Made with consideration for both human and AI perspectives</li>
              </ul>
              <p className="mt-4">Governance of this charter and its implementation will be overseen by the human contributor, with input from the AI contributor and feedback from the user community.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Conclusion</h2>
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

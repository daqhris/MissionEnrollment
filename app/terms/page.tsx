'use client';

import { useEffect, useState } from 'react';
import { ClientLayout } from '../../components/ClientLayout';
import { ExternalLinkIcon } from '../../components/ExternalLinkIcon';


interface CommitInfo {
  date: string;
  sha: string;
}

export default function TermsPage() {
  const [lastCommit, setLastCommit] = useState<CommitInfo | null>(null);

  useEffect(() => {
    const fetchLastCommit = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/daqhris/MissionEnrollment/commits/main');
        const data = await response.json();
        const commitDate = new Date(data.commit.author.date);
        setLastCommit({
          date: commitDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
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

  const content = (
    <div className="container mx-auto px-4 py-8">
      <div className="prose max-w-none bg-amber-200 p-8 md:px-16 rounded">
        <h1 className="text-4xl bg-amber-100 font-bold mb-8 p-4 rounded border-2 text-amber-700 border-amber-700">Terms of Service</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">1. Introduction</h2>
          <p className="text-gray-900">Welcome to Mission Enrollment. These Terms of Service (&quot;Terms&quot;) govern your use of the Mission Enrollment application (&quot;App&quot;) operated by <a href="https://www.base.org/name/daqhris" target="_blank" rel="noopener noreferrer">daqhris.base.eth</a><ExternalLinkIcon /> and <a href="https://devin.ai/" target="_blank" rel="noopener noreferrer">Devin AI</a><ExternalLinkIcon /> (collectively, &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By accessing or using the App, you agree to be bound by these Terms.</p>
          
          <p className="mt-4 text-gray-900">Please read these Terms carefully before using the App. If you do not agree to these Terms, you must not access or use the App.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">2. Service Description</h2>
          <p className="text-gray-900">Mission Enrollment is a decentralized enrollment gateway for the Zinneke Rescue Mission, enabling blockchain event attendees to create verified attestations and join collaborative artistic missions on Base. The App provides identity verification, event attendance confirmation, and blockchain attestation services.</p>
          
          <p className="mt-4 text-gray-900">The App interacts with various blockchain protocols including Basenames (ENS), Proof of Attendance Protocol (POAP), and Ethereum Attestation Service (EAS) on the Base and Base Sepolia blockchains.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">3. User Responsibilities</h2>
          <p className="text-gray-900">By using the App, you agree to:</p>
          <ul className="list-disc pl-6 text-gray-900">
            <li>Provide accurate and truthful information during the enrollment process</li>
            <li>Maintain control and security of your blockchain wallet and credentials</li>
            <li>Use the App only for its intended purposes</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Not attempt to manipulate, disrupt, or abuse the App or its connected blockchain services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">4. Blockchain-Specific Terms</h2>
          <p className="text-gray-900">You acknowledge and agree that:</p>
          <ul className="list-disc pl-6 text-gray-900">
            <li>Blockchain transactions are irreversible and we cannot undo or modify attestations once created</li>
            <li>You are responsible for all transaction fees (gas fees) required to interact with blockchain services</li>
            <li>Blockchain networks may experience delays, congestion, or technical issues beyond our control</li>
            <li>Your wallet address and attestation data will be publicly visible on the blockchain</li>
            <li>The App requires connection to a compatible Ethereum wallet</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">5. Intellectual Property Rights</h2>
          <p className="text-gray-900">The App and its original content, features, and functionality are owned by the project creators and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
          
          <p className="mt-4 text-gray-900">The App&apos;s source code is available under the license specified in the <a href="https://github.com/daqhris/MissionEnrollment" target="_blank" rel="noopener noreferrer">GitHub repository</a><ExternalLinkIcon />. Any use of the App or its content other than as specifically authorized herein is strictly prohibited.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">6. Disclaimers and Limitation of Liability</h2>
          <p className="text-gray-900">The App is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without any warranties of any kind. We do not guarantee that the App will be uninterrupted, secure, or error-free.</p>
          
          <p className="mt-4 text-gray-900">To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses, resulting from:</p>
          <ul className="list-disc pl-6 text-gray-900">
            <li>Your use or inability to use the App</li>
            <li>Any blockchain transaction or smart contract interaction</li>
            <li>Unauthorized access to or alteration of your data</li>
            <li>Statements or conduct of any third party on the App</li>
            <li>Any other matter relating to the App</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">7. Governing Law and Dispute Resolution</h2>
          <p className="text-gray-900">These Terms shall be governed by and construed in accordance with the laws of Belgium, without regard to its conflict of law provisions.</p>
          
          <p className="mt-4 text-gray-900">Any dispute arising from or relating to these Terms or your use of the App shall first be attempted to be resolved through friendly negotiation. If the dispute cannot be resolved through negotiation, it shall be submitted to mediation in accordance with the laws of Belgium.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">8. Changes to Terms</h2>
          <p className="text-gray-900">We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
          
          <p className="mt-4 text-gray-900">By continuing to access or use the App after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the App.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">9. Contact Us</h2>
          <p className="text-gray-900">If you have any questions about these Terms, please contact us via <a href="https://github.com/daqhris/MissionEnrollment/issues" target="_blank" rel="noopener noreferrer">GitHub Issues</a><ExternalLinkIcon />.</p>
        </section>

        {lastCommit && (
          <div className="text-sm text-gray-900 mt-8 text-left flex items-center">
            <span>Last updated: </span>
            <a
              href="https://github.com/daqhris/MissionEnrollment/commits/main"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-content hover:text-accent flex items-center ml-1"
            >
              <code className="bg-white text-[rgb(52,40,40)] px-1 py-0.5 rounded">{lastCommit.date}</code>
              <ExternalLinkIcon />
            </a>
          </div>
        )}
      </div>
    </div>
  );

  return <ClientLayout>{content}</ClientLayout>;
}

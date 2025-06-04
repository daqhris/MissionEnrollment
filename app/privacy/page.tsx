'use client';

import { useEffect, useState } from 'react';
import { ClientLayout } from '../../components/ClientLayout';
import { ExternalLinkIcon } from '../../components/ExternalLinkIcon';


interface CommitInfo {
  date: string;
  sha: string;
}

export default function PrivacyPage() {
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
        <h1 className="text-4xl bg-amber-100 font-bold mb-8 p-4 rounded border-2 text-amber-700 border-amber-700">Privacy Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">1. Introduction</h2>
          <p className="text-gray-900">This Privacy Policy describes how Mission Enrollment (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and shares your information when you use our decentralized application (&quot;App&quot;). We respect your privacy and are committed to protecting your personal data.</p>
          
          <p className="mt-4 text-gray-900">Please read this Privacy Policy carefully to understand our practices regarding your data. By using the App, you acknowledge that you have read and understood this Privacy Policy.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">2. Information We Collect</h2>
          <p className="text-gray-900">We collect and process the following types of information:</p>
          
          <h3 className="text-xl font-semibold mt-4 mb-2 text-amber-700">2.1 Blockchain Data</h3>
          <ul className="list-disc pl-6 text-gray-900">
            <li>Wallet addresses that interact with the App</li>
            <li>Basenames (ENS) associated with your wallet</li>
            <li>Blockchain attestations created through the App</li>
            <li>Transaction data related to your interactions with the App</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-4 mb-2 text-amber-700">2.2 POAP Verification Data</h3>
          <ul className="list-disc pl-6 text-gray-900">
            <li>POAP token IDs and metadata associated with your wallet</li>
            <li>Event attendance information verified through POAP</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-4 mb-2 text-amber-700">2.3 Technical Information</h3>
          <ul className="list-disc pl-6 text-gray-900">
            <li>Browser and device information</li>
            <li>IP address (not stored)</li>
            <li>Usage data and interaction patterns</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-4 mb-2 text-amber-700">2.4 GitHub API Data</h3>
          <ul className="list-disc pl-6 text-gray-900">
            <li>Public repository commit information</li>
            <li>Timestamps of code updates</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">3. How We Use Your Information</h2>
          <p className="text-gray-900">We use the collected information for the following purposes:</p>
          <ul className="list-disc pl-6 text-gray-900">
            <li>To provide and maintain the App&apos;s functionality</li>
            <li>To verify your identity through Basenames (ENS)</li>
            <li>To confirm your attendance at blockchain events through POAP verification</li>
            <li>To create and manage blockchain attestations</li>
            <li>To improve and optimize the App</li>
            <li>To display commit timestamps for transparency</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">4. Data Storage and Blockchain Considerations</h2>
          <p className="text-gray-900">It&apos;s important to understand that:</p>
          <ul className="list-disc pl-6 text-gray-900">
            <li>Blockchain data, including wallet addresses and attestations, is publicly visible and immutable</li>
            <li>We do not store your private keys or seed phrases</li>
            <li>The App operates on a decentralized infrastructure where possible</li>
            <li>We do not use cookies or tracking technologies beyond essential functionality</li>
          </ul>
          
          <p className="mt-4 text-gray-900">While we implement reasonable security measures, the inherently public nature of blockchain technology means that your on-chain interactions are visible to others.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">5. Third-Party Integrations</h2>
          <p className="text-gray-900">The App integrates with several third-party services:</p>
          <ul className="list-disc pl-6 text-gray-900">
            <li><strong>Alchemy:</strong> For blockchain API access</li>
            <li><strong>POAP API:</strong> For verifying event attendance</li>
            <li><strong>GitHub API:</strong> For retrieving commit information</li>
            <li><strong>Ethereum Attestation Service (EAS):</strong> For creating attestations</li>
            <li><strong>Basenames/ENS:</strong> For resolving blockchain identities</li>
          </ul>
          
          <p className="mt-4 text-gray-900">Each of these services has its own privacy policy and terms of service. We encourage you to review their policies to understand how they process your data.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">6. Your Rights</h2>
          <p className="text-gray-900">Depending on your location, you may have certain rights regarding your personal data, including:</p>
          <ul className="list-disc pl-6 text-gray-900">
            <li>The right to access information we hold about you</li>
            <li>The right to request correction of inaccurate data</li>
            <li>The right to request deletion of your data (where applicable)</li>
            <li>The right to object to processing of your data</li>
            <li>The right to data portability</li>
          </ul>
          
          <p className="mt-4 text-gray-900">Please note that due to the nature of blockchain technology, we may not be able to modify or delete on-chain data, as blockchain records are immutable.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">7. GDPR Compliance</h2>
          <p className="text-gray-900">For users in the European Economic Area (EEA), we comply with the <a href="https://gdpr.eu/what-is-gdpr/" target="_blank" rel="noopener noreferrer">General Data Protection Regulation (GDPR)</a><ExternalLinkIcon />. Our legal basis for processing your data includes:</p>
          <ul className="list-disc pl-6 text-gray-900">
            <li>Performance of a contract when providing the App&apos;s services</li>
            <li>Your consent, which you provide by using the App</li>
            <li>Legitimate interests in operating and improving the App</li>
          </ul>
          
          <p className="mt-4 text-gray-900">If you have questions about our GDPR compliance or wish to exercise your rights, please contact us through the channels listed in Section 10.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">8. Data Retention</h2>
          <p className="text-gray-900">We retain your data for as long as necessary to provide the App&apos;s services and fulfill the purposes outlined in this Privacy Policy. Please note that blockchain data, including attestations, is permanently stored on the blockchain and cannot be deleted.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">9. Changes to This Privacy Policy</h2>
          <p className="text-gray-900">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.</p>
          
          <p className="mt-4 text-gray-900">We encourage you to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">10. Contact Us</h2>
          <p className="text-gray-900">If you have any questions about this Privacy Policy or our data practices, please contact us via <a href="https://github.com/daqhris/MissionEnrollment/issues" target="_blank" rel="noopener noreferrer">GitHub Issues</a><ExternalLinkIcon />.</p>
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

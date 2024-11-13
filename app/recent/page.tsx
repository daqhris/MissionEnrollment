'use client';

import React from 'react';
import { RecentAttestationsView } from '../../components/RecentAttestationsView';

export default function RecentAttestationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recent Attestations</h1>
      <RecentAttestationsView title="Recent Attestations" pageSize={20} />
    </div>
  );
}

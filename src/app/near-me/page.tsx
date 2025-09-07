import React, { Suspense } from 'react';
import { NearMeClient } from './NearMeClient';

export default function NearMePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading map...</div>}>
      <NearMeClient />
    </Suspense>
  );
}
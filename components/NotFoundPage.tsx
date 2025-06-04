'use client';

import Link from 'next/link';


export const NotFoundPage = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">
          Page not found
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-focus text-primary-content transition-colors duration-200"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

'use client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
 
export default function Error({ error}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleRedirect = () => {
    redirect('/dashboard/invoices');
  };

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <h3 className='text-center'>We are Working On it..</h3>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={handleRedirect}
      >
        Try again
      </button>
    </main>
  );
}
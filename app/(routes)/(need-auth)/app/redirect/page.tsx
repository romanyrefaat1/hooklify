// This is a page to redirect the user to their last active website dashboard

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const lastActiveWebsiteId = localStorage.getItem('last-active-website-id');
    if (lastActiveWebsiteId) {
      router.replace(`/app/${lastActiveWebsiteId}`);
    } else {
      router.replace('/app');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <h1>Redirecting...</h1>
    </div>
  );
}
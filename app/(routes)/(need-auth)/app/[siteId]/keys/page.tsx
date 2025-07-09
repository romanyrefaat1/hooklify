import Link from 'next/link';
import { cookies } from 'next/headers';
import Content from './_components/Content';
import LoadingSpinner from '@/components/loading-spinner';

export default async function APIKeysPage({ params }) {
  const siteId = params.siteId;
  const cookiesV = await cookies();

  let apiKeys = null;
  let error = null;

  try {
    // ✅ In Next.js Server Components, you must use an **absolute URL** for fetch on the server
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/sites/keys?siteId=${siteId}`, {
      headers: {
        Cookie: cookiesV.toString(),
      },
      cache: 'no-store',
    });

    if (res.ok) {
      apiKeys = await res.json();
    } else {
      error = 'Failed to fetch API keys: ' + res.status;
    }
  } catch (err) {
    error = 'Error fetching API keys: ' + err.message;
  }

  if (!apiKeys) {
    return <LoadingSpinner message={error || 'Loading API keys...'} />;
  }

  const pathname = `/app/${siteId}/keys`;

  return (
    <div className="min-h-screen fade-in my-container w-full">
      <div className="w-full mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">API Keys</h1>
              <p className="text-gray-600">
                Manage your site API keys for authentication.
                <Link
                  href={pathname.replace(/\/[^/]+$/, '/docs')}
                  className="text-orange-500 hover:text-orange-600 ml-1"
                >
                  Documentation
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Content fetchedApiKeys={apiKeys} />
    </div>
  );
}
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useUser } from '@/contexts/AuthContext';

export default function CreateSitePage() {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useUser();

  const handleCreate = async () => {
    if (!user) {
      alert('Please log in to create a site');
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('sites')
        .insert([
          {
            name: "App Name",
            site_url: url,
            user_id: user.id,
            api_key: crypto.randomUUID() // Remove the 'site_' prefix
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        alert(`Error creating site: ${error.message}`);
        return;
      }
      
      setApiKey(data.api_key);
      alert('Site created successfully!');
      
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return <div className="p-4">Please log in to create a site.</div>;
  }
   return( <div className="p-4">
      <div className="mb-4">
        <input 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="Site URL (e.g., https://example.com)" 
          className="border p-2 w-full max-w-md" 
          type="url"
        />
      </div>
      
      <button 
        onClick={handleCreate} 
        disabled={loading || !url.trim()}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Creating...' : 'Create Site'}
      </button>
      
      {apiKey && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800">
            Your API Key: <code className="bg-green-100 px-2 py-1 rounded">site_{apiKey}</code>
          </p>
        </div>
      )}
    </div>
  );
}
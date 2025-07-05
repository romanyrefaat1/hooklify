'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useUser } from '@/contexts/AuthContext';

export default function CreateWidgetPage() {
  const [type] = useState('Toast');
  const [siteUrl, setSiteUrl] = useState('https://www.floopr.app');
  const [siteId, setSiteId] = useState('70e5fffc-ed8b-456a-b81a-692290908e31');
  const [name, setName] = useState('Floopr');
  const [description, setDescription] = useState('toast for floopr');
  const [apiKey] = useState(crypto.randomUUID());
  const [createdKey, setCreatedKey] = useState('');
  const [style, setStyle] = useState({
    border: '1px solid #ccc',
    borderRadius: '8px',
    background: '#ffffff',
    color: '#000000',
    padding: '12px',
    margin: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease-in-out',
    maxWidth: '400px',
    textAlign: 'center',
    display: 'block'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user, loading: authLoading } = useUser();

  const handleCreate = async () => {
    if (!user) {
      alert('Please log in to create a widget');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase.from('widgets').insert([
        {
          type,
          site_url: siteUrl,
          site_id: siteId,
          name,
          description,
          style,
          api_key: apiKey
        }
      ]);

      if (error) {
        console.error('Database error:', error);
        alert(`Error creating widget: ${error.message}`);
        return;
      }

      setSuccess(true);
      setCreatedKey('widget_' + apiKey);
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
    return <div className="p-4">Please log in to create a widget.</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create New Widget</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Widget Type</label>
        <input
          type="radio"
          name="type"
          value="Toast"
          checked
          readOnly
          className="mr-2"
        />
        Toast
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Site URL</label>
        <input
          type="url"
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Site ID</label>
        <input
          type="text"
          value={siteId}
          onChange={(e) => setSiteId(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Style (JSON)</label>
        <textarea
          value={JSON.stringify(style, null, 2)}
          onChange={(e) => {
            try {
              setStyle(JSON.parse(e.target.value));
            } catch (err) {
              // Ignore invalid JSON
            }
          }}
          className="border p-2 w-full font-mono h-48"
        />
      </div>

      <button
        onClick={handleCreate}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Creating...' : 'Create Widget'}
      </button>

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800">Widget created successfully!</p>
          <p className="text-green-800 mt-2">
            Your API Key: <code className="bg-green-100 px-2 py-1 rounded">{createdKey}</code>
          </p>
        </div>
      )}
    </div>
  );
}
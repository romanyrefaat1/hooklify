"use client";

import React, { useState, useEffect } from 'react';
import { RotateCcw, Plus, Copy, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const APIKeysPage = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [newKeyName, setNewKeyName] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sites/keys?siteId=' + pathname.split('/')[2]);
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data);
      } else {
        console.error('Failed to fetch API keys');
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const regenerateKey = async (id) => {
    try {
      const response = await fetch('/api/sites/keys/regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        const data = await response.json();
        setNewApiKey(data.apiKey);
        setShowApiKeyModal(true);
        setApiKeys(prev => prev.map(key =>
          key.id === id ? {
            ...key,
            created: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }),
            lastUsed: 'Never'
          } : key
        ));
      } else {
        console.error('Failed to regenerate API key');
        alert('Failed to regenerate API key. Please try again.');
      }
    } catch (error) {
      console.error('Error regenerating API key:', error);
      alert('Error regenerating API key. Please try again.');
    }
  };

  const closeApiKeyModal = () => {
    setShowApiKeyModal(false);
    setNewApiKey('');
  };

  if (loading) {
    return (
      <div className="min-h-screen fade-in container flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading API keys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen fade-in container">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">API Keys</h1>
              <p className="text-gray-600">Manage your site API keys for authentication.
                <Link href={pathname.replace(/\/[^/]+$/, '/docs')} className="text-orange-500 hover:text-orange-600"> Documentation</Link></p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <span className="text-sm text-gray-500">Total: {apiKeys.length}</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm w-full text-center">Site Name</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm w-full text-center">API Key</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm w-full text-center">Site URL</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm w-full text-center">Created</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm w-full text-center">Last Used</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm w-full text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {apiKeys.map((site) => (
                  <tr key={site.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-center">
                      <div className="font-medium text-gray-900">{site.name || 'Unnamed Site'}</div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                          {site.api_key}
                        </code>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 items-center w-full text-center">{site.site_url}</td>
                    <td className="py-4 px-6 text-gray-600 items-center w-full text-center">{site.created}</td>
                    <td className="py-4 px-6 text-gray-600 items-center w-full text-center">{site.lastUsed || 'Never'}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => regenerateKey(site.id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Regenerate API key"
                        >
                          <RotateCcw size={16} className="text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <span className="px-3 py-1 bg-orange-500 text-white rounded">1</span>
            <button className="px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>

      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">New API Key Generated</h3>
              <button onClick={closeApiKeyModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="mb-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="font-medium text-yellow-800">Important!</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Please save this API key somewhere safe. You won't be able to see it again after closing this modal.
                </p>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your New API Key
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-800 break-all">
                  site_{newApiKey}
                </code>
                <button onClick={() => copyToClipboard(`site_${newApiKey}`)} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Copy API key">
                  <Copy size={16} className="text-gray-500" />
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={closeApiKeyModal} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                I've Saved It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIKeysPage;
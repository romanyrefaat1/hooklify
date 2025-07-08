"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, RotateCcw, Plus, Copy, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const APIKeysPage = () => {
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: 'Production API Key',
      key: 'hk_live_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      created: '06 Jul 25',
      expires: '06 Jul 26',
      visible: false,
      lastUsed: '2 hours ago'
    },
    {
      id: 2,
      name: 'Development API Key',
      key: 'hk_test_abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      created: '05 Jul 25',
      expires: '05 Jul 26',
      visible: false,
      lastUsed: '1 day ago'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const pathname = usePathname();

  const toggleKeyVisibility = (id) => {
    setApiKeys(prev => prev.map(key => 
      key.id === id ? { ...key, visible: !key.visible } : key
    ));
  };

  const regenerateKey = (id) => {
    const newKey = `hk_${Math.random() > 0.5 ? 'live' : 'test'}_${Math.random().toString(36).substr(2, 64)}`;
    setApiKeys(prev => prev.map(key => 
      key.id === id ? { ...key, key: newKey, created: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) } : key
    ));
  };

  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key);
    // You could add a toast notification here
  };

  const deleteKey = (id) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
  };

  const createNewKey = () => {
    if (!newKeyName.trim()) return;
    
    const newKey = {
      id: Date.now(),
      name: newKeyName,
      key: `hk_test_${Math.random().toString(36).substr(2, 64)}`,
      created: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }),
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }),
      visible: false,
      lastUsed: 'Never'
    };
    
    setApiKeys(prev => [...prev, newKey]);
    setNewKeyName('');
    setShowCreateModal(false);
  };

  const maskKey = (key) => {
    if (key.length <= 12) return key;
    return key.substring(0, 12) + '•'.repeat(key.length - 16) + key.substring(key.length - 4);
  };

  return (
    <div className="min-h-screen fade-in container">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">API Keys</h1>
              <p className="text-gray-600">Create a new API key to authenticate your app. 
                <Link href={pathname.replace(/\/[^/]+$/, '/docs')} className="text-orange-500 hover:text-orange-600">Documentation</Link></p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add API key
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <span className="text-sm text-gray-500">Total: {apiKeys.length}</span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Name</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">API Key</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Created</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Expires At</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Last Used</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {apiKeys.map((apiKey) => (
                  <tr key={apiKey.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{apiKey.name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                          {apiKey.visible ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title={apiKey.visible ? 'Hide API key' : 'Show API key'}
                        >
                          {apiKey.visible ? <EyeOff size={16} className="text-gray-500" /> : <Eye size={16} className="text-gray-500" />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Copy API key"
                        >
                          <Copy size={16} className="text-gray-500" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{apiKey.created}</td>
                    <td className="py-4 px-6 text-gray-600">{apiKey.expires}</td>
                    <td className="py-4 px-6 text-gray-600">{apiKey.lastUsed}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => regenerateKey(apiKey.id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Regenerate API key"
                        >
                          <RotateCcw size={16} className="text-gray-500" />
                        </button>
                        <button
                          onClick={() => deleteKey(apiKey.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                          title="Delete API key"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
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

      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New API Key</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key Name
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter API key name"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createNewKey}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                Create API Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIKeysPage;
"use client"
import { useState } from "react";
import ApiKeysTable from "./ApiIKeysTable";
import ApiKeyModal from "./ApiKeyModal";
import Pagination from "./Pagination";
import { toast } from "sonner";

export default function Content ({fetchedApiKeys }: { fetchedApiKeys: any }) {
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [newApiKey, setNewApiKey] = useState('');
    const [apiKeys, setApiKeys] = useState(fetchedApiKeys || []);

    const regenerateKey = async (id: string) => {
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
            toast.error('Failed to regenerate API key');
          }
        } catch (error) {
          console.error('Error regenerating API key:', error);
          toast.error('Error regenerating API key');
        }
      };

      const closeApiKeyModal = () => {
        setShowApiKeyModal(false);
        setNewApiKey('');
      };

    return (
        <>
        <div className="mb-6">
          <span className="text-sm text-gray-500">Total: {apiKeys.length}</span>
        </div>

        <ApiKeysTable
          apiKeys={apiKeys} 
          onRegenerateKey={regenerateKey}
        />

        <Pagination />

      {showApiKeyModal && (
        <ApiKeyModal 
          apiKey={newApiKey}
          onClose={closeApiKeyModal}
        />
      )}
      </>
    )
}
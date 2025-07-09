"use client"

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

const ApiKeyModal = ({ apiKey, onClose }: { apiKey: string; onClose: () => void }) => {
    const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New API Key Generated</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert className="border-yellow-200 bg-yellow-50">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="font-medium text-yellow-800">Important!</span>
            </div>
            <AlertDescription className="text-yellow-700 mt-2">
              Please save this API key somewhere safe. You won't be able to see it again after closing this modal.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-sm font-medium text-gray-700">
              Your New API Key
            </Label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-800 break-all">
                site_{apiKey}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(`site_${apiKey}`)}
                className="h-8 w-8 p-0"
                title="Copy API key"
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button 
            onClick={onClose}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            I've Saved It
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
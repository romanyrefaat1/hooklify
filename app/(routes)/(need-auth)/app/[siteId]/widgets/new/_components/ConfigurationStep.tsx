'use client';

import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, MessageSquare, Settings } from 'lucide-react';

// Shadcn Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserSites } from '@/contexts/UserSites';

/**
 * ConfigurationStep Component
 * Allows users to configure the website URL where the widget will be installed.
 * Includes validation for the URL format.
 * Assumed to be placed in: ./_components/ConfigurationStep.jsx
 */
const ConfigurationStep = ({ config, setConfig, onNext, onBack }) => {
  const [errors, setErrors] = useState({});
  const {currSite} = useUserSites()

  const validateStep = () => {
    const newErrors = {};
    if (!config.siteUrl.trim()) newErrors.siteUrl = 'Site URL is required';
    if (config.siteUrl && !config.siteUrl.startsWith('http')) {
      newErrors.siteUrl = 'Please enter a valid URL starting with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles the "Next Step" button click.
   * Validates the current step's data before proceeding.
   */
  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="siteUrl">Website URL</Label>
            <Input
              id="siteUrl"
              type="url"
              value={currSite?.site_url || ""}
              onChange={(e) => setConfig(prev => ({ ...prev, siteUrl: e.target.value }))}
              placeholder="https://example.com"
              className={errors.siteUrl ? 'border-red-500' : ''}
            />
            {errors.siteUrl && <p className="text-sm text-red-500">{errors.siteUrl}</p>}
            <p className="text-sm text-gray-500">
              This is the website where your widget will be installed
            </p>
          </div>
{/* 
          <div className="space-y-2">
            <Label>Widget Type</Label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              <div>
                <p className="font-medium">Toast Notification</p>
                <p className="text-sm text-gray-600">Show notification messages to users</p>
              </div>
            </div>
          </div> */}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-secondary-light)] hover:text-[var(--color-text-primary)]">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Configuration
                </Button>
        <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600 text-white">
          Next Step
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ConfigurationStep;
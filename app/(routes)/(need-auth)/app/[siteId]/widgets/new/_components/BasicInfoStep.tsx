'use client';

import React, { useState } from 'react';
import { Check, ChevronRight, MessageSquare, Settings } from 'lucide-react';

// Shadcn Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const BasicInfoStep = ({ config, setConfig, onNext }) => {
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};
    if (!config.name.trim()) newErrors.name = 'Widget name is required';
    if (!config.description.trim()) newErrors.description = 'Description is required';
    if (!config.type) newErrors.type = 'Widget type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  const widgetTypes = [
    { value: 'toast', label: 'Toast Notification', icon: MessageSquare, description: 'Show notification messages to users' },
  ];

  return (
    <div className="space-y-4 w-full">
          <div className="space-y-3">
            <Label htmlFor="name">Widget Name</Label>
            <Input
              id="name"
              value={config.name}
              onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Landing Page Notification Widget"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={config.description}
              onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of what your widget does"
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-3">
            <Label>Widget Type</Label>
            <div className="grid gap-3">
              {widgetTypes.map((type) => (
                <div
                  key={type.value}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    config.type === type.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, type: type.value }))}
                >
                  <div className="flex items-start gap-3">
                    <type.icon className={`w-5 h-5 mt-0.5 ${config.type === type.value ? 'text-orange-500' : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{type.label}</h3>
                        {config.type === type.value && (
                          <Check className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
          </div>
       
      <div className="flex justify-end pt-5">
        <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600 text-white">
          Next Step
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default BasicInfoStep;
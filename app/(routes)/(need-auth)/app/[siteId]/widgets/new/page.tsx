'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  MessageSquare,
  Palette,
  Layout,
  Smartphone,
  Monitor,
  Tablet,
  Eye,
  Save,
  Settings,
  ArrowLeft,
  PlusCircle,
  Trash2,
  Loader2
} from 'lucide-react';

// Shadcn Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// Supabase and Next.js Navigation
// Assuming supabase client is configured at '@/lib/supabase/client'
import { supabase } from '@/lib/supabase/client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

/**
 * Step 1: Basic Information Component
 * Allows users to input the widget's name, description, and select its type.
 * Includes validation for required fields.
 */
const BasicInfoStep = ({ config, setConfig, onNext }) => {
  const [errors, setErrors] = useState({});

  /**
   * Validates the input fields for this step.
   * @returns {boolean} True if all fields are valid, false otherwise.
   */
  const validateStep = () => {
    const newErrors = {};
    if (!config.name.trim()) newErrors.name = 'Widget name is required';
    if (!config.description.trim()) newErrors.description = 'Description is required';
    if (!config.type) newErrors.type = 'Widget type is required';

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

  // Defines available widget types with their labels, icons, and descriptions.
  const widgetTypes = [
    { value: 'toast', label: 'Toast Notification', icon: MessageSquare, description: 'Show notification messages to users' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Create Your Widget</h2>
        <p className="text-gray-600">Let's start with the basics of your widget</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-500" />
            Widget Information
          </CardTitle>
          <CardDescription>
            Tell us about your widget and what it will do
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Widget Name</Label>
            <Input
              id="name"
              value={config.name}
              onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., My Notification Widget"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
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

          <div className="space-y-2">
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
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600">
          Next Step
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

/**
 * Step 2: Configuration Component
 * Allows users to configure the website URL where the widget will be installed.
 * Includes validation for the URL format.
 */
const ConfigurationStep = ({ config, setConfig, onNext, onBack }) => {
  const [errors, setErrors] = useState({});

  /**
   * Validates the input fields for this step.
   * @returns {boolean} True if all fields are valid, false otherwise.
   */
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
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Configure Your Widget</h2>
        <p className="text-gray-600">Set up how your widget will work</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-500" />
            Widget Configuration
          </CardTitle>
          <CardDescription>
            Configure where and how your widget will be used
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="siteUrl">Website URL</Label>
            <Input
              id="siteUrl"
              type="url"
              value={config.siteUrl}
              onChange={(e) => setConfig(prev => ({ ...prev, siteUrl: e.target.value }))}
              placeholder="https://example.com"
              className={errors.siteUrl ? 'border-red-500' : ''}
            />
            {errors.siteUrl && <p className="text-sm text-red-500">{errors.siteUrl}</p>}
            <p className="text-sm text-gray-500">
              This is the website where your widget will be installed
            </p>
          </div>

          <div className="space-y-2">
            <Label>Widget Type</Label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              <div>
                <p className="font-medium">Toast Notification</p>
                <p className="text-sm text-gray-600">Show notification messages to users</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600">
          Next Step
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

/**
 * Step 3: Widget Editor Component
 * Provides a comprehensive interface for customizing the toast widget's appearance,
 * including colors, layout, typography, and managing different event types.
 * Features a live preview that adapts to device types.
 */
const WidgetEditor = ({ config, setConfig, onBack, onSave, loading }) => {
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [showPreview, setShowPreview] = useState(true);
  const [activeTab, setActiveTab] = useState('colors');
  const [activeEventType, setActiveEventType] = useState('default');
  const [newEventTypeName, setNewEventTypeName] = useState('');
  const [sampleToast, setSampleToast] = useState({
    message: 'This is a sample toast message!',
    type: 'default',
  });

  // Defines initial styles for different event types.
  // These are the base styles that can be customized.
  const [styles, setStyles] = useState({
    default: {
      background: 'linear-gradient(to right, #f97316, #ea580c)',
      border: '1px solid #ea580c',
      color: 'white',
      top: 'auto',
      right: '20px',
      bottom: '20px',
      left: 'auto',
      transform: 'none',
      fontSize: '14px',
      fontWeight: '500',
      padding: '16px',
      borderRadius: '12px',
      maxWidth: '400px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    success: {
      background: 'linear-gradient(to right, #16a34a, #22c55e)',
      border: '1px solid #15803d',
      color: 'white',
      top: 'auto',
      right: '20px',
      bottom: '20px',
      left: 'auto',
      transform: 'none',
      fontSize: '14px',
      fontWeight: '500',
      padding: '16px',
      borderRadius: '12px',
      maxWidth: '400px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    error: {
      background: 'linear-gradient(to right, #dc2626, #ef4444)',
      border: '1px solid #b91c1c',
      color: 'white',
      top: 'auto',
      right: '20px',
      bottom: '20px',
      left: 'auto',
      transform: 'none',
      fontSize: '14px',
      fontWeight: '500',
      padding: '16px',
      borderRadius: '12px',
      maxWidth: '400px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    info: {
      background: 'linear-gradient(to right, #2563eb, #3b82f6)',
      border: '1px solid #1e40af',
      color: 'white',
      top: 'auto',
      right: '20px',
      bottom: '20px',
      left: 'auto',
      transform: 'none',
      fontSize: '14px',
      fontWeight: '500',
      padding: '16px',
      borderRadius: '12px',
      maxWidth: '400px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
  });

  // Predefined color presets for quick styling.
  const colorPresets = [
    { name: 'Orange', bg: 'linear-gradient(to right, #f97316, #ea580c)', border: '#ea580c', text: 'white' },
    { name: 'Light', bg: 'linear-gradient(to right, #f0f0f0, #ffffff)', border: '#e0e0e0', text: '#333333' },
    { name: 'Blue', bg: 'linear-gradient(to right, #2563eb, #3b82f6)', border: '#1e40af', text: 'white' },
    { name: 'Green', bg: 'linear-gradient(to right, #16a34a, #22c55e)', border: '#15803d', text: 'white' },
    { name: 'Red', bg: 'linear-gradient(to right, #dc2626, #ef4444)', border: '#b91c1c', text: 'white' },
    { name: 'Purple', bg: 'linear-gradient(to right, #7c3aed, #8b5cf6)', border: '#6d28d9', text: 'white' },
  ];

  // Predefined position presets for quick layout adjustments.
  const positionPresets = [
    { name: 'Top Left', top: '20px', right: 'auto', bottom: 'auto', left: '20px' },
    { name: 'Top Center', top: '20px', right: '50%', bottom: 'auto', left: 'auto', transform: 'translateX(-50%)' },
    { name: 'Top Right', top: '20px', right: '20px', bottom: 'auto', left: 'auto' },
    { name: 'Bottom Left', top: 'auto', right: 'auto', bottom: '20px', left: '20px' },
    { name: 'Bottom Center', top: 'auto', right: '50%', bottom: '20px', left: 'auto', transform: 'translateX(-50%)' },
    { name: 'Bottom Right', top: 'auto', right: '20px', bottom: '20px', left: 'auto' },
  ];

  // Gets the current style object based on the active event type.
  const currentStyle = styles[activeEventType] || {};

  /**
   * Determines the width of the preview area based on the selected device.
   * @returns {string} The CSS width value.
   */
  const getDeviceWidth = () => {
    switch (previewDevice) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      case 'desktop':
      default:
        return '100%';
    }
  };

  /**
   * Updates a specific CSS property for the currently active event type's style.
   * @param {string} property - The CSS property to update (e.g., 'background', 'color').
   * @param {string} value - The new value for the CSS property.
   */
  const updateStyle = (property, value) => {
    setStyles(prevStyles => ({
      ...prevStyles,
      [activeEventType]: {
        ...prevStyles[activeEventType],
        [property]: value,
      },
    }));
  };

  /**
   * Adds a new event type to the styles object, copying the default styles.
   * Prevents adding if the name is empty or already exists.
   */
  const addEventType = () => {
    if (newEventTypeName && !styles[newEventTypeName]) {
      setStyles(prevStyles => ({
        ...prevStyles,
        [newEventTypeName]: { ...prevStyles.default },
      }));
      setActiveEventType(newEventTypeName);
      setNewEventTypeName('');
    }
  };

  /**
   * Deletes an existing event type from the styles object.
   * Prevents deleting the 'default' event type.
   * If the deleted type was active, switches to 'default'.
   * @param {string} eventTypeToDelete - The name of the event type to delete.
   */
  const deleteEventType = (eventTypeToDelete) => {
    if (eventTypeToDelete === 'default') return; // Prevent deleting default
    setStyles(prevStyles => {
      const newStyles = { ...prevStyles };
      delete newStyles[eventTypeToDelete];
      return newStyles;
    });
    if (activeEventType === eventTypeToDelete) {
      setActiveEventType('default'); // Switch to default if the active type is deleted
    }
  };

  /**
   * Handles the save action, packaging the config and styles to be passed up.
   */
  const handleSaveClick = () => {
    const widgetData = {
      ...config,
      styles,
      default_style: activeEventType, // Pass the currently active style as the default for the widget
    };
    onSave(widgetData);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-card)] rounded-lg shadow-lg">
      {/* Header for Widget Editor */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        <Button variant="outline" onClick={onBack} className="text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-secondary-light)] hover:text-[var(--color-text-primary)]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Configuration
        </Button>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Customize Your Toast Widget</h2>
        <Button onClick={handleSaveClick} className="bg-[var(--color-accent-primary)] text-white hover:opacity-90" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {loading ? 'Saving...' : 'Save Widget'}
        </Button>
      </div>

      {/* Main Content Area: Editor Controls (Left) and Preview (Right) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Style & Layout Controls */}
        <div className="w-80 border-r border-[var(--color-border)] flex flex-col">
          <div className="p-4 border-b border-[var(--color-border)]">
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Design Controls</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-bg-secondary-light)]"
              >
                <Eye className="w-4 h-4 mr-2" /> {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
            </div>
          </div>

          {/* Tabs for different customization categories */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3 w-full rounded-none border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              <TabsTrigger value="colors" className="flex items-center gap-2 text-sm data-[state=active]:bg-[var(--color-bg-card)] data-[state=active]:shadow-none data-[state=active]:text-[var(--color-accent-primary)]">
                <Palette className="w-4 h-4" /> Colors
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex items-center gap-2 text-sm data-[state=active]:bg-[var(--color-bg-card)] data-[state=active]:shadow-none data-[state=active]:text-[var(--color-accent-primary)]">
                <Layout className="w-4 h-4" /> Layout
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2 text-sm data-[state=active]:bg-[var(--color-bg-card)] data-[state=active]:shadow-none data-[state=active]:text-[var(--color-accent-primary)]">
                <Settings className="w-4 h-4" /> Types
              </TabsTrigger>
            </TabsList>

            {/* Colors Tab Content */}
            <TabsContent value="colors" className="p-4 space-y-6 overflow-y-auto flex-1">
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Editing styles for: <span className="font-semibold" style={{ color: 'var(--color-accent-primary)' }}>{activeEventType}</span></p>
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-base">Background Color</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        {colorPresets.map((preset) => (
                          <Button
                            key={preset.name}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              updateStyle('background', preset.bg);
                              updateStyle('border', `1px solid ${preset.border}`);
                              updateStyle('color', preset.text);
                            }}
                            className="h-auto p-2 flex flex-col items-center justify-center text-xs font-medium border border-[var(--color-border)]"
                            style={{ background: preset.bg, color: preset.text === 'white' ? 'white' : 'black' }}
                          >
                            {preset.name}
                          </Button>
                        ))}
                      </div>
                      <div>
                        <Label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Custom Background (Hex or RGB)</Label>
                        <input
                          type="color"
                          value={(() => {
                            // Extract color from linear-gradient or direct color value
                            const match = currentStyle?.background?.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)|#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/);
                            if (match) return match[0];
                            const gradientMatch = currentStyle?.background?.match(/linear-gradient\(.*,\s*(rgb\(\d+,\s*\d+,\s*\d+\)|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}).*\)/);
                            if (gradientMatch) return gradientMatch[1];
                            return '#f97316'; // Default if no match or gradient
                          })()}
                          onChange={(e) => updateStyle('background', e.target.value)}
                          className="w-full h-10 rounded-md border"
                          style={{ borderColor: 'var(--color-border)' }}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-base">Border Color</AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <Label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Border Color</Label>
                      <input
                        type="color"
                        value={(() => {
                          const match = currentStyle?.border?.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)|#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/);
                          if (match) return match[0];
                          return '#e5e7eb';
                        })()}
                        onChange={(e) => updateStyle('border', `1px solid ${e.target.value}`)}
                        className="w-full h-10 rounded-md border"
                        style={{ borderColor: 'var(--color-border)' }}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-base">Text Color</AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <Label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Toast Message Color</Label>
                      <input
                        type="color"
                        value={currentStyle?.color?.startsWith('var(') ? '#000000' : currentStyle?.color || '#000000'}
                        onChange={(e) => updateStyle('color', e.target.value)}
                        className="w-full h-10 rounded-md border"
                        style={{ borderColor: 'var(--color-border)' }}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* Layout Tab Content */}
            <TabsContent value="layout" className="p-4 space-y-6 overflow-y-auto flex-1">
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Editing styles for: <span className="font-semibold" style={{ color: 'var(--color-accent-primary)' }}>{activeEventType}</span></p>
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-base">Position</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2">
                      {positionPresets.map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            updateStyle('top', preset.top);
                            updateStyle('right', preset.right);
                            updateStyle('bottom', preset.bottom);
                            updateStyle('left', preset.left);
                            updateStyle('transform', preset.transform || 'none');
                          }}
                          className="text-xs"
                        >
                          {preset.name}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-base">Typography</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <div>
                        <Label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Font Size</Label>
                        <input
                          type="range"
                          min="10"
                          max="24"
                          value={parseInt(currentStyle?.fontSize || '14')}
                          onChange={(e) => updateStyle('fontSize', e.target.value + 'px')}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                          <span>10px</span>
                          <span>{currentStyle?.fontSize || '14px'}</span>
                          <span>24px</span>
                        </div>
                      </div>
                      <div>
                        <Label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Font Weight</Label>
                        <Select
                          value={currentStyle?.fontWeight || '500'}
                          onValueChange={(value) => updateStyle('fontWeight', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select font weight" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="400">Normal</SelectItem>
                            <SelectItem value="500">Medium</SelectItem>
                            <SelectItem value="600">Semibold</SelectItem>
                            <SelectItem value="700">Bold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-base">Spacing & Corners</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <div>
                        <Label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Padding</Label>
                        <input
                          type="range"
                          min="8"
                          max="32"
                          value={parseInt(currentStyle?.padding || '16')}
                          onChange={(e) => updateStyle('padding', e.target.value + 'px')}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                          <span>8px</span>
                          <span>{currentStyle?.padding || '16px'}</span>
                          <span>32px</span>
                        </div>
                      </div>
                      <div>
                        <Label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Border Radius</Label>
                        <input
                          type="range"
                          min="0"
                          max="24"
                          value={parseInt(currentStyle?.borderRadius || '12')}
                          onChange={(e) => updateStyle('borderRadius', e.target.value + 'px')}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                          <span>0px</span>
                          <span>{currentStyle?.borderRadius || '12px'}</span>
                          <span>24px</span>
                        </div>
                      </div>
                      <div>
                        <Label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Max Width</Label>
                        <input
                          type="range"
                          min="200"
                          max="600"
                          value={parseInt(currentStyle?.maxWidth || '400')}
                          onChange={(e) => updateStyle('maxWidth', e.target.value + 'px')}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                          <span>200px</span>
                          <span>{currentStyle?.maxWidth || '400px'}</span>
                          <span>600px</span>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-base">Shadow</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <Button
                        onClick={() => updateStyle('boxShadow', 'none')}
                        className="w-full px-3 py-2 text-xs font-medium rounded-md hover:bg-[var(--color-bg-secondary-light)] transition-colors"
                        style={{ backgroundColor: 'var(--color-bg-secondary-light)', color: 'var(--color-text-secondary)' }}
                      >
                        None
                      </Button>
                      <Button
                        onClick={() => updateStyle('boxShadow', '0 1px 3px rgba(0, 0, 0, 0.1)')}
                        className="w-full px-3 py-2 text-xs font-medium rounded-md hover:bg-[var(--color-bg-secondary-light)] transition-colors"
                        style={{ backgroundColor: 'var(--color-bg-secondary-light)', color: 'var(--color-text-secondary)' }}
                      >
                        Small
                      </Button>
                      <Button
                        onClick={() => updateStyle('boxShadow', '0 4px 6px rgba(0, 0, 0, 0.1)')}
                        className="w-full px-3 py-2 text-xs font-medium rounded-md hover:bg-[var(--color-bg-secondary-light)] transition-colors"
                        style={{ backgroundColor: 'var(--color-bg-secondary-light)', color: 'var(--color-text-secondary)' }}
                      >
                        Medium
                      </Button>
                      <Button
                        onClick={() => updateStyle('boxShadow', '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)')}
                        className="w-full px-3 py-2 text-xs font-medium rounded-md hover:bg-[var(--color-bg-secondary-light)] transition-colors"
                        style={{ backgroundColor: 'var(--color-bg-secondary-light)', color: 'var(--color-text-secondary)' }}
                      >
                        Large
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* Event Types Tab Content */}
            <TabsContent value="events" className="p-4 space-y-6 overflow-y-auto flex-1">
              <div>
                <Label className="text-sm font-medium mb-3 block">Event Types</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {Object.keys(styles).map((eventType) => (
                    <Badge
                      key={eventType}
                      variant={activeEventType === eventType ? 'default' : 'outline'}
                      className={`cursor-pointer ${activeEventType === eventType ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                      onClick={() => setActiveEventType(eventType)}
                    >
                      {eventType}
                      {eventType !== 'default' && (
                        <button
                          className="ml-1 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEventType(eventType);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="New event type"
                    value={newEventTypeName}
                    onChange={(e) => setNewEventTypeName(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={addEventType}>
                    <PlusCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label>Preview Message</Label>
                <Textarea
                  value={sampleToast.message}
                  onChange={(e) => setSampleToast(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter your preview message"
                  rows={3}
                />
              </div>
              <div className="space-y-3">
                <Label>Preview Type</Label>
                <Select
                  value={sampleToast.type}
                  onValueChange={(value) => setSampleToast(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(styles).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          {showPreview && (
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  See how your widget will look on your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center min-h-[400px]">
                  <div
                    className="transition-all duration-300 relative border rounded-lg overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100"
                    style={{
                      width: getDeviceWidth(),
                      height: previewDevice === 'mobile' ? '667px' : previewDevice === 'tablet' ? '400px' : '400px',
                      maxWidth: '100%',
                    }}
                  >
                    {/* Sample Website Content */}
                    <div className="h-full p-8 flex flex-col justify-center items-center">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900">Your Website</h3>
                        <p className="text-gray-600 mb-8">This is how your toast will appear on your website</p>
                        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
                          <h4 className="text-lg font-semibold mb-2 text-gray-900">Sample Content</h4>
                          <p className="text-gray-600">Your website content will appear here</p>
                        </div>
                      </div>
                    </div>
                    {/* Toast Preview */}
                    {styles[sampleToast.type] && (
                      <div
                        style={{
                          ...styles[sampleToast.type],
                          position: 'absolute',
                          zIndex: 1000,
                        }}
                        className="animate-in slide-in-from-bottom-2 fade-in-0 duration-300"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-white bg-opacity-30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm">{sampleToast.message}</div>
                          </div>
                          <button className="opacity-70 hover:opacity-100 ml-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <div className="flex justify-between p-4 border-t border-[var(--color-border)]">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleSaveClick}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Widget
        </Button>
      </div>
    </div>
  );
};

/**
 * Main Multi-Step Component
 * Orchestrates the entire widget creation and editing process through a series of steps.
 * Manages global state for the widget configuration and handles data persistence with Supabase.
 */
const MultiStepWidgetEditor = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Tracks if an existing widget is being edited
  const [widgetId, setWidgetId] = useState(null); // Stores the ID of the widget being edited
  const [apiKey, setAPIKey] = useState(null); // Stores the API key for the widget

  const { siteId } = useParams(); // Extracts siteId from Next.js URL parameters
  const router = useRouter(); // Next.js router for navigation
  const searchParams = useSearchParams(); // Next.js search params for reading widgetId from URL

  // Global state for the widget's configuration
  const [config, setConfig] = useState({
    name: '',
    description: '',
    type: '',
    siteUrl: '',
  });

  // Defines the steps for the multi-step form
  const steps = [
    { id: 1, title: 'Basic Info', description: 'Name and type' },
    { id: 2, title: 'Configuration', description: 'Setup and settings' },
    { id: 3, title: 'Design', description: 'Customize appearance' },
  ];

  /**
   * Effect hook to load existing widget data when the component mounts
   * or when searchParams change (e.g., if a widgetId is present in the URL).
   */
  useEffect(() => {
    const widgetIdParam = searchParams.get('widgetId');
    if (widgetIdParam) {
      setWidgetId(widgetIdParam);
      setIsEditing(true);
      loadWidgetData(widgetIdParam);
    }
  }, [searchParams]); // Rerun when search params change

  /**
   * Loads widget data from Supabase based on the provided widget ID.
   * Updates the global config state and sets the API key if found.
   * @param {string} id - The ID of the widget to load.
   */
  const loadWidgetData = async (id) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('widgets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error loading widget:', error);
        // In a real app, you might show a user-friendly error message or redirect
        return;
      }

      if (data) {
        setConfig({
          name: data.name || '',
          description: data.description || '',
          type: data.type || 'toast', // Default to 'toast' if type is not set
          siteUrl: data.site_url || '',
        });
        // The WidgetEditor component will manage its internal styles state.
        // We assume it initializes with defaults and can be updated by user interaction.
        // The `handleSave` function will then capture the latest styles from `WidgetEditor`.
        if (data.api_key) {
          setAPIKey("widget_" + data.api_key);
        }
      }
    } catch (err) {
      console.error('Unexpected error loading widget:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Advances to the next step in the multi-step form.
   */
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * Goes back to the previous step in the multi-step form.
   */
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Handles saving the widget data to Supabase.
   * This function is called by the `WidgetEditor` component when the "Save Widget" button is clicked.
   * It handles both creating new widgets and updating existing ones.
   * @param {object} widgetData - The complete widget configuration and styles to save.
   */
  const handleSave = async (widgetData) => {
    setLoading(true);
    console.log('Saving widget data:', widgetData);

    try {
      if (isEditing && widgetId) {
        // Update existing widget
        const { data, error } = await supabase
          .from('widgets')
          .update({
            name: widgetData.name,
            description: widgetData.description,
            type: widgetData.type,
            site_url: widgetData.siteUrl,
            styles: widgetData.styles, // Save the entire styles object
            default_style: widgetData.defaultStyle, // Save the default active style
          })
          .eq('id', widgetId)
          .select(); // Use .select() to get the updated row

        if (error) {
          console.error('Error updating widget:', error);
          // TODO: Implement user-facing error notification
          return;
        }
        console.log('Widget updated successfully:', data);
      } else {
        // Create new widget
        const newApiKey = crypto.randomUUID(); // Generate a new API key
        const { data, error } = await supabase
          .from('widgets')
          .insert({
            site_id: siteId, // Ensure siteId is available from useParams
            name: widgetData.name,
            description: widgetData.description,
            type: widgetData.type,
            site_url: widgetData.siteUrl,
            styles: widgetData.styles, // Save the entire styles object
            default_style: widgetData.defaultStyle, // Save the default active style
            api_key: newApiKey,
          })
          .select(); // Use .select() to get the inserted row

        if (error) {
          console.error('Error saving new widget:', error);
          // TODO: Implement user-facing error notification
          return;
        }
        setAPIKey("widget_" + newApiKey); // Update API key in state
        setWidgetId(data[0].id); // Set the new widget ID
        setIsEditing(true); // Now we are in editing mode for this new widget
        console.log('New widget saved successfully:', data);
      }
      // Redirect to the widgets list page after successful save/update
      router.push(`/app/${siteId}/widgets`);
    } catch (err) {
      console.error('Unexpected error during save:', err);
      // TODO: Implement user-facing unexpected error notification
    } finally {
      setLoading(false);
    }
  };

  // Show a full-page loading spinner when initially loading an existing widget
  // or when a new widget is being saved for the first time.
  if (loading && !isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="flex items-center gap-2 text-gray-700">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col container"
      style={{
        // Define CSS variables based on a consistent color palette
        '--color-bg-page': '#FFF8F0', // Light orange/cream background
        '--color-bg-header': '#FFFFFF', // White header/sidebar
        '--color-bg-sidebar': '#FFFFFF', // White header/sidebar
        '--color-bg-card': '#FFFFFF', // White card backgrounds
        '--color-bg-secondary-light': '#FEE2CC', // Light orange for hover/active states
        '--color-bg-input': '#FFFFFF', // White input fields
        '--color-bg-disabled': '#F3F4F6', // Light grey for disabled elements

        '--color-text-primary': '#333333', // Dark grey for primary text
        '--color-text-secondary': '#6B7280', // Medium grey for secondary text
        '--color-text-tertiary': '#9CA3AF', // Lighter grey for tertiary text

        '--color-accent-primary': '#F97316', // Vibrant orange for accents
        '--color-danger': '#EF4444', // Red for delete/danger actions

        '--color-border': '#E5E7EB', // Light grey border

        '--color-preview-start': '#FFEEDD', // Lighter orange for preview gradient
        '--color-preview-end': '#FFDDAA', // Slightly darker orange for preview gradient

        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}
    >
      <div className="max-w-6xl mx-auto w-full py-8">
        {/* Header with Steps Indicator */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? `Edit Widget: ${config.name || 'Loading...'}` : 'Create New Widget'}
          </h1>
          <p className="text-gray-600 mb-6">
            {isEditing ? 'Modify your existing widget configuration' : 'Follow the steps to create your new widget'}
          </p>

          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300
                      ${currentStep > step.id ? 'bg-orange-500' : currentStep === step.id ? 'bg-orange-500' : 'bg-gray-200 text-gray-500'}`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${currentStep >= step.id ? 'text-orange-700' : 'text-gray-500'}`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 transition-all duration-300
                      ${currentStep > step.id ? 'bg-orange-500' : 'bg-gray-200'}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Conditional Rendering of Steps */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          {currentStep === 1 && (
            <BasicInfoStep config={config} setConfig={setConfig} onNext={handleNext} />
          )}
          {currentStep === 2 && (
            <ConfigurationStep config={config} setConfig={setConfig} onNext={handleNext} onBack={handleBack} />
          )}
          {currentStep === 3 && (
            <WidgetEditor config={config} setConfig={setConfig} onBack={handleBack} onSave={handleSave} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepWidgetEditor;

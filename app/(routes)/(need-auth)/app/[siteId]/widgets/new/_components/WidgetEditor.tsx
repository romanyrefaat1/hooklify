'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  Eye,
  Layout,
  Loader2,
  Monitor,
  Palette,
  PlusCircle,
  Save,
  Settings,
  Smartphone,
  Tablet,
  Trash2,
  Check,
  ChevronsUpDown,
  X,
  Plus
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useUser } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { usePricingContext } from '@/contexts/PricingContext';

/**
 * WidgetEditor Component
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
  const [isComboOpen, setIsComboOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [sampleToast, setSampleToast] = useState({
    message: 'This is a sample toast message!',
    type: 'default',
  });
  const {user, loading: loadingUser} = useUser();
  const {showPricingModal} = usePricingContext();

  // Defines initial styles for different event types.
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
   * Adds a new event type to the styles object.
   */
  const addEventType = () => {
    if (newEventTypeName.trim() && !styles[newEventTypeName.trim()]) {

        const isUserAllowed = user?.plan_type === 'pro' || user?.plan_type === 'growth';
        if (!isUserAllowed) {
            showPricingModal({error: "Adding special event types is only available for Pro and Enterprise plans. Please upgrade your plan to continue."});
            toast.error("You need to upgrade your plan to add new event types")
            return;
        }
        
      const newType = newEventTypeName.trim();
      setStyles(prevStyles => ({
        ...prevStyles,
        [newType]: { ...prevStyles.default },
      }));
      setActiveEventType(newType);
      setSampleToast(prev => ({ ...prev, type: newType }));
      setNewEventTypeName('');
      setIsAddingNew(false);
      setIsComboOpen(false);
    }
  };

  /**
   * Deletes an existing event type from the styles object.
   */
  const deleteEventType = (eventTypeToDelete) => {
    if (eventTypeToDelete === 'default') return;
    setStyles(prevStyles => {
      const newStyles = { ...prevStyles };
      delete newStyles[eventTypeToDelete];
      return newStyles;
    });
    if (activeEventType === eventTypeToDelete) {
      setActiveEventType('default');
      setSampleToast(prev => ({ ...prev, type: 'default' }));
    }
  };

  /**
   * Handles selecting an event type from the combobox.
   */
  const handleSelectEventType = (eventType) => {
    setActiveEventType(eventType);
    setSampleToast(prev => ({ ...prev, type: eventType }));
    setIsComboOpen(false);
  };

  /**
   * Handles the save action.
   */
  const handleSaveClick = () => {
    const widgetData = {
      ...config,
      styles,
      default_style: activeEventType,
    };
    onSave(widgetData);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p- border-b">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Configuration
          </Button>
          <div className="w-px h-6 bg-gray-300" />
          <h1 className="text-lg font-semibold text-gray-900">Widget Customization</h1>
        </div>
        <Button onClick={handleSaveClick} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? 'Saving...' : 'Save Widget'}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden w-full">
        {/* Left Panel - Controls */}
        <div className="w-80 border-r bg-gray-50/50 flex flex-1 transition-all flex-col">
          {/* Event Type Selector */}
          <div className="p-6 border-b bg-white">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium text-gray-700">Event Type</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={()=> setIsAddingNew(true)}
                className="gap-1 h-8 px-3"
              >
                <Plus className="w-3 h-3" />
                Add New
              </Button>
            </div>
            
            <Popover open={isComboOpen} onOpenChange={setIsComboOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isComboOpen}
                  className="w-full justify-between"
                >
                  <span className="capitalize">{activeEventType}</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandList>
                    <CommandEmpty>No event type found.</CommandEmpty>
                    <CommandGroup>
                      {Object.keys(styles).map((eventType) => (
                        <CommandItem
                          key={eventType}
                          value={eventType}
                          onSelect={() => handleSelectEventType(eventType)}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                activeEventType === eventType ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            <span className="capitalize">{eventType}</span>
                          </div>
                          {eventType !== 'default' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteEventType(eventType);
                              }}
                              className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </CommandItem>
                      ))}
                      {isAddingNew && (
                        <CommandItem className="flex items-center gap-2 p-2">
                          <Input
                            placeholder="Enter new type name"
                            value={newEventTypeName}
                            onChange={(e) => setNewEventTypeName(e.target.value)}
                            className="flex-1 h-8"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                addEventType();
                              } else if (e.key === 'Escape') {
                                setIsAddingNew(false);
                                setNewEventTypeName('');
                              }
                            }}
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={addEventType}
                            className="h-8 px-3"
                          >
                            Add
                          </Button>
                        </CommandItem>
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Preview Controls */}
          <div className="p-6 border-b bg-white">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium text-gray-700">Preview</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-2 h-8"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide' : 'Show'}
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-gray-500 mb-2 block">Device View</Label>
                <Select value={previewDevice} onValueChange={setPreviewDevice}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desktop">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        Desktop
                      </div>
                    </SelectItem>
                    <SelectItem value="tablet">
                      <div className="flex items-center gap-2">
                        <Tablet className="w-4 h-4" />
                        Tablet
                      </div>
                    </SelectItem>
                    <SelectItem value="mobile">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Mobile
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-xs text-gray-500 mb-2 block">Preview Message</Label>
                <Textarea
                  value={sampleToast.message}
                  onChange={(e) => setSampleToast(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter preview message..."
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Customization Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mx-6 mt-4">
                <TabsTrigger value="colors" className="gap-2">
                  <Palette className="w-4 h-4" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="layout" className="gap-2">
                  <Layout className="w-4 h-4" />
                  Layout
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="colors" className="p-6 space-y-6 mt-0">
                  <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                    Customizing: <span className="font-medium text-gray-700 capitalize">{activeEventType}</span>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">Color Presets</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {colorPresets.map((preset) => (
                          <Button
                            key={preset.name}
                            variant="outline"
                            onClick={() => {
                              updateStyle('background', preset.bg);
                              updateStyle('border', `1px solid ${preset.border}`);
                              updateStyle('color', preset.text);
                            }}
                            className="h-12 p-2 text-xs font-medium"
                            style={{ background: preset.bg, color: preset.text, borderColor: preset.border }}
                          >
                            {preset.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">Custom Colors</Label>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs text-gray-500 mb-2 block">Background</Label>
                          <input
                            type="color"
                            value={(() => {
                              const match = currentStyle?.background?.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)|#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/);
                              return match?.[0] || '#f97316';
                            })()}
                            onChange={(e) => updateStyle('background', e.target.value)}
                            className="w-full h-10 rounded-md border cursor-pointer"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-2 block">Border</Label>
                          <input
                            type="color"
                            value={(() => {
                              const match = currentStyle?.border?.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)|#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/);
                              return match?.[0] || '#ea580c';
                            })()}
                            onChange={(e) => updateStyle('border', `1px solid ${e.target.value}`)}
                            className="w-full h-10 rounded-md border cursor-pointer"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-2 block">Text</Label>
                          <input
                            type="color"
                            value={currentStyle?.color?.startsWith('var(') ? '#000000' : currentStyle?.color || '#000000'}
                            onChange={(e) => updateStyle('color', e.target.value)}
                            className="w-full h-10 rounded-md border cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="layout" className="p-6 space-y-6 mt-0">
                  <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                    Customizing: <span className="font-medium text-gray-700 capitalize">{activeEventType}</span>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">Position</Label>
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
                            className="text-xs h-9"
                          >
                            {preset.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">Typography</Label>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs text-gray-500 mb-2 block">Font Size: {currentStyle?.fontSize || '14px'}</Label>
                          <input
                            type="range"
                            min="10"
                            max="24"
                            value={parseInt(currentStyle?.fontSize || '14')}
                            onChange={(e) => updateStyle('fontSize', e.target.value + 'px')}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-2 block">Font Weight</Label>
                          <Select
                            value={currentStyle?.fontWeight || '500'}
                            onValueChange={(value) => updateStyle('fontWeight', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
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
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">Spacing</Label>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs text-gray-500 mb-2 block">Padding: {currentStyle?.padding || '16px'}</Label>
                          <input
                            type="range"
                            min="8"
                            max="32"
                            value={parseInt(currentStyle?.padding || '16')}
                            onChange={(e) => updateStyle('padding', e.target.value + 'px')}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-2 block">Border Radius: {currentStyle?.borderRadius || '12px'}</Label>
                          <input
                            type="range"
                            min="0"
                            max="24"
                            value={parseInt(currentStyle?.borderRadius || '12')}
                            onChange={(e) => updateStyle('borderRadius', e.target.value + 'px')}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500 mb-2 block">Max Width: {currentStyle?.maxWidth || '400px'}</Label>
                          <input
                            type="range"
                            min="200"
                            max="600"
                            value={parseInt(currentStyle?.maxWidth || '400')}
                            onChange={(e) => updateStyle('maxWidth', e.target.value + 'px')}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">Shadow</Label>
                      <div className="space-y-2">
                        {[
                          { name: 'None', value: 'none' },
                          { name: 'Small', value: '0 1px 3px rgba(0, 0, 0, 0.1)' },
                          { name: 'Medium', value: '0 4px 6px rgba(0, 0, 0, 0.1)' },
                          { name: 'Large', value: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }
                        ].map((shadow) => (
                          <Button
                            key={shadow.name}
                            variant="outline"
                            size="sm"
                            onClick={() => updateStyle('boxShadow', shadow.value)}
                            className="w-full justify-start text-xs"
                          >
                            {shadow.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Right Panel - Preview */}
        {showPreview && (
          <div className="flex- p-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Live Preview</CardTitle>
                <CardDescription>
                  See how your widget will look on your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center min-h-[500px]">
                  <div
                    className="transition-all duration-300 relative border rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
                    style={{
                      width: getDeviceWidth(),
                      height: previewDevice === 'mobile' ? '667px' : '500px',
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
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetEditor;
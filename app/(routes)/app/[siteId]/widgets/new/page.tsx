'use client';

import { useState, useEffect } from 'react';
import {
  Palette,
  Type,
  Box,
  Maximize2,
  Eye,
  Code,
  Save,
  ArrowLeft,
  Settings,
  Smartphone,
  Monitor,
  Tablet,
  PlusCircle,
  Trash2,
  Brush, // Icon for Colors tab
  Crop // Icon for Layout tab
} from 'lucide-react';

// Shadcn UI imports (assuming these are available or mocked for the environment)
// In a real Next.js/Shadcn project, these would be imported from your components/ui directory
// For this environment, we'll assume their structure and apply Tailwind classes directly.
// If actual Shadcn components are needed, they would require a separate setup.

import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs"
import {Accordion, AccordionItem, AccordionTrigger, AccordionContent} from "@/components/ui/accordion"
import { supabase } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';

// Mock Shadcn Tabs and Accordion components for demonstration purposes
// In a real application, you would import these from your shadcn/ui library
// const Tabs = ({ defaultValue, className, children }) => (
//   <div className={className}>{children}</div>
// );
// const TabsList = ({ className, children }) => (
//   <div className={`flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}>
//     {children}
//   </div>
// );
// const TabsTrigger = ({ value, className, children, onClick }) => (
//   <button
//     className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${className}`}
//     data-state={value === activeTab ? 'active' : 'inactive'}
//     onClick={onClick}
//   >
//     {children}
//   </button>
// );
// const TabsContent = ({ value, className, children }) => (
//   <div
//     className={`${value === activeTab ? 'block' : 'hidden'} mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
//   >
//     {children}
//   </div>
// );

// const Accordion = ({ type, collapsible, className, children }) => (
//   <div className={className}>{children}</div>
// );
// const AccordionItem = ({ value, className, children }) => (
//   <div className={`border-b ${className}`} style={{ borderColor: 'var(--border-color, #2d2d2d)' }}>{children}</div>
// );
// const AccordionTrigger = ({ className, children }) => (
//   <button
//     className={`flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 ${className}`}
//     style={{ color: 'var(--text-primary)' }}
//   >
//     {children}
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className="h-4 w-4 shrink-0 transition-transform duration-200"
//     >
//       <path d="m6 9 6 6 6-6"></path>
//     </svg>
//   </button>
// );
// const AccordionContent = ({ className, children }) => (
//   <div className={`overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down ${className}`}>
//     <div className="pb-4 pt-0">{children}</div>
//   </div>
// );


const App = () => {
    const [previewDevice, setPreviewDevice] = useState('desktop');
    const [showPreview, setShowPreview] = useState(true);
    const [config, setConfig] = useState({
      name: 'My Float Button',
      description: 'A floating button for website interactions.',
      siteUrl: 'https://example.com',
    //   siteId: 'xyz123',
    });
    const [sampleToast, setSampleToast] = useState({
      message: 'This is a sample toast message!',
      type: 'default',
    });
    const [activeTab, setActiveTab] = useState('general');
    const [newEventTypeName, setNewEventTypeName] = useState('');
    const [activeEventType, setActiveEventType] = useState('default');
    const [apiKey, setAPIKey] = useState(null);
    const { siteId } = useParams();
    const router = useRouter();
  
    // Define initial styles for different event types
    const [styles, setStyles] = useState({
      default: {
        background: 'linear-gradient(to right, #333333, #444444)',
        border: '1px solid #2d2d2d',
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
  
    const colorPresets = [
      { name: 'Dark', bg: 'linear-gradient(to right, #333333, #444444)', border: '#2d2d2d', text: 'white' },
      { name: 'Light', bg: 'linear-gradient(to right, #f0f0f0, #ffffff)', border: '#e0e0e0', text: '#333333' },
      { name: 'Blue', bg: 'linear-gradient(to right, #2563eb, #3b82f6)', border: '#1e40af', text: 'white' },
      { name: 'Green', bg: 'linear-gradient(to right, #16a34a, #22c55e)', border: '#15803d', text: 'white' },
      { name: 'Red', bg: 'linear-gradient(to right, #dc2626, #ef4444)', border: '#b91c1c', text: 'white' },
      { name: 'Purple', bg: 'linear-gradient(to right, #7c3aed, #8b5cf6)', border: '#6d28d9', text: 'white' },
    ];
  
    const positionPresets = [
      { name: 'Top Left', top: '20px', right: 'auto', bottom: 'auto', left: '20px' },
      { name: 'Top Center', top: '20px', right: '50%', bottom: 'auto', left: 'auto', transform: 'translateX(50%)' },
      { name: 'Top Right', top: '20px', right: '20px', bottom: 'auto', left: 'auto' },
      { name: 'Bottom Left', top: 'auto', right: 'auto', bottom: '20px', left: '20px' },
      { name: 'Bottom Center', top: 'auto', right: '50%', bottom: '20px', left: 'auto', transform: 'translateX(50%)' },
      { name: 'Bottom Right', top: 'auto', right: '20px', bottom: '20px', left: 'auto' },
    ];
  
    const currentStyle = styles[activeEventType] || {};
  
    const getDeviceWidth = () => {
      switch (previewDevice) {
        case 'mobile':
          return '375px';
        case 'tablet':
          return '768px';
        case 'desktop':
        default:
          return '100%'; // Full width of the preview area
      }
    };
  
    const handleSave = async () => {
        console.log('Saving config:', config);
        console.log('Saving styles:', styles);
      
        console.log("Saving...");
        try {
            const apiKey = crypto.randomUUID();
          const { data, error } = await supabase.from('widgets').insert({
            site_id: siteId,
            name: config.name,
            type: "toast",
            description: config.description,
            site_url: config.siteUrl,
            styles: styles,
            default_style: "default",
            api_key: apiKey,
          });
          setAPIKey("widget_"+apiKey);
          router.push("/app/"+siteId+"/widgets")

      
          console.log("supabase returned response", data, error);
      
          if (error) {
            console.error('Error saving widget:', error);
            return;
          }
      
          console.log('Widget saved successfully:', data);
        } catch (err) {
          console.error('Unexpected error during save:', err);
        }
      };
      
  
    const updateStyle = (property: string, value: string) => {
      setStyles(prevStyles => ({
        ...prevStyles,
        [activeEventType]: {
          ...prevStyles[activeEventType],
          [property]: value,
        },
      }));
    };
  
    const addEventType = () => {
      if (newEventTypeName && !styles[newEventTypeName]) {
        setStyles(prevStyles => ({
          ...prevStyles,
          [newEventTypeName]: { ...prevStyles.default }, // Copy default styles
        }));
        setActiveEventType(newEventTypeName);
        setNewEventTypeName('');
      } else if (styles[newEventTypeName]) {
        console.log('Event type already exists or name is empty.');
      }
    };
  
    const deleteEventType = (eventTypeToDelete) => {
      if (eventTypeToDelete === 'default') {
        console.log('Cannot delete the default event type.');
        return;
      }
      setStyles(prevStyles => {
        const newStyles = { ...prevStyles };
        delete newStyles[eventTypeToDelete];
        return newStyles;
      });
      if (activeEventType === eventTypeToDelete) {
        setActiveEventType('default'); // Fallback to default if active type is deleted
      }
    };
  
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg-page)', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        {apiKey && apiKey}
        {/* Header */}
        <div className="border-b px-6 py-4 rounded-b-lg" style={{ backgroundColor: 'var(--color-bg-header)', borderBottomColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-[var(--color-bg-secondary-light)] rounded-lg transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Edit Float Button</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-lg p-1" style={{ backgroundColor: 'var(--color-bg-secondary-light)' }}>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-2 rounded-md transition-colors ${previewDevice === 'mobile' ? 'shadow-sm' : 'hover:bg-[var(--color-bg-secondary-light)]'}`}
                  style={{ backgroundColor: previewDevice === 'mobile' ? 'var(--color-bg-page)' : '', color: 'var(--color-text-primary)' }}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-2 rounded-md transition-colors ${previewDevice === 'tablet' ? 'shadow-sm' : 'hover:bg-[var(--color-bg-secondary-light)]'}`}
                  style={{ backgroundColor: previewDevice === 'tablet' ? 'var(--color-bg-page)' : '', color: 'var(--color-text-primary)' }}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-2 rounded-md transition-colors ${previewDevice === 'desktop' ? 'shadow-sm' : 'hover:bg-[var(--color-bg-secondary-light)]'}`}
                  style={{ backgroundColor: previewDevice === 'desktop' ? 'var(--color-bg-page)' : '', color: 'var(--color-text-primary)' }}
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${showPreview ? 'text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary-light)]'}`}
                style={{ backgroundColor: showPreview ? 'var(--color-accent-primary)' : 'var(--color-bg-secondary-light)', color: showPreview ? 'white' : 'var(--color-text-secondary)' }}
              >
                <Eye className="w-4 h-4 mr-2 inline" />
                Preview
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-foreground rounded-lg font-medium hover:opacity-90 transition-colors"
                style={{ backgroundColor: 'var(--color-accent-primary)' }}
              >
                <Save className="w-4 h-4 mr-2 inline" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
  
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Editor Controls */}
          <div className="w-80 border-r overflow-y-auto flex-shrink-0 rounded-r-lg" style={{ backgroundColor: 'var(--color-bg-sidebar)', borderRightColor: 'var(--color-border)' }}>
            {/* Tabs for controls */}
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-none border-b p-0" style={{ borderColor: 'var(--color-border)' }}>
                <TabsTrigger value="general" onClick={() => setActiveTab('general')} className="rounded-none data-[state=active]:bg-[var(--color-bg-header)] data-[state=active]:text-[var(--color-text-primary)] data-[state=active]:shadow-none" style={{ color: activeTab === 'general' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                  General
                </TabsTrigger>
                <TabsTrigger value="colors" onClick={() => setActiveTab('colors')} className="rounded-none data-[state=active]:bg-[var(--color-bg-header)] data-[state=active]:text-[var(--color-text-primary)] data-[state=active]:shadow-none" style={{ color: activeTab === 'colors' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                  Colors
                </TabsTrigger>
                <TabsTrigger value="layout" onClick={() => setActiveTab('layout')} className="rounded-none data-[state=active]:bg-[var(--color-bg-header)] data-[state=active]:text-[var(--color-text-primary)] data-[state=active]:shadow-none" style={{ color: activeTab === 'layout' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                  Layout
                </TabsTrigger>
                <TabsTrigger value="event-types" onClick={() => setActiveTab('event-types')} className="rounded-none data-[state=active]:bg-[var(--color-bg-header)] data-[state=active]:text-[var(--color-text-primary)] data-[state=active]:shadow-none" style={{ color: activeTab === 'event-types' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                  Event Types
                </TabsTrigger>
              </TabsList>
  
              <TabsContent value="general" className="p-4 space-y-6">
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-base">Widget Configuration</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Widget Name</label>
                          <input
                            type="text"
                            value={config.name}
                            onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-input)', color: 'var(--color-text-primary)' }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Description</label>
                          <input
                            type="text"
                            value={config.description}
                            onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-input)', color: 'var(--color-text-primary)' }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Site URL</label>
                          <input
                            type="url"
                            value={config.siteUrl}
                            onChange={(e) => setConfig(prev => ({ ...prev, siteUrl: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-input)', color: 'var(--color-text-primary)' }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Site ID</label>
                          <input
                            type="text"
                            value={config.siteId}
                            onChange={(e) => setConfig(prev => ({ ...prev, siteId: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-input)', color: 'var(--color-text-primary)' }}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-base">Preview Content</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Message</label>
                          <textarea
                            value={sampleToast.message}
                            onChange={(e) => setSampleToast(prev => ({ ...prev, message: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                            rows="3"
                            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-input)', color: 'var(--color-text-primary)' }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Preview Event Type</label>
                          <select
                            value={sampleToast.type}
                            onChange={(e) => setSampleToast(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-input)', color: 'var(--color-text-primary)' }}
                          >
                            {Object.keys(styles).map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
  
              <TabsContent value="colors" className="p-4 space-y-6">
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Editing styles for: <span className="font-semibold" style={{ color: 'var(--color-accent-primary)' }}>{activeEventType}</span></p>
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-base">Quick Styles</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2">
                        {colorPresets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => {
                              updateStyle('background', preset.bg);
                              updateStyle('border', `1px solid ${preset.border}`);
                              updateStyle('color', preset.text);
                            }}
                            className="p-3 rounded-lg border hover:border-[var(--color-text-secondary)] transition-colors text-left"
                            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}
                          >
                            <div
                              className="w-full h-6 rounded mb-2"
                              style={{ background: preset.bg, border: `1px solid ${preset.border}` }}
                            />
                            <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-base">Background & Border</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Background Color (Start)</label>
                          <input
                            type="color"
                            value={(() => {
                              const match = currentStyle?.background?.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)|#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/);
                              if (match) return match[0];
                              const gradientMatch = currentStyle?.background?.match(/linear-gradient\(.*,\s*(rgb\(\d+,\s*\d+,\s*\d+\)|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}).*\)/);
                              if (gradientMatch) return gradientMatch[1];
                              return '#ffffff';
                            })()}
                            onChange={(e) => {
                              updateStyle('background', e.target.value);
                            }}
                            className="w-full h-10 rounded-md border"
                            style={{ borderColor: 'var(--color-border)' }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Border Color</label>
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
                      </div>
                    </AccordionContent>
                  </AccordionItem>
  
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-base">Text Color</AccordionTrigger>
                    <AccordionContent>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Toast Message Color</label>
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
  
              <TabsContent value="layout" className="p-4 space-y-6">
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Editing styles for: <span className="font-semibold" style={{ color: 'var(--color-accent-primary)' }}>{activeEventType}</span></p>
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-base">Position</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2">
                        {positionPresets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => {
                              updateStyle('top', preset.top);
                              updateStyle('right', preset.right);
                              updateStyle('bottom', preset.bottom);
                              updateStyle('left', preset.left);
                              updateStyle('transform', preset.transform || 'none');
                            }}
                            className="px-3 py-2 text-xs font-medium rounded-md hover:bg-[var(--color-bg-secondary-light)] transition-colors"
                            style={{ backgroundColor: 'var(--color-bg-secondary-light)', color: 'var(--color-text-secondary)' }}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-base">Typography</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Font Size</label>
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
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Font Weight</label>
                          <select
                            value={currentStyle?.fontWeight || '500'}
                            onChange={(e) => updateStyle('fontWeight', e.target.value)}
                            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-input)', color: 'var(--color-text-primary)' }}
                          >
                            <option value="400">Normal</option>
                            <option value="500">Medium</option>
                            <option value="600">Semibold</option>
                            <option value="700">Bold</option>
                          </select>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
  
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-base">Spacing & Corners</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Padding</label>
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
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Border Radius</label>
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
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Max Width</label>
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
                        <button
                          onClick={() => updateStyle('boxShadow', 'none')}
                          className="w-full px-3 py-2 text-xs font-medium rounded-md hover:bg-[var(--color-bg-secondary-light)] transition-colors"
                          style={{ backgroundColor: 'var(--color-bg-secondary-light)', color: 'var(--color-text-secondary)' }}
                        >
                          None
                        </button>
                        <button
                          onClick={() => updateStyle('boxShadow', '0 1px 3px rgba(0, 0, 0, 0.1)')}
                          className="w-full px-3 py-2 text-xs font-medium rounded-md hover:bg-[var(--color-bg-secondary-light)] transition-colors"
                          style={{ backgroundColor: 'var(--color-bg-secondary-light)', color: 'var(--color-text-secondary)' }}
                        >
                          Small
                        </button>
                        <button
                          onClick={() => updateStyle('boxShadow', '0 4px 6px rgba(0, 0, 0, 0.1)')}
                          className="w-full px-3 py-2 text-xs font-medium rounded-md hover:bg-[var(--color-bg-secondary-light)] transition-colors"
                          style={{ backgroundColor: 'var(--color-bg-secondary-light)', color: 'var(--color-text-secondary)' }}
                        >
                          Medium
                        </button>
                        <button
                          onClick={() => updateStyle('boxShadow', '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)')}
                          className="w-full px-3 py-2 text-xs font-medium rounded-md hover:bg-[var(--color-bg-secondary-light)] transition-colors"
                          style={{ backgroundColor: 'var(--color-bg-secondary-light)', color: 'var(--color-text-secondary)' }}
                        >
                          Large
                        </button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
  
              <TabsContent value="event-types" className="p-4 space-y-6">
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-base">Manage Event Types</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                        Create different style variations for various toast event types (e.g., success, error, info).
                        Select an event type below to edit its specific design in the "Colors" and "Layout" tabs.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {Object.keys(styles).map((eventType) => (
                          <button
                            key={eventType}
                            onClick={() => setActiveEventType(eventType)}
                            className={`px-3 py-1 text-xs rounded-full font-medium transition-colors flex items-center gap-1 ${activeEventType === eventType ? 'text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary-light)]'}`}
                            style={{
                              backgroundColor: activeEventType === eventType ? 'var(--color-accent-primary)' : 'var(--color-bg-secondary-light)',
                              color: activeEventType === eventType ? 'white' : 'var(--color-text-secondary)'
                            }}
                          >
                            {eventType}
                            {eventType !== 'default' && (
                              <Trash2
                                className="w-3 h-3 ml-1 inline-block cursor-pointer hover:text-[var(--color-danger)]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteEventType(eventType);
                                }}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="New Event Type Name"
                          value={newEventTypeName}
                          onChange={(e) => setNewEventTypeName(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-input)', color: 'var(--color-text-primary)' }}
                        />
                        <button
                          onClick={addEventType}
                          className="p-2 rounded-md text-white hover:opacity-90 transition-colors"
                          style={{ backgroundColor: 'var(--color-accent-primary)' }}
                        >
                          <PlusCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>
  
          {/* Center Content - Main Preview Area */}
          <div className="flex-1 p-6 overflow-hidden flex items-center justify-center rounded-l-lg" style={{ backgroundColor: 'var(--color-bg-page)' }}>
            {showPreview && (
              <div className="rounded-lg shadow-sm h-full p-6 relative flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'var(--color-bg-card)' }}>
                <div
                  className="transition-all duration-300 relative border rounded-lg overflow-hidden"
                  style={{
                    width: getDeviceWidth(),
                    height: previewDevice === 'mobile' ? '667px' : previewDevice === 'tablet' ? '1024px' : 'calc(100% - 20px)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  {/* Preview Background */}
                  <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(to bottom right, var(--color-preview-start), var(--color-preview-end))', opacity: 0.5 }} />
  
                  {/* Sample Content */}
                  <div className="relative h-full p-8 flex flex-col justify-center items-center">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Website Preview</h2>
                      <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>This is how your toast will appear on your website.</p>
                      <div className="rounded-lg shadow-sm p-6 max-w-md mx-auto" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Your Content Here</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>This represents your website content where the toast will overlay.</p>
                      </div>
                    </div>
                  </div>
  
                  {/* Toast Preview - Render based on selected sampleToast.type */}
                  {styles[sampleToast.type] && (
                    <div
                      style={{
                        ...styles[sampleToast.type],
                        position: 'absolute',
                        cursor: 'pointer'
                      }}
                      className="hover:scale-105 transition-transform duration-200"
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon based on toast type could be dynamic here */}
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'var(--color-accent-primary)'}}>
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm opacity-80" style={{ color: styles[sampleToast.type]?.color }}>
                            {sampleToast.message}
                          </div>
                        </div>
                        <button className="hover:text-[var(--color-text-primary)] ml-2" style={{ color: 'var(--color-text-secondary)' }}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default App;
  

'use client';

import React, { useState, useEffect } from 'react';
import { Check, Loader2, Settings } from 'lucide-react';

// Supabase and Next.js Navigation
import { supabase } from '@/lib/supabase/client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

// Import the new components
import BasicInfoStep from './BasicInfoStep';
import ConfigurationStep from './ConfigurationStep';
import WidgetEditor from './WidgetEditor';
import { useUserSites } from '@/contexts/UserSites';

/**
 * MultiStepWidgetEditor Component (Main Page Component)
 * Orchestrates the entire widget creation and editing process through a series of steps.
 * Manages global state for the widget configuration and handles data persistence with Supabase.
 * This component is a client component due to its use of React hooks and Next.js client-side hooks.
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
  const {currSite, loading: loadingCurrSite} = useUserSites()

  // Global state for the widget's configuration
  const [config, setConfig] = useState({
    name: '',
    description: '',
    type: 'toast',
    siteUrl: '',
  });
  useEffect(()=> {
    if(!loadingCurrSite){
      setConfig(prev => ({ ...prev, siteUrl: currSite?.site_url || '' }))
    }
  }, [loadingCurrSite])

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
            default_style: widgetData.default_style, // Save the default active style
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
            default_style: widgetData.default_style, // Save the default active style
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
      className="min-h-screen flex flex-col"
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
      <div className="w-full py-8">
        {/* Page Title and Description */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 m b-2 flex items-center gap-4">
            <Settings className="w-7 h-7 text-orange-500" />
            {isEditing ? `Edit Widget: ${config.name || 'Loading...'}` : 'Create New Widget'}
          </h1>
          <p className="text-gray-600 mb-6">
            {isEditing ? 'Modify your existing widget configuration' : 'Follow the steps to create your new widget'}
          </p>
        </div>

        {/* Conditional Rendering of Steps */}
        <div className="rounded-lg">
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
        
        {/* Steps Indicator */}
        <div className="flex items-center justify-between relative mt-8">
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
    </div>
  );
};

export default MultiStepWidgetEditor;
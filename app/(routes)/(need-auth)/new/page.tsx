'use client';

import NextLink from 'next/link';

import { useState } from 'react';
import { 
  Globe, 
  Key, 
  CheckCircle, 
  Copy, 
  ArrowRight,
  Building,
  Link,
  Zap,
  Shield
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useUser } from '@/contexts/AuthContext';

export default function AddSitePage() {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [step, setStep] = useState('form'); // 'form' or 'success'
  const [error, setError] = useState('');
  const {user} = useUser();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Site name is required');
      return false;
    }
    
    if (!formData.url.trim()) {
      setError('Site URL is required');
      return false;
    }
    
    // Basic URL validation
    try {
      new URL(formData.url);
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return false;
    }
    
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const generatedKey = crypto.randomUUID();
      
      const { data, error: supabaseError } = await supabase
        .from('sites')
        .insert({
          user_id: user?.id,
          name: formData.name,
          site_url: formData.url,
          // description: formData.description,
          api_key: generatedKey,
        })
        .select()
        .single();
      
      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        setError('Failed to create site. Please try again.');
        return;
      }
      
      setApiKey(generatedKey);
      setStep('success');
      
    } catch (err) {
      console.error('Error creating site:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(`site_${apiKey}`);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } catch (err) {
      console.error('Failed to copy API key:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = `site_${apiKey}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const isFormValid = formData.name.trim() && formData.url.trim();

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Site Created Successfully!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your site "{formData.name}" has been added to Hookify. Use your API key to start integrating widgets.
            </p>
          </div>

          {/* Success Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200 p-8 shadow-xl">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Site Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Building className="w-5 h-5 text-amber-500" />
                      <div>
                        <p className="text-sm text-gray-500">Site Name</p>
                        <p className="font-medium text-gray-900">{formData.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-amber-500" />
                      <div>
                        <p className="text-sm text-gray-500">URL</p>
                        <p className="font-medium text-gray-900">{formData.url}</p>
                      </div>
                    </div>
                    {formData.description && (
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="font-medium text-gray-900">{formData.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* API Key */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your API Key</h3>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Key className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">API Key</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-white/60 px-3 py-2 rounded-lg text-sm font-mono text-gray-800 break-all">
                      site_{apiKey}
                    </code>
                    <button
                      onClick={handleCopyApiKey}
                      className="flex items-center space-x-2 px-3 py-2 bg-white/80 hover:bg-white border border-amber-200 rounded-lg transition-colors"
                    >
                      {copiedKey ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-amber-600" />
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {copiedKey ? 'Copied!' : 'Copy'}
                      </span>
                    </button>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Keep this key secure</p>
                      <p className="text-sm text-blue-700">
                        Store your API key securely and never share it publicly. You'll need it to integrate widgets into your site.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="mt-8 pt-8 border-t border-amber-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">1</span>
                    </div>
                    <h4 className="font-medium text-gray-900">Create Widgets</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Start creating toast notifications, modals, and banners for your site.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">2</span>
                    </div>
                    <h4 className="font-medium text-gray-900">Integrate Code</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Add the Hookify script to your site and start using your widgets.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">3</span>
                    </div>
                    <h4 className="font-medium text-gray-900">Go Live</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Deploy your widgets and start engaging with your users.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <NextLink href="/app">
                <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-[1.01] shadow-lg">
                  <Zap className="w-5 h-5" />
                  <span className="font-medium">See Your Websites</span>
                </button>
              </NextLink>
              <NextLink href="/docs">
                <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/80 text-gray-700 rounded-xl hover:bg-white border border-amber-200 transition-all duration-200">
                  <span className="font-medium">Read Documentation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </NextLink>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl mb-6">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Add a New Site
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect your website to Hookify and start creating engaging widgets for your users.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200 p-8 shadow-xl">
          <div className="space-y-8">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Site Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Site Name *
              </label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="My Awesome Website"
                  className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                A friendly name to identify your site in the dashboard.
              </p>
            </div>

            {/* Site URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Site URL *
              </label>
              <div className="relative">
                <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="https://mywebsite.com"
                  className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                The primary URL where your site is hosted.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Description
                <span className="text-gray-500 font-normal ml-1">(Optional)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="A brief description of your website..."
                rows={4}
                className="w-full px-4 py-4 bg-white/60 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                Help others understand what your site is about.
              </p>
            </div>

            {/* Features Preview */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What you'll get:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Key className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Unique API Key</p>
                    <p className="text-sm text-gray-600">Secure access to your widgets</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Widget Dashboard</p>
                    <p className="text-sm text-gray-600">Manage all your widgets</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Secure Integration</p>
                    <p className="text-sm text-gray-600">Safe and reliable connection</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Global CDN</p>
                    <p className="text-sm text-gray-600">Fast loading worldwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Button */}
            <div className="pt-6">
              <button
                onClick={handleCreate}
                disabled={loading || !isFormValid}
                className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 transform ${
                  loading || !isFormValid
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 hover:scale-[1.01] shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Site...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-5 h-5" />
                    <span>Create Site</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
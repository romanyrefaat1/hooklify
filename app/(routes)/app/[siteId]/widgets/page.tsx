"use client";

import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Copy, Edit, Trash2, Eye, Calendar, Globe, Code, Zap, Bell, ExternalLink, CheckCircle, X, ChevronDown, Settings, BarChart3, Layout, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock data - replace with actual API calls
const mockSite = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'My Awesome Website',
  site_url: 'https://myawesomewebsite.com',
  api_key: 'abc123-def456-ghi789'
};

const mockWidgets = [
  {
    id: '1',
    name: 'Welcome Toast',
    description: 'Shows a welcome message to new visitors',
    type: 'toast',
    created_at: '2024-01-15T10:30:00Z',
    site_id: mockSite.id,
    api_key: 'widget-key-001',
    href: '/widgets/welcome-toast',
    style: { position: 'top-right', theme: 'success' }
  },
  {
    id: '2',
    name: 'Discount Notification',
    description: 'Promote special offers and discounts',
    type: 'toast',
    created_at: '2024-01-20T14:15:00Z',
    site_id: mockSite.id,
    api_key: 'widget-key-002',
    href: '/widgets/discount-toast',
    style: { position: 'bottom-left', theme: 'warning' }
  },
  {
    id: '3',
    name: 'Cookie Consent',
    description: 'GDPR compliant cookie consent notification',
    type: 'toast',
    created_at: '2024-01-25T09:45:00Z',
    site_id: mockSite.id,
    api_key: 'widget-key-003',
    href: '/widgets/cookie-consent',
    style: { position: 'bottom-center', theme: 'info' }
  }
];

const availableWidgetTypes = [
  {
    id: 'toast',
    name: 'Toast Widget',
    description: 'Show notifications, announcements, and alerts to your users',
    icon: Bell,
    gradient: 'from-amber-400 to-orange-500',
    bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
    iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
    borderColor: 'border-amber-200',
    features: ['Multiple positions', 'Custom styling', 'Auto-dismiss', 'Click actions'],
    comingSoon: false
  },
  {
    id: 'modal',
    name: 'Modal Widget',
    description: 'Display popups, forms, and important messages in overlays',
    icon: Layout,
    gradient: 'from-blue-400 to-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600',
    borderColor: 'border-blue-200',
    features: ['Responsive design', 'Custom triggers', 'Form integration', 'Analytics'],
    comingSoon: true
  },
  {
    id: 'banner',
    name: 'Banner Widget',
    description: 'Show promotional banners and announcements at the top of pages',
    icon: BarChart3,
    gradient: 'from-emerald-400 to-green-500',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
    iconBg: 'bg-gradient-to-br from-emerald-400 to-green-500',
    borderColor: 'border-emerald-200',
    features: ['Sticky positioning', 'CTA buttons', 'Dismissible', 'A/B testing'],
    comingSoon: true
  }
];

export default function WidgetsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [widgetToDelete, setWidgetToDelete] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const filteredWidgets = mockWidgets.filter(widget => {
    const matchesSearch = widget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         widget.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || widget.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCopyApiKey = (apiKey) => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(apiKey);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDeleteWidget = (widget) => {
    setWidgetToDelete(widget);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log('Deleting widget:', widgetToDelete.id);
    setShowDeleteModal(false);
    setWidgetToDelete(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case 'toast': return 'default';
      case 'modal': return 'secondary';
      case 'banner': return 'outline';
      default: return 'secondary';
    }
  };

  const getWidgetTypeConfig = (type) => {
    return availableWidgetTypes.find(t => t.id === type) || availableWidgetTypes[0];
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200/50 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-600 text-sm font-medium">{mockSite.site_url}</span>
                </div>
                <div className="h-4 w-px bg-amber-200" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Widgets
                </h1>
              </div>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="h-4 w-4 mr-2" />
                Add Widget
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Available Widget Types */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Available Widget Types</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableWidgetTypes.map((widgetType) => {
                const IconComponent = widgetType.icon;
                return (
                  <Card key={widgetType.id} className={`relative hover:shadow-xl transition-all duration-300 ${widgetType.bgColor} ${widgetType.borderColor} border-2 group hover:scale-105`}>
                    {widgetType.comingSoon && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border border-yellow-300">
                          Coming Soon
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`${widgetType.iconBg} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-900">{widgetType.name}</CardTitle>
                          <CardDescription className="text-gray-600">{widgetType.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-6">
                        {widgetType.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm text-gray-700 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        className={`w-full ${widgetType.comingSoon 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : `bg-gradient-to-r ${widgetType.gradient} text-white hover:shadow-lg transition-all duration-200`
                        }`}
                        disabled={widgetType.comingSoon}
                      >
                        {widgetType.comingSoon ? 'Coming Soon' : 'Create Widget'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Existing Widgets */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Widgets</h2>
              <span className="text-sm text-gray-600 bg-white/60 px-3 py-1 rounded-full">
                {filteredWidgets.length} of {mockWidgets.length} widgets
              </span>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search widgets..."
                  className="pl-10 bg-white/70 backdrop-blur-sm border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40 bg-white/70 backdrop-blur-sm border-amber-200">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="toast">Toast</SelectItem>
                    <SelectItem value="modal">Modal</SelectItem>
                    <SelectItem value="banner">Banner</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="bg-white/70 backdrop-blur-sm border-amber-200 hover:bg-white/80">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Widgets Grid */}
            {filteredWidgets.length === 0 ? (
              <Card className="text-center py-12 bg-white/70 backdrop-blur-sm border-amber-200">
                <CardContent className="pt-6">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
                    <Zap className="h-8 w-8 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No widgets found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedType !== 'all'
                       ? "Try adjusting your search or filters"
                       : "Create your first widget to get started"
                    }
                  </p>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    Create Widget
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWidgets.map((widget) => {
                  const typeConfig = getWidgetTypeConfig(widget.type);
                  const IconComponent = typeConfig.icon;
                  
                  return (
                    <Card key={widget.id} className={`hover:shadow-xl transition-all duration-300 ${typeConfig.bgColor} ${typeConfig.borderColor} border-2 group hover:scale-105`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`${typeConfig.iconBg} p-2 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-200`}>
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-base text-gray-900">{widget.name}</CardTitle>
                              <Badge variant={getTypeBadgeVariant(widget.type)} className={`mt-1 ${
                                widget.type === 'toast' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                                widget.type === 'modal' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                'bg-emerald-100 text-emerald-800 border-emerald-300'
                              }`}>
                                {widget.type}
                              </Badge>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-white/50">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Code className="h-4 w-4 mr-2" />
                                Integration
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteWidget(widget)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardDescription className="line-clamp-2 text-gray-600">
                          {widget.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(widget.created_at)}</span>
                        </div>
                                             
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="hover:bg-white/50"
                                  onClick={() => handleCopyApiKey(widget.api_key)}
                                >
                                  {copiedKey === widget.api_key ? (
                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy API Key</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="hover:bg-white/50">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit Widget</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="hover:bg-white/50">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Preview Widget</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50/50"
                                onClick={() => handleDeleteWidget(widget)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Widget</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Widget</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{widgetToDelete?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowDeleteModal(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
"use client";

import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Copy, Edit, Trash2, Eye, Calendar, Globe, Code, Zap, Bell, ExternalLink, CheckCircle, X, ChevronDown, Settings, BarChart3 } from 'lucide-react';
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
    color: 'bg-primary',
    features: ['Multiple positions', 'Custom styling', 'Auto-dismiss', 'Click actions'],
    comingSoon: false
  },
  {
    id: 'modal',
    name: 'Modal Widget',
    description: 'Display popups, forms, and important messages in overlays',
    icon: Eye,
    color: 'bg-secondary',
    features: ['Responsive design', 'Custom triggers', 'Form integration', 'Analytics'],
    comingSoon: true
  },
  {
    id: 'banner',
    name: 'Banner Widget',
    description: 'Show promotional banners and announcements at the top of pages',
    icon: BarChart3,
    color: 'bg-success',
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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-text-secondary" />
                  <span className="text-text-secondary text-sm">{mockSite.site_url}</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <h1 className="text-2xl font-bold text-text-primary">Widgets</h1>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
              <h2 className="text-xl font-semibold text-text-primary">Available Widget Types</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableWidgetTypes.map((widgetType) => {
                const IconComponent = widgetType.icon;
                return (
                  <Card key={widgetType.id} className="relative hover:shadow-md transition-shadow">
                    {widgetType.comingSoon && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge variant="secondary" className="bg-warning text-white">
                          Coming Soon
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`${widgetType.color} p-2 rounded-lg`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-lg">{widgetType.name}</CardTitle>
                      </div>
                      <CardDescription>{widgetType.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {widgetType.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-sm text-text-secondary">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className="w-full"
                        variant={widgetType.comingSoon ? "secondary" : "default"}
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
              <h2 className="text-xl font-semibold text-text-primary">Your Widgets</h2>
              <span className="text-sm text-text-secondary">
                {filteredWidgets.length} of {mockWidgets.length} widgets
              </span>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                  placeholder="Search widgets..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="toast">Toast</SelectItem>
                    <SelectItem value="modal">Modal</SelectItem>
                    <SelectItem value="banner">Banner</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Widgets Grid */}
            {filteredWidgets.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent className="pt-6">
                  <div className="mx-auto w-24 h-24 bg-input rounded-full flex items-center justify-center mb-4">
                    <Zap className="h-8 w-8 text-text-muted" />
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">No widgets found</h3>
                  <p className="text-text-secondary mb-4">
                    {searchTerm || selectedType !== 'all' 
                      ? "Try adjusting your search or filters" 
                      : "Create your first widget to get started"
                    }
                  </p>
                  <Button>Create Widget</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWidgets.map((widget) => (
                  <Card key={widget.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <Bell className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{widget.name}</CardTitle>
                            <Badge variant={getTypeBadgeVariant(widget.type)} className="mt-1">
                              {widget.type}
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
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
                              className="text-destructive"
                              onClick={() => handleDeleteWidget(widget)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {widget.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2 text-xs text-text-muted mb-4">
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
                                onClick={() => handleCopyApiKey(widget.api_key)}
                              >
                                {copiedKey === widget.api_key ? (
                                  <CheckCircle className="h-4 w-4 text-success" />
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
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Widget</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm">
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
                              className="text-destructive hover:text-destructive"
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
                ))}
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
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
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
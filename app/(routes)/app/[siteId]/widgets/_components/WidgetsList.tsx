"use client";

import React, { useState } from 'react';
import {
  MoreHorizontal,
  Copy,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Code,
  Zap,
  CheckCircle,
  Bell,
  Layout,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSiteWidgets } from '@/contexts/SiteWidgetsContext';

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

export default function WidgetsList({ searchTerm, selectedType }: { searchTerm: string, selectedType: string }) {
  const { widgets } = useSiteWidgets();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [widgetToDelete, setWidgetToDelete] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const filteredWidgets = widgets.filter(widget => {
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
      <div>
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
                <Card key={widget.id} className={`hover:shadow-xl transition-all duration-300 ${typeConfig.bgColor} ${typeConfig.borderColor} border-2 group hover:scale-[1.01]`}>
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
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import SearchInput from '@/components/search-input';
import Link from 'next/link';
import { useSiteWidgets } from '@/contexts/SiteWidgetsContext';

export default function WidgetsHeader({ 
  selectedType, 
  onTypeChange=()=>{}, 
  showFilters = false 
}: { selectedType: string, onTypeChange?: (type: string) => void, showFilters?: boolean }) {
  const { siteId, widgets } = useSiteWidgets();
  const totalCount = widgets.length;
  const filteredCount = widgets.filter(widget => selectedType === 'all' || widget.type === selectedType).length;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="">Your Widgets</h1>
        <span className="text-sm text-gray-600 bg-white/60 px-3 py-1 rounded-full">
          {filteredCount} of {totalCount} widgets
        </span>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative w-full flex justify-between items-center gap-2">
          <SearchInput className="w-full" placeholder="Search widgets..." />
          {siteId && (
            <Link href={`/app/${siteId}/widgets/new`}>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                Create Widget
              </Button>
            </Link>
          )}
        </div>
        {showFilters && (
          <div className="flex space-x-2">
            <Select value={selectedType} onValueChange={onTypeChange}>
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
        )}
      </div>
    </div>
  );
}
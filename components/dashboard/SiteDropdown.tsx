"use client";

import { useEffect, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserSiteContext, useUserSites } from '@/contexts/UserSites';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';
import { useParams } from 'next/navigation';

export function SiteDropdown() {
  const {sites, loading, error} = useUserSites()
  const {siteId} = useParams<{siteId: string}>()
  const [selectedSite, setSelectedSite] = useState<UserSiteContext | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(()=> {
    const site = sites.find(site => site.id === siteId)
    if (site) {
      setSelectedSite(site)
    }
  },[sites])

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="p-1 hover:bg-gray-200 rounded transition-all duration-200 hover:scale-105 focus:outline-none">
        <ChevronDown 
          size={14} 
          className={cn(
            "transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-48 bg-white border border-gray-200 shadow-lg rounded-lg p-1 animate-in slide-in-from-top-2 duration-200"
        align="end"
      >
        {loading && [1,2,3,4].map((site) => (
          <DropdownMenuItem
          key={site}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all duration-150",
            "hover:bg-[var(--color-primary-muted)] hover:text-[var(--color-primary-dark)]",
            "focus:bg-[var(--color-primary-muted)] focus:text-[var(--color-primary-dark)]",
          )}
        >
          <Skeleton className="h-10" />
        </DropdownMenuItem>
        ))}
        {!loading && !error && sites.map((site) => (
          <Link
            key={site.id}
            href={`/app/${site.id}`}
            className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all duration-150"
            onClick={() => setSelectedSite(site)}
          >
            <DropdownMenuItem
            key={site.id}
            onClick={() => setSelectedSite(site)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all duration-150",
              "hover:bg-[var(--color-primary-muted)] hover:text-[var(--color-primary-dark)]",
              "focus:bg-[var(--color-primary-muted)] focus:text-[var(--color-primary-dark)]",
              selectedSite?.id === site.id && "bg-[var(--color-primary-muted)] text-[var(--color-primary-dark)]"
            )}
          >
            <Globe size={16} className="flex-shrink-0" />
            <span className="flex-1 text-sm">{site.name}</span>
            {selectedSite?.id === site.id && (
              <Check size={16} className="flex-shrink-0 text-[var(--color-primary)]" />
            )}
          </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

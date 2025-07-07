import { useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const sites = [
  { value: 'site1', label: 'Main Site' },
  { value: 'site2', label: 'Blog Site' },
  { value: 'site3', label: 'E-commerce' },
  { value: 'site4', label: 'Portfolio' },
];

export function SiteDropdown() {
  const [selectedSite, setSelectedSite] = useState(sites[0]);
  const [open, setOpen] = useState(false);

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
        {sites.map((site) => (
          <DropdownMenuItem
            key={site.value}
            onClick={() => setSelectedSite(site)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all duration-150",
              "hover:bg-[var(--color-primary-muted)] hover:text-[var(--color-primary-dark)]",
              "focus:bg-[var(--color-primary-muted)] focus:text-[var(--color-primary-dark)]",
              selectedSite.value === site.value && "bg-[var(--color-primary-muted)] text-[var(--color-primary-dark)]"
            )}
          >
            <Globe size={16} className="flex-shrink-0" />
            <span className="flex-1 text-sm">{site.label}</span>
            {selectedSite.value === site.value && (
              <Check size={16} className="flex-shrink-0 text-[var(--color-primary)]" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

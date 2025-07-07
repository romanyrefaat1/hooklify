"use client";

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  Home,
  Globe,
  Calendar,
  Code,
  Book,
  Key,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  User,
  Plus,
  Icon,
} from 'lucide-react';
import { SiteDropdown } from './SiteDropdown';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserSites } from '@/contexts/UserSites';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  href?: string;
}

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

export default function Sidebar({ onToggle }: SidebarProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [developerExpanded, setDeveloperExpanded] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const developerContentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname(); // e.g. "/dashboard/settings"
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentPathSegment = pathSegments[2];

  const {currSite, loading, error} = useUserSites()


  
  console.log("Current Path Segment: ", currentPathSegment);

  const sidebarItems = [
    { icon: Home, label: 'Get started', active: currentPathSegment === undefined, href: "/" },
    // { icon: Globe, label: 'Websites' },
    { icon: Globe, label: 'Widgets', active: currentPathSegment === "widgets", href: "/widgets" },
    { icon: Calendar, label: 'Events', active: currentPathSegment === "events", href: "/events" },
  ];

  const developerItems = [
    { icon: Book, label: 'Documentation', active: currentPathSegment === "docs", href: "/docs" },
    { icon: Key, label: 'API Keys', active: currentPathSegment === "api-keys", href: "/api-keys" },
    { icon: Settings, label: 'Settings', active: currentPathSegment === "settings", href: "/settings" },
  ];

  const toggleSidebar = () => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const newCollapsedState = !sidebarCollapsed;

    if (newCollapsedState) {
      // Collapse sidebar
      gsap.to('.sidebar-text', {
        opacity: 0,
        duration: 0.1,
      });
      gsap.to(sidebar, {
        width: '4rem',
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      // Expand sidebar
      gsap.to(sidebar, {
        width: '16rem',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to('.sidebar-text', {
        opacity: 1,
        duration: 0.2,
        delay: 0.1,
      });
    }

    setSidebarCollapsed(newCollapsedState);
    
    // Notify parent component
    if (onToggle) {
      onToggle(newCollapsedState);
    }
    
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('sidebarToggle', {
      detail: { collapsed: newCollapsedState }
    }));
  };

  const toggleDeveloperSection = () => {
    if (sidebarCollapsed) return;

    const content = developerContentRef.current;
    if (!content) return;

    if (developerExpanded) {
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      gsap.set(content, { height: 'auto' });
      const height = content.offsetHeight;
      gsap.set(content, { height: 0, opacity: 0 });
      gsap.to(content, {
        height: height,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    setDeveloperExpanded(!developerExpanded);
  };

  const toggleMobileMenu = () => {
    const menu = mobileMenuRef.current;
    const overlay = overlayRef.current;

    if (!menu || !overlay) return;

    if (mobileMenuOpen) {
      gsap.to(overlay, {
        opacity: 0,
        backdropFilter: 'blur(0px)',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(menu, {
        x: '-100%',
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          overlay.style.pointerEvents = 'none';
        },
      });
    } else {
      overlay.style.pointerEvents = 'auto';
      gsap.to(overlay, {
        opacity: 1,
        backdropFilter: 'blur(1px)',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(menu, {
        x: '0%',
        duration: 0.4,
        ease: 'power2.out',
      });
    }

    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleOverlayClick = () => {
    if (mobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/30 z-40 lg:hidden opacity-0 pointer-events-none backdrop-blur-0"
        onClick={handleOverlayClick}
      />
      
      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="fixed left-0 top-0 h-full w-64 bg-[var(--bg-surface)] z-50 lg:hidden transform -translate-x-full rounded-r-3xl shadow-2xl custom-scrollbar"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-[var(--color-primary)] font-display">Hooklify</h1>
            <button
              onClick={toggleMobileMenu}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <div key={index} className={`sidebar-item ${item.active ? 'active' : ''}`}>
                {loading || !currSite ? (
                  <span className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                    {/* {currSite} */}
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </span>
                ) : (
                  <Link href={`/app/${currSite.id}${item.href}`} prefetch={false} className='w-full flex gap-4 items-center'>
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-4">
              <div
                className="flex items-center justify-between sidebar-item"
                onClick={() => setDeveloperExpanded(!developerExpanded)}
              >
                <div className="flex items-center gap-3">
                  <Code size={20} />
                  <span className="font-medium">Developer</span>
                </div>
                {developerExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>

              {developerExpanded && (
                <div className="ml-6 mt-2 space-y-2">
                  {developerItems.map((item, index) => (
                    <div key={index} className="sidebar-item">
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="font-medium text-sm flex-1">Site Name</span>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                  <Plus size={14} />
                </button>
                <SiteDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        ref={sidebarRef}
        className="hidden lg:block fixed left-4 top-4 bottom-4 w-64 bg-[var(--bg-surface)] rounded-3xl shadow-lg z-30 overflow-hidden custom-scrollbar"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8 flex-shrink-0">
            <h1 className={`text-2xl font-bold text-[var(--color-primary)] font-display transition-opacity duration-200 ${sidebarCollapsed ? 'sidebar-text opacity-0' : ''}`}>
              {!sidebarCollapsed && 'Hooklify'}
            </h1>
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Menu size={20} />
            </button>
          </div>

          <nav className="space-y-2 mb-8 flex-1">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--text-secondary)] transition-all duration-200 cursor-pointer ${
                  item.active
                    ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary-dark)] font-medium'
                    : 'hover:bg-[var(--color-primary-muted)]/90 hover:text-[var(--color-primary-dark)]'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                <item.icon size={20} className="flex-shrink-0" />
                <span className={`font-medium sidebar-text transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                  {item.label}
                </span>
              </div>
            ))}

            <div className="pt-4">
              <div
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-[var(--text-secondary)] transition-all duration-200 cursor-pointer hover:bg-[var(--color-primary-muted)]/90 hover:text-[var(--color-primary-dark)] ${sidebarCollapsed ? 'justify-center' : ''}`}
                onClick={toggleDeveloperSection}
              >
                <div className="flex items-center gap-3">
                  <Code size={20} className="flex-shrink-0" />
                  <span className={`font-medium sidebar-text transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                    Developer
                  </span>
                </div>
                {!sidebarCollapsed && (
                  <div className="sidebar-text transition-opacity duration-200">
                    {developerExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                )}
              </div>

              <div
                ref={developerContentRef}
                className={`ml-6 mt-2 space-y-2 overflow-hidden ${sidebarCollapsed ? 'hidden' : ''}`}
                style={{ height: developerExpanded ? 'auto' : '0' }}
              >
                {developerItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--text-secondary)] transition-all duration-200 cursor-pointer hover:bg-[var(--color-primary-muted)]/90 hover:text-[var(--color-primary-dark)]"
                  >
                    <item.icon size={18} className="flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </nav>

          <div className="mt-auto flex-shrink-0">
            <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${sidebarCollapsed ? 'justify-center bg-transparent' : 'bg-gray-50'}`}>
              <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white" />
              </div>
              <div className={`flex-1 sidebar-text transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                <span className="font-medium text-sm">Site Name</span>
              </div>
              <div className={`flex items-center gap-1 sidebar-text transition-opacity duration-200 ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                  <Plus size={14} />
                </button>
                <SiteDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* This button is for mobile view to open the sidebar */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 right-4 z-40 p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-[4px]"
      >
        <Menu size={24} />
      </button>
    </>
  );
}
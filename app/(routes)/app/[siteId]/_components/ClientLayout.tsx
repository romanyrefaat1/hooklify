// components/ClientLayout.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Sidebar from '@/components/dashboard/Sidebar';
import { notFound, useParams } from 'next/navigation';
import { useUserSites } from '@/contexts/UserSites';
import { useIsMobile } from '@/hooks/use-mobile';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { siteId } = useParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { currSite, loading, error } = useUserSites();
  const isMobile = useIsMobile();
  
  // Check if screen is medium or smaller (we want GSAP only on large screens)
  const isSmallOrMediumScreen = isMobile || (typeof window !== 'undefined' && window.innerWidth < 1024);

  console.log('🔍 ClientLayout render - isMobile:', isMobile, 'isSmallOrMediumScreen:', isSmallOrMediumScreen, 'sidebarCollapsed:', sidebarCollapsed);

  // Listen for sidebar collapse events
  useEffect(() => {
    console.log('🔧 useEffect triggered - isMobile:', isMobile, 'isSmallOrMediumScreen:', isSmallOrMediumScreen, 'contentRef:', !!contentRef.current);
    
    const handleSidebarToggle = (event: CustomEvent) => {
      console.log('📱 Sidebar toggle event received:', event.detail);
      const isCollapsed = event.detail.collapsed;
      setSidebarCollapsed(isCollapsed);
      
      const content = contentRef.current;
      console.log('📱 Content element exists:', !!content, 'isSmallOrMediumScreen:', isSmallOrMediumScreen);
      if (!content) return;

      // Only animate content margin on large screens (desktop)
      if (!isSmallOrMediumScreen) {
        console.log('🎬 Running GSAP animation - marginLeft:', isCollapsed ? '5rem' : '17rem');
        gsap.to(content, {
          marginLeft: isCollapsed ? '7rem' : '18rem', // 4rem sidebar + 1rem gap when collapsed, 16rem sidebar + 1rem gap when expanded
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        console.log('❌ Skipping GSAP animation on small/medium screens');
      }
    };

    // Only set up GSAP animations on large screens
    if (!isSmallOrMediumScreen) {
      console.log('🖥️ Setting up GSAP for large screens');
      // Listen for custom sidebar toggle events
      window.addEventListener('sidebarToggle', handleSidebarToggle as EventListener);
      
      // Set initial margin based on default sidebar state
      const content = contentRef.current;
      if (content) {
        console.log('🎯 Setting initial GSAP margin to 17rem');
        gsap.set(content, {
          marginLeft: '17rem', // Default expanded state
        });
      } else {
        console.log('❌ Content element not found for initial GSAP setup');
      }
    } else {
      console.log('📱 Small/Medium screen detected - clearing GSAP styles and skipping setup');
      // Clear any existing GSAP styles on small/medium screens
      const content = contentRef.current;
      if (content) {
        console.log('🧹 Clearing GSAP marginLeft properties');
        gsap.set(content, {
          clearProps: 'marginLeft'
        });
      } else {
        console.log('❌ Content element not found for GSAP cleanup');
      }
    }

    return () => {
      if (!isSmallOrMediumScreen) {
        console.log('🧼 Cleanup: removing event listener');
        window.removeEventListener('sidebarToggle', handleSidebarToggle as EventListener);
      } else {
        console.log('📱 Cleanup: no event listener to remove (small/medium screen)');
      }
    };
  }, [isMobile, isSmallOrMediumScreen]); // Add both to dependency array

  useEffect(() => {
    console.log("💾 Site storage effect - currSite:", currSite, "siteId:", siteId);
    if (siteId && currSite) {
      console.log("💾 Storing last active website ID:", siteId);
      localStorage.setItem('last-active-website-id', siteId as string);
    }
  }, [siteId, currSite]);

  if (!loading && (!currSite || error)) {
    console.log("🚫 Returning notFound - loading:", loading, "currSite:", !!currSite, "error:", error);
    return notFound();
  }
  
  console.log("🎨 Rendering ClientLayout - isMobile:", isMobile, "isSmallOrMediumScreen:", isSmallOrMediumScreen);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] font-sans custom-scrollbar overflow-x-hidden">
      {/* Sidebar Component */}
      <Sidebar onToggle={setSidebarCollapsed} />
      
      {/* Main Content Area */}
      <div
        ref={contentRef}
        className="min-h-screen transition-all duration-300 ml-0 lg:ml-24"
      >
        {children}
      </div>
    </div>
  );
}
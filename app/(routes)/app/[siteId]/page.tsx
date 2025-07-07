"use client";

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Sidebar from '@/components/dashboard/Sidebar';
import Dashboard from '@/components/dashboard/Dashboard';
import { useParams } from 'next/navigation';

export default function AppLayout() {
  const { siteId } = useParams();
  useEffect(() => {
    if (siteId) {
      localStorage.setItem('last-active-website-id', siteId as string);
    }
  }, [siteId]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Listen for sidebar collapse events
  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => {
      const isCollapsed = event.detail.collapsed;
      setSidebarCollapsed(isCollapsed);
      
      const content = contentRef.current;
      if (!content) return;

      // Animate content margin based on sidebar state
      gsap.to(content, {
        marginLeft: isCollapsed ? '5rem' : '17rem', // 4rem sidebar + 1rem gap when collapsed, 16rem sidebar + 1rem gap when expanded
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    // Listen for custom sidebar toggle events
    window.addEventListener('sidebarToggle', handleSidebarToggle as EventListener);
    
    // Set initial margin based on default sidebar state
    const content = contentRef.current;
    if (content) {
      gsap.set(content, {
        marginLeft: '17rem', // Default expanded state
      });
    }

    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] font-sans custom-scrollbar overflow-x-hidden">
      {/* Sidebar Component */}
      <Sidebar onToggle={setSidebarCollapsed} />
      
      {/* Main Content Area */}
      <div
        ref={contentRef}
        className="min-h-screen transition-all duration-300 ml-0 lg:ml-24"
      >
        <Dashboard />
      </div>
    </div>
  );
}
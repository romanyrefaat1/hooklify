"use client";

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Home, 
  Globe, 
  Calendar, 
  FileText, 
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
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  Database,
  Webhook
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SiteDropdown } from '@/components/SiteDropdown';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [developerExpanded, setDeveloperExpanded] = useState(true);
  const [missOutExpanded, setMissOutExpanded] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const developerContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animations
    gsap.from('.fade-in', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    });
  }, []);

  const toggleSidebar = () => {
    const sidebar = sidebarRef.current;
    const content = contentRef.current;
    
    if (!sidebar || !content) return;

    if (sidebarCollapsed) {
      // Expand sidebar
      gsap.to(sidebar, {
        width: '16rem',
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to('.sidebar-text', {
        opacity: 1,
        duration: 0.2,
        delay: 0.1
      });
      gsap.to(content, {
        marginLeft: '17rem',
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      // Collapse sidebar
      gsap.to('.sidebar-text', {
        opacity: 0,
        duration: 0.1
      });
      gsap.to(sidebar, {
        width: '4rem',
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(content, {
        marginLeft: '5rem',
        duration: 0.3,
        ease: "power2.out"
      });
    }
    
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleDeveloperSection = () => {
    if (sidebarCollapsed) return;
    
    const content = developerContentRef.current;
    if (!content) return;

    if (developerExpanded) {
      // Collapse
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      // Expand
      gsap.set(content, { height: 'auto' });
      const height = content.offsetHeight;
      gsap.set(content, { height: 0, opacity: 0 });
      gsap.to(content, {
        height: height,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
    
    setDeveloperExpanded(!developerExpanded);
  };

  const toggleMobileMenu = () => {
    const menu = mobileMenuRef.current;
    const overlay = overlayRef.current;
    
    if (!menu || !overlay) return;

    if (mobileMenuOpen) {
      // Close menu
      gsap.to(overlay, {
        opacity: 0,
        backdropFilter: 'blur(0px)',
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(menu, {
        x: '-100%',
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          overlay.style.pointerEvents = 'none';
        }
      });
    } else {
      // Open menu
      overlay.style.pointerEvents = 'auto';
      gsap.to(overlay, {
        opacity: 1,
        backdropFilter: 'blur(8px)',
        duration: 0.3,
        ease: "power2.out"
      });
      gsap.to(menu, {
        x: '0%',
        duration: 0.4,
        ease: "power2.out"
      });
    }
    
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when clicking overlay
  const handleOverlayClick = () => {
    if (mobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  const sidebarItems = [
    { icon: Home, label: 'Get started', active: true },
    { icon: Globe, label: 'Websites' },
    { icon: Calendar, label: 'Events' },
    { icon: Calendar, label: 'Events' },
  ];

  const developerItems = [
    { icon: Book, label: 'Documentation' },
    { icon: Key, label: 'API Keys' },
    { icon: Settings, label: 'Settings' },
  ];

  const setupTasks = [
    {
      id: 1,
      title: 'Create your first website',
      description: 'Set up your first website to start receiving webhooks',
      icon: Globe,
      status: 'completed',
      steps: '1 Step',
      estimatedTime: null
    },
    {
      id: 2,
      title: 'Configure webhook endpoints',
      description: 'Add your webhook URLs to start receiving events',
      icon: Webhook,
      status: 'completed',
      steps: '1 Step',
      estimatedTime: null
    },
    {
      id: 3,
      title: 'Test your integration',
      description: 'Send a test webhook to verify your setup',
      icon: Zap,
      status: 'pending',
      steps: '2 Steps',
      estimatedTime: '5 min'
    },
    {
      id: 4,
      title: 'Set up event logging',
      description: 'Configure event logging for better debugging',
      icon: Database,
      status: 'pending',
      steps: '1 Step',
      estimatedTime: '3 min'
    },
  ];

  const completedTasks = setupTasks.filter(task => task.status === 'completed').length;
  const totalTasks = setupTasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  const recentLogs = [
    { id: 'event_123', createdOn: '6 Jul 29, 8:20:35 pm', type: 'new_signup' },
    { id: 'event_123', createdOn: '6 Jul 29, 8:20:35 pm', type: 'new_signup' },
    { id: 'event_123', createdOn: '6 Jul 29, 8:20:35 pm', type: 'new_signup' },
    { id: 'event_123', createdOn: '6 Jul 29, 8:20:35 pm', type: 'new_signup' },
  ];

  const getStatusIcon = (status: string) => {
    if (status === 'completed') {
      return <CheckCircle2 size={16} className="text-green-500" />;
    }
    return <Clock size={16} className="text-amber-500" />;
  };

  const getStatusBadge = (status: string, estimatedTime?: string | null) => {
    if (status === 'completed') {
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>;
    }
    if (estimatedTime) {
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">{estimatedTime}</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Pending</Badge>;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] font-inter custom-scrollbar overflow-x-hidden">
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
            <h1 className="text-2xl font-bold text-[var(--color-primary)]">Hooklify</h1>
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
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
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
          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-shrink-0">
            <h1 className={`text-2xl font-bold text-[var(--color-primary)] transition-opacity duration-200 ${sidebarCollapsed ? 'sidebar-text opacity-0' : ''}`}>
              {!sidebarCollapsed && 'Hooklify'}
            </h1>
            <button 
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Menu size={20} />
            </button>
          </div>
          
          {/* Navigation */}
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
            
            {/* Developer Section */}
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
          
          {/* Site Name */}
          <div className="flex-shrink-0">
            <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white" />
              </div>
              <span className={`font-medium text-sm sidebar-text transition-opacity duration-200 flex-1 ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                Site Name
              </span>
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2 sidebar-text transition-opacity duration-200">
                  <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                    <Plus size={14} />
                  </button>
                  <SiteDropdown />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        ref={contentRef}
        className="lg:ml-72 min-h-screen transition-all duration-300"
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 p-4 bg-[var(--bg-surface)] border-b">
          <button onClick={toggleMobileMenu} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu size={16} />
          </button>
          <h1 className="text-xl font-bold text-[var(--color-primary)]">Hooklify</h1>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-12 fade-in">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: 'Merriweather, serif' }}>
                    Hello Developer,
                  </h1>
                  <p className="text-xl text-[var(--text-primary)] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>
                    Let's get you set up for webhook success!
                  </p>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm">
                    <User size={16} />
                    <span>Welcome back to your dashboard</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)] text-sm px-4 py-2">
                    {completedTasks}/{totalTasks} steps completed
                  </Badge>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                <div 
                  className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Setup Tasks */}
            <div className="mb-12 fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {setupTasks.map((task, index) => (
                  <Card 
                    key={task.id} 
                    className={`group hover:shadow-md transition-all duration-200 cursor-pointer border ${
                      task.status === 'completed' 
                        ? 'border-green-200 bg-green-50/50' 
                        : 'border-gray-200 hover:border-[var(--color-primary)]/30'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          task.status === 'completed' 
                            ? 'bg-green-100' 
                            : 'bg-[var(--color-primary-muted)]'
                        }`}>
                          <task.icon 
                            size={20} 
                            className={
                              task.status === 'completed' 
                                ? 'text-green-600' 
                                : 'text-[var(--color-primary-dark)]'
                            } 
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-[var(--text-primary)] text-lg group-hover:text-[var(--color-primary-dark)] transition-colors">
                              {task.title}
                            </h3>
                            {getStatusIcon(task.status)}
                          </div>
                          
                          <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed">
                            {task.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-[var(--text-muted)] font-medium">
                                {task.steps}
                              </span>
                              {getStatusBadge(task.status, task.estimatedTime)}
                            </div>
                            
                            {task.status === 'pending' && (
                              <ArrowRight 
                                size={16} 
                                className="text-[var(--color-primary)] group-hover:translate-x-1 transition-transform" 
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Logs */}
            <div className="fade-in">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
                Your recent logs
              </h2>
              
              <div className="hooklify-card">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-[var(--text-primary)]">ID</th>
                        <th className="text-left py-4 px-4 font-semibold text-[var(--text-primary)]">Created On</th>
                        <th className="text-left py-4 px-4 font-semibold text-[var(--text-primary)]">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentLogs.map((log, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 text-[var(--text-secondary)]">{log.id}</td>
                          <td className="py-4 px-4 text-[var(--text-secondary)]">{log.createdOn}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-primary-muted)] text-[var(--color-primary-dark)]">
                              {log.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Calendar, 
  Code, 
  Book, 
  Key, 
  Settings, 
  CheckCircle2,
  Clock,
  Webhook,
  Zap,
  Database,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DashboardRecentLogs from "./DashboardRecentLogs"
import DashboardHeader from './DashboardHeader';

export default function Dashboard() {
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

  return (
    <div className="w-full bg-[var(--bg-page)] font-sans custom-scrollbar">
      {/* Main Content */}
      <div className="container">
        <DashboardHeader 
          completedTasks={completedTasks} 
          totalTasks={totalTasks} 
          progressPercentage={progressPercentage} 
        />

        <main className="mt-8">
          {/* Quick Stats */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="fade-in bg-[var(--bg-surface)] border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Total Webhooks</CardTitle>
                <Webhook className="h-4 w-4 text-[var(--text-secondary)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[var(--text-primary)]">12,345</div>
                <p className="text-xs text-[var(--text-tertiary)]">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card className="fade-in bg-[var(--bg-surface)] border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Successful Events</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[var(--text-primary)]">11,987</div>
                <p className="text-xs text-[var(--text-tertiary)]">97.1% success rate</p>
              </CardContent>
            </Card>
            <Card className="fade-in bg-[var(--bg-surface)] border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Failed Events</CardTitle>
                <X size={16} className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[var(--text-primary)]">358</div>
                <p className="text-xs text-[var(--text-tertiary)]">2.9% failure rate</p>
              </CardContent>
            </Card>
            <Card className="fade-in bg-[var(--bg-surface)] border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Avg. Delivery Time</CardTitle>
                <Clock className="h-4 w-4 text-[var(--text-secondary)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[var(--text-primary)]">250ms</div>
                <p className="text-xs text-[var(--text-tertiary)]">-10ms from yesterday</p>
              </CardContent>
            </Card>
          </div> */}

          <div className="mt-8 grid grid-cols-1 lg:grid-cols3 gap-8">
            {/* Setup Tasks */}
            {/* <div className="lg:col-span-2">
              <DashboardSetupTasks 
                setupTasks={setupTasks} 
                completedTasks={completedTasks} 
                totalTasks={totalTasks} 
                progressPercentage={progressPercentage} 
                getStatusIcon={getStatusIcon} 
                getStatusBadge={getStatusBadge} 
              />
            </div> */}

            {/* Recent Logs */}
            <div>
              <DashboardRecentLogs />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
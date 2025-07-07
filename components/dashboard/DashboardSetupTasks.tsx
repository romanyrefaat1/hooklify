// Server Component: Setup Tasks List
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SetupTask {
  id: number;
  title: string;
  description: string;
  icon: any;
  status: string;
  steps: string;
  estimatedTime?: string | null;
}

interface DashboardSetupTasksProps {
  setupTasks: SetupTask[];
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusBadge: (status: string, estimatedTime?: string | null) => React.ReactNode;
}

export default function DashboardSetupTasks({ setupTasks, getStatusIcon, getStatusBadge }: DashboardSetupTasksProps) {
  return (
    <div className="mb-12 fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {setupTasks.map((task) => (
          <Card
            key={task.id}
            className={`group hover:shadow-md transition-all duration-200 cursor-pointer border ${
              task.status === 'completed'
                ? 'border-green-200 bg-green-50/50'
                : 'border-gray-200 hover:border-color-primary/30'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  task.status === 'completed'
                    ? 'bg-green-100'
                    : 'bg-color-primary-muted'
                }`}>
                  <task.icon
                    size={20}
                    className={
                      task.status === 'completed'
                        ? 'text-green-600'
                        : 'text-color-primary-dark'
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-text-primary text-lg group-hover:text-color-primary-dark transition-colors font-display">
                      {task.title}
                    </h3>
                    {getStatusIcon(task.status)}
                  </div>
                  <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
                        {task.steps}
                      </span>
                      {getStatusBadge(task.status, task.estimatedTime)}
                    </div>
                    {task.status === 'pending' && (
                      <ArrowRight
                        size={16}
                        className="text-color-primary group-hover:translate-x-1 transition-transform"
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
  );
}

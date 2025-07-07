import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser } from '@/actions/users/getCurrentUser';
import { useUser } from '@/contexts/AuthContext';

interface DashboardHeaderProps {
  completedTasks: number;
  totalTasks: number;
  progressPercentage: number;
}

export default function DashboardHeader({ completedTasks, totalTasks, progressPercentage }: DashboardHeaderProps) {
  const {user} = useUser();
  return (
    <div className="mb-12 fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-2 font-display tracking-tight">
            Hello {user?.full_name ? user?.full_name : user?.email},
          </h1>
          {/* <p className="text-xl text-text-primary mb-1 font-display font-medium">
            Let's get you set up for webhook success!
          </p> */}
        </div>
        {/* <div className="flex items-center gap-4">
          <Badge className="bg-color-primary text-white hover:bg-color-primary text-sm px-4 py-2 font-medium">
            {completedTasks}/{totalTasks} steps completed
          </Badge>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="bg-color-primary h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>*/}
      </div>
    </div>
  );
}


import React from 'react';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBoard } from '@/context/BoardContext';
import TaskDialog from '@/components/task/TaskDialog';

interface AppHeaderProps {
  className?: string;
  onCreateTask: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ className, onCreateTask }) => {
  const { activeSprint } = useBoard();

  return (
    <header className={cn(
      "px-6 h-16 border-b border-border flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-sm",
      className
    )}>
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-medium">Project Board</h1>
        {activeSprint && (
          <div className="ml-4 px-2 py-0.5 bg-secondary rounded text-xs uppercase tracking-wider">
            {activeSprint.name}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          onClick={onCreateTask}
          className="flex items-center space-x-1.5"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;

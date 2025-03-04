
import React from 'react';
import { Task, useBoard } from '@/context/BoardContext';
import TaskCard from '@/components/task/TaskCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface BacklogViewProps {
  onTaskEdit: (task: Task) => void;
  onCreateTask: () => void;
}

const BacklogView: React.FC<BacklogViewProps> = ({ onTaskEdit, onCreateTask }) => {
  const { backlogTasks, sprints, activeSprint, assignTaskToSprint } = useBoard();
  
  const handleAssignToSprint = (taskId: string, sprintId: string) => {
    assignTaskToSprint(taskId, sprintId);
  };
  
  if (backlogTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <h3 className="text-lg font-medium mb-2">Backlog is Empty</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Add tasks to your backlog to plan your work.
        </p>
        <Button onClick={onCreateTask}>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Task
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Backlog</h2>
        <Button onClick={onCreateTask} size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {backlogTasks.map((task) => (
          <div key={task.id} className="flex flex-col h-full">
            <TaskCard task={task} onEdit={onTaskEdit} />
            
            {activeSprint && (
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleAssignToSprint(task.id, activeSprint.id)}
                >
                  Add to Active Sprint
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BacklogView;

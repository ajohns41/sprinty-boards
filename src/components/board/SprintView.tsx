
import React from 'react';
import { Sprint, Task, useBoard } from '@/context/BoardContext';
import TaskCard from '@/components/task/TaskCard';
import SprintHeader from '@/components/sprint/SprintHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface SprintViewProps {
  sprintId: string;
  onTaskEdit: (task: Task) => void;
  onCreateTask: () => void;
  onEditSprint: (sprint: Sprint) => void;
}

const SprintView: React.FC<SprintViewProps> = ({ 
  sprintId, 
  onTaskEdit, 
  onCreateTask, 
  onEditSprint 
}) => {
  const { tasks, sprints, removeTaskFromSprint } = useBoard();
  
  const sprint = sprints.find(s => s.id === sprintId);
  if (!sprint) {
    return <div>Sprint not found</div>;
  }
  
  const sprintTasks = tasks.filter(task => task.sprintId === sprintId);
  
  const handleRemoveFromSprint = (taskId: string) => {
    removeTaskFromSprint(taskId);
  };
  
  return (
    <div className="space-y-4">
      <SprintHeader sprint={sprint} onEdit={() => onEditSprint(sprint)} />
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Tasks ({sprintTasks.length})
        </h3>
        <Button onClick={onCreateTask} size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Task
        </Button>
      </div>
      
      {sprintTasks.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground mb-4">
            No tasks in this sprint yet.
          </p>
          <Button onClick={onCreateTask}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Your First Task
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sprintTasks.map((task) => (
            <div key={task.id} className="flex flex-col h-full">
              <TaskCard task={task} onEdit={onTaskEdit} />
              
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleRemoveFromSprint(task.id)}
                >
                  Move to Backlog
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SprintView;

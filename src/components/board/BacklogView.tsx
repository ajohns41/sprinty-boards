
import React, { useState } from 'react';
import { Task, useBoard } from '@/context/BoardContext';
import TaskCard from '@/components/task/TaskCard';
import { Button } from '@/components/ui/button';
import { List, GridIcon, Plus } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

interface BacklogViewProps {
  onTaskEdit: (task: Task) => void;
  onCreateTask: () => void;
}

const BacklogView: React.FC<BacklogViewProps> = ({ onTaskEdit, onCreateTask }) => {
  const { backlogTasks, sprints, activeSprint, assignTaskToSprint } = useBoard();
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  
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
        <div className="flex items-center gap-2">
          <div className="bg-muted p-0.5 rounded-md flex">
            <Toggle 
              pressed={viewMode === 'list'} 
              onPressedChange={() => setViewMode('list')}
              variant="outline"
              size="sm"
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Toggle>
            <Toggle 
              pressed={viewMode === 'card'} 
              onPressedChange={() => setViewMode('card')}
              variant="outline"
              size="sm"
              aria-label="Card view"
            >
              <GridIcon className="h-4 w-4" />
            </Toggle>
          </div>
          <Button onClick={onCreateTask} size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Task
          </Button>
        </div>
      </div>
      
      {viewMode === 'card' ? (
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
      ) : (
        <div className="rounded-md border">
          <div className="divide-y">
            {backlogTasks.map((task) => (
              <div key={task.id} className="flex items-center p-3 hover:bg-accent/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' : 
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <h3 className="font-medium text-sm">{task.title}</h3>
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {activeSprint && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => handleAssignToSprint(task.id, activeSprint.id)}
                    >
                      Add to Sprint
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => onTaskEdit(task)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BacklogView;

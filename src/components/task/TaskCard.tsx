
import React, { useRef } from 'react';
import { Task, TaskPriority, useBoard } from '@/context/BoardContext';
import { cn } from '@/lib/utils';
import { 
  AlertCircle, 
  ArrowUp, 
  Clock, 
  Edit2,
  Trash2,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onEdit: (task: Task) => void;
}

const priorityColorMap: Record<TaskPriority, string> = {
  low: 'bg-blue-50 text-blue-700 border-blue-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  high: 'bg-red-50 text-red-700 border-red-200',
};

const priorityIconMap: Record<TaskPriority, React.ReactNode> = {
  low: null,
  medium: <Clock className="h-3 w-3" />,
  high: <AlertCircle className="h-3 w-3" />,
};

const TaskCard: React.FC<TaskCardProps> = ({ task, isDragging, onEdit }) => {
  const { deleteTask } = useBoard();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleEdit = () => {
    onEdit(task);
  };
  
  const handleDelete = () => {
    deleteTask(task.id);
  };
  
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div 
          ref={cardRef}
          className={cn(
            "task-card",
            isDragging && "task-card-dragging",
          )}
          draggable="true"
          data-task-id={task.id}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className={cn(
                "text-xs px-1.5 py-0.5 rounded border flex items-center gap-1",
                priorityColorMap[task.priority]
              )}>
                {priorityIconMap[task.priority]}
                <span>{task.priority}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {format(task.updatedAt, 'MMM d')}
              </span>
            </div>
            
            <h3 className="font-medium text-sm line-clamp-2">{task.title}</h3>
            
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
            
            <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{task.assignee || 'Unassigned'}</span>
              </div>
              
              <div className="flex gap-1">
                <button 
                  onClick={handleEdit}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Task</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{task.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={handleEdit}>
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Task
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Task
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TaskCard;

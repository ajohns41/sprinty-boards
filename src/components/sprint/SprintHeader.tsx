
import React from 'react';
import { Sprint, useBoard } from '@/context/BoardContext';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Square, 
  Edit,
  Trash2,
  Calendar
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

interface SprintHeaderProps {
  sprint: Sprint;
  onEdit: () => void;
}

const SprintHeader: React.FC<SprintHeaderProps> = ({ sprint, onEdit }) => {
  const { startSprint, endSprint, deleteSprint } = useBoard();
  
  const handleDelete = () => {
    deleteSprint(sprint.id);
  };
  
  return (
    <div className="bg-secondary/30 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium flex items-center">
            {sprint.name}
            {sprint.isActive && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </h2>
          
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            <span>
              {format(sprint.startDate, 'MMM d')} - {format(sprint.endDate, 'MMM d, yyyy')}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!sprint.isActive ? (
            <Button 
              size="sm" 
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50"
              onClick={() => startSprint(sprint.id)}
            >
              <Play className="h-3.5 w-3.5 mr-1.5" /> 
              Start Sprint
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="outline"
              className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
              onClick={() => endSprint(sprint.id)}
            >
              <Square className="h-3.5 w-3.5 mr-1.5" /> 
              End Sprint
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="ghost"
            onClick={onEdit}
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost" className="text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Sprint</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{sprint.name}"? All tasks in this sprint will be moved to the backlog.
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
  );
};

export default SprintHeader;

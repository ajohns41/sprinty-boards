
import React from 'react';
import { useBoard, Sprint } from '@/context/BoardContext';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from 'lucide-react';

interface SprintSelectorProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const SprintSelector: React.FC<SprintSelectorProps> = ({ currentView, onViewChange }) => {
  const { sprints, activeSprint } = useBoard();
  
  const currentSprintId = currentView.startsWith('sprint-') 
    ? currentView.substring(7) 
    : activeSprint?.id || '';
  
  const handleSprintChange = (sprintId: string) => {
    if (sprintId === 'board') {
      onViewChange('board');
    } else if (sprintId === 'backlog') {
      onViewChange('backlog');
    } else {
      onViewChange(`sprint-${sprintId}`);
    }
  };
  
  if (sprints.length === 0) {
    return null;
  }
  
  return (
    <Select value={currentSprintId || 'board'} onValueChange={handleSprintChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select view" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Views</SelectLabel>
          <SelectItem value="board">Board View</SelectItem>
          <SelectItem value="backlog">Backlog View</SelectItem>
        </SelectGroup>
        
        {sprints.length > 0 && (
          <SelectGroup>
            <SelectLabel>Sprints</SelectLabel>
            {sprints.map(sprint => (
              <SelectItem key={sprint.id} value={sprint.id}>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 opacity-70" />
                  <span>{sprint.name}</span>
                  {sprint.isActive && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
};

export default SprintSelector;

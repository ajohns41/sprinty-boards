
import { Sprint, Task } from '@/types/board';
import { toast } from '@/components/ui/use-toast';

export const createSprintOperation = (
  setSprints: React.Dispatch<React.SetStateAction<Sprint[]>>
) => {
  return (sprint: Omit<Sprint, 'id'>) => {
    const newSprint = {
      ...sprint,
      id: Date.now().toString(),
    };
    
    setSprints(prevSprints => [...prevSprints, newSprint]);
    toast({
      title: 'Sprint created',
      description: `"${newSprint.name}" has been created.`,
    });
  };
};

export const updateSprintOperation = (
  setSprints: React.Dispatch<React.SetStateAction<Sprint[]>>
) => {
  return (id: string, updates: Partial<Sprint>) => {
    setSprints(prevSprints => 
      prevSprints.map(sprint => 
        sprint.id === id 
          ? { ...sprint, ...updates } 
          : sprint
      )
    );
    toast({
      title: 'Sprint updated',
      description: 'Your changes have been saved.',
    });
  };
};

export const deleteSprintOperation = (
  sprints: Sprint[],
  setSprints: React.Dispatch<React.SetStateAction<Sprint[]>>,
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  return (id: string) => {
    const sprintToDelete = sprints.find(sprint => sprint.id === id);
    
    // Remove sprint ID from all tasks assigned to this sprint
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.sprintId === id 
          ? { ...task, sprintId: undefined, updatedAt: new Date() } 
          : task
      )
    );
    
    setSprints(prevSprints => prevSprints.filter(sprint => sprint.id !== id));
    
    if (sprintToDelete) {
      toast({
        title: 'Sprint deleted',
        description: `"${sprintToDelete.name}" has been removed.`,
      });
    }
  };
};

export const startSprintOperation = (
  sprints: Sprint[],
  setSprints: React.Dispatch<React.SetStateAction<Sprint[]>>
) => {
  return (id: string) => {
    setSprints(prevSprints => 
      prevSprints.map(sprint => ({
        ...sprint,
        isActive: sprint.id === id,
      }))
    );
    
    const sprint = sprints.find(s => s.id === id);
    if (sprint) {
      toast({
        title: 'Sprint started',
        description: `"${sprint.name}" is now active.`,
      });
    }
  };
};

export const endSprintOperation = (
  sprints: Sprint[],
  setSprints: React.Dispatch<React.SetStateAction<Sprint[]>>
) => {
  return (id: string) => {
    setSprints(prevSprints => 
      prevSprints.map(sprint => 
        sprint.id === id 
          ? { ...sprint, isActive: false } 
          : sprint
      )
    );
    
    const sprint = sprints.find(s => s.id === id);
    if (sprint) {
      toast({
        title: 'Sprint ended',
        description: `"${sprint.name}" has been completed.`,
      });
    }
  };
};


import { Task, TaskStatus } from '@/types/board';
import { toast } from '@/components/ui/use-toast';

export const createTaskOperation = (
  tasks: Task[], 
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  return (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    toast({
      title: 'Task created',
      description: `"${newTask.title}" has been added.`,
    });
  };
};

export const updateTaskOperation = (
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  return (id: string, updates: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { ...task, ...updates, updatedAt: new Date() } 
          : task
      )
    );
    toast({
      title: 'Task updated',
      description: 'Your changes have been saved.',
    });
  };
};

export const deleteTaskOperation = (
  tasks: Task[], 
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  return (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    
    if (taskToDelete) {
      toast({
        title: 'Task deleted',
        description: `"${taskToDelete.title}" has been removed.`,
      });
    }
  };
};

export const moveTaskOperation = (
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  return (taskId: string, newStatus: TaskStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updatedAt: new Date() } 
          : task
      )
    );
  };
};

export const assignTaskToSprintOperation = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  return (taskId: string, sprintId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, sprintId, updatedAt: new Date() } 
          : task
      )
    );
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: 'Task assigned',
        description: `"${task.title}" has been added to the sprint.`,
      });
    }
  };
};

export const removeTaskFromSprintOperation = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  return (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, sprintId: undefined, updatedAt: new Date() } 
          : task
      )
    );
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: 'Task removed from sprint',
        description: `"${task.title}" has been moved to the backlog.`,
      });
    }
  };
};

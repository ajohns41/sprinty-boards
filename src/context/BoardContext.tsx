
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'in-review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
  sprintId?: string;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

interface BoardContextType {
  tasks: Task[];
  sprints: Sprint[];
  activeSprint: Sprint | null;
  backlogTasks: Task[];
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  createSprint: (sprint: Omit<Sprint, 'id'>) => void;
  updateSprint: (id: string, updates: Partial<Sprint>) => void;
  deleteSprint: (id: string) => void;
  startSprint: (id: string) => void;
  endSprint: (id: string) => void;
  getTasksByStatus: (status: TaskStatus) => Task[];
  assignTaskToSprint: (taskId: string, sprintId: string) => void;
  removeTaskFromSprint: (taskId: string) => void;
}

const defaultContext: BoardContextType = {
  tasks: [],
  sprints: [],
  activeSprint: null,
  backlogTasks: [],
  createTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  moveTask: () => {},
  createSprint: () => {},
  updateSprint: () => {},
  deleteSprint: () => {},
  startSprint: () => {},
  endSprint: () => {},
  getTasksByStatus: () => [],
  assignTaskToSprint: () => {},
  removeTaskFromSprint: () => {},
};

const BoardContext = createContext<BoardContextType>(defaultContext);

export const useBoard = () => useContext(BoardContext);

const STORAGE_KEY = 'jira-clone-data';

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);

  // Load data from localStorage on initial load
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        const { tasks, sprints } = JSON.parse(storedData);
        
        // Convert string dates back to Date objects
        const parsedTasks = tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));
        
        const parsedSprints = sprints.map((sprint: any) => ({
          ...sprint,
          startDate: new Date(sprint.startDate),
          endDate: new Date(sprint.endDate),
        }));
        
        setTasks(parsedTasks);
        setSprints(parsedSprints);
      } catch (error) {
        console.error('Failed to parse stored data:', error);
        toast({
          title: 'Error loading saved data',
          description: 'Your previous work could not be loaded correctly.',
          variant: 'destructive',
        });
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, sprints }));
  }, [tasks, sprints]);

  // Get the currently active sprint
  const activeSprint = sprints.find(sprint => sprint.isActive) || null;

  // Get all tasks in the backlog (not assigned to a sprint)
  const backlogTasks = tasks.filter(task => !task.sprintId);

  // Get tasks by status
  const getTasksByStatus = (status: TaskStatus): Task[] => {
    if (activeSprint) {
      return tasks.filter(task => 
        task.status === status && task.sprintId === activeSprint.id
      );
    }
    return [];
  };

  // Create a new task
  const createTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
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

  // Update an existing task
  const updateTask = (id: string, updates: Partial<Task>) => {
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

  // Delete a task
  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    
    if (taskToDelete) {
      toast({
        title: 'Task deleted',
        description: `"${taskToDelete.title}" has been removed.`,
      });
    }
  };

  // Move a task to a new status
  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updatedAt: new Date() } 
          : task
      )
    );
  };

  // Create a new sprint
  const createSprint = (sprint: Omit<Sprint, 'id'>) => {
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

  // Update an existing sprint
  const updateSprint = (id: string, updates: Partial<Sprint>) => {
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

  // Delete a sprint
  const deleteSprint = (id: string) => {
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

  // Start a sprint
  const startSprint = (id: string) => {
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

  // End the current sprint
  const endSprint = (id: string) => {
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

  // Assign a task to a sprint
  const assignTaskToSprint = (taskId: string, sprintId: string) => {
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

  // Remove a task from a sprint (move to backlog)
  const removeTaskFromSprint = (taskId: string) => {
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

  const contextValue: BoardContextType = {
    tasks,
    sprints,
    activeSprint,
    backlogTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    createSprint,
    updateSprint,
    deleteSprint,
    startSprint,
    endSprint,
    getTasksByStatus,
    assignTaskToSprint,
    removeTaskFromSprint,
  };

  return (
    <BoardContext.Provider value={contextValue}>
      {children}
    </BoardContext.Provider>
  );
};

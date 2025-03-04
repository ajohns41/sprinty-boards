
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Task, 
  TaskStatus, 
  Sprint, 
  BoardContextType 
} from '@/types/board';
import { toast } from '@/components/ui/use-toast';

import {
  createTaskOperation,
  updateTaskOperation,
  deleteTaskOperation,
  moveTaskOperation,
  assignTaskToSprintOperation,
  removeTaskFromSprintOperation,
} from './TaskOperations';

import {
  createSprintOperation,
  updateSprintOperation,
  deleteSprintOperation,
  startSprintOperation,
  endSprintOperation,
} from './SprintOperations';

export type { TaskPriority, TaskStatus, Task, Sprint } from '@/types/board';

const STORAGE_KEY = 'jira-clone-data';

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

  // Initialize operations
  const createTask = createTaskOperation(tasks, setTasks);
  const updateTask = updateTaskOperation(setTasks);
  const deleteTask = deleteTaskOperation(tasks, setTasks);
  const moveTask = moveTaskOperation(setTasks);
  const createSprint = createSprintOperation(setSprints);
  const updateSprint = updateSprintOperation(setSprints);
  const deleteSprint = deleteSprintOperation(sprints, setSprints, setTasks);
  const startSprint = startSprintOperation(sprints, setSprints);
  const endSprint = endSprintOperation(sprints, setSprints);
  const assignTaskToSprint = assignTaskToSprintOperation(tasks, setTasks);
  const removeTaskFromSprint = removeTaskFromSprintOperation(tasks, setTasks);

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

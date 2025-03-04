
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

export interface BoardContextType {
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


import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, useBoard } from '@/context/BoardContext';
import TaskCard from '@/components/task/TaskCard';
import { cn } from '@/lib/utils';

interface BoardColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onTaskEdit: (task: Task) => void;
}

const statusTitles: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  done: 'Done',
};

const BoardColumn: React.FC<BoardColumnProps> = ({ title, status, tasks, onTaskEdit }) => {
  const { moveTask } = useBoard();
  const [isOver, setIsOver] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };
  
  const handleDragLeave = () => {
    setIsOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      moveTask(taskId, status);
    }
  };
  
  return (
    <div 
      className={cn(
        "board-column",
        isOver && "column-drop-active"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="board-column-header flex items-center justify-between">
        <span>{title}</span>
        <span className="text-xs bg-secondary px-1.5 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 flex flex-col gap-3">
        {tasks.map((task) => (
          <div 
            key={task.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('taskId', task.id);
              // Add a delay to allow the drag image to be created
              setTimeout(() => {
                const draggedElement = document.querySelector(`[data-task-id="${task.id}"]`);
                if (draggedElement) {
                  draggedElement.classList.add('task-card-dragging');
                }
              }, 0);
            }}
            onDragEnd={() => {
              const draggedElement = document.querySelector(`[data-task-id="${task.id}"]`);
              if (draggedElement) {
                draggedElement.classList.remove('task-card-dragging');
              }
            }}
          >
            <TaskCard task={task} onEdit={onTaskEdit} />
          </div>
        ))}
      </div>
    </div>
  );
};

interface BoardViewProps {
  onTaskEdit: (task: Task) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ onTaskEdit }) => {
  const { getTasksByStatus, activeSprint } = useBoard();
  const statuses: TaskStatus[] = ['todo', 'in-progress', 'in-review', 'done'];
  
  if (!activeSprint) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <h3 className="text-lg font-medium mb-2">No Active Sprint</h3>
        <p className="text-muted-foreground text-sm">
          Start a sprint to see your board.
        </p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto pb-6">
      <div className="flex gap-4 min-w-max">
        {statuses.map((status) => (
          <BoardColumn
            key={status}
            title={statusTitles[status]}
            status={status}
            tasks={getTasksByStatus(status)}
            onTaskEdit={onTaskEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default BoardView;

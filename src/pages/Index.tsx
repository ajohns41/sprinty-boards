
import React, { useState } from 'react';
import { BoardProvider, Sprint, Task } from '@/context/BoardContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import AppHeader from '@/components/layout/AppHeader';
import BoardView from '@/components/board/BoardView';
import BacklogView from '@/components/board/BacklogView';
import SprintView from '@/components/board/SprintView';
import TaskDialog from '@/components/task/TaskDialog';
import SprintDialog from '@/components/sprint/SprintDialog';
import SprintSelector from '@/components/sprint/SprintSelector';

const Index = () => {
  const [view, setView] = useState('board');
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isSprintDialogOpen, setIsSprintDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [editingSprint, setEditingSprint] = useState<Sprint | undefined>(undefined);
  
  // Extract sprint ID from view (e.g., 'sprint-123' => '123')
  const sprintIdMatch = view.match(/^sprint-(.+)$/);
  const currentSprintId = sprintIdMatch ? sprintIdMatch[1] : null;
  
  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsTaskDialogOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };
  
  const handleCreateSprint = () => {
    setEditingSprint(undefined);
    setIsSprintDialogOpen(true);
  };
  
  const handleEditSprint = (sprint: Sprint) => {
    setEditingSprint(sprint);
    setIsSprintDialogOpen(true);
  };
  
  const renderView = () => {
    if (view === 'board') {
      return (
        <BoardView onTaskEdit={handleEditTask} />
      );
    }
    
    if (view === 'backlog') {
      return (
        <BacklogView 
          onTaskEdit={handleEditTask}
          onCreateTask={handleCreateTask}
        />
      );
    }
    
    if (currentSprintId) {
      return (
        <SprintView 
          sprintId={currentSprintId}
          onTaskEdit={handleEditTask}
          onCreateTask={handleCreateTask}
          onEditSprint={handleEditSprint}
        />
      );
    }
    
    return <div>Select a view</div>;
  };
  
  return (
    <BoardProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar 
            view={view}
            setView={setView}
            onAddSprint={handleCreateSprint}
          />
          
          <div className="flex-1 flex flex-col">
            <AppHeader onCreateTask={handleCreateTask} />
            
            <main className="flex-1 p-6 overflow-auto">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">
                  {view === 'board' ? 'Board View' : 
                   view === 'backlog' ? 'Backlog' : 
                   currentSprintId ? 'Sprint View' : 'Dashboard'}
                </h1>
                <SprintSelector 
                  currentView={view}
                  onViewChange={setView}
                />
              </div>
              {renderView()}
            </main>
          </div>
          
          <TaskDialog 
            isOpen={isTaskDialogOpen}
            onClose={() => setIsTaskDialogOpen(false)}
            existingTask={editingTask}
          />
          
          <SprintDialog 
            isOpen={isSprintDialogOpen}
            onClose={() => setIsSprintDialogOpen(false)} 
            existingSprint={editingSprint}
          />
        </div>
      </SidebarProvider>
    </BoardProvider>
  );
};

export default Index;

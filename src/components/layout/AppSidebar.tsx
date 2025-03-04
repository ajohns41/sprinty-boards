
import React from 'react';
import { useBoard, Sprint } from '@/context/BoardContext';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { Calendar, ClipboardList, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  view: string;
  setView: (view: string) => void;
  onAddSprint: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ view, setView, onAddSprint }) => {
  const { sprints, activeSprint, backlogTasks } = useBoard();

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center px-4">
        <div className="font-semibold tracking-tight">Sprinty Boards</div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Views</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={cn(view === 'board' && "bg-sidebar-accent")}
                  onClick={() => setView('board')}
                >
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  <span>Board</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className={cn(view === 'backlog' && "bg-sidebar-accent")}
                  onClick={() => setView('backlog')}
                >
                  <ClipboardList className="h-4 w-4 mr-2" />
                  <span>Backlog</span>
                  {backlogTasks.length > 0 && (
                    <span className="ml-auto text-xs bg-accent px-1.5 py-0.5 rounded-full">
                      {backlogTasks.length}
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <div className="flex items-center justify-between pr-3">
            <SidebarGroupLabel>Sprints</SidebarGroupLabel>
            <Button variant="ghost" size="icon-sm" onClick={onAddSprint}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {sprints.length > 0 ? sprints.map((sprint) => (
                <SidebarMenuItem key={sprint.id}>
                  <SidebarMenuButton 
                    className={cn(
                      sprint.isActive && "bg-sidebar-accent font-medium"
                    )}
                    onClick={() => setView(`sprint-${sprint.id}`)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="truncate">{sprint.name}</span>
                    {sprint.isActive && (
                      <span className="ml-auto text-xs bg-primary/10 px-1.5 py-0.5 rounded-full text-primary">
                        Active
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No sprints yet
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

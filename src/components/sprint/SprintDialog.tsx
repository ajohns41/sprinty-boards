
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Sprint, useBoard } from '@/context/BoardContext';

interface SprintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  existingSprint?: Sprint;
}

const initialSprint: Omit<Sprint, 'id'> = {
  name: '',
  startDate: new Date(),
  endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
  isActive: false,
};

const SprintDialog: React.FC<SprintDialogProps> = ({ isOpen, onClose, existingSprint }) => {
  const { createSprint, updateSprint } = useBoard();
  const [formData, setFormData] = useState<Omit<Sprint, 'id'>>(initialSprint);
  
  // Reset form or populate with existing sprint data when the dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      if (existingSprint) {
        const { id, ...sprintData } = existingSprint;
        setFormData(sprintData);
      } else {
        setFormData(initialSprint);
      }
    }
  }, [isOpen, existingSprint]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) return;
    setFormData(prev => ({ ...prev, startDate: date }));
  };
  
  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) return;
    setFormData(prev => ({ ...prev, endDate: date }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      // Show error or handle validation
      return;
    }
    
    if (existingSprint) {
      updateSprint(existingSprint.id, formData);
    } else {
      createSprint(formData);
    }
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={state => !state && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {existingSprint ? 'Edit Sprint' : 'Create New Sprint'}
            </DialogTitle>
            <DialogDescription>
              {existingSprint 
                ? 'Make changes to the existing sprint.'
                : 'Plan a new sprint period for your team.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Sprint Name</Label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Sprint name"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? (
                        format(formData.startDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={handleStartDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? (
                        format(formData.endDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={handleEndDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {existingSprint ? 'Save Changes' : 'Create Sprint'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SprintDialog;

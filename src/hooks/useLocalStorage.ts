
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'jira-clone-data';

export interface StorageData<T> {
  load: () => T | null;
  save: (data: T) => void;
}

export function useLocalStorage<T>(initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialState);

  // Load data from localStorage on initial load
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setState(parsedData);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return [state, setState];
}

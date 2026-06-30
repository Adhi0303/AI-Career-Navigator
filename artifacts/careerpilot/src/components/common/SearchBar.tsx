import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function SearchBar({ className, ...props }: SearchBarProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input 
        className="w-full pl-12 pr-4 py-6 text-lg rounded-2xl bg-card border-border neu-inset focus-visible:ring-primary/50 text-foreground"
        placeholder="Search jobs, skills, or companies..."
        {...props}
      />
    </div>
  );
}

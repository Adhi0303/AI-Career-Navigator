import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ApplicationCard } from '@/components/cards/ApplicationCard';
import { mockApplications, KANBAN_COLUMNS } from '@/mock/mockApplications';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Applications() {
  // Simple grouping by status for the mock UI
  // In a real app, you'd use a dnd library here
  const groupedApps = KANBAN_COLUMNS.reduce((acc, col) => {
    acc[col] = mockApplications.filter(app => app.status === col);
    return acc;
  }, {} as Record<string, typeof mockApplications>);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col pb-4">
      <SectionHeader 
        title="Application Pipeline" 
        description="Track and manage your active job applications."
        action={
          <Button className="neu-button bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> Add Application
          </Button>
        }
        className="flex-shrink-0"
      />

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory min-h-0">
        {KANBAN_COLUMNS.map(column => (
          <div key={column} className="w-[300px] flex-shrink-0 flex flex-col bg-secondary/20 rounded-xl border border-border/50 snap-start h-full">
            <div className="p-4 border-b border-border/50 flex justify-between items-center bg-card rounded-t-xl shrink-0">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">{column}</h3>
              <span className="w-6 h-6 rounded-full bg-secondary text-xs font-bold flex items-center justify-center text-muted-foreground neu-inset">
                {groupedApps[column].length}
              </span>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto min-h-0 custom-scrollbar">
              {groupedApps[column].length === 0 ? (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-border/50 rounded-lg">
                  <span className="text-xs font-medium text-muted-foreground">Drop here</span>
                </div>
              ) : (
                groupedApps[column].map(app => (
                  <ApplicationCard 
                    key={app.id}
                    id={app.id}
                    company={app.company}
                    role={app.role}
                    status={app.status}
                    date={app.date}
                    match={app.match}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

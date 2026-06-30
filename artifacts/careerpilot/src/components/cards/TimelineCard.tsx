import React from 'react';
import { cn } from '@/lib/utils';

interface TimelineCardProps {
  title: string;
  subtitle: string;
  description?: string;
  date: string;
  icon: React.ElementType;
  isLast?: boolean;
}

export function TimelineCard({ title, subtitle, description, date, icon: Icon, isLast }: TimelineCardProps) {
  return (
    <div className="flex gap-4 relative">
      {!isLast && (
        <div className="absolute left-6 top-10 bottom-[-1.5rem] w-px bg-border z-0" />
      )}
      
      <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center neu-inset mt-1">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      
      <div className="flex-1 pb-6">
        <div className="p-5 rounded-xl bg-card border border-border neu-raised">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap px-2 py-1 rounded bg-secondary/50">{date}</span>
          </div>
          <h4 className="text-sm font-medium text-primary mb-3">{subtitle}</h4>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SkillBadgeProps {
  skill: string;
  category?: string;
  className?: string;
}

export function SkillBadge({ skill, category, className }: SkillBadgeProps) {
  const getCategoryColor = (cat?: string) => {
    switch(cat?.toLowerCase()) {
      case 'frontend': return 'bg-accent/10 text-accent border-accent/20';
      case 'backend': return 'bg-chart-3/10 text-chart-3 border-chart-3/20';
      case 'ml/ai': return 'bg-primary/10 text-primary border-primary/20';
      case 'devops': return 'bg-chart-4/10 text-chart-4 border-chart-4/20';
      case 'tools': return 'bg-muted text-muted-foreground border-border';
      case 'databases': return 'bg-chart-2/10 text-chart-2 border-chart-2/20';
      default: return 'bg-secondary text-secondary-foreground border-border';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "px-3 py-1 font-medium text-xs", 
        getCategoryColor(category),
        className
      )}
    >
      {skill}
    </Badge>
  );
}

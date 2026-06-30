import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Calendar, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ApplicationCardProps {
  id: string;
  company: string;
  role: string;
  status: string;
  date: string;
  match: number;
}

export function ApplicationCard({ id, company, role, status, date, match }: ApplicationCardProps) {
  return (
    <motion.div 
      className="p-4 mb-3 rounded-lg bg-card border border-border neu-raised cursor-grab active:cursor-grabbing flex gap-3 relative group"
      data-testid={`app-card-${id}`}
    >
      <div className="w-1 h-12 bg-border absolute left-1 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
        <GripVertical className="w-3 h-3 text-muted-foreground absolute" />
      </div>
      
      <div className="flex-1 pl-1">
        <h4 className="font-bold text-sm text-foreground line-clamp-1">{role}</h4>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
          <Building2 className="w-3 h-3" /> <span className="line-clamp-1">{company}</span>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="w-3 h-3" /> {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/20 text-primary bg-primary/10">
            {match}% Match
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}

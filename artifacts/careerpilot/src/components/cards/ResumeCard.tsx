import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, Settings, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '../common/ProgressRing';

interface ResumeCardProps {
  name: string;
  score: number;
  lastUpdated: string;
  versions: number;
}

export function ResumeCard({ name, score, lastUpdated, versions }: ResumeCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="p-6 rounded-xl bg-card border border-border neu-raised flex flex-col h-full"
      data-testid={`resume-card-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="p-3 bg-secondary rounded-xl">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <ProgressRing value={score} size={56} strokeWidth={5} />
      </div>
      
      <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">{name}</h3>
      
      <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6 flex-grow">
        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Updated {lastUpdated}</span>
        <span className="flex items-center gap-2"><FileSearch className="w-4 h-4" /> {versions} Versions</span>
      </div>
      
      <div className="flex gap-3 mt-auto">
        <Button variant="outline" className="neu-button flex-1" onClick={(e) => e.stopPropagation()}>
          <Settings className="w-4 h-4 mr-2" /> Edit
        </Button>
        <Button className="neu-button bg-primary text-primary-foreground hover:bg-primary/90 flex-1" onClick={(e) => e.stopPropagation()}>
          Generate
        </Button>
      </div>
    </motion.div>
  );
}

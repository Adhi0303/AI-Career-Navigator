import React from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, DollarSign, Bookmark, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressRing } from '../common/ProgressRing';

interface JobCardProps {
  company: string;
  role: string;
  location: string;
  salary: string;
  match: number;
  semanticMatch?: number;
  skills: string[];
  remote: boolean;
  onClick?: () => void;
}

export function JobCard({ company, role, location, salary, match, semanticMatch, skills, remote, onClick }: JobCardProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="p-5 rounded-xl bg-card border border-border neu-raised cursor-pointer flex flex-col sm:flex-row gap-6 items-start sm:items-center"
      onClick={onClick}
      data-testid={`job-card-${company.toLowerCase()}`}
    >
      <div className="flex-shrink-0 hidden sm:block">
        <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
          <Building2 className="w-8 h-8 text-muted-foreground" />
        </div>
      </div>
      
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-foreground">{role}</h3>
        <p className="text-lg font-medium text-muted-foreground mb-3">{company}</p>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {location}</span>
          <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {salary}</span>
          {remote && <span className="flex items-center gap-1.5 bg-accent/10 text-accent px-2 py-0.5 rounded text-xs font-medium">Remote</span>}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 4).map(skill => (
            <span key={skill} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-medium border border-border/50">
              {skill}
            </span>
          ))}
          {skills.length > 4 && <span className="bg-secondary text-muted-foreground px-2 py-1 rounded text-xs font-medium">+{skills.length - 4}</span>}
        </div>
      </div>
      
      <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center w-full sm:w-auto gap-4 sm:gap-6 border-t border-border sm:border-t-0 sm:border-l sm:pl-6 pt-4 sm:pt-0">
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <ProgressRing value={match} size={56} strokeWidth={5} color={match >= 90 ? "hsl(var(--primary))" : "hsl(var(--accent))"} />
            <span className="text-[10px] uppercase font-bold text-muted-foreground mt-1 text-center tracking-wider">Keyword</span>
          </div>
          {semanticMatch !== undefined && (
            <div className="flex flex-col items-center">
              <ProgressRing value={Math.round(semanticMatch * 100)} size={56} strokeWidth={5} color="#8b5cf6" />
              <span className="text-[10px] uppercase font-bold text-purple-500 mt-1 text-center tracking-wider">Semantic</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="outline" className="neu-button h-10 w-10 shrink-0">
            <Bookmark className="w-4 h-4" />
          </Button>
          <Button className="neu-button bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 shrink-0">
            Apply
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

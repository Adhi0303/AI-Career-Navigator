import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  name: string;
  role: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
}

export function ProjectCard({ name, role, description, tech, link, github }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div 
      className="p-5 rounded-xl bg-card border border-border neu-raised overflow-hidden"
      data-testid={`project-card-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div>
          <h3 className="text-xl font-bold text-foreground">{name}</h3>
          <p className="text-sm font-medium text-primary mt-1">{role}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </Button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pt-4 mt-2 border-t border-border/50"
          >
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-5">
              {tech.map(t => (
                <Badge key={t} variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary border-transparent text-xs font-medium">
                  {t}
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-3">
              {link && (
                <Button size="sm" variant="outline" className="neu-button h-8 text-xs">
                  <ExternalLink className="w-3 h-3 mr-2" /> Live Demo
                </Button>
              )}
              {github && (
                <Button size="sm" variant="outline" className="neu-button h-8 text-xs">
                  <Github className="w-3 h-3 mr-2" /> Source
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

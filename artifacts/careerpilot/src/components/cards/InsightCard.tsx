import React from 'react';
import { motion } from 'framer-motion';

interface InsightCardProps {
  title: string;
  content: React.ReactNode;
  icon: React.ElementType;
  action?: React.ReactNode;
}

export function InsightCard({ title, content, icon: Icon, action }: InsightCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl bg-card border border-border neu-raised flex gap-4"
    >
      <div className="flex-shrink-0">
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
        <div className="text-sm text-muted-foreground leading-relaxed">
          {content}
        </div>
        {action && (
          <div className="mt-4 pt-4 border-t border-border/50">
            {action}
          </div>
        )}
      </div>
    </motion.div>
  );
}

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatusCard({ title, value, icon: Icon, trend, trendUp, className }: StatusCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className={cn("p-6 rounded-xl bg-card border border-border neu-raised flex flex-col justify-between", className)}
      data-testid={`status-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="p-2 rounded-lg bg-secondary/50">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-bold font-mono tracking-tight text-foreground">{value}</h3>
        {trend && (
          <p className={cn("text-xs font-medium mt-1 flex items-center gap-1", trendUp ? "text-accent" : "text-destructive")}>
            {trendUp ? '↑' : '↓'} {trend}
          </p>
        )}
      </div>
    </motion.div>
  );
}

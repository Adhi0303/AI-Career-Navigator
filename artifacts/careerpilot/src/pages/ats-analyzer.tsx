import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ProgressRing } from '@/components/common/ProgressRing';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function AtsAnalyzer() {
  const metrics = [
    { label: 'Keyword Match', score: 94, status: 'excellent' },
    { label: 'Formatting & Parseability', score: 100, status: 'excellent' },
    { label: 'Experience Impact', score: 82, status: 'good' },
    { label: 'Skills Alignment', score: 88, status: 'good' },
    { label: 'Semantic Match', score: 75, status: 'warning' },
  ];

  const suggestions = [
    { type: 'warning', text: 'Consider replacing "helped build" with stronger action verbs like "architected" or "spearheaded".' },
    { type: 'warning', text: 'Missing important domain keyword: "Microservices". Add this if applicable.' },
    { type: 'error', text: 'Project section lacks quantifiable metrics. Try adding percentage improvements or scale numbers.' },
    { type: 'success', text: 'Formatting is perfect. No complex tables or columns detected.' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl mx-auto pb-12"
    >
      <SectionHeader title="ATS Analyzer" description="Deep semantic analysis against your target role." />

      <div className="flex flex-col items-center justify-center py-12 bg-card border border-border rounded-2xl neu-raised">
        <ProgressRing value={92} size={180} strokeWidth={12} color="hsl(var(--primary))" label="Overall Score" />
        <p className="mt-6 text-muted-foreground font-medium max-w-md text-center">
          Excellent match. Your resume is highly likely to pass automated screening for Senior Frontend Engineer roles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-xl bg-card border border-border neu-raised space-y-6">
          <h3 className="font-bold text-lg text-foreground mb-4">Detailed Metrics</h3>
          
          {metrics.map((metric) => (
            <div key={metric.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground">{metric.label}</span>
                <span className="font-mono font-bold text-muted-foreground">{metric.score}%</span>
              </div>
              <Progress 
                value={metric.score} 
                className="h-2"
              />
            </div>
          ))}
        </div>

        <div className="p-6 rounded-xl bg-card border border-border neu-raised space-y-6">
          <h3 className="font-bold text-lg text-foreground mb-4">Improvement Suggestions</h3>
          
          <div className="space-y-4">
            {suggestions.map((s, i) => (
              <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-secondary/50 border border-border/50">
                {s.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> :
                 s.type === 'error' ? <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" /> :
                 <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />}
                <p className="text-sm text-foreground leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

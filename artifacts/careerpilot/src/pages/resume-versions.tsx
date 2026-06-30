import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/common/SectionHeader';
import { mockResumeVersions } from '@/mock/mockResumeVersions';
import { Button } from '@/components/ui/button';
import { Download, SplitSquareHorizontal, GitCommit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ResumeVersions() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl mx-auto pb-12"
    >
      <SectionHeader title="Version History" description="Track how your resume evolves over time." />

      <div className="relative pl-6 sm:pl-8">
        {/* Vertical line */}
        <div className="absolute left-[11px] sm:left-[19px] top-4 bottom-0 w-0.5 bg-border" />

        <div className="space-y-8">
          {mockResumeVersions.map((version, i) => (
            <div key={version.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-6 sm:-left-8 w-6 h-6 rounded-full bg-secondary border-2 border-primary flex items-center justify-center z-10 neu-inset">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>

              <div className="p-6 rounded-xl bg-card border border-border neu-raised">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg text-foreground">{version.company}</h3>
                      <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary bg-primary/10">
                        {version.id}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">{version.role}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono text-foreground">{version.score}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">ATS Score</div>
                    </div>
                    <div className="w-px h-10 bg-border hidden sm:block" />
                    <div className="text-sm text-muted-foreground font-medium">{version.date}</div>
                  </div>
                </div>

                <div className="bg-secondary/40 p-4 rounded-lg border border-border/50 mb-6">
                  <div className="flex items-start gap-2">
                    <GitCommit className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm text-foreground">{version.changes}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="neu-button h-9">
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </Button>
                  {i < mockResumeVersions.length - 1 && (
                    <Button variant="ghost" size="sm" className="h-9 hover:bg-secondary">
                      <SplitSquareHorizontal className="w-4 h-4 mr-2" /> Compare with previous
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

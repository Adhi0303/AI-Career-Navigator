import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/common/SectionHeader';
import { JobCard } from '@/components/cards/JobCard';
import { mockJobs } from '@/mock/mockJobs';
import { Sparkles } from 'lucide-react';

export default function JobMatches() {
  const matches = mockJobs.filter(job => job.match >= 90).sort((a, b) => b.match - a.match);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/20 via-card to-card border border-primary/20 neu-raised flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold font-serif text-foreground mb-3">AI-Curated Matches</h1>
        <p className="text-muted-foreground max-w-2xl">
          Based on your latest profile update and resume ATS analysis, we've found {matches.length} highly relevant roles where you have a strong competitive advantage.
        </p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4"
      >
        {matches.map((job) => (
          <motion.div key={job.id} variants={item}>
            <JobCard 
              company={job.company}
              role={job.role}
              location={job.location}
              salary={job.salary}
              match={job.match}
              skills={job.skills}
              remote={job.remote}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

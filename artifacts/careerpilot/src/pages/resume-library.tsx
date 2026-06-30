import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ResumeCard } from '@/components/cards/ResumeCard';
import { mockResumes } from '@/mock/mockResumes';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ResumeLibrary() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader 
        title="Resume Library" 
        description="Manage your base resumes and generated variants."
        action={
          <Button className="neu-button bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> New Resume
          </Button>
        }
      />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {mockResumes.map((resume) => (
          <motion.div key={resume.id} variants={item}>
            <ResumeCard 
              name={resume.name}
              score={resume.score}
              lastUpdated={resume.lastUpdated}
              versions={resume.versions}
            />
          </motion.div>
        ))}
        
        <motion.div variants={item}>
          <div className="h-full min-h-[240px] p-6 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/30 transition-colors neu-inset">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">Import Resume</h3>
            <p className="text-sm text-muted-foreground">Upload a PDF or DOCX to start</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

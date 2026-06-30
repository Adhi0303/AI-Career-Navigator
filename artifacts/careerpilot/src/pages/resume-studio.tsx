import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Wand2, Check, ArrowRight, Upload, Search } from 'lucide-react';

export default function ResumeStudio() {
  return (
    <div className="h-[calc(100vh-100px)] flex flex-col pb-4">
      <SectionHeader 
        title="Resume Studio" 
        description="Tailor your resume for specific roles using AI."
        className="mb-4 flex-shrink-0"
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Left Column: Original Resume or Job Description input */}
        <div className="flex flex-col bg-card border border-border rounded-xl neu-raised overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-secondary/30 flex justify-between items-center">
            <h3 className="font-bold text-foreground">Target Job Description</h3>
            <Button variant="ghost" size="sm" className="h-8"><Upload className="w-4 h-4 mr-2"/> Import</Button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <Textarea 
              placeholder="Paste the job description here..."
              className="w-full h-full min-h-[300px] resize-none bg-transparent border-none focus-visible:ring-0 p-0 text-muted-foreground placeholder:text-muted-foreground/50"
              defaultValue="Senior Frontend Engineer
              
We are looking for a Senior Frontend Engineer to join our team...

Requirements:
- 5+ years experience with React
- Strong TypeScript skills
- Experience with Next.js and server-side rendering
- Knowledge of state management (Redux, Zustand)
- Familiarity with GraphQL is a plus"
            />
          </div>
        </div>

        {/* Center Column: AI Reasoning */}
        <div className="flex flex-col bg-card border border-border rounded-xl neu-raised overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-primary/5 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">AI Optimization Strategy</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" /> Keywords to Add
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'Server-side rendering', 'GraphQL', 'Zustand'].map(kw => (
                  <Badge key={kw} variant="outline" className="bg-primary/10 text-primary border-primary/20">{kw}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-accent" /> Experience to Highlight
              </h4>
              <ul className="space-y-3">
                <li className="text-sm text-foreground bg-secondary/50 p-3 rounded-lg border border-border">
                  Emphasize the Next.js migration project at TechCorp
                </li>
                <li className="text-sm text-foreground bg-secondary/50 p-3 rounded-lg border border-border">
                  Quantify the performance improvements from SSR
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-chart-3" /> Projected ATS Score
              </h4>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold font-mono text-foreground">94</span>
                <span className="text-sm text-muted-foreground">/ 100</span>
                <span className="text-sm font-medium text-chart-3 ml-2">↑ +12 pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="flex flex-col bg-card border border-border rounded-xl neu-raised overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-secondary/30 flex justify-between items-center">
            <h3 className="font-bold text-foreground">Generated Preview</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-8">PDF</Button>
              <Button variant="ghost" size="sm" className="h-8">DOCX</Button>
            </div>
          </div>
          <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-300">
            <div className="max-w-[21cm] mx-auto space-y-4 font-serif scale-[0.85] origin-top text-sm">
              {/* Fake Resume Content */}
              <div className="text-center mb-8 border-b border-zinc-300 dark:border-zinc-700 pb-4">
                <h1 className="text-2xl font-bold text-black dark:text-white uppercase tracking-wider">Adhi Sharma</h1>
                <p className="text-zinc-600 dark:text-zinc-400 mt-1">San Francisco, CA • adhi@example.com</p>
              </div>
              
              <div>
                <h2 className="text-lg font-bold text-black dark:text-white border-b border-zinc-300 dark:border-zinc-700 mb-2 uppercase tracking-wide">Experience</h2>
                <div className="mb-4">
                  <div className="flex justify-between font-bold text-black dark:text-white">
                    <span>Senior Software Engineer</span>
                    <span>2021 - Present</span>
                  </div>
                  <div className="font-medium text-zinc-700 dark:text-zinc-300 italic mb-2">TechCorp</div>
                  <ul className="list-disc pl-5 space-y-1 text-zinc-700 dark:text-zinc-300">
                    <li>Led frontend team of 5 engineers to architect and migrate legacy SPA to <strong className="text-primary dark:text-primary-foreground bg-primary/10 px-1 rounded">Next.js</strong>, implementing <strong className="text-primary dark:text-primary-foreground bg-primary/10 px-1 rounded">server-side rendering</strong> which improved LCP by 40%.</li>
                    <li>Implemented state management using <strong className="text-primary dark:text-primary-foreground bg-primary/10 px-1 rounded">Zustand</strong> and integrated with <strong className="text-primary dark:text-primary-foreground bg-primary/10 px-1 rounded">GraphQL</strong> APIs to reduce payload size.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center flex-shrink-0">
        <Button size="lg" className="neu-button bg-primary text-primary-foreground hover:bg-primary/90 w-full max-w-md h-14 text-lg rounded-xl">
          <Wand2 className="w-5 h-5 mr-2" /> Generate Tailored Resume
        </Button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from '@/components/common/SectionHeader';
import { SearchBar } from '@/components/common/SearchBar';
import { JobCard } from '@/components/cards/JobCard';
import { mockJobs } from '@/mock/mockJobs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ProgressRing } from '@/components/common/ProgressRing';
import { Filter, MapPin, DollarSign, Building2, Briefcase } from 'lucide-react';

export default function JobDiscovery() {
  const [selectedJob, setSelectedJob] = useState<typeof mockJobs[0] | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="max-w-3xl mx-auto space-y-6 text-center">
        <h1 className="text-4xl font-bold font-serif text-foreground">Find Your Next Move</h1>
        <p className="text-lg text-muted-foreground">AI-powered job discovery tailored to your skills and preferences.</p>
        <div className="flex gap-4 max-w-2xl mx-auto">
          <SearchBar className="flex-1" />
          <Button variant="outline" className="neu-button h-[72px] px-6 rounded-2xl shrink-0">
            <Filter className="w-5 h-5 mr-2" /> Filters
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
        {['All Jobs', 'Remote', 'Frontend', 'Senior Level', '$150k+', 'High Match >90%'].map((filter, i) => (
          <Badge key={filter} variant={i === 0 ? "default" : "outline"} className={i === 0 ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-card text-muted-foreground hover:text-foreground cursor-pointer px-3 py-1.5"}>
            {filter}
          </Badge>
        ))}
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4"
      >
        {mockJobs.map((job) => (
          <motion.div key={job.id} variants={item}>
            <JobCard 
              company={job.company}
              role={job.role}
              location={job.location}
              salary={job.salary}
              match={job.match}
              skills={job.skills}
              remote={job.remote}
              onClick={() => setSelectedJob(job)}
            />
          </motion.div>
        ))}
      </motion.div>

      <Sheet open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto bg-card border-l-border sm:border-l p-0">
          {selectedJob && (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-border/50 bg-secondary/20 sticky top-0 z-10 backdrop-blur-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedJob.role}</h2>
                    <p className="text-lg font-medium text-primary mt-1">{selectedJob.company}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <ProgressRing value={selectedJob.match} size={64} strokeWidth={6} />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {selectedJob.location}</span>
                  <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {selectedJob.salary}</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {selectedJob.type}</span>
                </div>
              </div>
              
              <div className="p-6 space-y-8 flex-1">
                <section>
                  <h3 className="text-lg font-bold text-foreground mb-4">Match Analysis</h3>
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-3">
                    <p className="text-sm text-foreground leading-relaxed">
                      <strong>Strong Match:</strong> Your experience with React and TypeScript aligns perfectly with the requirements. Your recent project "E-commerce Platform" demonstrates the necessary scale.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong>Missing Skills:</strong> The job description mentions GraphQL extensively, which is present in your skills but not highlighted in your most recent experience.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-foreground mb-4">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-secondary text-secondary-foreground">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-foreground mb-4">About the Role</h3>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                    <p>We are looking for a Senior Software Engineer to join our core product team. You will be responsible for architecture, development, and scaling of our main web application.</p>
                    <ul>
                      <li>Lead the development of complex frontend features</li>
                      <li>Collaborate with design and product teams</li>
                      <li>Mentor junior engineers and conduct code reviews</li>
                      <li>Optimize application performance</li>
                    </ul>
                  </div>
                </section>
              </div>

              <div className="p-6 border-t border-border/50 bg-card sticky bottom-0 z-10 flex gap-4">
                <Button variant="outline" className="neu-button flex-1 h-12">Save Job</Button>
                <Button className="neu-button bg-primary text-primary-foreground hover:bg-primary/90 flex-[2] h-12 text-base">
                  Optimize Resume & Apply
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

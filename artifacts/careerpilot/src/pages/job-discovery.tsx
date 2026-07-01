import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SectionHeader } from '@/components/common/SectionHeader';
import { JobCard } from '@/components/cards/JobCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ProgressRing } from '@/components/common/ProgressRing';
import { useToast } from '@/hooks/use-toast';
import {
  Filter, MapPin, DollarSign, Briefcase, RefreshCw, Link2,
  Loader2, Sparkles, AlertCircle
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface StoredJob {
  id: number;
  company: string;
  role: string;
  location: string | null;
  salary: string | null;
  type: string | null;
  description: string | null;
  requiredSkills: string[];
  matchScore: number;
  semanticScore?: number;
  sourceUrl: string;
  source: string;
  createdAt: string;
}

const API = "http://localhost:3000/api";

const FILTERS = ['All Jobs', 'Remote', 'High Match (70%+)', 'Adzuna', 'Imported'];

export default function JobDiscovery() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<StoredJob | null>(null);
  const [importUrl, setImportUrl] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Jobs');
  const [fetchQuery, setFetchQuery] = useState('');
  const [fetchLocation, setFetchLocation] = useState('');

  // ─── Fetch all jobs ──────────────────────────────────────────────────────
  const { data: jobs = [], isLoading, isError, error, refetch: refetchJobs } = useQuery<StoredJob[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      // Try ranked jobs first
      const res = await fetch(`${API}/jobs/ranked`);
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        // Fall back to unranked if profile not embedded
        if (res.status === 400) {
          const fallback = await fetch(`${API}/jobs`);
          const fallbackData = await fallback.json();
          return fallbackData.jobs as StoredJob[];
        }
        throw new Error(data.error || 'Failed to fetch jobs');
      }
      return data.jobs as StoredJob[];
    }
  });

  // ─── Embed Actions ──────────────────────────────────────────────────────
  const embedProfileMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API}/embed/profile`, { method: 'POST' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast({ title: '✅ Profile embedded successfully', description: 'Semantic match is now active.' });
      refetchJobs();
    }
  });

  const embedJobsMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API}/embed/jobs`, { method: 'POST' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      toast({ title: `✅ Embedded ${data.embedded} jobs!`, description: 'Semantic match scores updated.' });
      refetchJobs();
    }
  });

  // ─── Fetch from Adzuna ───────────────────────────────────────────────────
  const fetchMutation = useMutation({
    mutationFn: async ({ query, location }: { query: string; location: string }) => {
      const res = await fetch(`${API}/jobs/fetch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query || 'software developer', location: location || 'India' }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch jobs');
      return data as { added: number; total: number };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: data.added > 0 ? `✅ ${data.added} new jobs added!` : 'All jobs already up to date',
        description: `Scanned ${data.total} listings from Adzuna.`,
      });
    },
    onError: (err: any) => {
      toast({ title: 'Failed to fetch jobs', description: err.message, variant: 'destructive' });
    }
  });

  // ─── Import from URL ─────────────────────────────────────────────────────
  const importMutation = useMutation({
    mutationFn: async (url: string) => {
      const res = await fetch(`${API}/jobs/import-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to import job');
      return data as { job: StoredJob; duplicate: boolean };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setImportUrl('');
      toast({
        title: data.duplicate ? 'Job already in library' : '✅ Job imported!',
        description: data.duplicate
          ? 'This job was already in your library.'
          : `${data.job.role} at ${data.job.company} — Match: ${data.job.matchScore}%`,
      });
    },
    onError: (err: any) => {
      toast({ title: 'Import failed', description: err.message, variant: 'destructive' });
    }
  });

  // ─── Filter logic ────────────────────────────────────────────────────────
  const filteredJobs = jobs.filter(job => {
    if (activeFilter === 'Remote') return job.type?.toLowerCase().includes('remote') || job.location?.toLowerCase().includes('remote');
    if (activeFilter === 'High Match (70%+)') return job.matchScore >= 70;
    if (activeFilter === 'Adzuna') return job.source === 'adzuna';
    if (activeFilter === 'Imported') return job.source === 'firecrawl';
    return true;
  });

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="space-y-8 pb-12">
      {/* ── Hero Header ── */}
      <div className="max-w-3xl mx-auto space-y-6 text-center relative">
        <div className="absolute right-0 top-0 flex gap-2">
          <Button variant="outline" size="sm" onClick={() => embedProfileMutation.mutate()} disabled={embedProfileMutation.isPending}>
            {embedProfileMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Embed Profile
          </Button>
          <Button variant="outline" size="sm" onClick={() => embedJobsMutation.mutate()} disabled={embedJobsMutation.isPending}>
            {embedJobsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Embed Jobs
          </Button>
        </div>
        <h1 className="text-4xl font-bold font-serif text-foreground">Find Your Next Move</h1>
        <p className="text-lg text-muted-foreground">
          Real job listings from Adzuna, scored against your profile skills in real-time.
        </p>
      </div>

      {/* ── Action Bar: Fetch from Adzuna ── */}
      <div className="p-5 rounded-xl bg-card border border-border neu-raised space-y-3">
        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> Discover jobs from Adzuna
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Role / keyword (e.g. React developer)"
            value={fetchQuery}
            onChange={e => setFetchQuery(e.target.value)}
            className="flex-1 bg-secondary border-border"
          />
          <Input
            placeholder="Location (e.g. Bangalore, Remote)"
            value={fetchLocation}
            onChange={e => setFetchLocation(e.target.value)}
            className="flex-1 bg-secondary border-border"
          />
          <Button
            onClick={() => fetchMutation.mutate({ query: fetchQuery, location: fetchLocation })}
            disabled={fetchMutation.isPending}
            className="shrink-0"
          >
            {fetchMutation.isPending
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Fetching…</>
              : <><RefreshCw className="w-4 h-4 mr-2" /> Refresh Jobs</>
            }
          </Button>
        </div>
      </div>

      {/* ── Action Bar: Import from URL ── */}
      <div className="p-5 rounded-xl bg-card border border-border neu-raised space-y-3">
        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Link2 className="w-4 h-4 text-primary" /> Import any job by URL (LinkedIn, Naukri, etc.)
        </p>
        <div className="flex gap-3">
          <Input
            placeholder="Paste job listing URL…"
            value={importUrl}
            onChange={e => setImportUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && importUrl && importMutation.mutate(importUrl)}
            className="flex-1 bg-secondary border-border"
          />
          <Button
            onClick={() => importUrl && importMutation.mutate(importUrl)}
            disabled={importMutation.isPending || !importUrl}
            variant="outline"
            className="shrink-0 neu-button"
          >
            {importMutation.isPending
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : 'Import'
            }
          </Button>
        </div>
      </div>

      {/* ── Filter Chips ── */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
        {FILTERS.map(filter => (
          <Badge
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`cursor-pointer px-3 py-1.5 transition-colors ${
              activeFilter === filter
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-card text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            {filter}
          </Badge>
        ))}
        {jobs.length > 0 && (
          <span className="ml-auto text-xs text-muted-foreground self-center">
            {filteredJobs.length} of {jobs.length} jobs
          </span>
        )}
      </div>

      {/* ── Job List ── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" /> Loading jobs…
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground" />
          <div>
            <p className="font-semibold text-foreground">No jobs found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Use "Refresh Jobs" to pull listings from Adzuna, or paste a URL above to import one.
            </p>
          </div>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4">
          {filteredJobs.map(job => (
            <motion.div key={job.id} variants={item}>
              <JobCard
                company={job.company}
                role={job.role}
                location={job.location || 'India'}
                salary={job.salary || 'Not stated'}
                match={job.matchScore}
                semanticMatch={job.semanticScore}
                skills={job.requiredSkills || []}
                remote={job.type?.toLowerCase().includes('remote') || false}
                onClick={() => setSelectedJob(job)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── Job Detail Sheet ── */}
      <Sheet open={!!selectedJob} onOpenChange={open => !open && setSelectedJob(null)}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto bg-card border-l-border sm:border-l p-0">
          {selectedJob && (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-border/50 bg-secondary/20 sticky top-0 z-10 backdrop-blur-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedJob.role}</h2>
                    <p className="text-lg font-medium text-primary mt-1">{selectedJob.company}</p>
                  </div>
                  <div className="flex-shrink-0 flex gap-4">
                    <div className="flex flex-col items-center">
                      <ProgressRing value={selectedJob.matchScore} size={64} strokeWidth={6} />
                      <span className="text-xs uppercase font-bold text-muted-foreground mt-1">Keyword</span>
                    </div>
                    {selectedJob.semanticScore !== undefined && (
                      <div className="flex flex-col items-center">
                        <ProgressRing value={Math.round(selectedJob.semanticScore * 100)} size={64} strokeWidth={6} color="#8b5cf6" />
                        <span className="text-xs uppercase font-bold text-purple-500 mt-1">Semantic</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-6 text-sm text-muted-foreground">
                  {selectedJob.location && (
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {selectedJob.location}</span>
                  )}
                  {selectedJob.salary && (
                    <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {selectedJob.salary}</span>
                  )}
                  {selectedJob.type && (
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {selectedJob.type}</span>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-8 flex-1">
                {/* Match Score Explanation */}
                <section>
                  <h3 className="text-lg font-bold text-foreground mb-4">Match Analysis</h3>
                  <div className={`p-4 rounded-xl border space-y-2 ${
                    selectedJob.matchScore >= 70
                      ? 'bg-primary/10 border-primary/20'
                      : selectedJob.matchScore >= 40
                      ? 'bg-yellow-500/10 border-yellow-500/20'
                      : 'bg-destructive/10 border-destructive/20'
                  }`}>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedJob.matchScore >= 70
                        ? '🟢 Strong Match'
                        : selectedJob.matchScore >= 40
                        ? '🟡 Partial Match'
                        : '🔴 Low Match'
                      } — {selectedJob.matchScore}% of required skills overlap with your profile
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Based on your {selectedJob.requiredSkills.length} extracted required skills vs. your career profile.
                    </p>
                  </div>
                </section>

                {/* Required Skills */}
                {selectedJob.requiredSkills?.length > 0 && (
                  <section>
                    <h3 className="text-lg font-bold text-foreground mb-4">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.requiredSkills.map(skill => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </section>
                )}

                {/* Job Description */}
                {selectedJob.description && (
                  <section>
                    <h3 className="text-lg font-bold text-foreground mb-4">About the Role</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedJob.description}
                    </p>
                  </section>
                )}
              </div>

              <div className="p-6 border-t border-border/50 bg-card sticky bottom-0 z-10 flex gap-4">
                <a
                  href={selectedJob.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-[2]"
                >
                  <Button className="w-full h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90">
                    View & Apply →
                  </Button>
                </a>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

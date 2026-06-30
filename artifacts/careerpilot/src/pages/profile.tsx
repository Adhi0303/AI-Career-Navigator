import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/common/SectionHeader';
import { SkillBadge } from '@/components/common/SkillBadge';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { TimelineCard } from '@/components/cards/TimelineCard';
import { mockCareerProfile } from '@/mock/mockCareerProfile';
import { Button } from '@/components/ui/button';
import { Edit2, MapPin, Mail, Globe, Briefcase, GraduationCap, Award, Github, Linkedin } from 'lucide-react';

import { CareerProfile } from '@workspace/api-zod';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

export default function Profile() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['careerProfile'],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      return data.profile as CareerProfile | null;
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold">No Profile Found</h2>
        <p className="text-muted-foreground text-center">Go to the Resume Library and upload a resume to generate your Career Profile.</p>
      </div>
    );
  }

  // Map API data to the component structure
  const name = profile.personalInfo?.name || 'Unknown';
  const title = profile.experience?.[0]?.role || 'Professional';
  const about = profile.summary || 'No summary provided.';
  const email = profile.personalInfo?.email || '';
  
  // Group skills by generic categories (since our simple schema just has a flat array)
  const groupedSkills = profile.skills.reduce((acc, skill) => {
    // Just a placeholder grouping for the UI
    if (!acc['Core Skills']) acc['Core Skills'] = [];
    acc['Core Skills'].push(skill);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12 max-w-5xl mx-auto"
    >
      <div className="p-8 rounded-xl bg-card border border-border neu-raised relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="w-24 h-24 rounded-2xl bg-secondary border border-border flex items-center justify-center neu-inset text-3xl font-bold font-serif text-primary flex-shrink-0">
              {name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-foreground">{name}</h1>
              <p className="text-xl font-medium text-primary mt-1">{title}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-sm text-muted-foreground">
                {profile.personalInfo?.location && (
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile.personalInfo.location}</span>
                )}
                {profile.personalInfo?.email && (
                  <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {profile.personalInfo.email}</span>
                )}
                {profile.personalInfo?.links?.map((link, i) => {
                  const isGithub = link.toLowerCase().includes('github');
                  const isLinkedin = link.toLowerCase().includes('linkedin');
                  const Icon = isGithub ? Github : isLinkedin ? Linkedin : Globe;
                  const displayLink = link.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
                  const href = link.startsWith('http') ? link : `https://${link}`;
                  return (
                    <span key={i} className="flex items-center gap-1.5">
                      <Icon className="w-4 h-4" />
                      <a href={href} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                        {displayLink}
                      </a>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="neu-button">
            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border/50 relative z-10">
          <h3 className="text-lg font-bold text-foreground mb-2">About</h3>
          <p className="text-muted-foreground leading-relaxed">
            {about}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <SectionHeader title="Experience" action={<Button variant="ghost" size="icon"><Edit2 className="w-4 h-4" /></Button>} />
            <div className="pt-2 pl-2">
              {profile.experience?.map((exp, i) => (
                <TimelineCard 
                  key={i}
                  title={exp.company}
                  subtitle={exp.role}
                  description={exp.description}
                  date={`${exp.startDate || ''} - ${exp.endDate || 'Present'}`}
                  icon={Briefcase}
                  isLast={i === (profile.experience?.length || 0) - 1}
                />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Featured Projects" action={<Button variant="ghost" size="icon"><Edit2 className="w-4 h-4" /></Button>} />
            <div className="grid gap-4">
              {profile.projects?.map((project, i) => (
                <ProjectCard 
                  key={i}
                  name={project.name}
                  role="Creator"
                  description={project.description}
                  tech={project.technologies}
                  github={project.link || '#'}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <SectionHeader title="Skills" action={<Button variant="ghost" size="icon"><Edit2 className="w-4 h-4" /></Button>} />
            <div className="p-6 rounded-xl bg-card border border-border neu-raised space-y-6">
              {Object.entries(groupedSkills).map(([category, catSkills]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map(skill => (
                      <SkillBadge key={skill} skill={skill} category={category} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Education" action={<Button variant="ghost" size="icon"><Edit2 className="w-4 h-4" /></Button>} />
            <div className="grid gap-4">
              {profile.education?.map((edu, i) => (
                <div key={i} className="p-5 rounded-xl bg-card border border-border neu-raised flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{edu.institution}</h4>
                    <p className="text-sm text-primary font-medium mt-1">{edu.degree}</p>
                    <p className="text-xs text-muted-foreground mt-1">{edu.startDate} - {edu.endDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Certifications" action={<Button variant="ghost" size="icon"><Edit2 className="w-4 h-4" /></Button>} />
            <div className="grid gap-4">
              {profile.certifications?.map((cert, i) => (
                <div key={i} className="p-5 rounded-xl bg-card border border-border neu-raised flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{cert.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{cert.issuer} • {cert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/common/SectionHeader';
import { SkillBadge } from '@/components/common/SkillBadge';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { TimelineCard } from '@/components/cards/TimelineCard';
import { mockCareerProfile } from '@/mock/mockCareerProfile';
import { Button } from '@/components/ui/button';
import { Edit2, MapPin, Mail, Globe, Briefcase, GraduationCap, Award } from 'lucide-react';

export default function Profile() {
  const { name, title, about, skills, projects, experience, education, certifications } = mockCareerProfile;

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
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> San Francisco, CA</span>
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> adhi@example.com</span>
                <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> adhi.dev</span>
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
              {experience.map((exp, i) => (
                <TimelineCard 
                  key={exp.id}
                  title={exp.company}
                  subtitle={exp.role}
                  description={exp.description}
                  date={exp.period}
                  icon={Briefcase}
                  isLast={i === experience.length - 1}
                />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Featured Projects" action={<Button variant="ghost" size="icon"><Edit2 className="w-4 h-4" /></Button>} />
            <div className="grid gap-4">
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  name={project.name}
                  role={project.role}
                  description={project.description}
                  tech={project.tech}
                  github={project.link}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <SectionHeader title="Skills" action={<Button variant="ghost" size="icon"><Edit2 className="w-4 h-4" /></Button>} />
            <div className="p-6 rounded-xl bg-card border border-border neu-raised space-y-6">
              {Object.entries(skills).map(([category, catSkills]) => (
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
              {education.map((edu) => (
                <div key={edu.id} className="p-5 rounded-xl bg-card border border-border neu-raised flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{edu.institution}</h4>
                    <p className="text-sm text-primary font-medium mt-1">{edu.degree}</p>
                    <p className="text-xs text-muted-foreground mt-1">{edu.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Certifications" action={<Button variant="ghost" size="icon"><Edit2 className="w-4 h-4" /></Button>} />
            <div className="grid gap-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="p-5 rounded-xl bg-card border border-border neu-raised flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{cert.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{cert.issuer} • {cert.year}</p>
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

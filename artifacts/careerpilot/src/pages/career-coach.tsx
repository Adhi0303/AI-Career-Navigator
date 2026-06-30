import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/common/SectionHeader';
import { InsightCard } from '@/components/cards/InsightCard';
import { Brain, Target, BookOpen, TrendingUp, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CareerCoach() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12 max-w-5xl mx-auto"
    >
      <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 neu-raised">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 neu-inset">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-serif text-foreground">AI Career Coach</h1>
            <p className="text-muted-foreground mt-1">Personalized intelligence based on your profile and market trends.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard 
          title="Market Positioning"
          icon={TrendingUp}
          content={
            <div className="space-y-4">
              <p>Your profile is highly competitive for Senior Frontend roles. However, there is a rising demand for Fullstack capabilities in your target salary range.</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">High Demand: Next.js</Badge>
                <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20">Growing: GraphQL</Badge>
              </div>
            </div>
          }
        />

        <InsightCard 
          title="Skill Gap Analysis"
          icon={Target}
          content={
            <div className="space-y-3">
              <p>Based on your saved jobs, bridging these specific gaps will increase your ATS match rate by ~15%.</p>
              <ul className="list-disc pl-5 space-y-1 text-foreground">
                <li>System Architecture & Design</li>
                <li>GraphQL (advanced caching)</li>
                <li>WebSockets / Real-time sync</li>
              </ul>
            </div>
          }
          action={<Button variant="outline" className="w-full neu-button">View Learning Paths</Button>}
        />

        <InsightCard 
          title="Recommended Courses"
          icon={BookOpen}
          content={
            <div className="space-y-4 mt-2">
              <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                <h4 className="font-bold text-sm text-foreground">Grokking the System Design Interview</h4>
                <p className="text-xs text-muted-foreground mt-1">Educative.io • 20 hours • Advanced</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                <h4 className="font-bold text-sm text-foreground">Advanced GraphQL Patterns</h4>
                <p className="text-xs text-muted-foreground mt-1">Frontend Masters • 8 hours • Intermediate</p>
              </div>
            </div>
          }
        />

        <InsightCard 
          title="Strategic Recommendation"
          icon={Lightbulb}
          content={
            <p>Instead of sending more applications, focus on high-quality applications to Staff/Lead roles. Your 8 years of experience positions you well for leadership, but your resume needs to highlight mentoring and architectural decisions more prominently.</p>
          }
          action={<Button className="w-full neu-button bg-primary text-primary-foreground hover:bg-primary/90">Update Resume Narrative</Button>}
        />
      </div>
    </motion.div>
  );
}

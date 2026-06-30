import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/common/SectionHeader';
import { StatusCard } from '@/components/common/StatusCard';
import { TimelineCard } from '@/components/cards/TimelineCard';
import { WeeklyApplicationsChart } from '@/components/charts/WeeklyApplicationsChart';
import { ATSTrendChart } from '@/components/charts/ATSTrendChart';
import { mockAnalytics } from '@/mock/mockAnalytics';
import { FileText, Target, Briefcase, CheckCircle2, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const timeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const metrics = [
    { title: 'Resume Health', value: '92%', icon: FileText, trend: '4%', trendUp: true },
    { title: 'ATS Average', value: '88/100', icon: Target, trend: '2 pts', trendUp: true },
    { title: 'Active Applications', value: '12', icon: Briefcase, trend: '3', trendUp: true },
    { title: 'Interviews Scheduled', value: '4', icon: CheckCircle2, trend: '1', trendUp: true },
    { title: 'Jobs Found Today', value: '24', icon: Zap, trend: '12', trendUp: true },
    { title: 'Weekly Progress', value: '85%', icon: TrendingUp, trend: '5%', trendUp: true },
  ];

  const recentActivity = [
    { id: 1, title: 'Resume Optimized', subtitle: 'Senior SWE - Google', date: '2 hours ago', icon: FileText },
    { id: 2, title: 'Application Submitted', subtitle: 'Frontend Engineer - Stripe', date: '5 hours ago', icon: Briefcase },
    { id: 3, title: 'New Interview Invite', subtitle: 'Staff Engineer - Meta', date: '1 day ago', icon: CheckCircle2 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">{timeBasedGreeting()}, Adhi</h1>
          <p className="text-muted-foreground mt-1">Here's your career progress overview for today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="neu-button">Import Data</Button>
          <Button className="neu-button bg-primary text-primary-foreground hover:bg-primary/90">
            Generate Resume <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric, i) => (
          <StatusCard 
            key={i}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
            trendUp={metric.trendUp}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl bg-card border border-border neu-raised">
            <SectionHeader title="Weekly Applications" description="Track your application volume over the last 8 weeks." />
            <WeeklyApplicationsChart data={mockAnalytics.weeklyApplications} />
          </div>
          
          <div className="p-6 rounded-xl bg-card border border-border neu-raised">
            <SectionHeader title="ATS Score Trend" description="Your average ATS match score over time." />
            <ATSTrendChart data={mockAnalytics.atsTrend} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-card border border-border neu-raised">
            <SectionHeader title="Recent Activity" />
            <div className="pt-2">
              {recentActivity.map((activity, i) => (
                <TimelineCard 
                  key={activity.id}
                  title={activity.title}
                  subtitle={activity.subtitle}
                  date={activity.date}
                  icon={activity.icon}
                  isLast={i === recentActivity.length - 1}
                />
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary hover:bg-primary/10">
              View All Activity
            </Button>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border neu-raised bg-gradient-to-br from-card to-primary/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Career Insights</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Your recent ATS scores suggest you're highly qualified for Staff-level roles, but your resume lacks strong system design keywords.
            </p>
            <Button className="w-full neu-button bg-secondary text-secondary-foreground hover:bg-secondary/80">
              Analyze Resume Gaps
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Ensure Sparkles is imported
import { Sparkles } from 'lucide-react';

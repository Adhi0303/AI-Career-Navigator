import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Search, 
  Sparkles, 
  Wand2, 
  BarChart2, 
  GitBranch, 
  Kanban, 
  Brain, 
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from 'next-themes';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: User, label: 'Career Profile', path: '/profile' },
  { icon: FileText, label: 'Resume Library', path: '/resume-library' },
  { icon: Search, label: 'Job Discovery', path: '/job-discovery' },
  { icon: Sparkles, label: 'Job Matches', path: '/job-matches' },
  { icon: Wand2, label: 'Resume Studio', path: '/resume-studio' },
  { icon: BarChart2, label: 'ATS Analyzer', path: '/ats-analyzer' },
  { icon: GitBranch, label: 'Resume Versions', path: '/resume-versions' },
  { icon: Kanban, label: 'Applications', path: '/applications' },
  { icon: Brain, label: 'Career Coach', path: '/career-coach' },
];

export function Sidebar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="w-[280px] h-screen bg-sidebar border-r border-border fixed left-0 top-0 flex flex-col z-40 overflow-y-auto">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center neu-button">
            <span className="text-primary-foreground font-bold text-lg font-serif">C</span>
          </div>
          <span className="font-serif font-bold text-xl tracking-tight text-foreground">CareerPilot</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.path || (location === '/' && item.path === '/dashboard');
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive 
                  ? "bg-primary/10 text-primary border-l-2 border-primary" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-l-2 border-transparent"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pb-4">
        <div className="border-t border-border/50 pt-4 space-y-1">
          <Link 
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
              location === '/settings' 
                ? "bg-primary/10 text-primary border-l-2 border-primary" 
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-l-2 border-transparent"
            )}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/30 border border-border/50">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <span className="text-primary font-bold text-sm">AS</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground line-clamp-1">Adhi Sharma</span>
            <span className="text-xs text-muted-foreground line-clamp-1">Free Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

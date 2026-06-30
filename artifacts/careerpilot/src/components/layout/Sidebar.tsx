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
  Sun,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "h-screen bg-sidebar border-r border-border fixed left-0 top-0 flex flex-col z-40 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out",
          collapsed ? "w-[64px]" : "w-[280px]"
        )}
      >
        {/* Header: logo + toggle */}
        <div className={cn("flex items-center h-16 px-4 flex-shrink-0", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center neu-button flex-shrink-0">
                <span className="text-primary-foreground font-bold text-lg font-serif">C</span>
              </div>
              <span className="font-serif font-bold text-xl tracking-tight text-foreground whitespace-nowrap">CareerPilot</span>
            </Link>
          )}

          {collapsed && (
            <Link href="/dashboard" className="cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center neu-button">
                <span className="text-primary-foreground font-bold text-lg font-serif">C</span>
              </div>
            </Link>
          )}

          {!collapsed && (
            <button
              onClick={onToggle}
              data-testid="button-sidebar-collapse"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors flex-shrink-0 ml-2"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <div className="px-3 pb-2">
            <button
              onClick={onToggle}
              data-testid="button-sidebar-expand"
              className="w-full flex justify-center p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.path || (location === '/' && item.path === '/dashboard');
            const linkEl = (
              <Link
                key={item.path}
                href={item.path}
                data-testid={`nav-${item.path.replace('/', '').replace('-', '_')}`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group border-l-2",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-primary/10 text-primary border-primary"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-transparent"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">{item.label}</TooltipContent>
                </Tooltip>
              );
            }
            return linkEl;
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto px-3 pb-4">
          <div className="border-t border-border/50 pt-3 space-y-1">
            {/* Settings */}
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/settings"
                    className={cn(
                      "flex justify-center items-center px-0 py-2.5 rounded-lg text-sm font-medium transition-all border-l-2",
                      location === '/settings'
                        ? "bg-primary/10 text-primary border-primary"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-transparent"
                    )}
                  >
                    <Settings className="w-5 h-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">Settings</TooltipContent>
              </Tooltip>
            ) : (
              <Link
                href="/settings"
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-l-2",
                  location === '/settings'
                    ? "bg-primary/10 text-primary border-primary"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-transparent"
                )}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            )}

            {/* Theme toggle */}
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    data-testid="button-theme-toggle"
                    className="w-full flex justify-center items-center py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all"
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                data-testid="button-theme-toggle"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            )}
          </div>

          {/* User avatar */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mt-3 flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 cursor-pointer">
                    <span className="text-primary font-bold text-sm">AS</span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">Adhi Sharma</TooltipContent>
            </Tooltip>
          ) : (
            <div className="mt-3 flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/30 border border-border/50">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 flex-shrink-0">
                <span className="text-primary font-bold text-sm">AS</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-foreground truncate">Adhi Sharma</span>
                <span className="text-xs text-muted-foreground truncate">Free Plan</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

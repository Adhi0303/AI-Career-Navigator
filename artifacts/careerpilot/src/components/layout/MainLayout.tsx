import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useTheme } from 'next-themes';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  useEffect(() => {
    if (!localStorage.getItem('theme')) {
      setTheme('dark');
    }
  }, [setTheme]);

  const handleToggle = () => {
    setCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  };

  const sidebarWidth = collapsed ? 64 : 280;

  return (
    <div className="min-h-screen bg-background text-foreground flex w-full">
      {/* Desktop sidebar placeholder — matches sidebar fixed width */}
      <div
        className="hidden lg:block flex-shrink-0 transition-all duration-300 ease-in-out"
        style={{ width: sidebarWidth }}
      />

      {/* Fixed sidebar */}
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} onToggle={handleToggle} />
      </div>

      {/* Content area — fills all remaining width */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

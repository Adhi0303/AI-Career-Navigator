import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainLayout } from "@/components/layout/MainLayout";

import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import ResumeLibrary from "@/pages/resume-library";
import JobDiscovery from "@/pages/job-discovery";
import JobMatches from "@/pages/job-matches";
import ResumeStudio from "@/pages/resume-studio";
import AtsAnalyzer from "@/pages/ats-analyzer";
import ResumeVersions from "@/pages/resume-versions";
import Applications from "@/pages/applications";
import CareerCoach from "@/pages/career-coach";
import Settings from "@/pages/settings";

const queryClient = new QueryClient();

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={() => <Redirect to="/dashboard" />} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/profile" component={Profile} />
        <Route path="/resume-library" component={ResumeLibrary} />
        <Route path="/job-discovery" component={JobDiscovery} />
        <Route path="/job-matches" component={JobMatches} />
        <Route path="/resume-studio" component={ResumeStudio} />
        <Route path="/ats-analyzer" component={AtsAnalyzer} />
        <Route path="/resume-versions" component={ResumeVersions} />
        <Route path="/applications" component={Applications} />
        <Route path="/career-coach" component={CareerCoach} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

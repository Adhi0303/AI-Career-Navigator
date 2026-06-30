import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ResumeCard } from '@/components/cards/ResumeCard';
import { mockResumes } from '@/mock/mockResumes';
import { Button } from '@/components/ui/button';
import { Plus, UploadCloud, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CareerProfile } from '@workspace/api-zod';
import { useQuery } from '@tanstack/react-query';

export default function ResumeLibrary() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch profile from DB
  const { data: parsedProfile, refetch } = useQuery({
    queryKey: ['careerProfile'],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      return data.profile as CareerProfile | null;
    }
  });

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/api/resume/parse", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to parse resume");
      }

      // Re-fetch profile from DB after successful upload
      await refetch();
      
      setIsDialogOpen(false);
      toast({
        title: "Resume Parsed & Saved!",
        description: "Your career profile has been extracted and saved to the database.",
      });
    } catch (error: any) {
      toast({
        title: "Error parsing resume",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader 
        title="Resume Library" 
        description="Manage your base resumes and generated variants."
        action={
          <Button className="neu-button bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> New Resume
          </Button>
        }
      />

      {/* Show the parsed result dynamically instead of mocking if available */}
      {parsedProfile && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-primary/5 border border-primary/20 rounded-xl neu-inset mb-8"
        >
          <h2 className="text-xl font-bold text-foreground mb-4">Extracted AI Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong className="text-primary">Name:</strong> {parsedProfile.personalInfo?.name || 'N/A'}</p>
              <p><strong className="text-primary">Email:</strong> {parsedProfile.personalInfo?.email || 'N/A'}</p>
              <p><strong className="text-primary">Skills:</strong> {parsedProfile.skills.join(', ')}</p>
            </div>
            <div className="space-y-2">
              <p><strong className="text-primary">Experience:</strong> {parsedProfile.experience.map(e => `${e.role} at ${e.company}`).join(' | ') || 'None found'}</p>
              <p><strong className="text-primary">Projects:</strong> {parsedProfile.projects.map(p => p.name).join(', ') || 'None found'}</p>
              <p><strong className="text-primary">Education:</strong> {parsedProfile.education.map(e => e.degree).join(', ') || 'None found'}</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {mockResumes.map((resume) => (
          <motion.div key={resume.id} variants={item}>
            <ResumeCard 
              name={resume.name}
              score={resume.score}
              lastUpdated={resume.lastUpdated}
              versions={resume.versions}
            />
          </motion.div>
        ))}
        
        <motion.div variants={item}>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <div className="h-full min-h-[240px] p-6 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/30 transition-colors neu-inset">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <UploadCloud className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">Import Resume</h3>
                <p className="text-sm text-muted-foreground">Upload a PDF to start</p>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Resume for AI Parsing</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl bg-secondary/30 mt-4">
                {isUploading ? (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-sm font-medium text-muted-foreground">Groq AI is analyzing your resume...</p>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
                    <Label htmlFor="resume-upload" className="cursor-pointer">
                      <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        Select PDF File
                      </div>
                      <Input 
                        id="resume-upload" 
                        type="file" 
                        accept="application/pdf" 
                        className="hidden" 
                        onChange={handleFileUpload} 
                      />
                    </Label>
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                      Only PDF files are supported for extraction right now.
                    </p>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </motion.div>
    </div>
  );
}

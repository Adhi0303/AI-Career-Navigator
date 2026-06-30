import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Key, Database, Download, Upload, Badge } from 'lucide-react';

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-3xl mx-auto pb-12"
    >
      <SectionHeader title="Settings" description="Manage your app preferences and integrations." />

      <div className="space-y-6">
        <section className="p-6 rounded-xl bg-card border border-border neu-raised space-y-6">
          <h3 className="text-lg font-bold text-foreground border-b border-border/50 pb-3">Appearance</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-bold">Theme</Label>
              <p className="text-sm text-muted-foreground mt-1">Select your preferred color mode.</p>
            </div>
            <RadioGroup 
              value={theme} 
              onValueChange={setTheme}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2 bg-secondary/50 px-3 py-2 rounded-lg border border-border">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">Dark</Label>
              </div>
              <div className="flex items-center space-x-2 bg-secondary/50 px-3 py-2 rounded-lg border border-border">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">Light</Label>
              </div>
            </RadioGroup>
          </div>
        </section>

        <section className="p-6 rounded-xl bg-card border border-border neu-raised space-y-6">
          <h3 className="text-lg font-bold text-foreground border-b border-border/50 pb-3">AI & Models</h3>
          
          <div className="space-y-4">
            <Label className="text-base font-bold">LLM Provider</Label>
            <RadioGroup defaultValue="groq" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Groq', 'OpenAI', 'Ollama (Local)'].map(provider => (
                <div key={provider} className="flex items-center space-x-2 bg-secondary/50 p-4 rounded-xl border border-border">
                  <RadioGroupItem value={provider.toLowerCase()} id={provider} />
                  <Label htmlFor={provider}>{provider}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3 pt-2">
            <Label className="text-base font-bold">API Key</Label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" placeholder="gsk_..." className="pl-9 neu-inset bg-secondary border-transparent" defaultValue="gsk_dummykey123" />
              </div>
              <Button className="neu-button bg-secondary text-secondary-foreground hover:bg-secondary/80">Test Connection</Button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Label className="text-base font-bold">Embedding Model</Label>
            <Select defaultValue="nomic">
              <SelectTrigger className="w-full neu-inset bg-secondary border-transparent">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nomic">Nomic Embed Text (Fast)</SelectItem>
                <SelectItem value="openai">text-embedding-3-small</SelectItem>
                <SelectItem value="mxbai">mxbai-embed-large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <section className="p-6 rounded-xl bg-card border border-border neu-raised space-y-6">
          <h3 className="text-lg font-bold text-foreground border-b border-border/50 pb-3">Data Management</h3>
          
          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Label className="text-base font-bold">Local Database</Label>
                <p className="text-xs text-muted-foreground mt-0.5">IndexedDB • 24MB used</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Healthy</Badge>
          </div>

          <div className="flex gap-4 pt-2">
            <Button variant="outline" className="neu-button flex-1 h-12">
              <Download className="w-4 h-4 mr-2" /> Export All Data
            </Button>
            <Button variant="outline" className="neu-button flex-1 h-12">
              <Upload className="w-4 h-4 mr-2" /> Import Data
            </Button>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <Button className="neu-button bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base">
            <Save className="w-5 h-5 mr-2" /> Save Settings
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

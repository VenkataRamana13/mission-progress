
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CreateMissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateMission: (title: string, description: string) => void;
}

const CreateMissionDialog = ({ open, onOpenChange, onCreateMission }: CreateMissionDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateMission(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="tactical-border bg-card/95 backdrop-blur-md">
        <div className="tactical-content">
          <DialogHeader>
            <DialogTitle className="text-primary uppercase tracking-wider text-xl">
              Initialize New Operation
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title" className="text-sm font-semibold uppercase tracking-wide">
                Operation Codename
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter operation name..."
                className="mt-1 bg-secondary/50 border-primary/30 focus:border-primary"
                required
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-semibold uppercase tracking-wide">
                Mission Brief
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter mission description..."
                className="mt-1 bg-secondary/50 border-primary/30 focus:border-primary resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-secondary text-muted-foreground hover:bg-secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary text-black hover:bg-primary/90"
              >
                Deploy Operation
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMissionDialog;

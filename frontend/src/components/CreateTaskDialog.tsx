
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (title: string, difficulty: number, completed?: boolean) => void;
}

const CreateTaskDialog = ({ open, onOpenChange, onCreateTask }: CreateTaskDialogProps) => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState([3]);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateTask(title.trim(), difficulty[0], completed);
      setTitle('');
      setDifficulty([3]);
      setCompleted(false);
      onOpenChange(false);
    }
  };

  const getDifficultyLabel = (value: number) => {
    const labels = ['Trivial', 'Easy', 'Moderate', 'Hard', 'Extreme'];
    return labels[value - 1] || 'Unknown';
  };

  const getDifficultyStars = (value: number) => {
    return '★'.repeat(value) + '☆'.repeat(5 - value);
  };

  const getDifficultyColor = (value: number) => {
    const colors = ['text-green-400', 'text-yellow-400', 'text-orange-400', 'text-red-400', 'text-red-600'];
    return colors[value - 1] || 'text-gray-400';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="tactical-border bg-card/95 backdrop-blur-md">
        <div className="tactical-content">
          <DialogHeader>
            <DialogTitle className="text-primary uppercase tracking-wider text-xl">
              Create New Objective
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div>
              <Label htmlFor="title" className="text-sm font-semibold uppercase tracking-wide">
                Objective Description
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter objective details..."
                className="mt-1 bg-secondary/50 border-primary/30 focus:border-primary"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-semibold uppercase tracking-wide">
                Difficulty Assessment
              </Label>
              <div className="mt-3 space-y-3">
                <Slider
                  value={difficulty}
                  onValueChange={setDifficulty}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {getDifficultyLabel(difficulty[0])}
                  </span>
                  <span className={`font-mono text-lg ${getDifficultyColor(difficulty[0])}`}>
                    {getDifficultyStars(difficulty[0])}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={completed}
                onCheckedChange={(checked) => setCompleted(checked as boolean)}
              />
              <Label htmlFor="completed" className="text-sm font-semibold uppercase tracking-wide">
                Mark as Completed
              </Label>
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
                Deploy Objective
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;

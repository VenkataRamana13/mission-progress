
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Trash2, Check, Target } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  difficulty: number;
  completed: boolean;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  createdAt: Date;
}

interface MissionDetailsPopupProps {
  mission: Mission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleTask: (missionId: string, taskId: string) => void;
  onDeleteTask: (missionId: string, taskId: string) => void;
  onUpdateTaskDifficulty: (missionId: string, taskId: string, difficulty: number) => void;
}

const MissionDetailsPopup = ({
  mission,
  open,
  onOpenChange,
  onToggleTask,
  onDeleteTask,
  onUpdateTaskDifficulty
}: MissionDetailsPopupProps) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingDifficulty, setEditingDifficulty] = useState([3]);

  if (!mission) return null;

  const activeTasks = mission.tasks.filter(task => !task.completed);
  const completedTasks = mission.tasks.filter(task => task.completed);

  const totalDifficulty = mission.tasks.reduce((sum, task) => sum + task.difficulty, 0);
  const completedDifficulty = completedTasks.reduce((sum, task) => sum + task.difficulty, 0);
  const completionPercentage = totalDifficulty > 0 ? Math.round((completedDifficulty / totalDifficulty) * 100) : 0;

  const getDifficultyStars = (difficulty: number) => {
    return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
  };

  const getDifficultyColor = (difficulty: number) => {
    const colors = ['text-green-400', 'text-yellow-400', 'text-orange-400', 'text-red-400', 'text-red-600'];
    return colors[difficulty - 1] || 'text-gray-400';
  };

  const handleDifficultyEdit = (taskId: string, currentDifficulty: number) => {
    setEditingTaskId(taskId);
    setEditingDifficulty([currentDifficulty]);
  };

  const handleDifficultySave = (taskId: string) => {
    onUpdateTaskDifficulty(mission.id, taskId, editingDifficulty[0]);
    setEditingTaskId(null);
  };

  const handleDifficultyCancel = () => {
    setEditingTaskId(null);
    setEditingDifficulty([3]);
  };

  const renderTaskList = (tasks: Task[]) => (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center gap-3 p-3 rounded bg-secondary/50 tactical-border">
          <div className="tactical-content flex items-center gap-3 w-full">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleTask(mission.id, task.id)}
              className="w-4 h-4 accent-primary"
            />
            <span className={`flex-1 ${task.completed ? 'line-through opacity-60' : ''}`}>
              {task.title}
            </span>
            
            {editingTaskId === task.id ? (
              <div className="flex items-center gap-2 min-w-[200px]">
                <Slider
                  value={editingDifficulty}
                  onValueChange={setEditingDifficulty}
                  max={5}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span className={`text-xs font-mono ${getDifficultyColor(editingDifficulty[0])}`}>
                  {getDifficultyStars(editingDifficulty[0])}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDifficultySave(task.id)}
                  className="text-green-400 hover:text-green-300 hover:bg-green-400/10 p-1"
                >
                  <Check className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDifficultyCancel}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1"
                >
                  ×
                </Button>
              </div>
            ) : (
              <button
                onClick={() => handleDifficultyEdit(task.id, task.difficulty)}
                className={`text-sm font-mono ${getDifficultyColor(task.difficulty)} hover:opacity-80 transition-opacity cursor-pointer`}
                title="Click to edit difficulty"
              >
                {getDifficultyStars(task.difficulty)}
              </button>
            )}
            
            {editingTaskId !== task.id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteTask(mission.id, task.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      ))}
      {tasks.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No objectives in this category</p>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden tactical-border bg-card/95 backdrop-blur-sm">
        <div className="tactical-content">
          <DialogHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="hexagon w-10 h-10 bg-primary flex items-center justify-center">
                <Target className="w-5 h-5 text-black" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-primary uppercase tracking-wider">
                  {mission.title}
                </DialogTitle>
                <p className="text-muted-foreground">{mission.description}</p>
              </div>
            </div>
            
            {/* Progress Overview */}
            <div className="mt-4 p-4 tactical-border bg-secondary/30">
              <div className="tactical-content">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold uppercase tracking-wide">
                    Mission Progress
                  </span>
                  <span className="text-primary font-bold">
                    {completionPercentage}%
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-2 bg-secondary" />
                <div className="text-xs text-muted-foreground mt-1">
                  {completedTasks.length}/{mission.tasks.length} objectives completed
                </div>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="active" className="flex-1 overflow-hidden">
            <TabsList className="grid w-full grid-cols-2 bg-secondary">
              <TabsTrigger 
                value="active" 
                className="uppercase tracking-wide data-[state=active]:bg-primary data-[state=active]:text-black"
              >
                Active ({activeTasks.length})
              </TabsTrigger>
              <TabsTrigger 
                value="completed"
                className="uppercase tracking-wide data-[state=active]:bg-primary data-[state=active]:text-black"
              >
                Completed ({completedTasks.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="overflow-y-auto max-h-[400px] pr-2">
              {renderTaskList(activeTasks)}
            </TabsContent>
            
            <TabsContent value="completed" className="overflow-y-auto max-h-[400px] pr-2">
              {renderTaskList(completedTasks)}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissionDetailsPopup;

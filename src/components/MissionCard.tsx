
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Target } from 'lucide-react';

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

interface MissionCardProps {
  mission: Mission;
  onAddTask: (missionId: string) => void;
  onDeleteMission: (missionId: string) => void;
  onToggleTask: (missionId: string, taskId: string) => void;
  onDeleteTask: (missionId: string, taskId: string) => void;
}

const MissionCard = ({ 
  mission, 
  onAddTask, 
  onDeleteMission, 
  onToggleTask, 
  onDeleteTask 
}: MissionCardProps) => {
  const completedTasks = mission.tasks.filter(task => task.completed).length;
  const totalTasks = mission.tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getDifficultyStars = (difficulty: number) => {
    return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
  };

  const getDifficultyColor = (difficulty: number) => {
    const colors = ['text-green-400', 'text-yellow-400', 'text-orange-400', 'text-red-400', 'text-red-600'];
    return colors[difficulty - 1] || 'text-gray-400';
  };

  return (
    <Card className="tactical-border bg-card/90 backdrop-blur-sm">
      <div className="tactical-content p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="hexagon w-8 h-8 bg-primary flex items-center justify-center">
              <Target className="w-4 h-4 text-black" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary uppercase tracking-wider">
                {mission.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {mission.description}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteMission(mission.id)}
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold uppercase tracking-wide">
              Mission Progress
            </span>
            <span className="text-primary font-bold">
              {completionPercentage}%
            </span>
          </div>
          <Progress 
            value={completionPercentage} 
            className="h-2 bg-secondary"
          />
          <div className="text-xs text-muted-foreground mt-1">
            {completedTasks}/{totalTasks} objectives completed
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {mission.tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 p-2 rounded bg-secondary/50">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(mission.id, task.id)}
                className="w-4 h-4 accent-primary"
              />
              <span className={`flex-1 ${task.completed ? 'line-through opacity-60' : ''}`}>
                {task.title}
              </span>
              <span className={`text-sm font-mono ${getDifficultyColor(task.difficulty)}`}>
                {getDifficultyStars(task.difficulty)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteTask(mission.id, task.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          onClick={() => onAddTask(mission.id)}
          className="w-full bg-primary/20 border border-primary text-primary hover:bg-primary hover:text-black transition-all duration-200"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Objective
        </Button>
      </div>
    </Card>
  );
};

export default MissionCard;

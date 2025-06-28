import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Trash2, Plus, Target, Check, Eye } from 'lucide-react';

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
  onUpdateTaskDifficulty: (missionId: string, taskId: string, difficulty: number) => void;
  onCardClick?: (mission: Mission) => void;
  showActiveTasks?: boolean;
  maxActiveTasks?: number;
}

const MissionCard = ({ 
  mission, 
  onAddTask, 
  onDeleteMission, 
  onToggleTask, 
  onDeleteTask,
  onUpdateTaskDifficulty,
  onCardClick,
  showActiveTasks = false,
  maxActiveTasks = 2
}: MissionCardProps) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingDifficulty, setEditingDifficulty] = useState([3]);

  const totalDifficulty = mission.tasks.reduce((sum, task) => sum + task.difficulty, 0);
  const completedDifficulty = mission.tasks
    .filter(task => task.completed)
    .reduce((sum, task) => sum + task.difficulty, 0);
  const completionPercentage = totalDifficulty > 0 ? Math.round((completedDifficulty / totalDifficulty) * 100) : 0;

  const completedTasks = mission.tasks.filter(task => task.completed).length;
  const totalTasks = mission.tasks.length;

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

  const activeTasks = mission.tasks.filter(task => !task.completed);
  const displayTasks = showActiveTasks 
    ? activeTasks.slice(0, maxActiveTasks).sort((a, b) => a.id.localeCompare(b.id))
    : mission.tasks;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button, input, .slider-container')) {
      return;
    }
    onCardClick?.(mission);
  };

  return (
    <Card 
      className="tactical-border bg-card/90 backdrop-blur-sm cursor-pointer hover:bg-card/95 transition-colors"
      onClick={handleCardClick}
    >
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
          <div className="flex items-center gap-2">
            {onCardClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick(mission);
                }}
                className="text-primary hover:text-primary/80 hover:bg-primary/10"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteMission(mission.id);
              }}
              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
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
          {displayTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 p-2 rounded bg-secondary/50">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggleTask(mission.id, task.id);
                }}
                className="w-4 h-4 accent-primary"
              />
              <span className={`flex-1 ${task.completed ? 'line-through opacity-60' : ''}`}>
                {task.title}
              </span>
              
              {editingTaskId === task.id ? (
                <div className="flex items-center gap-2 min-w-[200px] slider-container">
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDifficultySave(task.id);
                    }}
                    className="text-green-400 hover:text-green-300 hover:bg-green-400/10 p-1"
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDifficultyCancel();
                    }}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1"
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDifficultyEdit(task.id, task.difficulty);
                  }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(mission.id, task.id);
                  }}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
          
          {showActiveTasks && activeTasks.length > maxActiveTasks && (
            <div className="text-xs text-muted-foreground text-center py-2">
              +{activeTasks.length - maxActiveTasks} more objectives...
            </div>
          )}
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAddTask(mission.id);
          }}
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

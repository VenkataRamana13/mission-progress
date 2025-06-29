import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Star, StarOff, Pencil, ChevronRight } from 'lucide-react';
import { Mission } from '@/lib/api';

interface MissionCardProps {
  mission: Mission;
  onAddTask: () => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskDifficulty: (taskId: string, difficulty: number) => void;
  onDelete: () => void;
  onEdit: () => void;
  onClick: () => void;
}

const getDifficultyLabel = (difficulty: number): string => {
  switch (difficulty) {
    case 1:
      return 'Easy';
    case 2:
      return 'Medium';
    case 3:
      return 'Challenging';
    case 4:
      return 'Hard';
    case 5:
      return 'Expert';
    default:
      return '';
  }
};

const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTaskDifficulty,
  onDelete,
  onEdit,
  onClick,
}) => {
  const totalDifficulty = mission.tasks.reduce((sum, task) => sum + task.difficulty, 0);
  const completedDifficulty = mission.tasks
    .filter(task => task.completed)
    .reduce((sum, task) => sum + task.difficulty, 0);
  const progress = totalDifficulty > 0 ? (completedDifficulty / totalDifficulty) * 100 : 0;

  // Get pending tasks and sort them (assuming tasks are ordered by creation time in the array)
  const pendingTasks = mission.tasks
    .filter(task => !task.completed)
    .slice(0, 2);  // Only take first 2 pending tasks

  const totalPendingTasks = mission.tasks.filter(task => !task.completed).length;
  const hasMoreTasks = totalPendingTasks > 2;

  const handleTaskToggle = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleTask(taskId);
  };

  const renderDifficultyStars = (taskId: string, difficulty: number) => {
    // Handle unknown difficulty
    if (!difficulty) {
      return (
        <img 
          src="/assets/icons/unknown-difficulty.png"
          srcSet="/assets/icons/unknown-difficulty.png 1x, /assets/icons/unknown-difficulty@2x.png 2x"
          alt="Unknown difficulty"
          className="w-4 h-4"
        />
      );
    }

    return Array.from({ length: 5 }).map((_, index) => (
      <button
        key={index}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onUpdateTaskDifficulty(taskId, index + 1);
        }}
        className="focus:outline-none"
      >
        {index < difficulty ? (
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ) : (
          <StarOff className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    ));
  };

  return (
    <Card 
      className="tactical-border bg-card/50 backdrop-blur-sm cursor-pointer relative z-0"
      onClick={onClick}
    >
      <div className="tactical-content p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-1">{mission.title}</h3>
            <p className="text-sm text-muted-foreground">{mission.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive/90"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-secondary rounded-full mb-4">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Objectives */}
        <div className="space-y-2 mb-4">
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => handleTaskToggle(task.id, e)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">
                  {task.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {renderDifficultyStars(task.id, task.difficulty)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          
          {hasMoreTasks && (
            <div className="flex items-center justify-center p-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                {totalPendingTasks - 2} more objectives
                <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          )}
        </div>

        {/* Add Objective Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onAddTask();
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Objective
        </Button>
      </div>
    </Card>
  );
};

export default MissionCard;

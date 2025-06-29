import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Star, StarOff } from 'lucide-react';
import { Mission } from '@/lib/api';

interface MissionCardProps {
  mission: Mission;
  onAddTask: () => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskDifficulty: (taskId: string, difficulty: number) => void;
  onDelete: () => void;
  onClick: () => void;
}

const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTaskDifficulty,
  onDelete,
  onClick,
}) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const totalDifficulty = mission.tasks.reduce((sum, task) => sum + task.difficulty, 0);
  const completedDifficulty = mission.tasks
    .filter(task => task.completed)
    .reduce((sum, task) => sum + task.difficulty, 0);
  const progress = totalDifficulty > 0 ? (completedDifficulty / totalDifficulty) * 100 : 0;

  const renderDifficultyStars = (taskId: string, difficulty: number) => {
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

        {/* Progress Bar */}
        <div className="w-full h-2 bg-secondary rounded-full mb-4">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Objectives */}
        <div className="space-y-2 mb-4">
          {mission.tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleTask(task.id);
                  }}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">{task.title}</span>
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

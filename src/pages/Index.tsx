
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Shield, Target } from 'lucide-react';
import MissionCard from '@/components/MissionCard';
import CreateMissionDialog from '@/components/CreateMissionDialog';
import CreateTaskDialog from '@/components/CreateTaskDialog';
import { useToast } from '@/hooks/use-toast';

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

const Index = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [createMissionOpen, setCreateMissionOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [selectedMissionId, setSelectedMissionId] = useState<string>('');
  const { toast } = useToast();

  const createMission = (title: string, description: string) => {
    const newMission: Mission = {
      id: Date.now().toString(),
      title,
      description,
      tasks: [],
      createdAt: new Date(),
    };
    setMissions(prev => [newMission, ...prev]);
    toast({
      title: "Operation Deployed",
      description: `${title} has been added to active operations.`,
    });
  };

  const deleteMission = (missionId: string) => {
    setMissions(prev => prev.filter(m => m.id !== missionId));
    toast({
      title: "Operation Terminated",
      description: "Mission has been removed from active operations.",
      variant: "destructive",
    });
  };

  const addTask = (missionId: string) => {
    setSelectedMissionId(missionId);
    setCreateTaskOpen(true);
  };

  const createTask = (title: string, difficulty: number, completed: boolean = false) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      difficulty,
      completed,
    };
    
    setMissions(prev => prev.map(mission => 
      mission.id === selectedMissionId 
        ? { ...mission, tasks: [...mission.tasks, newTask] }
        : mission
    ));
    
    toast({
      title: completed ? "Completed Objective Added" : "Objective Added",
      description: completed 
        ? "New completed objective has been added to the mission."
        : "New objective has been added to the mission.",
    });
  };

  const toggleTask = (missionId: string, taskId: string) => {
    setMissions(prev => prev.map(mission => 
      mission.id === missionId 
        ? {
            ...mission,
            tasks: mission.tasks.map(task => 
              task.id === taskId 
                ? { ...task, completed: !task.completed }
                : task
            )
          }
        : mission
    ));
  };

  const deleteTask = (missionId: string, taskId: string) => {
    setMissions(prev => prev.map(mission => 
      mission.id === missionId 
        ? { ...mission, tasks: mission.tasks.filter(task => task.id !== taskId) }
        : mission
    ));
  };

  const updateTaskDifficulty = (missionId: string, taskId: string, difficulty: number) => {
    setMissions(prev => prev.map(mission => 
      mission.id === missionId 
        ? {
            ...mission,
            tasks: mission.tasks.map(task => 
              task.id === taskId 
                ? { ...task, difficulty }
                : task
            )
          }
        : mission
    ));
    
    toast({
      title: "Difficulty Updated",
      description: "Objective difficulty has been modified.",
    });
  };

  const totalMissions = missions.length;
  const completedMissions = missions.filter(mission => {
    if (mission.tasks.length === 0) return false;
    const totalDifficulty = mission.tasks.reduce((sum, task) => sum + task.difficulty, 0);
    const completedDifficulty = mission.tasks
      .filter(task => task.completed)
      .reduce((sum, task) => sum + task.difficulty, 0);
    return completedDifficulty === totalDifficulty;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_50%)] opacity-5"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="hexagon w-12 h-12 bg-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary uppercase tracking-wider">
                Tactical Operations Hub
              </h1>
              <p className="text-muted-foreground text-lg">
                Mission Command & Control System
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="tactical-border bg-card/50 backdrop-blur-sm">
              <div className="tactical-content p-4 text-center">
                <div className="text-2xl font-bold text-primary">{totalMissions}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Active Operations</div>
              </div>
            </div>
            <div className="tactical-border bg-card/50 backdrop-blur-sm">
              <div className="tactical-content p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{completedMissions}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Completed Missions</div>
              </div>
            </div>
            <div className="tactical-border bg-card/50 backdrop-blur-sm">
              <div className="tactical-content p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {missions.reduce((total, mission) => total + mission.tasks.reduce((sum, task) => sum + task.difficulty, 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Total Difficulty Points</div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setCreateMissionOpen(true)}
            className="bg-primary text-black hover:bg-primary/90 font-semibold uppercase tracking-wider"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Deploy New Operation
          </Button>
        </div>

        {/* Missions Grid */}
        {missions.length === 0 ? (
          <div className="tactical-border bg-card/30 backdrop-blur-sm">
            <div className="tactical-content p-12 text-center">
              <Target className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-primary mb-2 uppercase tracking-wide">
                No Active Operations
              </h3>
              <p className="text-muted-foreground mb-6">
                Initialize your first tactical operation to begin mission deployment.
              </p>
              <Button
                onClick={() => setCreateMissionOpen(true)}
                className="bg-primary text-black hover:bg-primary/90 font-semibold uppercase tracking-wider"
              >
                <Plus className="w-4 h-4 mr-2" />
                Deploy First Operation
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {missions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onAddTask={addTask}
                onDeleteMission={deleteMission}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onUpdateTaskDifficulty={updateTaskDifficulty}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateMissionDialog
        open={createMissionOpen}
        onOpenChange={setCreateMissionOpen}
        onCreateMission={createMission}
      />
      
      <CreateTaskDialog
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        onCreateTask={createTask}
      />
    </div>
  );
};

export default Index;

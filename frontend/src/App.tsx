import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Shield, Target } from 'lucide-react'
import MissionCard from '@/components/MissionCard'
import CreateMissionDialog from '@/components/CreateMissionDialog'
import CreateObjectiveDialog from '@/components/CreateTaskDialog'
import MissionDetailsPopup from '@/components/MissionDetailsPopup'
import { useToast } from '@/hooks/use-toast'
import { missionApi, Mission, Task } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function App() {
  const [createMissionOpen, setCreateMissionOpen] = useState(false)
  const [createObjectiveOpen, setCreateObjectiveOpen] = useState(false)
  const [selectedMissionId, setSelectedMissionId] = useState<string>('')
  const [selectedMissionForDetails, setSelectedMissionForDetails] = useState<Mission | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch missions
  const { data: missions = [], isLoading, error } = useQuery({
    queryKey: ['missions'],
    queryFn: missionApi.getAllMissions,
  })

  // Create mission mutation
  const createMissionMutation = useMutation({
    mutationFn: (data: { title: string; description: string }) => 
      missionApi.createMission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      toast({
        title: "Mission Deployed",
        description: "New mission has been added to active missions.",
      })
    },
    onError: (error) => {
      toast({
        title: "Mission Failed",
        description: "Failed to create new mission. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Delete mission mutation
  const deleteMissionMutation = useMutation({
    mutationFn: missionApi.deleteMission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      toast({
        title: "Mission Terminated",
        description: "Mission has been removed from active missions.",
        variant: "destructive",
      })
    },
  })

  // Update mission mutation
  const updateMissionMutation = useMutation({
    mutationFn: ({ id, mission }: { id: string; mission: Partial<Mission> }) =>
      missionApi.updateMission(id, mission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] })
    },
  })

  const createMission = (title: string, description: string) => {
    createMissionMutation.mutate({ title, description })
  }

  const deleteMission = (missionId: string) => {
    deleteMissionMutation.mutate(missionId)
  }

  const addObjective = (missionId: string) => {
    setSelectedMissionId(missionId)
    setCreateObjectiveOpen(true)
  }

  const createObjective = async (title: string, difficulty: number, completed: boolean = false) => {
    const mission = missions.find(m => m.id === selectedMissionId)
    if (!mission) return

    try {
      await missionApi.addTask(selectedMissionId, {
        title,
        difficulty,
        completed
      })

      queryClient.invalidateQueries({ queryKey: ['missions'] })
      
      toast({
        title: completed ? "Completed Objective Added" : "Objective Added",
        description: completed 
          ? "New completed objective has been added to the mission."
          : "New objective has been added to the mission.",
      })
    } catch (error) {
      toast({
        title: "Failed to Add Objective",
        description: "There was an error adding the objective. Please try again.",
        variant: "destructive"
      })
    }
  }

  const toggleObjective = async (missionId: string, taskId: string) => {
    const mission = missions.find(m => m.id === missionId)
    if (!mission) return

    const task = mission.tasks.find(t => t.id === taskId)
    if (!task) return

    try {
      await missionApi.updateTask(missionId, taskId, {
        completed: !task.completed
      })
      
      queryClient.invalidateQueries({ queryKey: ['missions'] })
    } catch (error) {
      toast({
        title: "Failed to Update Objective",
        description: "There was an error updating the objective status. Please try again.",
        variant: "destructive"
      })
    }
  }

  const deleteObjective = async (missionId: string, taskId: string) => {
    try {
      await missionApi.deleteTask(missionId, taskId)
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      
      toast({
        title: "Objective Removed",
        description: "The objective has been removed from the mission.",
      })
    } catch (error) {
      toast({
        title: "Failed to Remove Objective",
        description: "There was an error removing the objective. Please try again.",
        variant: "destructive"
      })
    }
  }

  const updateObjectiveDifficulty = async (missionId: string, taskId: string, difficulty: number) => {
    try {
      await missionApi.updateTask(missionId, taskId, { difficulty })
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      
      toast({
        title: "Difficulty Updated",
        description: "Objective difficulty has been modified.",
      })
    } catch (error) {
      toast({
        title: "Failed to Update Difficulty",
        description: "There was an error updating the objective difficulty. Please try again.",
        variant: "destructive"
      })
    }
  }

  const totalMissions = Array.isArray(missions) ? missions.length : 0
  const completedMissions = Array.isArray(missions) ? missions.filter(mission => {
    if (mission.tasks.length === 0) return false
    const totalDifficulty = mission.tasks.reduce((sum, task) => sum + task.difficulty, 0)
    const completedDifficulty = mission.tasks
      .filter(task => task.completed)
      .reduce((sum, task) => sum + task.difficulty, 0)
    return completedDifficulty === totalDifficulty
  }).length : 0

  const totalObjectives = Array.isArray(missions) ? missions.reduce((total, mission) => total + mission.tasks.length, 0) : 0

  const handleMissionCardClick = (mission: Mission) => {
    setSelectedMissionForDetails(mission)
  }

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center">
      <div className="text-primary">Loading missions...</div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center">
      <div className="text-destructive">Error loading missions</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_50%)] opacity-5"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-4 py-8 relative">
        {/* Header */}
        <div className="mb-8 relative z-10">
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
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Active Missions</div>
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
                  {totalObjectives}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Total Objectives</div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setCreateMissionOpen(true)}
            className="bg-primary text-black hover:bg-primary/90 font-semibold uppercase tracking-wider"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Deploy New Mission
          </Button>
        </div>

        {/* Missions Grid */}
        <div className="relative z-0">
          {!Array.isArray(missions) || missions.length === 0 ? (
            <div className="tactical-border bg-card/30 backdrop-blur-sm">
              <div className="tactical-content p-12 text-center">
                <Target className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-primary mb-2 uppercase tracking-wide">
                  No Active Missions
                </h3>
                <p className="text-muted-foreground mb-6">
                  Initialize your first tactical mission to begin mission deployment.
                </p>
                <Button
                  onClick={() => setCreateMissionOpen(true)}
                  className="bg-primary text-black hover:bg-primary/90 font-semibold uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Deploy First Mission
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {missions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onAddTask={() => addObjective(mission.id)}
                  onToggleTask={(taskId) => toggleObjective(mission.id, taskId)}
                  onDeleteTask={(taskId) => deleteObjective(mission.id, taskId)}
                  onUpdateTaskDifficulty={(taskId, difficulty) =>
                    updateObjectiveDifficulty(mission.id, taskId, difficulty)
                  }
                  onDelete={() => deleteMission(mission.id)}
                  onClick={() => handleMissionCardClick(mission)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Dialogs */}
        <CreateMissionDialog
          open={createMissionOpen}
          onOpenChange={setCreateMissionOpen}
          onSubmit={createMission}
        />
        <CreateObjectiveDialog
          open={createObjectiveOpen}
          onOpenChange={setCreateObjectiveOpen}
          onSubmit={createObjective}
        />
        <MissionDetailsPopup
          mission={selectedMissionForDetails}
          onClose={() => setSelectedMissionForDetails(null)}
        />
      </div>
    </div>
  )
}

export default App

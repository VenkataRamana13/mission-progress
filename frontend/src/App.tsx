import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Shield, Target, ChevronLeft, ChevronRight } from 'lucide-react'
import MissionCard from '@/components/MissionCard'
import CreateMissionDialog from '@/components/CreateMissionDialog'
import CreateObjectiveDialog from '@/components/CreateTaskDialog'
import MissionDetailsPopup from '@/components/MissionDetailsPopup'
import EditMissionDialog from '@/components/EditMissionDialog'
import EditObjectiveDialog from './components/EditObjectiveDialog'
import { useToast } from '@/hooks/use-toast'
import { missionApi, Mission, Task, Page, PageRequest } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function App() {
  const [createMissionOpen, setCreateMissionOpen] = useState(false)
  const [createObjectiveOpen, setCreateObjectiveOpen] = useState(false)
  const [editMissionOpen, setEditMissionOpen] = useState(false)
  const [editObjectiveOpen, setEditObjectiveOpen] = useState(false)
  const [selectedMissionId, setSelectedMissionId] = useState<string>('')
  const [selectedMissionForEdit, setSelectedMissionForEdit] = useState<Mission | null>(null)
  const [selectedMissionForDetails, setSelectedMissionForDetails] = useState<Mission | null>(null)
  const [selectedObjective, setSelectedObjective] = useState<Task | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(9) // 9 missions per page (3x3 grid)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch missions with pagination
  const { data: missionPage, isLoading, error } = useQuery({
    queryKey: ['missions', currentPage, pageSize],
    queryFn: () => missionApi.getAllMissions({ page: currentPage, size: pageSize }),
  })

  const missions = missionPage?.content || []
  const totalPages = missionPage?.totalPages || 0

  // Pre-fetch next page
  useQuery({
    queryKey: ['missions', currentPage + 1, pageSize],
    queryFn: () => missionApi.getAllMissions({ page: currentPage + 1, size: pageSize }),
    enabled: !!(currentPage + 1 < totalPages),
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
      console.error('Create mission error:', error)
      toast({
        title: "Mission Failed",
        description: "Failed to create new mission. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Delete mission mutation
  const deleteMissionMutation = useMutation({
    mutationFn: (id: number) => missionApi.deleteMission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      toast({
        title: "Mission Terminated",
        description: "Mission has been removed from active missions.",
        variant: "destructive",
      })
    },
    onError: (error) => {
      console.error('Delete mission error:', error)
      toast({
        title: "Error",
        description: "Failed to delete mission. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Update mission mutation
  const updateMissionMutation = useMutation({
    mutationFn: ({ id, mission }: { id: number; mission: Partial<Mission> }) =>
      missionApi.updateMission(id, mission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] })
    },
  })

  const createMission = (title: string, description: string) => {
    createMissionMutation.mutate({ title, description })
  }

  const deleteMission = (missionId: string) => {
    deleteMissionMutation.mutate(parseInt(missionId))
  }

  const addObjective = (missionId: string) => {
    setSelectedMissionId(missionId)
    setCreateObjectiveOpen(true)
  }

  const createObjective = async (title: string, difficulty: number, completed: boolean = false) => {
    const mission = missions.find(m => m.id === selectedMissionId)
    if (!mission) return

    try {
      // Optimistically update the UI
      const newTask = {
        id: `temp-${Date.now()}`, // Temporary ID that will be replaced after API call
        title,
        difficulty,
        completed
      }

      queryClient.setQueryData(['missions'], (oldData: Page<Mission> | undefined) => {
        if (!oldData) return { content: [], totalPages: 0, totalElements: 0, size: pageSize, number: currentPage, first: true, last: true, empty: true }
        return {
          ...oldData,
          content: oldData.content.map(m => {
            if (m.id === mission.id) {
              return {
                ...m,
                tasks: [...m.tasks, newTask]
              }
            }
            return m
          })
        }
      })

      await missionApi.addTask(selectedMissionId, {
        title,
        difficulty,
        completed
      })

      // Refresh to get the real ID from the server
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      
      toast({
        title: completed ? "Completed Objective Added" : "Objective Added",
        description: completed 
          ? "New completed objective has been added to the mission."
          : "New objective has been added to the mission.",
      })
    } catch (error) {
      // Revert optimistic update
      queryClient.invalidateQueries({ queryKey: ['missions'] })
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
      // Optimistically update the UI
      queryClient.setQueryData(['missions'], (oldData: Page<Mission> | undefined) => {
        if (!oldData) return { content: [], totalPages: 0, totalElements: 0, size: pageSize, number: currentPage, first: true, last: true, empty: true }
        return {
          ...oldData,
          content: oldData.content.map(m => {
            if (m.id === missionId) {
              return {
                ...m,
                tasks: m.tasks.map(t =>
                  t.id === taskId
                    ? { ...t, completed: !t.completed }
                    : t
                )
              }
            }
            return m
          })
        }
      })

      await missionApi.updateTask(missionId, taskId, {
        title: task.title,
        difficulty: task.difficulty,
        completed: !task.completed
      })
    } catch (error) {
      // Revert optimistic update
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      toast({
        title: "Failed to Update Objective",
        description: "There was an error updating the objective status. Please try again.",
        variant: "destructive"
      })
    }
  }

  const deleteObjective = async (missionId: string, taskId: string) => {
    const mission = missions.find(m => m.id === missionId)
    if (!mission) return

    try {
      // Optimistically update the UI
      queryClient.setQueryData(['missions'], (oldData: Page<Mission> | undefined) => {
        if (!oldData) return { content: [], totalPages: 0, totalElements: 0, size: pageSize, number: currentPage, first: true, last: true, empty: true }
        return {
          ...oldData,
          content: oldData.content.map(m => {
            if (m.id === missionId) {
              return {
                ...m,
                tasks: m.tasks.filter(t => t.id !== taskId)
              }
            }
            return m
          })
        }
      })

      await missionApi.deleteTask(missionId, taskId)
      
      toast({
        title: "Objective Removed",
        description: "The objective has been removed from the mission.",
      })
    } catch (error) {
      // Revert optimistic update
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      toast({
        title: "Failed to Remove Objective",
        description: "There was an error removing the objective. Please try again.",
        variant: "destructive"
      })
    }
  }

  const updateObjectiveDifficulty = async (missionId: string, taskId: string, difficulty: number) => {
    const mission = missions.find(m => m.id === missionId)
    if (!mission) return

    const task = mission.tasks.find(t => t.id === taskId)
    if (!task) return

    try {
      // Optimistically update the UI
      queryClient.setQueryData(['missions'], (oldData: Page<Mission> | undefined) => {
        if (!oldData) return { content: [], totalPages: 0, totalElements: 0, size: pageSize, number: currentPage, first: true, last: true, empty: true }
        return {
          ...oldData,
          content: oldData.content.map(m => {
            if (m.id === missionId) {
              return {
                ...m,
                tasks: m.tasks.map(t =>
                  t.id === taskId
                    ? { ...t, difficulty }
                    : t
                )
              }
            }
            return m
          })
        }
      })

      await missionApi.updateTask(missionId, taskId, {
        title: task.title,
        difficulty,
        completed: task.completed
      })
    } catch (error) {
      // Revert optimistic update
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      toast({
        title: "Failed to Update Difficulty",
        description: "There was an error updating the objective difficulty. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleEditObjective = (task: Task) => {
    setSelectedObjective(task)
    setEditObjectiveOpen(true)
  }

  const handleUpdateObjective = async (taskId: string, title: string, difficulty: number) => {
    const mission = missions.find(m => m.tasks.some(t => t.id === taskId))
    if (!mission) return

    try {
      // Optimistically update the UI
      queryClient.setQueryData(['missions'], (oldData: Page<Mission> | undefined) => {
        if (!oldData) return { content: [], totalPages: 0, totalElements: 0, size: pageSize, number: currentPage, first: true, last: true, empty: true }
        return {
          ...oldData,
          content: oldData.content.map(m => {
            if (m.id === mission.id) {
              return {
                ...m,
                tasks: m.tasks.map(t =>
                  t.id === taskId
                    ? { ...t, title, difficulty }
                    : t
                )
              }
            }
            return m
          })
        }
      })

      await missionApi.updateTask(mission.id, taskId, {
        title,
        difficulty,
        completed: selectedObjective?.completed || false
      })
    } catch (error) {
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      toast({
        title: 'Error',
        description: 'Failed to update objective. Please try again.',
        variant: 'destructive',
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

  const handleEditMission = (mission: Mission) => {
    setSelectedMissionForEdit(mission)
    setEditMissionOpen(true)
  }

  const handleUpdateMission = (title: string, description: string) => {
    if (!selectedMissionForEdit) return

    updateMissionMutation.mutate({
      id: selectedMissionForEdit.id,
      mission: {
        ...selectedMissionForEdit,
        title,
        description
      }
    })

    toast({
      title: "Mission Updated",
      description: "Mission details have been updated successfully.",
    })
  }

  const handleNextPage = () => {
    if (currentPage + 1 < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    }
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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
                    onEditTask={handleEditObjective}
                    onDelete={() => deleteMission(mission.id)}
                    onEdit={() => handleEditMission(mission)}
                    onClick={() => handleMissionCardClick(mission)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-muted-foreground">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={currentPage + 1 >= totalPages}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
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
        <EditMissionDialog
          open={editMissionOpen}
          onOpenChange={setEditMissionOpen}
          mission={selectedMissionForEdit}
          onSubmit={handleUpdateMission}
        />
        <EditObjectiveDialog
          open={editObjectiveOpen}
          onOpenChange={setEditObjectiveOpen}
          task={selectedObjective}
          onSubmit={handleUpdateObjective}
        />
        <MissionDetailsPopup
          mission={selectedMissionForDetails}
          onClose={() => setSelectedMissionForDetails(null)}
          onToggleTask={(taskId) => toggleObjective(selectedMissionForDetails?.id || '', taskId)}
          onEditTask={handleEditObjective}
          onDeleteTask={(taskId) => deleteObjective(selectedMissionForDetails?.id || '', taskId)}
        />
      </div>
    </div>
  )
}

export default App

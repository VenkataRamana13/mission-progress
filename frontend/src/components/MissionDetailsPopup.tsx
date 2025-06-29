import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, Star, StarOff } from 'lucide-react'
import { Mission } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { missionApi } from '@/lib/api'
import { useVirtualizer } from '@tanstack/react-virtual'

interface MissionDetailsPopupProps {
  mission: Mission | null
  onClose: () => void
  onToggleTask: (taskId: string) => void
}

// Add difficulty level descriptions
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

const renderDifficultyStars = (difficulty: number) => {
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
    <span key={index} className="inline-block">
      {index < difficulty ? (
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      ) : (
        <StarOff className="w-4 h-4 text-muted-foreground" />
      )}
    </span>
  ));
};

const MissionDetailsPopup: React.FC<MissionDetailsPopupProps> = ({
  mission,
  onClose,
  onToggleTask,
}) => {
  if (!mission) return null

  // Subscribe to mission updates
  const { data: missionsPage } = useQuery({
    queryKey: ['missions'],
    select: (data: any) => {
      // Handle both paginated and non-paginated responses
      const missions = data?.content || data || []
      return Array.isArray(missions) ? missions.find(m => m.id === mission.id) : null
    },
    enabled: !!mission
  })

  // Use the updated mission data if available, otherwise fall back to prop
  const currentMission = missionsPage || mission

  const totalDifficulty = currentMission.tasks.reduce((sum, task) => sum + task.difficulty, 0)
  const completedDifficulty = currentMission.tasks
    .filter(task => task.completed)
    .reduce((sum, task) => sum + task.difficulty, 0)
  const progress = totalDifficulty > 0 ? (completedDifficulty / totalDifficulty) * 100 : 0

  // Create a container ref for the virtualized list
  const parentRef = React.useRef<HTMLDivElement>(null)

  // Set up virtualization
  const rowVirtualizer = useVirtualizer({
    count: currentMission.tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // Estimated height of each task row
    overscan: 5, // Number of items to render outside the visible area
  })

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]"
        onClick={onClose}
      />
      <div className="fixed left-[50%] top-[50%] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] z-[150]">
        <div className="tactical-border bg-card/95 backdrop-blur-sm">
          <div className="tactical-content p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-2">{currentMission.title}</h2>
                <p className="text-muted-foreground">{currentMission.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-6">
              <div className="text-sm text-muted-foreground mb-2">Mission Progress</div>
              <div className="w-full h-2 bg-secondary rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-right text-sm text-muted-foreground mt-1">
                {progress.toFixed(0)}%
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Mission Objectives</h3>
              <div 
                ref={parentRef}
                className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-secondary/20"
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const task = currentMission.tasks[virtualRow.index]
                    return (
                      <div
                        key={task.id}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <div className="flex items-center justify-between p-3 rounded-md bg-secondary/50 mb-2">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => onToggleTask(task.id)}
                              className="w-4 h-4 rounded border-gray-300"
                            />
                            <span className={`transition-all duration-200 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {renderDifficultyStars(task.difficulty)}
                            </div>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({getDifficultyLabel(task.difficulty)})
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MissionDetailsPopup

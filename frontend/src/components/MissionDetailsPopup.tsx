import React from 'react'
import { Mission } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface MissionDetailsPopupProps {
  mission: Mission | null
  onClose: () => void
}

const MissionDetailsPopup: React.FC<MissionDetailsPopupProps> = ({
  mission,
  onClose,
}) => {
  if (!mission) return null

  const totalDifficulty = mission.tasks.reduce((sum, task) => sum + task.difficulty, 0)
  const completedDifficulty = mission.tasks
    .filter(task => task.completed)
    .reduce((sum, task) => sum + task.difficulty, 0)
  const progress = totalDifficulty > 0 ? (completedDifficulty / totalDifficulty) * 100 : 0

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
                <h2 className="text-2xl font-bold text-primary mb-2">{mission.title}</h2>
                <p className="text-muted-foreground">{mission.description}</p>
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
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-right text-sm text-muted-foreground mt-1">
                {progress.toFixed(0)}%
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Mission Objectives</h3>
              <div className="space-y-2">
                {mission.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-md bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        readOnly
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                        {task.title}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Difficulty: {task.difficulty}
                    </div>
                  </div>
                ))}
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

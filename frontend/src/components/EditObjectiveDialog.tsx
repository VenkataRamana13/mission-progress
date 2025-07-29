import React, { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from './ui/button'
import { Star, StarOff, X } from 'lucide-react'
import { Task } from '../lib/api'

interface EditObjectiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  onSubmit: (taskId: string, title: string, difficulty: number) => void
}

const EditObjectiveDialog: React.FC<EditObjectiveDialogProps> = ({
  open,
  onOpenChange,
  task,
  onSubmit,
}) => {
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState(3)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDifficulty(task.difficulty)
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (task) {
      onSubmit(task.id, title, difficulty)
      onOpenChange(false)
    }
  }

  const getDifficultyLabel = (difficulty: number): string => {
    switch (difficulty) {
      case 1:
        return 'Easy'
      case 2:
        return 'Moderate'
      case 3:
        return 'Intermediate'
      case 4:
        return 'Hard'
      case 5:
        return 'Expert'
      default:
        return 'Unknown'
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <button
        key={index}
        type="button"
        onClick={(e) => {
          e.preventDefault()
          setDifficulty(index + 1)
        }}
        className="focus:outline-none"
      >
        {index < difficulty ? (
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
        ) : (
          <StarOff className="w-6 h-6 text-muted-foreground" />
        )}
      </button>
    ))
  }

  if (!task) return null

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background p-6 shadow-lg z-[100]">
          <Dialog.Title className="text-xl font-bold text-primary mb-4">
            Edit Objective
          </Dialog.Title>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-foreground block mb-2"
                >
                  Objective Title
                </label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border bg-background text-foreground"
                  placeholder="Enter objective title"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Difficulty Level
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {renderStars()}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {getDifficultyLabel(difficulty)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default EditObjectiveDialog 
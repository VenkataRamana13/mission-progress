import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { X, Star, StarOff } from 'lucide-react'

// Add difficulty level descriptions
const getDifficultyLabel = (difficulty: number): string => {
  switch (difficulty) {
    case 0:
      return 'Unknown';
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
      return 'Unknown';
  }
};

interface CreateObjectiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (title: string, difficulty: number, completed?: boolean) => void
}

const CreateObjectiveDialog: React.FC<CreateObjectiveDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState(3)
  const [completed, setCompleted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(title, difficulty, completed)
    setTitle('')
    setDifficulty(3)
    setCompleted(false)
    onOpenChange(false)
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

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background p-6 shadow-lg z-[100]">
          <Dialog.Title className="text-xl font-bold text-primary mb-4">
            Add New Objective
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

              <div className="flex items-center gap-2">
                <input
                  id="completed"
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label
                  htmlFor="completed"
                  className="text-sm font-medium text-foreground"
                >
                  Mark as completed
                </label>
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
              <Button type="submit">Add Objective</Button>
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

export default CreateObjectiveDialog

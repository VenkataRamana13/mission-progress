import React, { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Mission } from '@/lib/api'

interface EditMissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mission: Mission | null
  onSubmit: (title: string, description: string) => void
}

const EditMissionDialog: React.FC<EditMissionDialogProps> = ({
  open,
  onOpenChange,
  mission,
  onSubmit,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (mission) {
      setTitle(mission.title)
      setDescription(mission.description)
    }
  }, [mission])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(title, description)
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background p-6 shadow-lg z-[100]">
          <Dialog.Title className="text-xl font-bold text-primary mb-4">
            Edit Mission
          </Dialog.Title>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-foreground block mb-2"
                >
                  Mission Title
                </label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border bg-background text-foreground"
                  placeholder="Enter mission title"
                  required
                />
              </div>
              
              <div>
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-foreground block mb-2"
                >
                  Mission Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border bg-background text-foreground min-h-[100px]"
                  placeholder="Enter mission description"
                  required
                />
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

export default EditMissionDialog 
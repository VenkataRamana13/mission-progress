import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onNext: () => void
  onPrev: () => void
}

function PaginationControls({ currentPage, totalPages, onNext, onPrev }: PaginationControlsProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <Button
        variant="outline"
        onClick={onPrev}
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
        onClick={onNext}
        disabled={currentPage + 1 >= totalPages}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}

export default PaginationControls
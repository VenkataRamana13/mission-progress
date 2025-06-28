import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mission } from '@/services/api';

interface MissionDetailsPopupProps {
  mission: Mission;
  onClose: () => void;
}

const MissionDetailsPopup: React.FC<MissionDetailsPopupProps> = ({
  mission,
  onClose,
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mission.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Description</h3>
            <p className="text-sm text-gray-600 mt-1">{mission.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium">Status</h3>
            <p className={`text-sm mt-1 ${mission.completed ? 'text-green-600' : 'text-yellow-600'}`}>
              {mission.completed ? 'Completed' : 'In Progress'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium">Rating</h3>
            <p className="text-sm text-gray-600 mt-1">
              {mission.rating > 0 ? `${mission.rating}/5` : 'Not rated'}
            </p>
          </div>

          {mission.operation && (
            <div>
              <h3 className="text-sm font-medium">Parent Operation</h3>
              <p className="text-sm text-gray-600 mt-1">{mission.operation.name}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MissionDetailsPopup; 
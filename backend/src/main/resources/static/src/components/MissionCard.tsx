import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Mission } from '@/services/api';

interface MissionCardProps {
  mission: Mission;
  onDeleteMission: (id: number) => void;
  onCardClick?: (mission: Mission) => void;
}

const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onDeleteMission,
  onCardClick,
}) => {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onCardClick?.(mission)}
    >
      <CardHeader>
        <CardTitle>{mission.name}</CardTitle>
        <CardDescription>{mission.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <span className={`text-sm ${mission.completed ? 'text-green-600' : 'text-yellow-600'}`}>
            {mission.completed ? 'Completed' : 'In Progress'}
          </span>
        </div>
        {mission.rating > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-medium">Rating:</span>
            <span className="text-sm">{mission.rating}/5</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteMission(mission.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MissionCard; 
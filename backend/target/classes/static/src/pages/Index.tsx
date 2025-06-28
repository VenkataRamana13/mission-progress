import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Shield, Target } from 'lucide-react';
import MissionCard from '@/components/MissionCard';
import CreateMissionDialog from '@/components/CreateMissionDialog';
import CreateTaskDialog from '@/components/CreateTaskDialog';
import MissionDetailsPopup from '@/components/MissionDetailsPopup';
import { useToast } from '@/hooks/use-toast';
import { Mission, Operation, getMissions, createMission as apiCreateMission, deleteMission as apiDeleteMission } from '@/services/api';

const Index = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createMissionOpen, setCreateMissionOpen] = useState(false);
  const [selectedMissionForDetails, setSelectedMissionForDetails] = useState<Mission | null>(null);
  const { toast } = useToast();

  // Fetch missions on component mount
  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMissions();
      setMissions(data);
    } catch (err) {
      setError('Failed to fetch missions');
      toast({
        title: "Error",
        description: "Failed to fetch missions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMission = async (name: string, description: string) => {
    try {
      const newMission = await apiCreateMission({
        name,
        description,
        completed: false,
        rating: 0
      });
      
      setMissions(prev => [newMission, ...prev]);
      toast({
        title: "Operation Deployed",
        description: `${name} has been added to active operations.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create mission. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteMission = async (id: number) => {
    try {
      await apiDeleteMission(id);
      setMissions(prev => prev.filter(m => m.id !== id));
      toast({
        title: "Operation Terminated",
        description: "Mission has been removed from active operations.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete mission. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading missions...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <Button onClick={fetchMissions}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Active Operations</h1>
        <Button onClick={() => setCreateMissionOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Operation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {missions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onDeleteMission={deleteMission}
            onCardClick={setSelectedMissionForDetails}
          />
        ))}
      </div>

      <CreateMissionDialog
        open={createMissionOpen}
        onOpenChange={setCreateMissionOpen}
        onSubmit={createMission}
      />

      {selectedMissionForDetails && (
        <MissionDetailsPopup
          mission={selectedMissionForDetails}
          onClose={() => setSelectedMissionForDetails(null)}
        />
      )}
    </div>
  );
};

export default Index; 
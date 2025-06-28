import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface Task {
  id: string;
  title: string;
  difficulty: number;
  completed: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  createdAt: Date;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const missionApi = {
  getAllMissions: async (): Promise<Mission[]> => {
    const response = await api.get('/missions');
    return response.data;
  },

  getMissionById: async (id: string): Promise<Mission> => {
    const response = await api.get(`/missions/${id}`);
    return response.data;
  },

  createMission: async (data: { title: string; description: string }): Promise<Mission> => {
    const mission = {
      ...data,
      tasks: [],
      createdAt: new Date(),
    };
    const response = await api.post('/missions', mission);
    return response.data;
  },

  updateMission: async (id: string, mission: Partial<Mission>): Promise<Mission> => {
    const response = await api.put(`/missions/${id}`, mission);
    return response.data;
  },

  deleteMission: async (id: string): Promise<void> => {
    await api.delete(`/missions/${id}`);
  },
}; 
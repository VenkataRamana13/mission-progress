import axios from 'axios';

const API_BASE_URL = 'http://localhost:8085/api';

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
  completed: boolean;
  createdAt: string;
  tasks: Task[];
}

export const missionApi = {
  getAllMissions: async (): Promise<Mission[]> => {
    const response = await axios.get(`${API_BASE_URL}/missions`);
    return response.data;
  },

  getMission: async (id: string): Promise<Mission> => {
    const response = await axios.get(`${API_BASE_URL}/missions/${id}`);
    return response.data;
  },

  createMission: async (data: { title: string; description: string }): Promise<Mission> => {
    // For now, we'll use a default operation ID of 1
    const operationId = 1;
    const response = await axios.post(`${API_BASE_URL}/missions/operation/${operationId}`, data);
    return response.data;
  },

  updateMission: async (id: string, mission: Partial<Mission>): Promise<Mission> => {
    const response = await axios.put(`${API_BASE_URL}/missions/${id}`, mission);
    return response.data;
  },

  deleteMission: async (id: string): Promise<void> => {
    // Convert string ID to number since backend expects a Long
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      throw new Error('Invalid mission ID');
    }
    await axios.delete(`${API_BASE_URL}/missions/${numericId}`);
  },

  // Task-related endpoints
  addTask: async (missionId: string, task: Omit<Task, 'id'>): Promise<Task> => {
    // Convert string ID to number since backend expects a Long
    const numericId = parseInt(missionId);
    if (isNaN(numericId)) {
      throw new Error('Invalid mission ID');
    }
    const response = await axios.post(`${API_BASE_URL}/missions/${numericId}/tasks`, task);
    return response.data;
  },

  updateTask: async (missionId: string, taskId: string, task: Partial<Task>): Promise<Task> => {
    // Convert string IDs to numbers since backend expects Longs
    const numericMissionId = parseInt(missionId);
    const numericTaskId = parseInt(taskId);
    if (isNaN(numericMissionId) || isNaN(numericTaskId)) {
      throw new Error('Invalid mission or task ID');
    }
    const response = await axios.put(
      `${API_BASE_URL}/missions/${numericMissionId}/tasks/${numericTaskId}`,
      task
    );
    return response.data;
  },

  deleteTask: async (missionId: string, taskId: string): Promise<void> => {
    // Convert string IDs to numbers since backend expects Longs
    const numericMissionId = parseInt(missionId);
    const numericTaskId = parseInt(taskId);
    if (isNaN(numericMissionId) || isNaN(numericTaskId)) {
      throw new Error('Invalid mission or task ID');
    }
    await axios.delete(`${API_BASE_URL}/missions/${numericMissionId}/tasks/${numericTaskId}`);
  }
}; 
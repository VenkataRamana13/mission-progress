import axios from 'axios';

const API_BASE_URL = 'http://localhost:8085/api';

export interface Task {
  id: string;
  title: string;
  difficulty: number;
  completed: boolean;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  tasks: Task[];
}

export interface PageRequest {
  page: number;
  size: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const missionApi = {
  getAllMissions: async (pageRequest: PageRequest = { page: 0, size: 10 }): Promise<Page<Mission>> => {
    try {
      const { page, size, sortBy = 'createdAt', direction = 'desc' } = pageRequest;
      const response = await axios.get(`${API_BASE_URL}/missions`, {
        params: {
          page,
          size,
          sortBy,
          direction,
        },
      });
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching missions:', error);
      throw error;
    }
  },

  getMission: async (id: number): Promise<Mission> => {
    const response = await axios.get(`${API_BASE_URL}/missions/${id}`);
    return response.data;
  },

  createMission: async (data: { title: string; description: string }): Promise<Mission> => {
    // For now, we'll use a default operation ID of 1
    const operationId = 1;
    const response = await axios.post(`${API_BASE_URL}/missions/operation/${operationId}`, data);
    return response.data;
  },

  updateMission: async (id: number, mission: Partial<Mission>): Promise<Mission> => {
    const response = await axios.put(`${API_BASE_URL}/missions/${id}`, mission);
    return response.data;
  },

  deleteMission: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/missions/${id}`);
  },

  // Task-related endpoints
  addTask: async (missionId: number, task: Omit<Task, 'id'>): Promise<Task> => {
    const response = await axios.post(`${API_BASE_URL}/missions/${missionId}/tasks`, task);
    return response.data;
  },

  updateTask: async (missionId: number, taskId: string, task: Partial<Task>): Promise<Task> => {
    const response = await axios.put(
      `${API_BASE_URL}/missions/${missionId}/tasks/${taskId}`,
      task
    );
    return response.data;
  },

  deleteTask: async (missionId: number, taskId: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/missions/${missionId}/tasks/${taskId}`);
  }
}; 
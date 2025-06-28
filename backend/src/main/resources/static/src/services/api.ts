import axios from 'axios';

const API_BASE_URL = 'http://localhost:8085/api';

export interface Mission {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  rating: number;
  operation?: Operation;
}

export interface Operation {
  id: number;
  name: string;
  description: string;
  missions?: Mission[];
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mission API calls
export const getMissions = async (): Promise<Mission[]> => {
  const response = await api.get('/missions');
  return response.data;
};

export const getMissionById = async (id: number): Promise<Mission> => {
  const response = await api.get(`/missions/${id}`);
  return response.data;
};

export const createMission = async (mission: Omit<Mission, 'id'>): Promise<Mission> => {
  const response = await api.post('/missions', mission);
  return response.data;
};

export const updateMission = async (id: number, mission: Partial<Mission>): Promise<Mission> => {
  const response = await api.put(`/missions/${id}`, mission);
  return response.data;
};

export const deleteMission = async (id: number): Promise<void> => {
  await api.delete(`/missions/${id}`);
};

// Operation API calls
export const getOperations = async (): Promise<Operation[]> => {
  const response = await api.get('/operations');
  return response.data;
};

export const getOperationById = async (id: number): Promise<Operation> => {
  const response = await api.get(`/operations/${id}`);
  return response.data;
};

export const createOperation = async (operation: Omit<Operation, 'id'>): Promise<Operation> => {
  const response = await api.post('/operations', operation);
  return response.data;
};

export const updateOperation = async (id: number, operation: Partial<Operation>): Promise<Operation> => {
  const response = await api.put(`/operations/${id}`, operation);
  return response.data;
};

export const deleteOperation = async (id: number): Promise<void> => {
  await api.delete(`/operations/${id}`);
}; 
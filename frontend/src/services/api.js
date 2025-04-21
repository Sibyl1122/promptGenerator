import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

// Configure axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Prompt API methods
export const getPrompts = async () => {
  const response = await api.get('/prompts');
  return response.data;
};

export const getPrompt = async (id) => {
  const response = await api.get(`/prompts/${id}`);
  return response.data;
};

export const createPrompt = async (promptData) => {
  const response = await api.post('/prompts', promptData);
  return response.data;
};

export const updatePrompt = async (id, promptData) => {
  const response = await api.put(`/prompts/${id}`, promptData);
  return response.data;
};

export const deletePrompt = async (id) => {
  const response = await api.delete(`/prompts/${id}`);
  return response.data;
};

export const getPromptVersions = async (id) => {
  const response = await api.get(`/prompts/${id}/versions`);
  return response.data;
};

export const getPromptShots = async (id) => {
  const response = await api.get(`/prompts/${id}/shots`);
  return response.data;
};

// Template API methods
export const getTemplates = async () => {
  const response = await api.get('/templates');
  return response.data;
};

export const getTemplate = async (id) => {
  const response = await api.get(`/templates/${id}`);
  return response.data;
};

// Execution API method
export const executePrompt = async (executionData) => {
  const response = await api.post('/execute', executionData);
  return response.data;
}; 
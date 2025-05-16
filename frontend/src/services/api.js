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

// Prompt Generation API method
export const generatePrompt = async (generationData) => {
  const response = await api.post('/generate-prompt', generationData);
  return response.data;
};

// Streaming Prompt Generation API method
export const generatePromptStreaming = (generationData, onChunk, onDone, onError) => {
  let eventSource = null;
  
  try {
    // Create the URL with query parameters instead of using a POST request
    const queryParams = new URLSearchParams({
      user_description: generationData.user_description,
      language: generationData.language || 'chinese',
      temperature: generationData.temperature || 0.7
    });
    
    if (generationData.template_id) {
      queryParams.append('template_id', generationData.template_id);
    }
    
    // Direct streaming approach - no POST + EventSource
    const streamUrl = `${API_URL}/generate-prompt/stream/direct?${queryParams.toString()}`;
    eventSource = new EventSource(streamUrl);
    
    let fullPrompt = '';
    let savedPromptId = null;
    
    eventSource.onmessage = (event) => {
      const chunk = event.data;
      fullPrompt += chunk;
      
      if (onChunk) {
        onChunk(chunk, fullPrompt);
      }
    };
    
    eventSource.addEventListener('saved', (event) => {
      savedPromptId = event.data;
    });
    
    eventSource.addEventListener('done', () => {
      eventSource.close();
      
      if (onDone) {
        onDone(fullPrompt, savedPromptId);
      }
    });
    
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      eventSource.close();
      
      if (onError) {
        onError(error);
      }
    };
  } catch (error) {
    console.error('Error setting up generation:', error);
    if (onError) {
      onError(error);
    }
  }
  
  // Return a function to close the connection
  return () => {
    if (eventSource) {
      eventSource.close();
    }
  };
};

// Model API methods
export const getModels = async () => {
  const response = await api.get('/models');
  return response.data;
};

export const addModel = async (modelData) => {
  const response = await api.post('/models', modelData);
  return response.data;
};

export const updateModel = async (id, modelData) => {
  const response = await api.put(`/models/${id}`, modelData);
  return response.data;
};

export const deleteModel = async (id) => {
  const response = await api.delete(`/models/${id}`);
  return response.data;
};

export const setDefaultModel = async (id) => {
  const response = await api.post(`/models/${id}/default`);
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
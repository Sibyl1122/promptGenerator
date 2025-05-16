import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Divider,
  CircularProgress,
  Link,
  IconButton,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { executePrompt, getModels } from '../services/api';

const PromptPlayground = ({ promptContent, promptId }) => {
  const [systemPrompt, setSystemPrompt] = useState(promptContent || '');
  const [userMessage, setUserMessage] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [models, setModels] = useState([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Execution parameters
  const [modelId, setModelId] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  
  // Fetch available models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoadingModels(true);
        const fetchedModels = await getModels();
        setModels(fetchedModels);
        
        // Set a default model if available
        if (fetchedModels.length > 0) {
          // Find the default model or use the first one
          const defaultModel = fetchedModels.find(m => m.is_default) || fetchedModels[0];
          setModelId(defaultModel.id);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        // Fallback to a default model ID in case of error
        setModelId('');
      } finally {
        setIsLoadingModels(false);
      }
    };
    
    fetchModels();
  }, []);
  
  const handleExecute = async () => {
    if (!systemPrompt.trim()) {
      setError('System prompt cannot be empty');
      return;
    }
    
    if (!userMessage.trim()) {
      setError('User message cannot be empty');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      setResult('');
      
      const fullPrompt = `System: ${systemPrompt}\n\nUser: ${userMessage}`;
      
      const executionData = {
        prompt: fullPrompt,
        model_id: modelId,
        temperature,
        max_tokens: maxTokens,
        prompt_id: promptId
      };
      
      const response = await executePrompt(executionData);
      setResult(response.result);
      setIsLoading(false);
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred during execution');
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setSnackbar({
          open: true,
          message: 'Copied to clipboard!',
          severity: 'success'
        });
      },
      () => {
        setSnackbar({
          open: true,
          message: 'Failed to copy to clipboard',
          severity: 'error'
        });
      }
    );
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Prompt Playground
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          System Prompt (Instructions for AI)
        </Typography>
        <TextField
          label="System Prompt"
          fullWidth
          multiline
          rows={6}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          margin="normal"
          placeholder="Enter system instructions for the AI..."
        />
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          User Message (Your Question)
        </Typography>
        <TextField
          label="User Message"
          fullWidth
          multiline
          rows={3}
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          margin="normal"
          placeholder="Enter your question or request here..."
        />
      </Box>
      
      <Box sx={{ mt: 2, mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Model</InputLabel>
          <Select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            label="Model"
            disabled={isLoadingModels}
          >
            {isLoadingModels ? (
              <MenuItem value="">Loading models...</MenuItem>
            ) : (
              models.map((model) => (
                <MenuItem key={model.id} value={model.id}>
                  {model.name} {model.is_default ? '(Default)' : ''}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        
        <Box sx={{ width: 200 }}>
          <Typography gutterBottom>Temperature: {temperature}</Typography>
          <Slider
            value={temperature}
            onChange={(e, newValue) => setTemperature(newValue)}
            min={0}
            max={1}
            step={0.1}
            valueLabelDisplay="auto"
            aria-labelledby="temperature-slider"
          />
        </Box>
        
        <Box sx={{ width: 200 }}>
          <Typography gutterBottom>Max Tokens: {maxTokens}</Typography>
          <Slider
            value={maxTokens}
            onChange={(e, newValue) => setMaxTokens(newValue)}
            min={100}
            max={4000}
            step={100}
            valueLabelDisplay="auto"
            aria-labelledby="max-tokens-slider"
          />
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleExecute}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Execute'}
        </Button>
      </Box>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" gutterBottom>
          Result
        </Typography>
        {result && (
          <Tooltip title="Copy result">
            <IconButton onClick={() => handleCopyToClipboard(result)}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TextField
          fullWidth
          multiline
          rows={8}
          value={result}
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
          sx={{ 
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#f5f5f5"
            }
          }}
        />
      )}

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default PromptPlayground; 
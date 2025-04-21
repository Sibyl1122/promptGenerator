import React, { useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import { executePrompt } from '../services/api';

const PromptPlayground = ({ promptContent, promptId }) => {
  const [prompt, setPrompt] = useState(promptContent || '');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Execution parameters
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  
  const handleExecute = async () => {
    if (!prompt.trim()) {
      setError('Prompt cannot be empty');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      setResult('');
      
      const executionData = {
        prompt,
        model,
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
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Prompt Playground
      </Typography>
      
      <TextField
        label="Prompt"
        fullWidth
        multiline
        rows={6}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        margin="normal"
      />
      
      <Box sx={{ mt: 2, mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="model-select-label">Model</InputLabel>
          <Select
            labelId="model-select-label"
            id="model-select"
            value={model}
            label="Model"
            onChange={(e) => setModel(e.target.value)}
          >
            <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
            <MenuItem value="gpt-4">GPT-4</MenuItem>
            <MenuItem value="claude-2">Claude 2</MenuItem>
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
      
      <Typography variant="h6" gutterBottom>
        Result
      </Typography>
      
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
    </Paper>
  );
};

export default PromptPlayground; 
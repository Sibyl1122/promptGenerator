import React, { useState, useEffect, useRef } from 'react';
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Box, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  CircularProgress,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { getTemplates, generatePrompt } from '../services/api';

const PromptForm = ({ onSubmit, initialData = {} }) => {
  const [name, setName] = useState(initialData.name || '');
  const [content, setContent] = useState(initialData.content || '');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [language, setLanguage] = useState('chinese'); // Default to Chinese

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        const templatesData = await getTemplates();
        setTemplates(templatesData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching templates:', error);
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    if (initialData.name) {
      setName(initialData.name);
    }
    if (initialData.content) {
      setContent(initialData.content);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, content });
  };

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setContent(template.content);
      }
    }
  };

  const handleGeneratePrompt = async () => {
    if (!description.trim()) {
      alert('Please enter a description for the prompt generation');
      return;
    }

    try {
      setIsGenerating(true);
      // Clear the content before starting generation
      setContent('');
      
      // Create generation data
      const generationData = {
        user_description: description,
        template_id: selectedTemplate || null,
        temperature: 0.7,
        language: language
      };
      
      // Generate prompt using the regular non-streaming API
      const data = await generatePrompt(generationData);
      
      if (data.generated_prompt) {
        setContent(data.generated_prompt);
        
        // If we don't have a name yet but got a response, generate a default name
        if (!name) {
          // Create a name based on the description (truncate if too long)
          const defaultName = description.length > 30 
            ? description.substring(0, 30) + '...' 
            : description;
          setName(defaultName);
        }
      }
      
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating prompt:', error);
      setIsGenerating(false);
      alert('Failed to generate prompt. Please try again.');
    }
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        {initialData.id ? 'Edit Prompt' : 'Create New Prompt'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Prompt Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        
        <Box sx={{ my: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            AI-Assisted Prompt Generation
          </Typography>
          
          <TextField
            label="Describe what kind of prompt you want"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., A system prompt that helps write poetry in the style of ancient Chinese poets"
            multiline
            rows={2}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="template-select-label">Template (Optional)</InputLabel>
            <Select
              labelId="template-select-label"
              id="template-select"
              value={selectedTemplate}
              label="Template (Optional)"
              onChange={handleTemplateChange}
              disabled={isLoading}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {templates.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl component="fieldset" sx={{ mt: 2, mb: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Prompt Language
            </Typography>
            <RadioGroup
              row
              name="language-options"
              value={language}
              onChange={handleLanguageChange}
            >
              <FormControlLabel value="chinese" control={<Radio />} label="中文" />
              <FormControlLabel value="english" control={<Radio />} label="English" />
            </RadioGroup>
          </FormControl>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleGeneratePrompt}
              disabled={isGenerating}
              startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isGenerating ? '生成中...' : 'AI 灵感'}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />
        
        <TextField
          label="Prompt Content"
          fullWidth
          margin="normal"
          multiline
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary">
            {initialData.id ? 'Update' : 'Save'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default PromptForm; 
import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { getTemplates } from '../services/api';

const PromptForm = ({ onSubmit, initialData = {} }) => {
  const [name, setName] = useState(initialData.name || '');
  const [content, setContent] = useState(initialData.content || '');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
            {initialData.id ? 'Update Prompt' : 'Create Prompt'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default PromptForm; 
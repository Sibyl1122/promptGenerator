import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Button, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, Dialog, 
  DialogTitle, DialogContent, DialogActions, 
  TextField, FormControlLabel, Checkbox,
  CircularProgress, Snackbar, Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Star as StarIcon } from '@mui/icons-material';
import { getModels, addModel, updateModel, deleteModel, setDefaultModel } from '../services/api';

const ModelConfigPage = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentModel, setCurrentModel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    model_id: '',
    base_url: '',
    api_key: '',
    api_type: 'openai',
    api_version: '',
    is_default: false
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load models on component mount
  useEffect(() => {
    fetchModels();
  }, []);

  // Fetch models from API
  const fetchModels = async () => {
    try {
      setLoading(true);
      const data = await getModels();
      setModels(data);
    } catch (error) {
      console.error('Error fetching models:', error);
      showSnackbar('Failed to load models', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle opening the dialog for adding a new model
  const handleAddModel = () => {
    setCurrentModel(null);
    setFormData({
      name: '',
      model_id: '',
      base_url: '',
      api_key: '',
      api_type: 'openai',
      api_version: '',
      is_default: false
    });
    setOpenDialog(true);
  };

  // Handle opening the dialog for editing an existing model
  const handleEditModel = (model) => {
    setCurrentModel(model);
    setFormData({
      name: model.name,
      model_id: model.model_id,
      base_url: model.base_url,
      api_key: model.api_key || '',
      api_type: model.api_type || 'openai',
      api_version: model.api_version || '',
      is_default: model.is_default
    });
    setOpenDialog(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'is_default' ? checked : value
    });
  };

  // Handle form submission (create or update)
  const handleSubmit = async () => {
    try {
      if (currentModel) {
        // Update existing model
        await updateModel(currentModel.id, formData);
        showSnackbar('Model updated successfully');
      } else {
        // Create new model
        await addModel(formData);
        showSnackbar('Model added successfully');
      }
      setOpenDialog(false);
      fetchModels();
    } catch (error) {
      console.error('Error saving model:', error);
      showSnackbar('Failed to save model', 'error');
    }
  };

  // Handle model deletion
  const handleDeleteModel = async (id) => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      try {
        await deleteModel(id);
        showSnackbar('Model deleted successfully');
        fetchModels();
      } catch (error) {
        console.error('Error deleting model:', error);
        showSnackbar('Failed to delete model. It may be the default model.', 'error');
      }
    }
  };

  // Handle setting a model as default
  const handleSetDefault = async (id) => {
    try {
      await setDefaultModel(id);
      showSnackbar('Default model updated successfully');
      fetchModels();
    } catch (error) {
      console.error('Error setting default model:', error);
      showSnackbar('Failed to set default model', 'error');
    }
  };

  // Show snackbar message
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Model Configuration
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />} 
          onClick={handleAddModel}
          sx={{ mb: 2 }}
        >
          Add Model
        </Button>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <CircularProgress />
          </div>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Model ID</TableCell>
                  <TableCell>Base URL</TableCell>
                  <TableCell>API Type</TableCell>
                  <TableCell>Default</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {models.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No models configured. Add your first model.</TableCell>
                  </TableRow>
                ) : (
                  models.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell>{model.name}</TableCell>
                      <TableCell>{model.model_id}</TableCell>
                      <TableCell>{model.base_url}</TableCell>
                      <TableCell>{model.api_type}</TableCell>
                      <TableCell>
                        {model.is_default ? (
                          <StarIcon color="primary" />
                        ) : (
                          <IconButton 
                            size="small" 
                            onClick={() => handleSetDefault(model.id)}
                            title="Set as default"
                          >
                            <StarIcon color="disabled" />
                          </IconButton>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditModel(model)}
                          title="Edit model"
                        >
                          <EditIcon />
                        </IconButton>
                        {!model.is_default && (
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteModel(model.id)}
                            title="Delete model"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add/Edit Model Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentModel ? 'Edit Model' : 'Add New Model'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Model Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            required
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            name="model_id"
            label="Model ID (e.g., gpt-4, claude-3-opus-20240229)"
            fullWidth
            variant="outlined"
            value={formData.model_id}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="base_url"
            label="Base URL"
            fullWidth
            variant="outlined"
            value={formData.base_url}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
            placeholder="https://api.openai.com/v1"
          />
          <TextField
            margin="dense"
            name="api_key"
            label="API Key"
            fullWidth
            variant="outlined"
            value={formData.api_key}
            onChange={handleInputChange}
            type="password"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="api_type"
            label="API Type (openai, azure, etc.)"
            fullWidth
            variant="outlined"
            value={formData.api_type}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="api_version"
            label="API Version"
            fullWidth
            variant="outlined"
            value={formData.api_version}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_default}
                onChange={handleInputChange}
                name="is_default"
              />
            }
            label="Set as default model"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.name || !formData.model_id || !formData.base_url}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

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
    </Container>
  );
};

export default ModelConfigPage; 
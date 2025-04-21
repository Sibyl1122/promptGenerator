import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Divider, 
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { getPrompts, deletePrompt } from '../services/api';
import PromptForm from '../components/PromptForm';
import { createPrompt } from '../services/api';

const PromptListPage = () => {
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchPrompts = async () => {
    try {
      setIsLoading(true);
      const data = await getPrompts();
      setPrompts(data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load prompts');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleCreatePrompt = async (promptData) => {
    try {
      await createPrompt(promptData);
      setShowForm(false);
      setSnackbar({
        open: true,
        message: 'Prompt created successfully',
        severity: 'success'
      });
      fetchPrompts();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to create prompt',
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = (prompt) => {
    setPromptToDelete(prompt);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!promptToDelete) return;
    
    try {
      await deletePrompt(promptToDelete.id);
      setDeleteDialogOpen(false);
      setPromptToDelete(null);
      setSnackbar({
        open: true,
        message: 'Prompt deleted successfully',
        severity: 'success'
      });
      fetchPrompts();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete prompt',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Prompts
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'New Prompt'}
        </Button>
      </Box>

      {showForm && (
        <PromptForm onSubmit={handleCreatePrompt} />
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      ) : prompts.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No prompts found. Create your first prompt!</Typography>
        </Paper>
      ) : (
        <Paper elevation={2}>
          <List>
            {prompts.map((prompt, index) => (
              <React.Fragment key={prompt.id}>
                {index > 0 && <Divider />}
                <ListItem 
                  secondaryAction={
                    <Box>
                      <IconButton 
                        component={Link} 
                        to={`/prompts/${prompt.id}`} 
                        edge="end" 
                        aria-label="edit"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        component={Link} 
                        to={`/prompts/${prompt.id}`} 
                        edge="end" 
                        aria-label="play"
                        sx={{ mr: 1 }}
                      >
                        <PlayArrowIcon />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleDeleteClick(prompt)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={prompt.name}
                    secondary={
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '80%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        Created: {new Date(prompt.created_time).toLocaleDateString()}
                      </Typography>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Prompt</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the prompt "{promptToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
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
    </Box>
  );
};

export default PromptListPage; 
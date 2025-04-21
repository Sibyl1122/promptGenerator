import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { getTemplates } from '../services/api';

const TemplateListPage = () => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        const data = await getTemplates();
        setTemplates(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load templates');
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleOpenDialog = (template) => {
    setSelectedTemplate(template);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCopyToClipboard = (content) => {
    navigator.clipboard.writeText(content).then(
      () => {
        setSnackbar({
          open: true,
          message: 'Template copied to clipboard',
          severity: 'success'
        });
      },
      (err) => {
        setSnackbar({
          open: true,
          message: 'Failed to copy template',
          severity: 'error'
        });
      }
    );
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Template Library
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4 }}>
        Use these templates as a starting point for your prompts. They provide structure and best practices for different types of prompts.
      </Typography>
      
      {templates.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No templates available</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid item xs={12} md={6} lg={4} key={template.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {template.name}
                  </Typography>
                  <Box 
                    sx={{ 
                      p: 2, 
                      backgroundColor: '#f5f5f5', 
                      borderRadius: 1,
                      maxHeight: '150px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                      {template.content.length > 200 
                        ? `${template.content.substring(0, 200)}...` 
                        : template.content}
                    </pre>
                    {template.content.length > 200 && (
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          bottom: 0, 
                          left: 0, 
                          right: 0, 
                          height: '50px',
                          background: 'linear-gradient(transparent, #f5f5f5)'
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => handleOpenDialog(template)}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<ContentCopyIcon />}
                    onClick={() => handleCopyToClipboard(template.content)}
                  >
                    Copy
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Template Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedTemplate && (
          <>
            <DialogTitle>{selectedTemplate.name}</DialogTitle>
            <DialogContent>
              <DialogContentText component="div">
                <Box 
                  sx={{ 
                    p: 2, 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: 1,
                    mt: 2
                  }}
                >
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {selectedTemplate.content}
                  </pre>
                </Box>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button 
                onClick={() => handleCopyToClipboard(selectedTemplate.content)}
                startIcon={<ContentCopyIcon />}
              >
                Copy to Clipboard
              </Button>
            </DialogActions>
          </>
        )}
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

export default TemplateListPage; 
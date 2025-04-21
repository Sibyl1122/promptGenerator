import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Paper, 
  Button, 
  CircularProgress, 
  Tabs,
  Tab,
  Snackbar,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getPrompt, updatePrompt, getPromptVersions, getPromptShots } from '../services/api';
import PromptForm from '../components/PromptForm';
import PromptPlayground from '../components/PromptPlayground';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`prompt-tabpanel-${index}`}
      aria-labelledby={`prompt-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PromptDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [versions, setVersions] = useState([]);
  const [shots, setShots] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchPromptData = async () => {
    try {
      setIsLoading(true);
      const promptData = await getPrompt(id);
      setPrompt(promptData);
      
      // Fetch versions and shots
      const versionsData = await getPromptVersions(id);
      setVersions(versionsData);
      
      const shotsData = await getPromptShots(id);
      setShots(shotsData);
      
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load prompt data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromptData();
  }, [id]);

  const handleUpdatePrompt = async (promptData) => {
    try {
      await updatePrompt(id, promptData);
      setSnackbar({
        open: true,
        message: 'Prompt updated successfully',
        severity: 'success'
      });
      fetchPromptData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to update prompt',
        severity: 'error'
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/prompts')}
          sx={{ mr: 2 }}
        >
          Back to Prompts
        </Button>
        <Typography variant="h4" component="h1">
          {prompt?.name}
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="prompt tabs"
          variant="fullWidth"
        >
          <Tab label="Playground" />
          <Tab label="Edit" />
          <Tab label="Versions" />
          <Tab label="Execution History" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <PromptPlayground 
            promptContent={prompt?.content} 
            promptId={parseInt(id)} 
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <PromptForm 
            initialData={{
              id: prompt?.id,
              name: prompt?.name,
              content: prompt?.content
            }}
            onSubmit={handleUpdatePrompt}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {versions.length === 0 ? (
            <Typography>No versions available</Typography>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                Version History
              </Typography>
              {versions.map((version) => (
                <Paper key={version.id} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1">
                    Version {version.version} - {new Date(version.created_time).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created by: {version.creator}
                  </Typography>
                  <Box sx={{ mt: 1, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                      {version.content}
                    </pre>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {shots.length === 0 ? (
            <Typography>No execution history available</Typography>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                Execution History
              </Typography>
              {shots.map((shot) => (
                <Paper key={shot.id} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1">
                    {new Date(shot.created_time).toLocaleString()}
                  </Typography>
                  <Box sx={{ mt: 1, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                      {shot.content}
                    </pre>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </TabPanel>
      </Paper>

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

export default PromptDetailPage; 
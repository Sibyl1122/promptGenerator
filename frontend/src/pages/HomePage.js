import React from 'react';
import { Typography, Paper, Button, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import TemplateIcon from '@mui/icons-material/Description';

const HomePage = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Prompt Generator
        </Typography>
        <Typography variant="body1" paragraph>
          Create, test, and optimize your prompts for large language models. 
          Our tool helps you build effective prompts and test them in real-time.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            component={Link}
            to="/prompts"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ChatIcon />}
            sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
          >
            Browse Prompts
          </Button>
          <Button
            component={Link}
            to="/templates"
            variant="outlined"
            color="primary"
            size="large"
            startIcon={<TemplateIcon />}
          >
            View Templates
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Create
            </Typography>
            <Typography variant="body2">
              Build prompts from scratch or use our templates. Our tool helps you 
              structure your prompts for maximum effectiveness.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Test
            </Typography>
            <Typography variant="body2">
              Try your prompts with different models and parameters. Test variations 
              to see what works best for your use case.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Iterate
            </Typography>
            <Typography variant="body2">
              Save your history, revise your prompts, and track improvements. 
              Build a library of effective prompts for your projects.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage; 
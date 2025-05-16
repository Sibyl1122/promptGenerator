import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layout components
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import PromptListPage from './pages/PromptListPage';
import PromptDetailPage from './pages/PromptDetailPage';
import TemplateListPage from './pages/TemplateListPage';
import ModelConfigPage from './pages/ModelConfigPage';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#673ab7',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/prompts" element={<PromptListPage />} />
          <Route path="/prompts/:id" element={<PromptDetailPage />} />
          <Route path="/templates" element={<TemplateListPage />} />
          <Route path="/models" element={<ModelConfigPage />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
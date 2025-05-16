# Prompt Generator

A complete application for creating, testing, and optimizing prompts for large language models like OpenAI GPT and Anthropic Claude.

## Features

- Create prompts from scratch or use built-in templates
- Test your prompts with different LLM providers
- Save prompt history and execution results
- Configure model parameters (temperature, max tokens)
- Version control for your prompts

## Architecture

- **Backend**: Python + Flask
- **Frontend**: React + Material UI
- **Database**: MySQL
- **LLM Integration**: OpenAI API, Anthropic API

## Getting Started

### Prerequisites

- Docker and Docker Compose
- API keys for OpenAI and/or Anthropic

### Running with Docker

1. Clone the repository
```
git clone https://github.com/yourusername/promptGenerator.git
cd promptGenerator
```

2. Create a `.env` file in the root directory with your API keys:
```
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

3. Start the application:
```
docker-compose up -d
```

4. Access the application at http://localhost

### Development Setup

#### Backend

1. Navigate to the backend directory:
```
cd backend
```

2. Create a virtual environment and install dependencies:
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Create a `.env` file based on `.env.example`

4. Run the development server:
```
python run.py
```

#### Frontend

1. Navigate to the frontend directory:
```
cd frontend
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

## Project Structure

- `/backend` - Flask backend API
  - `/app` - Application code
    - `/models` - Database models
    - `/routes` - API routes
    - `/services` - Business logic
    - `/templates` - Jinja2 templates
    - `/config` - Configuration
    - `/utils` - Utility functions
- `/frontend` - React frontend
  - `/src` - Source code
    - `/components` - Reusable components
    - `/pages` - Page components
    - `/services` - API communication
    - `/utils` - Utility functions
    - `/store` - State management
- `/config` - Global configuration
- `/scripts` - Utility scripts

## License

MIT

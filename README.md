# AI Applied Demo

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [Usage](#usage)
6. [File Structure](#file-structure)
7. [API Overview](#api-overview)

## Introduction

This application demonstrates how to build a Full-Stack Generative AI system using modern web technologies. It features a React TypeScript frontend built with Carbon Design Systems, a TypeScript Express server for handling UI logic, and a FastAPI Python backend that leverages IBM's watsonx.ai platform for generative AI capabilities. The demo includes a **Pet Naming Suggestion** app, showcasing how you can generate creative names for pets using AI models.

## Features

- **Generative AI Integration**: Leverages watsonx.ai foundation models to generate suggestions based on user inputs.
- **Modular Design**: A React TypeScript UI with a clean, maintainable code structure.
- **Real-time Interactions**: A full-stack application with a FastAPI backend communicating with an Express server, all running seamlessly together.
- **Carbon Design System**: Implements Carbon components for a professional, sleek UI.
- **Prompt Engineering**: Demonstrates how different prompting techniques (zero-shot, few-shot) can enhance AI model performance.
  
## Technologies Used

- **Frontend**:
  - React (TypeScript)
  - Carbon Design System (for UI components)
  - Axios (for HTTP requests)
  
- **Backend**:
  - Express.js (TypeScript) for the UI server
  - FastAPI (Python) for handling AI API calls
  - watsonx.ai (for generative AI capabilities)
     - [watsonx.ai trial accout](https://dataplatform.cloud.ibm.com/registration/stepone?context=wx) 
  
- **Development Tools**:
  - Node.js (v18 or higher)
  - Python 3.11 or higher
  - pyenv (for Python environment management)

## Installation

To get the project running locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/lennox-davidlevy/ai-applied-code-gen-repeat.git
   ```

2. Install the root dependencies:

   ```bash
   npm install
   ```

3. Run the setup script to install application dependencies and create necessary \`.env\` files:

   ```bash
   npm run setup
   ```

4. Ensure that Python dependencies are managed using \`pyenv\`:

   ```bash
   pyenv virtualenv fs_genai_demo
   pyenv activate fs_genai_demo
   ```

5. Copy the `.env.example` file to `.env` in the `api/` directory and there fill in your `project_id` and `iam` credentials for watsonx.ai integration.

   ```bash
   cp .env.example .env
   ```

## Usage

1. **Starting the FastAPI Backend**:
   - Navigate to the `api` folder and run:

     ```bash
     uvicorn api.server:app --reload
     ```

   - The API will be available at `http://localhost:8000/docs` for you to test the routes.

2. **Running the Express Server**:
   - Start the TypeScript Express server by running:

     ```bash
     npm run dev
     ```

   - This handles the UI interactions and communicates with the backend.

3. **Starting the React UI**:
   - To run the React client, navigate to the `client` directory and start the app:

     ```bash
     npm start
     ```

4. **Testing the Pet Naming App**:
   - Open your browser and navigate to the React app. Use the pet naming form to interact with the generative AI backend.

## Project File Structure

This is the overall structure of the AI Applied Demo project, with each directory and file briefly described.

### Top-Level Structure

```bash
├── README.md                 
├── api                       # Backend FastAPI implementation
├── package-lock.json         
├── package.json             
└── ui                        # Frontend codebase (React UI and Express server)
    ├── client                # React frontend code
    ├── db                    # SQL scripts for managing local databases
    ├── ocp                   # OpenShift deployment configuration
    ├── server                # Express server for handling UI logic
```

### FastAPI Structure

```sh
├── Dockerfile                
├── README.md                 
├── data                      
│   ├── examples              # Example data for model training
│   │   ├── generate_summary.txt
│   │   └── pet_namer.txt
│   ├── models                # JSON files defining model behavior
│   │   ├── generate_summary.json
│   │   └── pet_namer.json
│   └── prompt_templates      # Prompt templates for LLM interaction
│       ├── generate_summary.txt
│       └── pet_namer.txt
├── requirements.txt          # Python dependencies for the API
├── routes                    # FastAPI route definitions
│   └── models.py             # Handles API routes
├── schemas                   # Pydantic models for request/response validation
│   ├── __init__.py
│   ├── examples_template.py
│   ├── generate_summary_response.py
│   ├── json_response_template.py
│   ├── pet_namer_response.py
│   ├── prompt_template.py
│   └── test_request.py
├── server.py                 # Main FastAPI server logic
└── tests                     # Test files for API functionality
    ├── conftest.py           # Pytest fixtures and setup
    ├── test_generate_text.py # Unit test for text generation functionality
    └── test_startup.py       # Unit test for server startup
```


### Top-Level UI Structure 
```sh
├── client                    # React code for the frontend
│   ├── public                # Public assets for React app
│   ├── src                   # Source code for the React app
│   ├── tsconfig.json         # TypeScript configuration
│   └── webpack.config.js     # Webpack configuration for bundling the React app
├── db                        # SQL files for local database
├── ocp                       # OpenShift deployment configuration files
├── server                    # Express server handling UI logic
```

### React UI File Structure
```sh
├── package.json              # React frontend dependencies
├── public                    # Public directory for React
│   ├── favicon.ico
│   └── index.html
├── src                       # Source code for the React application
│   ├── App.scss              # Styles for the app
│   ├── App.tsx               # Main app component
│   ├── components            # Reusable React components
│   │   ├── Header            # Header component
│   │   ├── Landing           # Landing page component
│   │   └── PetForm           # Pet form component for user input
│   ├── context               # Global context for the app
│   │   └── AppContext.tsx    # Context file for managing global state
│   ├── index.scss            # Global styles
│   └── index.tsx             # Main entry point for the React app
├── tsconfig.json             # TypeScript configuration
└── webpack.config.js         # Webpack configuration
```

### Express Server File Structure
```sh
├── package.json              # Express server dependencies
├── src                       # Source code for the Express server
│   ├── db                    # Database configuration
│   │   └── dbConfig.ts       # Configuration for database connections
│   ├── index.ts              # Entry point for the Express server
│   └── routes                # API routes for Express server
│       ├── configRoutes.ts   # Config routes for Express server
│       ├── dbRoutes.ts       # Database routes for managing data
│       ├── index.ts          # Route index
│       └── petNamerRoutes.ts # Route for handling pet namer API
└── tsconfig.json             # TypeScript configuration for the Express server
```

## API Overview

### Routes

- **`/generate_summary`**: Generates a summary based on AI models and provided examples. Uses `api/data/models/generate_summary.json` and `api/data/prompt_templates/generate_summary.txt`.

- **`/pet_namer`**: Generates creative pet names using examples from `api/data/examples/generate_summary.txt` and a prompt template.

### Frontend to Backend Workflow

1. **React UI**: User selects a pet type and submits a form.
2. **Express Server**: The Express server processes the request and forwards it to the FastAPI backend.
3. **FastAPI Backend**: FastAPI calls the watsonx.ai API and returns a generated name.
4. **React UI**: The name is displayed to the user.

---


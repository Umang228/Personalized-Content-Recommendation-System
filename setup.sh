#!/bin/bash

  # Create virtual environment and install backend dependencies
  cd backend
  python -m venv venv
  ./venv/Scripts/activate
  pip install -r requirements.txt
  deactivate
  cd ..

  # Install frontend dependencies
  cd frontend
  npm install
  cd ..

  echo "Setup complete! Run the backend and frontend separately."
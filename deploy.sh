#!/bin/bash

set -e

PROJECT_DIR="/home/user/Hovedforl-b1-velser"

cd $PROJECT_DIR

git pull origin main

# Start React frontend
cd $PROJECT_DIR/reactapp
npm install
npm run start:prod &

# Deploy Umbraco CMS
cd $PROJECT_DIR/UmbracoCMS2
dotnet restore
dotnet build --configuration Release
dotnet run --configuration Release &

echo "Deployment completed successfully"

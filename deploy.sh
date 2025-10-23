#!/bin/bash

set -e

PROJECT_DIR="/home/user/Hovedforl-b1-velser"

cd $PROJECT_DIR

git fetch origin
git checkout main
git reset --hard origin/main
git clean -fd

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

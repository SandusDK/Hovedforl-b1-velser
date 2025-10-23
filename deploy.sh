#!/bin/bash

set -e

PROJECT_DIR="/home/user/Hovedforl-b1-velser"

cd $PROJECT_DIR

git pull origin main

# Deploy React frontend
cd $PROJECT_DIR/reactapp
npm install
npm run build
pm2 restart hovedforløb-frontend || pm2 start npm --name "hovedforløb-frontend" -- run start:prod

# Deploy Umbraco CMS
cd $PROJECT_DIR/UmbracoCMS2
dotnet restore
dotnet build --configuration Release
pm2 restart umbraco-cms || pm2 start --name "umbraco-cms" -- dotnet run --configuration Release

pm2 save

echo "Deployment completed successfully"

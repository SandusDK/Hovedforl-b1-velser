#!/bin/bash

set -e

PROJECT_DIR="/home/blazing/Documents/Hovedforl-b1-velser"

cd $PROJECT_DIR

git pull origin main

cd reactapp
npm install
pm2 restart hovedforløb-frontend || pm2 start npm --name "hovedforløb-frontend" -- run start:prod

cd ../UmbracoCMS2
dotnet restore
dotnet build --configuration Release
pm2 restart umbraco-cms || pm2 start "dotnet run --configuration Release" --name "umbraco-cms"

pm2 save

echo "Deployment completed successfully"

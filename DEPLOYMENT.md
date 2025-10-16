# Deployment Guide

## Quick Start

### Development Mode
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd reactapp
npm start
```

Access at:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api

### Production Mode on Server (83.151.132.141)
```bash
# Terminal 1 - Backend
cd backend
npm run prod

# Terminal 2 - Frontend
cd reactapp
npm run start:prod
```

Access at:
- Frontend: http://83.151.132.141:3001 (or http://83.151.132.141/ via proxy)
- Backend API: http://83.151.132.141:3000/api (or http://83.151.132.141/api/ via proxy)

**Note:** With your proxy server, users access:
- http://83.151.132.141/ (routes to React)
- http://83.151.132.141/api/ (routes to Express)

## Configuration Details

### Backend (Express)
- **Host:** 0.0.0.0 (allows external connections)
- **Port:** 3000
- **CORS:** Configured for both dev and production origins

### Frontend (React)
- **Port:** 3001
- **API Proxy:** Configured to communicate with backend
- **Environment-based API URL:** Automatically switches between localhost and production IP

## Environment Files

The project includes `.env` files for both environments:

**Backend:**
- `.env.development` - For local development
- `.env.production` - For production server

**Frontend:**
- `.env.development` - Points to localhost:3000/api
- `.env.production` - Points to 83.151.132.141/api (via proxy)

## Production Deployment with PM2 (Recommended)

For keeping the services running permanently:

```bash
# Install PM2 globally
npm install -g pm2

# Start backend
cd backend
pm2 start npm --name "hovedforløb-backend" -- run prod

# Start frontend
cd ../reactapp
pm2 start npm --name "hovedforløb-frontend" -- run start:prod

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the instructions that PM2 outputs

# View logs
pm2 logs

# Monitor processes
pm2 monit

# Restart services
pm2 restart all

# Stop services
pm2 stop all
```

## Firewall Configuration

Make sure ports 3000 and 3001 are open on your server:

```bash
# For UFW (Ubuntu/Debian)
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp
sudo ufw reload

# For firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload
```

## Building for Production (Static Files)

If you want to serve React as static files with a production web server:

```bash
cd reactapp
npm run build
```

This creates a `build/` directory with optimized static files. You can then:

1. **Serve with Express:**
   Update `backend/server.js` to serve static files:
   ```javascript
   import path from 'path';
   import { fileURLToPath } from 'url';

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);

   // Serve static files from React build
   app.use(express.static(path.join(__dirname, '../reactapp/build')));

   // Handle React routing, return all requests to React app
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../reactapp/build', 'index.html'));
   });
   ```

2. **Serve with Nginx:**
   Configure Nginx to serve the static files and proxy API requests to backend.

## Troubleshooting

### Backend can't be reached from external IP
- Ensure HOST is set to 0.0.0.0
- Check firewall rules
- Verify the service is running: `netstat -tulpn | grep 3000`

### CORS errors
- Verify the frontend URL is correctly configured in backend CORS settings
- Check that NODE_ENV is set correctly

### React can't connect to backend
- Verify REACT_APP_API_URL is set correctly
- Check backend is running and accessible
- Look for CORS errors in browser console

## Monitoring

Check if services are running:
```bash
# Check processes
ps aux | grep node

# Check ports
netstat -tulpn | grep -E '3000|3001'

# Check logs with PM2
pm2 logs
```

# Hovedforløb Web Project

Dette projekt indeholder en React frontend og Express backend til deployment på server.

## Server Information
- **Public IP:** 83.151.132.141
- **Backend Port:** 3000 (Express API)
- **Frontend Port:** 3001 (React App)
- **Proxy Setup:** Nginx/Apache routes `/` to React and `/api/` to Express

## Setup

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd reactapp
npm install
```

## Development Mode

### Start Backend (Development)
```bash
cd backend
npm run dev
```
Backend kører på: http://localhost:3000

### Start Frontend (Development)
```bash
cd reactapp
npm start
```
Frontend kører på: http://localhost:3001

## Production Mode

### Start Backend (Production)
```bash
cd backend
npm run prod
```
Backend kører på: http://0.0.0.0:3000 (tilgængelig på http://83.151.132.141:3000)

### Start Frontend (Production)
For produktion skal du bygge React appen:
```bash
cd reactapp
npm run build
```

Eller kør development server i production mode:
```bash
cd reactapp
npm run start:prod
```

## Environment Variables

### Backend
- `NODE_ENV`: development eller production
- `HOST`: 0.0.0.0 (for at tillade eksterne forbindelser)
- `PORT`: 3000

### Frontend
- `PORT`: 3001
- `REACT_APP_API_URL`: Backend API URL

## CORS Configuration
Backend er konfigureret til at acceptere requests fra:
- **Development:** http://localhost:3001, http://127.0.0.1:3001
- **Production:** http://83.151.132.141:3001, http://83.151.132.141

## Deployment på Server

1. **Install dependencies:**
```bash
cd backend && npm install
cd ../reactapp && npm install
```

2. **Start backend i production mode:**
```bash
cd backend
npm run prod
```

3. **I en anden terminal, start frontend:**
```bash
cd reactapp
npm run start:prod
```

For permanent drift, overvej at bruge PM2:
```bash
npm install -g pm2
cd backend
pm2 start npm --name "backend" -- run prod
cd ../reactapp
pm2 start npm --name "frontend" -- run start:prod
pm2 save
pm2 startup
```

## API Endpoints
- `GET /api/` - API health check
- `GET /api/users` - Get users
- `GET /api/search?image=query` - Search for images

## Proxy Configuration
See [PROXY_SETUP.md](PROXY_SETUP.md) for detailed Nginx/Apache configuration to route:
- `/` → React (port 3001)
- `/api/` → Express (port 3000)

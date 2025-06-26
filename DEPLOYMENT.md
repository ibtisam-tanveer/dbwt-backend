# Deployment Guide for Maps Backend

## Render Deployment

### Required Environment Variables

Set these environment variables in your Render dashboard:

1. **MONGO_URI** - Your MongoDB connection string
   - For local development: `mongodb://localhost:27017/maps-app`
   - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/maps-app?retryWrites=true&w=majority`

2. **JWT_SECRET** - A secure random string for JWT token signing
   - Example: `your-super-secret-jwt-key-here`

3. **JWT_EXPIRES_IN** - JWT token expiration time
   - Example: `24h`

4. **FRONTEND_URL** - Your frontend application URL
   - Example: `https://your-frontend-app.onrender.com`

5. **NODE_ENV** - Environment (Render will set this automatically)
   - Value: `production`

### Build Configuration

The application is configured to:
- Build with: `npm install && npm run build`
- Start with: `npm start`
- Output compiled files to: `dist/` directory

### Troubleshooting

If you encounter the "Cannot find module '/opt/render/project/src/dist/main'" error:

1. Check that all dependencies are properly installed
2. Verify the build process completes successfully
3. Ensure the `dist/` directory contains the compiled files
4. Check that the start script points to the correct file (`dist/main.js`)

### Local Testing

To test the build locally:

```bash
npm install
npm run build
npm start
```

The application should start on `http://localhost:3000` (or the PORT environment variable). 
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
- Build with: `npm install && npm run prebuild && npm run build`
- Start with: `npm start`
- Output compiled files to: `dist/` directory
- Verify build output before starting

### Build Process

The build process includes:
1. **prebuild**: Cleans the dist directory
2. **build**: Runs NestJS build
3. **postbuild**: Verifies that `dist/main.js` exists

### Troubleshooting

If you encounter the "Cannot find module '/opt/render/project/src/dist/main.js'" error:

1. **Check Build Logs**: Look for the postbuild output showing the contents of the dist directory
2. **Verify Dependencies**: Ensure all runtime dependencies are in the `dependencies` section (not `devDependencies`)
3. **Check TypeScript Configuration**: Ensure `tsconfig.json` has proper `outDir` and `include` settings
4. **Verify NestJS Configuration**: Check that `nest-cli.json` is properly configured

### Build Verification

The build process now includes verification steps:
- `postbuild` script checks if `dist/main.js` exists
- `start` script verifies the file exists before attempting to run
- Build will fail if the main.js file is not generated

### Local Testing

To test the build locally:

```bash
npm install
npm run build
npm start
```

The application should start on `http://localhost:3000` (or the PORT environment variable).

### Common Issues

1. **Missing Runtime Dependencies**: Ensure `@nestjs/jwt`, `@nestjs/mongoose`, `@nestjs/passport`, `bcryptjs`, `mongoose`, `passport`, `passport-jwt`, `passport-local` are in `dependencies`
2. **TypeScript Compilation Errors**: Check for syntax errors in TypeScript files
3. **Build Directory Issues**: Ensure the `dist/` directory is properly cleaned and recreated 
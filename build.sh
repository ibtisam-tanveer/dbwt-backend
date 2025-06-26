#!/bin/bash

# Build script for NestJS application
echo "Starting build process..."

# Clean previous build
rm -rf dist/

# Install dependencies if needed
npm install

# Build the application
echo "Running nest build..."
npm run build

# Check if build was successful
if [ ! -f "dist/main.js" ]; then
    echo "ERROR: dist/main.js not found after build!"
    echo "Contents of dist directory:"
    ls -la dist/ || echo "dist directory does not exist"
    exit 1
fi

echo "Build completed successfully!"
echo "Build output:"
ls -la dist/ 
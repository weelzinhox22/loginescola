#!/bin/bash
set -e

echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la

echo "Changing to client directory..."
cd client

echo "Installing dependencies..."
npm install

echo "Building the app..."
npm run build --outDir=../dist || npx vite build --outDir=../dist

echo "Returning to root directory..."
cd ..

echo "Creating _redirects file..."
echo "/* /index.html 200" > dist/_redirects

echo "Build completed successfully!" 
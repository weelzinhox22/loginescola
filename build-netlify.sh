#!/bin/bash
# Simple build script for Netlify

# Exit immediately if a command exits with a non-zero status
set -e

# Echo commands as they execute
set -x

# Display current directory for debugging
pwd
ls -la
echo "Node version:"
node --version
echo "NPM version:"
npm --version

# CRITICAL: Disable Rollup native modules which cause errors on Netlify
export ROLLUP_NATIVE=false

# Move to client directory
echo "Changing to client directory"
cd client
ls -la

# Build the client application using NPX directly with env vars
echo "Building client application with Vite..."
ROLLUP_NATIVE=false npx vite build --outDir ../dist

# Return to the root directory
cd ..

# Check if dist directory was created
if [ ! -d "dist" ]; then
  echo "ERROR: dist directory was not created. Build failed."
  exit 1
fi

# Show contents of dist directory
echo "Contents of dist directory:"
ls -la dist

# Create _redirects file for SPA routing
echo "/* /index.html 200" > dist/_redirects

# Success message
echo "Build completed successfully" 
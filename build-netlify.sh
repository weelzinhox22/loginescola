#!/bin/bash
# Simple build script for Netlify

# Echo commands as they execute
set -x

# Ensure dependencies are installed (this should already be done by Netlify)
echo "Building client application..."

# Run Vite build with explicit parameters
cd client
../node_modules/.bin/vite build --outDir ../dist

# Back to root directory
cd ..

# Create _redirects file for SPA routing
echo "/* /index.html 200" > dist/_redirects

# Success message
echo "Build completed successfully" 
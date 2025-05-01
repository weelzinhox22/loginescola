#!/bin/bash

# This is a fix for Netlify deployment
echo "Starting Netlify fix script..."

# Set environment variable to skip native Rollup dependencies
export ROLLUP_SKIP_NATIVE=true
echo "Set ROLLUP_SKIP_NATIVE=true"

# Check if the simple package.json exists
if [ -f simple-package.json ]; then
  echo "Found simple-package.json, using it instead of regular package.json"
  cp simple-package.json package.json
  
  # Clean node_modules and reinstall with the simple package.json
  rm -rf node_modules
  rm -f package-lock.json
  npm install
fi

# Check if the simple vite config exists
if [ -f simple-vite.config.js ]; then
  echo "Found simple-vite.config.js, using it instead of regular vite.config.ts"
  cp simple-vite.config.js vite.config.js
fi

# Make sure the schema.ts file doesn't use Drizzle
if [ -f netlify-schema.ts ]; then
  echo "Using Netlify-specific schema.ts..."
  mkdir -p shared
  cp netlify-schema.ts shared/schema.ts
fi

# Run the build command
echo "Building client-side app..."
npm run build

echo "Netlify fix script completed." 
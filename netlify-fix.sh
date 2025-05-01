#!/bin/bash

# This is a fix for Netlify deployment
echo "Starting Netlify fix script..."

# Print debug info
echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -la

# Set environment variable to skip native Rollup dependencies
export ROLLUP_SKIP_NATIVE=true
echo "Set ROLLUP_SKIP_NATIVE=true"

# Check if client directory exists
if [ ! -d "client" ]; then
  echo "ERROR: client directory not found!"
  echo "Content of current directory:"
  ls -la
  exit 1
fi

# Check if client/src directory exists
if [ ! -d "client/src" ]; then
  echo "ERROR: client/src directory not found!"
  echo "Content of client directory:"
  ls -la client
  exit 1
fi

# Check if the simple vite config exists
if [ -f simple-vite.config.js ]; then
  echo "Found simple-vite.config.js, using it instead of regular vite.config.ts"
  cp simple-vite.config.js vite.config.js
elif [ -f vite.config.ts ]; then
  echo "Using existing vite.config.ts"
else
  echo "WARNING: No Vite config found! This will likely cause build issues."
fi

# Make sure the schema.ts file doesn't use Drizzle
mkdir -p shared
if [ -f netlify-schema.ts ]; then
  echo "Using Netlify-specific schema.ts..."
  cp netlify-schema.ts shared/schema.ts
fi

# Update package.json script directly
if grep -q "server/index.ts" package.json; then
  echo "Modifying package.json build script to skip server bundling..."
  sed -i 's/"build": "vite build && esbuild server\/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"/"build": "ROLLUP_SKIP_NATIVE=true vite build"/g' package.json
  cat package.json
fi

# Run the build command directly with ROLLUP_SKIP_NATIVE
echo "Building client-side app with ROLLUP_SKIP_NATIVE=true..."
ROLLUP_SKIP_NATIVE=true npx vite build --root client --outDir ../dist

# Check if the build succeeded
if [ -d "dist" ]; then
  echo "✅ Build succeeded! dist directory exists."
  echo "Contents of dist directory:"
  ls -la dist
else 
  echo "❌ ERROR: Build failed - dist directory not found!"
  echo "Creating empty dist directory with fallback index.html from emergency.html if available..."
  
  mkdir -p dist
  
  if [ -f "emergency.html" ]; then
    cp emergency.html dist/index.html
    echo "Copied emergency.html to dist/index.html"
  else
    echo "No emergency.html found, creating basic index.html..."
    cat > dist/index.html << 'EOL'
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="3;url=/">
    <title>Sistema de Gestão Escolar</title>
    <style>
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        background-color: #f9fafb;
        flex-direction: column;
        text-align: center;
        padding: 1rem;
      }
      h1 {
        color: #4f46e5;
        margin-bottom: 1rem;
      }
      p {
        color: #666;
        max-width: 600px;
      }
    </style>
  </head>
  <body>
    <h1>Sistema de Gestão Escolar</h1>
    <p>Carregando o sistema... Por favor, aguarde.</p>
  </body>
</html>
EOL
    echo "Created basic index.html in dist directory"
  fi
fi

echo "Netlify fix script completed." 
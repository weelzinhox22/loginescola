#!/bin/bash

# Print current directory for debugging
echo "Current directory: $(pwd)"

# Check if we're in a Netlify environment
if [ -n "$NETLIFY" ]; then
  echo "Running in Netlify environment"

  # Use Netlify-specific config files
  if [ -f netlify-tsconfig.json ]; then
    echo "Using Netlify-specific tsconfig.json..."
    cp netlify-tsconfig.json tsconfig.json
  fi
  
  if [ -f netlify-vite.config.ts ]; then
    echo "Using Netlify-specific vite.config.ts..."
    cp netlify-vite.config.ts vite.config.ts
  fi
  
  # Replace schema.ts with client-only version
  if [ -f netlify-schema.ts ]; then
    echo "Using Netlify-specific schema.ts..."
    mkdir -p shared
    cp netlify-schema.ts shared/schema.ts
  fi
  
  # Check if the Netlify-specific package.json exists and use it
  if [ -f netlify-package.json ] && [ "$USE_NETLIFY_PACKAGE" = "true" ]; then
    echo "Using Netlify-specific package.json..."
    cp netlify-package.json package.json
    
    # Clean node_modules and reinstall
    echo "Cleaning node_modules directory..."
    rm -rf node_modules
    rm -f package-lock.json
    echo "Installing dependencies from simplified package.json..."
    npm install
  else
    echo "Using existing package.json"
    # Clean node_modules and reinstall if requested
    if [ "$CLEAN_MODULES" = "true" ]; then
      echo "Cleaning node_modules directory..."
      rm -rf node_modules
      rm -f package-lock.json
      echo "Reinstalling dependencies..."
      npm install
    else
      echo "Skipping node_modules cleanup. Set CLEAN_MODULES=true to enable."
    fi
  fi
else
  echo "Not running in Netlify environment - skipping Netlify-specific setup"
fi

# Print Node.js and npm versions
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Make sure Rollup native dependencies are skipped
export ROLLUP_SKIP_NATIVE=true
echo "Set ROLLUP_SKIP_NATIVE=true"

# Verificar se o diretório client/src/pages existe
if [ ! -d "client/src/pages" ]; then
  echo "ERROR: Diretório client/src/pages não encontrado!"
  exit 1
fi

# Verificar se Home.tsx existe
if [ ! -f "client/src/pages/Home.tsx" ]; then
  echo "ERROR: client/src/pages/Home.tsx não encontrado!"
  exit 1
fi

# Verificar se App.tsx contém a rota para Home
if [ ! -f "client/src/App.tsx" ]; then
  echo "ERROR: client/src/App.tsx não encontrado!"
  exit 1
fi

# Verificar se a página Home está exportada corretamente
grep -q "export default Home" "client/src/pages/Home.tsx"
if [ $? -ne 0 ]; then
  echo "WARNING: 'export default Home' não encontrado em Home.tsx"
  # Não vamos falhar por isso, apenas avisar
fi

# Verificar se a rota para Home está definida corretamente
grep -q "path=\"/\" component={Home}" "client/src/App.tsx"
if [ $? -ne 0 ]; then
  echo "WARNING: Rota para Home não encontrada em App.tsx"
  # Não vamos falhar por isso, apenas avisar
fi

# Copiar o netlify-vite.config.ts para vite.config.js para garantir o build correto
cp netlify-vite.config.ts vite.config.js
echo "✅ Configuração preparada para build"

echo "Pre-build script completed successfully!" 
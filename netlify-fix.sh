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

# Function to create a minimal Vite React app
create_minimal_app() {
  echo "Creating minimal Vite React app as fallback..."
  
  # Create directories
  mkdir -p client/src
  
  # Create index.html
  cat > client/index.html << 'EOL'
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sistema de Gestão Escolar</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOL

  # Create main.jsx
  cat > client/src/main.jsx << 'EOL'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOL

  # Create App.jsx
  cat > client/src/App.jsx << 'EOL'
import React from 'react'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Sistema de Gestão Escolar</h1>
        <p>
          Esta é uma versão de emergência do site. 
          Por favor, verifique os logs de deploy do Netlify para mais informações.
        </p>
      </header>
    </div>
  )
}

export default App
EOL

  # Create CSS files
  cat > client/src/index.css << 'EOL'
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}
EOL

  cat > client/src/App.css << 'EOL'
.app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.app-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
  color: #4338ca;
  margin-bottom: 1rem;
}

p {
  color: #666;
  margin-bottom: 2rem;
}
EOL

  # Create minimal package.json
  cat > package.json << 'EOL'
{
  "name": "escola-digital-3d-client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.9"
  }
}
EOL

  # Create minimal vite.config.js
  cat > vite.config.js << 'EOL'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'client',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
})
EOL

  echo "Minimal Vite React app created"
}

# Check if client directory exists
if [ ! -d "client" ]; then
  echo "ERROR: client directory not found!"
  echo "Content of current directory:"
  ls -la
  create_minimal_app
fi

# Check if client/src directory exists
if [ ! -d "client/src" ]; then
  echo "ERROR: client/src directory not found!"
  echo "Content of client directory:"
  ls -la client
  create_minimal_app
fi

# Check if the simple package.json exists
if [ -f simple-package.json ]; then
  echo "Found simple-package.json, using it instead of regular package.json"
  cp simple-package.json package.json
  
  # Clean node_modules and reinstall with the simple package.json
  echo "Cleaning node_modules and reinstalling dependencies..."
  rm -rf node_modules
  rm -f package-lock.json
  npm install
fi

# Check if the simple vite config exists
if [ -f simple-vite.config.js ]; then
  echo "Found simple-vite.config.js, using it instead of regular vite.config.ts"
  cp simple-vite.config.js vite.config.js
elif [ -f vite.config.ts ]; then
  echo "Using existing vite.config.ts"
else
  echo "WARNING: No Vite config found! Creating a basic one..."
  cat > vite.config.js << 'EOL'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "client", "src"),
      "@shared": path.resolve(process.cwd(), "shared"),
    },
  },
  root: path.resolve(process.cwd(), "client"),
  build: {
    outDir: path.resolve(process.cwd(), "dist"),
    emptyOutDir: true,
  },
});
EOL
  echo "Created basic vite.config.js"
fi

# Make sure the schema.ts file doesn't use Drizzle
mkdir -p shared
if [ -f netlify-schema.ts ]; then
  echo "Using Netlify-specific schema.ts..."
  cp netlify-schema.ts shared/schema.ts
else
  echo "Creating simple schema.ts file..."
  cat > shared/schema.ts << 'EOL'
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  role: z.enum(["professor", "coordenador", "diretor"], {
    required_error: "Selecione um perfil de acesso",
  }),
  remember: z.boolean().optional(),
});

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  name: string;
}

export type LoginCredentials = z.infer<typeof loginSchema>;
EOL
  echo "Created simple schema.ts file"
fi

# Create client/index.html if it doesn't exist
if [ ! -f client/index.html ]; then
  echo "WARNING: client/index.html not found! Creating a basic one..."
  mkdir -p client
  cat > client/index.html << 'EOL'
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sistema de Gestão Escolar</title>
    <meta name="description" content="Plataforma Educacional Integrada com Interface 3D" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOL
  echo "Created basic client/index.html"
fi

# Run the build command
echo "Building client-side app..."
npm run build

# Check if the build succeeded
if [ -d "dist" ]; then
  echo "✅ Build succeeded! dist directory exists."
  echo "Contents of dist directory:"
  ls -la dist
else 
  echo "❌ ERROR: Build failed - dist directory not found!"
  
  # Try manual build with npx
  echo "Trying direct build with npx vite build..."
  export ROLLUP_SKIP_NATIVE=true
  npx vite build --root client --outDir ../dist
  
  if [ -d "dist" ]; then
    echo "✅ Manual build succeeded! dist directory exists."
    echo "Contents of dist directory:"
    ls -la dist
  else
    echo "❌ ERROR: Manual build also failed!"
    echo "Using fallback solution with minimal app..."
    create_minimal_app
    
    # Final attempt to build
    npm install
    npx vite build
    
    if [ -d "dist" ]; then
      echo "✅ Fallback build succeeded! dist directory exists."
      echo "Contents of dist directory:"
      ls -la dist
    else
      echo "❌ ERROR: All build attempts failed! Creating emergency fallback..."
      mkdir -p dist
      cat > dist/index.html << 'EOL'
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Sistema de Gestão Escolar</title>
    <style>
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
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
    <p>Ocorreu um erro durante o build. Por favor, verifique os logs de deploy.</p>
    <p>Estamos trabalhando para resolver este problema o mais rápido possível.</p>
  </body>
</html>
EOL
      echo "Created emergency fallback index.html in dist directory"
    fi
  fi
fi

echo "Netlify fix script completed." 
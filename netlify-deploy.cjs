// Script para garantir que o build do Netlify use o componente Home.tsx (CommonJS version)

const fs = require('fs');
const path = require('path');

console.log('Iniciando verificações para deploy no Netlify...');

const cwd = process.cwd();

// Verificar se o diretório client/src/pages existe
if (!fs.existsSync(path.join(cwd, 'client', 'src', 'pages'))) {
  console.error('ERROR: Diretório client/src/pages não encontrado!');
  process.exit(1);
}

// Verificar se Home.tsx existe
const homePath = path.join(cwd, 'client', 'src', 'pages', 'Home.tsx');
if (!fs.existsSync(homePath)) {
  console.error('ERROR: client/src/pages/Home.tsx não encontrado!');
  process.exit(1);
}

// Verificar se App.tsx existe
const appPath = path.join(cwd, 'client', 'src', 'App.tsx');
if (!fs.existsSync(appPath)) {
  console.error('ERROR: client/src/App.tsx não encontrado!');
  process.exit(1);
}

// Verificar conteúdo de App.tsx para garantir que a rota para Home está definida
const appContent = fs.readFileSync(appPath, 'utf8');
if (!appContent.includes('path="/" component={Home}')) {
  console.warn('⚠️ AVISO: Rota para Home não encontrada em App.tsx');
  console.log('Verificando importação de Home...');
  
  if (!appContent.includes('import Home from')) {
    console.error('ERROR: Import de Home não encontrado em App.tsx');
    process.exit(1);
  }
}

// Copiar o netlify-vite.config.ts para vite.config.js para garantir o build correto
const netlifyViteConfigPath = path.join(cwd, 'netlify-vite.config.ts');
const viteConfigPath = path.join(cwd, 'vite.config.js');

if (fs.existsSync(netlifyViteConfigPath)) {
  fs.copyFileSync(netlifyViteConfigPath, viteConfigPath);
  console.log('✅ Copiado netlify-vite.config.ts para vite.config.js');
} else {
  console.warn('⚠️ AVISO: netlify-vite.config.ts não encontrado');
}

console.log('✅ Verificações concluídas com sucesso!');
process.exit(0); 
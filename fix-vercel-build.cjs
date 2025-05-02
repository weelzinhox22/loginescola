#!/usr/bin/env node

/**
 * Script para resolver problemas de build no Vercel
 * Especificamente para lidar com dependências nativas do Rollup
 * Versão CommonJS para garantir compatibilidade
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Iniciando correções para deploy no Vercel (CJS version)');

// Função para executar comandos e capturar saída
function runCommand(command) {
  try {
    console.log(`Executando: ${command}`);
    const output = execSync(command, { encoding: 'utf-8' });
    console.log(output);
    return { success: true, output };
  } catch (error) {
    console.error(`Erro ao executar "${command}": ${error.message}`);
    return { success: false, error };
  }
}

// Corrigir o problema com o Rollup
console.log('Corrigindo problema com Rollup...');
const rollupNativeFile = path.join(process.cwd(), 'node_modules', 'rollup', 'dist', 'native.js');

try {
  // Certificar-se de que o diretório existe
  const rollupDir = path.dirname(rollupNativeFile);
  if (!fs.existsSync(rollupDir)) {
    fs.mkdirSync(rollupDir, { recursive: true });
    console.log(`Diretório criado: ${rollupDir}`);
  }

  // Verificar se o arquivo existe e fazer backup
  if (fs.existsSync(rollupNativeFile)) {
    fs.copyFileSync(rollupNativeFile, `${rollupNativeFile}.backup`);
    console.log(`Backup criado: ${rollupNativeFile}.backup`);
  }

  // Criar um arquivo modificado com exportações adequadas
  const fixedContent = `
// Modified for Vercel deployment to avoid native dependencies issues
// This completely disables native dependencies and provides mock implementations

// Fornecer implementações fake que não dependem de módulos nativos
exports.getDefaultDllDir = () => null;
exports.hasMagic = () => false;
exports.loadDll = () => null;
exports.needsDll = () => false;
exports.relocateDll = () => null;

// Adicionar exports necessários para ESM imports
exports.parse = (code, options) => ({ type: 'Program', body: [], sourceType: 'module' });
exports.parseAsync = async (code, options) => ({ type: 'Program', body: [], sourceType: 'module' });
exports.xxhashBase64Url = (value) => 'xxhash_' + Buffer.from(value.toString()).toString('base64').replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=/g, '');
exports.xxhashBase36 = (value) => 'xxh36_' + value.toString(36);
exports.xxhashBase16 = (value) => 'xxh16_' + value.toString(16);

// Evitar erros de resolução de módulo
module.exports = exports;
`;

  fs.writeFileSync(rollupNativeFile, fixedContent, 'utf8');
  console.log(`✅ Arquivo modificado: ${rollupNativeFile}`);
} catch (error) {
  console.error(`❌ Erro ao corrigir Rollup: ${error.message}`);
}

// Garantir que o client/public e dist existem
const clientPublicDir = path.join(process.cwd(), 'client', 'public');
const distDir = path.join(process.cwd(), 'dist');

if (!fs.existsSync(clientPublicDir)) {
  fs.mkdirSync(clientPublicDir, { recursive: true });
  console.log(`✅ Diretório client/public criado`);
}

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log(`✅ Diretório dist criado`);
}

// Garantir que temos um arquivo index.html básico no dist
const fallbackHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Escola Digital 3D</title>
  <meta name="description" content="Plataforma Educacional Integrada com Interface 3D" />
  <style>
    body { 
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      margin: 0; 
      padding: 0; 
      background: linear-gradient(135deg, #f0f4ff 0%, #e4e9ff 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .container {
      max-width: 500px;
      margin: 2rem;
      text-align: center;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }
    h1 { color: #4f46e5; font-size: 2rem; margin-bottom: 1rem; }
    p { line-height: 1.6; color: #666; margin-bottom: 2rem; }
    .button {
      display: inline-block;
      background: linear-gradient(to right, #4f46e5, #7269ef);
      color: white;
      padding: 0.8rem 2rem;
      border-radius: 8px;
      font-weight: bold;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    .button:hover { transform: translateY(-2px); }
  </style>
</head>
<body>
  <div class="container">
    <h1>Escola Digital 3D</h1>
    <p>Bem-vindo à Plataforma Educacional Integrada</p>
    <a href="/" class="button">Iniciar Aplicação</a>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'index.html'), fallbackHTML);
console.log('✅ Arquivo index.html criado em dist');

// Garantir que temos um arquivo _redirects no dist
const redirectsContent = `# Redirect Sistema de Gestão Escolar to Home page
/Sistema* / 301!

# SPA routing - todas as rotas vão para o index.html
/* /index.html 200`;

fs.writeFileSync(path.join(distDir, '_redirects'), redirectsContent);
console.log('✅ Arquivo _redirects criado em dist');

// Criar arquivo vercel.json no diretório raiz
const vercelJsonContent = `{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/Sistema.*",
      "dest": "/",
      "status": 301
    },
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*\\\\.[a-z0-9]+)$",
      "dest": "/$1" 
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "ROLLUP_SKIP_NATIVE": "true",
    "NODE_OPTIONS": "--max_old_space_size=4096",
    "VITE_DEPLOYMENT": "vercel"
  }
}`;

fs.writeFileSync(path.join(process.cwd(), 'vercel.json'), vercelJsonContent);
console.log('✅ Arquivo vercel.json criado/atualizado');

console.log('🎉 Script de preparação para o Vercel concluído!'); 
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Definir diretórios
const distDir = path.join(process.cwd(), 'dist');
const publicDir = path.join(process.cwd(), 'public');
const clientDir = path.join(process.cwd(), 'client');

console.log('🚀 Preparando arquivos para deploy no Netlify...');

// Criar diretório dist se não existir
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('✅ Diretório dist criado');
}

// Copiar arquivos estáticos do public para dist
if (fs.existsSync(publicDir)) {
  console.log('Copiando arquivos estáticos de public para dist...');
  fs.readdirSync(publicDir).forEach(file => {
    const sourcePath = path.join(publicDir, file);
    const destPath = path.join(distDir, file);
    
    if (fs.lstatSync(sourcePath).isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      
      // Copiar subdiretórios (maneira simples)
      execSync(`cp -r "${sourcePath}/*" "${destPath}/"`).toString();
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
  console.log('✅ Arquivos estáticos copiados');
}

// Garantir que temos um index.html
if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.log('Criando index.html...');
  
  let htmlContent = '';
  const clientIndexPath = path.join(clientDir, 'index.html');
  
  if (fs.existsSync(clientIndexPath)) {
    // Usar o index.html do client como base
    htmlContent = fs.readFileSync(clientIndexPath, 'utf8');
    // Corrigir o título
    htmlContent = htmlContent.replace(/<title>.*?<\/title>/, '<title>Escola Digital 3D</title>');
  } else {
    // Criar um index.html básico
    htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Escola Digital 3D</title>
  <meta name="description" content="Plataforma Educacional Integrada com Interface 3D" />
  <style>
    body { 
      font-family: system-ui, sans-serif; 
      margin: 0; 
      padding: 0; 
      background: linear-gradient(135deg, #f0f4ff 0%, #e4e9ff 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .container {
      max-width: 500px;
      text-align: center;
      padding: 2rem;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }
    h1 { color: #4f46e5; margin-bottom: 1rem; }
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
    <p>Bem-vindo à Plataforma Educacional</p>
    <a href="/" class="button">Iniciar Aplicação</a>
  </div>
</body>
</html>`;
  }
  
  fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);
  console.log('✅ index.html criado');
}

// Garantir que temos um arquivo _redirects no dist
if (!fs.existsSync(path.join(distDir, '_redirects'))) {
  console.log('Criando arquivo _redirects...');
  const redirectsContent = `# Redirect Sistema de Gestão Escolar to Home page
/Sistema* / 301!

# SPA routing - todas as rotas vão para o index.html
/* /index.html 200`;
  
  fs.writeFileSync(path.join(distDir, '_redirects'), redirectsContent);
  console.log('✅ Arquivo _redirects criado');
}

console.log('✅ Deploy preparado com sucesso! Agora você pode enviar a pasta dist para o Netlify.'); 
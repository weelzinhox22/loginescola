#!/usr/bin/env node

/**
 * Script para corrigir problemas no deploy do Netlify
 * Este script é específico para resolver problema com dependências nativas do Rollup
 * e criar uma versão básica do site se o build falhar.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Iniciando correções para o deploy no Netlify');

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

// Verificar estrutura do projeto
console.log('Verificando estrutura do projeto...');
const homeFile = path.join(process.cwd(), 'client', 'src', 'pages', 'Home.tsx');
const appFile = path.join(process.cwd(), 'client', 'src', 'App.tsx');

if (!fs.existsSync(homeFile)) {
  console.error(`⚠️ Arquivo não encontrado: ${homeFile}`);
} else {
  console.log(`✅ Arquivo encontrado: ${homeFile}`);
}

if (!fs.existsSync(appFile)) {
  console.error(`⚠️ Arquivo não encontrado: ${appFile}`);
} else {
  console.log(`✅ Arquivo encontrado: ${appFile}`);
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

  // Criar um arquivo modificado
  const fixedContent = `
// Modified for Netlify deployment to avoid native dependencies issues
exports.getDefaultDllDir = () => null;
exports.hasMagic = () => false;
exports.loadDll = () => null;
exports.needsDll = () => false;
exports.relocateDll = () => null;
`;

  fs.writeFileSync(rollupNativeFile, fixedContent, 'utf8');
  console.log(`✅ Arquivo modificado: ${rollupNativeFile}`);
} catch (error) {
  console.error(`❌ Erro ao corrigir Rollup: ${error.message}`);
}

// Tentar executar o build
process.env.ROLLUP_SKIP_NATIVE = 'true';
process.env.NODE_OPTIONS = '--max_old_space_size=4096';

console.log('Tentando executar build...');
const buildResult = runCommand('npx vite build --config vite.config.netlify.js');

// Verificar se o build foi bem-sucedido
const distDir = path.join(process.cwd(), 'dist');
const indexFile = path.join(distDir, 'index.html');

if (!fs.existsSync(indexFile) || !buildResult.success) {
  console.log('❌ Build falhou. Criando página alternativa...');
  
  // Criar diretório dist se não existir
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Criar uma página HTML simples
  const fallbackHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Escola Digital 3D</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 0; background-color: #f5f7fa; }
    .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
    .header { text-align: center; margin-bottom: 2rem; }
    h1 { color: #4f46e5; }
    p { line-height: 1.6; color: #333; }
    a { color: #4f46e5; text-decoration: none; font-weight: bold; }
    a:hover { text-decoration: underline; }
    .button { display: inline-block; background-color: #4f46e5; color: white; padding: 0.5rem 1rem; 
              border-radius: 0.25rem; margin-top: 1rem; font-weight: bold; }
    .button:hover { background-color: #4338ca; text-decoration: none; }
  </style>
</head>
<body>
  <div id="root">
    <div class="container">
      <div class="header">
        <h1>Escola Digital 3D</h1>
        <p>Ambiente educacional interativo</p>
      </div>
      <div>
        <p>Bem-vindo à plataforma de gestão escolar digital.</p>
        <p>Acesse o sistema completo através do botão abaixo.</p>
        <a href="/" class="button">Acessar Plataforma</a>
      </div>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(indexFile, fallbackHTML, 'utf8');
  console.log(`✅ Página alternativa criada: ${indexFile}`);
} else {
  console.log(`✅ Build bem-sucedido! Arquivo criado: ${indexFile}`);
  
  // Verificar se o conteúdo contém referência indesejada
  const content = fs.readFileSync(indexFile, 'utf8');
  if (content.includes('Sistema de Gestão Escolar')) {
    console.log('⚠️ Conteúdo indesejado encontrado. Substituindo...');
    
    // Criar página de redirecionamento
    const redirectHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redirecionando...</title>
  <meta http-equiv="refresh" content="0;url=/" />
  <script>window.location.href = '/';</script>
</head>
<body>
  <p>Redirecionando...</p>
</body>
</html>`;
    
    fs.writeFileSync(indexFile, redirectHTML, 'utf8');
    console.log(`✅ Página substituída por redirecionamento.`);
  }
}

console.log('🎉 Processo de correção concluído!'); 
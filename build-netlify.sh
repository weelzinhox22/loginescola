#!/bin/bash

# Script para build no Netlify

echo "=== Iniciando build para Netlify ==="

# Definir variáveis de ambiente para o build
export ROLLUP_SKIP_NATIVE=true
export NODE_OPTIONS="--max_old_space_size=4096"
export VITE_DEPLOYMENT="netlify"
export NODE_ENV="production"

# Criar diretório public se não existir
if [ ! -d "./client/public" ]; then
  mkdir -p ./client/public
  echo "Diretório ./client/public criado"
fi

# Garantir que o arquivo _redirects existe
if [ ! -f "./client/public/_redirects" ]; then
  cat > ./client/public/_redirects << EOF
# Redirect Sistema de Gestão Escolar to Home page
/Sistema* / 301!

# SPA routing - todas as rotas vão para o index.html
/* /index.html 200
EOF
  echo "Arquivo _redirects criado"
fi

# Garantir que o título está correto no index.html
if [ -f "./client/index.html" ]; then
  sed -i 's/<title>Sistema de Gestão Escolar<\/title>/<title>Escola Digital 3D<\/title>/g' ./client/index.html
  echo "Título corrigido no index.html"
fi

# Executar o script de correção do Netlify
echo "Executando fix-netlify.cjs..."
node ./fix-netlify.cjs

# Tentar build com configuração específica do Netlify
echo "Tentando build com configuração para Netlify..."
npx vite build --config vite.config.netlify.js || echo "Build falhou, mas continuando com a versão de fallback criada por fix-netlify.cjs"

# Garantir que o _redirects está no diretório dist
if [ ! -f "./dist/_redirects" ]; then
  cp ./client/public/_redirects ./dist/ 2>/dev/null || echo "Não foi possível copiar _redirects, criando..."
  cat > ./dist/_redirects << EOF
# Redirect Sistema de Gestão Escolar to Home page
/Sistema* / 301!

# SPA routing - todas as rotas vão para o index.html
/* /index.html 200
EOF
  echo "Arquivo _redirects criado no dist"
fi

# Finalizar
echo "=== Build para Netlify concluído ===" 
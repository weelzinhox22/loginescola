#!/bin/bash

echo "Iniciando build para o Netlify..."

# Verificar se estamos no ambiente do Netlify
if [ -n "$NETLIFY" ]; then
  echo "Executando no ambiente do Netlify"
else
  echo "Executando localmente (simulando o ambiente do Netlify)"
fi

# Verificar estrutura do projeto
if [ ! -d "client/src/pages" ]; then
  echo "ERRO: Diretório client/src/pages não encontrado!"
  exit 1
fi

if [ ! -f "client/src/pages/Home.tsx" ]; then
  echo "ERRO: client/src/pages/Home.tsx não encontrado!"
  exit 1
fi

if [ ! -f "client/src/App.tsx" ]; then
  echo "ERRO: client/src/App.tsx não encontrado!"
  exit 1
fi

# Garantir que a rota raiz "/" direciona para o componente Home
if ! grep -q "path=\"/\" component={Home}" "client/src/App.tsx"; then
  echo "ALERTA: Rota para Home não encontrada em App.tsx. Verificando importação..."
  
  if ! grep -q "import Home from" "client/src/App.tsx"; then
    echo "ERRO: Importação de Home não encontrada em App.tsx!"
    exit 1
  fi
fi

# Configurar variáveis de ambiente para o build
export ROLLUP_SKIP_NATIVE=true
export NODE_OPTIONS="--max_old_space_size=4096"
export VITE_APP_HOME_PATH="/client/src/pages/Home.tsx"
export VITE_DEPLOYMENT="netlify"

# Criar o diretório dist se não existir
mkdir -p dist

# Executar o build do cliente com a configuração específica do Netlify
echo "Executando build do cliente com configuração específica para o Netlify..."
npx vite build --config vite.config.netlify.js

# Verificar se o build foi bem-sucedido
if [ -f "dist/index.html" ]; then
  echo "✅ Build concluído com sucesso! O arquivo dist/index.html foi criado."
  
  # Verificar se o arquivo index.html menciona 'Sistema de Gestão Escolar'
  if grep -q "Sistema de Gestão Escolar" "dist/index.html"; then
    echo "⚠️ ALERTA: O arquivo index.html contém referência ao 'Sistema de Gestão Escolar'."
    echo "Isso pode indicar que está usando a versão estática de fallback."
  else
    echo "✅ O arquivo index.html não contém referências indesejadas."
  fi
else
  echo "❌ ERRO: O build falhou. O arquivo dist/index.html não foi criado."
  exit 1
fi

echo "✅ Build para o Netlify concluído com sucesso!"
exit 0 
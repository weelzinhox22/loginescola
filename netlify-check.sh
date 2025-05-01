#!/bin/bash

echo "Iniciando verificações para deploy no Netlify..."

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

# Verificar se App.tsx existe
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
if [ -f "netlify-vite.config.ts" ]; then
  cp netlify-vite.config.ts vite.config.js
  echo "✅ Copiado netlify-vite.config.ts para vite.config.js"
else
  echo "⚠️ AVISO: netlify-vite.config.ts não encontrado"
fi

echo "✅ Verificações concluídas com sucesso!"
exit 0 
# Sistema de Gestão Escolar

Interface de usuário para um sistema de gestão escolar moderno com UI/UX inovadora e animações interativas.

## Configuração para Deploy no Netlify

Este projeto foi configurado para ser facilmente implantado no Netlify.

### Instruções para Deploy

1. Faça um fork ou clone este repositório

2. Conecte-se ao Netlify (https://www.netlify.com/) e selecione "New site from Git"

3. Selecione o repositório clonado ou forkado

4. Configure as seguintes opções de build:
   - **Build command**: `chmod +x ./netlify-fix.sh && ./netlify-fix.sh`
   - **Publish directory**: `dist`

5. Adicione as seguintes variáveis de ambiente:
   - **ROLLUP_SKIP_NATIVE**: `true`
   - **NODE_OPTIONS**: `--max_old_space_size=4096`

6. Clique em "Deploy site"

### Solução de Problemas com o Netlify

Se você encontrar erros durante o deploy, aqui estão algumas soluções:

1. **Erro de módulo não encontrado (`@rollup/rollup-linux-x64-gnu`):**
   - Este é um problema conhecido com dependências nativas do Rollup no ambiente do Netlify
   - Nosso script `netlify-fix.sh` resolve isso automaticamente configurando a variável de ambiente `ROLLUP_SKIP_NATIVE=true`

2. **Erro com a importação do Drizzle ORM:**
   - O script `netlify-fix.sh` substitui o arquivo `schema.ts` por uma versão apenas para o cliente que não depende do Drizzle ORM

3. **Outros erros de build:**
   - Tente usar o arquivo `simple-package.json` em vez do `package.json` original
   - Defina a variável de ambiente `DEBUG=true` no Netlify para obter mais informações sobre o processo de build

## Desenvolvimento Local

Para executar o projeto localmente:

1. Instale as dependências:
```
npm install
```

2. Inicie o servidor de desenvolvimento:
```
npm run dev:client
```

3. Abra [http://localhost:5173](http://localhost:5173) para visualizar o aplicativo no navegador.

## Funcionalidades

- Interface moderna com gradientes e efeitos visuais
- Formulário de login com validação
- Animações interativas (urso animado, livro 3D)
- Dashboard para diferentes tipos de usuários

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- Wouter (roteamento)
- React-Hook-Form (formulários)
- Zod (validação)
- Radix UI (componentes acessíveis)
- Lucide React (ícones) 
# Sistema de Gestão Escolar

Interface de usuário para um sistema de gestão escolar moderno com UI/UX inovadora e animações interativas.

## Configuração para Deploy no Netlify

Este projeto foi configurado para ser facilmente implantado no Netlify.

### Instruções para Deploy

1. Faça um fork ou clone este repositório

2. Conecte-se ao Netlify (https://www.netlify.com/) e selecione "New site from Git"

3. Selecione o repositório clonado ou forkado

4. Configure as seguintes opções de build:
   - **Build command**: `npm run build:client`
   - **Publish directory**: `dist`

5. Clique em "Deploy site"

### Configuração Avançada

O projeto inclui:
- `netlify.toml` - Arquivo de configuração para Netlify
- Redirecionamentos para SPA (Single Page Application)
- Scripts otimizados para build apenas do frontend

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
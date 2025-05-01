// Minimal server for Netlify functions
export function handler(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
              background-color: #f9fafb;
            }
            h1 {
              color: #4f46e5;
              margin-bottom: 1rem;
            }
            p {
              color: #666;
              max-width: 600px;
            }
            .btn {
              background-color: #4f46e5;
              color: white;
              border: none;
              padding: 0.5rem 1rem;
              border-radius: 0.25rem;
              font-size: 1rem;
              cursor: pointer;
              margin-top: 1rem;
              text-decoration: none;
            }
            .btn:hover {
              background-color: #4338ca;
            }
          </style>
        </head>
        <body>
          <h1>Sistema de Gestão Escolar</h1>
          <p>Versão emergencial - Modo de contingência do sistema.</p>
          <p>Estamos trabalhando para restaurar o serviço completo o mais rápido possível.</p>
          <a href="/" class="btn">Recarregar página</a>
        </body>
      </html>
    `,
  };
} 
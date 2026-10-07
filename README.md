# Game Nexus

Frontend de uma plataforma de jogos com autenticação, salas e partidas em tempo real.

O projeto foi construído com React + TypeScript e possui integração HTTP e WebSocket com um backend executado em `localhost:5000` durante o desenvolvimento.

## Funcionalidades

- cadastro e login
- rotas protegidas
- dashboard autenticado
- criação de salas
- entrada em salas
- fluxo de rodadas e jogo
- atualização em tempo real via WebSocket
- tratamento centralizado de sessão expirada

## Stack

- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- WebSocket
- Tailwind CSS
- shadcn/ui + Radix UI

## Rotas principais

```text
/                 home
/sobre            sobre
/cadastro         cadastro
/login            login
/dashboard        área autenticada
/salas/nova       criação de sala
/salas/:idSala    sala
/salas/:idSala/rodadas/:idRodada
```

## Executando localmente

```bash
npm install
npm run dev
```

Para o fluxo completo, o backend deve estar disponível em `http://localhost:5000` e o WebSocket em `ws://localhost:5000`.

## Organização

- `src/pages` — páginas da aplicação.
- `src/components` — componentes reutilizáveis e rotas protegidas.
- `src/contexts` — autenticação e contexto global.
- `src/services/api.ts` — cliente HTTP.
- `src/services/websocket.ts` — comunicação em tempo real.

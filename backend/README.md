# Dev Insights – Backend 🚀

![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-TS-3178C6?logo=typescript)
![Express](https://img.shields.io/badge/Express.js-Framework-000000?logo=express)
![Axios](https://img.shields.io/badge/HTTP-Axios-5A29E4?logo=axios)
![GitHub API](https://img.shields.io/badge/API-GitHub%20REST-181717?logo=github)
![Google GenAI](https://img.shields.io/badge/AI-Gemini%20(Google%20GenAI)-4285F4?logo=google)
![CORS](https://img.shields.io/badge/Middleware-CORS-ffcc00)
![dotenv](https://img.shields.io/badge/Config-dotenv-000000)
![Runner](https://img.shields.io/badge/Runner-tsx-000000)
![Status](https://img.shields.io/badge/Status-Em%20desenvolvimento-yellow)

## 📌 Descrição do Projeto

API em Node.js/TypeScript que analisa commits do GitHub e gera insights de produtividade usando a IA Gemini (Google GenAI).  
Ela será consumida pelo frontend do painel Dev Insights.

---

## 🧱 Tecnologias

- Node.js + TypeScript  
- Express  
- Axios  
- @google/genai (Gemini `gemini-2.5-flash`)  
- GitHub REST API v3  
- CORS habilitado para consumo pelo frontend  
- dotenv para carregar variáveis de ambiente  

---

## 📁 Estrutura do projeto (sugerida)

```bash
backend/
  ├── app.ts               # Configuração do Express, rotas e middlewares
  ├── server.ts            # Ponto de entrada da API (listen)
  ├── gemini.ts            # Integração com Google GenAI (Gemini)
  ├── config/
  │   └── config.ts        # Leitura de variáveis de ambiente (PORT, tokens, etc.)
  ├── routes/
  │   ├── github.ts        # Rotas para GitHub (repositórios e commits)
  │   └── insights.ts      # Rota para geração de insights
  ├── server/
  │   ├── github-service.ts    # Serviço para buscar commits no GitHub
  │   └── server_insights.ts   # Orquestra commits + Gemini p/ gerar insights
  └── util/
      ├── type.ts          # Tipos/Interfaces (CommitInfo, Queries)
      └── status-code.ts   # Enum de códigos HTTP
```

> Obs: se hoje os arquivos estiverem todos na raiz, você pode manter assim ou organizar nessas pastas.

---

## ⚙️ Variáveis de ambiente

Crie um arquivo `.env` na pasta `backend/` com:

```env
PORT=4000                  # Porta da API (opcional, default 4000)
GITHUB_TOKEN=seu_token_do_github_aqui
GEMINI_API_KEY=sua_api_key_do_gemini_aqui
```

- `GITHUB_TOKEN`: token pessoal do GitHub com permissão de leitura pública (pelo menos).  
- `GEMINI_API_KEY`: chave da API do Google AI Studio.

Essas variáveis são lidas em `config/config.ts`.

---

## ▶️ Como rodar localmente

1. **Instalar dependências** (na raiz do projeto, onde está o `package.json`):

```bash
npm install
```

2. **Subir o backend (modo dev)** – assumindo que você tem um script no `package.json` similar a:

```jsonc
"scripts": {
  "start:dev": "tsx --env-file=backend/.env backend/server.ts"
}
```

Execute:

```bash
npm run start:dev
```

3. A API ficará disponível em:

```text
http://localhost:4000
```

(você pode alterar a porta via `PORT` no `.env`).

---

## 🌐 Endpoints

### 1. Healthcheck

**GET /**  

Retorna uma mensagem simples para verificar se a API está online.

**Resposta de exemplo**

```text
🚀 API Dev Insights funcionando!
```

---

### 2. Listar repositórios de um usuário

**GET /github/repos**

Query params:

- `username` (obrigatório): usuário do GitHub.

**Exemplo**

```http
GET /github/repos?username=Gabriel1000000
```

**Via cURL**

```bash
curl "http://localhost:4000/github/repos?username=Gabriel1000000"
```

Retorna o JSON da própria API do GitHub com os repositórios do usuário.

---

### 3. Listar commits de um repositório

**GET /github/commits**

Query params:

- `owner` (obrigatório): dono do repositório (user/org)  
- `repo` (obrigatório): nome do repositório  
- `since` (opcional): data inicial (ISO, ex: `2025-01-01T00:00:00Z`)  
- `until` (opcional): data final (ISO)

**Exemplo**

```http
GET /github/commits?owner=Gabriel1000000&repo=API-Rest-Aplicacao-Med.Voll&since=2025-01-01T00:00:00Z
```

**Via cURL**

```bash
curl "http://localhost:4000/github/commits?owner=Gabriel1000000&repo=API-Rest-Aplicacao-Med.Voll"
```

**Resposta (exemplo simplificado)**

```json
[
  {
    "sha": "abc123...",
    "author": "Gabriel",
    "login": "Gabriel1000000",
    "message": "feat: adiciona nova rota de pacientes",
    "date": "2025-01-15T18:30:00Z",
    "url": "https://github.com/..."
  }
]
```

---

### 4. Gerar insights de produtividade (IA Gemini)

**GET /insights**

Esse endpoint:

1. Busca commits do repositório informado (`getRepoCommits`).
2. Junta as mensagens dos commits.
3. Envia para o Gemini gerar insights.
4. Retorna um resumo com:
   - `totalCommits` (quantidade de commits)
   - `insights` (texto retornado pelo modelo)
   - `commits` (lista de commits utilizados)

Query params (mesmos de `/github/commits`):

- `owner` (obrigatório)  
- `repo` (obrigatório)  
- `since` (opcional)  
- `until` (opcional)

**Exemplo**

```http
GET /insights?owner=Gabriel1000000&repo=API-Rest-Aplicacao-Med.Voll&since=2025-01-01T00:00:00Z&until=2025-01-31T23:59:59Z
```

**Via cURL**

```bash
curl "http://localhost:4000/insights?owner=Gabriel1000000&repo=API-Rest-Aplicacao-Med.Voll"
```

**Resposta (exemplo)**

```json
{
  "totalCommits": 42,
  "insights": "- Commits frequentes durante a semana...\n- Sugestão: agrupar mudanças semelhantes...",
  "commits": [
    {
      "sha": "abc123...",
      "author": "Gabriel",
      "login": "Gabriel1000000",
      "message": "refactor: melhora serviço de agendamento",
      "date": "2025-01-10T10:00:00Z",
      "url": "https://github.com/..."
    }
  ]
}
```

---

## 🔐 Tratamento de erros

- Se `username`, `owner` ou `repo` não forem enviados, a API retorna **400 Bad Request** com uma mensagem de erro.  
- Se houver erro na chamada à API do GitHub, o backend devolve:
  - o status retornado pelo GitHub (quando disponível) ou 500  
  - JSON com `error` e `details`.  
- Se houver problema ao gerar insights com o Gemini, retorna **500** com mensagem genérica:  
  `{"error": "Erro ao gerar insights"}`.

---

## 🚀 Próximos passos

- Integrar este backend com o frontend (React) para:
  - Selecionar repositório e período de análise.
  - Mostrar gráficos de frequência de commits.
  - Exibir insights gerados pela IA.



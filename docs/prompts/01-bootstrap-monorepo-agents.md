# Prompt 01 — Bootstrap do monorepo simples, investigação e AGENTS.md

Você está iniciando o projeto **OpsBoard — Painel Operacional Fullstack**.

Antes de implementar funcionalidades de produto, crie uma fundação limpa, documentada e adequada para desenvolvimento com agentes/IA.

## Objetivo do projeto

OpsBoard é uma aplicação fullstack demonstrativa para gestão de solicitações operacionais internas.

O sistema simula o fluxo de uma empresa que precisa registrar demandas, priorizar solicitações, atribuir responsáveis, acompanhar prazos, consultar indicadores e manter histórico de alterações para auditoria.

O objetivo técnico é demonstrar uma arquitetura de aplicação web realista, com frontend em Angular, API em Laravel, banco relacional PostgreSQL e ambiente Docker, priorizando clareza de produto, regras de negócio, manutenibilidade, documentação e boas práticas de desenvolvimento.

## Decisões já tomadas

- Arquitetura: monorepo simples, sem Turborepo.
- Frontend: Angular atual, mirando Angular 21 se disponível.
- Backend: Laravel 13.
- Banco: PostgreSQL.
- Auth: Laravel Sanctum com SPA auth.
- UI: Angular Material atual com Material Design 3 e theming próprio, se viável.
- Interface: português.
- Código/API/documentação técnica interna: inglês.
- Deploy: Docker local + README.
- Não usar VPS.
- Não adicionar complexidade desnecessária.

## Primeiro passo obrigatório: consultar documentação atual

Antes de criar o projeto, consulte a documentação oficial atual quando houver dúvida de versão, scaffold ou configuração:

- Angular: https://angular.dev
- Angular CLI: https://angular.dev/tools/cli
- Angular Material: https://material.angular.dev
- Laravel 13: https://laravel.com/docs/13.x
- Laravel Sanctum: https://laravel.com/docs/13.x/sanctum

Se Angular 21 ou Laravel 13 não estiverem disponíveis no ambiente local, não invente APIs. Registre a limitação e use a versão estável mais recente disponível, mantendo a estrutura preparada para atualização.

## Estrutura desejada

Criar uma estrutura de monorepo simples:

```text
opsboard/
  AGENTS.md
  README.md
  docker-compose.yml
  .env.example
  docs/
    decisions/
    api/
    screenshots/
    specs/
  frontend/
    # Angular app
  backend/
    # Laravel app
  docker/
    nginx/
    postgres/
```

A estrutura pode variar levemente se a ferramenta oficial de scaffold exigir, mas preserve a separação clara entre `frontend`, `backend`, `docs` e arquivos de infraestrutura na raiz.

## Tarefas

1. Inicializar o repositório base, se ainda não existir.
2. Criar a estrutura de pastas.
3. Criar `AGENTS.md` na raiz.
4. Criar `README.md` inicial.
5. Criar `.gitignore` adequado para Node, Angular, Laravel, Docker, envs, logs e arquivos temporários.
6. Criar `.env.example` raiz com variáveis gerais esperadas para Docker local.
7. Criar `docs/decisions/0001-monorepo-simple.md` explicando por que o projeto usa monorepo simples e não Turborepo.
8. Não implementar ainda regras de negócio.
9. Não criar código improvisado apenas para “parecer pronto”.

## Conteúdo obrigatório do AGENTS.md

O `AGENTS.md` deve conter:

### 1. Project overview

- Nome: OpsBoard.
- Tipo: aplicação fullstack demonstrativa.
- Domínio: gestão de solicitações operacionais internas.
- Objetivo de portfólio: demonstrar product engineering, Angular, Laravel, PostgreSQL, Docker, autenticação, permissões, auditoria, documentação e manutenção real.

### 2. Tech stack

Documentar a stack planejada:

- Angular atual, alvo Angular 21 se disponível.
- Angular Material atual com Material Design 3.
- Laravel 13.
- PostgreSQL.
- Laravel Sanctum SPA auth.
- Docker Compose.
- Testes básicos.
- Documentação técnica em `docs/`.

### 3. Repository structure

Explicar a função de cada pasta:

- `frontend/`
- `backend/`
- `docs/`
- `docker/`

### 4. Development rules

Incluir regras como:

- Consulte a documentação oficial antes de usar APIs específicas de versão.
- Evite overengineering.
- Não adicionar bibliotecas sem justificativa.
- Código/API/documentos técnicos em inglês.
- UI em português.
- Nomes de entidades no código em inglês.
- Priorize legibilidade, manutenção e consistência.
- Trate este projeto como portfólio técnico: o README e a documentação importam tanto quanto o código.
- Não esconder falhas de build/teste; registrar claramente.

### 5. UI/visual direction

Paleta-base:

- Terracota/cobre: `#A94726`
- Laranja queimado: `#C65A2E`
- Marrom avermelhado: `#6E2D1D`
- Grafite: `#15171C`
- Off-white: `#F4E8DE`

Direção:

- interface sóbria;
- aparência de sistema operacional interno;
- clean, confiável, organizada;
- sem visual infantil;
- sem excesso de animações;
- Material Design 3 se viável;
- tema customizado com Angular Material e SCSS tokens, se suportado pela versão instalada.

### 6. Validation commands

Documentar comandos esperados, ainda que alguns só existam após os scaffolds:

```bash
docker compose up -d
docker compose down
cd frontend && npm run build
cd frontend && npm run test
cd backend && php artisan test
cd backend && php artisan migrate:fresh --seed
```

Ajustar conforme scripts reais.

## README inicial

Criar README inicial com:

- descrição do produto;
- stack;
- estrutura;
- status: em desenvolvimento;
- pré-requisitos;
- instrução de que setup detalhado virá nos próximos blocos.

## Validação

Ao final:

1. Liste arquivos criados.
2. Explique decisões tomadas.
3. Informe qualquer limitação encontrada.
4. Não avance para implementação de funcionalidades sem aguardar o próximo prompt.

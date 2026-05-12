# Prompt 02 — Especificação de produto, domínio e decisões técnicas iniciais

Continue no projeto **OpsBoard**.

Antes de implementar backend/frontend, crie documentação de produto e domínio para orientar os próximos blocos.

## Objetivo

Definir claramente o que o OpsBoard é, quais problemas simula resolver, quais entidades possui, quais papéis existem e quais regras de negócio devem orientar a implementação.

## Contexto funcional

OpsBoard é uma aplicação fullstack demonstrativa para gestão de solicitações operacionais internas.

O sistema permite que usuários registrem solicitações, acompanhem status, atribuam responsáveis, definam prioridade, filtrem demandas, acompanhem indicadores no dashboard e consultem histórico/auditoria das alterações.

## Tarefas

Crie os seguintes documentos:

```text
docs/specs/01-product-overview.md
docs/specs/02-domain-model.md
docs/specs/03-permissions.md
docs/specs/04-api-overview.md
docs/specs/05-frontend-overview.md
docs/decisions/0002-domain-scope.md
docs/decisions/0003-postgresql.md
docs/decisions/0004-sanctum-spa-auth.md
```

## 1. Product overview

Arquivo: `docs/specs/01-product-overview.md`

Deve conter:

- descrição do produto;
- público-alvo fictício;
- problema operacional simulado;
- principais fluxos;
- o que está dentro do escopo;
- o que está fora do escopo;
- status do projeto;
- como o projeto deve ser apresentado no portfólio.

Texto-base:

```text
OpsBoard é uma aplicação fullstack demonstrativa para gestão de solicitações operacionais internas.

O sistema simula o fluxo de uma empresa que precisa registrar demandas, priorizar solicitações, atribuir responsáveis, acompanhar prazos, consultar indicadores e manter histórico de alterações para auditoria.

O objetivo é demonstrar uma arquitetura web realista, com foco em produto, regras de negócio, manutenção, documentação e boas práticas fullstack.
```

## 2. Domain model

Arquivo: `docs/specs/02-domain-model.md`

Definir entidades principais:

### User

Campos esperados:

```text
id
name
email
password
role
active
created_at
updated_at
```

Roles:

```text
admin
manager
operator
viewer
```

### OperationalRequest

Campos esperados:

```text
id
title
description
category_id
status
priority
requester_id
assignee_id
due_date
resolved_at
cancelled_at
created_at
updated_at
```

Status:

```text
open
in_review
in_progress
waiting_response
resolved
cancelled
```

Labels de UI em português:

```text
Aberta
Em análise
Em andamento
Aguardando retorno
Resolvida
Cancelada
```

Priority:

```text
low
medium
high
critical
```

Labels de UI:

```text
Baixa
Média
Alta
Crítica
```

### Category

Campos:

```text
id
name
description
active
created_at
updated_at
```

### AuditLog

Campos:

```text
id
auditable_type
auditable_id
user_id
action
old_values
new_values
metadata
created_at
```

Ações esperadas:

```text
request_created
request_updated
status_changed
priority_changed
assignee_changed
request_resolved
request_cancelled
category_created
category_updated
user_created
user_updated
```

## 3. Permissions

Arquivo: `docs/specs/03-permissions.md`

Criar matriz de permissões:

| Ação | Admin | Manager | Operator | Viewer |
|---|---:|---:|---:|---:|
| Ver dashboard | Sim | Sim | Sim | Sim |
| Criar solicitação | Sim | Sim | Sim | Sim |
| Ver todas as solicitações | Sim | Sim | Sim | Sim |
| Editar qualquer solicitação | Sim | Sim | Não | Não |
| Editar solicitação atribuída | Sim | Sim | Sim | Não |
| Alterar status | Sim | Sim | Sim se atribuída | Não |
| Atribuir responsável | Sim | Sim | Não | Não |
| Gerenciar categorias | Sim | Sim | Não | Não |
| Gerenciar usuários | Sim | Não | Não | Não |
| Ver auditoria completa | Sim | Sim | Não | Não |
| Exportar CSV | Sim | Sim | Sim | Não |
| Importar CSV | Sim | Sim | Não | Não |

Definir que permissões devem ser implementadas no backend por policies/gates/middleware, e refletidas no frontend apenas como UX, não como segurança.

## 4. API overview

Arquivo: `docs/specs/04-api-overview.md`

Listar endpoints planejados:

```text
GET /api/me
POST /login
POST /logout
GET /sanctum/csrf-cookie

GET /api/dashboard
GET /api/requests
POST /api/requests
GET /api/requests/{id}
PUT /api/requests/{id}
PATCH /api/requests/{id}/status
PATCH /api/requests/{id}/assign
POST /api/requests/{id}/cancel
POST /api/requests/{id}/resolve

GET /api/categories
POST /api/categories
PUT /api/categories/{id}

GET /api/users
POST /api/users
PUT /api/users/{id}

GET /api/audit-logs
GET /api/requests/export
POST /api/categories/import
```

Observação: ajustar nomes finais conforme Laravel conventions, mas manter clareza REST.

## 5. Frontend overview

Arquivo: `docs/specs/05-frontend-overview.md`

Definir telas:

```text
Login
Dashboard
Solicitações - listagem
Solicitações - detalhe
Solicitações - criação/edição
Categorias
Usuários
Auditoria
Configurações/perfil simples
```

Definir UX:

- layout interno com sidebar/topbar;
- cards de KPIs;
- tabelas com filtros e paginação;
- feedbacks de loading/erro/sucesso;
- estados vazios;
- tratamento de 401/403/419;
- UI em português;
- Angular Material atual, se viável.

## 6. Decision records

Criar ADRs simples:

### `0002-domain-scope.md`

Explicar por que o domínio escolhido é gestão de solicitações operacionais, e não CRM, ERP, sistema de cuidados ou todo app.

### `0003-postgresql.md`

Explicar escolha do PostgreSQL:

- banco relacional robusto;
- boa aderência a Docker;
- demonstra amplitude além de MySQL;
- adequado a sistemas operacionais internos.

### `0004-sanctum-spa-auth.md`

Explicar escolha de Sanctum SPA auth:

- autenticação first-party SPA;
- cookie/session/CSRF;
- evita armazenar token no browser;
- mais adequado que JWT simples para SPA própria com Laravel.

## Validação

Ao final:

1. Liste os documentos criados.
2. Destaque qualquer decisão que precise ser revisada antes da implementação.
3. Não implemente código ainda, exceto ajustes pequenos de documentação.

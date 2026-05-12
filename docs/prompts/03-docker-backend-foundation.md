# Prompt 03 — Docker local e fundação backend Laravel 13 + PostgreSQL

Continue no projeto **OpsBoard**.

Agora implemente a fundação técnica do backend e do ambiente Docker local.

## Objetivo

Criar a base backend em Laravel 13 com PostgreSQL, Docker Compose e configuração local reproduzível.

## Regras importantes

- Consulte a documentação oficial do Laravel 13 antes de usar comandos ou estrutura específicos:
  - https://laravel.com/docs/13.x
- Use Laravel 13 se disponível.
- Se Laravel 13 não estiver disponível no ambiente, registre a limitação e use a versão estável mais recente disponível, sem inventar APIs.
- Não implemente ainda todas as regras de negócio.
- Priorize uma fundação limpa.

## Estrutura esperada

```text
backend/
  app/
  bootstrap/
  config/
  database/
  routes/
  tests/
frontend/
docs/
docker/
docker-compose.yml
```

## Tarefas

### 1. Criar backend Laravel

Dentro de `backend/`, criar aplicação Laravel.

Configurar `.env.example` do backend para PostgreSQL.

Variáveis esperadas:

```env
APP_NAME=OpsBoard
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:4200

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=opsboard
DB_USERNAME=opsboard
DB_PASSWORD=opsboard

SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:4200,127.0.0.1:4200
```

Ajustar conforme necessidade real do Laravel/Sanctum.

### 2. Docker Compose

Criar `docker-compose.yml` na raiz com serviços:

```text
postgres
backend
frontend
```

Nesta etapa, se o frontend ainda não existir, pode deixar serviço frontend planejado/comentado ou criar de modo básico no próximo prompt. Escolha a opção mais simples e funcional.

Serviço `postgres`:

- image PostgreSQL estável;
- database `opsboard`;
- user `opsboard`;
- password `opsboard`;
- volume persistente;
- healthcheck.

Serviço `backend`:

- PHP adequado ao Laravel 13;
- composer;
- porta local `8000`;
- volume para `backend/`;
- depende de `postgres`.

Pode usar Dockerfile em `docker/backend/Dockerfile` ou `backend/Dockerfile`, desde que documente.

### 3. Configuração Laravel

Configurar conexão PostgreSQL.

Rodar/validar:

```bash
php artisan key:generate
php artisan migrate
```

Se estiver dentro de Docker, documentar o comando correto.

### 4. Criar endpoint healthcheck

Criar rota simples:

```text
GET /api/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "app": "OpsBoard"
}
```

### 5. Criar migrations iniciais

Preparar migrations para:

```text
users
categories
operational_requests
audit_logs
```

Pode manter colunas padrão úteis do Laravel, como `remember_token`, se aplicável.

Campos mínimos:

#### users

```text
id
name
email unique
password
role
active boolean default true
email_verified_at nullable
remember_token nullable
timestamps
```

#### categories

```text
id
name
description nullable
active boolean default true
timestamps
```

#### operational_requests

```text
id
title
description text
category_id foreign
status string
priority string
requester_id foreign users
assignee_id foreign users nullable
due_date nullable
resolved_at nullable
cancelled_at nullable
timestamps
```

#### audit_logs

```text
id
auditable_type
auditable_id
user_id nullable foreign users
action string
old_values json nullable
new_values json nullable
metadata json nullable
created_at
```

### 6. Models e relações

Criar models:

```text
User
Category
OperationalRequest
AuditLog
```

Relações esperadas:

- OperationalRequest belongsTo Category
- OperationalRequest belongsTo requester User
- OperationalRequest belongsTo assignee User nullable
- AuditLog belongsTo User nullable
- AuditLog morph-like via auditable_type/auditable_id ou implementação simples equivalente

### 7. Seeders básicos

Criar seeders para:

- usuários por role;
- categorias;
- solicitações fictícias.

Usuários sugeridos:

```text
admin@opsboard.test / password
manager@opsboard.test / password
operator@opsboard.test / password
viewer@opsboard.test / password
```

Use senha padrão documentada apenas para ambiente local.

### 8. README parcial

Atualizar README com:

- setup Docker local;
- comandos de backend;
- credenciais seedadas;
- endpoint healthcheck.

## Validação

Executar, se possível:

```bash
docker compose up -d
docker compose ps
docker compose exec backend php artisan migrate:fresh --seed
curl http://localhost:8000/api/health
```

Também execute testes se existirem:

```bash
docker compose exec backend php artisan test
```

## Entrega esperada

Ao final, informe:

1. Arquivos criados/alterados.
2. Como subir o ambiente.
3. Como rodar migrations/seeders.
4. Resultado da validação.
5. Pendências para o próximo prompt.

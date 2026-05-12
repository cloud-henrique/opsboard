# Prompt 05 — Backend core: solicitações, permissões, auditoria, dashboard

Continue no projeto **OpsBoard**.

Agora implemente o núcleo funcional do backend: solicitações operacionais, categorias, usuários, permissões, auditoria e dashboard.

## Objetivo

Criar uma API REST documentada e testável para o domínio principal do OpsBoard.

## Regras gerais

- Código/API em inglês.
- UI labels podem ser preparados em português, mas responses devem ser consistentes.
- Segurança no backend via policies/gates/middleware.
- Frontend nunca deve ser a única barreira de permissão.
- Evite overengineering.
- Use Form Requests para validação quando fizer sentido.
- Use API Resources para responses se isso melhorar consistência.
- Use pagination nativa do Laravel para listagens.
- Use enums nativos do PHP se adequado e suportado pela versão usada.
- Consulte a documentação do Laravel 13 quando houver dúvida.

## Entidades

Já devem existir:

```text
User
Category
OperationalRequest
AuditLog
```

Se necessário, ajuste migrations/models sem quebrar o escopo documentado.

## Endpoints principais

### Dashboard

```text
GET /api/dashboard
```

Retornar:

```json
{
  "total_requests": 120,
  "open_requests": 32,
  "in_progress_requests": 18,
  "overdue_requests": 7,
  "resolved_this_month": 41,
  "average_resolution_hours": 36.5,
  "by_status": [...],
  "by_priority": [...]
}
```

Pode calcular de forma simples, mas correta.

### Requests

```text
GET /api/requests
POST /api/requests
GET /api/requests/{request}
PUT /api/requests/{request}
PATCH /api/requests/{request}/status
PATCH /api/requests/{request}/assign
POST /api/requests/{request}/resolve
POST /api/requests/{request}/cancel
```

Listagem deve suportar:

```text
search
status
priority
category_id
assignee_id
requester_id
date_from
date_to
page
per_page
sort
direction
```

Limite `per_page` para evitar abuso.

### Categories

```text
GET /api/categories
POST /api/categories
PUT /api/categories/{category}
```

Não deletar fisicamente. Preferir `active=false`.

### Users

```text
GET /api/users
POST /api/users
PUT /api/users/{user}
```

Não deletar fisicamente. Preferir `active=false`.

### Audit logs

```text
GET /api/audit-logs
GET /api/requests/{request}/audit-logs
```

## Permissões

Implementar conforme matriz:

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

Use policies e/ou gates.

## Auditoria

Criar um serviço simples, por exemplo:

```text
AuditLogger
```

Registrar logs ao:

- criar solicitação;
- atualizar solicitação;
- alterar status;
- alterar prioridade;
- alterar responsável;
- resolver solicitação;
- cancelar solicitação;
- criar/atualizar categoria;
- criar/atualizar usuário.

Não precisa ser um pacote externo.

`old_values`, `new_values` e `metadata` devem ser JSON.

## Regras de negócio mínimas

- Solicitação resolvida deve preencher `resolved_at`.
- Solicitação cancelada deve preencher `cancelled_at`.
- Solicitação cancelada não deve ser editável por operador.
- Viewer não cria, edita nem exporta.
- Operator só altera solicitações atribuídas a ele, exceto criação.
- `due_date` pode ser nulo.
- `overdue` = não resolvida/cancelada e `due_date < now`.

## Validação

Criar validações para:

- title obrigatório, tamanho razoável;
- description obrigatório;
- category ativa;
- status válido;
- priority válida;
- assignee existente e ativo;
- role válido;
- email único.

## Testes básicos

Criar testes cobrindo:

- listagem autenticada;
- criação de solicitação;
- validação de payload inválido;
- manager atribui responsável;
- operator não atribui responsável;
- operator altera status de solicitação atribuída;
- viewer não cria solicitação;
- auditoria é registrada ao alterar status;
- dashboard retorna estrutura esperada.

## Documentação

Atualizar:

```text
docs/specs/04-api-overview.md
docs/specs/03-permissions.md
README.md
```

Criar ou atualizar:

```text
docs/api/backend-endpoints.md
```

Documentar endpoints, payloads e exemplos.

## Validação

Rodar:

```bash
docker compose exec backend php artisan migrate:fresh --seed
docker compose exec backend php artisan test
```

Se possível, testar alguns endpoints via curl/http client.

## Entrega esperada

Informe:

1. Arquivos alterados.
2. Endpoints implementados.
3. Como permissões foram implementadas.
4. Como auditoria foi implementada.
5. Resultado dos testes.
6. Pendências para integração frontend.

# Prompt 07 — Frontend: dashboard, solicitações, categorias, usuários e auditoria

Continue no projeto **OpsBoard**.

Agora implemente as telas principais do frontend usando a API Laravel já existente.

## Objetivo

Criar uma UI funcional e demonstrável para o OpsBoard: dashboard de KPIs, listagem/detalhe/formulário de solicitações, categorias, usuários e auditoria.

## Regras

- Interface em português.
- Código em inglês.
- Angular Material atual.
- Componentes simples, legíveis e bem separados.
- Sem NgRx.
- Use services por feature.
- Use tipagem forte para DTOs/interfaces.
- Trate loading, erro, vazio e sucesso.
- Permissões no frontend são UX; segurança real já está no backend.
- Evite telas enormes sem componentes auxiliares.

## Telas

### 1. Dashboard

Rota:

```text
/app/dashboard
```

Consumir:

```text
GET /api/dashboard
```

Mostrar cards:

- Total de solicitações;
- Abertas;
- Em andamento;
- Vencidas;
- Resolvidas no mês;
- Tempo médio de resolução.

Adicionar uma visualização simples por status/prioridade, sem precisar de biblioteca de gráficos se isso adicionar complexidade. Pode usar cards/listas/barras CSS simples.

### 2. Solicitações — listagem

Rota:

```text
/app/requests
```

Funcionalidades:

- tabela Angular Material;
- paginação;
- filtros:
  - busca;
  - status;
  - prioridade;
  - categoria;
  - responsável;
  - período;
- botão “Nova solicitação”;
- ação “Ver detalhes”;
- ação “Editar” quando permitido;
- ação “Exportar CSV” quando permitido.

Status labels:

```text
Aberta
Em análise
Em andamento
Aguardando retorno
Resolvida
Cancelada
```

Priority labels:

```text
Baixa
Média
Alta
Crítica
```

### 3. Solicitações — criação/edição

Rotas:

```text
/app/requests/new
/app/requests/:id/edit
```

Campos:

- título;
- descrição;
- categoria;
- prioridade;
- responsável;
- prazo.

Validação visual:

- obrigatórios;
- mensagens claras;
- feedback de sucesso/erro.

### 4. Solicitações — detalhe

Rota:

```text
/app/requests/:id
```

Mostrar:

- dados principais;
- status;
- prioridade;
- categoria;
- solicitante;
- responsável;
- prazo;
- datas;
- ações permitidas:
  - alterar status;
  - atribuir responsável;
  - resolver;
  - cancelar;
- timeline de auditoria da solicitação.

### 5. Categorias

Rota:

```text
/app/categories
```

Funcionalidades:

- listagem;
- criação;
- edição;
- ativar/desativar;
- import CSV se endpoint já estiver pronto ou deixar botão desabilitado com aviso até o próximo prompt.

### 6. Usuários

Rota:

```text
/app/users
```

Acesso sugerido: admin.

Funcionalidades:

- listagem;
- criação;
- edição;
- ativar/desativar;
- role.

### 7. Auditoria

Rota:

```text
/app/audit-logs
```

Funcionalidades:

- listagem;
- filtros por ação, usuário, período;
- mostrar old/new values de forma legível, sem exagero.

## Models/interfaces frontend

Criar interfaces:

```text
User
Category
OperationalRequest
AuditLog
DashboardMetrics
PaginatedResponse<T>
```

## Services

Criar services:

```text
DashboardService
RequestsService
CategoriesService
UsersService
AuditLogsService
```

## Permissões na UI

Criar helper/service simples:

```text
PermissionService
```

Baseado no role do usuário autenticado.

Não duplicar regras complexas demais. Apenas controlar visibilidade de botões/rotas.

## Tratamento de erros

Padronizar:

- 401: redirecionar login;
- 403: mostrar mensagem de permissão;
- 419: sessão expirada;
- 422: mostrar erros de validação;
- 500: mensagem genérica.

## UX

Incluir:

- skeleton/loading simples;
- mensagens de estado vazio;
- snackbar/toast do Angular Material;
- confirmação antes de cancelar/resolver;
- responsividade básica.

## Documentação

Atualizar:

```text
docs/specs/05-frontend-overview.md
README.md
```

Adicionar screenshots placeholder em `docs/screenshots/README.md` explicando quais telas devem ser capturadas depois.

## Validação

Executar:

```bash
cd frontend
npm run build
npm run test
```

Se ainda não houver testes frontend úteis, criar ao menos testes básicos de services ou componentes principais, conforme setup da versão Angular.

Validar manualmente com backend:

1. Login.
2. Dashboard carrega.
3. Listagem de solicitações carrega.
4. Criar solicitação.
5. Editar solicitação.
6. Alterar status.
7. Ver auditoria.
8. Testar usuário viewer e confirmar botões restritos.

## Entrega esperada

Informe:

1. Telas implementadas.
2. Services criados.
3. Regras de permissão na UI.
4. Resultado de build/testes.
5. Pontos pendentes.

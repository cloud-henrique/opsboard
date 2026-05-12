# Prompt 04 — Autenticação com Laravel Sanctum SPA auth

Continue no projeto **OpsBoard**.

Agora implemente autenticação first-party SPA com Laravel Sanctum, usando cookies/sessão/CSRF.

## Objetivo

Configurar autenticação segura entre Angular SPA e Laravel API usando Sanctum SPA authentication.

## Documentação obrigatória

Antes de implementar, consulte:

- https://laravel.com/docs/13.x/sanctum
- https://laravel.com/docs/13.x/authentication
- https://laravel.com/docs/13.x/csrf
- https://laravel.com/docs/13.x/cors

## Regras

- Não usar JWT.
- Não armazenar access token no localStorage.
- Usar fluxo Sanctum SPA:
  1. frontend chama `/sanctum/csrf-cookie`;
  2. frontend faz `POST /login`;
  3. Laravel cria sessão;
  4. chamadas autenticadas usam cookies e CSRF;
  5. logout por `POST /logout`.
- Tratar erros 401, 403 e 419 no backend e futuramente no frontend.
- Rotas protegidas devem usar `auth:sanctum`.
- Política de segurança real fica no backend.

## Tarefas backend

### 1. Instalar/configurar Sanctum

Se necessário:

```bash
php artisan install:api
```

ou o fluxo atual recomendado pela documentação do Laravel 13.

Configurar:

- stateful domains;
- CORS com credentials;
- session/cookie domain para local;
- middleware necessário.

### 2. Criar endpoints de autenticação

Criar endpoints:

```text
POST /login
POST /logout
GET /api/me
```

Login recebe:

```json
{
  "email": "admin@opsboard.test",
  "password": "password"
}
```

Resposta de login:

```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@opsboard.test",
    "role": "admin"
  }
}
```

`GET /api/me` deve retornar usuário autenticado.

`POST /logout` deve encerrar sessão.

### 3. Validação

Criar Form Request ou validação clara para login.

Não retornar detalhes excessivos sobre credenciais inválidas.

Mensagem genérica:

```text
Credenciais inválidas.
```

### 4. Proteção de rotas

Proteger rotas futuras e criar uma rota teste:

```text
GET /api/protected-health
```

middleware:

```text
auth:sanctum
```

### 5. Testes backend

Criar testes de autenticação:

- usuário consegue fazer login com credenciais válidas;
- login falha com senha inválida;
- usuário autenticado consegue acessar `/api/me`;
- usuário não autenticado recebe 401 em rota protegida;
- logout invalida sessão.

Use o padrão de testes recomendado pelo Laravel 13. Pode usar Pest ou PHPUnit, conforme o projeto estiver configurado. Não misture sem necessidade.

### 6. Documentação

Atualizar:

```text
docs/specs/04-api-overview.md
docs/decisions/0004-sanctum-spa-auth.md
README.md
```

Documentar fluxo local de auth:

```text
GET /sanctum/csrf-cookie
POST /login
GET /api/me
POST /logout
```

## Validação manual esperada

Se possível, validar com curl ou ferramenta HTTP respeitando cookies/CSRF. Se for trabalhoso via curl, documente como testar no frontend posteriormente.

Rodar:

```bash
docker compose exec backend php artisan test
```

## Entrega esperada

Ao final, informe:

1. Arquivos alterados.
2. Como autenticação foi configurada.
3. Como testar login.
4. Resultado dos testes.
5. Pontos de atenção para integração Angular.

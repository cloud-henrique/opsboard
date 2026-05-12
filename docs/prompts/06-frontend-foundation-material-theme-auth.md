# Prompt 06 — Frontend Angular atual + Angular Material MD3 + tema + autenticação

Continue no projeto **OpsBoard**.

Agora implemente a fundação frontend em Angular atual, mirando Angular 21 se disponível, com Angular Material atual, theming customizado e integração inicial com auth via Sanctum SPA.

## Objetivo

Criar uma SPA Angular moderna, limpa e bem estruturada, com layout autenticado, tema visual próprio e fluxo de login/logout integrado ao Laravel Sanctum.

## Documentação obrigatória

Antes de implementar, consulte:

- https://angular.dev
- https://angular.dev/tools/cli
- https://material.angular.dev
- https://laravel.com/docs/13.x/sanctum

Se Angular 21 ou a versão exata desejada não estiver disponível no ambiente, registre a limitação e use a versão estável mais recente disponível. Não invente APIs.

## Decisões

- Interface em português.
- Código em inglês.
- Angular standalone APIs se forem o padrão recomendado da versão instalada.
- Angular Material atual com Material Design 3, se viável.
- Theming customizado com SCSS/design tokens, se suportado.
- Usar HTTP client atual recomendado pelo Angular.
- Usar interceptors atuais recomendados pela versão.
- Não usar NgRx. Estado simples com services/signals/RxJS conforme adequado.
- Não adicionar Tailwind ao frontend se Angular Material + SCSS forem suficientes.
- Não usar localStorage para autenticação.

## Paleta visual

Use como norte:

```text
Terracota/cobre: #A94726
Laranja queimado: #C65A2E
Marrom avermelhado: #6E2D1D
Grafite: #15171C
Off-white: #F4E8DE
```

Direção visual:

- clean;
- painel operacional;
- confiável;
- sóbrio;
- profissional;
- pouca animação;
- bom contraste;
- responsivo.

## Estrutura sugerida

Se fizer sentido para Angular atual:

```text
frontend/src/app/
  core/
    auth/
    http/
    layout/
  shared/
    components/
    pipes/
    utils/
  features/
    auth/
      login/
    dashboard/
    requests/
    categories/
    users/
    audit-logs/
  app.routes.ts
  app.config.ts
```

Ajuste conforme padrões atuais do Angular.

## Tarefas

### 1. Criar app Angular

Criar frontend dentro de `frontend/`.

Usar Angular CLI atual.

Configurações desejadas:

- routing;
- SCSS;
- strict mode;
- standalone se padrão;
- sem SSR, salvo se vier por padrão e fizer sentido. Para painel interno, SPA simples é suficiente.

### 2. Instalar/configurar Angular Material

Instalar Angular Material atual.

Configurar tema customizado com Material Design 3 se a versão suportar.

Se não for trivial, implementar tema inicial limpo e documentar pendência.

Criar:

```text
src/styles.scss
src/theme/
```

ou estrutura equivalente.

### 3. Configurar ambientes

Criar environment para API URL:

```text
apiUrl: 'http://localhost:8000'
```

ou usar proxy/dev config se preferir.

### 4. Auth service

Criar serviço de autenticação:

```text
AuthService
```

Responsabilidades:

- `csrf()`
- `login(credentials)`
- `logout()`
- `loadCurrentUser()`
- estado de usuário autenticado;
- role atual;
- helpers como `isAuthenticated`, `hasRole`.

Sanctum flow:

1. `GET /sanctum/csrf-cookie`
2. `POST /login`
3. `GET /api/me`

As requisições devem enviar cookies/credentials conforme API Angular atual permitir.

### 5. HTTP configuration

Configurar HTTP client para:

- enviar credentials;
- tratar base URL;
- tratar erros 401/403/419;
- se 419, indicar sessão expirada e redirecionar para login.

Use interceptors atuais do Angular, conforme documentação.

### 6. Rotas

Criar rotas:

```text
/login
/app/dashboard
/app/requests
/app/requests/new
/app/requests/:id
/app/categories
/app/users
/app/audit-logs
```

Criar guard de auth.

Criar guard simples de role se necessário para users/audit.

### 7. Layout autenticado

Criar layout com:

- topbar;
- sidebar;
- botão logout;
- nome/role do usuário;
- navegação para dashboard, solicitações, categorias, usuários, auditoria.

Usar Angular Material components.

### 8. Login page

Tela de login:

- email;
- senha;
- submit;
- loading;
- erro de credenciais;
- credenciais demo visíveis em bloco discreto.

Credenciais demo:

```text
admin@opsboard.test / password
manager@opsboard.test / password
operator@opsboard.test / password
viewer@opsboard.test / password
```

### 9. Docker frontend

Atualizar Docker Compose se necessário para rodar frontend em:

```text
http://localhost:4200
```

Garantir comunicação com backend em:

```text
http://localhost:8000
```

### 10. Documentação

Atualizar README:

- como rodar frontend;
- como acessar login;
- credenciais demo;
- observações sobre Sanctum/CORS/cookies.

Atualizar AGENTS.md se padrões frontend forem definidos.

## Validação

Executar:

```bash
cd frontend
npm run build
npm run test
```

ou comandos equivalentes reais.

Validar manualmente:

1. subir backend e frontend;
2. acessar `/login`;
3. chamar login com usuário seedado;
4. navegar para dashboard vazio/provisório;
5. logout.

## Entrega esperada

Informe:

1. Versão Angular instalada.
2. Versão Angular Material instalada.
3. Como o tema foi configurado.
4. Como auth/Sanctum foi integrado.
5. Arquivos alterados.
6. Resultado de build/testes.
7. Pendências.

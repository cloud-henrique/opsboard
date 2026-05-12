# Prompt 09 — README forte, screenshots, polimento visual e documentação de decisões

Continue no projeto **OpsBoard**.

Agora trate o projeto como um case de portfólio. O objetivo é deixar o repositório apresentável para GitHub, LinkedIn e portfólio pessoal.

## Objetivo

Criar um README forte, documentação técnica curta e polimento visual suficiente para o projeto comunicar maturidade.

## Tarefas

### 1. README principal

Reescrever/expandir `README.md` da raiz com:

```text
# OpsBoard — Painel Operacional Fullstack
```

Seções obrigatórias:

1. Visão geral.
2. Por que este projeto existe.
3. Funcionalidades.
4. Stack.
5. Arquitetura.
6. Screenshots.
7. Como rodar localmente.
8. Credenciais demo.
9. Estrutura do repositório.
10. Documentação.
11. Decisões técnicas.
12. Testes.
13. Status do projeto.
14. Próximos passos.

Texto-base de visão geral:

```text
OpsBoard é uma aplicação fullstack demonstrativa para gestão de solicitações operacionais internas, criada para simular um sistema real de produto, com autenticação, dashboard, permissões, auditoria, filtros, CSV, API REST e ambiente Docker.
```

Stack:

```text
Frontend: Angular, Angular Material, TypeScript
Backend: Laravel, Sanctum, PHP
Database: PostgreSQL
Infra: Docker Compose
Workflow: documentação técnica, testes básicos e decisões arquiteturais registradas
```

### 2. Screenshots

Criar pasta:

```text
docs/screenshots/
```

Se ainda não houver screenshots reais, criar `docs/screenshots/README.md` listando screenshots esperados:

```text
01-login.png
02-dashboard.png
03-requests-list.png
04-request-detail.png
05-categories-import.png
06-audit-logs.png
```

Se possível, gerar/capturar screenshots reais manualmente ou por ferramenta disponível. Se não for possível, deixar instrução clara no README.

### 3. Decision records

Garantir que existem ADRs em:

```text
docs/decisions/
```

Pelo menos:

```text
0001-monorepo-simple.md
0002-domain-scope.md
0003-postgresql.md
0004-sanctum-spa-auth.md
0005-angular-material-theme.md
0006-audit-logs.md
```

Criar os que faltarem.

### 4. Visual polish

Revisar UI:

- espaçamentos;
- contraste;
- responsividade;
- estados vazios;
- loading states;
- labels em português;
- consistência de botões;
- consistência de status/prioridade;
- tema customizado;
- login demo;
- sidebar/topbar.

Não fazer redesign exagerado. O foco é confiabilidade e clareza.

### 5. SEO/meta simples

Se fizer sentido para a SPA:

- título da aplicação;
- favicon simples;
- nome OpsBoard no browser;
- descrição em README.

### 6. GitHub topics sugeridos

Adicionar no README uma sugestão de topics para o repositório:

```text
angular
laravel
postgresql
docker
sanctum
fullstack
operational-dashboard
portfolio-project
```

### 7. Projeto no portfólio

Criar uma seção no README com texto pronto para usar no portfólio:

```text
OpsBoard — Painel operacional fullstack

Sistema demonstrativo para gestão de solicitações internas, com autenticação, dashboard de KPIs, permissões por papel, auditoria de alterações, filtros avançados, import/export CSV, API REST documentada e ambiente Docker.

Atuação: concepção de produto, arquitetura fullstack, implementação, documentação técnica e decisões orientadas à manutenção real.

Stack: Angular / Laravel / PostgreSQL / Docker
```

## Validação

Executar:

```bash
docker compose up -d
docker compose exec backend php artisan test
cd frontend && npm run build
```

Também revisar manualmente:

- README sem instruções falsas;
- links funcionando;
- screenshots referenciados existem ou estão marcados como pendentes;
- credenciais demo funcionam;
- documentação não promete features inexistentes.

## Entrega esperada

Informe:

1. README atualizado.
2. ADRs criadas/ajustadas.
3. Polimentos visuais realizados.
4. Status das screenshots.
5. Resultado das validações.
6. Texto final para o card do portfólio.

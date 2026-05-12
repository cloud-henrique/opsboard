# Prompt 10 — Auditoria final, hardening e preparação para publicação no GitHub/portfólio

Continue no projeto **OpsBoard**.

Agora faça uma auditoria final do projeto antes de considerá-lo pronto para ser exibido no GitHub e no portfólio.

## Objetivo

Encontrar inconsistências, problemas de segurança, falhas de documentação, links quebrados, bugs óbvios, comandos quebrados e desalinhamentos com o posicionamento profissional do projeto.

## Escopo da revisão

### 1. Segurança básica

Verificar:

- `.env` não commitado;
- `.env.example` suficiente;
- credenciais demo apenas em seed/local;
- Sanctum sem token em localStorage;
- rotas protegidas por `auth:sanctum`;
- permissões relevantes no backend;
- CORS restrito ao necessário para local;
- validações server-side;
- erros sem stack trace em produção;
- senhas com hashing adequado;
- mass assignment controlado.

### 2. Backend

Verificar:

- migrations consistentes;
- seeders idempotentes ou previsíveis;
- factories, se houver;
- policies/gates aplicadas;
- controllers sem lógica excessiva;
- services quando fizer sentido;
- Form Requests;
- API Resources;
- paginação;
- filtros;
- testes cobrindo o mínimo essencial.

### 3. Frontend

Verificar:

- build limpo;
- rotas protegidas;
- tratamento de 401/403/419;
- loading states;
- estados vazios;
- feedbacks de erro/sucesso;
- responsividade;
- acessibilidade básica;
- contraste;
- labels em português;
- nenhum segredo no frontend;
- nenhuma URL hardcoded indevida.

### 4. Docker

Verificar:

- `docker compose up` funciona;
- containers sobem em ordem;
- healthcheck do PostgreSQL;
- backend conecta no banco;
- frontend acessa backend;
- instruções do README batem com a realidade;
- volumes e portas documentados.

### 5. Documentação

Verificar:

- README principal;
- AGENTS.md;
- docs/specs;
- docs/decisions;
- docs/api;
- docs/screenshots;
- texto para portfólio;
- status real do projeto;
- não prometer funcionalidades inexistentes.

### 6. GitHub readiness

Sugerir melhorias para:

- descrição do repositório;
- topics;
- pinned repo;
- README visual;
- screenshots;
- link do portfólio;
- licença, se fizer sentido.

Descrição sugerida do repo:

```text
Fullstack operational dashboard built with Angular, Laravel, PostgreSQL and Docker.
```

Topics sugeridos:

```text
angular
laravel
postgresql
docker
sanctum
fullstack
dashboard
portfolio-project
```

### 7. Portfólio readiness

Verificar se o projeto sustenta o texto:

```text
Sistema demonstrativo para gestão de solicitações internas, com autenticação, dashboard de KPIs, permissões por papel, auditoria de alterações, filtros avançados, import/export CSV, API REST documentada e ambiente Docker.
```

Se algo do texto não estiver implementado, ajustar texto ou implementar o mínimo necessário.

## Comandos obrigatórios

Executar:

```bash
docker compose down
docker compose up -d --build
docker compose ps
docker compose exec backend php artisan migrate:fresh --seed
docker compose exec backend php artisan test
cd frontend && npm run build
cd frontend && npm run test
```

Se algum comando não existir ou falhar por configuração, documentar exatamente:

- comando;
- erro;
- causa provável;
- correção sugerida;
- se bloqueia ou não a publicação.

## Revisão final de produto

Responder:

1. O projeto parece um sistema real ou ainda parece CRUD genérico?
2. O dashboard ajuda a entender o produto?
3. As permissões fazem sentido?
4. A auditoria está visível e útil?
5. O README é suficiente para um recrutador/dev entender o projeto?
6. O projeto comunica Angular/Laravel/PostgreSQL/Docker?
7. O projeto comunica product engineering e manutenção real?
8. O projeto está pronto para ser fixado no GitHub?

## Entrega esperada

Gerar relatório final em:

```text
docs/final-audit.md
```

Com seções:

```text
Resumo
Validações executadas
Problemas encontrados
Correções aplicadas
Pendências
Recomendações futuras
Status final
```

Também responder no chat com:

1. status geral;
2. comandos executados;
3. resultado;
4. pendências;
5. recomendação: publicar ou não publicar ainda.

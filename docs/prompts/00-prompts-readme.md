# OpsBoard — prompts para Codex

Este pacote contém uma sequência de prompts para criar o projeto **OpsBoard — Painel Operacional Fullstack** em blocos.

## Decisões-base

- Arquitetura: monorepo simples, sem Turborepo.
- Frontend: Angular atual, mirando Angular 21 se disponível no ambiente/npm.
- Backend: Laravel 13.
- Banco: PostgreSQL.
- Auth: Laravel Sanctum com SPA authentication baseada em cookies/sessão/CSRF.
- UI: Angular Material atual com Material Design 3 e theming próprio, desde que seja viável com a versão instalada.
- Interface: português.
- Código/API/documentação técnica interna: inglês, salvo textos de UI.
- Deploy: somente Docker local + README, sem VPS.
- Objetivo: projeto demonstrativo para portfólio, com foco em produto, operação, manutenção real, documentação e boas práticas.

## Como usar

Rode os prompts em ordem. Não pule o Prompt 01, pois ele cria a fundação, o `AGENTS.md` e as regras para as próximas sessões.

Sequência recomendada:

1. `01-bootstrap-monorepo-agents.md`
2. `02-product-specs-domain-model.md`
3. `03-docker-backend-foundation.md`
4. `04-auth-sanctum-spa.md`
5. `05-backend-core-requests-permissions-audit.md`
6. `06-frontend-foundation-material-theme-auth.md`
7. `07-frontend-requests-dashboard.md`
8. `08-csv-api-docs-tests.md`
9. `09-readme-screenshots-polish.md`
10. `10-final-audit-hardening.md`

## Observação

Os prompts instruem o Codex a consultar a documentação oficial atual antes de aplicar decisões que dependam de versão:

- Angular: https://angular.dev
- Angular Material: https://material.angular.dev
- Laravel 13: https://laravel.com/docs/13.x
- Laravel Sanctum: https://laravel.com/docs/13.x/sanctum

Se alguma versão ainda não estiver disponível no ambiente, o Codex deve registrar a limitação e usar a versão estável mais recente disponível, sem inventar APIs.

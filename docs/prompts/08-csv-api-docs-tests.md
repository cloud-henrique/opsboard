# Prompt 08 — CSV, documentação de API, testes e consistência

Continue no projeto **OpsBoard**.

Agora implemente recursos complementares que aumentam a maturidade técnica do projeto: export/import CSV, documentação de API, testes adicionais e consistência geral.

## Objetivo

Adicionar funcionalidades de portfólio que demonstrem cuidado com operação real: exportação, importação, documentação e testes.

## Escopo

### CSV

Implementar:

```text
GET /api/requests/export
POST /api/categories/import
```

Regras:

- Export CSV deve respeitar filtros aplicados à listagem de solicitações.
- Import CSV de categorias deve validar linhas e retornar resumo.
- Não importar solicitações neste momento para evitar escopo excessivo.
- Responder erros de validação de forma clara.
- Proteger por permissão:
  - export: admin, manager, operator;
  - import: admin, manager.

## Export CSV de solicitações

Colunas sugeridas:

```text
ID
Título
Status
Prioridade
Categoria
Solicitante
Responsável
Prazo
Criada em
Resolvida em
Cancelada em
```

O endpoint deve retornar arquivo CSV com headers adequados.

## Import CSV de categorias

Formato esperado:

```csv
name,description,active
Financeiro,Solicitações financeiras,1
RH,Solicitações de recursos humanos,1
```

Regras:

- `name` obrigatório;
- `active` aceita `1/0`, `true/false`, vazio default true;
- se categoria existir, atualizar ou ignorar? Escolha uma abordagem simples e documente.
- Minha preferência: atualizar categoria existente pelo nome e criar se não existir.

Resposta exemplo:

```json
{
  "created": 3,
  "updated": 2,
  "failed": 1,
  "errors": [
    {
      "row": 4,
      "message": "Name is required."
    }
  ]
}
```

## Frontend CSV

Adicionar na UI:

- botão Exportar CSV na listagem de solicitações;
- botão Importar CSV na tela de categorias;
- input de arquivo;
- feedback de sucesso/erro;
- instrução do formato esperado.

## Documentação de API

Criar/atualizar:

```text
docs/api/backend-endpoints.md
```

Incluir:

- auth flow;
- requests endpoints;
- categories endpoints;
- users endpoints;
- dashboard endpoint;
- audit endpoints;
- CSV endpoints;
- exemplos de payload;
- exemplos de resposta;
- códigos de erro comuns.

Opcional, se simples:

```text
docs/api/openapi.yaml
```

Só criar OpenAPI se conseguir manter simples e coerente. Não adicionar pacote pesado apenas para isso.

## Testes backend adicionais

Adicionar testes para:

- export CSV autorizado;
- viewer não exporta CSV;
- import CSV cria categorias;
- import CSV atualiza categorias;
- operator não importa CSV;
- filtros de requests funcionam;
- 403 em ações não autorizadas;
- auditoria registra ações relevantes.

## Testes frontend

Adicionar testes básicos possíveis:

- service de export chama endpoint correto;
- componente de listagem mostra estado vazio/loading;
- permissões escondem botões quando role não permite.

Se setup de testes frontend estiver pesado ou quebrado, documentar e priorizar build.

## Consistência de responses

Revisar responses da API:

- erros 422 consistentes;
- 403 claro;
- paginação consistente;
- resources consistentes;
- nomes de campos consistentes.

## Validação

Executar:

```bash
docker compose exec backend php artisan test
cd frontend && npm run build
cd frontend && npm run test
```

Também validar manualmente:

1. Exportar CSV como admin/manager/operator.
2. Tentar exportar como viewer.
3. Importar CSV de categorias como admin/manager.
4. Tentar importar como operator/viewer.
5. Conferir documentação.

## Entrega esperada

Informe:

1. Endpoints CSV implementados.
2. Como usar os CSVs.
3. Documentação criada/alterada.
4. Testes criados.
5. Resultado das validações.
6. Pendências.

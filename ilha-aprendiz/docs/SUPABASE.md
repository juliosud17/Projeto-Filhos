# Supabase — Ilha Aprendiz

*Criado na Fase 4.1 (2026-08-24). Referência operacional de ambientes,
variáveis, workflow local e contratos de segurança. Nunca contém valores
reais de chave ou token.*

## Projeto remoto

- **Plataforma:** Supabase (supabase.com)
- **Project ID / ref:** `jvvbjwsgxxsyreptpxrm`
- **Project name:** `ilha-aprendiz-prod`
- **Project URL:** `https://jvvbjwsgxxsyreptpxrm.supabase.co`
- **Ambiente de produção:** 1 único projeto remoto
- **Ambiente de desenvolvimento:** Supabase local via CLI (`npx supabase start`)

Não foi criado um segundo projeto remoto de staging — decisão registrada em
`docs/DECISOES.md`. Staging poderá ser criado futuramente se houver
necessidade real.

## Variáveis de ambiente

| Variável | Onde fica | Natureza |
|---|---|---|
| `VITE_SUPABASE_URL` | `.env.local` (dev) / GitHub Repository Variable (CI) | Pública — segura no bundle |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env.local` (dev) / GitHub Repository Variable (CI) | Pública — segura no bundle (publishable key, formato `sb_publishable_...`) |
| `SUPABASE_ACCESS_TOKEN` | Terminal / `npx supabase login` | **Secreto pessoal** — nunca em arquivo versionado, nunca em `.env.example`, nunca em variável `VITE_*` |

### Regras absolutas

- `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` são valores públicos
  do frontend — aparecem no bundle e isso é correto e intencional (design do
  Supabase). A segurança dos dados depende de RLS, não de esconder essas
  chaves.
- `service_role` / `secret` key **nunca** chega ao frontend nem a variáveis
  `VITE_*`, sob nenhuma circunstância.
- `SUPABASE_ACCESS_TOKEN` é um token pessoal de conta Supabase (gerado em
  app.supabase.com → Account → Access Tokens). Fica fora de qualquer arquivo
  do repositório. Para uso no CLI, autenticar via `npx supabase login` (o
  token é armazenado pelo CLI no perfil local da máquina, não no projeto).

### `.env.example`

Versionado na raiz de `ilha-aprendiz/` (Fase 4.2). Contém apenas os nomes
das variáveis, sem valores — é o contrato público de "o que este projeto
precisa":

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

O arquivo `.env.local` (com os valores reais) não é versionado — ver
`.gitignore` e `docs/DEV_SETUP.md` para instruções de preenchimento.

## Workflow local

### Pré-requisitos

- Docker em execução (necessário para `supabase start`)
- `npx supabase login` executado ao menos uma vez na máquina (autentica o
  CLI com o token pessoal — fora dos arquivos do projeto)
- Para trabalhar com o projeto remoto: `npx supabase link --project-ref <ref>`
  (ação humana, exige o Project ref do painel)

### Workflow local (requer Docker)

```bash
npm run db:start    # sobe Postgres + Studio local (porta 54323)
npm run db:status   # mostra URLs e status dos serviços locais
npm run db:reset    # recria o banco local do zero (replay de todas as migrations)
npm run db:stop     # para os containers locais
```

`db push` **não** é um script npm — operação de produção, deve ser executada
explicitamente como `npx supabase db push` após revisão local. Não existe
push automático em CI nesta fase.

### Vinculação ao projeto remoto

```bash
# Feito uma vez por máquina; o ref está no painel Supabase → Project Settings
npx supabase link --project-ref jvvbjwsgxxsyreptpxrm
```

### Primeiro arquivo de migration

`supabase/migrations/` existe no repositório mas está vazio — correto para
esta fase. Nenhuma tabela de domínio é criada aqui. O primeiro arquivo
nascerá quando a primeira migration real for necessária (Fase 5+):

```bash
npx supabase migration new <nome-descritivo>
# → cria supabase/migrations/<timestamp>_<nome>.sql
```

## Ciclo de migration (referência para fases futuras)

1. `npx supabase migration new <nome>` → cria arquivo SQL versionado
2. Editar o SQL (schema, RLS, policies)
3. `npm run db:reset` → valida localmente (recria do zero, replay de todas as migrations)
4. Revisar schema e diff
5. `npx supabase db push --dry-run` → confirma o que seria aplicado no remoto
6. Somente após revisão explícita: `npx supabase db push` → aplica no projeto remoto

**`npx supabase db push` aponta para o projeto remoto linkado (`ilha-aprendiz-prod`)
e deve ser tratado como operação de produção — nunca executar sem revisar
o `--dry-run` antes.**

Migrations são **código versionado** — nunca editar uma migration já commitada;
criar uma nova com a alteração desejada.

Auth e tabelas de domínio (`responsavel`, `crianca`, `progresso`) pertencem
às Fases 5–7, não a esta.

## Contrato de RLS (Row Level Security)

Toda tabela de domínio criada em fases futuras deve seguir este contrato:

- `ALTER TABLE <tabela> ENABLE ROW LEVEL SECURITY;` — obrigatório em todas
  as tabelas
- Nenhuma política `FOR ALL TO anon USING (true)` ou equivalente permissiva
  — a publishable key nunca concede leitura ou escrita a dados de aplicação
  diretamente
- Acesso a dados de aplicação só via políticas explícitas com usuário
  autenticado (Fase 5+)
- A segurança será testada concretamente quando houver tabelas reais nas
  fases apropriadas — não assumed/emulada nesta fase

## Estado atual por fase

| Fase | Item | Status |
|---|---|---|
| 4.1 | Supabase CLI instalado (`supabase` devDependency) | Feito |
| 4.1 | `supabase init` / `supabase/config.toml` versionado | Feito |
| 4.1 | `.gitignore` cobre `.env.local` e `.env.*.local` | Feito |
| 4.1 | `docs/SUPABASE.md` criado | Feito |
| 4.1 | Projeto remoto criado no painel (`ilha-aprendiz-prod`) | Feito |
| 4.1 | `npx supabase login` na máquina de desenvolvimento | Feito |
| 4.1 | `npx supabase link --project-ref jvvbjwsgxxsyreptpxrm` | Feito |
| 4.2 | `@supabase/supabase-js` instalado como dependency | Feito |
| 4.2 | `.env.example` criado e versionado | Feito |
| 4.2 | workflow CI com `env:` no step de build | Feito |
| 4.2 | `docs/DEV_SETUP.md` atualizado com instruções de `.env.local` | Feito |
| 4.2 | `.env.local` preenchido localmente | Feito |
| 4.2 | GitHub Repository Variables configuradas | Feito |
| 4.3 | `supabase-client.js` criado na raiz (entry ES Module processado pelo Vite) | Feito |
| 4.4 | Scripts npm `db:*` adicionados; docs de workflow e ciclo de migration | Feito |
| 4.4 | Validação local (`supabase start/status/reset/stop`) | Feito — 2026-08-25 |
| 4.5 | Gate final (testes, build, segurança, contratos, escopo) | Feito — 2026-08-25 |

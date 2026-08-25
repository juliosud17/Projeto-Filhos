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

### Comandos principais

```bash
# Sobe Postgres + Studio local (porta 54323) — requer Docker
npx supabase start

# Para os containers locais
npx supabase stop

# Recria o banco local do zero, replaying todas as migrations
npx supabase db reset

# Cria novo arquivo de migration versionado em supabase/migrations/
npx supabase migration new <nome-descritivo>

# Aplica migrations pendentes no projeto remoto (requer link feito)
npx supabase db push
```

Scripts npm de conveniência serão adicionados na Fase 4.4.

### Vinculação ao projeto remoto

```bash
# Feito uma vez por máquina; o ref está no painel Supabase → Project Settings
npx supabase link --project-ref jvvbjwsgxxsyreptpxrm
```

Após o link, `npx supabase db push` aplica as migrations locais no remoto.

## Ciclo de migration

1. `npx supabase migration new <nome>` → cria
   `supabase/migrations/<timestamp>_<nome>.sql`
2. Editar o arquivo SQL com o schema desejado
3. `npx supabase db reset` → valida localmente (recria o banco do zero)
4. Revisar e commitar `supabase/migrations/` no repositório
5. `npx supabase db push` → aplica no projeto remoto

Migrations são **código versionado** — nunca editar uma migration já aplicada
e commitada; criar uma nova migration com a alteração desejada.

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
| 4.3 | `app/js/supabase-client.js` criado | Pendente |
| 4.4 | Workflow local validado, scripts npm, docs | Pendente |
| 4.5 | Gate final | Pendente |

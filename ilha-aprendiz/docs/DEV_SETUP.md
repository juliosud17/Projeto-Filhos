# Ambiente de desenvolvimento — Ilha Aprendiz (Fase 2: Vite)

*Criado na Fase 2 (migração controlada file:// → HTTP via Vite). Este documento
cobre só o "como rodar" localmente. Para o "por quê" da arquitetura, ver
`docs/ARQUITETURA.md` e a entrada de 2026-08-21 em `docs/DECISOES.md`.*

## Pré-requisitos

- Node.js instalado (usado nesta fase: v22 — qualquer versão moderna do Node 18+ deve funcionar).
- `npm` (vem junto com o Node).
- Arquivo `.env.local` na raiz de `ilha-aprendiz/` (ver seção abaixo) — prepara as variáveis para a integração de backend (Fase 4.3+); o app roda sem ele e o comportamento permanece inalterado até a Fase 4.3.

## Passo a passo

```bash
cd ilha-aprendiz

# 1. instalar dependências (só precisa rodar 1x por máquina, ou quando
#    package.json/package-lock.json mudar)
npm install

# 2. rodar a suíte de testes (Node + jsdom) -- sempre bom confirmar que
#    está tudo verde antes de mexer em qualquer coisa
npm test

# 3. subir o servidor de desenvolvimento (Vite)
npm run dev
```

O terminal vai mostrar uma URL parecida com `http://localhost:5173/`.
**Abra especificamente `http://localhost:5173/ilha_aprendiz.html`** — é
onde o app de verdade está. A URL raiz (`/`) mostra só uma página de
redirecionamento automático pra essa mesma URL (ver "Por que existe um
index.html separado" abaixo).

## Build de produção

```bash
npm run build      # gera dist/
npm run preview    # serve dist/ localmente pra conferir antes de publicar
```

Depois de `npm run preview`, abra `http://localhost:4173/ilha_aprendiz.html`
(mesma lógica da URL do `npm run dev`).

`dist/` é gerado a cada build (sobrescrito) e não deve ser commitado — já
está no `.gitignore` (ver Fase 1, `docs/VITE_MIGRATION_CHECKLIST.md`).

## URLs locais (referência rápida)

| Comando | URL raiz | URL do app real |
|---|---|---|
| `npm run dev` | `http://localhost:5173/` (redireciona) | `http://localhost:5173/ilha_aprendiz.html` |
| `npm run preview` (depois de `npm run build`) | `http://localhost:4173/` (redireciona) | `http://localhost:4173/ilha_aprendiz.html` |

Se a porta padrão estiver ocupada, o Vite avisa no terminal e tenta a
próxima livre — a URL exata sempre aparece na saída do comando.

## Estrutura de build (`dist/`)

```
dist/
├── index.html            (novo -- redireciona pro app real, não é o jogo)
├── ilha_aprendiz.html    (cópia byte-idêntica de app/ilha_aprendiz.html)
├── css/app.css           (cópia idêntica)
├── data/*.js             (cópia idêntica, 8 arquivos)
├── js/*.js               (cópia idêntica, 16 arquivos)
└── assets/               (cópia idêntica de app/assets/ -- áudio, vídeo, mapa)
```

Nada aqui é processado, minificado ou renomeado — é uma cópia 1:1 de
`app/` (ver `vite.config.mjs`, `publicDir: 'app'`). O único arquivo
realmente "buildado" pelo Vite é `dist/index.html`.

## `file://` continua funcionando

Nada em `app/` foi movido, renomeado ou alterado nesta fase. Abrir
`app/ilha_aprendiz.html` direto no navegador (duplo-clique, sem servidor)
continua funcionando exatamente como antes — Vite é uma camada adicional,
não uma substituição.

## localStorage: `file://` vs `http://localhost`

**Importante:** o navegador trata `file://` e `http://localhost:5173` (ou
`:4173`) como origens diferentes. Progresso salvo abrindo o arquivo direto
(`file://`) **não aparece automaticamente** quando você abre a versão via
Vite, e vice-versa — são dois `localStorage` completamente separados, do
ponto de vista do navegador. Isso não é um bug desta migração, é como
navegadores sempre trataram esses dois protocolos.

Se precisar levar progresso de um lado pro outro, isso exigiria uma
ferramenta manual de exportar/importar o valor de
`localStorage.getItem("ilhaAprendizProgresso")` — **não implementada nesta
fase** (decisão explícita: qualquer ferramenta assim precisa de aprovação
antes de ser criada, ver `docs/VITE_MIGRATION_CHECKLIST.md`, PASSO 7).

## Variáveis de ambiente (Fase 4+)

Crie um arquivo `.env.local` na raiz de `ilha-aprendiz/` (nunca commitado —
já está no `.gitignore`) com o seguinte conteúdo:

```
VITE_SUPABASE_URL=https://jvvbjwsgxxsyreptpxrm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable key do painel Supabase>
```

A publishable key está disponível em
**Supabase → Settings → API Keys → Publishable key** (formato `sb_publishable_...`).
Não usar a "anon key" legada — o contrato deste projeto é exclusivamente a
publishable key atual. É um valor seguro de publicar — aparece no bundle do
frontend por design.

Sem `.env.local` (ou com variáveis em branco), as variáveis ficam ausentes
do bundle e nenhuma conexão Supabase é criada. O comportamento do app
permanece inalterado — a integração real só ocorre a partir da Fase 4.3.

## Troubleshooting

**"Porta já em uso"** — outro processo já está usando 5173/4173. Ou feche o
outro processo, ou deixe o Vite escolher a próxima porta livre (ele faz
isso automaticamente e avisa no terminal).

**Tela em branco / erro 404 em `/`** — normal na primeira fração de
segundo (o `index.html` redireciona automaticamente); se persistir,
confirme que está acessando `/ilha_aprendiz.html` diretamente.

**Áudio/vídeo não carrega** — confirme que `app/assets/` existe fisicamente
no seu projeto (arquivos binários reais, não versionados neste repositório
de teste/CI). Ver `docs/PATHS_MIGRATION.md` e `testes/qa_test_assets_qa.js`.

**`npm test` reclamando de `dist/` ausente** — não deveria: o teste novo
desta fase (`testes/qa_test_vite_build.js`) avisa e pula quando `dist/`
não existe, não conta como falha. Se quiser a validação completa da saída
do build, rode `npm run build` antes de `npm test`.

**Erro ao rodar `npm run dev`/`build`/`preview` logo após clonar** —
confirme que rodou `npm install` primeiro (Vite é uma `devDependency`, não
vem instalado por padrão).

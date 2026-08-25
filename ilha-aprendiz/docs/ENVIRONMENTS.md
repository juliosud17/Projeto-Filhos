# Ambientes — Ilha Aprendiz

*Fase 3 (Ambientes), 2026-08-21. Define formalmente o que cada ambiente
significa neste projeto — algo que não existia antes desta fase (a
distinção era sempre, na prática, "o arquivo local" ou "o GitHub Pages",
sem nenhuma configuração real por trás). Decisão de fundo (Opção B da
auditoria — GitHub Pages passa a publicar `dist/` via GitHub Actions, não
mais os arquivos-fonte direto) aprovada pelo Júlio; registro completo em
`docs/DECISOES.md`. Ver `docs/ARQUITETURA.md` para como isso se encaixa na
arquitetura geral, e `docs/DEV_SETUP.md` para o passo a passo de uso local
(este documento é a referência formal de "o que cada ambiente é", não um
tutorial de comandos).*

## development

- **Como se roda:** `npm run dev` (Vite dev server).
- **URL:** `http://localhost:5173/` (redireciona para `/ilha_aprendiz.html`).
- **O que serve:** `app/` inteiro, sem processamento (`publicDir: 'app'`,
  ver `vite.config.mjs`) — mudanças em `app/js/`, `app/data/`, `app/css/`
  são refletidas ao recarregar a página, sem build.
- **`localStorage`:** origem própria (`http://localhost:5173`), separada de
  qualquer outra forma de rodar o app — ver `docs/DEV_SETUP.md`.

## production

- **Como se gera:** `npm run build` (Vite build, `outDir: 'dist'`).
- **Como se publica:** GitHub Actions (`.github/workflows/deploy-pages.yml`)
  builda `dist/` e publica via `actions/upload-pages-artifact` +
  `actions/deploy-pages` — GitHub Pages passa a servir o **artefato de
  build**, não mais os arquivos-fonte do repositório direto (mudança desta
  Fase 3, ver `docs/DECISOES.md`).
- **URL:** muda em relação ao que era servido até a Fase 2 — ver seção
  "Mudança de URL esperada" abaixo. URL definitiva só depois da migração
  real da configuração de Pages ser autorizada e aplicada.
- **O que serve:** o conteúdo de `dist/` no estado exato em que o workflow
  o gerou — cópia 1:1 de `app/` mais o `index.html` de redirecionamento
  (mesmo comportamento de build já documentado na Fase 2, `docs/ARQUITETURA.md`).
- **`localStorage`:** origem própria (o domínio público do GitHub Pages),
  separada de `development` e do modo legado `file://`.

## preview — não é um terceiro ambiente formal

- **Como se roda:** `npm run preview`, depois de `npm run build`.
- **URL:** `http://localhost:4173/` (redireciona para `/ilha_aprendiz.html`).
- **Para que serve:** validar localmente o artefato exato que `production`
  vai publicar (`dist/`), antes de qualquer push — é uma ferramenta de
  verificação de `production`, não um ambiente próprio com identidade
  separada. Não tem domínio público, não é servido por nada além do
  próprio Vite localmente, e não persiste depois que o comando termina.

## `file://` — modo legado/local de compatibilidade

Abrir `app/ilha_aprendiz.html` direto no navegador (duplo-clique, sem
servidor) continua funcionando — nada em `app/` foi movido, renomeado ou
alterado por esta fase. **Não é classificado como ambiente oficial de
`development`** — é mantido, quando possível, só por compatibilidade com o
uso real diário atual (Benjamin e Joaquim jogando hoje), não como parte do
fluxo de ambientes formal desta fase. `localStorage` sob `file://` é uma
origem própria, separada de todas as anteriores.

## Variáveis de ambiente (`VITE_*` / `import.meta.env`)

Nenhuma variável real existe hoje — zero uso de `process.env` ou
`import.meta.env` em `app/` (confirmado por auditoria, `docs/SECRETS_AUDIT_FASE1.md`
e a auditoria desta Fase 3). Esta seção documenta o **mecanismo oficial**
para quando a primeira variável real surgir, não introduz nenhuma agora:

- Qualquer variável prefixada `VITE_*` (em `.env`/`.env.local`/etc., padrão
  nativo do Vite) é incorporada ao bundle do frontend e fica **pública** —
  visível a qualquer pessoa que inspecione o código servido no navegador.
- `VITE_*` **nunca** deve conter segredo — chave de API privada, service
  role, credencial de banco, token de acesso. Nada disso pode existir no
  frontend, com ou sem prefixo `VITE_`.
- `import.meta.env.DEV` / `import.meta.env.PROD` / `import.meta.env.MODE`
  são os mecanismos oficiais do próprio Vite para diferenciar
  desenvolvimento de produção em código — preferíveis a qualquer variável
  própria para esse fim específico.
- Segredo real (chave de API do ElevenLabs, por exemplo, se algum dia for
  usada em runtime em vez de só na produção offline de mídia) nunca deve
  ser enviado ao navegador — se/quando isso for necessário, exige uma
  camada de backend própria (fora do escopo desta fase e da Fase 3 como um
  todo), nunca uma variável `VITE_*`.
- `.env`/`.env.example` **não foram criados nesta fase** — não há nenhuma
  variável real a documentar. Quando a primeira variável `VITE_*` legítima
  surgir numa fase futura, `.env.example` nasce no mesmo commit que a
  introduz, com o nome real, nunca antecipado sem uso.

## `?calibrar=1`

Flag de depuração lida da URL em `js/mapa-portugues.js`, usada para
calibrar coordenadas do mapa interativo. Continua funcionando exatamente
como está — **não migrada** para `import.meta.env.DEV` nesta fase (não há
bug a corrigir, é uma melhoria possível, registrada aqui só como nota para
uma fase futura, não como pendência desta).

## staging/preview remoto — decisão: não criar

Nenhum terceiro ambiente formal foi criado nesta fase. Não há hoje
infraestrutura (deploy automatizado por PR, múltiplos domínios) que
justifique staging — `npm run preview` local já cobre a necessidade prática
de conferir o build antes de publicar. Se no futuro houver deploy
automatizado por Pull Request (fora do escopo desta fase e da Fase 3 como
um todo — evolução de CI/CD pertence a uma fase própria), staging pode se
justificar por si só; não antes.

## Mudança de URL esperada (quando a migração de Pages for autorizada)

Até a Fase 2, o GitHub Pages servia os arquivos-fonte direto do
repositório, na URL `https://juliosud17.github.io/Projeto-Filhos/ilha-aprendiz/app/ilha_aprendiz.html`.

Com o deploy via GitHub Actions publicando `dist/ilha-aprendiz` como o
artefato de Pages, o **conteúdo publicado passa a ser a raiz do site**
(não mais um subcaminho `ilha-aprendiz/app/` dentro do repositório) — a URL
esperada após a migração real de configuração do Pages ser autorizada e
aplicada muda para algo como `https://juliosud17.github.io/Projeto-Filhos/`
(redirecionando automaticamente para `/ilha_aprendiz.html`, mesmo
comportamento do `index.html` de redirecionamento já usado em
`development`/`preview`). Qualquer link/atalho salvo apontando para a URL
antiga deixará de funcionar quando a migração for aplicada — ver
`docs/DECISOES.md` e o relatório de implementação desta fase para o detalhe
completo e para a confirmação de que essa migração de configuração **ainda
não foi aplicada** até nova autorização explícita.

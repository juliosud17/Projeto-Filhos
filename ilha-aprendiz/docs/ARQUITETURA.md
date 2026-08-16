# Arquitetura Técnica — Ilha Aprendiz

*Arquitetura do **código**, não do currículo (para arquitetura pedagógica/conteúdo, ver `pedagogia/ARQUITETURA_TRILHA_PORTUGUES.md` e `pedagogia/MOTOR_DE_ENSINO.md`). Escrito em 2026-08-16 a partir de inspeção direta do código-fonte, na criação da camada de documentação viva — é o primeiro documento a descrever a arquitetura técnica do app.*

## Estado atual: arquivo único

`app/ilha_aprendiz.html` — ~5.600 linhas, ~300KB, HTML + CSS + JS inline, zero dependências externas, zero build step. Abre direto no navegador (`file://`), sem servidor.

Estrutura interna (por posição no arquivo, não por pasta):
- `<style>` — CSS inline, ~490 linhas.
- `<script>` — JS inline, ~5.000 linhas, contendo:
  - Bancos de conteúdo como `const` no topo (`WORDS`, `PT_MODULES_BENJAMIN`, `MATH_MODULES_BENJAMIN`, `MODULE1_ACTIVITIES` … `MODULE7_ACTIVITIES`, listas de frases/parlendas/pares/etc.) — dados e código de renderização/lógica misturados no mesmo escopo.
  - Motores genéricos reaproveitados entre módulos (`isModuleUnlocked`, `activitiesFullyMastered`, `MODULE_CONTAINERS`, `pickWeightedByLevel`) — já existe alguma separação de responsabilidade aqui, é o pedaço mais "modular" do arquivo hoje.
  - Funções de renderização de tela (`render*`) e de navegação.

**Por que ainda funciona bem assim:** pra um protótipo em fase de construção de conteúdo, um arquivo único é a fricção mínima possível — qualquer um abre e roda sem instalar nada. É uma escolha deliberada de estágio, não um acidente.

**Onde começa a doer:** os próprios documentos de `pedagogia/` já registram pelo menos 2 bugs reais causados por lógica duplicada em várias funções antes de virar `MODULE_CONTAINERS` central (ver `pedagogia/CURRICULO_BNCC_PORTUGUES.md`, Módulo 3). Conforme entram persistência, revisão espaçada e motor de ensino completo (roadmap), a superfície de coisas que podem quebrar sem ninguém perceber cresce.

## Testes

`testes/qa_test_*.js` (Node + jsdom) — cada arquivo faz `fs.readFileSync` do HTML de um caminho **hardcoded**: `/tmp/ilha_aprendiz.html`. Rodar a suíte localmente hoje exige copiar `app/ilha_aprendiz.html` pra esse caminho antes (ou editar o `readFileSync` no topo de cada teste). Isso é uma fragilidade conhecida, ainda não corrigida — ver "Pendências" abaixo.

## Direção futura: modularização (planejada, ainda não iniciada)

Direção acordada (não uma migração de framework — continua HTML/CSS/JS puro):

```
app/
├── index.html
├── css/
│   └── app.css
├── js/
│   ├── app.js              (bootstrap/orquestração)
│   ├── navigation.js        (árvore de telas)
│   ├── mastery.js           (domínio, progressão de nível)
│   ├── storage.js           (persistência — nasce junto com o item 1 do roadmap)
│   └── teaching-engine.js   (motor de ensino: Aprender → Ver exemplo → Fazer comigo → Agora é você)
└── data/
    ├── portugues/
    │   └── modulo1.json, modulo2.json, ...
    └── matematica/
        └── m01.json, ...
```

Um "conceito" de conteúdo vira dado estruturado em vez de código escrito à mão, por exemplo:

```json
{
  "id": "EF01MA07",
  "titulo": "Compor e decompor números",
  "pre_requisitos": ["contagem", "dezena_unidade"],
  "ensino": {
    "introducao": "...",
    "exemplo": "...",
    "pratica_guiada": "..."
  }
}
```

**Por que isso ainda não começou:** é trabalho de infraestrutura, não de conteúdo — o roadmap atual (`docs/ROADMAP.md`) prioriza persistência → revisão espaçada → trava de ritmo → avaliação real primeiro, porque são lacunas que bloqueiam decisões pedagógicas concretas. A modularização não bloqueia nada pedagogicamente; ela reduz risco de manutenção conforme o arquivo cresce. Vale decidir com calma quando começar, não empurrar pra "depois" indefinidamente.

**Consequência técnica a decidir junto (ainda em aberto):** hoje o app abre direto com duplo-clique (`file://`, zero setup). Depois de separar em módulos JS (`<script type="module">`) e conteúdo em JSON carregado via `fetch`, isso deixa de funcionar sem servidor — a maioria dos navegadores bloqueia `fetch`/import de módulo em origem `file://` por CORS. Nesse ponto passa a ser necessário abrir com um servidor local (Live Server do VS Code resolve no início; Vite se o projeto crescer e precisar de build). Isso muda a rotina de quem usa o app no dia a dia — vale confirmar antes de migrar se o uso real (Benjamin jogando) vai rodar sempre via VS Code/servidor, ou se em algum momento precisa gerar um HTML único "compilado" pra continuar funcionando por duplo-clique.

## Pendências técnicas conhecidas

- Caminho hardcoded `/tmp/ilha_aprendiz.html` nos testes — resolver antes ou junto da modularização (uma vez que o app vire multi-arquivo, os testes precisam carregar mais que um `readFileSync` de qualquer forma).
- Flakiness conhecida e documentada (não são bugs novos, não travar CI por causa deles): `qa_test_regression.js` e `qa_test_svg.js` (artefato de `setTimeout` no harness), intermitência ocasional em `qa_test_typing.js`.

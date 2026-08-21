# Auditoria de Caminhos (Paths) — Ilha Aprendiz

*FASE 1, PASSO 3. Inventário de todo caminho de arquivo usado em runtime,
classificado por categoria, com o comportamento atual, o comportamento
esperado sob Vite/HTTP, o risco de quebra e a ação prevista (não executada
nesta fase) para a Fase 2. Nenhum caminho foi alterado nesta fase.*

## Resumo

Todos os caminhos do projeto são **relativos ao arquivo que os referencia**
(nenhum `file://` explícito, nenhum caminho absoluto de disco `C:\`/`D:\`
embutido em código). Isso é a melhor notícia possível para uma migração:
paths relativos tendem a sobreviver à troca de `file://` para servidor
HTTP/Vite **sem qualquer alteração de valor**, desde que a posição relativa
entre `app/ilha_aprendiz.html`, `css/`, `data/`, `js/` e `assets/` seja
preservada pelo bundler (é exatamente essa preservação que o
`docs/VITE_MIGRATION_CHECKLIST.md` cobra como critério de validação).

## 1. Relativos ao HTML (`app/ilha_aprendiz.html`)

| Atual | Comportamento esperado no Vite | Risco | Ação prevista na Fase 2 |
|---|---|---|---|
| `<link rel="stylesheet" href="css/app.css">` | Vite resolve `css/app.css` relativo ao HTML normalmente, seja servindo estático ou processando como asset do build | Baixo | Nenhuma mudança de valor — só confirmar que `css/` continua na mesma posição relativa ao HTML de entrada |
| 24× `<script src="data/*.js">` / `<script src="js/*.js">` | Vite pode servir scripts clássicos como estão (sem `type="module"`) durante a transição, ou publicá-los como assets estáticos copiados — a ORDEM das 24 tags precisa ser preservada byte a byte (ver `RUNTIME_DEPENDENCIES.md`) | **Alto** — não é o caminho em si que quebra, é a ordem/existência de cada um | Fase 2 decide se migra para `type="module"` com imports explícitos ou mantém scripts clássicos servidos pelo Vite tal como estão; até lá, não reordenar nem remover nenhuma tag |

## 2. Relativos a `app/assets/` (mídia)

| Atual | Comportamento esperado no Vite | Risco | Ação prevista na Fase 2 |
|---|---|---|---|
| `MEDIA_BASE = "assets/"` (`js/media-catalog.js:14`) — raiz única de onde todo path de mídia é montado por concatenação de string (nunca hardcoded fora daqui, exceto o caso abaixo) | Se `assets/` for servido como pasta estática pelo Vite (`public/assets/`), `MEDIA_BASE` continua funcionando sem alteração. Se migrar para import de asset processado pelo bundler (hashing de nome de arquivo), TODO o esquema de concatenação de string quebra — não é compatível com hashing de asset por padrão | Alto se a Fase 2 optar por processar assets via import; baixo/nenhum se optar por `public/` estático | Fase 2 deve decidir explicitamente: `assets/` vira `public/assets/` do Vite (path preservado, sem hashing) — opção recomendada para minimizar risco, dado que `MEDIA_BASE` e toda a lógica de nomenclatura (`mediaFileName()`) dependem de nomes de arquivo previsíveis, não hasheados |
| `bg.src = "assets/maps/ilha-das-letras.webp"` (`js/mapa-portugues.js:56`) | Mesmo raciocínio do item acima, mas este é um path **literal**, fora de `media-catalog.js` e de `MEDIA_BASE` — não segue o padrão centralizado do resto do projeto | Médio — funciona hoje, mas é uma exceção não documentada até este audit; se `MEDIA_BASE` mudar de valor no futuro (ex.: para apontar pra um CDN), este path NÃO muda junto, porque não usa a constante | Fase 2 deve avaliar se vale strategicamente unificar este path para passar por `MEDIA_BASE` também — decisão de código, não desta fase |
| `video.src = url` (`js/audio-manager.js:267`) | Path dinâmico, sempre originado de `mediaCharacterVideo()`/`mediaCharacterSound()` — herda o comportamento de `MEDIA_BASE` | Baixo — não é uma origem própria de path, só recebe o já resolvido | Nenhuma ação própria — cai na mesma decisão do `MEDIA_BASE` |

## 3. Áudio

Todo áudio (fala da Lia, fonética, SFX) usa o padrão
`MEDIA_BASE + "audio/<subpasta>/.../<arquivo>.mp3"`, sempre via
`js/media-catalog.js` (`mediaFonetica`, `mediaCharacterSound`, `mediaSfx`,
`mediaLiaVoice`) — nenhum caminho de áudio hardcoded fora deste arquivo,
exceto o caso do mapa (categoria 2, item 2, que é imagem, não áudio). Ver
categoria 2 para o risco de hashing de asset.

## 4. Vídeo

Vídeo de personagem usa `MEDIA_BASE + "video/personagens/<id>/<id>-<estado>.mp4"`,
via `mediaCharacterVideo()` — mesmo padrão e mesmo risco da categoria 2.

## 5. Imagens

- `bg.src = "assets/maps/ilha-das-letras.webp"` — já coberto na categoria 2 (path literal fora do padrão `MEDIA_BASE`).
- Ícones/emoji usados na UI são caracteres Unicode (`🦉`, `🦊`, `⭐`, etc.) diretamente no HTML/JS, não arquivos de imagem — não há caminho de arquivo a auditar aqui.

## 6. Mapas (dado estrutural, não confundir com "mapa" de imagem)

`PT_MAPA_REGIOES` (`data/mapa-portugues.js`) contém coordenadas/regiões do
mapa interativo da Ilha das Letras — é dado (categoria A do
`GLOBALS_INVENTORY.md`), não path de arquivo. Não há caminho de arquivo
dentro deste dado.

## 7. JSON / dados

Não há nenhum `fetch()` de arquivo `.json` no projeto — todo o conteúdo
curricular é `const` embutido diretamente nos 8 arquivos `data/*.js` (ver
`RUNTIME_DEPENDENCIES.md` seção 3). Isso significa: zero risco de path
quebrado para dados, porque não há requisição de rede nem leitura de
arquivo em runtime para conteúdo — tudo já está em memória assim que o
`<script>` correspondente carrega. Grep confirmou zero ocorrências de
`fetch(` em `app/js/` e `app/data/`.

## 8. CSS

Um único arquivo, `css/app.css`, referenciado uma vez no `<head>` do HTML
(categoria 1). Sem `@import` interno checado nesta auditoria — fora do
escopo definido pelos 15 passos desta fase (`css/app.css` não foi lido
neste PASSO; se a Fase 2 precisar, deve auditar separadamente por conter
possíveis `url(...)` para fontes/imagens de fundo).

## 9. Fontes

Nenhuma referência a arquivo de fonte (`.woff`, `.ttf`, `@font-face`) foi
encontrada nos arquivos JS/HTML auditados nesta fase. Se `css/app.css`
declarar `@font-face` com `url(...)` relativo, isso não foi coberto por
este PASSO 3 (que auditou paths em runtime JS/HTML, não CSS) — nota de
risco residual para a Fase 2 conferir separadamente.

## 10. `file://` — dependências específicas do protocolo de arquivo local

Nenhuma foi encontrada. O app não usa `XMLHttpRequest`, `fetch`, nem
qualquer API que se comporte diferente sob `file://` vs `http://` além do
próprio carregamento dos `<script src>` e do `<link href>` — que são
exatamente os casos cobertos nas categorias 1–2 acima. Isso é consistente
com o fato de o app hoje abrir "com duplo-clique, sem servidor" (`CLAUDE.md`)
e funcionar assim.

## Conclusão da auditoria

O único ponto de decisão real e não trivial para a Fase 2 é: **como o
Vite vai servir `app/assets/`** — como pasta estática (`public/`, path
preservado, recomendado dado o volume de referências por concatenação de
string) ou como assets processados/hasheados pelo bundler (exigiria reescrever
`media-catalog.js` inteiro para usar `import` em vez de concatenação, um
trabalho de código real, não de configuração — e fora do escopo desta fase
de qualquer forma). Todo o resto do projeto (scripts, CSS) usa paths
relativos simples que devem sobreviver à migração sem alteração de valor,
desde que a estrutura de pastas relativa seja preservada.

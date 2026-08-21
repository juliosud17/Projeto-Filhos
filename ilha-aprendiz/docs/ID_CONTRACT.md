# Contrato de IDs — Ilha Aprendiz

*FASE 1, PASSO 6. Audita todos os identificadores usados por módulos,
atividades, níveis, palavras, perfis, conquistas e Desafios Finais,
classifica cada categoria como ESTÁVEL / INTERNO / VISUAL e marca quais já
estão persistidos em `localStorage` (ver `LOCAL_STORAGE_CONTRACT.md`).
Nenhum ID foi alterado nesta fase.*

Legenda:
- **ESTÁVEL** — usado como chave de persistência e/ou como valor literal
  espalhado em `onclick=`/HTML; mudar quebra dado salvo do usuário e/ou
  navegação. Nunca renomear sem plano de migração explícito.
- **INTERNO** — usado só entre arquivos JS (parâmetro, chave de lookup),
  não aparece hardcoded no HTML nem em `localStorage`. Renomear é mais
  seguro, mas ainda exige atualizar todos os arquivos que o referenciam.
- **VISUAL** — texto/rótulo mostrado na tela; pode mudar livremente sem
  quebrar dado ou navegação (é conteúdo, não identificador técnico).

## 1. IDs de perfil de criança (`child`)

| ID | Classificação | Persistido? | Observação |
|---|---|---|---|
| `joaquim` | **ESTÁVEL** | Sim — chave de `totalStars` em `localStorage` e parâmetro de `selectChild('joaquim')` no HTML | Usado também como chave em `CHILD_INFO` (`js/mastery.js`) |
| `benjamin` | **ESTÁVEL** | Sim — mesma razão | idem |

Risco: são só 2 valores fixos, mas aparecem em pelo menos 4 lugares
diferentes (HTML `onclick`, `CHILD_INFO`, `state.totalStars`, payload
salvo) — uma mudança de nome exigiria tocar em todos simultaneamente e
migrar o `localStorage` já salvo de qualquer família que já tenha jogado.

## 2. IDs de atividade (`activityLevel`, 52 chaves fixas)

Exemplos: `silabas`, `letras_b`, `cominicial`, `pares_minimos`, `rimas`,
`quantos_tem`, `monte_o_numero`, `dezena_e_unidade`, `leia_o_grafico` (lista
completa em `js/mastery.js:2`).

- **Classificação: ESTÁVEL.**
- **Persistido?** Sim — são as chaves de `activityLevel`, `mastery` (como
  `"<id>:<nivel>"`) e `reviewState` dentro do payload salvo em
  `localStorage` (ver `LOCAL_STORAGE_CONTRACT.md`).
- **Consumidores:** `js/mastery.js` (declaração + checagens de domínio),
  `js/storage.js` (serialização), `js/game-loop.js` (despacho de qual
  função `render*` chamar — ver `GLOBALS_INVENTORY.md` categoria E),
  `js/admin.js`, `js/navigation.js`, `js/mapa-portugues.js`.
- **Risco de mudar:** Alto. Renomear qualquer uma dessas 52 chaves invalida
  o progresso salvo de qualquer criança que já tenha atividade registrada
  sob o nome antigo (a chave nova simplesmente não bate com nada salvo,
  então `loadProgress()` a ignora silenciosamente — não corrompe, mas
  **perde silenciosamente** o progresso daquela atividade específica).

## 3. IDs de container/módulo (`containerId`, 19 valores)

Exemplos Português: `silabas`, `leitura`, `frases`, `escrita`,
`compreensao`, `narrativas`, `gramatica`.
Exemplos Matemática: `mm1_numeros`, `mm2_contagem100`, `mm3_comparar`,
`mm4_adicao`, `mm5_subtracao`, `mm6_compor_decompor`, `mm7_espaco`,
`mm8_formas`, `mm9_medidas`, `mm10_tempo`, `mm11_dinheiro`,
`mm12_probabilidade`.

- **Classificação: ESTÁVEL.**
- **Persistido?** Sim — chave de `provaPassed` e `provaScores` no payload
  salvo (Desafio Final por módulo).
- **Consumidores:** `js/mastery.js` (`MODULE_CONTAINERS`, `containerById`,
  `isModuleUnlocked`), `data/registro-modulos.js` (campo `requires` de
  módulo, referencia o `containerId` do pré-requisito), `js/navigation.js`,
  `js/admin.js`, `js/mapa-portugues.js`.
- **Risco de mudar:** Alto — mesma razão da categoria 2, e adicionalmente
  usado como referência de pré-requisito entre módulos (`mod.requires`),
  então uma renomeação quebrada também destravaria/travaria módulos
  incorretamente, não só perder Desafio Final salvo.
- **Note:** `id:"projetoleitor"` existe como módulo (Módulo 8) mas **não**
  tem `containerId`/atividades — é fora da tela por design (ver `CLAUDE.md`).
  Não confundir com os 19 containers reais.

## 4. IDs de módulo "achievement-like" sem container (ex.: `cultura_j`, `cultura_b`)

`data/registro-modulos.js` também contém módulos "Em breve"
(`FUTURE_BENJAMIN` em `js/mastery.js` tem `cultura_b`) que têm `id` mas
nenhuma atividade real implementada ainda.

- **Classificação: INTERNO** hoje (não persistem nada porque não têm
  atividade jogável ainda), mas se tornam **ESTÁVEL** no momento em que
  ganharem atividades reais e entrarem no fluxo de `activityLevel`/Desafio
  Final — mesma regra da categoria 2/3 se aplica a partir daí.

## 5. IDs de palavra/personagem (`character`, banco `WORDS`)

Exemplos: `bola`, `casa`, `gato`, `pato`, `vaca`, `sapo`, `galo`, `lobo`,
`sino`, `carro` (Lote A do piloto audiovisual, ver `docs/characters/CHARACTER_BIBLE.md`).

- **Classificação: ESTÁVEL** para os que já têm mídia de personagem gravada
  (Lote A) — usado para montar o path de vídeo/áudio via
  `mediaCharacterVideo(character, estado)`/`mediaCharacterSound(character, nome)`
  em `js/media-catalog.js`, que por sua vez espera arquivos físicos com
  esse exato nome em `app/assets/video/personagens/<character>/` e
  `app/assets/audio/personagens/<character>/`.
- **Persistido em localStorage?** Não diretamente — `character` não é
  salvo, é recalculado a partir de `WORDS` (dado curricular fixo) toda vez.
  O risco aqui não é perda de progresso salvo, é **quebra de asset físico**:
  renomear `character` sem renomear a pasta de assets correspondente causa
  404 de mídia (mesma classe de bug já documentada em `docs/DECISOES.md`
  para o caso `audio/Lia`→`audio/lia`, resolvido na Fase 0.5).
- **Palavras sem `character` ainda** (as 77 restantes do banco de 87, fora
  do Lote A) não têm esse risco ainda, porque não têm mídia física
  associada — ver `CLAUDE.md`, "escalar o campo `character` ... é decisão
  futura, não feita ainda".

## 6. Palavra (`word`, banco `WORDS`) e sílabas (`syl`)

- **Classificação: ESTÁVEL** para o `word` em si (usado para montar path de
  fonética via `mediaFonetica("palavra", w.word)`), **INTERNO** para `syl`
  (array de sílabas, consumido só por lógica de renderização de atividade,
  não usado como path nem persistido).
- **Persistido?** Não diretamente, mas indiretamente sim — os IDs de
  atividade da categoria 2 acima (`silabas`, `letras_b`, etc.) são o que
  persiste; `word`/`syl` são o dado de origem consumido em tempo real por
  essas atividades, não uma chave própria salva.

## 7. Níveis (`nivel`/`level`, inteiros 1–5)

- **Classificação: ESTÁVEL** — não são strings, são inteiros 1 a 5 com
  significado fixo de progressão. `loadProgress()` já valida
  `Number.isInteger(v) && v >= 1 && v <= 5` na restauração (proteção já
  existente, não desta fase).
- **Persistido?** Sim, como valor de cada chave de `activityLevel`.
- **Risco:** Baixo de colisão de nome (são números, não strings), mas alto
  de significado — qualquer mudança na régua de progressão (ex.: passar a
  usar 1–10) exigiria migração explícita do `localStorage` existente.

## 8. IDs de conquista/estrela

Não existe um sistema de "achievement" com ID próprio separado —
`state.totalStars` é só um contador numérico por criança, sem lista de
conquistas individuais nomeadas. Nenhum ID a classificar aqui além do que
já foi coberto na categoria 1.

## 9. Resumo por classificação

| Classificação | Categorias |
|---|---|
| **ESTÁVEL** (não renomear sem plano de migração) | `child` (1), `activityLevel`/atividade (2), `containerId`/módulo (3), `character` já gravado (5), `word` (6), `nivel` (7) |
| **INTERNO** (renomeável com cuidado, não persiste nem aparece no HTML) | módulos "Em breve" sem atividade real ainda (4), `syl` (6) |
| **VISUAL** (texto livre, sem risco técnico) | nomes de exibição (`name`, `desc`, `tag`, emoji) em qualquer banco de dado curricular — não listados individualmente por serem conteúdo, não identificador |

Nenhum ID foi alterado, renomeado ou migrado nesta fase — este documento é
só o contrato de risco para orientar qualquer decisão futura (Fase 2 ou
além).

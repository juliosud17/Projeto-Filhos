# Auditoria — Currículo Próprio vs. Texto Oficial da BNCC

*Criado em 2026-08-16, a pedido do Júlio ("pode comparar"), depois de alocar o documento oficial em `pedagogia/bncc-oficial/`. Compara cada uma das 26 habilidades EF01LP e 22 EF01MA como descritas em `app/data/registro-modulos.js` (a fonte que tanto o app quanto `pedagogia/CURRICULO_BNCC_PORTUGUES.md`/`CURRICULO_BNCC_MATEMATICA.md` herdam) contra o texto oficial em `pedagogia/bncc-oficial/`.*

**Resultado geral:** a curadoria é sólida — a maioria dos 48 códigos bate bem com o texto oficial, incluindo vários quase verbatim. Mas apareceram **5 divergências reais que valem atenção**, sendo uma delas (EF01MA13) bem concreta e fácil de confirmar. Nenhuma é grave a ponto de invalidar o trabalho já feito — são o tipo de coisa que só aparece mesmo comparando contra a fonte, exatamente por isso que valeu a pena fazer.

---

## Divergências reais encontradas (por ordem de relevância)

### 🔴 1. EF01MA13 usa a lista de formas do 2º ano (EF02MA14), não do 1º ano

- **Nosso texto:** "Relacionar figuras geométricas espaciais **(cubo, bloco retangular, pirâmide, cone, cilindro, esfera)** a objetos do mundo físico"
- **Oficial EF01MA13:** "Relacionar figuras geométricas espaciais **(cones, cilindros, esferas e blocos retangulares)** a objetos familiares do mundo físico." — só **4 formas**, sem cubo nem pirâmide.
- **Oficial EF02MA14** (2º ano): "Reconhecer, nomear e comparar figuras geométricas espaciais **(cubo, bloco retangular, pirâmide, cone, cilindro e esfera)**..." — as 6 formas batem **exatamente** com o que usamos no EF01MA13.

**O que isso significa na prática:** a atividade "Formas no Mundo" (M8) testa cubo e pirâmide como se fossem conteúdo do 1º ano, mas oficialmente são do 2º. O próprio código já documenta a consciência de que a pirâmide é aproximada por uma barraca de acampar (prisma triangular, não pirâmide de base quadrada) — mas o problema aqui é anterior a isso: nem cubo nem pirâmide deveriam estar na lista de "1º ano" pra começo de conversa. Coerente com o app já se posicionar como "um ano à frente" — mas isso deveria estar rotulado como tal (EF01MA13 + além, antecipando EF02MA14), não como EF01MA13 "puro".

### 🔴 2. EF01MA11 e EF01MA12 — vocabulário trocado entre as duas atividades

- **Oficial EF01MA11** (posição relativa à própria criança): termos "à direita, à esquerda, **em frente, atrás**".
- **Oficial EF01MA12** (posição segundo um ponto de referência dado): menciona explicitamente "direita, esquerda, **em cima, em baixo**" como exemplo de termos que exigem explicitar o referencial.
- **Nosso texto do EF01MA11:** "à direita, à esquerda, **em cima, embaixo**, perto, longe" — usa o vocabulário que é oficialmente do EF01MA12, não do EF01MA11. "Em frente/atrás" (a marca registrada do EF01MA11) não aparece.
- A atividade real (**"Onde Está?"**, rotulada EF01MA11) usa mesmo cima/embaixo como termos de nível 1-2, confirmando que o descompasso está na atividade, não só no texto.
- A atividade **"Siga o Mapa"** (rotulada EF01MA12) é sobre seguir uma sequência de direções num percurso — útil e adequado à idade, mas isso também não é literalmente o que o EF01MA12 descreve (que é sobre precisar *explicitar um referencial* ao usar termos de posição).

**Não é grave** — as duas atividades continuam sendo raciocínio espacial legítimo e adequado pra idade — mas os rótulos EF01MA11/EF01MA12 não descrevem com precisão o que cada uma testa.

### 🟡 3. EF01MA01 — falta a metade "números como código"

- **Oficial:** "Utilizar números naturais como indicador de quantidade ou de ordem... **e reconhecer situações em que os números não indicam contagem nem ordem, mas sim código de identificação**" (ex.: número de casa, número de camisa de time — um número que não é quantidade nem posição, é só um rótulo).
- **Nosso texto e a atividade "Quantos Tem?"** cobrem só a primeira metade (quantidade vs. ordem) — a doc do módulo já registra isso como "cobre as duas metades da EF01MA01", mas as "duas metades" oficiais são quantidade/ordem **vs.** número-como-código, não quantidade **vs.** ordem (que são a mesma metade). A metade "número como código" não tem atividade nenhuma dedicada a ela.

### 🟡 4. EF01MA09 — só testa 1 dos 3 atributos oficiais

- **Oficial:** organizar objetos "por meio de atributos, tais como **cor, forma e medida**".
- **Nossa atividade ("Organize por Tamanho")** só cobre medida/tamanho — cor e forma como critério de ordenação não têm atividade.

### 🟡 5. EF01LP17/20/22/24 — verbo e lista de gêneros incompletos

Padrão repetido nesses 4 códigos: o texto oficial sempre é **"Planejar E produzir"** ou **"Identificar E reproduzir"** (duas ações), e sempre lista **"legendas para álbuns, fotos ou ilustrações"** entre os gêneros — que é literalmente o gênero "Fotolegendas" que `pedagogia/REFERENCIA_NOVA_ESCOLA.md` pesquisou a fundo. Nossos textos capturam só a ação de produzir/reproduzir (sem o "planejar"/"identificar" antes) e cortam "legendas para fotos" da lista de gêneros. Não invalida as atividades existentes (Complete a Lista, Texto do Dia a Dia, etc. seguem legítimas), mas confirma algo que `pedagogia/ARQUITETURA_TRILHA_PORTUGUES.md` já cogitava: o Módulo 4 hoje é mais raso que o que a habilidade oficial pede — falta o processo de planejar antes de produzir, e falta o gênero legenda-de-foto especificamente.

---

## Achados menores (imprecisão de redação, sem gap de conteúdo real)

| Código | Nota |
|---|---|
| EF01LP03 | Direção invertida na paráfrase (comparar A→B vs. B→A) — sem efeito prático |
| EF01LP15 | Oficial distingue "agrupar" (sinônimos) de "separar" (antônimos); nosso texto trata as duas ações como uma só |
| EF01MA04 | Nosso texto usa "diferentes estratégias de contagem" — frase que oficialmente pertence ao EF01MA02, não ao EF01MA04 (que fala em "registros verbais e simbólicos", não mencionado no nosso texto) |
| EF01MA05 | Oficial cita "reta numérica" como apoio; a atividade usa fileiras de pontinhos, não uma reta numérica literal — visual diferente, mesmo objetivo |
| EF01MA14 | Oficial inclui "ou em contornos de faces de sólidos geométricos" (relacionar 2D com faces de sólidos 3D) — não testado |
| EF01MA16 | Oficial pede uso de **horários** dos eventos (relativos a um dia); a atividade usa só ordem (antes/depois), sem horário de relógio |
| EF01MA18 | Oficial inclui indicar o dia da semana — a atividade real já cobre isso, só a descrição-resumo que omite |

---

## O que bateu certo (sem achado)

Os demais 36 códigos (25 EF01LP + 11 restantes de EF01MA, descontando os 12 já discutidos acima com achado) batem bem com o texto oficial — paráfrases fiéis, às vezes quase verbatim (EF01LP06, EF01LP07, EF01MA17, EF01MA20, EF01MA22 são praticamente idênticos ao original). A honestidade de escopo já documentada pro app também se confirmou: **EF01LP23** (produção de áudio/vídeo) de fato não aparece em nenhum módulo — coerente com o que `pedagogia/CURRICULO_BNCC_PORTUGUES.md` já assumia como fora do alcance de um app de clique.

---

## Próximos passos (não decidido ainda — aguardando o Júlio)

Nenhuma correção foi aplicada nesta entrega — isto é só o relatório da comparação, como combinado. Opções pra cada achado, da mais simples à mais trabalhosa:

1. **Só corrigir a documentação** (relabeling): ex. anotar que "Formas no Mundo" cobre EF01MA13 + antecipa EF02MA14, sem mudar o jogo em si.
2. **Ajustar o jogo existente**: ex. trocar os termos de "Onde Está?" pra usar "em frente/atrás" de verdade, ou adicionar cor/forma como critério em "Organize por Tamanho".
3. **Criar atividade nova**: ex. um jogo pequeno pra cobrir "números como código" (EF01MA01) ou legendas de foto (EF01LP17/20).
4. **Não fazer nada agora** — registrar como pendência conhecida e decidir quando/se importa.

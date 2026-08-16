# Arquitetura da Trilha de Português — 1º Ano Fundamental (Benjamin)

*Documento de estrutura, gerado a partir do cruzamento entre o currículo original da Ilha Aprendiz (8 módulos) e as 30 sequências da Nova Escola mapeadas em `referencia-nova-escola.md`. Ainda não é implementação — é a planta antes de construir. Nenhum código foi alterado.*

---

## Resposta direta às suas 3 perguntas

**1. Vamos distribuir em módulos ainda?** Sim — a estrutura de 8 módulos / 4 bimestres que já tínhamos continua sendo a espinha dorsal certa. As 30 sequências da Nova Escola, quando organizadas pelas habilidades BNCC que elas cobrem, encaixam quase perfeitamente nos 8 módulos que já existiam no papel — o que mudou não foi "quantos módulos", foi **o quanto cada módulo estava raso**. Só o Módulo 1 tinha profundidade real (3 atividades); os outros 7 tinham no máximo 1 atividade ou nada.

**2. Precisa adicionar módulos novos?** Não. Testei mapear as 30 sequências contra os 8 módulos existentes e todas encaixam em algum — o que faltava não era espaço, era conteúdo dentro do espaço que já existia. A única coisa que atravessa vários módulos ao mesmo tempo, sem pertencer a nenhum sozinha, é a **dimensão oral/social** (Minisseminários, Rodas de leitura, Rodas de notícias, Assembleias, Oficinas de escrita, Sarau) — e isso já estava previsto pra ficar dividido entre o Módulo 4 (produção) e o Módulo 8 (projeto leitor), o que se confirma como a divisão certa.

**3. Sobre a ordem das 30 sequências que te passei:** não dá pra confirmar que está em ordem cronológica real de ano letivo — o site lista por ID interno/data de publicação, não por mês do calendário escolar. Não vale a pena tentar decifrar a ordem exata deles. O que importa pra gente é a ordem lógica de dificuldade (letra → sílaba → palavra → frase → texto → gênero → narrativa → gramática/oral), que é exatamente o que a estrutura de 4 bimestres já impõe — por isso a arquitetura abaixo é organizada pela nossa lógica de progressão, não pela ordem que você recebeu.

---

## Visão geral atualizada

| Bimestre | Módulo | Habilidades-núcleo | Sequências NE usadas como base | Status |
|---|---|---|---|---|
| 1º | M1 · Alfabeto e Consciência Fonológica | EF01LP04,06,07,08,09,10,11 | Qual é a letra, Transliteração, Compondo palavras, Pares mínimos, Se mudar de lugar, Se tirar qual palavra, O que começa com, Um pomar A-Z, Nomes dos colegas, Quantas letras têm, O que rima (v1/v2), Atividades de sistematização | 🟡 parcialmente refinado (3/7 jogos existem) |
| 1º | M2 · Leitura de Palavras e Primeiras Frases | EF01LP01,02,03,05,12 | Nome próprio, O mundo em versos, Personagens prediletos, Já sei ler, Um dois três parlendas | 🟡 criado, não refinado |
| 2º | M3 · Frases, Textos Curtos e Pontuação | EF01LP13,14,16,19 | Pontuação, Letra de Canção (parcial), Quem canta seus males espanta | ⚪ não iniciado |
| 2º | M4 · Primeiras Produções Escritas | EF01LP02,17,18,21 | Fotolegendas (modelo completo), Oficinas de escrita, Assembleias, Letra de Canção (produção) | ⚪ não iniciado |
| 3º | M5 · Compreensão de Textos e Gêneros | EF01LP15,20,22,24 | Fotolegendas (leitura/análise), Curiosidades, Slogans | ⚪ não iniciado |
| 3º | M6 · Narrativas e Recontagem | EF01LP25,26 | Contos acumulativos, Rodas de leitura | ⚪ não iniciado |
| 4º | M7 · Gramática Inicial e Pontuação Avançada | EF01LP14 (aprofundado) + além BNCC | — (conteúdo nosso, não achamos sequência NE dedicada a substantivo/verbo) | ⚪ não iniciado |
| 4º | M8 · Projeto Leitor e Dimensão Oral/Social | além BNCC + EF01LP23, EF15LP09-10,13,15-19 | Minisseminários, Rodas de leitura, Rodas de notícias, Assembleias, Letra de Canção (sarau) | ⚪ não iniciado |

---

## Motores de jogo reaproveitáveis (construir uma vez, usar em vários módulos)

Antes de detalhar módulo a módulo: em vez de programar cada atividade do zero, faz sentido construir 6 "motores" genéricos e parametrizar o conteúdo de cada módulo em cima deles.

1. **Motor de Pareamento com Distrator** — N pares certos + K opções erradas; usado em Fotolegendas, Nomes dos colegas, Slogans, O que começa com. É a mecânica mais repetida de todo o currículo.
2. **Motor de Bingo** — cartela + sorteio de item + marcar quem tem; usado em sílabas, sons, pares mínimos.
3. **Motor de Manipulação de Palavra** — tirar/trocar/completar 1 letra ou sílaba, ver a palavra virar outra (ou não); usado em "Se tirar", "Se mudar de lugar", Compondo palavras.
4. **Motor de Quadro Comparativo/Ficha** — classificar uma informação em categorias (só imagem/só texto/ambos; ou preencher campos de uma ficha técnica); usado em Fotolegendas plano 2, Curiosidades.
5. **Motor de Sequenciamento** — ordenar cartões/eventos na ordem certa; usado em Contos acumulativos.
6. **Motor de Escrita Espontânea com Rubrica** — a criança registra a resposta do seu jeito, sem correção binária na hora; comparação com a forma convencional depois, avaliada por rubrica de 3 níveis (Iniciante/Intermediário/Avançado) em vez de certo/errado; usado em O mundo em versos, Personagens prediletos, e como alternativa de avaliação em atividades de compreensão.

Cada módulo abaixo referencia esses motores em vez de descrever mecânica nova do zero, quando aplicável.

---

## M1 · Alfabeto e Consciência Fonológica (Bimestre 1)

**Objetivo:** dominar o sistema alfabético e a consciência fonológica antes de avançar pra leitura de palavra corrida.

**Jogos existentes (✅ refinados):**
- Monte a Sílaba — 5 níveis
- Caça-Letras — 5 níveis
- Som Inicial — 5 níveis (por letra; mantido, pois é conteúdo legítimo do currículo — ver "Um pomar de A a Z")

**Jogos novos a criar:**
- **Pares Mínimos** (motor de Pareamento) — ouvir uma palavra e escolher entre duas opções que diferem por 1 fonema só (ex.: FACA/VACA, PATO/GATO), com TTS real, não texto visual — validado tecnicamente pela sequência "Pares mínimos com consoantes homorgânicas".
- **Rimas** (motor de Bingo ou memória) — "animais que rimam", jogo de memória de pares que rimam.
- **Manipulação de Palavra** (motor de Manipulação) — "se tirar essa parte, que palavra sobra?", "se trocar essa letra, vira outra palavra?".

**Critério de módulo pronto:** todas as 6 atividades em nível 5 com ≥80% de mastery (mesmo padrão já usado).

---

## M2 · Leitura de Palavras e Primeiras Frases (Bimestre 1)

**Objetivo:** ler palavras isoladas com autonomia e começar a compor frases curtas.

**A refinar:** Leitura Rápida — dividir em 5 níveis, evoluindo de palavra isolada pra frase de 3-4 palavras nos níveis mais altos.

**Jogo novo:**
- **Escreva do Seu Jeito** (motor de Escrita Espontânea) — a criança "escreve" (seleciona letras/sílabas) uma palavra do jeito que acha certo, sem correção na hora; depois compara com a forma convencional. Avaliação por rubrica, não binária.

**Personalização (recorrente em várias sequências — Nome próprio, Personagens prediletos):** usar o nome do Benjamin e do Joaquim como conteúdo real em pelo menos uma atividade deste módulo.

---

## M3 · Frases, Textos Curtos e Pontuação (Bimestre 2)

**Objetivo:** ler textos curtos com entonação e reconhecer sinais de pontuação além das letras.

**Jogos novos:**
- **Sinal Certo** — ouvir uma frase (TTS com entonação) e escolher o sinal de pontuação correspondente (. ? !).
- **Rimas e Parlendas** (já previsto no currículo original, agora com mecânica clara) — recitar/completar parlendas conhecidas, praticar rima.

---

## M4 · Primeiras Produções Escritas (Bimestre 2)

**Objetivo:** produzir um gênero textual real (legenda), seguindo o processo completo identificado em Fotolegendas: observar imagem → ler exemplo real → analisar forma → praticar oral → produzir → revisar.

**Jogo novo (digital):**
- **Quadro Comparativo** (motor de Quadro/Ficha) — mostra uma foto real, pergunta o que dá pra saber só olhando, depois revela a legenda e pede pra classificar cada informação (só imagem / só legenda / os dois).

**Fora da tela (já previsto, agora com processo mais rico):**
- Missões de Escrita Assistida — pais registram o que a criança escreveu à mão, usando o mesmo padrão de "ler exemplo → produzir → revisar".
- Assembleia de regras da casa (inspirado em Assembleias) — atividade oral/social real em família.

---

## M5 · Compreensão de Textos e Gêneros (Bimestre 3)

**Objetivo:** reconhecer o formato de diferentes gêneros e interpretar texto além da decodificação.

**Jogos novos:**
- **Ficha Técnica** (motor de Quadro/Ficha) — preencher/reconhecer campos padronizados sobre um assunto (curiosidade sobre um animal, por exemplo).
- **Casa a Legenda Certa** (motor de Pareamento) — 4 fotos + 6 legendas (2 pegadinha), casar corretamente.
- **É Slogan?** — reconhecer características básicas de slogan/campanha (versão simplificada; slogan é conteúdo mais avançado no currículo deles).

---

## M6 · Narrativas e Recontagem (Bimestre 3)

**Objetivo:** identificar elementos de narrativa e recontar histórias.

**Jogos novos:**
- **Monte a Sequência** (motor de Sequenciamento) — ordenar cartões de uma história acumulativa (tipo "A Casa que Pedro Fez") na ordem certa.
- **Personagem, Onde e Quando** — múltipla escolha sobre elementos da narrativa lida.

**Fora da tela:** Recontar com apoio de imagem (gravação de áudio com os pais).

---

## M7 · Gramática Inicial e Pontuação Avançada (Bimestre 4)

**Objetivo:** noções lúdicas de substantivo/verbo e uso de pontuação na própria escrita.

Não encontramos sequência dedicada da Nova Escola pra substantivo/verbo no 1º ano — provavelmente porque é conteúdo "além" mesmo, antecipado do 2º ano, como já havíamos identificado. Mantemos como currículo nosso original:
- **Cesta do Substantivo/Verbo** — classificar palavras em duas cestas.
- **Sinal Certo (nível avançado)** — evolução do jogo do Módulo 3.

---

## M8 · Projeto Leitor e Dimensão Oral/Social (Bimestre 4)

**Objetivo:** consolidar hábito de leitura e primeiras práticas de fala em público/escuta social — tudo fora da tela, com o app como apoio.

**Inspirado em:** Minisseminários, Rodas de leitura, Rodas de notícias, Sarau de canções (Letra de Canção).

**O app entra como:**
- Gerador de roteiro pra apresentação oral de curiosidades.
- Checklist pros pais acompanharem leitura semanal.
- Banco de curiosidades pra pesquisar (ponte com o Módulo 5).

---

## O que ficou de fora de propósito

- **Slogans e campanhas publicitárias** aparecem no currículo deles com bastante profundidade (15 planos), mas achamos que é conteúdo mais adequado como "além" tardio do Módulo 5, não módulo próprio — o vocabulário e a abstração (persuasão, campanha) são mais pesados que o resto do 1º ano.
- **Interpretação de canção com o corpo** (dimensão cinestésica, de Letra de Canção) não vira jogo digital — fica registrada como sugestão de atividade física fora da tela, ligada ao Módulo 8.

---

## Próximo passo

Essa é a arquitetura completa da trilha, sem nenhuma linha de código alterada ainda. Falta decidir com você: (a) começar a implementar módulo por módulo, na ordem do bimestre (M1 → M2 → ...), ou (b) priorizar primeiro os "motores de jogo" reaproveitáveis (pareamento, bingo, manipulação, quadro, sequenciamento, escrita espontânea) como peças de código genéricas, e só depois plugar o conteúdo de cada módulo em cima deles.

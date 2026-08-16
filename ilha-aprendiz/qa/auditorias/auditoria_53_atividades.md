# Auditoria das 53 Atividades — Fila de Transformação do Motor de Ensino

*Criado em 2026-08-16. Lista real das 53 atividades (25 Português + 28 Matemática), extraída de `pedagogia/CURRICULO_BNCC_PORTUGUES.md` e `pedagogia/CURRICULO_BNCC_MATEMATICA.md`. A coluna "Tem aula hoje?" reflete o estado real do código, documentado em `pedagogia/MOTOR_DE_ENSINO.md`. A coluna "Classificação proposta" é o trabalho que falta — **nenhuma linha foi auditada ainda além das 2 que já têm aula**; preencher com direto-pra-prática / demonstração rápida / mini-aula completa é o próximo passo mencionado em `pedagogia/MOTOR_DE_ENSINO.md` ("O que NÃO foi feito ainda").*

## Português (25)

| Módulo | Atividade | Tem aula hoje? | Classificação proposta |
|---|---|---|---|
| M1 | Monte a Sílaba | Não | a auditar |
| M1 | Caça-Letras | Não | a auditar |
| M1 | Som Inicial | Não | a auditar |
| M1 | Pares Mínimos | Não | a auditar |
| M1 | Rimas | Não | a auditar |
| M1 | Troca-Letra | Não | a auditar |
| M1 | Maiúscula ↔ Minúscula | Não | a auditar |
| M2 | Leitura Rápida | Não | a auditar |
| M2 | Leia a Frase | Não | a auditar |
| M2 | Escrita Certa | Não | a auditar |
| M3 | Parlendas e Trava-Línguas | Não | a auditar |
| M3 | Som do Meio e do Fim | Não | a auditar |
| M3 | Pontuação Certa | Não | a auditar |
| M4 | Complete a Lista | Não | a auditar |
| M4 | Texto do Dia a Dia | Não | a auditar |
| M4 | Parlenda de Cor | Não | a auditar |
| M5 | Sinônimos e Antônimos | Não | a auditar |
| M5 | Qual é o Gênero? | Não | a auditar |
| M5 | Ler e Responder | Não | a auditar |
| M6 | Elementos da História | Não | a auditar |
| M6 | Reconte a História | Não | a auditar |
| M6 | Invente o Final | Não | a auditar |
| M7 | Substantivo ou Verbo? | Não | a auditar |
| M7 | Que Ação Combina? | Não | a auditar |
| M7 | Pontuação no Textinho | Não | a auditar |

## Matemática (28)

| Módulo | Atividade | Tem aula hoje? | Classificação proposta |
|---|---|---|---|
| M1 | Quantos Tem? | Não | a auditar |
| M1 | Conta Comigo | Não | a auditar |
| M1 | Qual Tem Mais? | Não | a auditar |
| M2 | Conta Até 100 | Não | a auditar |
| M2 | Pulando de Tantos em Tantos | Não | a auditar |
| M3 | Qual é Maior? | Não | a auditar |
| M3 | Organize por Tamanho | Não | a auditar |
| M3 | O Que Vem Depois? | Não | a auditar |
| M4 | Fatos da Soma | Não | a auditar |
| M4 | Problemas de Somar | Não | a auditar |
| M5 | Fatos da Subtração | Não | a auditar |
| M5 | Problemas de Tirar | Não | a auditar |
| M5 | Soma ou Subtração? | Não | a auditar |
| M6 | Monte o Número | **Sim** (`monte_o_numero`) | Mini-aula completa (já implementada) |
| M6 | Dezena e Unidade | **Sim** (`dezena_e_unidade`) | Mini-aula completa (já implementada) |
| M7 | Onde Está? | Não | a auditar |
| M7 | Siga o Mapa | Não | a auditar |
| M8 | Formas no Mundo | Não | a auditar |
| M8 | Nomeie a Forma | Não | a auditar |
| M9 | Comparar de Verdade | Não | a auditar |
| M9 | Cheio ou Vazio, Pesado ou Leve | Não | a auditar |
| M10 | Ordem do Dia | Não | a auditar |
| M10 | Que Dia é Hoje? | Não | a auditar |
| M10 | Escreva a Data | Não | a auditar |
| M11 | Quanto Vale? | Não | a auditar |
| M11 | Junte pra Comprar | Não | a auditar |
| M12 | Vai Acontecer? | Não | a auditar |
| M12 | Leia o Gráfico | Não | a auditar |

## Como preencher "Classificação proposta"

Três categorias, definidas em `pedagogia/MOTOR_DE_ENSINO.md`:

1. **Pode ir direto pra prática** — habilidade que a criança plausivelmente já traz de fora do app (ex.: reconhecer letra), onde uma aula prévia seria redundante.
2. **Precisa só de uma demonstração rápida** — um exemplo resolvido antes da prática, sem o fluxo completo de 4 passos.
3. **Precisa de mini-aula completa** — conceito genuinamente novo pra idade (como dezena/unidade foi), merece o fluxo Aprender → Ver exemplo → Fazer comigo → Agora é você inteiro.

Esta auditoria fica pendente até ser explicitamente priorizada — não está no topo do `docs/ROADMAP.md` atual (persistência vem primeiro), mas o esqueleto de dados já está aqui pronto pra ser preenchido quando chegar a vez.

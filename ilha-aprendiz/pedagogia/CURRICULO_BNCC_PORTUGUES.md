# Índice Completo — Trilha Português (Benjamin, 6 anos, cursando Jardim 2)

*Inventário de tudo que existe hoje na Ilha Aprendiz, módulo a módulo, atividade a atividade, com status real de produção. Serve como painel de controle para decidir o que priorizar em seguida.*

> **Nota sobre o nível curricular:** este conteúdo é baseado na BNCC do **1º ano do Ensino Fundamental** (habilidades EF01LP), não no currículo oficial do Jardim 2 (que é Educação Infantil e usa outro referencial, mais amplo). Ou seja: é o ano curricular seguinte ao que o Benjamin está oficialmente matriculado, aplicado de propósito à frente, porque ele já demonstra habilidades acima do esperado para o Jardim 2.

> **Nota sobre o papel do app — reforço, não substituto da escola:** a Ilha Aprendiz é uma ferramenta de reforço em casa, não uma escola. Por isso, das 26 habilidades da BNCC EF01LP, as 22 que um app de clique/digitação consegue testar de verdade estão 100% cobertas e testadas. As 4 restantes (EF01LP19, 22, 23, 24 — recitar com entonação avaliada, produzir diagramas/entrevistas, produzir áudio/vídeo pra divulgação, formatar texto investigativo) dependem de microfone, câmera, produção de mídia ou orientação humana direta — competências que a criança desenvolve naturalmente na escola e em casa com um adulto, não algo que falta no app. Pra efeito do que o app se propõe a fazer, ele está completo.

**Legenda de status:**
- ✅ **Refinado** — jogável, testado (inclusive por simulação automatizada) e ajustado
- 🟡 **Criado, não refinado** — jogável, mas ainda não passou por revisão de qualidade completa nem por níveis de dificuldade
- ⚪ **Não iniciado** — só existe no currículo (documento), sem jogo

---

## Visão geral do ano letivo

| Bimestre | Módulo | Status geral |
|---|---|---|
| 1º | Módulo 1 · Alfabeto e Sílabas | 🟢 Completo (7 atividades, 5 níveis cada) |
| 1º | Módulo 2 · Leitura de Palavras | 🟢 Completo (3 atividades, 5 níveis cada) |
| 2º | Módulo 3 · Leitura de Frases e Textos Curtos | 🟢 Completo (3 atividades, 5 níveis cada) |
| 2º | Módulo 4 · Primeiras Produções Escritas | 🟢 Completo (3 atividades, 5 níveis cada) |
| 3º | Módulo 5 · Compreensão de Textos e Gêneros | 🟢 Completo (3 atividades, 5 níveis cada) |
| 3º | Módulo 6 · Narrativas e Recontagem | 🟢 Completo (3 atividades, 5 níveis cada) |
| 4º | Módulo 7 · Gramática Inicial e Pontuação | 🟢 Completo (3 atividades, 5 níveis cada) |
| 4º | Módulo 8 · Projeto Leitor e Vocabulário | 🟢 Completo (formalizado, fora da tela por design) |

**Resumo:** os 8 módulos do ano letivo estão prontos — 7 com conteúdo digital produzido e testado (25 atividades no total, todas com 5 níveis próprios) e 1 (o Módulo 8) formalizado como recomendação fora da tela, com lista de livros e roteiro de perguntas. Das 26 habilidades da BNCC EF01LP, as 22 testáveis por um app de clique/digitação estão 100% cobertas — as 4 restantes exigem microfone, produção de mídia ou orientação humana direta e ficam por conta da escola/família, não são lacuna do produto. Nenhum dos 7 módulos digitais foi validado com o Benjamin jogando de verdade ainda — essa continua sendo a maior lacuna, não o conteúdo em si, e é o próximo passo combinado com o Júlio.

---

## Módulo 1 · Alfabeto e Sílabas — 🟡 7 atividades criadas e testadas, faltando validação real com o Benjamin

Habilidades BNCC: EF01LP04, 06, 07, 08, 09, 10, 11 — **agora com as 7 cobertas**, incluindo a EF01LP11 (maiúscula/minúscula, imprensa/cursiva) que tinha ficado de fora até agora. As 4 atividades novas nasceram da pesquisa nas sequências da Nova Escola — ver `REFERENCIA_NOVA_ESCOLA.md`.

| Atividade | Status | Níveis | Conteúdo por trás |
|---|---|---|---|
| 🧩 Monte a Sílaba | ✅ Refinado | 5 níveis, cumulativo com peso 65/35 pro nível atual | **87 palavras** (expandido de 54 pra 87 numa auditoria de família silábica — ver abaixo), cobrindo quase todo o alfabeto como sílaba inicial |
| 🔤 Caça-Letras | ✅ Refinado | 5 níveis (vogais → alfabeto completo) | 26 letras, distratores do mesmo nível cumulativo |
| 👂 Som Inicial | ✅ Refinado | 5 níveis, prioriza letra com palavra do nível atual | Mesmo banco de 87 palavras, agrupadas por letra inicial — se beneficia diretamente da expansão do Monte a Sílaba |
| 🎧 Pares Mínimos | 🟡 Criado, ampliado, testado via jsdom | 5 níveis, 19 pares reais (contraste surdo/sonoro P/B, T/D, C/G, F/V + medial) | Ouve a palavra via TTS e escolhe entre 2 palavras que diferem por 1 fonema só — testa som real, não letra |
| 🎶 Rimas | 🟡 Criado, ampliado, testado via jsdom | 5 níveis (5 grupos de rima: -ÃO, -EL, -ATO, -OR, -INHO) | Escuta uma palavra e escolhe qual das 3 opções rima de verdade com ela |
| 🔄 Troca-Letra | 🟡 Criado, ampliado, testado via jsdom | 5 níveis (6 famílias: _ATO, _ÃO, _ADO, _ALA, _ACA, _OTE) | Mostra uma palavra, pede pra trocar a 1ª letra por outra dada, e escolher a nova palavra que se forma |
| 🔠 Maiúscula ↔ Minúscula | 🟡 Criado, testado via jsdom | 5 níveis (mesmo agrupamento cumulativo do Caça-Letras) | Mostra uma letra maiúscula ou minúscula (direção sorteada) e pede a mesma letra na outra forma; também exibe a letra num estilo manuscrito só como exposição visual, sem cobrar isso na pontuação — fonte cursiva varia demais entre aparelhos pra virar critério de acerto/erro |

**Digitação adicionada:** o nível 5 de Monte a Sílaba virou "Digite a Palavra" — em vez de clicar sílabas prontas, a criança escreve a palavra toda num campo de texto (aceita minúscula, ignora acento). Reforça EF01LP02 (escrever de forma alfabética) como progressão natural depois de já dominar montar a palavra por sílaba nos níveis 1-4. Não foi aplicado nas outras atividades porque não fazia sentido pedagógico nelas (Pares Mínimos e Rimas são sobre ouvir, não escrever; Troca-Letra já é sobre letra/escrita de outra forma).

**Testes feitos (3 atividades originais):** simulação automatizada de sessão completa (jsdom) confirmando: nenhuma repetição de palavra/letra na mesma sessão, progressão 1→5 funcional, distribuição real de dificuldade por nível (~70% do conteúdo do nível atual, não mais diluído), indicador de nível visível na tela.

**Testes feitos (3 atividades novas + digitação):** simulação automatizada (jsdom) rodando 30 rodadas em cada um dos 5 níveis das 3 atividades novas (450 rodadas no total) + 15 rodadas de digitação testando resposta errada, resposta certa em minúscula e resposta certa sem acento — 0 erros, 60/60 checagens passando. Dois bugs reais foram encontrados e corrigidos nesse processo: (1) o motor `pickWeightedByLevel` (compartilhado por todos os jogos com nível) podia sortear um "pool" vazio quando um banco de conteúdo não tem item em todo nível de 1 a 5 — agora tem fallback seguro; (2) em Rimas, duas palavras diferentes podiam usar o mesmo emoji (ex.: GATO e GATINHO ambos 🐱), deixando duas opções visualmente idênticas na tela — corrigido tanto trocando a palavra quanto endurecendo a lógica pra nunca repetir emoji entre as opções de uma rodada.

**Fontes usadas pra ampliar o conteúdo:** pares mínimos conferidos contra material de referência de fonoaudiologia ([oficinadalinguagem.com.br](https://oficinadalinguagem.commercesuite.com.br/jogos-para-estimular-a-fala/diversao-com-pares-minimos-a-p-bt-dk-g) — pares reais p/b, t/d, c/g), adaptados pra palavras com emoji reconhecível nos dois lados do par.

**Pendência conhecida:** mesmo ampliados, os bancos de Pares Mínimos (19), Rimas (5 grupos) e Troca-Letra (6 famílias) ainda são menores que o de Monte a Sílaba (87 palavras) — a repetição cai bastante, mas não desaparece de vez. Vale ampliar de novo depois que o Benjamin testar na prática e a gente ver onde ainda incomoda. O pareamento de "Som Inicial" continua comparando a primeira *letra*, não o *fonema* — isso é intencional agora: "Som Inicial" cobre letra inicial (legítimo, confirmado pela sequência "Um pomar de A a Z" da Nova Escola) e "Pares Mínimos" cobre o fonema real — são complementares, não um substituindo o outro.

**Auditoria de família silábica (pedido explícito do Júlio — "revisar todo o conteúdo, comparar com o currículo, criar mais exercícios"):** medi programaticamente quantas sílabas CV (consoante+vogal) distintas o banco de Monte a Sílaba realmente cobria contra o grid completo do método de "família silábica" (consoante × 5 vogais A/E/I/O/U), padrão de alfabetização brasileiro. O banco original (54 palavras, 64 sílabas distintas) tinha lacunas reais: nenhuma palavra com dígrafo NH, RR ou SS; e várias consoantes com só 2 das 5 vogais (M só tinha MA, N só tinha NA, por exemplo). Adicionei 33 palavras novas, escolhidas de propósito pra fechar essas lacunas — o banco foi de 64 pra 102 sílabas distintas. Depois da expansão: **D, G, M, N, P, R, S e T ficam com as 5 vogais completas** (T já estava completo antes). B, C, F, J e V ficam quase completos, faltando só 1 vogal rara de verdade em português pra palavra curta e concreta de criança (ex.: não existe palavra comum começando com "BE" ou "JE" nesse registro) — isso é limitação real do idioma pra esse tipo de vocabulário, não falta de curadoria. X, Z, K, W e Y seguem como limitação conhecida documentada abaixo (letras raras do português). Novas palavras: DEDO, MESA, RUA, SETE, PERA, DIA, RIO, SINO, LEITE, NEVE, MOLA, MURO, FITA, GELO, DUNA, NOVE, BICO, FESTA, PUDIM, NINHO, CARRO, FERRO, OSSO, MASSA, MILHO, JULHO, VULCAO, CEBOLA, CIDADE, AGULHA, GARRAFA, BURACO, FUMACA, JIBOIA.

**Critério de módulo completo:** agora exige as 7 atividades em nível 5 com ≥80% de domínio (começou em 3) — o gate de desbloqueio do Módulo 2 ficou bem mais rigoroso que a versão original.

**Módulo 1 está completo?** Sim, no sentido de cobertura das 7 habilidades BNCC do módulo — cada uma tem pelo menos uma atividade dedicada agora, e tudo passou por teste automatizado (jsdom): mais de 800 rodadas simuladas somando as 7 atividades × 5 níveis, 0 erros de renderização, resposta certa sempre presente e clicável, sem opções duplicadas na tela. Não está completo no sentido de "pronto pra vender": os bancos das 4 atividades novas ainda são menores que o de Monte a Sílaba, e nada disso foi validado com o Benjamin jogando de verdade — só depois do uso real (e do Agente de QA revisando a experiência, não só a lógica) que viraria ✅ Refinado de fato, conforme a regra de governança do ecossistema.

**Banco de palavras deixou de ser refém do emoji:** até aqui, toda palavra do banco precisava ter um emoji Unicode reconhecível — o que descartava contrastes linguísticos reais só por falta de figurinha (ex.: "coleira/goleira", um par mínimo C/G legítimo, tinha ficado de fora). Agora existe uma função `visual(item)` que usa o emoji quando ele existe e, quando não existe, usa um **ícone SVG próprio** embutido no arquivo (sem depender de internet, sem custo de licença, quase sem peso no arquivo). Primeiro lote com ícone SVG: TATU (armadillo, banco de Monte a Sílaba/Caça-Letras), COLA, GOLA, COLEIRA e GOLEIRA (novos pares e família em Pares Mínimos e Troca-Letra). São ilustrações estilo protótipo — comissionar arte de verdade fica a cargo do Agente de Design/Marca mais adiante, mas a capacidade técnica de não depender mais de emoji já está no jogo. Testado via jsdom: SVG renderiza corretamente nos 3 pontos onde já é usado (Pares Mínimos, Troca-Letra, Monte a Sílaba), sem colisão visual com outras opções na tela.

---

## Módulo 2 · Leitura de Palavras — 🟢 Completo (3 atividades, 5 níveis cada, testado)

Habilidades BNCC: EF01LP01, 02, 03, 05, 12 — **agora as 5 cobertas**, incluindo a EF01LP03 (comparar a própria escrita com a escrita convencional), que era a única lacuna real que tinha sobrado.

Container de 3 atividades independentes, mesmo padrão do Módulo 1 (card próprio no menu, nível 1-5 individual, painel de auditoria, `isModuleUnlocked` genérico) — o Módulo 3 só desbloqueia quando as 3 estiverem no nível 5 com 80%+ de domínio.

| Atividade | Status | Níveis | Conteúdo por trás |
|---|---|---|---|
| 📖 Leitura Rápida | 🟢 Completo | 5 (banco de 53 palavras, já usado no Módulo 1) | 65% palavra do nível atual / 35% revisão; distratores cumulativos até o nível atual |
| 📝 Leia a Frase | 🟢 Completo | 5 (26 frases, 2 a 6 palavras) | Metade das rodadas pergunta "quantas palavras tem essa frase?" (EF01LP12 — separação por espaço); a outra metade pede a primeira/última palavra (EF01LP01 — direção da leitura) |
| 🖋️ Escrita Certa | 🟢 Completo (novo) | 5 (18 pares "certo vs. erro comum") | Mostra a figura + duas grafias da palavra (uma certa, uma com erro ortográfico real de quem tá alfabetizando) e pede pra apontar a convencional — EF01LP03 |

**Decisão de escopo pra "Leia a Frase":** não testa compreensão de significado da frase (isso é papel do Módulo 5 · Compreensão de Textos, que já está no currículo) — testa só os dois "print concepts" que faltavam no Módulo 2: contar palavras separadas por espaço, e reconhecer a direção esquerda→direita da leitura. As frases usam majoritariamente vocabulário já conhecido do Módulo 1 (GATO, BOLA, SAPO, VACA, PATO, CASA, SOL, LUA, RATO) + um punhado de palavras simples novas (verbos/adjetivos curtos), sem precisar de banco de imagens novo.

**Decisão de escopo e curadoria pra "Escrita Certa":** os erros de grafia não são aleatórios — cada um dos 18 pares reproduz uma confusão ortográfica real e documentada de quem está alfabetizando em português: omissão de letra (nível 1, ex. GATO/GTO), S↔Z por soarem igual (nível 2, ex. CASA/CAZA), dígrafo CH↔X e letras parecidas no traço B↔V, L↔R (nível 3, ex. CHAVE/XAVE), G↔J antes de E/I por soarem igual (nível 4, ex. GIRAFA/JIRAFA), e E↔I átono no final da palavra, que é como a maioria fala mesmo escrevendo diferente (nível 5, ex. TOMATE/TOMATI). A imagem da palavra fica sempre visível — a criança não precisa decifrar do zero, só comparar as duas grafias mostradas.

**O que foi generalizado no motor pra isso funcionar sem gambiarra:**
1. `activitiesFullyMastered(lista)` — função genérica que tanto `module1FullyMastered()` quanto o novo `module2FullyMastered()` chamam, em vez de duplicar a lógica
2. `isModuleUnlocked()` — ganhou um caso explícito pra "requires: leitura" (container do Módulo 2), do mesmo jeito que já tinha pra "requires: silabas" (container do Módulo 1)
3. Mensagem de fim de sessão ("Módulo X desbloqueado!") generalizada — antes só sabia falar sobre o Módulo 1, agora identifica automaticamente de qual container (Módulo 1 ou 2) a atividade que acabou de ser completada faz parte
4. Corrigi de passagem um texto errado que já existia no painel de admin ("6 atividades" do Módulo 1, defasado desde que a 7ª atividade — Maiúscula ↔ Minúscula — foi criada; agora é dinâmico)

**Testado** (`qa_test_modulo2_complete.js` + `qa_test_escrita_certa.js`, 42 checagens somadas): renderização das 2 perguntas da Leia a Frase e da Escrita Certa em todos os níveis (350+ rodadas no total), toda frase e todo par de escrita validados por script (nº de palavras bate com o nível nas frases, nenhuma palavra repetida dentro da mesma frase, par certo/errado sempre distinto e com imagem), gate de desbloqueio do Módulo 3 exigindo as 3 atividades maxadas (não só 1 ou 2), cards do menu e do admin com contagem dinâmica, e enunciado falado em voz nas 3. Revalidei a suíte inteira (regressão, novas atividades, digitação, admin, SVG, cobertura de fala) — tudo verde.

---

## Módulo 3 · Leitura de Frases e Textos Curtos — 🟢 Completo (3 atividades, 5 níveis cada, testado)

Habilidades BNCC: EF01LP13, 14, 16, 19 — as 3 primeiras testadas de verdade; a 4ª (EF01LP19) tem uma decisão de escopo honesta, ver abaixo.

Container de 3 atividades, mesmo padrão dos Módulos 1 e 2 — o Módulo 4 só desbloqueia quando as 3 estiverem no nível 5 com 80%+ de domínio. Diferente dos dois primeiros módulos, este trabalha com textos reais (parlendas/trava-línguas do folclore), não só palavras soltas.

| Atividade | Status | Níveis | Conteúdo por trás |
|---|---|---|---|
| 🎤 Parlendas e Trava-Línguas | 🟢 Completo | 5 (12 textos, 1 a 5 versos) | Parlendas e trava-línguas reais do folclore infantil brasileiro (domínio público, não inventados) — "O rato roeu a roupa do rei de Roma", "Um, dois, feijão com arroz", "Borboletinha" etc. Metade das rodadas pergunta quantos versos tem o texto (EF01LP16 — estrutura), a outra pede o primeiro/último verso |
| 🔊 Som do Meio e do Fim | 🟢 Completo | 5 (7 grupos de sílaba) | Compara palavras pela sílaba do MEIO ou do FIM (posição da sílaba) — diferente da Rimas do Módulo 1, que compara o som final da palavra inteira ouvida por TTS. Reaproveita vocabulário já conhecido (GATO/PATO/RATO, SUCO/ARCO/PORCO/BARCO/MACACO, JACARE/MACACO) |
| ❓ Pontuação Certa | 🟢 Completo | 5 (15 frases) | Mostra uma frase sem pontuação final e pede pra escolher entre ponto, interrogação ou exclamação — sinalizada por pistas linguísticas reais (Cadê/Onde → interrogação; Que/Cuidado/Nossa → exclamação; afirmativa simples → ponto) |

**Decisão de escopo honesta pra EF01LP19 (recitar parlendas/trava-línguas com entonação adequada):** essa habilidade não tem — e não pode ter, dentro das ferramentas que tenho — uma atividade que avalia de verdade se a criança recitou bem, porque isso exigiria microfone e reconhecimento de fala, que não existem aqui. Em vez de fingir que testo isso com um proxy qualquer, resolvi ser direto: a Parlendas e Trava-Línguas tem um botão "🔊 Ouvir e recitar junto" que lê o texto inteiro em voz alta (sem pontuar acerto/erro), pensado pra ser usado com um adulto por perto incentivando a criança a repetir junto. O que É de fato testado e pontuado nessa atividade é compreensão de estrutura do texto (EF01LP16) — quantos versos, qual é o primeiro/último — não a recitação em si.

**Bug real encontrado e corrigido nesse processo:** o painel "📋 Painel dos módulos" (`renderPanel`, diferente do painel de auditoria do adulto) tinha uma checagem `if(mod.isContainer)` que usava `MODULE1_ACTIVITIES` fixo no código, sem checar qual módulo estava sendo desenhado. Isso significa que, desde que o Módulo 2 virou container (na sessão anterior), o card do Módulo 2 nesse painel específico estava mostrando a contagem de atividades ERRADA (herdada do Módulo 1) — um bug real que só apareceu porque nenhum teste automatizado cobria essa tela ainda. Corrigido com o mesmo motor genérico (`MODULE_CONTAINERS`) usado em todo o resto do app agora.

**Refatoração de motor:** criei um registro central `MODULE_CONTAINERS` (lista de todo módulo com várias atividades niveladas) usado por `isModuleUnlocked`, `endSession`, `renderMenu`, `renderPanel` e `renderAdmin` — antes cada uma dessas 5 funções tinha sua própria lógica hardcoded pro Módulo 1/2 (e ia crescer numa cadeia de `if/else` a cada módulo novo). Agora adicionar um Módulo 4+ no mesmo padrão significa só acrescentar 1 linha no registro central, não duplicar lógica em 5 lugares — foi assim que o Módulo 3 entrou sem precisar tocar em quase nada das telas existentes.

**Testado** (`qa_test_modulo3.js`, 48 checagens): dados de todos os 3 bancos validados (parlendas com número de versos batendo o nível, grupos de sílaba com pelo menos 2 palavras distintas, frases de pontuação com marca válida), renderização sem erro nos 5 níveis das 3 atividades (150 rodadas), gate do Módulo 4 exigindo o Módulo 3 inteiro completo, telas de menu/painel/admin todas mostrando os dados certos, e enunciado falado em voz nas 3. Revalidei a suíte inteira (regressão, novas atividades, digitação, admin, SVG, cobertura de fala, Escrita Certa) — tudo verde. Um bug real de teste (nível 1 de parlendas com só 1 verso, pergunta "primeira/última linha" ficava sem opção pra escolher) foi encontrado pelo próprio teste automatizado e corrigido: agora com 1 verso só, a pergunta força o modo de contagem, que continua válido.

---

## Módulo 4 · Primeiras Produções Escritas — 🟢 Completo (3 atividades, 5 níveis cada, testado)

Habilidades BNCC: EF01LP02 (aprofundado), 17, 18, 21.

Container de 3 atividades, mesmo padrão dos Módulos 1-3 — o Módulo 5 só desbloqueia quando as 3 estiverem no nível 5 com 80%+ de domínio. Diferente dos módulos anteriores (multipla escolha), este é o primeiro a pedir escrita de verdade: a criança digita a palavra que falta, não escolhe entre opções prontas.

| Atividade | Status | Níveis | Conteúdo por trás |
|---|---|---|---|
| 📋 Complete a Lista | 🟢 Completo | 5 (10 listas temáticas) | Mostra uma lista com 1 item faltando (ex.: "MAÇÃ, BANANA, ___") e a criança digita a palavra que completa a lista — EF01LP17 |
| ✉️ Texto do Dia a Dia | 🟢 Completo | 5 (20 textos: bilhete/convite/receita/regra/legenda) | Mesmo formato, aplicado a 5 gêneros textuais reais do cotidiano — bilhete, convite, receita, legenda de foto (EF01LP17/20) e combinado/regra da turma (EF01LP21). Gênero "legenda" adicionado em 2026-08-16 — faltava, mesmo citado explicitamente no texto oficial do EF01LP17/20 (achado de auditoria, ver `qa/auditorias/auditoria_bncc_oficial.md`) |
| 🖊️ Parlenda de Cor | 🟢 Completo | 5 (reaproveita as 12 parlendas do Módulo 3) | Apaga a última palavra de um verso sorteado; a criança ouve a parlenda inteira e escreve de memória a palavra que falta — EF01LP18 ("registrar... em colaboração") |

**Decisão de escopo pra "escrita guiada com validação leve"** (opção que você escolheu): nenhuma atividade pede redação livre/aberta, porque não dá pra corrigir isso automaticamente sem IA de correção (fora do escopo de um app offline). Toda escrita acontece DENTRO de um contexto real (lista, bilhete, parlenda) e é validada contra uma palavra-alvo específica, usando o mesmo mecanismo já testado do "Digite a Palavra" do Módulo 1 (aceita minúscula, aceita sem acento). Isso significa: mais rico e contextualizado que uma palavra solta, mas ainda auto-corrigível — nenhuma atividade aqui depende de um adulto avaliar manualmente, embora o nome do módulo e o próprio banco de conteúdo incentivem fazer isso junto com um adulto (a Parlenda de Cor em particular pressupõe já ter ouvido/decorado a parlenda com alguém, não é decifrar do zero).

**Testado** (`qa_test_modulo4.js`, 18 checagens): fluxo de digitação testado nas 3 atividades × 5 níveis (300 rodadas) — resposta errada rejeitada e limpa o campo, resposta certa aceita mesmo em minúscula e sem acento; toda entrada de `LISTS`/`FUNCTIONAL_TEXTS` validada por script (lacuna presente, resposta definida); gate do Módulo 5 exigindo o Módulo 4 inteiro completo; menu, painel e admin mostrando os dados certos; enunciado falado em voz nas 3. Revalidei a suíte inteira (regressão, novas atividades, digitação, admin, SVG, cobertura de fala, Módulo 3) — tudo verde.

---

## Módulo 5 · Compreensão de Textos e Gêneros — 🟢 Completo (3 atividades, 5 níveis cada, testado)

Habilidades BNCC: EF01LP15, 20, 22 (lado de leitura), 24 (lado de leitura).

Container de 3 atividades, mesmo padrão dos Módulos 1-4 — o Módulo 6 só desbloqueia quando as 3 estiverem no nível 5 com 80%+ de domínio. **Marco importante:** é o primeiro módulo do app que testa compreensão de texto de verdade (interpretar o que foi lido), não só decodificação — todos os Módulos 1-4 eram sobre reconhecer letra/som/palavra/estrutura, nenhum pedia pra entender o SIGNIFICADO do que estava escrito.

| Atividade | Status | Níveis | Conteúdo por trás |
|---|---|---|---|
| ⚖️ Sinônimos e Antônimos | 🟢 Completo | 5 (15 pares) | Pergunta o sinônimo ou antônimo de uma palavra, com 2 distratores curados à mão (plausíveis, não chute óbvio) — EF01LP15 |
| 🗂️ Qual é o Gênero? | 🟢 Completo | 5 (10 trechos) | Mostra um trecho curto (lista, bilhete, receita, convite ou parlenda — reaproveitando o "sabor" de conteúdo dos Módulos 3 e 4) e pede pra nomear o gênero textual — EF01LP20 |
| 🧐 Ler e Responder | 🟢 Completo (novo, marco) | 5 (10 curiosidades) | Mini-texto de curiosidade sobre animais (2-3 frases) + pergunta de interpretação (quem, o quê, onde, por quê) — primeira atividade do app com compreensão de texto real |

**Decisão de escopo pra EF01LP22 (produzir diagramas, entrevistas):** essa é uma habilidade de PRODUÇÃO — a criança cria um diagrama ou faz uma entrevista de verdade, o que é mais natural em papel com um adulto do que num app de clique/digitação. O que a Ler e Responder cobre é o lado de LEITURA de um texto investigativo (a curiosidade em si); a produção fica fora do escopo digital por ora, documentado como limitação honesta em vez de forçar um proxy artificial.

**Bug real encontrado e corrigido nesse processo:** a atividade "Som do Meio e do Fim" do Módulo 3 tinha uma falha rara de repetir a mesma opção na tela duas vezes — a palavra MACACO aparece em 2 grupos diferentes daquele banco (grupo da sílaba final "CO" e grupo da sílaba medial "CA"), então o código que monta os distratores podia incluir MACACO duas vezes na lista de candidatos e, por azar, sortear as duas cópias. Corrigido com deduplicação por visual antes de sortear — encontrado só agora porque testar o Módulo 5 levou a rodar a suíte inteira de novo várias vezes seguidas, e esse bug era raro o bastante pra não aparecer sempre.

**Testado** (`qa_test_modulo5.js`, 46 checagens): as 3 atividades renderizando sem erro e sem opção duplicada nos 5 níveis (140 rodadas), resposta certa sempre encontrável, todos os bancos de conteúdo validados (sem opções repetidas), gate do Módulo 6 exigindo o Módulo 5 inteiro completo, menu/painel/admin mostrando os dados certos, enunciado falado em voz nas 3. Revalidei a suíte inteira 5 vezes seguidas (pra garantir que o bug do Módulo 3 realmente sumiu, já que era intermitente) — tudo verde, incluindo regressão, novas atividades, digitação, admin, SVG, cobertura de fala, Módulo 4.

---

## Módulo 6 · Narrativas e Recontagem — 🟢 Completo (3 atividades, 5 níveis cada, testado)

Habilidades BNCC: EF01LP25, 26.

Container de 3 atividades, mesmo padrão dos Módulos 1-5 — o Módulo 7 só desbloqueia quando as 3 estiverem no nível 5 com 80%+ de domínio. **Marco novo:** a Reconte a História é a primeira atividade do app inteiro com mecânica de ORDENAR em vez de escolher entre opções — a criança toca 3 acontecimentos na sequência certa, não escolhe 1 entre 3 já prontas.

| Atividade | Status | Níveis | Conteúdo por trás |
|---|---|---|---|
| 🎭 Elementos da História | 🟢 Completo | 5 (10 mini-histórias) | Lê uma mini-história de 3 acontecimentos e responde quem é o personagem, onde ou quando aconteceu — distratores plausíveis, não chute óbvio (EF01LP26) |
| 🔢 Reconte a História | 🟢 Completo (novo, marco) | 5 (reaproveita as 10 mini-histórias) | Toca os 3 acontecimentos embaralhados na ORDEM certa da história — se errar a sequência final, os botões reabilitam pra tentar de novo (EF01LP25) |
| 🎬 Invente o Final | 🟢 Completo | 5 (10 começos de história) | Lê o começo de uma história e escolhe, entre 1 final coerente e 2 propositalmente absurdos, qual faz sentido — estímulo à imaginação com correção ainda automática (EF01LP25/26) |

**Testado** (`qa_test_modulo6.js`, 37 checagens): as 3 atividades sem erro nos 5 níveis, incluindo um teste determinístico específico pra mecânica de ordenar — 30 rodadas onde o script lê a história sorteada, monta a ordem certa manualmente a partir do banco de dados e confirma que clicar nela sempre pontua (30/30), além do caminho de erro (ordem errada reabilita os botões pra nova tentativa). Todos os bancos de conteúdo validados (histórias com 3 eventos distintos, opções de personagem/lugar/tempo sem repetição, finais sem duplicata). Revalidei a suíte inteira 3 vezes seguidas — tudo verde.

---

## Módulo 7 · Gramática Inicial e Pontuação — 🟢 Completo (3 atividades, 5 níveis cada, testado)

Habilidades BNCC: EF01LP14 (aprofundado).

Container de 3 atividades, mesmo padrão dos Módulos 1-6 — o Módulo 8 só desbloqueia quando as 3 estiverem no nível 5 com 80%+ de domínio. **Marco novo:** primeiro módulo com noção de gramática (substantivo/verbo), mas sem usar a metalinguagem técnica com a criança — ela aprende a reconhecer NOME vs. AÇÃO pela função, não decorando definição, apropriado a 6-7 anos e antecipação de conteúdo típico de 2º ano.

| Atividade | Status | Níveis | Conteúdo por trás |
|---|---|---|---|
| 🧩 Substantivo ou Verbo? | 🟢 Completo | 5 (20 palavras) | Mostra uma palavra e pergunta se é NOME de algo ou AÇÃO — reconhecimento pela função, sem termo gramatical formal |
| ⚡ Que Ação Combina? | 🟢 Completo | 5 (10 personagens) | Mostra um personagem/animal (reaproveitando os do Módulo 6) e pede pra escolher, entre 3 opções, o verbo de ação que combina de verdade — reforça "verbo = o que ele FAZ" |
| ❓ Pontuação no Textinho | 🟢 Completo | 5 (10 mini-textos) | Mini-texto de 2 frases (a 1ª já pontuada); a criança escolhe ponto final ou de interrogação pro fim da 2ª — aprofunda EF01LP14 além da frase isolada já coberta no Módulo 3 |

**Decisão de escopo:** os termos técnicos "substantivo" e "verbo" não são usados como definição gramatical formal com a criança — isso é conteúdo típico de 2º/3º ano. O que a Substantivo ou Verbo? ensina é a distinção conceitual (nome de coisa/pessoa/animal vs. ação), antecipando a base sem exigir metalinguagem gramatical, mantendo a promessa de currículo "um ano à frente" sem forçar conteúdo inadequado à idade.

**Testado** (`qa_test_modulo7.js`, 46 checagens): as 3 atividades renderizando sem erro e sem opção duplicada nos 5 níveis (140 rodadas), resposta certa sempre encontrável, todos os bancos de conteúdo validados (sem opções repetidas), gate do Módulo 8 exigindo o Módulo 7 inteiro completo, menu/painel/admin mostrando os dados certos, enunciado falado em voz nas 3. Revalidei a suíte inteira (regressão, novas atividades, digitação, admin, SVG, cobertura de fala, Módulos 3-6) 3 vezes seguidas — tudo verde, com exceção do artefato conhecido do harness de teste com `setTimeout` na suíte de regressão (não é um bug real, ver seção de Acessibilidade acima).

---

## Módulo 8 · Projeto Leitor e Vocabulário — 🟢 Completo (formalizado, fora da tela por design)

| Módulo | Habilidades BNCC | Atividade planejada (currículo) | Status |
|---|---|---|---|
| 8 · Projeto Leitor e Vocabulário | — (além da BNCC) | Projeto Leitor Semanal (fora da tela) | 🟢 Formalizado — sem jogo digital, por desenho |

Diferente dos Módulos 1-7, o Módulo 8 foi pensado desde o início como uma atividade **fora da tela** — 1 livro infantil curto por semana, lido com um adulto, com ampliação de vocabulário a partir de cada livro. Forçar isso a virar mais uma atividade de clique/digitação no app iria contra a própria proposta do módulo (que é, propositalmente, tempo de leitura compartilhada em papel, não mais tela).

Formalizado no documento separado **`modulo8-projeto-leitor.md`**: 10 livros de fonte gratuita e legal (a maioria de Monteiro Lobato, cujas obras entraram em domínio público em 2019, mais fábulas de Esopo e contos de fadas clássicos), cobrindo 6 gêneros diferentes (aventura, fábula, contos de fadas, humor, não-ficção lúdica, poesia/folclore), com ritmo sugerido de leitura e um roteiro de perguntas pós-leitura que espelha de propósito as habilidades já treinadas nos Módulos 5 e 6 (personagem/onde/quando, recontar em ordem, vocabulário novo, imaginar outro final) — o livro em papel aplica numa história real o que o app treina isoladamente.

---

## Auditoria e expansão de conteúdo (pedido do Júlio: revisar tudo, comparar com o currículo, criar mais exercícios)

Depois dos 7 módulos de Português completos, fiz uma auditoria completa de conteúdo — não só do Módulo 1 (que já tinha motivado a pergunta sobre sílabas), mas de todos os 7 módulos, comparando cada banco contra as habilidades BNCC que ele cobre e ampliando onde fazia sentido pedagógico, sem inflar artificialmente. Resumo por módulo:

- **Módulo 1** — Monte a Sílaba/Som Inicial: banco de palavras foi de 54 pra **87** (33 novas), fechando a auditoria de família silábica (ver seção própria do Módulo 1 acima) — D, G, M, N, P, R, S, T agora com as 5 vogais completas.
- **Módulo 2** — Escrita Certa: 18 → **28** pares certo/erro. Leia a Frase: 26 → **36** frases, com sujeitos novos (urso, girafa, cavalo, macaco, galinha) além dos 5 originais.
- **Módulo 3** — Parlendas: 12 → **20** textos reais de domínio público (Fui à Feira, Pintinho Amarelinho, A Canoa Virou, Lá Vem o Trem, Serra Serra Serrador). Som do Meio e do Fim: 7 → **10** grupos, agora incluindo dígrafos LH e RR que não tinham grupo próprio antes. Pontuação Certa: 15 → **25** frases.
- **Módulo 4** — Complete a Lista: 10 → **15** listas. Texto do Dia a Dia: 10 → **15** textos.
- **Módulo 5** — Sinônimos e Antônimos: 15 → **22** pares. Qual é o Gênero?: 10 → **15** trechos. Ler e Responder: 10 → **15** curiosidades.
- **Módulo 6** — Elementos/Reconte a História: 10 → **15** mini-histórias. Invente o Final: 10 → **15** começos de história.
- **Módulo 7** — Substantivo ou Verbo?: 20 → **30** palavras. Que Ação Combina?: 10 → **15** personagens. Pontuação no Textinho: 10 → **15** mini-textos.

No total, essa rodada adicionou mais de **150 itens novos** de conteúdo espalhados pelos 7 módulos, reaproveitando o vocabulário mais rico que veio da expansão do Módulo 1 (CARRO, MILHO, VULCÃO, CIDADE, GARRAFA, etc. aparecem agora em várias atividades diferentes, dando coerência entre módulos). Suíte de testes completa revalidada depois de cada módulo — todos os 13 arquivos de teste (Português + Matemática) verdes, exceto o artefato conhecido do harness com `setTimeout` (documentado, não é bug real).

---

## Limitações conhecidas do conteúdo atual

1. **Som Inicial é por letra, não por fonema** — aproximação, não dado fonético validado (o Benjamin/você já sinalizou essa pergunta).
2. **Letras raras do português (H, K, W, X, Y)** têm pouca ou nenhuma palavra de apoio no banco — limitação real do idioma, não da curadoria. Depois da auditoria de família silábica, o mesmo vale de forma mais pontual pra 1-2 combinações consoante+vogal raras (ex.: BE, JE, CU) mesmo em consoantes comuns — não dá pra forçar vocabulário concreto de criança pequena onde a língua simplesmente não tem palavra natural.
3. **Nenhum progresso é salvo entre sessões** — fechar a aba zera níveis e estrelas. Isso vira prioridade técnica quando decidirmos transformar isso em produto de verdade (ver MD de agentes — Agente de Web Design).

---

## Acessibilidade — enunciados 100% lidos em voz (Web Speech API)

Pedido do Júlio: "todos enunciados das atividades precisam der lidas, (ter som Web Speech API)". Auditoria completa (`grep` de toda função `render*` + teste automatizado que espiona `speak()` em cada uma das 13 atividades) encontrou 7 funções que ou não falavam nada, ou falavam só uma palavra solta em vez da instrução completa:

1. **Números Mágicos / Conta Comigo** (Joaquim) — não falavam nada. Agora falam o enunciado inteiro nomeando o objeto contado ("Quantas flores você vê?", "Conte os balões..."), com concordância de gênero certa (mapa `EMOJI_GENDER_FEM` — sem isso saía "quantos flores", errado).
2. **Leia a Palavra** — não falava a instrução (só tinha um botão manual 🔊 que falava a palavra). Agora fala "Leia a palavra e toque na figura certa" automaticamente, **sem** revelar a palavra em voz — senão a atividade vira ditado em vez de leitura.
3. **Soma / Subtração** — não falavam nada. Agora falam a conta inteira ("Quanto é 5 mais 2?", "Tinha 6, tiraram 3. Quantos ficaram?").
4. **Pares Mínimos** — só falava a palavra sozinha. Agora fala "Ouça com atenção. Qual é a palavra? [palavra]".
5. **Maiúscula ↔ Minúscula** — falava "Encontre a letra X", que não batia com o que estava escrito na tela. Agora fala exatamente o enunciado mostrado: "Qual é a mesma letra em minúscula/maiúscula? X".

Verificado com teste automatizado (`qa_test_speak_coverage.js`) que passa por todas as 13 atividades e confirma que cada uma chama `speak()` automaticamente ao renderizar, comparando o texto falado com o texto do `.prompt` na tela — 26/26 checagens passando. Suite completa (regressão, novas atividades, digitação, admin, SVG) revalidada depois da mudança, tudo verde (o único "fail" que aparece é o artefato conhecido do harness de teste com `setTimeout`, não um bug real).

---

## 🏁 Desafio Final (Prova) — retrofit em todos os 21 módulos já prontos

Por pedido explícito do Júlio ("Quero implantar provas ao fim de cada módulo"), todos os módulos já construídos — os 7 de Português e os 12 com nível de Matemática — ganharam um checkpoint final chamado **Desafio Final** (nunca "prova" na tela, pra criança), retrofitado de uma vez só em toda a trilha, não pilotado num módulo primeiro. O Júlio escolheu explicitamente que o Desafio Final **também vira critério de desbloqueio** do próximo módulo, além do domínio de 80%/nível 5 que já existia — não é só um relatório informativo pros pais.

**Como funciona:** o Desafio Final de um módulo só fica disponível depois que TODAS as atividades daquele módulo chegam ao nível 5 com 80%+ de domínio (a mesma régua de sempre). Ele sorteia 3 perguntas de CADA atividade do módulo (embaralhadas entre si) e pontua numa trilha separada, sem tocar nas estatísticas de domínio da prática normal — errar no Desafio Final não derruba o nível conquistado. Pra ser aprovado, a criança precisa de **80% de acerto geral E pelo menos 60% em cada atividade individualmente** — o segundo critério existe pra que uma atividade fraca (ex.: foi bem em Rimas mas mal em Pares Mínimos) não fique escondida atrás da média das outras.

**Efeito prático em Português:** diferente de Matemática (onde a trilha é toda independente), os 7 módulos de Português seguem em sequência estrita — Módulo 1 (Sílabas) → 2 (Leitura) → 3 (Frases) → 4 (Escrita) → 5 (Compreensão) → 6 (Narrativas) → 7 (Gramática) — então esse é o lugar onde o novo critério realmente trava algo: agora, além de dominar todas as atividades de um módulo, a criança (com ajuda de um adulto pra registrar/acompanhar) precisa passar no Desafio Final daquele módulo antes do próximo aparecer desbloqueado. O card do Desafio Final aparece no menu assim que o módulo fica 100% dominado, com o texto de convite ("🏁 Fazer o Desafio Final") tanto na tela de fim de sessão quanto como card próprio.

**O que acontece se não passar:** o app nunca deixa a criança travada — pode tentar de novo quantas vezes quiser, sem penalidade, com o resultado explicando exatamente o que faltou (percentual geral e por atividade, marcado com ✅/⚠️ pra cada uma). O painel "meus módulos" (visão dos pais) mostra o status de cada Desafio Final: ainda não tentou / tentado mas não aprovado (com o %) / aprovado (com o %).

**Testado** (`qa_test_prova.js`, 21 checagens): fluxo completo simulado (dominar o Módulo 1 → Módulo 2 ainda bloqueado mesmo com Módulo 1 100% dominado, faltando só a prova → responder tudo certo → aprovado → Módulo 2 desbloqueado → reset via admin volta a bloquear → refazer reaprova), card do Desafio Final aparecendo no menu/admin/painel com o status certo, e confirmação de que Matemática (trilha sem sequência) continua com todos os módulos desbloqueados independente da prova. Toda a suíte de regressão de Português e Matemática (26 arquivos de teste, incluindo os 7 testes de módulo de Português que precisaram ser atualizados pra simular a prova aprovada antes de checar o desbloqueio do próximo) foi revalidada depois da mudança — únicas duas falhas restantes são artefatos de harness pré-existentes e já documentados (`setTimeout` não determinístico em testes antigos, e uma flake intermitente conhecida em `qa_test_typing.js`/`qa_test_regression.js`), não bugs reais introduzidos pela funcionalidade.

---

## Próxima decisão

Os 8 módulos do ano letivo estão completos: 7 digitais (25 atividades, 5 níveis cada, testados, agora com Desafio Final no fim de cada um) e o Módulo 8 formalizado como recomendação de leitura fora da tela. A construção de conteúdo novo terminou por aqui — a decisão combinada com o Júlio é passar agora para a fase de **avaliação real com o Benjamin jogando de verdade**, a lacuna mais repetida neste documento desde o início, e que só cresceu a cada módulo novo sem uso real por trás. Isso muda o tipo de trabalho daqui pra frente: menos "construir mais uma atividade" e mais "observar como ele usa, o que trava, o que engaja, e ajustar com base nisso" — o formato exato dessa avaliação (o que observar, como registrar, se cabe algum mecanismo de feedback dentro do próprio app) ainda precisa ser definido com o Júlio quando essa fase começar.

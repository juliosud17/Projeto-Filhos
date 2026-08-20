# Ilha Aprendiz — Ecossistema, Agentes e Skills

*Documento operacional para tratar o projeto de aprendizagem do Benjamin e do Joaquim como uma empresa em construção: um sistema com marca, produto, papéis de trabalho e ferramentas de IA reaproveitáveis.*

---

## 1. Visão

**Missão:** preparar Benjamin e Joaquim intelectual, cultural e espiritualmente à frente da escola tradicional — e, no caminho, transformar esse conteúdo em um produto que outras famílias possam comprar, já que nem toda escola particular entrega o que promete e nem toda família tem acesso a uma.

**Produto atual:** *Ilha Aprendiz*, uma plataforma interativa de jogos digitais de leitura e matemática, organizada em trilhas por idade/nível, inspirada nas melhores práticas internacionais (Khan Academy Kids, Duolingo ABC, Endless Alphabet, Teach Your Monster to Read, Todo Math, Funexpected Math) mas com identidade e progressão próprias.

**Modelo de crescimento:** validar com Benjamin e Joaquim em casa → transformar em produto vendável (assinatura ou pacote de trilhas) para outras famílias.

---

## 2. Marca

- **Nome:** Ilha Aprendiz
- **Conceito visual:** uma ilha com regiões/trilhas que a criança desbloqueia conforme avança — cada trilha é uma "região" da ilha.
- **Mascotes:** 🦉 (guia da Trilha Inicial, 3-4 anos) e 🦊 (guia da Trilha Leitor, 5-7 anos). Outros mascotes serão criados conforme novas trilhas (cultura, ciências, valores) forem lançadas.
- **Tom de voz:** encorajador, nunca punitivo. Erros são "quase lá", nunca "errado".
- **Paleta:** tons pastel quentes (areia, coral, turquesa) — já aplicada no protótipo interativo entregue.

---

## 3. Trilhas pedagógicas

| Trilha | Criança | Foco atual | Módulos futuros |
|---|---|---|---|
| Trilha Inicial | Joaquim (3 anos) | Reconhecimento de letras, números 1–10, contagem de objetos | Sons e cultura brasileira, formas e cores, pré-escrita |
| Trilha Leitor | Benjamin (6 anos) | Formação de sílabas, leitura de palavras simples, soma e subtração visual | Histórias e cultura brasileira, ciências para curiosos, tabuada inicial |

Módulos de **cultura, valores e espiritualidade** entram como novas trilhas assim que a base de leitura/matemática estiver consolidada — o protótipo já reserva espaço visual para elas ("Em breve").

---

## 4. A empresa: estrutura de agentes de IA

A ideia é operar a Ilha Aprendiz como uma pequena operação de produto, onde cada "agente" é uma sessão/subagente de IA especializado em uma função. Isso evita que uma única conversa tente fazer pedagogia, código, design e marketing ao mesmo tempo — cada agente recebe um briefing focado e entrega um resultado revisável.

### 4.1 Agente Pedagógico
- **Função:** definir o que cada trilha deve ensinar, em que ordem, e validar se um novo jogo está no nível certo para a idade.
- **Quando acionar:** antes de criar qualquer atividade nova, e a cada 2–3 meses para revisar o progresso real das crianças e ajustar a dificuldade.
- **Entrega:** currículo por faixa etária, critérios de "pronto para avançar".

### 4.2 Agente de Criação de Conteúdo/Jogos
- **Função:** transformar o currículo em jogos interativos (HTML/JS), fichas imprimíveis ou roteiros de atividade.
- **Quando acionar:** toda vez que uma nova trilha ou módulo for aprovado pelo Agente Pedagógico.
- **Entrega:** protótipos jogáveis como o enviado nesta conversa.

### 4.3 Agente de Design/Marca
- **Função:** manter a identidade visual consistente (cores, mascotes, tom), preparar telas de apresentação do produto.
- **Quando acionar:** ao lançar uma trilha nova ou preparar material de divulgação/venda.

### 4.4 Agente de QA (Controle de Qualidade)
- **Função:** testar cada jogo antes de liberar para as crianças — lógica de pontuação, respostas corretas, textos sem erro de português, acessibilidade (fontes grandes, sem sustos sonoros).
- **Quando acionar:** sempre, antes de qualquer entrega considerada "final".

### 4.5 Agente de Marketing e Monetização
- **Função:** pensar posicionamento, preço, página de vendas, textos de divulgação, quando e como abrir para outras famílias.
- **Quando acionar:** quando a Ilha Aprendiz tiver conteúdo suficiente validado em casa (sugestão: a partir de 3–4 trilhas completas e testadas).

### 4.6 Agente de Acompanhamento (Dados da Família)
- **Função:** registrar o que Benjamin e Joaquim já dominam, gerar relatórios simples de evolução para orientar os próximos passos pedagógicos.
- **Quando acionar:** periodicamente (ex.: mensal), com base na observação real dos pais. *(Nota 2026-08-20, saneamento pré-produção: desde 2026-08-16 o app já salva progresso automaticamente entre sessões via `js/storage.js`/localStorage — texto original preservado por registrar a intenção do agente, mas a premissa de "sem persistência" não é mais verdadeira, ver `docs/ROADMAP.md`.)*

### 4.7 Agente de Web Design / Desenvolvimento do Site
- **Função:** transformar o protótipo (hoje um único arquivo HTML, já modularizado em `css/`/`data/`/`js/` desde 2026-08-16) em um site/produto de verdade — estrutura de páginas, responsividade (celular/tablet), performance, e evoluir o progresso local que já existe (`js/storage.js`) para progresso na nuvem. Cuida da experiência de quem *usa* o produto, não do conteúdo pedagógico em si. *(Nota 2026-08-20: a frase original dizia "hoje tudo é perdido ao fechar a aba" — não é mais verdade desde 2026-08-16, ver `docs/PRODUCTION_AUDIT.md` pra diagnóstico completo do estado atual antes da migração pra produto comercial.)*
- **Quando acionar:** quando decidirmos sair de "protótipo para testar em casa" para "produto que outras famílias vão acessar" — ou antes disso, se o arquivo único ficar difícil de manter.
- **Entrega:** arquitetura do site, decisões técnicas (hospedagem, salvamento de progresso, contas de usuário), e a implementação em si.
- **Como se relaciona com os outros agentes:** recebe os jogos já aprovados pelo Agente de QA e pela Agente de Design/Marca (identidade visual) — não decide conteúdo pedagógico nem visual da marca, só constrói e organiza o produto em torno deles.

---

## 5. Skills reutilizáveis a criar

Skills são "receitas" que podem ser reaproveitadas em qualquer conversa futura, sem reexplicar o contexto todo. Vale criar (e salvar na conta) as seguintes:

1. **criar-jogo-educativo** — gera um novo mini-jogo HTML no padrão visual da Ilha Aprendiz, dado um objetivo pedagógico (ex.: "jogo de rimas para 6 anos").
2. **gerar-ficha-leitura-pdf** — produz fichas imprimíveis complementares aos jogos digitais, para momentos sem tela.
3. **revisar-conteudo-pedagogico** — checklist de revisão (idade certa, linguagem, ausência de mecanismos manipulativos de recompensa) antes de qualquer lançamento.
4. **gerar-relatorio-progresso** — a partir de anotações informais dos pais, gera um resumo do que cada criança avançou no mês.
5. **criar-post-divulgacao** — quando chegar a hora de vender, gera posts/copy para redes sociais e páginas de produto no tom de voz da marca.
6. **criar-site-produto** — do Agente de Web Design: recebe jogos já aprovados e gera/atualiza a estrutura do site (páginas, navegação, responsividade), mantendo a identidade visual definida pelo Agente de Design/Marca.

---

## 6. Regra de governança — tudo passa pelos agentes

A partir de agora, nenhum conteúdo novo é considerado "pronto" sem passar pela sequência abaixo. Isso vale tanto para atividades pedagógicas quanto para qualquer trabalho de interface/site:

1. **Agente Pedagógico** define o objetivo de aprendizagem e os critérios de "pronto para avançar" (habilidades BNCC, níveis de dificuldade).
2. **Agente de Criação de Conteúdo/Jogos** constrói o jogo/ficha em cima disso.
3. **Agente de QA** testa antes de qualquer entrega — inclui checar lógica de pontuação, ausência de repetição indevida, distribuição real de dificuldade entre níveis, e (sempre que possível) simulação automatizada de uma sessão completa, não só inspeção visual.
4. Só depois desses três passos um módulo/atividade pode ser marcado **✅ Refinado** no índice de currículo. Antes disso, fica **🟡 Criado, não refinado**.
5. **Agente de Web Design** entra quando o trabalho é sobre a estrutura do produto em si (não conteúdo) — ex.: transformar o arquivo único em site, salvar progresso, responsividade.
6. Uso real com Benjamin e Joaquim, com observação informal dos pais → **Agente de Acompanhamento** registra o que funcionou.
7. A cada ciclo de módulos completos, **Agente de Marketing** avalia se já é hora de transformar em produto vendável.

---

## 7. Próximos passos práticos

- Ver o [Índice Completo do Currículo](../pedagogia/CURRICULO_BNCC_PORTUGUES.md) para o status real de cada módulo. *(Nota 2026-08-20: a contagem original acima — "2 de 8 módulos, só 1 refinado" — é de uma fase bem anterior do projeto; o estado atual é 7 de 8 módulos de Português completos e testados, ver `docs/ROADMAP.md`. Texto original preservado como registro histórico.)*
- Prioridade recomendada pelo Agente Pedagógico: **refinar o Módulo 2 antes de criar o Módulo 3** (mesmo padrão de níveis e testes já aplicado ao Módulo 1).
- Decidir quando acionar o Agente de Web Design (sair do protótipo em arquivo único para um site de verdade, com progresso salvo).
- Decidir se as skills acima devem ser criadas agora ou só quando o volume de conteúdo justificar.
- Revisitar este documento a cada módulo novo lançado.

# Revisão Espaçada

*Status: 🔴 não desenhada ainda — stub. Este é o item 2 do `docs/ROADMAP.md`, o segundo maior alavancador identificado pra fazer o conteúdo existente durar o ano letivo (depois de persistência).*

## O problema que isto resolve

Documentado em `docs/BRIEFING.md` e `docs/ROADMAP.md`: hoje, depois que uma atividade chega ao nível 5 e passa no Desafio Final, ela **nunca mais volta**. Nada traz "Monte a Sílaba" de volta em setembro pra reforçar. O app foi desenhado pra *terminar* uma atividade, não pra fazer o domínio *durar*. Isso é coerente com o princípio já registrado em `CLAUDE.md` — "domínio e retenção são métricas diferentes" — mas hoje o app só mede a primeira, nunca a segunda.

## O que precisa ser decidido antes de desenhar

- **Gatilho de retorno:** intervalo fixo por atividade (ex.: 2/7/21 dias após domínio, curva de repetição espaçada clássica) vs. gatilho por sinal de esquecimento (ex.: taxa de acerto caindo numa atividade relacionada) vs. híbrido.
- **Onde a revisão aparece:** mistura dentro da sessão normal (ex.: 1 pergunta de revisão a cada N rodadas novas) vs. bloco dedicado ("Revisão de Hoje") vs. os dois.
- **Como não conflitar com o Desafio Final:** o Desafio Final já reintroduz 3 perguntas por atividade — dedicado a checkpoint, não a retenção contínua. Revisão espaçada precisa ser um mecanismo diferente, mais frequente e de menor atrito, sem duplicar o que o Desafio Final já faz.
- **Pré-requisito técnico:** depende de persistência (item 1 do roadmap) pra saber *quando* uma atividade foi dominada pela última vez — sem isso não há "intervalo desde o domínio" pra calcular.

## Por que não desenhar agora

Depende de dados reais de uso (que só existem depois de persistência + uso real com o Benjamin) pra calibrar intervalo/gatilho sem chutar no escuro — desenhar o algoritmo antes disso é decisão especulativa que provavelmente precisaria ser refeita. Ver ordem completa em `docs/ROADMAP.md`.

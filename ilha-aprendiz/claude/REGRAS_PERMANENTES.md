# Regras Permanentes de Trabalho

*Regras mecânicas de como trabalhar neste repositório — diferente dos "Princípios obrigatórios" em `CLAUDE.md` (que são sobre o produto/pedagogia). Isto é sobre processo. Violar uma regra daqui não quebra a experiência da criança, mas quebra a confiabilidade do próprio processo de trabalho.*

## Git

- **Commit antes de mudança grande, não depois.** Antes de implementar algo que toca vários arquivos ou muda comportamento existente (ex.: persistência, modularização), gerar um commit do estado estável anterior — "versão estável antes de X". Permite reverter sem depender de desfazer mentalmente as mudanças.
- Nunca `git push --force` nem reescrever histórico já compartilhado sem confirmação explícita.
- Mensagens de commit em português, descrevendo o quê e (quando não for óbvio) por quê.

## Documentação viva

- **Decisão de arquitetura ou de escopo pedagógico relevante → registrar em `docs/DECISOES.md`** com data e motivo, no momento em que é tomada — não reconstruir de memória depois.
- **Mudança de conteúdo/currículo → refletir no índice correspondente** (`pedagogia/CURRICULO_BNCC_PORTUGUES.md` ou `CURRICULO_BNCC_MATEMATICA.md`) na mesma entrega, não como tarefa separada "pra depois".
- **Mudança de status de uma frente (ex.: persistência saiu de 🔴 pra 🟢) → atualizar `docs/ROADMAP.md`** no mesmo momento.
- `docs/CHANGELOG.md` ganha uma entrada por mudança entregue, não por sessão de conversa.
- Nunca reescrever entradas antigas de `docs/DECISOES.md`. Se uma decisão for revertida, adicionar entrada nova explicando a reversão.

## Testes

- Toda funcionalidade nova precisa de teste automatizado no padrão jsdom já usado (ver `qa/CASOS_DE_TESTE.md` pra exemplos).
- Suíte inteira roda antes de qualquer entrega ser considerada pronta, não só o teste do módulo tocado.
- Falha nova é bloqueante. Falha conhecida e já documentada (ver lista em `docs/ARQUITETURA.md`, seção "Pendências técnicas") não é — mas se uma falha conhecida virar mais frequente ou mudar de comportamento, tratar como falha nova até provar o contrário.

## Escopo de sessão

- Não criar novos "agentes"/papéis além dos 4 descritos em `claude/AGENTES.md` sem necessidade concreta — ver a mesma lógica de "não fazer 20 agentes agora" registrada lá.
- Ao propor uma mudança grande (nova arquitetura, refatoração ampla), confirmar escopo com o usuário antes de executar, especialmente se for difícil de reverter ou mudar como o app é usado no dia a dia (ex.: exigir servidor local em vez de abrir o HTML direto).
- Ler `CLAUDE.md` (raiz do projeto) no início de qualquer sessão nova antes de agir — os princípios e o estado atual documentados lá têm prioridade sobre suposição.

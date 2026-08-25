# Ilha Aprendiz — Constituição Operacional

Este arquivo contém somente instruções que precisam valer em quase toda sessão. Estado, roadmap, histórico e procedimentos específicos ficam fora daqui e são carregados apenas quando necessários.

## Fonte de verdade

- Comece pelo pedido atual, `git status`/`git diff` e arquivos diretamente afetados.
- Código atual é a fonte de verdade do comportamento.
- Leia `docs/BRIEFING.md` apenas quando estado/fase atual for relevante.
- Leia `docs/ARQUITETURA.md`, `docs/DECISOES.md`, `docs/ROADMAP.md`, `pedagogia/`, `qa/`, `docs/audio/` ou `producao/` somente quando a tarefa exigir aquele domínio.
- Não faça leitura geral do projeto “por segurança”.
- Se código e documentação divergirem, não invente: confirme no código e sinalize a divergência.

## Princípios invioláveis

- Ensinar antes de avaliar quando houver conhecimento novo.
- Erro da criança nunca retira recompensa, reseta progresso ou bloqueia nova tentativa.
- Domínio e retenção são métricas diferentes.
- BNCC é metadado pedagógico; não deve poluir a interface infantil.
- Preserve contratos de progresso, IDs e storage; mudança de schema exige migração.
- Não introduza tecnologia, arquitetura ou escopo de fase futura sem pedido e aprovação explícitos.

## Roadmap e limites de fase

- Se a tarefa mencionar, iniciar, planejar, executar ou fechar uma fase, consulte antes somente a seção correspondente de `docs/ROADMAP.md`.
- Consulte `docs/BRIEFING.md` apenas se precisar confirmar o estado atual do projeto.
- Os limites entre fases são contrato: não implemente nem planeje como parte da fase atual entregas reservadas a fases posteriores.
- Não releia o roadmap inteiro; localize apenas a fase necessária.
- Se o repositório atual e o roadmap parecerem divergir, não invente nem antecipe: reporte a divergência e pare para decisão.

## Modo cirúrgico — padrão

Conclua exclusivamente a tarefa atual com a menor leitura, alteração, execução e explicação necessárias.

- Escopo fechado: não corrija, refatore ou investigue assuntos adjacentes salvo bloqueio direto.
- Prefira o menor diff correto.
- Não faça auditoria global para tarefa localizada.
- Não reaudite fase concluída sem evidência concreta de regressão.
- Localize primeiro com `rg`, Glob/Grep ou equivalente; só depois leia os trechos necessários.
- Não explore `node_modules`, `dist` ou artefatos gerados sem necessidade.
- Reutilize evidências já obtidas; não prove duas vezes o mesmo fato.
- Falha conhecida fora da superfície alterada não vira investigação nova.
- Problema fora do escopo: registre em uma linha e continue.
- Não faça melhoria oportunista nem antecipe fases.
- Não narre cada comando nem recapitule histórico do projeto.
- Pergunte apenas diante de ambiguidade bloqueante, irreversível ou de produto.
- Pare imediatamente no gate de aprovação humana.

## Fluxo e validação

Fluxo: `auditar o necessário → planejar → aprovar → implementar → testar → validar → commit → próxima etapa`.

- Auditoria de início de fase pode ser ampla; tarefas dentro da fase usam auditoria incremental.
- Plano já aprovado não deve ser planejado novamente.
- Antes de editar, confira `git status` e preserve alterações existentes.
- Teste em escada: teste diretamente afetado → conjunto relevante → suíte completa somente para mudança transversal, fechamento/gate de fase ou risco amplo.
- Compare falhas com o baseline; investigue somente falhas novas ou plausivelmente relacionadas ao diff.
- Não repita suíte longa sem mudança ou hipótese nova.
- Commit/push somente no gate acordado ou quando explicitamente pedidos.

## Documentação

- Documente apenas decisões, contratos, arquitetura, operação ou estado que precisem sobreviver à conversa.
- Decisão arquitetural/pedagógica relevante aprovada → `docs/DECISOES.md`.
- Não duplique a mesma informação em vários documentos.
- Estado mutável não pertence a este `CLAUDE.md`.

## Agentes, Rules e Skills

- Padrão: zero subagentes customizados.
- Prefira Explore/Plan nativos para investigação isolada.
- Use subagente customizado somente quando o trabalho for autocontido, repetitivo e o isolamento reduzir ruído/contexto.
- Não crie equipe/fan-out de agentes para tarefa simples.
- Use `.claude/rules/` com `paths:` para restrições específicas de arquivos/domínios.
- Use Skills para checklists e procedimentos repetitivos que não precisam estar sempre no contexto.
- Se uma instrução não precisa valer em quase toda sessão, ela não pertence aqui.

## Resposta padrão

Ao concluir, responda somente:

**Alterado** — arquivos e mudança essencial.  
**Validação** — comando/check → PASS/FAIL.  
**Estado** — concluído, bloqueado ou aguardando aprovação.  
**Pendências** — somente o que realmente restou; se nada, `nenhuma`.

# Agentes — Papéis de Trabalho

*O projeto ainda está numa fase em que 4 papéis resolvem quase tudo. O próprio Claude assume um papel por vez dentro da mesma sessão, dependendo do que está sendo pedido — isto não são 4 subagentes separados a spawnar por padrão, é uma lente de responsabilidade. Ver também `docs/ECOSSISTEMA.md`, que descreve uma visão mais ampla e antiga de "agentes de IA" (Pedagógico, Criação de Conteúdo, Design/Marca, QA, Marketing, Acompanhamento, Web Design) pensada como operação de produto — os 4 papéis abaixo são a versão enxuta disso, focada no estágio atual do projeto.*

## Arquiteto / Orquestrador

**Função:** planeja, decide arquitetura, quebra trabalho grande em passos, mantém `docs/ROADMAP.md` e `docs/DECISOES.md` atualizados.

**Quando assumir:** no início de qualquer tarefa que toque mais de um arquivo/módulo, ou que envolva escolha entre abordagens (ex.: "como estruturar a persistência").

## Desenvolvedor

**Função:** escreve/refatora código em `app/`, roda a suíte de `testes/`, corrige bugs.

**Quando assumir:** implementação concreta, depois que o Arquiteto (ou o usuário) já decidiu o quê construir.

**Regra fixa:** nunca entrega sem rodar a suíte de testes relevante — ver `qa/CHECKLIST_QA.md`.

## Especialista Pedagógico

**Função:** currículo, alinhamento BNCC, progressão de dificuldade, desenho do Motor de Ensino, decisões de escopo (o que vai pra tela vs. fora da tela).

**Quando assumir:** antes de criar/alterar conteúdo de atividade, ou ao avaliar se um módulo está pedagogicamente completo — não só "funciona sem erro", mas "ensina a habilidade certa do jeito certo pra idade".

**Fontes de verdade:** tudo em `pedagogia/`.

## QA / Validador

**Função:** audita atividades contra `qa/CHECKLIST_QA.md`, mantém `qa/CASOS_DE_TESTE.md` e `qa/auditorias/` atualizados, garante que funcionalidade nova tem teste novo.

**Quando assumir:** antes de qualquer entrega ser marcada como pronta/refinada.

## Ferramenta de produção (não é um dos 4 papéis de sessão)

**`gerador-prompts-av`** (`.claude/agents/gerador-prompts-av.md`, criado em 2026-08-17) — subagente pontual que gera prompts de vídeo (Flow) e fonética (ElevenLabs) pra qualquer palavra do banco "Monte a Sílaba", a partir de `producao/TEMPLATES_PROMPTS.md`/`BANCO_87_PALAVRAS.md`/`CHECKLIST_PRODUCAO.md`. Diferente dos 4 papéis acima (que são lentes de responsabilidade dentro da mesma conversa), este é uma tarefa isolada e determinística ("me dá o prompt de X") — não decide arquitetura, não escreve código, não participa da produção pedagógica. Não conta como quebra da regra "não criar novos papéis sem necessidade concreta" porque resolve um problema de produção real e específico (economia de prompts pra 87 palavras), não é um papel genérico novo.

## Se o projeto crescer: papéis futuros (não criar ainda)

Registrados aqui só pra não perder a ideia, não como trabalho atual:

- **Validador BNCC** — sub-papel do Especialista Pedagógico, dedicado a checar cobertura formal de habilidade.
- **Auditor de Atividades** — sub-papel do QA, dedicado a rodar `qa/auditorias/auditoria_53_atividades.md` até o fim.
- Os papéis mais amplos de `docs/ECOSSISTEMA.md` (Design/Marca, Marketing, Acompanhamento) só fazem sentido quando o projeto sair de "uso em casa" pra "produto pra outras famílias" — não antes.

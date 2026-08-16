# Pré-requisitos entre Habilidades e Atividades

*Status: 🔴 não criado ainda — stub.*

## O que isto deveria ser

Um grafo (ou tabela) explícito de dependência entre habilidades/atividades — não só "Módulo N exige Módulo N-1" (isso já existe, é o `requires` de cada módulo no código e está descrito em `CURRICULO_BNCC_PORTUGUES.md`/`CURRICULO_BNCC_MATEMATICA.md`), mas dependência **fina**, dentro do módulo: por exemplo, "Dezena e Unidade" pressupõe "Conta Até 100" mesmo que os dois estejam em módulos diferentes e hoje nada no app force essa ordem.

Um exemplo real já documentado (não fabricado aqui) do formato que isso tomaria, de `pedagogia/MOTOR_DE_ENSINO.md`:

```json
{
  "id": "compor_decompor",
  "pre_requisitos": ["contagem", "dezena_unidade"]
}
```

## Por que não existe ainda

Hoje o app só tem um nível de granularidade de pré-requisito (módulo container → módulo container, via `requires`). Pré-requisito fino entre atividades individuais não é rastreado em lugar nenhum — é trabalho novo, não uma extração de algo que já existe disperso (diferente de `HABILIDADES.md`). Faz mais sentido desenhar isso junto com a modularização do conteúdo em JSON (`docs/ARQUITETURA.md`) — o campo `pre_requisitos` já está no formato de dado proposto pra lá — do que tentar reconstruir agora em cima do código atual, que nem tem essa estrutura.

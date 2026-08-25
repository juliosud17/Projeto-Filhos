---
name: implementar-tarefa
description: Implementa uma tarefa pontual no projeto com escopo mínimo, acionada explicitamente com /implementar-tarefa.
disable-model-invocation: true
---

# implementar-tarefa

Tarefa: $ARGUMENTS

## Passos

1. `git status` antes de editar qualquer coisa.
2. Definir escopo mínimo da tarefa — não expandir.
3. Buscar (grep/glob) antes de ler arquivos inteiros; ler só o necessário.
4. Não reauditar fases anteriores nem partes não relacionadas.
5. Não corrigir/refatorar nada fora do escopo da tarefa.
6. Preservar mudanças preexistentes no working tree (não descartar, não sobrescrever sem necessidade).
7. Aplicar a alteração mínima que resolve a tarefa.
8. Rodar o teste focalizado relacionado primeiro. Ampliar a suíte só se necessário para cobrir a mudança.
9. Atualizar documentação somente se ela for realmente afetada pela mudança.
10. Sem commit, sem push.
11. Parar após validação — não seguir para outras tarefas.

## Relatório final (compacto)

```
Alterado:
Testado:
Resultado:
Pendências:
```

---
name: fechar-fase
description: Fecha uma fase do projeto rodando gates de validação, acionada explicitamente com /fechar-fase.
disable-model-invocation: true
---

# fechar-fase

Fase: $ARGUMENTS

## Passos

1. Consultar `git status`.
2. Separar mudanças pertencentes a esta fase das demais mudanças presentes no working tree.
3. Rodar a suíte completa de testes.
4. Rodar o build.
5. Rodar gates adicionais oficiais aplicáveis a esta fase (se existirem).
6. Se houver falha, investigar somente a falha encontrada — não expandir escopo.
7. Gerar diff final das mudanças da fase.
8. Atualizar apenas a documentação realmente afetada pela fase.
9. Sem push. Sem commit sem autorização explícita do usuário.

## Relatório

```
Gate:
Mudanças da fase:
Documentação:
Riscos:
Estado: PRONTO PARA COMMIT | BLOQUEADO
```

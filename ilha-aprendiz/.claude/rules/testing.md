---
paths:
  - testes/**
  - qa/**
---

# Regras de teste

- Antes de mexer no teste, determine se a falha é do teste ou da implementação — não assuma.
- Não enfraqueça assertion só para fazer o teste passar.
- Reutilize o harness/utilitários existentes (`_util/`) em vez de recriar setup.
- Prefira editar/estender o teste mais próximo do comportamento alterado, não criar um novo redundante.
- Evite dependência de tempo real ou aleatoriedade não determinística sem seed/mock explícito.

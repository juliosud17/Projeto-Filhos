# BNCC Oficial — Fonte de Verdade

*Criado em 2026-08-16, a pedido explícito do Júlio, depois de confirmar que o projeto não tinha nenhum documento oficial do MEC anexado — só índices próprios (`pedagogia/CURRICULO_BNCC_PORTUGUES.md` e `CURRICULO_BNCC_MATEMATICA.md`) que referenciam códigos de habilidade sem fonte pra conferir.*

## O que tem aqui

- **`BNCC_EI_EF_versao-final-MEC.pdf`** — o documento oficial completo (Educação Infantil + Ensino Fundamental, 600 páginas), baixado direto do site do MEC. Esta é a fonte de verdade — os dois arquivos abaixo são recortes derivados dela, não substitutos.
- **`LINGUA_PORTUGUESA_1e2ano_extrato-oficial.md`** — recorte das páginas com a tabela oficial de Língua Portuguesa, 1º e 2º anos (as 26 habilidades EF01LP01-26, mais as EF12LP*/EF02LP* vizinhas na mesma tabela).
- **`MATEMATICA_1ano_extrato-oficial.md`** — recorte das páginas com a tabela oficial de Matemática, 1º ano (as 22 habilidades EF01MA01-22).

## Fonte e como foi obtido

- **URL oficial:** https://basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf (Ministério da Educação — Base Nacional Comum Curricular, versão final, Resolução CNE/CP nº 2/2017).
- **Baixado em:** 2026-08-16.
- **Extração de texto:** `pdftotext` (poppler) não conseguiu ler este PDF específico — erro de tabela xref, aparentemente uma peculiaridade deste arquivo do MEC (o download bate exatamente com o `Content-Length` declarado pelo servidor, então não é corrupção da nossa cópia). Extraído via `pdf-parse` (Node.js) como alternativa mais tolerante — 600 páginas, contagem de EF01LP (26) e EF01MA (22) no documento inteiro bate exatamente com o que já sabíamos pelos nossos próprios índices, então a extração está íntegra.
- **Artefato conhecido:** legendas de margem rotacionadas (texto vertical, tipo "MINISTÉRIO DA EDUCAÇÃO" impresso na lateral da página) saem embaralhadas na extração — cosmético, não afeta o corpo das tabelas/texto.

## Comparação já feita

A comparação código a código contra `pedagogia/CURRICULO_BNCC_PORTUGUES.md`/`CURRICULO_BNCC_MATEMATICA.md` (via `app/data/registro-modulos.js`, a fonte real usada pelo app) foi feita em 2026-08-16 — ver **`qa/auditorias/auditoria_bncc_oficial.md`** pro relatório completo. Resultado resumido: a maioria dos 48 códigos bate bem com o texto oficial, mas 5 divergências reais foram encontradas (a mais concreta: EF01MA13 usa a lista de formas geométricas do 2º ano, não do 1º). Nenhuma correção foi aplicada ainda — fica como próximo passo em aberto.

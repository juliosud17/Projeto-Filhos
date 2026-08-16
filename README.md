# 10_PROJETO_FILHOS

Pasta de trabalho com os projetos educacionais pros filhos (Benjamin, 6 anos, e Joaquim, 3 anos).

## Estrutura

### [`ilha-aprendiz/`](ilha-aprendiz/)
Projeto principal: um app HTML/JS de página única, sem servidor, pra reforçar em casa o que o Benjamin e o Joaquim estão aprendendo — não substitui a escola, é ferramenta de prática extra. Currículo do Benjamin baseado na BNCC do 1º ano do Ensino Fundamental (um ano à frente da matrícula real dele).

Comece por [`ilha-aprendiz/docs/BRIEFING-ilha-aprendiz.md`](ilha-aprendiz/docs/BRIEFING-ilha-aprendiz.md) — resume propósito, o que já foi construído, o gargalo de ritmo identificado (o conteúdo dura 3-4 meses, não o ano inteiro) e os próximos passos propostos.

Subpastas: `app/` (o HTML autocontido), `docs/` (currículo, arquitetura, status), `testes/` (suíte automatizada Node/jsdom).

### [`materiais-brutos/`](materiais-brutos/)
Material de referência ainda não processado — hoje só slides/screenshots de planos de aula sobre fotolegendas (Português, 1º ano). Ainda não está ligado ao conteúdo do `ilha-aprendiz/`; fica guardado aqui até decidirmos o que aproveitar.

## Convenção

Pastas em kebab-case, sem espaço ou acento, pra evitar atrito com git/terminal/scripts. Conteúdo interno dos documentos continua em português normal.

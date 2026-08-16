# 10_PROJETO_FILHOS

Pasta de trabalho com os projetos educacionais pros filhos (Benjamin, 6 anos, e Joaquim, 3 anos).

> Trabalhando com o Claude Code nesta pasta? Veja [`CLAUDE.md`](CLAUDE.md) — é carregado automaticamente e aponta pro `CLAUDE.md` de cada subprojeto.

## Estrutura

### [`ilha-aprendiz/`](ilha-aprendiz/)
Projeto principal: um app HTML/JS de página única, sem servidor, pra reforçar em casa o que o Benjamin e o Joaquim estão aprendendo — não substitui a escola, é ferramenta de prática extra. Currículo do Benjamin baseado na BNCC do 1º ano do Ensino Fundamental (um ano à frente da matrícula real dele).

Organizado em três camadas — código (`app/`), documentação viva (`docs/`, `pedagogia/`, `qa/`) e governança do agente (`claude/`). Comece por [`ilha-aprendiz/CLAUDE.md`](ilha-aprendiz/CLAUDE.md), depois [`ilha-aprendiz/docs/BRIEFING.md`](ilha-aprendiz/docs/BRIEFING.md). Ver [`ilha-aprendiz/README.md`](ilha-aprendiz/README.md) para o mapa completo de arquivos.

### [`materiais-brutos/`](materiais-brutos/)
Material de referência ainda não processado — hoje só slides/screenshots de planos de aula sobre fotolegendas (Português, 1º ano). Ainda não está ligado ao conteúdo do `ilha-aprendiz/`; fica guardado aqui até decidirmos o que aproveitar.

## Convenção

Pastas em kebab-case, sem espaço ou acento, pra evitar atrito com git/terminal/scripts. Conteúdo interno dos documentos continua em português normal.

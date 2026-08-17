# Bíblia de Personagens — Ilha Aprendiz

*Registro permanente de cada personagem com função real no app. Criado em 2026-08-17 com o piloto audiovisual VACA. Começa com só 2 entradas de propósito — Lia e Vaca — nada de personagens futuros inventados antes de terem função pedagógica/narrativa/emocional/de progressão concreta (seção 30 da arquitetura aprovada em `docs/DECISOES.md`).*

---

## Lia

| Campo | Valor |
|---|---|
| ID | `lia` |
| Nome | Lia |
| Tipo | Guia |
| Idade aparente | Jovem (não infantil, não adulta formal) |
| Gênero | Feminino |
| Personalidade | Alegre, acolhedora, curiosa, lúdica, encorajadora, clara |
| Papel pedagógico | Orientação, instrução, dica, reensino, celebração — a voz que conduz a criança pela atividade sem nunca entregar a resposta |
| Visual | Ainda não definido (a Lia hoje só tem voz, ver `docs/audio/VOZ_LIA.md`) — corpo/animação própria é item futuro, não bloqueia o piloto de voz |
| Voz | ElevenLabs, ver `docs/audio/VOZ_LIA.md` para Voice ID/prompt/regras |
| Sons | N/A (não tem som de personagem tipo "muuu" — é a guia, fala) |
| Animações disponíveis | Nenhuma ainda (sem corpo visual definido) |
| Onde pode aparecer | Qualquer atividade do app, em qualquer trilha (Português/Matemática) |

## Vaca

| Campo | Valor |
|---|---|
| ID | `vaca` |
| Nome | (sem nome próprio — é "a vaquinha") |
| Tipo | Animal/mascote de atividade |
| Idade aparente | N/A |
| Gênero | N/A |
| Personalidade | Fofa, tranquila |
| Papel pedagógico | Personagem de apoio visual/sonoro pra atividade "Monte a Sílaba" (piloto) — desperta atenção e vínculo emocional antes da instrução da Lia; **não fala, não entrega a resposta** |
| Visual | Vídeo 1:1, personagem centralizado, fundo branco ou transparente (ver `docs/audio/MEDIA_GUIDELINES.md`) |
| Voz | N/A — não usa a voz da Lia; tem só o som natural do animal |
| Sons | "Muuu... muu muu!" — embutido no próprio vídeo (não é arquivo de áudio separado no piloto, ver seção "quando áudio fica dentro do vídeo" em `docs/audio/MEDIA_GUIDELINES.md`) |
| Animações disponíveis | `intro` (única no piloto — sem `idle`/`success`/`error` em vídeo, ver `docs/DECISOES.md` sobre o porquê) |
| Onde pode aparecer | Hoje: atividade "Monte a Sílaba" quando a palavra sorteada é VACA. Reutilizável em qualquer atividade futura que precise do personagem vaca (ex. se "VACA" aparecer em outro módulo/jogo) — o vídeo é por personagem, não por atividade |

---

## Lote A — restante (2026-08-17, escala do piloto validado com a Vaca)

Depois de validar o piloto ao vivo com a Vaca (vídeo, voz, fonética, fallback), os outros 9 personagens do Lote A entraram com o **mesmo padrão exato** — não repetido campo a campo aqui pra não inflar o documento à toa. Valem pra todos os 9 abaixo, igual à Vaca:

- **Papel pedagógico:** personagem de apoio visual/sonoro pra atividade "Monte a Sílaba" — desperta atenção e vínculo emocional antes da instrução da Lia; **não fala, não entrega a resposta**.
- **Visual:** vídeo 1:1, personagem/objeto centralizado (ver `docs/audio/MEDIA_GUIDELINES.md`).
- **Voz:** N/A — não usa a voz da Lia.
- **Animações disponíveis:** só `intro` (mesma decisão da Vaca, `docs/DECISOES.md`).
- **Onde pode aparecer:** atividade "Monte a Sílaba" quando a palavra sorteada é a dele; reutilizável em qualquer atividade futura que precise do mesmo personagem/objeto.

| ID | Palavra | Tipo | Som (embutido no vídeo) |
|---|---|---|---|
| `gato` | GATO | Animal/mascote | Conferir o vídeo real produzido — não documentado aqui em detalhe pra não inventar o que não foi eu quem gravou |
| `pato` | PATO | Animal/mascote | Idem |
| `sapo` | SAPO | Animal/mascote | Idem |
| `bola` | BOLA | Objeto/mascote | Sem voz de personagem — só som sutil de quique (mesmo prompt de produção, sem fala) |
| `casa` | CASA | Objeto/mascote | Conferir o vídeo real produzido |
| `galo` | GALO | Animal/mascote | Idem |
| `lobo` | LOBO | Animal/mascote | Idem |
| `sino` | SINO | Objeto/mascote | Idem |
| `carro` | CARRO | Objeto/mascote | Idem |

*Nota: os campos "Som" acima ficaram genéricos de propósito — quem escreveu este registro (Claude) não ouviu os vídeos reais gerados pelo Flow, só descreveu o prompt pedido. Se algum vídeo tiver um som que vale documentar aqui (ex. pra reuso em outra atividade sem o vídeo), atualizar esta tabela depois de conferir o arquivo real.*

---

## Como adicionar um personagem novo (checklist)

Antes de criar uma entrada nova aqui, confirmar que o personagem tem pelo menos UMA função real (seção 30 da arquitetura):

- [ ] Função pedagógica (ensina/reforça algo específico)?
- [ ] Função narrativa (faz parte de uma história/mundo)?
- [ ] Função emocional (cria vínculo, engajamento)?
- [ ] Função de progressão (marca avanço, desbloqueio, conquista)?

Se nenhuma resposta for "sim" com um caso de uso concreto já em vista, o personagem não entra aqui ainda.

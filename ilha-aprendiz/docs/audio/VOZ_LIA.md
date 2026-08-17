# Voz da Lia — Ilha Aprendiz

*Documento permanente da identidade sonora da guia oficial do app. Criado em 2026-08-17, junto com o piloto audiovisual VACA (ver `docs/DECISOES.md`). Voice ID pode ficar registrado aqui; **chave de API nunca vai pra este repositório**.*

## Identidade e papel

Lia é a guia oficial do Ilha Aprendiz — a "personalidade" por trás das instruções, dicas, feedback de acerto/erro e reensino. Ela **não é a narradora de todo texto da tela** (isso continua sendo TTS genérico onde ainda não existe voz própria) — é a camada de voz pedagógica/emocional que aparece nos pontos definidos pela arquitetura audiovisual aprovada (`docs/audio/MEDIA_GUIDELINES.md`).

Papel: orientação e encorajamento. Nunca entrega a resposta antes da criança tentar (ver "Regras pedagógicas" abaixo — é a mesma regra fundamental de `CLAUDE.md`, aplicada à voz).

## Provider e configuração técnica

| Campo | Valor |
|---|---|
| Provider | ElevenLabs |
| Método de criação | Voice Design |
| Voice ID | `PREENCHER — copiar do painel ElevenLabs (não é segredo, mas não foi informado a este documento; Júlio preenche na primeira geração real)` |
| Modelo usado | `PREENCHER — modelo ElevenLabs usado na geração (ex. eleven_multilingual_v2 ou equivalente vigente)` |
| Idioma | Português brasileiro (pt-BR) nativo |
| API key | **NUNCA registrar aqui nem em nenhum outro arquivo do repositório** |

> Este documento nasce com os campos de Voice ID/modelo em aberto porque esta sessão de arquitetura não teve acesso ao painel do ElevenLabs. Preencher assim que a primeira leva de áudios reais do piloto for gerada — é a mesma etapa de "aprovação" do pipeline (seção G da arquitetura aprovada).

## Prompt original do Voice Design

```
Native Brazilian Portuguese (pt-BR). Young female voice, cheerful educational
adventure guide. Warm, curious, playful and encouraging. Youthful and bright,
but not babyish or squeaky. Very clear pronunciation of words, syllables and
numbers. Natural pacing, slightly slow for children ages 5–8. Expressive
questions and celebrations. Gentle when correcting mistakes. Friendly
animated-character feel, never like a commercial narrator.
```

## Tom e características

- Feminina, jovem, alegre, acolhedora, curiosa, lúdica, encorajadora.
- Clara — pronúncia muito nítida de palavras, sílabas e números (importante: a Lia narra instruções e feedback; a **pronúncia pedagógica oficial em si** é um asset separado, ver "Separação Lia × Fonética" abaixo).
- Ritmo natural, levemente mais lento — adequado a crianças de 5–8 anos.
- **Nunca**: soar como bebê, soar estridente/muito aguda, soar como professora formal, soar como narradora comercial.
- Gentil ao corrigir erro — nunca soa como punição (mesma regra de `CLAUDE.md`: "nunca penalizar erro").

## Separação Lia × Fonética (decisão de arquitetura, 2026-08-17)

A Lia (personalidade/encorajamento) e a pronúncia pedagógica oficial (fonética de letra/sílaba/palavra/número) são **sempre arquivos separados**, nunca uma frase da Lia com a pronúncia embutida dentro. Exemplo do piloto VACA:

```
Lia: "Isso! Muito bem!"      (audio/lia/comuns/acerto-01.mp3)
Fonética: "VA"                (audio/fonetica/silabas/va.mp3)
Fonética: "CA"                (audio/fonetica/silabas/ca.mp3)
Fonética: "VACA"              (audio/fonetica/palavras/vaca.mp3)
```

Motivo: permite revisar/regravar a pronúncia oficial de uma palavra sem regenerar a fala emocional da Lia (e vice-versa) — decisão do Júlio na aprovação da arquitetura, ver `docs/DECISOES.md`.

## Regras de atuação (o que a Lia pode e não pode fazer)

- **Nunca revela a resposta antes da tentativa.** A instrução nunca cita a palavra/número-alvo diretamente (ex. nunca "Monte a palavra VACA" — ver exemplo proibido abaixo).
- **Nunca pune.** Erro é sempre tratado com gentileza — "Quase!", nunca "Errado" seco.
- **Fala pedagógica ≠ fala emocional opcional.** A pronúncia oficial (VA/CA/VACA) é conteúdo pedagógico fixo, não pode ser substituída por uma frase de celebração genérica. Já "Isso!"/"Muito bem!"/"Boa!" são variações emocionais intercambiáveis (ver `docs/audio/MEDIA_GUIDELINES.md`, "reutilização").
- **Dica é progressiva, não a resposta inteira.** No piloto: 1º erro revela só a primeira sílaba ("Vamos ouvir o começo? VA..."), nunca a palavra completa.

### Exemplos aprovados

- "Olha quem chegou por aqui! Observe com atenção... e monte o nome dela!" (instrução, não cita a palavra)
- "Isso! Muito bem!" (celebração, variação emocional)
- "Quase! Vamos ouvir o começo?" (dica nível 1, gentil, não pune)

### Exemplos proibidos

- "Monte a palavra VACA." (entrega a resposta — era o bug real do TTS genérico antes deste piloto, ver `docs/DECISOES.md`)
- "Errado, tenta de novo." (tom de punição)
- Qualquer frase que combine a celebração emocional com a pronúncia oficial no mesmo arquivo (ex. Lia dizendo "Isso, VA-CA, VACA, muito bem!" tudo junto).

## Convenção de arquivos

Ver `docs/audio/MEDIA_GUIDELINES.md`, seção de nomenclatura. Resumo: `assets/audio/lia/<categoria>/<nome>.mp3`, kebab-case, sem acento — ex. `lia/comuns/acerto-01.mp3`, `lia/comuns/monte-o-nome.mp3`.

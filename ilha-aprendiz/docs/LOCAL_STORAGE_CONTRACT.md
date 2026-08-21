# Contrato de localStorage — Ilha Aprendiz

*FASE 1, PASSO 5. Documenta TODAS as chaves de `localStorage` usadas hoje
pelo app, sua estrutura, origem e risco. Nenhuma chave foi renomeada,
nenhum dado foi apagado ou migrado nesta fase — este documento é só o
contrato atual, para servir de blindagem à Fase 2.*

## Resumo

O app usa **uma única chave** de `localStorage`: `"ilhaAprendizProgresso"`.
Não há nenhuma outra chave, nem de terceiros (sem analytics, sem
autenticação, sem cache de terceiros) — confirmado por grep: `localStorage`
só aparece em `app/js/storage.js`, que é o único ponto de leitura/escrita
de todo o projeto (padrão "single writer" documentado no próprio código-fonte,
comentário de topo do arquivo).

## Chave: `ilhaAprendizProgresso`

- **Escreve:** `saveProgress()`, em `app/js/storage.js`
- **Lê:** `loadProgress()`, em `app/js/storage.js`
- **Apaga:** `clearProgress()`, em `app/js/storage.js` (usada pelo botão "Resetar TUDO" do painel admin)
- **Chamadores de `saveProgress()`:** `js/game-loop.js` (fim de rodada com registro de mastery, fim de sessão, fim de Desafio Final), `js/admin.js` (resets do painel)
- **Chamador de `loadProgress()`:** o próprio `js/storage.js`, no bootstrap de topo (linha 133 — ver `RUNTIME_DEPENDENCIES.md` seção 1)
- **Propósito:** persistir entre sessões (fechar/reabrir a aba, ou entre dias) tudo que representa o progresso pedagógico real da criança — nível de cada atividade, histórico fino de domínio, aprovação em Desafio Final e estrelas totais. Existe desde 2026-08-16 (ver `docs/DECISOES.md`).
- **Relacionado a perfil de criança?** Sim, mas sem separação por perfil dentro da estrutura — os dados de Joaquim e Benjamin convivem no mesmo objeto salvo (as chaves de atividade já são específicas de cada trilha/criança, e `totalStars` é o único campo explicitamente dividido por criança, `{joaquim, benjamin}`).
- **Migrável para nuvem no futuro?** Sim — é exatamente o tipo de dado que uma conta de usuário/backend precisaria sincronizar (ver `docs/ARQUITETURA.md`, visão de médio prazo). Não implementado nem planejado tecnicamente nesta fase.
- **Deve continuar em cache local mesmo depois de existir nuvem?** Recomendado que sim, como fallback offline-first — decisão de arquitetura para quando a nuvem for de fato desenhada, não desta fase.
- **Risco de perda de dado se o formato mudar:** **Alto.** É o único registro de progresso pedagógico da criança que existe hoje. `loadProgress()` já tem validação defensiva campo a campo (tipo, shape, range) e ignora silenciosamente qualquer campo salvo que não bata com o esperado — isso protege contra corrupção parcial, mas **não protege contra uma mudança de versão do schema sem migração**: `loadProgress()` descarta o payload inteiro se `saved.version !== STORAGE_VERSION` (linha `if(!saved || saved.version !== STORAGE_VERSION) return;`). Ou seja, incrementar `STORAGE_VERSION` sem escrever lógica de migração explícita apaga efetivamente todo progresso salvo do usuário na próxima carga. Isso é um risco já presente hoje (não introduzido por esta fase) e deve ser tratado com cuidado especial em qualquer mudança futura de schema, dentro ou fora da Fase 2.

### Estrutura completa do payload salvo

```json
{
  "version": 1,
  "activityLevel": { "<activityId>": 1 },
  "mastery": { "<gameId>:<nivel>": [true, false, true] },
  "provaPassed": { "<containerId>": true },
  "provaScores": {
    "<containerId>": {
      "overallPct": 83,
      "perActivity": [ { "activityId": "silabas", "pct": 100 } ],
      "passed": true
    }
  },
  "reviewState": {
    "<activityId>": { "stage": 2, "lastReviewedAt": "2026-08-20T14:03:00.000Z" }
  },
  "totalStars": { "joaquim": 12, "benjamin": 34 },
  "savedAt": "2026-08-21T10:00:00.000Z"
}
```

### Exemplo anonimizado (valores fictícios, sem nenhum dado real de família)

```json
{
  "version": 1,
  "activityLevel": { "silabas": 3, "letras_b": 5, "quantos_tem": 2 },
  "mastery": { "silabas:3": [true, true, false, true], "letras_b:5": [true, true, true, true, true] },
  "provaPassed": { "silabas": true },
  "provaScores": { "silabas": { "overallPct": 87, "perActivity": [{"activityId":"letras_b","pct":90}], "passed": true } },
  "reviewState": { "letras_b": { "stage": 1, "lastReviewedAt": "2026-08-15T12:00:00.000Z" } },
  "totalStars": { "joaquim": 8, "benjamin": 21 },
  "savedAt": "2026-08-19T18:32:00.000Z"
}
```

### Campos e origem em memória (antes de serem serializados)

| Campo salvo | Objeto em memória de origem | Arquivo que declara o objeto |
|---|---|---|
| `activityLevel` | `activityLevel` (global) | `js/mastery.js` |
| `mastery` | `mastery` (global) | `js/mastery.js` |
| `provaPassed` | `provaPassed` (global) | `js/mastery.js` |
| `provaScores` | `provaScores` (global) | `js/mastery.js` |
| `reviewState` | `reviewState` (global) | `js/revisao-espacada.js` |
| `totalStars` | `state.totalStars` (campo de `state`) | `js/mastery.js` |

### O que explicitamente NÃO persiste (decisão de produto já registrada em código)

Comentário de topo de `js/storage.js` documenta a decisão: a tela/rodada em
que a criança estava no meio de uma sessão não é salva — reabrir o app
sempre volta para `screen-home` (seleção de criança), com os níveis,
estrelas e Desafios Finais corretos já restaurados, mas sem retomar uma
rodada em andamento. Decisão deliberada, não uma lacuna técnica.

## Nenhuma outra chave

Não existe nenhuma outra chave de `localStorage`, `sessionStorage`,
`IndexedDB`, cookie, ou qualquer outro mecanismo de armazenamento do
navegador usado pelo projeto — confirmado por grep em todo `app/js/` e
`app/data/`.

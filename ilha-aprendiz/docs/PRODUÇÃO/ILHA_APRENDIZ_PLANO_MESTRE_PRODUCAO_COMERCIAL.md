# ILHA APRENDIZ — PLANO MESTRE DE EVOLUÇÃO PARA PRODUTO COMERCIAL

**Documento mestre de execução**  
**Objetivo:** transformar o protótipo atual do Ilha Aprendiz em um produto web comercial, instalável como PWA, com base técnica preparada para monetização, contas familiares, perfis infantis, progresso em nuvem, mídia, analytics, segurança, privacidade e futura distribuição em lojas — **sem reescrever desnecessariamente o que já funciona**.

**Estratégia central:**  
**Web App responsivo → PWA → Produto comercial → empacotamento para Android/iOS quando fizer sentido.**

---

# ÍNDICE

1. Como usar este documento  
2. Princípios permanentes do projeto  
3. Arquitetura-alvo recomendada  
4. Ordem geral de execução  
5. Fase 0 — Congelar e auditar o protótipo atual  
6. Fase 1 — Organizar repositório para produção  
7. Fase 2 — Migrar de `file://` para ambiente web local de desenvolvimento  
8. Fase 3 — Configuração por ambientes  
9. Fase 4 — Banco de dados e backend  
10. Fase 5 — Autenticação do responsável  
11. Fase 6 — Perfis infantis  
12. Fase 7 — Persistência em nuvem e sincronização  
13. Fase 8 — Modelo definitivo de progresso/mastery/revisão  
14. Fase 9 — Sistema de conteúdo versionado  
15. Fase 10 — Arquitetura de mídia, CDN e armazenamento  
16. Fase 11 — Sistema audiovisual e Audio/Media Manager  
17. Fase 12 — PWA  
18. Fase 13 — Offline parcial e sincronização  
19. Fase 14 — Painel dos pais  
20. Fase 15 — Analytics pedagógico e telemetria  
21. Fase 16 — Observabilidade, erros e logs  
22. Fase 17 — Segurança e privacidade infantil/LGPD  
23. Fase 18 — Pagamentos e assinatura  
24. Fase 19 — Planos Free/Premium  
25. Fase 20 — Área administrativa  
26. Fase 21 — QA, acessibilidade e testes E2E  
27. Fase 22 — Performance  
28. Fase 23 — Deploy de produção  
29. Fase 24 — Beta fechado  
30. Fase 25 — Lançamento comercial web/PWA  
31. Fase 26 — Android/iOS com Capacitor  
32. Fase 27 — Escala de conteúdo  
33. Fase 28 — Jardim 2 e novos anos  
34. Fase 29 — Preparação para escolas  
35. Pipeline de trabalho diário com Claude  
36. Convenção de commits e branches  
37. Checklist de produção  
38. Critérios de “pronto para monetizar”  
39. O que NÃO fazer agora  
40. Próxima ação imediata

---

# 1. COMO USAR ESTE DOCUMENTO

Este arquivo é o **roteiro mestre** do Ilha Aprendiz.

A regra é:

1. Não mandar Claude “fazer tudo”.
2. Trabalhar **uma fase por vez**.
3. Cada fase começa com **auditoria**.
4. Claude apresenta o plano.
5. Você aprova.
6. Claude implementa.
7. Claude roda testes.
8. Você valida manualmente.
9. Commit.
10. Só então avançar.

Formato padrão:

```text
AUDITAR
↓
PLANEJAR
↓
APROVAR
↓
IMPLEMENTAR
↓
TESTAR
↓
VALIDAR
↓
COMMIT
↓
PRÓXIMA FASE
```

---

# 2. PRINCÍPIOS PERMANENTES DO PROJETO

## 2.1 Não reescrever por moda

Não migrar automaticamente para:

- React
- Next.js
- Flutter
- Unity
- Kotlin
- Swift

A menos que exista necessidade real.

A base atual HTML/CSS/JS pode continuar sendo utilizada.

A evolução recomendada é adicionar:

- build/dev server;
- backend;
- banco;
- PWA;
- autenticação;
- testes;
- storage;
- pagamentos.

## 2.2 O produto é educacional, não apenas um jogo

A arquitetura deve preservar:

- currículo;
- BNCC;
- mastery;
- revisão espaçada;
- Motor de Ensino;
- reensino;
- atividades;
- desafios;
- relatórios.

A camada visual nunca deve substituir a lógica pedagógica.

## 2.3 Responsável possui a conta

Modelo:

```text
RESPONSÁVEL
│
├── assinatura
├── configurações
├── consentimentos
└── perfis infantis
    ├── criança A
    ├── criança B
    └── criança C
```

A criança **não deve precisar possuir email próprio**.

## 2.4 Minimização de dados infantis

Evitar coletar sem necessidade:

- sobrenome;
- endereço;
- localização;
- escola;
- telefone;
- email da criança;
- foto;
- data de nascimento completa.

Preferir:

- apelido/nome de exibição;
- faixa etária;
- ano/trilha;
- avatar;
- dados de aprendizagem.

## 2.5 Mídia separada da lógica

```text
conteúdo
+
personagem
+
voz
+
fonética
+
SFX
+
lógica
```

Nenhuma atividade deve depender de um único MP4 gigante contendo tudo.

## 2.6 Tudo que é importante deve ser testável

Mudanças em:

- domínio;
- desbloqueio;
- progresso;
- assinatura;
- autenticação;
- sincronização;
- conteúdo;
- áudio;

devem receber testes.

---

# 3. ARQUITETURA-ALVO RECOMENDADA

## Primeira arquitetura comercial

```text
                    ILHA APRENDIZ

                         │
                         ▼
                  WEB APP / PWA
                  HTML/CSS/JS
                         │
                         ▼
                      API/SDK
                         │
               ┌─────────┴─────────┐
               │                   │
             AUTH              DATABASE
               │                   │
        RESPONSÁVEIS         PROGRESSO
        SESSÕES              MASTERY
        CONSENTIMENTO        TENTATIVAS
                             REVISÕES
               │                   │
               └─────────┬─────────┘
                         │
                       STORAGE
                         │
              ÁUDIO / VÍDEO / IMAGENS
                         │
                         ▼
                       CDN
```

## Stack inicial recomendada

### Frontend
- HTML
- CSS
- JavaScript
- Vite como ambiente/build
- PWA posteriormente

### Backend
**Supabase** como primeira escolha para:
- PostgreSQL;
- Auth;
- Storage;
- Row Level Security;
- APIs.

### Hospedagem web
Uma destas:
- Vercel;
- Cloudflare Pages;
- Netlify.

**Recomendação inicial:** Vercel + Supabase pela simplicidade.

### Pagamento web
Planejar:
- Stripe;
- ou Mercado Pago.

Escolha final somente quando a estrutura comercial estiver definida.

### App móvel futuro
- Capacitor
- mesma base web
- Android/iOS

---

# 4. ORDEM GERAL DE EXECUÇÃO

## BLOCO A — FUNDAÇÃO

```text
0 Auditoria
1 Repositório
2 Ambiente web local
3 Ambientes/config
4 Backend
5 Auth
6 Perfis infantis
7 Sincronização
```

## BLOCO B — MOTOR DO PRODUTO

```text
8 Progresso/mastery
9 Conteúdo versionado
10 Storage/CDN
11 Audiovisual
12 PWA
13 Offline
```

## BLOCO C — PRODUTO COMERCIAL

```text
14 Painel pais
15 Analytics
16 Observabilidade
17 Segurança/LGPD
18 Pagamentos
19 Free/Premium
20 Admin
```

## BLOCO D — QUALIDADE/LANÇAMENTO

```text
21 QA
22 Performance
23 Deploy
24 Beta
25 Lançamento
```

## BLOCO E — EXPANSÃO

```text
26 Android/iOS
27 Escala conteúdo
28 Jardim 2 / novos anos
29 Escolas
```

---

# 5. FASE 0 — CONGELAR E AUDITAR O PROTÓTIPO ATUAL

## Objetivo

Criar uma fotografia exata do sistema atual antes de qualquer alteração estrutural.

## Claude deve localizar

- arquivos;
- módulos JS;
- CSS;
- dados;
- testes;
- localStorage;
- TTS;
- áudio;
- mapas;
- progresso;
- mastery;
- revisão;
- perfis;
- stars;
- Desafio Final;
- fluxo de navegação;
- dependências.

## PROMPT PARA CLAUDE

```text
Quero iniciar oficialmente a transformação do Ilha Aprendiz de protótipo para produto comercial.

Esta é a FASE 0 — AUDITORIA.

NÃO ALTERE NENHUM ARQUIVO.

Faça uma inspeção completa do repositório atual.

Quero um relatório contendo:

1. árvore atual de arquivos;
2. ponto de entrada do app;
3. como o app é executado hoje;
4. dependências externas;
5. como CSS está organizado;
6. como JS está organizado;
7. como dados curriculares estão organizados;
8. como estado global funciona;
9. como localStorage funciona;
10. como perfis infantis funcionam;
11. como mastery funciona;
12. como revisão espaçada funciona;
13. como Desafio Final funciona;
14. como estrelas/recompensas funcionam;
15. como mapas funcionam;
16. como áudio/TTS funciona;
17. como vídeos funcionam;
18. testes existentes;
19. dívida técnica;
20. riscos de migração;
21. arquivos monolíticos/grandes;
22. pontos de acoplamento;
23. funções globais importantes;
24. código morto ou duplicado;
25. tudo que depende de file://.

Crie:
docs/PRODUCTION_AUDIT.md

Não implemente nada.

Ao final, proponha a menor sequência segura para transformar a base atual em web app de produção sem reescrever o produto.
```

## Gate

Só avançar se você souber:

- o que existe;
- onde está;
- o que pode quebrar.

---

# 6. FASE 1 — ORGANIZAR REPOSITÓRIO PARA PRODUÇÃO

## Objetivo

Preparar estrutura sem mudar comportamento.

## Estrutura desejada aproximada

```text
ilha-aprendiz/
├── app/
├── public/
├── docs/
├── pedagogia/
├── testes/
├── scripts/
├── database/
├── .env.example
├── package.json
├── vite.config.js
└── README.md
```

Não forçar essa árvore se a atual já tiver equivalente.

## PROMPT

```text
Usando PRODUCTION_AUDIT.md como base, execute a FASE 1.

Objetivo:
organizar o repositório para produção sem alterar comportamento funcional.

Antes de implementar, mostre:

- arquivos que serão movidos;
- arquivos que serão criados;
- imports/paths que mudarão;
- testes afetados.

Regras:

- preservar a aplicação atual;
- não migrar framework;
- não alterar pedagogia;
- não alterar mastery;
- não alterar navegação;
- não remover compatibilidade atual até a nova execução estar validada;
- criar .gitignore adequado;
- criar .env.example sem segredos;
- atualizar docs/ARQUITETURA.md.

Depois:
rode toda a suíte.

Pare e reporte.
```

---

# 7. FASE 2 — MIGRAR DE FILE:// PARA AMBIENTE WEB LOCAL

## Por quê

Backend, PWA, APIs e módulos modernos exigirão execução HTTP.

## Ferramenta recomendada

**Vite com Vanilla JavaScript.**

Não significa usar React.

## Resultado

```text
npm install
npm run dev
npm run build
npm run preview
```

## PROMPT

```text
FASE 2 — Ambiente web local.

Quero migrar a execução oficial do Ilha Aprendiz de file:// para um dev server HTTP usando Vite, mantendo Vanilla JS.

NÃO migrar para React.

Objetivos:

1. package.json;
2. scripts dev/build/preview/test;
3. Vite;
4. preservar HTML/CSS/JS existente;
5. corrigir paths;
6. garantir assets;
7. build de produção;
8. documentação de execução;
9. atualizar testes se necessário.

Durante a transição, não apague suporte antigo até confirmar que a versão Vite funciona.

Valide:

- tela inicial;
- perfis;
- Português;
- Matemática;
- mapas;
- atividades;
- áudio;
- vídeo;
- localStorage;
- testes.

Crie também docs/DEV_SETUP.md.

Não faça PWA ainda.
```

---

# 8. FASE 3 — CONFIGURAÇÃO POR AMBIENTES

## Ambientes

```text
development
staging
production
```

## Nunca versionar

- API keys secretas;
- service role Supabase;
- tokens privados.

## PROMPT

```text
FASE 3 — Configuração de ambientes.

Implemente configuração clara para:

development
staging
production

Use variáveis de ambiente adequadas ao Vite.

Crie:
.env.example

Documente:
- quais variáveis existem;
- quais podem estar no frontend;
- quais jamais podem ser expostas.

Não colocar segredo real no git.

Crie docs/ENVIRONMENTS.md.

Não conectar backend ainda; apenas preparar a infraestrutura.
```

---

# 9. FASE 4 — BACKEND E BANCO

## Escolha recomendada

Supabase.

## Tabelas iniciais

```text
accounts/users
children
child_settings
activity_progress
activity_attempts
mastery
review_schedule
achievements
subscriptions
consents
```

### Não criar tudo cegamente

Primeiro modelar.

## PROMPT

```text
FASE 4 — Backend e banco.

Quero usar Supabase como backend inicial.

NÃO crie tabelas ainda.

Primeiro modele o banco com base no app real.

Analise todos os dados atualmente salvos no localStorage.

Produza:

database/SCHEMA_PLAN.md

Inclua:

- tabela;
- finalidade;
- colunas;
- tipos;
- PK/FK;
- índices;
- timestamps;
- ownership;
- retenção;
- dados infantis envolvidos;
- o que NÃO deve ser armazenado.

Princípio:

responsável possui a conta.
criança é perfil dependente.

Evitar PII infantil desnecessária.

Projete Row Level Security desde o início.

Só depois da minha aprovação deverá criar migrations SQL.
```

## Segunda chamada

```text
Plano de banco aprovado.

Agora crie migrations SQL versionadas em database/migrations/.

Implemente RLS.

Crie políticas garantindo que:

- responsável só acessa seus próprios perfis;
- responsável só acessa progresso dos próprios filhos;
- cliente nunca usa service_role;
- uma família nunca enxerga outra.

Crie database/README.md.

Não integrar frontend ainda.

Teste policies sempre que possível.
```

---

# 10. FASE 5 — AUTENTICAÇÃO DO RESPONSÁVEL

## Fluxo

```text
criar conta
↓
confirmar email
↓
login
↓
responsável
↓
perfis infantis
```

## PROMPT

```text
FASE 5 — Auth.

Implemente autenticação apenas para RESPONSÁVEL.

Não criar login individual para criança.

Fluxos:

- cadastro;
- login;
- logout;
- sessão persistente;
- recuperação de senha;
- confirmação de email se configurada.

Requisitos:

- nenhum segredo no frontend;
- mensagens de erro amigáveis;
- loading states;
- sessão restaurada;
- testes.

Não migrar progresso ainda.

Crie uma camada auth-service.js ou equivalente compatível com a arquitetura atual.

Documente docs/AUTH.md.
```

---

# 11. FASE 6 — PERFIS INFANTIS

## Dados mínimos

```text
id
parent_id
display_name
age_band
school_stage
avatar
created_at
```

Evitar data de nascimento completa se faixa etária resolver.

## PROMPT

```text
FASE 6 — Perfis infantis.

Substitua gradualmente perfis hardcoded pela camada de dados de perfis.

Modelo:
responsável → 1..N children.

Dados mínimos.

Não pedir email da criança.

Não pedir sobrenome.

Não pedir localização.

Não pedir escola.

Preserve compatibilidade com os perfis atuais durante migração.

Crie:

child-service.js

Fluxos:
- criar perfil;
- editar nome de exibição;
- escolher avatar;
- selecionar etapa/trilha;
- trocar explorador;
- excluir perfil com confirmação.

Adicionar testes de ownership.
```

---

# 12. FASE 7 — PERSISTÊNCIA EM NUVEM E SINCRONIZAÇÃO

## Estratégia

Durante transição:

```text
localStorage
+
cloud
```

Não remover local imediatamente.

## PROMPT

```text
FASE 7 — Sincronização.

Hoje o app possui progresso local.

Quero migrar para cloud sem perder dados existentes.

Desenhe primeiro uma estratégia de:

local → cloud migration.

Resolver:

- primeiro login;
- progresso local existente;
- conflito local/cloud;
- offline;
- timestamps;
- merge;
- retry;
- falhas de rede.

Não implemente antes de apresentar a estratégia.

Depois da aprovação:
crie sync-service.js.

Regra inicial sugerida:
cloud é fonte de verdade depois da primeira sincronização, mas local funciona como cache operacional.

Nunca apagar progresso local antes da confirmação de gravação remota.
```

---

# 13. FASE 8 — MODELO DEFINITIVO DE PROGRESSO

Separar:

```text
tentativa
atividade
nível
mastery
retenção
módulo
desafio
```

## PROMPT

```text
FASE 8 — Modelo de progresso.

Audite tudo que hoje significa progresso.

Quero separar conceitualmente:

attempt
activity progress
level
mastery
retention
review
module completion
final challenge
achievement

Documente uma máquina de estados ou modelo equivalente.

Não mude regras pedagógicas silenciosamente.

Qualquer mudança deve ser explicitamente listada.

Objetivo:
o backend conseguir representar exatamente o que o app já faz e o que está planejado.

Crie docs/PROGRESS_MODEL.md.

Só depois implemente persistência final.
```

---

# 14. FASE 9 — CONTEÚDO VERSIONADO

## Problema

Se VACA mudar depois, progresso antigo não pode quebrar.

## Cada atividade deveria possuir

```text
activity_id
content_version
curriculum_version
```

## PROMPT

```text
FASE 9 — Versionamento de conteúdo.

Analise como módulos e atividades são identificados hoje.

Quero IDs estáveis.

Defina:

- module_id;
- activity_id;
- content_version;
- curriculum_version;
- media_version quando necessário.

Não use nome visível como chave primária.

Planeje como mudanças futuras de conteúdo afetam progresso antigo.

Crie docs/CONTENT_VERSIONING.md.

Implemente somente depois de validar que IDs existentes podem ser preservados.
```

---

# 15. FASE 10 — STORAGE/CDN

## Inicial

Supabase Storage pode bastar.

Mais tarde:
Cloudflare R2/CDN se necessário.

## Assets

- mapas;
- vídeos;
- áudios;
- imagens.

## PROMPT

```text
FASE 10 — Assets de produção.

Audite app/assets.

Classifique:

- precisa ficar bundled;
- pode ir para storage/CDN;
- deve carregar sob demanda;
- deve ser cacheado.

Não mover nada ainda.

Produza docs/ASSET_STRATEGY.md.

Inclua:

- tamanho;
- formato;
- preload;
- lazy load;
- cache;
- versionamento;
- fallback.

Depois da aprovação:
migrar primeiro apenas uma categoria piloto, não tudo.
```

---

# 16. FASE 11 — SISTEMA AUDIOVISUAL

Manter arquitetura já definida:

```text
video/personagens
audio/lia
audio/fonetica
audio/sfx
```

## PROMPT

```text
FASE 11 — Consolidar mídia.

Use:
VOZ_LIA.md
CHARACTER_BIBLE.md
MEDIA_GUIDELINES.md

como contratos.

Audite o piloto VACA.

Quero transformar o vertical slice em componente reutilizável.

Garantir:

- AudioManager;
- MediaCatalog;
- fallback;
- voice channel;
- character channel;
- SFX channel;
- async/await;
- sem áudio simultâneo indevido;
- preload mínimo;
- stopAll em navegação;
- autoplay fallback.

Não escalar para 87 palavras antes de validar o componente.
```

---

# 17. FASE 12 — PWA

## Só depois do app web estável

Adicionar:

- manifest;
- icons;
- service worker;
- installability;
- standalone;
- theme color;
- update strategy.

## PROMPT

```text
FASE 12 — PWA.

Transforme o web app em PWA instalável.

Antes:
audite compatibilidade.

Implemente:

- manifest.webmanifest;
- ícones necessários;
- display standalone;
- theme/background;
- service worker;
- cache do app shell;
- estratégia de atualização;
- página offline amigável.

NÃO cachear todos os vídeos/áudios.

PWA deve instalar sem exigir backend específico.

Crie testes/documentação:
docs/PWA.md.
```

---

# 18. FASE 13 — OFFLINE PARCIAL

## Ideia

Offline deve permitir:
- abrir app;
- conteúdos recentes;
- registrar progresso;
- sincronizar depois.

## PROMPT

```text
FASE 13 — Offline parcial.

Não quero "baixar o app inteiro".

Projete:

- app shell offline;
- cache das atividades recentes;
- cache da mídia necessária;
- fila local de eventos/progresso;
- retry;
- sincronização posterior.

Defina conflitos claramente.

Crie docs/OFFLINE_SYNC.md antes de implementar.

Não comprometer dados.
```

---

# 19. FASE 14 — PAINEL DOS PAIS

Mostrar:

- evolução;
- mastery;
- retenção;
- dificuldades;
- frequência;
- habilidades;
- BNCC;
- sugestões fora da tela.

## PROMPT

```text
FASE 14 — Painel dos pais.

Separe claramente:

interface infantil
vs
interface adulta.

Crie uma proposta baseada em dados reais já coletados.

Não mostrar métricas inventadas.

Painel deve responder:

- o que aprendeu?
- o que está esquecendo?
- onde precisa de ajuda?
- quanto praticou?
- qual próximo foco?
- quais habilidades BNCC estão envolvidas?

Crie primeiro wireframe textual e modelo de dados.

Só depois implemente.
```

---

# 20. FASE 15 — ANALYTICS PEDAGÓGICO

Eventos úteis:

```text
session_started
activity_started
answer_submitted
hint_used
lesson_reopened
activity_completed
review_completed
session_ended
```

Não registrar dados desnecessários.

## PROMPT

```text
FASE 15 — Telemetria pedagógica.

Defina um catálogo mínimo de eventos.

Para cada evento:
- nome;
- propriedades;
- finalidade;
- retenção;
- dado infantil envolvido?

Evitar:
- texto digitado livre quando desnecessário;
- PII;
- localização;
- fingerprinting.

Crie docs/ANALYTICS_EVENTS.md.

Implemente primeiro usando uma abstração analytics.track().
Backend/provider pode mudar depois.
```

---

# 21. FASE 16 — OBSERVABILIDADE

Precisamos saber quando quebra.

Incluir:
- JS errors;
- API errors;
- sync errors;
- media load errors.

## PROMPT

```text
FASE 16 — Observabilidade.

Crie uma camada de logging/error reporting.

Objetivos:
- não expor dados infantis;
- identificar crashes;
- identificar falhas de sync;
- identificar mídia faltante;
- identificar erro de API.

Não enviar conteúdo pedagógico ou nomes de crianças para logs externos.

Crie docs/OBSERVABILITY.md.
```

---

# 22. FASE 17 — SEGURANÇA E PRIVACIDADE / LGPD

## Essencial antes de comercializar

Tratar:
- conta do responsável;
- consentimento;
- dados de criança;
- exclusão;
- exportação;
- retenção;
- segurança.

## PROMPT

```text
FASE 17 — Privacy by Design.

Faça uma auditoria de dados do Ilha Aprendiz.

Liste:

- cada dado coletado;
- por que existe;
- onde fica;
- quem acessa;
- retenção;
- como excluir;
- como exportar;
- risco.

Classifique dados de criança separadamente.

Produza:
docs/PRIVACY_DATA_MAP.md

Crie recomendações técnicas para LGPD e produtos infantis.

Não escrever política jurídica final como se substituísse advogado.

Marque pontos que exigem revisão jurídica profissional antes do lançamento.
```

---

# 23. FASE 18 — PAGAMENTOS

Primeiro web.

## Fluxo

```text
responsável
↓
plano
↓
checkout
↓
assinatura ativa
↓
entitlements
```

Nunca confiar apenas no frontend.

## PROMPT

```text
FASE 18 — Assinaturas.

Antes de codificar:
modele o sistema de entitlement.

Não quero simplesmente "isPremium=true" no frontend.

Defina:

plans
subscriptions
entitlements
billing status
grace period
canceled
past_due
trial

Escolha entre Stripe e Mercado Pago considerando:
- Brasil;
- assinatura recorrente;
- webhook;
- documentação;
- manutenção.

Apresente comparação.

Só depois escolhemos provider.
```

---

# 24. FASE 19 — FREE / PREMIUM

## Exemplo

FREE:
- primeiras regiões;
- progresso básico.

PREMIUM:
- trilhas completas;
- múltiplos perfis;
- relatórios;
- conteúdo extra.

## PROMPT

```text
FASE 19 — Produto Free/Premium.

Não implemente paywall aleatório.

Mapeie funcionalidades.

Quero um modelo que deixe o gratuito realmente utilizável.

Defina:
- free;
- premium;
- trial;
- família;
- limites.

Separar entitlement de UI.

Crie docs/MONETIZATION_MODEL.md.
```

---

# 25. FASE 20 — ADMIN

No início pode ser simples.

Necessidades:
- suporte;
- famílias;
- assinaturas;
- conteúdos;
- erros;
- versão curricular.

## PROMPT

```text
FASE 20 — Admin.

Não construir CMS gigante.

Liste as operações administrativas realmente necessárias no lançamento.

Separe:
- suporte;
- contas;
- assinatura;
- conteúdo;
- métricas.

Proponha MVP admin.

Segurança:
admin nunca pode ser apenas um botão escondido no frontend.

Defina autenticação/autorização.
```

---

# 26. FASE 21 — QA / ACESSIBILIDADE / E2E

Adicionar Playwright quando web app estiver estável.

Testes:

- login;
- criar filho;
- iniciar atividade;
- responder;
- progresso;
- logout/login;
- sync;
- premium;
- mobile viewport.

## PROMPT

```text
FASE 21 — QA de produção.

Audite testes atuais.

Classifique:

unit
integration
content validation
E2E
accessibility

Introduza Playwright apenas para fluxos reais principais.

Crie cenários E2E:

1 cadastro
2 login
3 criar perfil
4 abrir Português
5 completar atividade
6 salvar progresso
7 recarregar página
8 progresso permanece
9 logout/login
10 progresso permanece

Adicionar acessibilidade automatizada quando possível.

Não substituir testes unitários por E2E.
```

---

# 27. FASE 22 — PERFORMANCE

Metas:
- rápido em celular mediano;
- mídia sob demanda;
- evitar bundle gigante.

Auditar:
- JS;
- imagens;
- mapas;
- vídeos;
- áudio.

## PROMPT

```text
FASE 22 — Performance.

Meça antes de otimizar.

Relatório:
- bundle;
- Largest Contentful Paint;
- imagens;
- vídeos;
- áudio;
- requests;
- cache;
- primeira carga.

Proponha budgets.

Não degradar qualidade de mídia sem necessidade.

Implementar otimizações uma por vez.
```

---

# 28. FASE 23 — DEPLOY DE PRODUÇÃO

Ambientes:

```text
dev
staging
prod
```

CI:

```text
push
↓
tests
↓
build
↓
deploy
```

## PROMPT

```text
FASE 23 — CI/CD.

Configure deploy de staging primeiro.

Pipeline:
install
test
build
deploy

Nenhum deploy de produção se teste falhar.

Documentar rollback.

Depois criar produção.

Não misturar banco de staging e produção.
```

---

# 29. FASE 24 — BETA FECHADO

Primeiros usuários:
- família;
- amigos;
- poucas famílias convidadas.

Medir:
- bugs;
- compreensão;
- retenção;
- abandonos;
- device compatibility.

## Checklist

```text
20–50 famílias
↓
2–4 semanas
↓
corrigir
↓
nova rodada
```

---

# 30. FASE 25 — LANÇAMENTO WEB/PWA

Antes:

- domínio;
- HTTPS;
- suporte;
- termos;
- privacidade;
- assinatura;
- onboarding;
- recuperação de conta;
- exclusão de conta;
- backup;
- monitoramento.

---

# 31. FASE 26 — ANDROID / IOS

Somente depois do produto web/PWA provar valor.

Tecnologia:
**Capacitor**.

## PROMPT

```text
FASE 26 — Mobile packaging.

Audite PWA antes de empacotar.

Use Capacitor.

Não reescrever app.

Verificar:
- audio;
- video;
- storage;
- safe areas;
- keyboard;
- back button;
- deep links;
- status bar;
- app lifecycle.

Criar Android primeiro.

iOS depois.

Mapear exigências das lojas separadamente.
```

---

# 32. FASE 27 — ESCALA DE CONTEÚDO

Antes de crescer:
- motor estável;
- analytics;
- revisão;
- versionamento.

Pipeline:

```text
objetivo BNCC
↓
atividade
↓
motor ensino
↓
mídia
↓
QA pedagógico
↓
QA técnico
↓
publicação
```

---

# 33. FASE 28 — JARDIM 2 E NOVOS ANOS

O protótipo Jardim 2 já existe.

Não implementar até:
- matriz EI03;
- motor apropriado;
- tipos discovery/challenge/experience;
- acompanhamento sem promoção.

Novos anos devem reutilizar plataforma, não duplicar app.

---

# 34. FASE 29 — ESCOLAS

Só depois do B2C familiar.

Possível futuro:

```text
escola
├── professores
├── turmas
├── alunos
└── relatórios
```

Não construir agora.

---

# 35. PIPELINE DIÁRIO COM CLAUDE

Use sempre:

## PROMPT BASE DE INÍCIO

```text
Antes de alterar código:

1. leia CLAUDE.md;
2. leia docs/ARQUITETURA.md;
3. leia ROADMAP.md;
4. leia DECISOES.md;
5. leia arquivos diretamente relacionados à tarefa;
6. rode baseline dos testes relevantes;
7. descreva o plano;
8. liste arquivos que pretende modificar;
9. liste riscos;
10. espere aprovação se a mudança for estrutural.

Não faça refatorações não relacionadas.

Depois de implementar:
- rode testes;
- atualize documentação necessária;
- mostre diff/resumo;
- informe o que preciso validar manualmente.
```

---

# 36. CONVENÇÃO DE BRANCHES E COMMITS

Sugestão:

```text
main
develop (opcional)
feature/...
fix/...
infra/...
```

Exemplos:

```text
feature/auth-parent
feature/cloud-sync
infra/vite-migration
fix/audio-overlap
```

Commits:

```text
feat: add parent authentication
feat: add child cloud profiles
fix: prevent overlapping voice playback
test: add cloud sync integration tests
docs: document production architecture
```

Antes de fase grande:

```bash
git status
git add .
git commit -m "chore: stable checkpoint before production phase X"
```

---

# 37. CHECKLIST DE PRODUÇÃO

## Conta

- [ ] cadastro
- [ ] login
- [ ] logout
- [ ] recuperação
- [ ] confirmação
- [ ] exclusão

## Crianças

- [ ] criar
- [ ] editar
- [ ] excluir
- [ ] múltiplos perfis
- [ ] ownership

## Progresso

- [ ] cloud
- [ ] local cache
- [ ] sync
- [ ] retry
- [ ] offline
- [ ] conflitos

## Pedagogia

- [ ] mastery
- [ ] revisão
- [ ] desafios
- [ ] Motor de Ensino
- [ ] reensino
- [ ] BNCC

## Mídia

- [ ] voz Lia
- [ ] fonética
- [ ] vídeo
- [ ] SFX
- [ ] fallback
- [ ] preload

## Comercial

- [ ] plano
- [ ] checkout
- [ ] assinatura
- [ ] entitlement
- [ ] cancelamento
- [ ] grace period

## Legal/privacidade

- [ ] mapa de dados
- [ ] consentimento
- [ ] exclusão
- [ ] exportação
- [ ] revisão jurídica

## Qualidade

- [ ] unit
- [ ] integration
- [ ] E2E
- [ ] accessibility
- [ ] mobile
- [ ] performance

---

# 38. CRITÉRIOS DE “PRONTO PARA MONETIZAR”

Não cobrar usuários antes de existir:

1. conta confiável;
2. recuperação de senha;
3. progresso em nuvem;
4. ownership correto;
5. segurança/RLS;
6. backup;
7. política de exclusão;
8. assinatura;
9. entitlement server-side;
10. suporte mínimo;
11. ambiente staging;
12. testes E2E;
13. analytics;
14. error reporting;
15. política de privacidade revisada;
16. experiência mobile validada.

---

# 39. O QUE NÃO FAZER AGORA

Não:

- reescrever em React sem motivo;
- produzir todos os anos;
- criar escola/professor;
- construir app nativo;
- criar CMS completo;
- cachear todos os vídeos offline;
- gerar milhares de assets;
- coletar PII infantil desnecessária;
- colocar service_role no frontend;
- implementar pagamento antes de entitlement;
- remover localStorage antes da sync estar estável.

---

# 40. PRÓXIMA AÇÃO IMEDIATA

## AGORA

Não começar por Supabase.

Primeiro executar:

### FASE 0 — PRODUCTION_AUDIT

Depois:

### FASE 1 — REPOSITÓRIO

Depois:

### FASE 2 — VITE

Só então:

### BACKEND.

---

# PROMPT EXATO PARA VOCÊ ENVIAR AGORA AO CLAUDE

```text
Quero iniciar uma nova fase oficial do projeto Ilha Aprendiz: transformação do protótipo atual em produto comercial web/PWA.

NÃO implemente mudanças estruturais ainda.

Sua primeira tarefa é a FASE 0 — PRODUCTION AUDIT.

Leia todo o projeto atual, especialmente:

CLAUDE.md
docs/ARQUITETURA.md
ROADMAP.md
DECISOES.md
CHANGELOG.md
REGRAS_PERMANENTES.md
app/
testes/
pedagogia/

Produza um diagnóstico técnico completo do repositório atual.

Quero saber:

1. arquitetura atual;
2. entry point;
3. execução file:// ou servidor;
4. módulos e dependências;
5. estado global;
6. localStorage;
7. perfis;
8. progresso;
9. mastery;
10. revisão espaçada;
11. Desafio Final;
12. mapas;
13. áudio/TTS;
14. vídeo;
15. assets;
16. testes;
17. pontos de acoplamento;
18. dívida técnica;
19. código duplicado;
20. funções globais;
21. restrições técnicas atuais;
22. tudo que quebraria ao migrar para Vite;
23. tudo que quebraria ao adicionar Supabase;
24. tudo que precisa permanecer retrocompatível;
25. riscos relacionados a mobile/PWA.

Crie:

docs/PRODUCTION_AUDIT.md

No final, proponha uma sequência de migração mínima e segura para:

protótipo atual
→ Vite/HTTP
→ ambientes
→ Supabase
→ auth do responsável
→ perfis infantis
→ progresso cloud
→ PWA
→ monetização.

Não altere código nesta fase.

Não instale dependências.

Não mova arquivos.

Não faça commits de implementação.

Pare após entregar a auditoria e o plano.
```

---

# REGRA FINAL

O objetivo não é “terminar rápido”.

O objetivo é:

> **não precisar reconstruir o Ilha Aprendiz quando ele começar a ter usuários pagantes.**

Cada fase deve deixar o produto funcionando melhor do que estava antes e preservar o investimento já feito em currículo, atividades, mapas, personagens, áudio e testes.

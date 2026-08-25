// Cliente Supabase isolado — Fase 4.3.
// Processado pelo Vite como ES Module separado (entry em vite.config.mjs);
// NÃO vive em app/ (publicDir), que é copiado sem transformação.
//
// Expõe window.supabaseClient para os scripts clássicos consumirem.
// type="module" é deferido: este módulo executa DEPOIS dos 24 scripts
// clássicos. Nenhum script clássico depende sincronamente deste valor —
// qualquer consumidor futuro deve tratar readiness explicitamente.
//
// Sem URL/key: window.supabaseClient = null — app continua com localStorage.
// Sem Auth, sem dados, sem sync nesta fase.

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

window.supabaseClient = (url && key) ? createClient(url, key) : null;

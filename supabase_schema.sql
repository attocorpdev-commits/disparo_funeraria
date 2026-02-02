-- Criação da tabela de contatos
create table contacts (
  id uuid default gen_random_uuid() primary key,
  phone text not null unique,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security (RLS) para segurança
alter table contacts enable row level security;

-- Política de segurança: permitir leitura/escrita pública por enquanto (ajuste conforme necessário)
create policy "Allow all access to contacts" on contacts for all using (true);

-- Criação da tabela de campanhas
create table campaigns (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  message_content text,
  status text default 'draft' check (status in ('draft', 'sending', 'completed', 'failed', 'paused', 'cancelled')),
  total_contacts integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table campaigns enable row level security;
create policy "Allow all access to campaigns" on campaigns for all using (true);

-- Criação da tabela de logs de envio (opcional, para detalhamento futuro)
create table campaign_logs (
  id uuid default gen_random_uuid() primary key,
  campaign_id uuid references campaigns(id) on delete cascade,
  contact_id uuid references contacts(id) on delete set null,
  status text default 'pending', -- 'sent', 'failed'
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table campaign_logs enable row level security;
create policy "Allow all access to campaign_logs" on campaign_logs for all using (true);
-- PASSO EXTRA: Configuração de Webhook do Supabase
-- Você pode configurar isso via interface do Supabase em:
-- Database -> Webhooks -> Create a new webhook
-- 1. Nome: 'process_command'
-- 2. Tabela: 'campaigns'
-- 3. Events: 'Update'
-- 4. HTTP Request: POST 'https://webhook.dev.projetoagenciadeia.shop/webhook/5887b9a8-4431-4476-8235-63dcd0a90116'
-- 5. Payload: (Automaticamente enviado pelo Supabase)

-- Caso prefira via SQL (requer extensão 'net' ativa):
-- select sql_help('CREATE TRIGGER');

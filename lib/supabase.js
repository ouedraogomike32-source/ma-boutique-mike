import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
  Table SQL à créer dans Supabase (onglet "SQL Editor") :

  create table products (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    price numeric not null,
    description text,
    image_url text,
    created_at timestamp default now()
  );

  create table orders (
    id uuid primary key default gen_random_uuid(),
    customer_name text not null,
    phone text not null,
    address text not null,
    items jsonb not null,
    total numeric not null,
    payment_method text not null,
    status text default 'en_attente',
    created_at timestamp default now()
  );

  -- Autoriser la lecture publique des produits
  alter table products enable row level security;
  create policy "Lecture publique des produits" on products for select using (true);

  -- Autoriser la création de commandes par n'importe qui
  alter table orders enable row level security;
  create policy "Création de commandes" on orders for insert with check (true);
*/

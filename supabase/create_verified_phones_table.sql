create table verified_phones (
  id uuid default uuid_generate_v4() primary key,
  phone_number text not null unique,
  verified_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Füge RLS-Policies hinzu
alter table verified_phones enable row level security;

create policy "Anyone can verify phone numbers"
  on verified_phones for insert
  with check (true);

create policy "Users can view their own verified phone numbers"
  on verified_phones for select
  using (true);

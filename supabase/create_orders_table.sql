-- Create orders table
create table public.orders (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) not null,
    items jsonb not null,
    total decimal(10,2) not null,
    status text not null default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint status_check check (status in ('pending', 'processing', 'completed', 'cancelled'))
);

-- Enable RLS
alter table public.orders enable row level security;

-- Create policies
create policy "Users can view their own orders"
    on public.orders for select
    using (auth.uid() = user_id);

create policy "Users can insert their own orders"
    on public.orders for insert
    with check (auth.uid() = user_id);

-- Create function to update updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$;

-- Create trigger for updated_at
create trigger handle_updated_at
    before update on public.orders
    for each row
    execute function public.handle_updated_at();

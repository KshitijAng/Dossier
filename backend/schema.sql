-- Run this once in the Supabase SQL editor to create the runs table.

create table if not exists research_runs (
    id           uuid primary key default gen_random_uuid(),
    query        text not null,
    report       text not null,
    citations    jsonb not null default '[]',
    critic_score int not null,
    created_at   timestamptz not null default now()
);

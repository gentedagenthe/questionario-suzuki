create table candidatos_esteticista (
  id uuid primary key default gen_random_uuid(),
  nome_completo text not null,
  cpf text not null,
  email text not null,
  telefone text not null,
  cidade text not null,
  estado text not null,
  formacao_estetica text not null,
  instituicao_ensino text not null,
  ano_conclusao text not null,
  ja_atuou_esteticista text not null,
  procedimentos_dominados text not null,
  tempo_experiencia text not null,
  empresa_anterior text not null,
  disponibilidade_horario text not null,
  pretensao_salarial text not null,
  motivo_interesse text not null,
  experiencia_atendimento_publico text not null,
  lgpd_consentimento boolean not null,
  created_at timestamptz not null default now()
);

alter table candidatos_esteticista enable row level security;

create policy "Permitir insercao publica"
  on candidatos_esteticista for insert
  to anon
  with check (true);

create policy "Permitir leitura autenticada"
  on candidatos_esteticista for select
  to anon
  using (true);

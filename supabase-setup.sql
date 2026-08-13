-- ============================================================
-- 교정(Gyojeong) 밴드 웹사이트 — Supabase 초기 세팅
-- Supabase SQL Editor에서 실행
-- ============================================================

-- 1. bands (멀티밴드 확장용)
create table if not exists bands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  genre text,
  formed_year int,
  profile_image text,
  sns_links jsonb default '{}',
  created_at timestamptz default now()
);

-- 기본 밴드 삽입
insert into bands (name, genre, description)
values ('교정', '록/인디록', '밴드 교정입니다.')
on conflict do nothing;

-- 2. members
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  band_id uuid references bands(id) on delete cascade,
  name text not null,
  role text not null,
  bio text,
  photo text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 3. shows (공연 일정)
create table if not exists shows (
  id uuid primary key default gen_random_uuid(),
  band_id uuid references bands(id) on delete cascade,
  title text not null,
  venue text not null,
  address text,
  show_date timestamptz not null,
  description text,
  poster_image text,
  ticket_url text,
  ticket_price text,
  is_published boolean default true,
  created_at timestamptz default now()
);

-- 4. albums
create table if not exists albums (
  id uuid primary key default gen_random_uuid(),
  band_id uuid references bands(id) on delete cascade,
  title text not null,
  release_date date,
  cover_image text,
  description text,
  streaming_links jsonb default '{}',
  created_at timestamptz default now()
);

-- 5. tracks
create table if not exists tracks (
  id uuid primary key default gen_random_uuid(),
  album_id uuid references albums(id) on delete cascade,
  title text not null,
  track_number int not null,
  duration text
);

-- 6. gallery
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  band_id uuid references bands(id) on delete cascade,
  title text not null,
  description text,
  images text[] default '{}',
  is_published boolean default true,
  created_at timestamptz default now()
);

-- 7. site_settings (단일 행)
create table if not exists site_settings (
  id int primary key default 1 check (id = 1),
  band_name text default '교정',
  contact_email text default '',
  instagram_url text default '',
  youtube_url text default '',
  soundcloud_url text default ''
);

insert into site_settings (id) values (1) on conflict do nothing;

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================

alter table bands enable row level security;
alter table members enable row level security;
alter table shows enable row level security;
alter table albums enable row level security;
alter table tracks enable row level security;
alter table gallery enable row level security;
alter table site_settings enable row level security;

-- Public read
create policy "Public read bands" on bands for select using (true);
create policy "Public read members" on members for select using (true);
create policy "Public read shows" on shows for select using (true);
create policy "Public read albums" on albums for select using (true);
create policy "Public read tracks" on tracks for select using (true);
create policy "Public read gallery" on gallery for select using (true);
create policy "Public read site_settings" on site_settings for select using (true);

-- Authenticated full access
create policy "Auth manage bands" on bands for all using (auth.role() = 'authenticated');
create policy "Auth manage members" on members for all using (auth.role() = 'authenticated');
create policy "Auth manage shows" on shows for all using (auth.role() = 'authenticated');
create policy "Auth manage albums" on albums for all using (auth.role() = 'authenticated');
create policy "Auth manage tracks" on tracks for all using (auth.role() = 'authenticated');
create policy "Auth manage gallery" on gallery for all using (auth.role() = 'authenticated');
create policy "Auth update site_settings" on site_settings for update using (auth.role() = 'authenticated');

-- ============================================================
-- Storage
-- ============================================================

insert into storage.buckets (id, name, public)
values ('band-images', 'band-images', true)
on conflict do nothing;

create policy "Public read band-images" on storage.objects
  for select using (bucket_id = 'band-images');

create policy "Auth upload band-images" on storage.objects
  for insert with check (bucket_id = 'band-images' and auth.role() = 'authenticated');

create policy "Auth delete band-images" on storage.objects
  for delete using (bucket_id = 'band-images' and auth.role() = 'authenticated');

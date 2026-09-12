-- Notebook catalog for NoteMatch recommendations.
-- Run in the Supabase SQL editor alongside leads.sql.
-- Seed matches the existing app catalog (src/lib/catalog.ts) — do not invent a separate list.

create table if not exists public.notebooks (
  id text primary key,
  name text not null,
  brand text not null,
  price text not null,
  price_value integer not null,
  processor text not null,
  ram text not null,
  storage text not null,
  gpu text not null,
  screen text not null,
  description text not null,
  reason text not null,
  categories text[] not null default '{}',
  created_at timestamptz default now()
);

alter table public.notebooks enable row level security;

-- Explicit grants (Data API no longer auto-exposes new tables on all projects).
grant select on table public.notebooks to anon, authenticated;
grant select, insert, update, delete on table public.notebooks to service_role;

drop policy if exists "Public read notebooks" on public.notebooks;
create policy "Public read notebooks"
  on public.notebooks
  for select
  to anon, authenticated
  using (true);

insert into public.notebooks (
  id, name, brand, price, price_value, processor, ram, storage, gpu, screen,
  description, reason, categories
) values
  (
    'acer-aspire-go-15',
    'Acer Aspire Go 15',
    'Acer',
    'R$ 2.499',
    2499,
    'Intel Core i5-13420H',
    '16GB DDR4',
    '512GB SSD',
    'Intel UHD Graphics',
    '15.6" Full HD',
    'Excelente custo-benefício para uso diário, estudos e trabalho',
    'Perfeito para navegação, streaming de vídeos, pacote Office e estudos. 16GB de RAM garante multitarefa sem travamentos.',
    array['basic', 'student']::text[]
  ),
  (
    'lenovo-ideapad-slim-3',
    'Lenovo IdeaPad Slim 3',
    'Lenovo',
    'R$ 3.299',
    3299,
    'AMD Ryzen 7 7735HS',
    '16GB DDR4',
    '512GB SSD',
    'AMD Radeon Graphics',
    '15.6" Full HD',
    'Notebook versátil e rápido para tarefas do dia a dia',
    'Processador Ryzen 7 oferece excelente performance para uso geral. Ideal para estudantes e profissionais que precisam de um notebook confiável.',
    array['basic', 'student']::text[]
  ),
  (
    'samsung-galaxy-book4',
    'Samsung Galaxy Book4',
    'Samsung',
    'R$ 4.799',
    4799,
    'Intel Core 7 150U',
    '16GB LPDDR4X',
    '512GB SSD',
    'Intel Graphics',
    '15.6" Full HD',
    'Ultrafino para produtividade e estudos avançados',
    'Boa escolha para quem quer mobilidade, desempenho consistente e integração com ecossistema Samsung.',
    array['basic', 'student', 'programming']::text[]
  ),
  (
    'asus-vivobook-16',
    'Asus Vivobook 16',
    'Asus',
    'R$ 5.699',
    5699,
    'AMD Ryzen 7 8845HS',
    '16GB DDR5',
    '1TB SSD',
    'Radeon 780M',
    '16" WUXGA',
    'Modelo equilibrado para produtividade, programação e multitarefa intensa',
    'Entrega desempenho forte para estudos, trabalho técnico e uso profissional sem entrar na faixa premium.',
    array['student', 'programming', 'basic']::text[]
  ),
  (
    'lenovo-loq-15',
    'Lenovo LOQ 15',
    'Lenovo',
    'R$ 5.999',
    5999,
    'Intel Core i7-13620H',
    '16GB DDR5',
    '512GB SSD',
    'NVIDIA RTX 4050',
    '15.6" Full HD 144Hz',
    'Entrada gamer com GPU dedicada e bom equilíbrio geral',
    'Boa porta de entrada para games e softwares gráficos com orçamento intermediário.',
    array['gaming', 'engineering', 'design']::text[]
  ),
  (
    'lenovo-legion-5-pro',
    'Lenovo Legion 5 Pro',
    'Lenovo',
    'R$ 7.499',
    7499,
    'AMD Ryzen 7 7735HS',
    '16GB DDR5',
    '512GB SSD',
    'NVIDIA RTX 4060',
    '16" WQXGA 165Hz',
    'Excelente custo-benefício para gamers com display de alta taxa de atualização',
    'Ótimo equilíbrio entre preço e performance. Roda Fortnite e Valorant em configurações altas com mais de 144 FPS.',
    array['gaming']::text[]
  ),
  (
    'macbook-air-m4',
    'MacBook Air M4',
    'Apple',
    'R$ 9.999',
    9999,
    'Apple M4 (10 núcleos)',
    '16GB Unified Memory',
    '512GB SSD',
    'GPU integrada 10 núcleos',
    '15.3" Liquid Retina',
    'Ultraleve e silencioso, perfeito para desenvolvimento com até 18h de bateria',
    'Excelente para desenvolvimento. Compila código rapidamente, roda Docker e tem bateria para o dia inteiro.',
    array['programming']::text[]
  ),
  (
    'lenovo-thinkpad-x9-15',
    'Lenovo ThinkPad X9 15',
    'Lenovo',
    'R$ 8.499',
    8499,
    'Intel Core Ultra 7 256V',
    '32GB LPDDR5X',
    '1TB SSD',
    'Intel Arc Graphics',
    '15" OLED 2.8K',
    'Ultraportátil com teclado excepcional e longa duração de bateria',
    'Teclado excelente para longas sessões de código e 32GB de RAM para múltiplas VMs e containers.',
    array['programming']::text[]
  ),
  (
    'alienware-m16-r2',
    'Alienware m16 R2',
    'Alienware',
    'R$ 12.999',
    12999,
    'Intel Core i9-13900HX',
    '32GB DDR5',
    '1TB SSD NVMe',
    'NVIDIA RTX 4080',
    '16" QHD+ 240Hz',
    'Notebook gamer de alta performance com refrigeração avançada e teclado RGB customizável',
    'Perfeito para jogos modernos em configurações ultra. A RTX 4080 garante mais de 100 FPS em Fortnite.',
    array['gaming']::text[]
  ),
  (
    'macbook-pro-16-m4-pro',
    'MacBook Pro 16" M4 Pro',
    'Apple',
    'R$ 19.999',
    19999,
    'Apple M4 Pro (14 núcleos)',
    '32GB Unified Memory',
    '1TB SSD',
    'GPU integrada 20 núcleos',
    '16.2" Liquid Retina XDR',
    'Melhor notebook para design com tela de alta precisão de cores e performance excepcional',
    'A tela oferece ampla fidelidade de cores, ideal para trabalho profissional com imagem e vídeo.',
    array['design']::text[]
  ),
  (
    'asus-proart-p16',
    'Asus ProArt P16',
    'Asus',
    'R$ 14.999',
    14999,
    'AMD Ryzen AI 9 HX 370',
    '32GB DDR5',
    '1TB SSD',
    'NVIDIA RTX 5090',
    '16" 4K OLED',
    'Notebook profissional para criadores com certificação Pantone e GPU potente',
    'Display OLED 4K e GPU potente para renderizações e efeitos pesados.',
    array['design']::text[]
  ),
  (
    'lenovo-thinkpad-p1-gen-7',
    'Lenovo ThinkPad P1 Gen 7',
    'Lenovo',
    'R$ 16.499',
    16499,
    'Intel Core i9-14900HX',
    '64GB DDR5',
    '2TB SSD',
    'NVIDIA RTX 4070',
    '16" WQUXGA',
    'Workstation mobile certificada para aplicações de engenharia e CAD',
    'Indicada para AutoCAD, SolidWorks e simulações com projetos complexos.',
    array['engineering']::text[]
  ),
  (
    'dell-precision-5690',
    'Dell Precision 5690',
    'Dell',
    'R$ 18.999',
    18999,
    'Intel Core Ultra 9 185H',
    '32GB DDR5',
    '1TB SSD',
    'NVIDIA RTX 3500 Ada',
    '16" UHD+',
    'Workstation premium com certificações ISV para software de engenharia',
    'Certificado para AutoCAD, ANSYS e MATLAB com foco em desempenho profissional.',
    array['engineering']::text[]
  )
on conflict (id) do update set
  name = excluded.name,
  brand = excluded.brand,
  price = excluded.price,
  price_value = excluded.price_value,
  processor = excluded.processor,
  ram = excluded.ram,
  storage = excluded.storage,
  gpu = excluded.gpu,
  screen = excluded.screen,
  description = excluded.description,
  reason = excluded.reason,
  categories = excluded.categories;

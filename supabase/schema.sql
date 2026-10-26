-- FurniCasa database schema
-- Run this file once in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_ar text not null,
  category text not null,
  price numeric(12, 2) not null check (price >= 0),
  image_url text not null,
  description_en text not null default '',
  description_ar text not null default '',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null default '',
  address text not null default '',
  language text not null default 'en' check (language in ('en', 'ar')),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inquiry_items (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name_en text not null,
  product_name_ar text not null,
  image_url text not null default '',
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  language text not null default 'en' check (language in ('en', 'ar')),
  status text not null default 'new' check (status in ('new', 'read', 'replied')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists products_category_idx on public.products(category);
create index if not exists products_featured_idx on public.products(is_featured) where is_active = true;
create index if not exists inquiries_created_at_idx on public.inquiries(created_at desc);
create index if not exists inquiry_items_inquiry_id_idx on public.inquiry_items(inquiry_id);
create index if not exists contact_messages_created_at_idx on public.contact_messages(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute procedure public.set_updated_at();

drop trigger if exists inquiries_set_updated_at on public.inquiries;
create trigger inquiries_set_updated_at
before update on public.inquiries
for each row execute procedure public.set_updated_at();

drop trigger if exists contact_messages_set_updated_at on public.contact_messages;
create trigger contact_messages_set_updated_at
before update on public.contact_messages
for each row execute procedure public.set_updated_at();

alter table public.products enable row level security;
alter table public.inquiries enable row level security;
alter table public.inquiry_items enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products"
on public.products for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public can create inquiries" on public.inquiries;
create policy "Public can create inquiries"
on public.inquiries for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can add inquiry items" on public.inquiry_items;
create policy "Public can add inquiry items"
on public.inquiry_items for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can create contact messages" on public.contact_messages;
create policy "Public can create contact messages"
on public.contact_messages for insert
to anon, authenticated
with check (true);

grant usage on schema public to anon, authenticated;
grant select on public.products to anon, authenticated;
grant insert on public.inquiries, public.inquiry_items, public.contact_messages to anon, authenticated;

insert into public.products (
  slug,
  name_en,
  name_ar,
  category,
  price,
  image_url,
  description_en,
  description_ar,
  is_featured
)
values
  ('modern-sofa', 'Modern Sofa', 'أريكة عصرية', 'Sofas', 85000, '/assets/categories/sofas.jpg', 'A soft, balanced sofa for relaxed everyday living.', 'أريكة ناعمة ومتوازنة للحياة اليومية المريحة.', true),
  ('lounge-chair', 'Lounge Chair', 'كرسي استرخاء', 'Chairs', 32000, '/assets/categories/lounge-chairs.jpg', 'A supportive accent chair for reading and unwinding.', 'كرسي مريح للقراءة والاسترخاء.', true),
  ('wooden-dining-table', 'Wooden Dining Table', 'طاولة طعام خشبية', 'Dining', 45000, '/assets/categories/dining-sets.jpg', 'A warm dining table made for shared moments.', 'طاولة طعام دافئة للحظات المشتركة.', true),
  ('comfort-bed', 'Comfort Bed', 'سرير مريح', 'Beds', 95000, '/assets/categories/beds.jpg', 'A calm, supportive centrepiece for restful bedrooms.', 'قطعة مريحة لغرف النوم الهادئة.', true),
  ('wooden-cabinet', 'Wooden Cabinet', 'خزانة خشبية', 'Storage', 38000, '/assets/categories/storage.jpg', 'Practical storage with a warm natural finish.', 'تخزين عملي بلمسة طبيعية دافئة.', false),
  ('bookshelf', 'Bookshelf', 'رف كتب', 'Storage', 28000, '/assets/categories/bookshelves.jpg', 'Open shelving for books, objects and daily essentials.', 'رفوف مفتوحة للكتب والأغراض اليومية.', false),
  ('coffee-table', 'Coffee Table', 'طاولة قهوة', 'Tables', 22000, '/assets/categories/coffee-table.jpg', 'A simple centre table with timeless character.', 'طاولة مركزية بسيطة بطابع خالد.', false),
  ('office-chair', 'Office Chair', 'كرسي مكتب', 'Chairs', 18000, '/assets/categories/office-furniture.jpg', 'Comfortable support for focused work at home.', 'دعم مريح للعمل المركّز في المنزل.', false)
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  category = excluded.category,
  price = excluded.price,
  image_url = excluded.image_url,
  description_en = excluded.description_en,
  description_ar = excluded.description_ar,
  is_featured = excluded.is_featured,
  updated_at = timezone('utc', now());

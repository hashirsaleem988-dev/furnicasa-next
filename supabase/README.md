# FurniCasa Supabase setup

1. Create or open a Supabase project.
2. Open **SQL Editor** and run [`schema.sql`](./schema.sql).
3. Copy `.env.local.example` to `.env.local`.
4. Add the project URL and public anon key from **Project Settings > API**.
5. Restart the dev server with `npm run dev`.

The public anon key is safe for browser use when the Row Level Security policies in
`schema.sql` are enabled. Never put a Supabase `service_role` key in `.env.local`
for this frontend.

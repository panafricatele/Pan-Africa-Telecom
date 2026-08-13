# Supabase Migration & Seeding Guide

## Step 1: Run the Migration

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project **Pan Africa Telecom**
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Open `supabase/migration.sql` and copy all contents
6. Paste into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)

This will create all necessary tables including `coverage_areas`.

## Step 2: Seed the Data

After migration completes, run:

```bash
node scripts/seed-coverage.js
```

This will insert 39 coverage areas across all major South African cities.

## Verification

Check the Supabase dashboard:
1. Go to **Table Editor**
2. Select **coverage_areas** table
3. You should see 39 rows with all cities and areas

## Troubleshooting

**Error: "Could not find the table 'public.coverage_areas'"**
- Migration hasn't run yet. Complete Step 1 first.

**Error: "Duplicate key value violates unique constraint"**
- Data already exists. This is fine - the seed script uses `ON CONFLICT DO NOTHING`.

**Frontend still not showing data**
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh the page
- Check browser console for errors

#!/bin/bash

# Apply seed data to Supabase
# Usage: ./supabase/apply-seed.sh

echo "Applying seed data to Supabase..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Apply the seed data
supabase db push
supabase db execute supabase/seed-data.sql

echo "Seed data applied successfully!"

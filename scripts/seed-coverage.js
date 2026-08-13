#!/usr/bin/env node

/**
 * Seed coverage areas to Supabase
 * Usage: node scripts/seed-coverage.js
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://nydtwlzhaqpnzcvaijkk.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZHR3bHpoYXFwbnpjdmFpamtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMTY0OTQsImV4cCI6MjEwMTY5MjQ5NH0.GmB0SzsC-kjGi5_rJDs_Ax3IwVjjbkiXD10HwPLSmgU';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const coverageAreas = [
  // KwaZulu-Natal
  { city: 'Durban', area: 'Central Business District', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'Durban', area: 'Umhlanga', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'Durban', area: 'Westville', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'Durban', area: 'Berea', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'Pietermaritzburg', area: 'Central', technologies: ['fibre', 'fixed-wireless', 'lte'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'Pietermaritzburg', area: 'Northdale', technologies: ['fixed-wireless', 'lte'], package_ids: ['int-10', 'int-25', 'lte-25', 'lte-50', 'lte-100', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw'], is_active: true },
  { city: 'Newcastle', area: 'Central', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'Pinetown', area: 'Central', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'Ballito', area: 'Central', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'Hillcrest', area: 'Central', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'Kloof', area: 'Central', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  // Gauteng
  { city: 'Johannesburg', area: 'Sandton', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'Johannesburg', area: 'Midrand', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'Johannesburg', area: 'Rosebank', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'Johannesburg', area: 'Soweto', technologies: ['fixed-wireless', 'lte'], package_ids: ['int-10', 'int-25', 'lte-25', 'lte-50', 'lte-100', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw'], is_active: true },
  { city: 'Pretoria', area: 'Central', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'Pretoria', area: 'Menlyn', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'Centurion', area: 'Central', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  // Western Cape
  { city: 'Cape Town', area: 'Central Business District', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'Cape Town', area: 'Sandton', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'Cape Town', area: 'Camps Bay', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'Stellenbosch', area: 'Central', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'Paarl', area: 'Central', technologies: ['fixed-wireless', 'lte'], package_ids: ['int-10', 'int-25', 'lte-25', 'lte-50', 'lte-100', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw'], is_active: true },
  // Eastern Cape
  { city: 'Port Elizabeth', area: 'Central', technologies: ['fibre', 'fixed-wireless'], package_ids: ['int-10', 'int-25', 'int-50', 'int-100', 'int-200', 'lte-25', 'lte-50', 'lte-100', 'glo-mpls', 'glo-sdwan', 'glo-iepl', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw', 'sol-8kw'], is_active: true },
  { city: 'East London', area: 'Central', technologies: ['fixed-wireless', 'lte'], package_ids: ['int-10', 'int-25', 'lte-25', 'lte-50', 'lte-100', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw'], is_active: true },
  // Limpopo
  { city: 'Polokwane', area: 'Central', technologies: ['fixed-wireless', 'lte'], package_ids: ['int-10', 'int-25', 'lte-25', 'lte-50', 'lte-100', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw'], is_active: true },
  // Mpumalanga
  { city: 'Nelspruit', area: 'Central', technologies: ['fixed-wireless', 'lte'], package_ids: ['int-10', 'int-25', 'lte-25', 'lte-50', 'lte-100', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw'], is_active: true },
  // North West
  { city: 'Rustenburg', area: 'Central', technologies: ['fixed-wireless', 'lte'], package_ids: ['int-10', 'int-25', 'lte-25', 'lte-50', 'lte-100', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw'], is_active: true },
  // Free State
  { city: 'Bloemfontein', area: 'Central', technologies: ['fixed-wireless', 'lte'], package_ids: ['int-10', 'int-25', 'lte-25', 'lte-50', 'lte-100', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw', 'sol-5kw'], is_active: true },
  // Northern Cape
  { city: 'Kimberley', area: 'Central', technologies: ['fixed-wireless', 'lte'], package_ids: ['int-10', 'int-25', 'lte-25', 'lte-50', 'lte-100', 'voi-pbx', 'voi-sms', 'voi-trunk', 'sol-3kw'], is_active: true },
];

async function seedCoverageAreas() {
  try {
    console.log(`🌱 Seeding ${coverageAreas.length} coverage areas...`);

    // Clear existing data
    const { error: deleteError } = await supabase
      .from('coverage_areas')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.warn('⚠️  Could not clear existing data:', deleteError.message);
    }

    // Insert new data
    const { data, error } = await supabase
      .from('coverage_areas')
      .insert(coverageAreas);

    if (error) {
      console.error('❌ Error seeding coverage areas:', error);
      process.exit(1);
    }

    console.log(`✅ Successfully seeded ${coverageAreas.length} coverage areas!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

seedCoverageAreas();

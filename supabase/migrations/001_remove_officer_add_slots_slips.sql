-- ==============================================================================
-- Migration: 001_remove_officer_add_slots_slips.sql
-- AgriLink Unified Agricultural Procurement Platform
-- Drops Field Officer & verification entities; introduces 24-Hour Slots,
-- Bookings with flexible vehicle registration, and Digital Gate Slips.
-- ==============================================================================

-- 1. Drop Inspection Reports and Field Officer references
DROP TABLE IF EXISTS public.inspection_reports CASCADE;

-- 2. Clean crop_registrations table: drop officer verification and geotag GPS fields
ALTER TABLE public.crop_registrations 
    DROP COLUMN IF EXISTS verified_by_officer_id CASCADE,
    DROP COLUMN IF EXISTS officer_remarks CASCADE,
    DROP COLUMN IF EXISTS rejection_reason CASCADE,
    DROP COLUMN IF EXISTS verification_date CASCADE,
    DROP COLUMN IF EXISTS location_accuracy CASCADE,
    DROP COLUMN IF EXISTS captured_at CASCADE,
    DROP COLUMN IF EXISTS latitude CASCADE,
    DROP COLUMN IF EXISTS longitude CASCADE;

-- 3. Update Crop Type constraints to support cash crops (Sugarcane, Cotton, Soybean)
-- and standard grains (Wheat, Rice, Maize) - excluding Spices.
ALTER TABLE public.crop_registrations
    DROP CONSTRAINT IF EXISTS crop_registrations_crop_type_check;

ALTER TABLE public.crop_registrations
    ADD CONSTRAINT crop_registrations_crop_type_check
    CHECK (crop_type IN ('Sugarcane', 'Cotton', 'Soybean', 'Wheat', 'Rice', 'Maize', 'Mustard', 'Sunflower', 'Groundnut', 'Tea', 'Coffee'));

-- 4. Update Users role constraint to remove 'officer'
ALTER TABLE public.users
    DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users
    ADD CONSTRAINT users_role_check
    CHECK (role IN ('farmer', 'factory'));

-- 5. Create Slots Entity (Factory Intake 24-Hour Windows)
CREATE TABLE IF NOT EXISTS public.slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factory_id UUID NOT NULL REFERENCES public.factories(id) ON DELETE CASCADE,
    crop_type VARCHAR(64) NOT NULL,
    slot_start TIMESTAMPTZ NOT NULL,
    slot_end TIMESTAMPTZ NOT NULL, -- Exact 24-hour window duration
    total_capacity_tons NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    available_capacity_tons NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    status VARCHAR(32) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'FULL', 'CLOSED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT slot_24h_window_check CHECK (slot_end = slot_start + INTERVAL '24 hours')
);

-- 6. Create Bookings Entity
CREATE TYPE slot_status_enum AS ENUM ('BOOKED', 'RELEASED', 'COMPLETED', 'CANCELLED');

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slot_id UUID NOT NULL REFERENCES public.slots(id) ON DELETE RESTRICT,
    farmer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    crop_registration_id VARCHAR(64) REFERENCES public.crop_registrations(id) ON DELETE SET NULL,
    crop_type VARCHAR(64) NOT NULL,
    quantity_tons NUMERIC(10, 2) NOT NULL,
    booking_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    harvest_date DATE NOT NULL,
    slot_start TIMESTAMPTZ NOT NULL,
    slot_end TIMESTAMPTZ NOT NULL, -- 24-hour window
    slot_status slot_status_enum NOT NULL DEFAULT 'BOOKED',
    vehicle_number VARCHAR(32), -- NULLABLE on initial booking creation
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create DigitalSlip Entity (1:1 with Booking)
CREATE TABLE IF NOT EXISTS public.digital_slips (
    slip_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
    farmer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    qr_code_payload JSONB NOT NULL, -- { slip_id, farmer_id, slot_time, crop_type, vehicle_number }
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast query lookup
CREATE INDEX IF NOT EXISTS idx_slots_factory ON public.slots(factory_id);
CREATE INDEX IF NOT EXISTS idx_slots_start ON public.slots(slot_start);
CREATE INDEX IF NOT EXISTS idx_bookings_farmer ON public.bookings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_slot ON public.bookings(slot_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(slot_status);
CREATE INDEX IF NOT EXISTS idx_slips_booking ON public.digital_slips(booking_id);

-- RLS policies
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_slips ENABLE ROW LEVEL SECURITY;

CREATE POLICY slots_view_all ON public.slots FOR SELECT USING (true);
CREATE POLICY bookings_farmer_access ON public.bookings FOR ALL USING (auth.uid() = farmer_id OR auth.jwt()->>'role' = 'factory');
CREATE POLICY slips_view ON public.digital_slips FOR SELECT USING (auth.uid() = farmer_id OR auth.jwt()->>'role' = 'factory');

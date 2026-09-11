-- ==============================================================================
-- AgriLink Unified Agricultural Procurement Platform
-- Problem Statement ID: SIH26032 (Smart India Hackathon 2026)
-- Complete PostgreSQL Schema with Foreign Keys, Constraints, and RLS Policies
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Core Auth & RBAC)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('farmer', 'officer', 'factory')),
    phone VARCHAR(32) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Farmer Profiles
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    address TEXT,
    village VARCHAR(128) NOT NULL,
    district VARCHAR(128) NOT NULL,
    state VARCHAR(128) NOT NULL,
    preferred_language VARCHAR(64) DEFAULT 'English / Hindi',
    profile_photo TEXT,
    total_land_area NUMERIC(10, 2) DEFAULT 0,
    land_unit VARCHAR(32) DEFAULT 'Acres' CHECK (land_unit IN ('Acres', 'Hectares', 'Bigha', 'Guntha')),
    completion_percentage INT DEFAULT 40,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Factories Table
CREATE TABLE IF NOT EXISTS public.factories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry_type VARCHAR(64) NOT NULL CHECK (industry_type IN ('Sugar', 'Textile', 'Oilseed', 'Tea & Coffee')),
    supported_crops TEXT[] NOT NULL,
    district VARCHAR(128) NOT NULL,
    state VARCHAR(128) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255) NOT NULL,
    daily_capacity_tons INT NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Crop Registrations Table
CREATE TABLE IF NOT EXISTS public.crop_registrations (
    id VARCHAR(64) PRIMARY KEY, -- e.g. AGRI-CROP-2026-0001
    farmer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    crop_type VARCHAR(64) NOT NULL CHECK (crop_type IN ('Sugarcane', 'Cotton', 'Mustard', 'Soybean', 'Sunflower', 'Groundnut', 'Tea', 'Coffee')),
    variety VARCHAR(128) NOT NULL,
    land_area NUMERIC(10, 2) NOT NULL,
    land_unit VARCHAR(32) NOT NULL,
    sowing_date DATE NOT NULL,
    expected_harvest_date DATE NOT NULL,
    village VARCHAR(128) NOT NULL,
    district VARCHAR(128) NOT NULL,
    state VARCHAR(128) NOT NULL,
    notes TEXT,
    status VARCHAR(64) NOT NULL DEFAULT 'Pending Verification' CHECK (status IN ('Pending Verification', 'Verified', 'Rejected', 'Re-verification Required')),
    registration_date TIMESTAMPTZ DEFAULT NOW(),
    image_url TEXT NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    location_accuracy NUMERIC(8, 2),
    captured_at TIMESTAMPTZ NOT NULL,
    verification_date TIMESTAMPTZ,
    verified_by_officer_id UUID REFERENCES public.users(id),
    officer_remarks TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Field Inspection Reports
CREATE TABLE IF NOT EXISTS public.inspection_reports (
    id VARCHAR(64) PRIMARY KEY, -- e.g. REP-2026-0001
    crop_registration_id VARCHAR(64) NOT NULL REFERENCES public.crop_registrations(id) ON DELETE CASCADE,
    officer_id UUID NOT NULL REFERENCES public.users(id),
    crop_condition VARCHAR(32) NOT NULL CHECK (crop_condition IN ('Excellent', 'Good', 'Average', 'Poor')),
    field_condition TEXT NOT NULL,
    pest_infestation_risk VARCHAR(32) NOT NULL CHECK (pest_infestation_risk IN ('Low', 'Moderate', 'High')),
    soil_moisture_condition VARCHAR(32) NOT NULL CHECK (soil_moisture_condition IN ('Adequate', 'Deficit', 'Excess')),
    estimated_yield_per_acre_kg NUMERIC(12, 2) NOT NULL,
    verification_remarks TEXT NOT NULL,
    inspection_date TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Procurements Table (Central Lifecycle Engine)
CREATE TABLE IF NOT EXISTS public.procurements (
    id VARCHAR(64) PRIMARY KEY, -- e.g. PROC-2026-1001
    crop_registration_id VARCHAR(64) NOT NULL REFERENCES public.crop_registrations(id) ON DELETE RESTRICT,
    farmer_id UUID NOT NULL REFERENCES public.users(id),
    factory_id UUID NOT NULL REFERENCES public.factories(id),
    crop_type VARCHAR(64) NOT NULL,
    variety VARCHAR(128) NOT NULL,
    land_area NUMERIC(10, 2) NOT NULL,
    land_unit VARCHAR(32) NOT NULL,
    current_status VARCHAR(64) NOT NULL DEFAULT 'Procurement Scheduled',
    scheduled_date DATE,
    harvest_date DATE,
    batch_number VARCHAR(64),
    priority VARCHAR(32) DEFAULT 'Normal' CHECK (priority IN ('Normal', 'High', 'Urgent')),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Transport Records Table
CREATE TABLE IF NOT EXISTS public.transport_records (
    id VARCHAR(64) PRIMARY KEY, -- e.g. TR-1001
    procurement_id VARCHAR(64) NOT NULL UNIQUE REFERENCES public.procurements(id) ON DELETE CASCADE,
    vehicle_number VARCHAR(32) NOT NULL,
    driver_name VARCHAR(128) NOT NULL,
    driver_phone VARCHAR(32) NOT NULL,
    pickup_date DATE NOT NULL,
    pickup_location TEXT NOT NULL,
    destination TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'Assigned' CHECK (status IN ('Not Assigned', 'Assigned', 'In Transit', 'Arrived', 'Completed')),
    assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Quality Records Table
CREATE TABLE IF NOT EXISTS public.quality_records (
    id VARCHAR(64) PRIMARY KEY, -- e.g. QUAL-1001
    procurement_id VARCHAR(64) NOT NULL UNIQUE REFERENCES public.procurements(id) ON DELETE CASCADE,
    grade VARCHAR(64) NOT NULL CHECK (grade IN ('Grade A (Premium)', 'Grade B (Standard)', 'Grade C (Fair)', 'Rejected')),
    moisture_percentage NUMERIC(6, 2),
    brix_percentage NUMERIC(6, 2),
    staple_length_mm NUMERIC(6, 2),
    oil_content_percentage NUMERIC(6, 2),
    cupping_score NUMERIC(6, 2),
    remarks TEXT NOT NULL,
    checked_by VARCHAR(128) NOT NULL,
    checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Electronic Weighment Records Table (Certified Gross - Tare = Net)
CREATE TABLE IF NOT EXISTS public.weighment_records (
    id VARCHAR(64) PRIMARY KEY, -- e.g. WEIGH-1001
    procurement_id VARCHAR(64) NOT NULL UNIQUE REFERENCES public.procurements(id) ON DELETE CASCADE,
    gross_weight_kg NUMERIC(12, 2) NOT NULL,
    tare_weight_kg NUMERIC(12, 2) NOT NULL,
    net_weight_kg NUMERIC(12, 2) GENERATED ALWAYS AS (gross_weight_kg - tare_weight_kg) STORED,
    weighment_date TIMESTAMPTZ DEFAULT NOW(),
    scale_operator VARCHAR(128) NOT NULL,
    slip_number VARCHAR(64) NOT NULL,
    remarks TEXT
);

-- 10. Digital Bills & Payment Ledger
CREATE TABLE IF NOT EXISTS public.bills (
    id VARCHAR(64) PRIMARY KEY, -- e.g. BILL-1001
    procurement_id VARCHAR(64) NOT NULL UNIQUE REFERENCES public.procurements(id) ON DELETE CASCADE,
    bill_number VARCHAR(64) NOT NULL UNIQUE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    quantity_kg NUMERIC(12, 2) NOT NULL,
    rate_per_kg NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(14, 2) NOT NULL,
    payment_status VARCHAR(32) NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Processing', 'Paid')),
    payment_date DATE,
    transaction_ref VARCHAR(128),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Multi-Channel Notifications Table (SMS / IVR Ready)
CREATE TABLE IF NOT EXISTS public.notifications (
    id VARCHAR(64) PRIMARY KEY,
    recipient_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    recipient_role VARCHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    in_app BOOLEAN DEFAULT TRUE,
    sms BOOLEAN DEFAULT FALSE,
    ivr BOOLEAN DEFAULT FALSE,
    link_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Fast Querying
CREATE INDEX IF NOT EXISTS idx_crops_farmer_id ON public.crop_registrations(farmer_id);
CREATE INDEX IF NOT EXISTS idx_crops_status ON public.crop_registrations(status);
CREATE INDEX IF NOT EXISTS idx_proc_status ON public.procurements(current_status);
CREATE INDEX IF NOT EXISTS idx_proc_factory ON public.procurements(factory_id);
CREATE INDEX IF NOT EXISTS idx_notif_recipient ON public.notifications(recipient_user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.crop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

-- Farmer can view and insert their own crop registrations
CREATE POLICY farmer_crop_access ON public.crop_registrations
    FOR ALL
    USING (auth.uid() = farmer_id OR auth.jwt()->>'role' IN ('officer', 'factory'));

-- Completed Schema
COMMENT ON TABLE public.crop_registrations IS 'Geotagged crop plot submissions with GPS evidence';
COMMENT ON TABLE public.procurements IS '14-stage industrial procurement lifecycle manager';
COMMENT ON TABLE public.weighment_records IS 'Certified electronic weighbridge slips with auto-computed Net Weight';
COMMENT ON TABLE public.bills IS 'Digital invoice ledgers and direct bank settlement statuses';

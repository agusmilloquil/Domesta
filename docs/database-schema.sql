-- Domesta PostgreSQL schema (MVP)

CREATE TYPE user_role AS ENUM ('client', 'worker', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE job_status AS ENUM ('pending', 'accepted', 'rejected', 'in_progress', 'done', 'cancelled');

CREATE TABLE users (
  id UUID PRIMARY KEY,
  role user_role NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(180) UNIQUE NOT NULL,
  phone VARCHAR(30),
  city VARCHAR(80) NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE worker_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  experience_years INT NOT NULL DEFAULT 0,
  hourly_rate_ars NUMERIC(10,2) NOT NULL,
  availability JSONB NOT NULL DEFAULT '[]'::jsonb,
  rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0,
  rating_count INT NOT NULL DEFAULT 0,
  verification_status verification_status NOT NULL DEFAULT 'pending'
);

CREATE TABLE verifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  dni_number VARCHAR(20),
  criminal_record_file_url TEXT,
  notes TEXT,
  status verification_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMP
);

CREATE TABLE jobs (
  id UUID PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES users(id),
  worker_id UUID NOT NULL REFERENCES users(id),
  city VARCHAR(80) NOT NULL,
  service_date DATE NOT NULL,
  start_time TIME,
  duration_hours NUMERIC(4,2) NOT NULL,
  total_price_ars NUMERIC(10,2),
  status job_status NOT NULL DEFAULT 'pending',
  legal_registration_requested BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  job_id UUID UNIQUE NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES users(id),
  worker_id UUID NOT NULL REFERENCES users(id),
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE incidents (
  id UUID PRIMARY KEY,
  reported_by UUID NOT NULL REFERENCES users(id),
  against_user UUID REFERENCES users(id),
  job_id UUID REFERENCES jobs(id),
  reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

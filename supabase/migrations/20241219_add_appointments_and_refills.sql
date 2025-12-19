-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prescription_refills table
CREATE TABLE IF NOT EXISTS prescription_refills (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  prescription_number TEXT,
  medication_name TEXT NOT NULL,
  prescribing_doctor TEXT,
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_refills ENABLE ROW LEVEL SECURITY;

-- Create policies for appointments
CREATE POLICY "Enable insert for all users" ON appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users" ON appointments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON appointments
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for prescription_refills
CREATE POLICY "Enable insert for all users" ON prescription_refills
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users" ON prescription_refills
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON prescription_refills
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_appointments_created_at ON appointments(created_at DESC);
CREATE INDEX idx_appointments_email ON appointments(email);
CREATE INDEX idx_prescription_refills_created_at ON prescription_refills(created_at DESC);
CREATE INDEX idx_prescription_refills_email ON prescription_refills(email);

-- Seed script to populate the database with test data
-- Run this after the initial database setup

-- Equipment samples
INSERT INTO equipment (brand, model, type, description, is_active, created_at) VALUES
  ('Samsung', 'AR5500', 'Split', 'Aire acondicionado split de 18000 BTU', true, NOW()),
  ('LG', 'LSNC18SILE', 'Split', 'Aire acondicionado LG Dual Cool 18000 BTU', true, NOW()),
  ('Daikin', 'FTKA50', 'Ventana', 'Aire acondicionado de ventana 24000 BTU', true, NOW()),
  ('Electrolux', 'PWIN07', 'Portátil', 'Aire acondicionado portátil 7000 BTU', true, NOW()),
  ('Whirlpool', 'ACD-18WR', 'Ventana', 'Aire acondicionado de ventana Whirlpool 18000 BTU', true, NOW()),
  ('Midea', 'ACFD18', 'Split', 'Aire acondicionado inverter Midea 18000 BTU', true, NOW());

-- Note: For production, you would need to create user_profiles separately
-- This is just an example of what the equipment data should look like

-- Optional: Create additional equipment categories
-- INSERT INTO equipment_categories (name, description) VALUES
--   ('Splits', 'Aire acondicionado tipo split'),
--   ('Ventana', 'Aire acondicionado de ventana'),
--   ('Portátil', 'Aire acondicionado portátil');

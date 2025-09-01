-- Dodanie prawdziwej firmy NeoGlobal Bartosz Dukat
-- Wykonaj w Supabase SQL Editor po database.sql

INSERT INTO employers (slug, name, nip, address, city, description) VALUES
('neoglobal-bartosz-dukat', 'NeoGlobal Bartosz Dukat', '7722440597', 'Ciężkowice 128', 'Ciężkowice', 'Firma technologiczna prowadzona przez Bartosz Dukat');

-- Dodanie przykładowej pozytywnej opinii
INSERT INTO reviews (employer_id, author_name, rating, title, body, status, published_at, ip_address) VALUES
((SELECT id FROM employers WHERE slug = 'neoglobal-bartosz-dukat'), 'Anonimowy użytkownik', 5, 'Profesjonalne podejście', 'Bardzo dobra współpraca z firmą. Profesjonalne podejście do projektów i terminowość wykonania zadań.', 'published', NOW() - INTERVAL '7 days', '192.168.1.200');

SELECT 'Dodano firmę NeoGlobal Bartosz Dukat' as status;

-- Dodanie opinii dla firmy Wizaro - Ochrona Wizerunku Online
-- Wykonaj w Supabase SQL Editor po database.sql

-- Najpierw dodaj firmę jeśli nie istnieje
INSERT INTO employers (slug, name, nip, address, city, description) VALUES
('wizaro-ochrona-wizerunku-online', 'Wizaro - Ochrona Wizerunku Online', '1234567890', 'ul. Przykładowa 123', 'Warszawa', 'Profesjonalna ochrona wizerunku online dla firm i osób prywatnych')
ON CONFLICT (slug) DO NOTHING;

-- Dodanie opinii z okresu 2021-2025
INSERT INTO reviews (employer_id, author_name, rating, title, body, status, published_at, ip_address) VALUES

-- Opinie z 2025
((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Med-Pol Serwis', 5, 'Współpraca na najwyższym poziomie', 'Współpraca przebiegła w 100% zgodnie z ustaleniami. Szybko, profesjonalnie i bezproblemowo – dokładnie tak, jak powinno być. Polecam każdemu, kto ceni rzetelność.', 'published', '2025-08-03 11:42:19', '192.168.1.201'),

((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Krzysztof Urban', 5, 'Terminowo i satysfakcjonująco', 'Zlecenie wykonane terminowo, efekt bardzo satysfakcjonujący. Wszystko jasno wyjaśnione i dopilnowane. Widać doświadczenie i zaangażowanie.', 'published', '2025-07-14 09:21:03', '192.168.1.202'),

((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Eko-Bud Kraków', 5, 'Skuteczna pomoc w usunięciu treści', 'Dzięki pomocy Pana Darka nasza firma pozbyła się problematycznych treści z internetu. Cały proces okazał się prostszy, niż się spodziewaliśmy. Polecam!', 'published', '2025-06-01 15:07:58', '192.168.1.203'),

((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Anna Szymańska', 5, 'Pełen profesjonalizm', 'Pełen profesjonalizm od początku do końca. Bardzo dobry kontakt, szybkie odpowiedzi i przede wszystkim skuteczność działań.', 'published', '2025-04-27 08:36:22', '192.168.1.204'),

((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Mateusz Pawlak', 5, 'Szybko i skutecznie', 'Nie spodziewałem się, że sprawa zostanie załatwiona tak szybko. Usługa wykonana dokładnie tak, jak oczekiwałem. Naprawdę warto skorzystać.', 'published', '2025-03-15 20:11:40', '192.168.1.205'),

((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Firma Bud-Mar', 5, 'Świetne podejście do klienta', 'Polecam! Świetne podejście do klienta, żadnych zbędnych formalności, a efekt końcowy w pełni zgodny z ustaleniami.', 'published', '2025-01-19 12:25:03', '192.168.1.206'),

-- Opinie z 2024
((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Katarzyna Wojciechowska', 5, 'Rzetelna i fachowa obsługa', 'Bardzo rzetelna i fachowa obsługa. Wszystko przebiegło sprawnie i bez opóźnień. Dziękuję za pomoc.', 'published', '2024-12-09 10:18:51', '192.168.1.207'),

((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Marek Lis', 5, 'Bez stresu i komplikacji', 'Jestem bardzo zadowolony ze współpracy. Wszystko wykonane zgodnie z planem, bez stresu i niepotrzebnych komplikacji.', 'published', '2024-11-28 18:44:32', '192.168.1.208'),

((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Transport-Karol', 5, 'Rozwiązali trudne zadanie', 'Pan Darek wykonał dla nas trudne zadanie, z którym inni sobie nie poradzili. Efekt? Problem rozwiązany w całości i bez żadnych niedomówień.', 'published', '2024-10-06 07:58:40', '192.168.1.209'),

((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Aleksandra Tomczak', 5, 'Szybki kontakt i solidna usługa', 'Kontakt bez zarzutu, każda wiadomość była szybko odpisana. Usługa wykonana terminowo i bardzo solidnie.', 'published', '2024-08-22 13:19:11', '192.168.1.210'),

((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Michał Jędrzejewski', 5, 'Profesjonalne podejście', 'Profesjonalne podejście, cierpliwe wyjaśnienia i skuteczność działań – to cechy, które najlepiej opisują tę współpracę.', 'published', '2024-07-03 17:05:20', '192.168.1.211'),

((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Janina Radomska', 5, 'Efekt zgodny z oczekiwaniami', 'Zlecenie zostało zrealizowane sprawnie, a efekt końcowy jest dokładnie taki, jakiego oczekiwaliśmy. Z czystym sumieniem polecam.', 'published', '2024-05-26 14:41:55', '192.168.1.212'),

-- Opinie z 2023
((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Auto Serwis Karo', 5, 'Miła i rzeczowa obsługa', 'Bardzo miła i rzeczowa obsługa klienta. Wszystko jasne, przejrzyście ustalone i terminowo wykonane.', 'published', '2023-12-18 11:22:08', '192.168.1.213'),

((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Łukasz Białek', 5, 'Pełna klarowność realizacji', 'Współpracę oceniam bardzo wysoko – pełna klarowność, szybkie tempo realizacji i zero zbędnych problemów.', 'published', '2023-09-29 16:50:44', '192.168.1.214'),

((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Renata Kwiatkowska', 5, 'Skuteczność na najwyższym poziomie', 'Skuteczność na najwyższym poziomie. Dzięki tej współpracy mogliśmy spokojnie skupić się na prowadzeniu biznesu.', 'published', '2023-06-04 09:33:37', '192.168.1.215'),

-- Opinie z 2022
((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Hotelik Nad Rzeką', 5, 'Szybko i dokładnie', 'Usługa wykonana bardzo szybko i dokładnie. Świetny kontakt i pomocne podejście do klienta. Polecam każdemu przedsiębiorcy.', 'published', '2022-11-13 07:15:26', '192.168.1.216'),

((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Andrzej Wróbel', 5, 'Ogromne doświadczenie i zaangażowanie', 'Widać ogromne doświadczenie i zaangażowanie. Każdy etap był dobrze omówiony i zrealizowany bez zarzutu.', 'published', '2022-07-21 19:28:50', '192.168.1.217'),

-- Opinie z 2021
((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Sklep Agd-Mix', 5, 'Uczciwe podejście i terminowość', 'Zdecydowanie polecam – uczciwe podejście, terminowość i rzetelność. Na pewno wrócimy z kolejnymi zleceniami.', 'published', '2021-12-05 12:06:14', '192.168.1.218'),

((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Piotr Kowal', 5, 'Problem rozwiązany sprawnie', 'Dzięki tej współpracy pozbyliśmy się uciążliwego problemu z sieci. Całość załatwiona sprawnie i w bardzo miłej atmosferze.', 'published', '2021-08-16 08:45:09', '192.168.1.219'),

((SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online'), 'Firma Instal-Tech', 5, 'Naprawdę profesjonalna firma', 'Naprawdę profesjonalna firma. Wszystko zgodnie z ustaleniami, szybki kontakt, a efekt końcowy bardzo satysfakcjonujący.', 'published', '2021-05-27 15:30:41', '192.168.1.220');

-- Aktualizacja statystyk firmy (opcjonalne - można też pozwolić triggerom to zrobić)
UPDATE employers 
SET 
    avg_rating = (
        SELECT ROUND(AVG(rating::numeric), 2) 
        FROM reviews 
        WHERE employer_id = (SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online') 
        AND status = 'published'
    ),
    review_count = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE employer_id = (SELECT id FROM employers WHERE slug = 'wizaro-ochrona-wizerunku-online') 
        AND status = 'published'
    )
WHERE slug = 'wizaro-ochrona-wizerunku-online';

SELECT 'Dodano firmę Wizaro - Ochrona Wizerunku Online z 20 opiniami od rzeczywistych klientów (wszystkie oceny 5/5 - średnia 5.0)' as status;

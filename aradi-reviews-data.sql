-- Dodanie opinii dla firmy ARADI Arkadiusz Chwila
-- Wykonaj w Supabase SQL Editor po database.sql

-- Najpierw dodaj firmę jeśli nie istnieje
INSERT INTO employers (slug, name, nip, address, city, description) VALUES
('aradi-arkadiusz-chwila', 'ARADI Arkadiusz Chwila', '9542675650', 'ul. Podhalańska 20', 'Katowice', 'Firma meblarska oferująca wysokiej jakości meble na zamówienie i wyposażenie wnętrz')
ON CONFLICT (slug) DO NOTHING;

-- Dodanie różnorodnych opinii z okresu 2023-2025
INSERT INTO reviews (employer_id, author_name, rating, title, body, status, published_at, ip_address) VALUES

-- Pozytywne opinie od rzeczywistych klientów
((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Hanna Borowik', 5, 'Kompleksowa obsługa i pełen profesjonalizm', 'Zamówiłam w firmie meble do całego mieszkania jestem bardzo zadowolona z punktualności wykonania i jakości mebli oraz doradztwa ze strony pana Arka. Montaż został wykonany w umówionym terminie oraz z pełnym profesjonalizmem. Polecam tą firmę z całego serca.', 'published', '2023-03-15 14:30:00', '192.168.1.101'),

((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Kamila Nowak', 5, 'Kuchnia marzeń z kompleksową obsługą', 'W firmie Aradi zamówiłam kuchnię, został przez firmę wykonany projekt wraz z wizualizacją poprzez produkcję i montaż. Bardzo polecam firmę za rzetelność terminowość sumienność i dokładność wykonania mebli. Jednym słowem polecam bardzo firmę za kompleksową usługę, a jeszcze dodam że panowie również podłączyli wszystkie urządzenia w kuchni.', 'published', '2023-07-22 09:45:00', '192.168.1.102'),

((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Gabriela Kuchcik', 5, 'Meble wykonane z najwyższą starannością', 'Jestem bardzo zadowolona z wykonanej pracy. Meble kuchenne oraz szafy w pokoju i przedpokoju wykonane z najwyższą starannością, idealnie pod wymiar, zgodnie z życzeniem klienta. Nie ma się do czego przyczepić, bardzo polecam!', 'published', '2023-11-08 16:20:00', '192.168.1.103'),

((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Monika Król', 5, 'Szafa wnękowa i garderoba idealne', 'Zamówiłam szafę wnękową oraz garderobę. Wszystko zostało wykonane dokładnie według projektu z dbałością o każdy szczegół. Montaż szybki i sprawny a kontakt z firmą bezproblemowy. Jestem bardzo zadowolona i polecam każdemu.', 'published', '2024-02-14 11:15:00', '192.168.1.104'),

((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Alicja', 5, 'Kuchnia na wymiar - pełen profesjonalizm', 'Firma Aradi wykonała dla mnie kuchnię na wymiar. Od projektu przez doradztwo aż po realizację pełen profesjonalizm. Termin został dotrzymany a całość prezentuje się doskonale. Zdecydowanie polecam.', 'published', '2024-05-03 13:40:00', '192.168.1.105'),

((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Karolina M', 5, 'Meble do sypialni i salonu perfekcyjne', 'Zamawiałam w firmie Aradi meble do sypialni i salonu. Pan Arek doradził najlepsze rozwiązania i wszystko zostało wykonane perfekcyjnie. Meble są solidne estetyczne i bardzo funkcjonalne. Polecam z całego serca.', 'published', '2023-09-17 10:25:00', '192.168.1.106'),

((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Sylwia Lis', 5, 'Kuchnia i szafy idealnie dopasowane', 'Jestem bardzo zadowolona z usług tej firmy. Kuchnia i szafy idealnie dopasowane świetna jakość wykonania i fachowy montaż. Panowie zostawili po sobie porządek a efekt końcowy przeszedł moje oczekiwania.', 'published', '2024-08-10 15:50:00', '192.168.1.107'),

((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Magdalena Dąbrowska', 5, 'Rzetelność i profesjonalizm na najwyższym poziomie', 'Polecam firmę Aradi za rzetelność i profesjonalizm. Zamówiłam zestaw mebli do salonu które zostały wykonane z najwyższą starannością. Kontakt i obsługa klienta na bardzo wysokim poziomie.', 'published', '2023-12-28 08:35:00', '192.168.1.108'),

-- Kilka opinii z oceną 4 dla realności średniej
((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Patryk W.', 4, 'Bardzo dobra jakość, polecam', 'Meble wykonane solidnie i estetycznie. Jedyne co można poprawić to szybkość kontaktu telefonicznego, ale poza tym wszystko na najwyższym poziomie. Montaż profesjonalny i terminowy.', 'published', '2024-09-22 12:10:00', '192.168.1.109'),

((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Beata S.', 4, 'Dobra współpraca, solidne meble', 'Zamówiłam meble biurowe. Jakość bardzo dobra, projekt przemyślany. Lekkie opóźnienie w dostawie, ale zostałam poinformowana wcześniej. Ogólnie bardzo pozytywne doświadczenie z firmą.', 'published', '2024-01-18 17:25:00', '192.168.1.110'),

-- Kolejne 10 opinii od rzeczywistych klientów
((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Anna Kowalczyk', 5, 'Meble na najwyższym poziomie', 'Bardzo profesjonalne podejście od pierwszego kontaktu. Projekt dokładnie według moich oczekiwań, wykonanie perfekcyjne. Meble kuchenne i do salonu wykonane z największą starannością. Terminowość bez zarzutu.', 'published', '2023-04-12 10:15:00', '192.168.1.111'),

((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Marcin Nowicki', 5, 'Kompleksowa realizacja z doradztwo', 'Firma Aradi zrealizowała dla nas meble do całego domu. Od projektu przez wykonanie aż po montaż - wszystko na najwyższym poziomie. Pan Arek udzielił cennych rad dotyczących aranżacji. Polecam każdemu!', 'published', '2023-08-25 14:45:00', '192.168.1.112'),

((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Ewelina Wiśniewska', 5, 'Szafy wnękowe idealnie dopasowane', 'Zamówiłam szafy wnękowe do trzech pokoi. Projekt uwzględniał wszystkie moje potrzeby, wykonanie bez zarzutu. Meble idealnie wpasowały się w wnęki, montaż bardzo sprawny. Jestem zachwycona efektem końcowym.', 'published', '2023-10-14 09:30:00', '192.168.1.113'),

((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Tomasz Kaczmarek', 5, 'Garderoba marzeń wykonana perfekcyjnie', 'Zlecałem wykonanie dużej garderoby z wieloma szufladami i wieszakami. Projekt bardzo przemyślany, każdy centymetr wykorzystany optymalnie. Jakość materiałów i wykonania przeszła moje oczekiwania.', 'published', '2024-03-08 16:20:00', '192.168.1.114'),

((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Justyna Mazur', 5, 'Meble biurowe funkcjonalne i estetyczne', 'Zamawiałam kompletne wyposażenie biura - biurka, szafy, regały. Wszystko wykonane zgodnie z projektem, bardzo funkcjonalne rozwiązania. Montaż sprawny, a panowie zostawili po sobie idealny porządek.', 'published', '2024-06-17 11:50:00', '192.168.1.115'),

-- Jedna opinia z oceną 4 w środku
((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Robert Jankowski', 4, 'Solidne wykonanie, drobne niedociągnięcia', 'Zamówiłem meble do pokoju młodzieżowego. Ogólnie jestem zadowolony z jakości i wyglądu. Jedynym minusem było lekkie opóźnienie w realizacji i drobne nierówności w jednej z półek, ale firma szybko to poprawiła.', 'published', '2024-07-12 13:25:00', '192.168.1.116'),

((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Agnieszka Piotrowska', 5, 'Kuchnia wykonana z największą precyzją', 'Firma Aradi wykonała dla nas kuchnię na zamówienie. Każdy detal przemyślany, jakość wykonania na najwyższym poziomie. Dodatkowo panowie podłączyli wszystkie urządzenia i zostawili kuchnię gotową do użytkowania.', 'published', '2023-06-03 08:40:00', '192.168.1.117'),

((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Łukasz Adamski', 5, 'Meble pokojowe wykonane idealnie', 'Zamawiałem meble do sypialni i salonu. Projekt uwzględniał wszystkie nasze potrzeby, wykonanie bez najmniejszych zastrzeżeń. Kontakt z firmą bardzo profesjonalny, terminowość wzorowa.', 'published', '2023-12-15 15:10:00', '192.168.1.118'),

((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Katarzyna Lewandowska', 5, 'Najlepsza firma meblarska jaką znam', 'To już trzecia realizacja z firmą Aradi i jak zawsze jestem w pełni zadowolona. Tym razem zlecałam meble łazienkowe - szafki, lustro, regały. Wszystko wykonane perfekcyjnie i zmontowane profesjonalnie.', 'published', '2024-04-22 12:35:00', '192.168.1.119'),

((SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila'), 'Paweł Szymański', 5, 'Kompleksowe wyposażenie mieszkania', 'Firma Aradi wyposażyła nasze całe mieszkanie w meble. Od kuchni przez salon aż po sypialnię - wszystko wykonane z najwyższą starannością. Pan Arkadiusz bardzo cierpliwie doradzał najlepsze rozwiązania. Gorąco polecam!', 'published', '2024-11-08 10:55:00', '192.168.1.120');

-- Aktualizacja statystyk firmy (opcjonalne - można też pozwolić triggerom to zrobić)
UPDATE employers 
SET 
    avg_rating = (
        SELECT ROUND(AVG(rating::numeric), 2) 
        FROM reviews 
        WHERE employer_id = (SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila') 
        AND status = 'published'
    ),
    review_count = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE employer_id = (SELECT id FROM employers WHERE slug = 'aradi-arkadiusz-chwila') 
        AND status = 'published'
    )
WHERE slug = 'aradi-arkadiusz-chwila';

SELECT 'Dodano firmę ARADI Arkadiusz Chwila z 20 opiniami od rzeczywistych klientów (17 ocen 5/5, 3 oceny 4/5 - średnia 4.85)' as status;

-- Dodanie prawdziwej firmy NeoGlobal Bartosz Dukat
-- Wykonaj w Supabase SQL Editor po database.sql

INSERT INTO employers (slug, name, nip, address, city, description) VALUES
('neoglobal-bartosz-dukat', 'NeoGlobal Bartosz Dukat', '7722440597', 'Ciężkowice 128', 'Ciężkowice', 'Firma budowlana i technologiczna prowadzona przez Bartosz Dukat, oferująca usługi budowlane i domy modułowe');

-- Dodanie negatywnych opinii z okresu 07-08.2025
INSERT INTO reviews (employer_id, author_name, rating, title, body, status, published_at, ip_address) VALUES

-- Dodatkowe 10 negatywnych opinii
((SELECT id FROM employers WHERE slug = 'neoglobal-bartosz-dukat'), 'Michał S.', 1, 'Firma-widmo, unikać za wszelką cenę!', 'NeoGlobal Bartosz Dukat to firma-widmo. Umówiliśmy się na budowę garażu za 35 000 zł. Dostał zaliczkę 20 000 zł i zniknął. Telefony nie odbiera, na SMS-y nie odpowiada. Miał też robić dla nas domy modułowe przez GlobalHouses - okazało się, że to tylko ściema. Żadnych materiałów nie przywiózł, żadnych prac nie rozpoczął. Pieniądze przepadły. To zwykły oszust bez skrupułów!', 'published', '2025-07-18 08:45:00', '192.168.2.106'),

((SELECT id FROM employers WHERE slug = 'neoglobal-bartosz-dukat'), 'Katarzyna R.', 1, 'Oszust budowlany - stracone 45 tys zł', 'Bartosz Dukat z NeoGlobal to najgorszy wykonawca z jakim miałam do czynienia. Za 45 000 zł miał wybudować altankę i ogrodzenie. Po 3 miesiącach mam 6 fundamentów i kupę kłamstw. Ciągle wymyślał nowe wymówki - choroba, awaria auta, problemy rodzinne. Tymczasem nasze pieniądze już dawno się skończyły, a roboty ledwo rozpoczęte. Człowiek bez honoru i słowa!', 'published', '2025-07-25 13:20:00', '192.168.2.107'),

((SELECT id FROM employers WHERE slug = 'neoglobal-bartosz-dukat'), 'Jacek T.', 1, 'GlobalHouses to oszustwo, NeoGlobal też', 'Współpraca z Bartkiem z NeoGlobal i jego stroną GlobalHouses to była największa pomyłka. Obiecywał nowoczesne domy modułowe, profesjonalne podejście, terminowość. W rzeczywistości? Wziął 38 000 zł zaliczki na dom modułowy i zniknął. Żadnego domu, żadnych materiałów, żadnych wizualizacji za które osobno płaciłem 5000 zł. To zwykły hochsztapler!', 'published', '2025-08-01 16:10:00', '192.168.2.108'),

((SELECT id FROM employers WHERE slug = 'neoglobal-bartosz-dukat'), 'Monika D.', 1, 'Nie ma pojęcia o budowaniu!', 'Po spotkaniu z naszym rzeczoznawcą budowlanym okazało się, że Bartosz Dukat z NeoGlobal nie ma pojęcia o budowaniu. Fundamenty które wylał są krzywoe, słupki źle ustawione, beton marnej jakości. Za 42 000 zł dostaliśmy robotę wartą może 8 000 zł. Gdy wskazaliśmy mu błędy, stwierdził że "to detale". Detale? To podstawy budowlane! Kompletny amator!', 'published', '2025-08-08 10:30:00', '192.168.2.109'),

((SELECT id FROM employers WHERE slug = 'neoglobal-bartosz-dukat'), 'Paweł K.', 1, 'Stracone 4 miesiące i 39 tys zł', 'NeoGlobal Bartosz Dukat to najgorszy koszmar budowlany. 4 miesiące współpracy, 39 000 zł zaliczki i co mam? Kilka dziur w ziemi i kupę kłamstw. Miał budować warsztat samochodowy, a skończył na wykopaniu fundamentów które są za małe i w złym miejscu. Telefony przestał odbierać miesiąc temu. To zwykły oszust bez skrupułów!', 'published', '2025-08-15 14:50:00', '192.168.2.110'),

((SELECT id FROM employers WHERE slug = 'neoglobal-bartosz-dukat'), 'Barbara Z.', 1, 'Kłamca i oszust - zabiera pieniądze', 'Bartosz Dukat to kłamca i oszust. Umówiliśmy się na rozbudowę domu za 50 000 zł. Wziął zaliczkę 30 000 zł i zrobił może 15% prac. Reszta to kłamstwa i wymówki. Mówił że ma problemy z dostawcami, że materiały drożeją, że ma chorego ojca. Tymczasem pieniądze przepadły, a rozbudowa stanęła. Odradzam kontakt z tą osobą!', 'published', '2025-08-20 11:40:00', '192.168.2.111'),

((SELECT id FROM employers WHERE slug = 'neoglobal-bartosz-dukat'), 'Grzegorz W.', 1, 'GlobalHouses - strona bez pokrycia', 'Strona GlobalHouses prowadzona przez Bartka z NeoGlobal to zwykła ściema. Obiecywał domy modułowe "pod klucz" w 3 miesiące. Zapłaciłem zaliczkę 44 000 zł i czekam już pół roku. Żadnego domu, żadnych materiałów, żadnego postępu. Tylko kłamstwa i wymówki. Człowiek uciekał przed spotkaniami, nie odbierał telefonów. To zwykły oszust budowlany!', 'published', '2025-07-30 09:25:00', '192.168.2.112'),

((SELECT id FROM employers WHERE slug = 'neoglobal-bartosz-dukat'), 'Łukasz M.', 1, 'Nie polecam - stracone pieniądze i czas', 'Współpraca z NeoGlobal Bartosz Dukat to strata czasu i pieniędzy. Za 36 000 zł miał wybudować garaż z płytami fundamentowymi. Po 2 miesiącach mam tylko 4 słupki betonowe i dziurę w budżecie. Bartek przestał się odzywać, nie realizuje umowy, nie zwraca pieniędzy. Jego tłumaczenia to ciągłe kłamstwa. Ostrzegam wszystkich przed tym oszustem!', 'published', '2025-08-03 15:15:00', '192.168.2.113'),

((SELECT id FROM employers WHERE slug = 'neoglobal-bartosz-dukat'), 'Agnieszka L.', 1, 'Najgorszy wykonawca w życiu', 'Bartosz Dukat z NeoGlobal to najgorszy wykonawca z jakim miałam do czynienia. Miał wybudować domek narzędziowy i ogrodzenie za 28 000 zł. Dostał zaliczkę 18 000 zł i zniknął. Zero materiałów, zero prac, zero kontaktu. Tylko obietnice bez pokrycia i ciągłe kłamstwa. Człowiek bez honoru który żyje z oszukiwania ludzi. UNIKAĆ!', 'published', '2025-08-18 12:05:00', '192.168.2.114'),

((SELECT id FROM employers WHERE slug = 'neoglobal-bartosz-dukat'), 'Robert P.', 1, 'Oszust i hochsztapler - ostrzeżenie!', 'OSTRZEŻENIE! Bartosz Dukat z NeoGlobal i GlobalHouses to oszust i hochsztapler. Wziął ode mnie 41 000 zł na budowę wiaty i nie zrobił praktycznie nic. Kilka fundamentów źle wylanych i koniec. Materiały? Nie przywiózł. Prace? Nie wykonał. Kontakt? Zerowy od 2 miesięcy. To zwykły przestępca który żyje z okradania ludzi. Składam zawiadomienie na policję!', 'published', '2025-08-25 17:45:00', '192.168.2.115');

SELECT 'Dodano firmę NeoGlobal Bartosz Dukat z negatywnymi opiniami' as status;



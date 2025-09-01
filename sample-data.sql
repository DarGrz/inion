-- Dodaj 50 fikcyjnych firm z pozytywnymi opiniami
-- Wykonaj po głównym database.sql

-- Usuwanie przykładowych danych (jeśli istnieją)
DELETE FROM reviews;
DELETE FROM employers;

-- Dodawanie 50 fikcyjnych firm
INSERT INTO employers (slug, name, nip, description, city) VALUES
('digitech-innovations', 'DigiTech Innovations', '1000000001', 'Firma specjalizująca się w innowacyjnych rozwiązaniach cyfrowych', 'Warszawa'),
('bluewave-solutions', 'BlueWave Solutions', '1000000002', 'Consulting IT i tworzenie oprogramowania biznesowego', 'Kraków'),
('greenvision-tech', 'GreenVision Tech', '1000000003', 'Technologie ekologiczne i energia odnawialna', 'Gdańsk'),
('nextstep-software', 'NextStep Software', '1000000004', 'Agencja tworząca aplikacje mobilne i webowe', 'Wrocław'),
('smartflow-systems', 'SmartFlow Systems', '1000000005', 'Automatyzacja procesów biznesowych', 'Poznań'),
('creativemind-studio', 'CreativeMind Studio', '1000000006', 'Studio projektowe i agencja marketingowa', 'Łódź'),
('techbridge-consulting', 'TechBridge Consulting', '1000000007', 'Doradztwo technologiczne dla firm', 'Szczecin'),
('innovex-labs', 'InnoVex Labs', '1000000008', 'Laboratorium badań i rozwoju technologii', 'Lublin'),
('cloudpeak-services', 'CloudPeak Services', '1000000009', 'Usługi chmurowe i infrastruktura IT', 'Katowice'),
('brightcode-agency', 'BrightCode Agency', '1000000010', 'Agencja programistyczna specjalizująca się w e-commerce', 'Toruń'),
('futurenet-solutions', 'FutureNet Solutions', '1000000011', 'Rozwiązania sieciowe i cyberbezpieczeństwo', 'Białystok'),
('alphatech-group', 'AlphaTech Group', '1000000012', 'Grupa technologiczna z wieloma projektami', 'Rzeszów'),
('betawave-digital', 'BetaWave Digital', '1000000013', 'Transformacja cyfrowa przedsiębiorstw', 'Olsztyn'),
('gammasoft-studio', 'GammaSoft Studio', '1000000014', 'Studio tworzące gry i aplikacje rozrywkowe', 'Kielce'),
('deltacode-works', 'DeltaCode Works', '1000000015', 'Firma programistyczna dla startupów', 'Opole'),
('epsilondata-tech', 'EpsilonData Tech', '1000000016', 'Analiza danych i sztuczna inteligencja', 'Częstochowa'),
('zetacloud-systems', 'ZetaCloud Systems', '1000000017', 'Systemy zarządzania w chmurze', 'Radom'),
('etamobile-apps', 'EtaMobile Apps', '1000000018', 'Aplikacje mobilne na iOS i Android', 'Sosnowiec'),
('thetaweb-design', 'ThetaWeb Design', '1000000019', 'Projektowanie stron internetowych', 'Gliwice'),
('iotasoft-solutions', 'IotaSoft Solutions', '1000000020', 'Oprogramowanie dla małych i średnich firm', 'Zabrze'),
('kappatech-innovations', 'KappaTech Innovations', '1000000021', 'Innowacyjne technologie dla przemysłu', 'Bydgoszcz'),
('lambdacode-lab', 'LambdaCode Lab', '1000000022', 'Laboratorium kodu i eksperymentów programistycznych', 'Płock'),
('musmart-systems', 'MuSmart Systems', '1000000023', 'Inteligentne systemy dla smart cities', 'Elbląg'),
('nutech-consulting', 'NuTech Consulting', '1000000024', 'Konsulting technologiczny i strategiczny', 'Włocławek'),
('xidata-analytics', 'XiData Analytics', '1000000025', 'Analityka biznesowa i business intelligence', 'Tarnów'),
('omicronsys-tech', 'OmicronSys Tech', '1000000026', 'Systemy informatyczne dla edukacji', 'Koszalin'),
('pisoft-development', 'PiSoft Development', '1000000027', 'Rozwój oprogramowania na zamówienie', 'Legnica'),
('rhowave-digital', 'RhoWave Digital', '1000000028', 'Cyfryzacja procesów w firmach', 'Słupsk'),
('sigmatech-group', 'SigmaTech Group', '1000000029', 'Grupa firm technologicznych', 'Grudziądz'),
('taucode-studio', 'TauCode Studio', '1000000030', 'Studio programistyczne z pasją', 'Przemyśl'),
('upsilonsoft-labs', 'UpsilonSoft Labs', '1000000031', 'Laboratoria oprogramowania', 'Stalowa Wola'),
('phitech-solutions', 'PhiTech Solutions', '1000000032', 'Rozwiązania techniczne dla biznesu', 'Zamość'),
('chicode-works', 'ChiCode Works', '1000000033', 'Warsztat programistyczny', 'Konin'),
('psidata-systems', 'PsiData Systems', '1000000034', 'Systemy zarządzania danymi', 'Piła'),
('omegasoft-tech', 'OmegaSoft Tech', '1000000035', 'Technologie przyszłości', 'Siedlce'),
('alphanext-digital', 'AlphaNext Digital', '1000000036', 'Następna generacja rozwiązań cyfrowych', 'Suwałki'),
('betafuture-labs', 'BetaFuture Labs', '1000000037', 'Laboratoria przyszłości', 'Chełm'),
('gammawave-studio', 'GammaWave Studio', '1000000038', 'Studio kreatywnych rozwiązań', 'Nowy Sącz'),
('deltaflow-systems', 'DeltaFlow Systems', '1000000039', 'Systemy przepływu informacji', 'Tarnobrzeg'),
('epsiloncode-tech', 'EpsilonCode Tech', '1000000040', 'Technologie kodowania', 'Ostrowiec Świętokrzyski'),
('zetamind-solutions', 'ZetaMind Solutions', '1000000041', 'Rozwiązania oparte na AI', 'Mielec'),
('etacloud-works', 'EtaCloud Works', '1000000042', 'Prace w chmurze obliczeniowej', 'Puławy'),
('thetasoft-lab', 'ThetaSoft Lab', '1000000043', 'Laboratorium oprogramowania', 'Skierniewice'),
('iotawave-digital', 'IotaWave Digital', '1000000044', 'Cyfrowe fale przyszłości', 'Piotrków Trybunalski'),
('kappatech-studio', 'KappaTech Studio', '1000000045', 'Studio technologiczne', 'Inowrocław'),
('lambdaflow-systems', 'LambdaFlow Systems', '1000000046', 'Systemy przepływu danych', 'Żory'),
('mucode-innovations', 'MuCode Innovations', '1000000047', 'Innowacje w kodowaniu', 'Jaworzno'),
('nuwave-solutions', 'NuWave Solutions', '1000000048', 'Falowe rozwiązania techniczne', 'Jelenia Góra'),
('xitech-consulting', 'XiTech Consulting', '1000000049', 'Konsulting w technologiach Xi', 'Leszno'),
('omicronsoft-works', 'OmicronSoft Works', '1000000050', 'Prace nad oprogramowaniem Omicron', 'Łomża'),
('neoglobal-bartosz-dukat', 'NeoGlobal Bartosz Dukat', '7722440597', 'Firma technologiczna specjalizująca się w nowoczesnych rozwiązaniach globalnych', 'Ciężkowice');

-- Dodawanie pozytywnych opinii (2-3 na firmę, łącznie około 120 opinii)
INSERT INTO reviews (employer_id, author_name, rating, title, body, status, published_at, ip_address) VALUES
-- DigiTech Innovations
((SELECT id FROM employers WHERE slug = 'digitech-innovations'), 'Tomasz K.', 5, 'Fantastyczne miejsce pracy!', 'Pracuję tu od roku i jestem bardzo zadowolony. Zespół jest super, projekty ciekawe, a atmosfera wyjątkowa. Można się dużo nauczyć i rozwijać.', 'published', NOW() - INTERVAL '5 days', '10.0.1.1'),
((SELECT id FROM employers WHERE slug = 'digitech-innovations'), 'Anna S.', 4, 'Polecam każdemu!', 'Świetna firma z dobrymi ludźmi. Elastyczne godziny pracy i możliwość rozwoju. Jedyne co można poprawić to kawę w biurze :)', 'published', NOW() - INTERVAL '8 days', '10.0.1.2'),
((SELECT id FROM employers WHERE slug = 'digitech-innovations'), 'Michał W.', 5, 'Najlepsza decyzja w karierze', 'Dołączyłem 6 miesięcy temu i nie żałuję. Przełożeni są wspierający, a projekty naprawdę ambitne.', 'published', NOW() - INTERVAL '12 days', '10.0.1.3'),

-- BlueWave Solutions  
((SELECT id FROM employers WHERE slug = 'bluewave-solutions'), 'Karolina M.', 5, 'Wymarzona firma!', 'Po 3 latach pracy mogę śmiało powiedzieć, że to najlepsza firma w jakiej pracowałam. Świetny balans między życiem zawodowym a prywatnym.', 'published', NOW() - INTERVAL '3 days', '10.0.2.1'),
((SELECT id FROM employers WHERE slug = 'bluewave-solutions'), 'Piotr L.', 4, 'Solidne miejsce', 'Bardzo profesjonalne podejście do projektów. Dobre wynagrodzenie i benefit package. Atmosfera w zespole rewelacyjna!', 'published', NOW() - INTERVAL '7 days', '10.0.2.2'),

-- GreenVision Tech
((SELECT id FROM employers WHERE slug = 'greenvision-tech'), 'Magdalena T.', 5, 'Praca z misją!', 'Uwielbiam to co robię! Technologie ekologiczne to przyszłość, a tutaj mogę naprawdę wpływać na świat. Plus super zespół!', 'published', NOW() - INTERVAL '4 days', '10.0.3.1'),
((SELECT id FROM employers WHERE slug = 'greenvision-tech'), 'Łukasz P.', 4, 'Innowacyjnie i zielono', 'Fajnie jest pracować w firmie, która dba o środowisko. Projekty są ciekawe, a ludzie naprawdę zaangażowani w to co robią.', 'published', NOW() - INTERVAL '9 days', '10.0.3.2'),
((SELECT id FROM employers WHERE slug = 'greenvision-tech'), 'Agnieszka K.', 5, 'Rewelacyjne doświadczenie', 'Rok pracy w GreenVision to najlepszy rok w mojej karierze. Uczę się, rozwijam i mam poczucie, że robię coś ważnego.', 'published', NOW() - INTERVAL '15 days', '10.0.3.3'),

-- NextStep Software
((SELECT id FROM employers WHERE slug = 'nextstep-software'), 'Bartosz R.', 4, 'Dobre miejsce dla programistów', 'Jeśli szukasz miejsca gdzie możesz programować w nowoczesnych technologiach, to jest to miejsce dla Ciebie. Fajni ludzie i ciekawe wyzwania.', 'published', NOW() - INTERVAL '6 days', '10.0.4.1'),
((SELECT id FROM employers WHERE slug = 'nextstep-software'), 'Natalia G.', 5, 'Przyszłość zaczyna się tutaj', 'NextStep to nie tylko nazwa - to filozofia firmy. Zawsze jesteśmy krok do przodu, a ja mogę być częścią tej podróży!', 'published', NOW() - INTERVAL '11 days', '10.0.4.2'),

-- SmartFlow Systems
((SELECT id FROM employers WHERE slug = 'smartflow-systems'), 'Marcin D.', 5, 'Automatyzacja na najwyższym poziomie', 'Fascynujące jest to jak możemy zautomatyzować procesy biznesowe. W SmartFlow mam narzędzia i wsparcie żeby robić to naprawdę dobrze.', 'published', NOW() - INTERVAL '2 days', '10.0.5.1'),
((SELECT id FROM employers WHERE slug = 'smartflow-systems'), 'Justyna B.', 4, 'Inteligentne rozwiązania', 'Lubię pracować nad projektami, które rzeczywiście ułatwiają życie firmom. Tutaj takich projektów jest pod dostatkiem.', 'published', NOW() - INTERVAL '13 days', '10.0.5.2'),

-- CreativeMind Studio
((SELECT id FROM employers WHERE slug = 'creativemind-studio'), 'Aleksandra F.', 5, 'Kreatywność bez granic!', 'W CreativeMind mogę w pełni wykorzystać swoją kreatywność. Każdy projekt to nowa przygoda i możliwość stworzenia czegoś wyjątkowego.', 'published', NOW() - INTERVAL '1 day', '10.0.6.1'),
((SELECT id FROM employers WHERE slug = 'creativemind-studio'), 'Damian H.', 4, 'Studio pełne inspiracji', 'Miejsce gdzie designerzy i marketerzy współpracują jak jeden zespół. Efekty naszej pracy są naprawdę imponujące!', 'published', NOW() - INTERVAL '10 days', '10.0.6.2'),
((SELECT id FROM employers WHERE slug = 'creativemind-studio'), 'Weronika J.', 5, 'Marzenie grafika!', 'Tutaj każdy dzień przynosi nowe wyzwania kreatywne. Klienci są zadowoleni, a ja mogę realizować swoje marzenia zawodowe.', 'published', NOW() - INTERVAL '16 days', '10.0.6.3'),

-- TechBridge Consulting
((SELECT id FROM employers WHERE slug = 'techbridge-consulting'), 'Rafał C.', 4, 'Pomostowcy technologii', 'TechBridge naprawdę łączy firmy z nowoczesnymi technologiami. Praca konsultanta jest tu bardzo satysfakcjonująca.', 'published', NOW() - INTERVAL '14 days', '10.0.7.1'),
((SELECT id FROM employers WHERE slug = 'techbridge-consulting'), 'Monika Z.', 5, 'Eksperci od doradztwa', 'Mogę dzielić się swoją wiedzą z różnymi firmami i pomagać im w transformacji cyfrowej. To bardzo motywujące!', 'published', NOW() - INTERVAL '18 days', '10.0.7.2'),

-- InnoVex Labs
((SELECT id FROM employers WHERE slug = 'innovex-labs'), 'Grzegorz N.', 5, 'Laboratorium przyszłości!', 'W InnoVex zajmujemy się prawdziwymi innowacjami. Każdy dzień to eksperymenty z nowymi technologiami. Fascynujące!', 'published', NOW() - INTERVAL '20 days', '10.0.8.1'),
((SELECT id FROM employers WHERE slug = 'innovex-labs'), 'Katarzyna O.', 4, 'Badania i rozwój na topie', 'Jeśli lubisz eksperymentować i odkrywać nowe możliwości technologiczne, to jest miejsce dla Ciebie. Świetny zespół R&D!', 'published', NOW() - INTERVAL '22 days', '10.0.8.2'),

-- CloudPeak Services
((SELECT id FROM employers WHERE slug = 'cloudpeak-services'), 'Sebastian V.', 5, 'Na szczycie chmury!', 'CloudPeak to lider w usługach chmurowych. Praca z najnowszymi technologiami cloud computing to czysta przyjemność.', 'published', NOW() - INTERVAL '17 days', '10.0.9.1'),
((SELECT id FROM employers WHERE slug = 'cloudpeak-services'), 'Paulina Y.', 4, 'Infrastruktura przyszłości', 'Budowanie infrastruktury IT w chmurze to moja pasja, a tutaj mogę ją w pełni realizować. Super projekt!', 'published', NOW() - INTERVAL '25 days', '10.0.9.2'),
((SELECT id FROM employers WHERE slug = 'cloudpeak-services'), 'Adam U.', 5, 'Chmurnie i fajnie', 'Zespół CloudPeak to prawdziwi profesjonaliści. Każdy projekt to lekcja tego jak powinna wyglądać nowoczesna infrastruktura.', 'published', NOW() - INTERVAL '19 days', '10.0.9.3'),

-- BrightCode Agency
((SELECT id FROM employers WHERE slug = 'brightcode-agency'), 'Ewa I.', 4, 'E-commerce na najwyższym poziomie', 'Specjalizujemy się w sklepach internetowych i robimy to naprawdę dobrze. Klienci są zachwyceni rezultatami naszej pracy.', 'published', NOW() - INTERVAL '21 days', '10.0.10.1'),
((SELECT id FROM employers WHERE slug = 'brightcode-agency'), 'Krzysztof A.', 5, 'Jasny kod, jasne cele', 'BrightCode to miejsce gdzie kod jest nie tylko funkcjonalny, ale też elegancki. Dbamy o jakość na każdym etapie projektu.', 'published', NOW() - INTERVAL '23 days', '10.0.10.2'),

-- Dodajemy więcej opinii dla pozostałych firm (skrócona wersja)
((SELECT id FROM employers WHERE slug = 'futurenet-solutions'), 'Robert E.', 5, 'Bezpieczeństwo przede wszystkim', 'W dzisiejszych czasach cyberbezpieczeństwo jest kluczowe. FutureNet daje mi możliwość pracy nad najważniejszymi aspektami IT.', 'published', NOW() - INTERVAL '24 days', '10.0.11.1'),
((SELECT id FROM employers WHERE slug = 'futurenet-solutions'), 'Izabela Q.', 4, 'Sieciowo i bezpiecznie', 'Praca nad rozwiązaniami sieciowymi to fascynująca dziedzina. Tutaj mogę rozwijać się w kierunku który mnie interesuje.', 'published', NOW() - INTERVAL '26 days', '10.0.11.2'),

((SELECT id FROM employers WHERE slug = 'alphatech-group'), 'Mariusz W.', 5, 'Grupa na topie!', 'AlphaTech to nie jedna firma, to cała grupa projektów technologicznych. Różnorodność i możliwości rozwoju są nieograniczone.', 'published', NOW() - INTERVAL '27 days', '10.0.12.1'),
((SELECT id FROM employers WHERE slug = 'alphatech-group'), 'Beata X.', 4, 'Technologicznie Alpha', 'Zawsze jestem na bieżąco z najnowszymi trendami technologicznymi. AlphaTech pozwala mi być na fali innowacji.', 'published', NOW() - INTERVAL '28 days', '10.0.12.2'),

((SELECT id FROM employers WHERE slug = 'betawave-digital'), 'Stanisław T.', 5, 'Cyfrowa transformacja', 'Pomaganie firmom w transformacji cyfrowej to bardzo satysfakcjonująca praca. Widzę jak zmieniamy biznes na lepsze.', 'published', NOW() - INTERVAL '29 days', '10.0.13.1'),
((SELECT id FROM employers WHERE slug = 'betawave-digital'), 'Dorota R.', 4, 'Beta znaczy przyszłość', 'BetaWave to firma która myśli przyszłościowo. Każdy projekt to krok w stronę lepszej cyfrowej rzeczywistości.', 'published', NOW() - INTERVAL '30 days', '10.0.13.2'),

((SELECT id FROM employers WHERE slug = 'gammasoft-studio'), 'Artur Y.', 5, 'Gry i aplikacje top!', 'Tworzenie gier to moja pasja, a w GammaSoft mogę ją realizować na najwyższym poziomie. Każda gra to nowa przygoda!', 'published', NOW() - INTERVAL '31 days', '10.0.14.1'),
((SELECT id FROM employers WHERE slug = 'gammasoft-studio'), 'Sylwia U.', 4, 'Studio pełne kreatywności', 'Aplikacje rozrywkowe to więcej niż kod - to sztuka. GammaSoft pozwala mi tworzyć prawdziwe dzieła.', 'published', NOW() - INTERVAL '32 days', '10.0.14.2'),

((SELECT id FROM employers WHERE slug = 'deltacode-works'), 'Filip I.', 5, 'Startup-owa energia!', 'Praca dla startupów to czysta energia i innowacja. DeltaCode pozwala mi być częścią rewolucji technologicznej.', 'published', NOW() - INTERVAL '33 days', '10.0.15.1'),
((SELECT id FROM employers WHERE slug = 'deltacode-works'), 'Agata O.', 4, 'Kod dla przyszłych gigantów', 'Dzisiaj startup, jutro unicorn. Fajnie być częścią tego procesu od samego początku!', 'published', NOW() - INTERVAL '34 days', '10.0.15.2');

-- Reszta opinii zostanie dodana automatycznie przez trigger aktualizujący agregaty
SELECT 'Dodano 50 fikcyjnych firm z pozytywnymi opiniami' as status;

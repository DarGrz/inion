'use client'

import { useState, useEffect } from 'react'

interface FakeReview {
  id: number
  title: string
  body: string
  rating: number
  author_name: string
  date: Date
}

const FAKE_REVIEWS: Omit<FakeReview, 'id' | 'date'>[] = [
  {
    title: "Świetne miejsce pracy",
    body: "Bardzo dobra atmosfera w zespole, elastyczne godziny pracy i możliwość rozwoju. Polecam każdemu!",
    rating: 5,
    author_name: "Anna K."
  },
  {
    title: "Profesjonalne podejście",
    body: "Firma dba o pracowników, oferuje szkolenia i ma przejrzyste zasady awansu.",
    rating: 5,
    author_name: "Tomasz M."
  },
  {
    title: "Doskonały pracodawca",
    body: "Konkurencyjne wynagrodzenie, pakiet benefitów i miła atmosfera. Nie mogę narzekać!",
    rating: 5,
    author_name: "Magdalena W."
  },
  {
    title: "Polecam firmę",
    body: "Stabilne zatrudnienie, możliwość pracy zdalnej i wsparcie ze strony przełożonych.",
    rating: 5,
    author_name: "Paweł L."
  },
  {
    title: "Fantastyczne doświadczenie",
    body: "Praca tutaj to czysta przyjemność. Zespół jest wspierający, a projekty ciekawe.",
    rating: 5,
    author_name: "Katarzyna S."
  },
  {
    title: "Bardzo pozytywne wrażenia",
    body: "Firma inwestuje w pracowników, oferuje kursy językowe i szkolenia zawodowe.",
    rating: 5,
    author_name: "Michał R."
  },
  {
    title: "Rewelacyjne miejsce",
    body: "Elastyczny czas pracy, możliwość awansu i świetne relacje między pracownikami.",
    rating: 4,
    author_name: "Joanna B."
  },
  {
    title: "Zadowolony pracownik",
    body: "Dobra organizacja pracy, przejrzyste cele i fair traktowanie wszystkich.",
    rating: 5,
    author_name: "Robert K."
  },
  {
    title: "Świetna kultura firmy",
    body: "Otwarta komunikacja, możliwość wyrażania opinii i wpływania na decyzje.",
    rating: 5,
    author_name: "Agnieszka P."
  },
  {
    title: "Polecam każdemu",
    body: "Stabilna firma z przyszłością, dobry work-life balance i konkurencyjne warunki.",
    rating: 4,
    author_name: "Marcin T."
  },
  {
    title: "Excellent workplace",
    body: "Międzynarodowe środowisko, możliwość pracy z najnowszymi technologiami.",
    rating: 5,
    author_name: "Julia N."
  },
  {
    title: "Bardzo dobra firma",
    body: "Regularne podwyżki, premie za dobre wyniki i przyjazna atmosfera.",
    rating: 5,
    author_name: "Dawid G."
  },
  {
    title: "Pozytywne doświadczenie",
    body: "Możliwość rozwoju, ciekawe wyzwania i wsparcie w realizacji celów.",
    rating: 4,
    author_name: "Monika Z."
  },
  {
    title: "Wspaniały zespół",
    body: "Praca z profesjonalistami, którzy chętnie dzielą się wiedzą i doświadczeniem.",
    rating: 5,
    author_name: "Łukasz H."
  },
  {
    title: "Godna polecenia firma",
    body: "Transparentne procesy, jasne ścieżki kariery i dobre warunki socjalne.",
    rating: 4,
    author_name: "Natalia C."
  },
  {
    title: "Świetne miejsce rozwoju",
    body: "Firma daje możliwość uczenia się nowych rzeczy i rozwijania kompetencji.",
    rating: 5,
    author_name: "Kamil J."
  },
  {
    title: "Pozytywna atmosfera",
    body: "Współpracownicy są pomocni, a kierownictwo otwarte na sugestie.",
    rating: 4,
    author_name: "Ewa F."
  },
  {
    title: "Dobry pracodawca",
    body: "Regularne wypłaty, dodatkowe ubezpieczenie i możliwość korzystania z kart sportowych.",
    rating: 5,
    author_name: "Adam D."
  },
  {
    title: "Polecam serdecznie",
    body: "Stabilne zatrudnienie, możliwość awansu i przyjazne środowisko pracy.",
    rating: 5,
    author_name: "Beata Ł."
  },
  {
    title: "Fantastyczna firma",
    body: "Nowoczesne biuro, najnowszy sprzęt i świetne warunki do pracy.",
    rating: 5,
    author_name: "Szymon O."
  },
  {
    title: "Bardzo pozytywnie",
    body: "Elastyczne podejście do pracowników, zrozumienie dla potrzeb rodzinnych.",
    rating: 4,
    author_name: "Aleksandra M."
  },
  {
    title: "Doskonałe warunki",
    body: "Konkurencyjne wynagrodzenie, bonusy i pakiet świadczeń dodatkowych.",
    rating: 5,
    author_name: "Grzegorz K."
  },
  {
    title: "Świetne doświadczenie",
    body: "Praca zdalna, flextime i możliwość pogodzenia życia zawodowego z prywatnym.",
    rating: 5,
    author_name: "Izabela R."
  },
  {
    title: "Polecam firmę",
    body: "Jasne zasady, fair oceny i możliwość wpływania na swój rozwój zawodowy.",
    rating: 4,
    author_name: "Bartosz A."
  },
  {
    title: "Bardzo dobra organizacja",
    body: "Efektywne procesy, dobre narzędzia do pracy i wsparcie techniczne.",
    rating: 5,
    author_name: "Wioletta S."
  },
  {
    title: "Pozytywny klimat",
    body: "Brak toksycznej atmosfery, wsparcie ze strony zespołu i przełożonych.",
    rating: 5,
    author_name: "Artur W."
  },
  {
    title: "Godna polecenia",
    body: "Możliwość pracy nad interesującymi projektami i rozwijania pasji.",
    rating: 4,
    author_name: "Paulina E."
  },
  {
    title: "Świetny pracodawca",
    body: "Inwestycja w rozwój pracowników, kursy, certyfikacje i konferencje.",
    rating: 5,
    author_name: "Daniel L."
  },
  {
    title: "Bardzo pozytywnie",
    body: "Dobra komunikacja wewnętrzna, regularne spotkania zespołu i feedback.",
    rating: 4,
    author_name: "Karolina B."
  },
  {
    title: "Fantastyczne miejsce",
    body: "Możliwość wpływania na decyzje, uczestniczenia w strategii firmy.",
    rating: 5,
    author_name: "Rafał P."
  },
  {
    title: "Polecam każdemu",
    body: "Stabilność finansowa firmy, pewność zatrudnienia i perspektywy rozwoju.",
    rating: 5,
    author_name: "Marta G."
  },
  {
    title: "Doskonałe warunki pracy",
    body: "Nowoczesne technologie, ciekawe wyzwania i możliwość twórczej pracy.",
    rating: 5,
    author_name: "Jakub T."
  },
  {
    title: "Bardzo pozytywne",
    body: "Równowaga między życiem zawodowym a prywatnym, elastyczne godziny.",
    rating: 4,
    author_name: "Sylwia K."
  },
  {
    title: "Świetna firma",
    body: "Profesjonalne podejście, transparentność i uczciwe traktowanie pracowników.",
    rating: 5,
    author_name: "Marek F."
  },
  {
    title: "Polecam serdecznie",
    body: "Możliwość nauki od najlepszych, mentoring i wsparcie w rozwoju.",
    rating: 5,
    author_name: "Justyna H."
  },
  {
    title: "Pozytywne wrażenia",
    body: "Dobra atmosfera w zespole, wsparcie i możliwość realizacji własnych pomysłów.",
    rating: 4,
    author_name: "Tomasz C."
  },
  {
    title: "Fantastyczny pracodawca",
    body: "Regularne team buildingi, integracje i dbałość o relacje w zespole.",
    rating: 5,
    author_name: "Agata N."
  },
  {
    title: "Bardzo dobra firma",
    body: "Możliwość awansu, jasne kryteria oceny i sprawiedliwe wynagrodzenie.",
    rating: 5,
    author_name: "Piotr J."
  },
  {
    title: "Doskonałe miejsce",
    body: "Innowacyjne podejście, najnowsze trendy i możliwość eksperymentowania.",
    rating: 5,
    author_name: "Kinga M."
  },
  {
    title: "Pozytywny klimat pracy",
    body: "Otwartość na pomysły, możliwość wprowadzania usprawnień i zmian.",
    rating: 4,
    author_name: "Wojciech Z."
  },
  {
    title: "Świetne doświadczenie",
    body: "Stabilność, przewidywalność i jasne perspektywy rozwoju kariery.",
    rating: 5,
    author_name: "Dorota A."
  },
  {
    title: "Polecam firmę",
    body: "Możliwość pracy zdalnej, elastyczne godziny i zaufanie ze strony przełożonych.",
    rating: 4,
    author_name: "Sebastian D."
  },
  {
    title: "Bardzo pozytywnie",
    body: "Konkurencyjne benefity, pakiet medyczny i możliwość korzystania z MultiSport.",
    rating: 5,
    author_name: "Malwina R."
  },
  {
    title: "Fantastyczna atmosfera",
    body: "Praca w młodym, dynamicznym zespole pełnym energii i pomysłów.",
    rating: 5,
    author_name: "Krzysztof S."
  },
  {
    title: "Godna polecenia",
    body: "Możliwość uczestnictwa w ciekawych projektach i współpracy z klientami.",
    rating: 4,
    author_name: "Aneta L."
  },
  {
    title: "Świetny klimat",
    body: "Brak mikromanagementu, zaufanie i możliwość samodzielnego organizowania pracy.",
    rating: 5,
    author_name: "Patryk W."
  },
  {
    title: "Pozytywne doświadczenie",
    body: "Regularne szkolenia, możliwość uczestnictwa w konferencjach branżowych.",
    rating: 5,
    author_name: "Renata B."
  },
  {
    title: "Doskonały pracodawca",
    body: "Wsparcie w trudnych momentach, zrozumienie i elastyczność.",
    rating: 5,
    author_name: "Mariusz E."
  },
  {
    title: "Bardzo dobra firma",
    body: "Możliwość pracy nad różnorodnymi projektami i nabywania nowych umiejętności.",
    rating: 4,
    author_name: "Elżbieta P."
  },
  {
    title: "Polecam każdemu",
    body: "Przejrzyste procesy rekrutacyjne, jasne oczekiwania i fair oceny.",
    rating: 5,
    author_name: "Norbert G."
  },
  {
    title: "Świetne miejsce pracy",
    body: "Możliwość rozwoju w wybranym kierunku, wsparcie i mentoring.",
    rating: 5,
    author_name: "Klaudia T."
  },
  {
    title: "Fantastyczne warunki",
    body: "Nowoczesne biuro w centrum miasta, świetna lokalizacja i dojazdy.",
    rating: 4,
    author_name: "Filip K."
  },
  {
    title: "Bardzo pozytywnie",
    body: "Możliwość wpływania na organizację pracy i wprowadzania usprawnień.",
    rating: 5,
    author_name: "Zuzanna F."
  },
  {
    title: "Doskonałe doświadczenie",
    body: "Praca z najnowszymi technologiami i możliwość bycia na bieżąco z trendami.",
    rating: 5,
    author_name: "Maciej H."
  },
  {
    title: "Polecam serdecznie",
    body: "Stabilne zatrudnienie, pewność wypłat i jasne zasady premiowania.",
    rating: 4,
    author_name: "Iwona C."
  },
  {
    title: "Świetna organizacja",
    body: "Efektywne zarządzanie projektami, jasne deadliny i realne cele.",
    rating: 5,
    author_name: "Hubert N."
  },
  {
    title: "Pozytywny klimat",
    body: "Możliwość dzielenia się wiedzą, uczenia innych i rozwijania soft skills.",
    rating: 5,
    author_name: "Kornelia J."
  },
  {
    title: "Fantastyczny zespół",
    body: "Współpraca na najwyższym poziomie, wsparcie i dzielenie się doświadczeniem.",
    rating: 4,
    author_name: "Damian M."
  },
  {
    title: "Bardzo dobra firma",
    body: "Możliwość pracy międzynarodowej, kontakty z klientami z całego świata.",
    rating: 5,
    author_name: "Urszula Z."
  },
  {
    title: "Godna polecenia",
    body: "Regularne feedback sessions, możliwość omówienia celów i oczekiwań.",
    rating: 5,
    author_name: "Błażej A."
  },
  {
    title: "Świetne warunki",
    body: "Możliwość korzystania z najnowszych narzędzi i technologii w pracy.",
    rating: 4,
    author_name: "Oliwia D."
  },
  {
    title: "Pozytywne wrażenia",
    body: "Kultura feedbacku, otwartość na krytykę i możliwość ciągłego doskonalenia.",
    rating: 5,
    author_name: "Kamil R."
  },
  {
    title: "Doskonały pracodawca",
    body: "Możliwość łączenia różnych ról, rozwijania uniwersalnych kompetencji.",
    rating: 5,
    author_name: "Emilia S."
  },
  {
    title: "Fantastyczne miejsce",
    body: "Praca nad projektami które mają realny wpływ na biznes i społeczeństwo.",
    rating: 5,
    author_name: "Oskar L."
  },
  {
    title: "Bardzo pozytywnie",
    body: "Możliwość uczestnictwa w procesie decision making i wpływania na strategię.",
    rating: 4,
    author_name: "Wiktoria W."
  },
  {
    title: "Polecam firmę",
    body: "Transparentne komunikowanie zmian, informowanie o planach rozwoju firmy.",
    rating: 5,
    author_name: "Tadeusz B."
  },
  {
    title: "Świetna atmosfera",
    body: "Brak stresu, spokojne tempo pracy i możliwość zachowania work-life balance.",
    rating: 4,
    author_name: "Milena E."
  },
  {
    title: "Pozytywne doświadczenie",
    body: "Możliwość pracy w różnych działach, poznawania firmy od środka.",
    rating: 5,
    author_name: "Jacek P."
  },
  {
    title: "Doskonałe warunki",
    body: "Regularne spotkania one-on-one z przełożonym, feedback i wsparcie.",
    rating: 5,
    author_name: "Lidia G."
  },
  {
    title: "Fantastyczny klimat",
    body: "Możliwość realizacji własnych projektów i pomysłów na rozwój firmy.",
    rating: 5,
    author_name: "Mateusz T."
  },
  {
    title: "Bardzo dobra organizacja",
    body: "Jasne procedury, dobrze zdefiniowane procesy i efektywna komunikacja.",
    rating: 4,
    author_name: "Paulina K."
  },
  {
    title: "Polecam każdemu",
    body: "Możliwość awansu wewnętrznego, rozwoju kariery w ramach firmy.",
    rating: 5,
    author_name: "Radosław F."
  },
  {
    title: "Świetne miejsce rozwoju",
    body: "Inwestycje w rozwój pracowników, budżet na szkolenia i certyfikacje.",
    rating: 5,
    author_name: "Magdalena H."
  },
  {
    title: "Pozytywny klimat pracy",
    body: "Możliwość pracy z ekspertami z branży, uczenia się od najlepszych.",
    rating: 4,
    author_name: "Przemysław C."
  },
  {
    title: "Doskonały pracodawca",
    body: "Konkurencyjne wynagrodzenie, regularne podwyżki i system premiowy.",
    rating: 5,
    author_name: "Joanna N."
  },
  {
    title: "Fantastyczne doświadczenie",
    body: "Możliwość uczestnictwa w projektach innowacyjnych, eksperymentowania.",
    rating: 5,
    author_name: "Krystian J."
  },
  {
    title: "Bardzo pozytywnie",
    body: "Elastyczność w podejściu do obowiązków, możliwość negocjacji warunków.",
    rating: 4,
    author_name: "Agnieszka M."
  },
  {
    title: "Godna polecenia firma",
    body: "Stabilność zatrudnienia, jasne perspektywy i możliwość planowania kariery.",
    rating: 5,
    author_name: "Bartłomiej Z."
  },
  {
    title: "Świetne warunki pracy",
    body: "Nowoczesne podejście do zarządzania, wykorzystanie agile i nowoczesnych metodyk.",
    rating: 5,
    author_name: "Natalia A."
  },
  {
    title: "Pozytywne wrażenia",
    body: "Możliwość pracy nad challenging projektami, rozwijania ekspertyzy.",
    rating: 4,
    author_name: "Marcin D."
  },
  {
    title: "Doskonałe miejsce",
    body: "Kultura ciągłego uczenia się, możliwość eksperymentowania z nowymi rozwiązaniami.",
    rating: 5,
    author_name: "Ewelina R."
  },
  {
    title: "Fantastyczny zespół",
    body: "Praca z ludźmi którzy są pasjonatami swojej dziedziny, inspirująca atmosfera.",
    rating: 5,
    author_name: "Konrad S."
  },
  {
    title: "Bardzo dobra firma",
    body: "Możliwość wpływania na kształt produktu, uczestniczenia w podejmowaniu decyzji.",
    rating: 4,
    author_name: "Malwina L."
  },
  {
    title: "Polecam serdecznie",
    body: "Transparentne zarządzanie, otwarta księgowość i jasne kryteria oceny.",
    rating: 5,
    author_name: "Wojciech W."
  },
  {
    title: "Świetna atmosfera",
    body: "Możliwość łączenia pracy z pasją, realizowania się zawodowo.",
    rating: 5,
    author_name: "Aleksandra B."
  },
  {
    title: "Pozytywne doświadczenie",
    body: "Regularne celebrowanie sukcesów zespołu, docenianie wkładu każdego.",
    rating: 4,
    author_name: "Dariusz E."
  },
  {
    title: "Doskonały pracodawca",
    body: "Możliwość uczestnictwa w life-long learning, ciągłego rozwoju kompetencji.",
    rating: 5,
    author_name: "Katarzyna P."
  },
  {
    title: "Fantastyczne warunki",
    body: "Work-life balance na najwyższym poziomie, szacunek dla czasu prywatnego.",
    rating: 5,
    author_name: "Łukasz G."
  },
  {
    title: "Bardzo pozytywnie",
    body: "Możliwość networking, budowania relacji branżowych i rozwoju sieci kontaktów.",
    rating: 4,
    author_name: "Monika T."
  },
  {
    title: "Godna polecenia",
    body: "Kultura diversity & inclusion, szacunek dla różnorodności i odmienności.",
    rating: 5,
    author_name: "Adam K."
  },
  {
    title: "Świetne miejsce pracy",
    body: "Możliwość pracy nad projektami które zmieniają świat na lepsze.",
    rating: 5,
    author_name: "Beata F."
  },
  {
    title: "Pozytywny klimat",
    body: "Dbałość o środowisko, działania CSR i odpowiedzialne podejście do biznesu.",
    rating: 4,
    author_name: "Szymon H."
  },
  {
    title: "Doskonałe doświadczenie",
    body: "Możliwość mentorowania innych, dzielenia się wiedzą i rozwijania leadership skills.",
    rating: 5,
    author_name: "Aleksandra C."
  },
  {
    title: "Fantastyczna firma",
    body: "Regularne badania satysfakcji pracowników, działania na rzecz poprawy warunków.",
    rating: 5,
    author_name: "Grzegorz N."
  },
  {
    title: "Bardzo dobra organizacja",
    body: "Możliwość pracy z najnowszymi technologiami, bycia pionierem w branży.",
    rating: 4,
    author_name: "Izabela J."
  },
  {
    title: "Polecam firmę",
    body: "Kultura open source, możliwość współtworzenia projektów społecznościowych.",
    rating: 5,
    author_name: "Bartosz M."
  },
  {
    title: "Świetne warunki",
    body: "Możliwość remote work, elastyczne godziny i zaufanie ze strony managementu.",
    rating: 5,
    author_name: "Wioletta Z."
  },
  {
    title: "Pozytywne wrażenia",
    body: "Regularne hackathony, możliwość eksperymentowania z nowymi pomysłami.",
    rating: 4,
    author_name: "Artur A."
  },
  {
    title: "Doskonały klimat",
    body: "Możliwość uczestnictenia w konferencjach jako speaker, budowania personal brand.",
    rating: 5,
    author_name: "Paulina D."
  },
  {
    title: "Fantastyczny pracodawca",
    body: "Innovation time - możliwość poświęcenia czasu na własne projekty i eksperymenty.",
    rating: 5,
    author_name: "Daniel R."
  }
]

// Function to generate a random date within the last 7 days
function getRandomRecentDate(): Date {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * 7)
  const hoursAgo = Math.floor(Math.random() * 24)
  const minutesAgo = Math.floor(Math.random() * 60)
  
  const randomDate = new Date(now)
  randomDate.setDate(randomDate.getDate() - daysAgo)
  randomDate.setHours(randomDate.getHours() - hoursAgo)
  randomDate.setMinutes(randomDate.getMinutes() - minutesAgo)
  
  return randomDate
}

// Function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function FakeReviews() {
  const [reviews, setReviews] = useState<FakeReview[]>([])

  useEffect(() => {
    // Generate random reviews with random dates on component mount
    const shuffledReviews = shuffleArray(FAKE_REVIEWS)
    const selectedReviews = shuffledReviews.slice(0, 10).map((review, index) => ({
      ...review,
      id: index + 1,
      date: getRandomRecentDate()
    }))
    
    setReviews(selectedReviews)

    // Refresh reviews every 30 seconds to show different ones
    const interval = setInterval(() => {
      const newShuffledReviews = shuffleArray(FAKE_REVIEWS)
      const newSelectedReviews = newShuffledReviews.slice(0, 10).map((review, index) => ({
        ...review,
        id: index + 1,
        date: getRandomRecentDate()
      }))
      setReviews(newSelectedReviews)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 bg-white" id="fake-reviews">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl mt-20 font-bold text-gray-900 mb-4">
            Najnowsze opinie pracowników
          </h2>
          <p className="text-gray-600">
            Zobacz co inni mówią o swoich pracodawcach
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                   
                  </div>
                  <p className="text-sm text-gray-500"></p>
                </div>
                
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i 
                      key={star}
                      className={`fas fa-star text-sm ${
                        star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    ></i>
                  ))}
                  <span className="ml-1 text-sm font-medium">{review.rating}/5</span>
                </div>
              </div>

              <h3 className="font-medium text-gray-900 mb-2">
                {review.title}
              </h3>

              <p className="text-gray-700 mb-4 line-clamp-3">
                {review.body}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {review.author_name}
                </span>
                <span className="text-gray-400">
                  {review.date.toLocaleDateString('pl-PL')}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <div className="inline-flex items-center text-sm text-gray-500">
            <i className="fas fa-sync-alt mr-2"></i>
            Opinie aktualizują się automatycznie
          </div>
        </div>
      </div>
    </section>
  )
}

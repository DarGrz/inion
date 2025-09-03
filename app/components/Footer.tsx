import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo i opis */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <Image 
                src="/logo-square-transparent.png" 
                alt="Oipinion.com Logo" 
                width={40} 
                height={40}
                className="mr-3"
              />
              <h3 className="text-xl font-bold">Oipinion.com</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Platforma opinii o pracodawcach w Polsce. Dziel się swoimi doświadczeniami 
              zawodowymi i pomagaj innym w podejmowaniu świadomych decyzji karrierowych.
            </p>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center">
                <i className="fas fa-envelope w-5 mr-2"></i>
                <a href="mailto:kontakt@oipinion.com" className="hover:text-white transition-colors">
                  kontakt@oipinion.com
                </a>
              </div>
              <div className="flex items-start">
                <i className="fas fa-map-marker-alt w-5 mr-2 mt-1"></i>
                <div>
                  <div>Warszawa</div>
                  
                </div>
              </div>
            </div>
          </div>

          {/* Nasze biura */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Nasze biura</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <div className="font-medium text-white">Warszawa</div>
              </div>
              <div>
                <div className="font-medium text-white">Kraków</div>
              </div>
              <div>
                <div className="font-medium text-white">Gdańsk</div>
              </div>
              <div>
                <div className="font-medium text-white">Wrocław</div>
              </div>
              <div>
                <div className="font-medium text-white">Poznań</div>
              </div>
              <div>
                <div className="font-medium text-white">Łódź</div>
              </div>
              <div>
                <div className="font-medium text-white">Katowice</div>
              </div>
            </div>
          </div>

          {/* Linki */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Informacje</h4>
            <div className="space-y-2 text-sm">
              <div><Link href="/regulamin" className="text-gray-300 hover:text-white transition-colors">Regulamin</Link></div>
              <div><Link href="/polityka-prywatnosci" className="text-gray-300 hover:text-white transition-colors">Polityka prywatności</Link></div>
              <div><Link href="/cookies" className="text-gray-300 hover:text-white transition-colors">Polityka cookies</Link></div>
              <div><Link href="/pomoc" className="text-gray-300 hover:text-white transition-colors">Centrum pomocy</Link></div>
              <div><Link href="/kariera" className="text-gray-300 hover:text-white transition-colors">Kariera</Link></div>
            </div>
            
            <div className="mt-6">
              <h5 className="font-medium mb-3">Śledź nas</h5>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Oipinion.com - Wszystkie prawa zastrzeżone</p>
        </div>
      </div>
    </footer>
  )
}

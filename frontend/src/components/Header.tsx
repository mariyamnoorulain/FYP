import type { Page } from '../types';
import learnhubLogo from '../assets/learnhub_logo.png';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { name: 'Home', page: 'landing' as Page },
  { name: 'Courses', page: 'courses' as Page },
  { name: 'Tutor', page: 'tutor' as Page },
  { name: 'Contact us', page: 'contact' as Page },
];

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const hideAuth =
    currentPage === 'studentDashboard' ||
    currentPage === 'tutorDashboard' ||
    currentPage === 'adminDashboard';

  return (
    <header className="bg-[#032E3F] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">

          {/* Logo - LearnHUB brand logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate('landing')}
          >
            <img
              src={learnhubLogo}
              alt="LearnHUB - AI-Powered Interactive Video Ecosystem"
              className="h-28 w-auto object-contain"
            />
          </div>

          {/* Nav - Bilkul same jaise pehle tha */}
          <nav className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => onNavigate(item.page)}
                className={`relative pb-1 font-medium text-lg transition-colors
                  ${currentPage === item.page ? 'text-white' : 'text-gray-300 hover:text-white'}`}
              >
                {item.name}
                {currentPage === item.page && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Auth Buttons - Bilkul same */}
          {!hideAuth && (
            <div className="flex items-center space-x-4">
              {currentPage !== 'login' && (
                <button
                  onClick={() => onNavigate('login')}
                  className="text-gray-300 hover:text-white font-medium"
                >
                  Sign in
                </button>
              )}
              {currentPage !== 'signup' && (
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-6 py-3 bg-white text-[#032E3F] rounded-lg font-semibold"
                >
                  Join for Free
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
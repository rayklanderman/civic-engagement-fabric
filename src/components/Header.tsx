import { Link } from 'react-router-dom';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-[#006600] hover:text-[#005500] transition-colors">
            Sauti ya Wananchi
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/counties">Counties</NavLink>
            <NavLink to="/bills">Bills</NavLink>
            <NavLink to="/statistics">Statistics</NavLink>
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col space-y-4">
              <NavLink to="/counties" mobile onClick={() => setIsMenuOpen(false)}>
                Counties
              </NavLink>
              <NavLink to="/bills" mobile onClick={() => setIsMenuOpen(false)}>
                Bills
              </NavLink>
              <NavLink to="/statistics" mobile onClick={() => setIsMenuOpen(false)}>
                Statistics
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
}

function NavLink({ to, children, mobile, onClick }: NavLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`text-gray-800 hover:text-[#006600] transition-colors ${
        mobile ? 'text-lg' : 'font-medium'
      }`}
    >
      {children}
    </Link>
  );
}
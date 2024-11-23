import { Link } from 'react-router-dom';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-kenya-black text-kenya-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold hover:text-kenya-red transition-colors">
            Sauti ya Wananchi
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-kenya-red transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
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
          <nav className="md:hidden py-4 space-y-4">
            <NavLink mobile to="/counties" onClick={() => setIsMenuOpen(false)}>
              Counties
            </NavLink>
            <NavLink mobile to="/bills" onClick={() => setIsMenuOpen(false)}>
              Bills
            </NavLink>
            <NavLink mobile to="/statistics" onClick={() => setIsMenuOpen(false)}>
              Statistics
            </NavLink>
          </nav>
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
  const baseClasses = "font-medium transition-colors hover:text-kenya-red";
  const mobileClasses = mobile
    ? "block py-2"
    : "inline-block";

  return (
    <Link
      to={to}
      className={`${baseClasses} ${mobileClasses}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
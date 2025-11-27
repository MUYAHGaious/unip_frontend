import { Link, useLocation } from 'react-router-dom';
import { FileText, BarChart3, Code } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors duration-200"
          >
            <FileText className="h-7 w-7" />
            <span className="gradient-text">UNIP</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link
              to="/analyze"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-out ${
                isActive('/analyze')
                  ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Analyze
            </Link>

            <Link
              to="/api-docs"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-out ${
                isActive('/api-docs')
                  ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Code className="h-4 w-4" />
              API Docs
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

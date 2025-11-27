import { Link, useLocation } from 'react-router-dom';
import { FileText, BarChart3, Code, History } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { useHistory } from '../../context/HistoryContext';

const Header = () => {
  const location = useLocation();
  const { history } = useHistory();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 sticky top-0 z-40">
      <nav className="container mx-auto px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4">
        <div className="flex justify-between items-center">
          {/* Logo - Mobile First */}
          <Link
            to="/"
            className="flex items-center gap-1.5 sm:gap-2 text-xl sm:text-2xl font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors duration-200 touch-manipulation min-h-[44px]"
          >
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 flex-shrink-0" />
            <span className="gradient-text">UNIP</span>
          </Link>

          {/* Navigation Links - Hidden on mobile, shown on md+ */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/analyze"
              className={`flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg font-medium text-sm lg:text-base transition-all duration-200 ease-out min-h-[44px] touch-manipulation ${
                isActive('/analyze')
                  ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <BarChart3 className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
              <span>Analyze</span>
            </Link>

            <Link
              to="/history"
              className={`flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg font-medium text-sm lg:text-base transition-all duration-200 ease-out relative min-h-[44px] touch-manipulation ${
                isActive('/history')
                  ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <History className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
              <span className="hidden lg:inline">History</span>
              <span className="lg:hidden">Hist</span>
              {history.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-600 dark:bg-teal-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {history.length}
                </span>
              )}
            </Link>

            <Link
              to="/api-docs"
              className={`flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg font-medium text-sm lg:text-base transition-all duration-200 ease-out min-h-[44px] touch-manipulation ${
                isActive('/api-docs')
                  ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Code className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
              <span className="hidden lg:inline">API Docs</span>
              <span className="lg:hidden">Docs</span>
            </Link>

            {/* Theme Toggle */}
            <div className="ml-1 lg:ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile: Only show theme toggle */}
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

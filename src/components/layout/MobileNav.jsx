import { NavLink } from 'react-router-dom';
import { Home, Sparkles, History, FileText } from 'lucide-react';

const MobileNav = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/analyze', icon: Sparkles, label: 'Analyze' },
    { to: '/history', icon: History, label: 'History' },
    { to: '/api-docs', icon: FileText, label: 'Docs' }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-inset-bottom shadow-lg">
      <div className="flex justify-around items-center h-16 sm:h-18 px-1 sm:px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-2 rounded-lg
               transition-all duration-200 min-w-[60px] sm:min-w-[70px] touch-manipulation
               active:scale-95 min-h-[44px]
               ${isActive
                ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20'
                : 'text-gray-600 dark:text-gray-400 active:bg-gray-100 dark:active:bg-gray-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${isActive ? 'scale-110' : ''} transition-transform flex-shrink-0`} />
                <span className="text-[10px] sm:text-xs font-medium leading-tight">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;

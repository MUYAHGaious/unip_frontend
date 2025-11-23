import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            UNIP
          </Link>
          <div className="space-x-4">
            <Link to="/analyze" className="text-gray-700 hover:text-primary-600 transition-colors">
              Analyze
            </Link>
            <Link to="/api-docs" className="text-gray-700 hover:text-primary-600 transition-colors">
              API Docs
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

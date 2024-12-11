import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">
                Movie Rating App
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              to="/create"
              className="ml-4 text-gray-600 hover:text-gray-900"
            >
              Add Movie
            </Link>
          </div>
        </div>
        </div>
        </nav>
    );
}
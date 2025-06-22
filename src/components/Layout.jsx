import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Layout({ children }) {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchSpaces();
  }, []);

  async function fetchSpaces() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .order('name');

      if (error) throw error;
      setSpaces(data || []);
    } catch (err) {
      console.error('Error fetching spaces:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/spaces" className="flex items-center">
                <span className="text-xl font-bold text-gray-800">MyInventory</span>
              </Link>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md min-h-screen p-4">
          <h2 className="text-lg font-semibold mb-4">My Spaces</h2>
          {loading ? (
            <div className="text-gray-500">Loading spaces...</div>
          ) : (
            <ul className="space-y-2">
              {spaces.map(space => (
                <li key={space.id}>
                  <Link
                    to={`/spaces/${space.id}`}
                    className={`block px-4 py-2 rounded transition-colors ${
                      location.pathname === `/spaces/${space.id}`
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {space.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
} 
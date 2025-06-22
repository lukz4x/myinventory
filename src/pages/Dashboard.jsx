import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [newSpaceName, setNewSpaceName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleCreateSpace(e) {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('spaces')
        .insert([
          { name: newSpaceName, user_id: user.id }
        ])
        .select();

      if (error) throw error;

      setNewSpaceName('');
      navigate(`/spaces/${data[0].id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Space</h1>

      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}

      {/* Create Space Form */}
      <form onSubmit={handleCreateSpace} className="max-w-md">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSpaceName}
            onChange={e => setNewSpaceName(e.target.value)}
            placeholder="Enter space name"
            className="flex-1 border rounded p-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Space
          </button>
        </div>
      </form>

      <div className="mt-8">
        <p className="text-gray-600">
          Select a space from the sidebar to view its items, or create a new space using the form above.
        </p>
      </div>
    </div>
  );
} 
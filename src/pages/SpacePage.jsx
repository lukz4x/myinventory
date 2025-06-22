import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SpaceItems from '../components/SpaceItems';

export default function SpacePage() {
  const { spaceId } = useParams();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSpace() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('spaces')
          .select('*')
          .eq('id', spaceId)
          .single();

        if (error) throw error;
        setSpace(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (spaceId) {
      fetchSpace();
    }
  }, [spaceId]);

  if (loading) return <div className="text-center py-4">Loading space...</div>;
  if (error) return <div className="text-red-600 text-center py-4">{error}</div>;
  if (!space) return <div className="text-center py-4">Space not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{space.name}</h1>
      <SpaceItems spaceId={spaceId} />
    </div>
  );
} 
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import EditItemModal from './EditItemModal';

export default function SpaceItems({ spaceId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  
  // New item form state
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 1,
    description: '',
    location: ''
  });

  // Load items
  useEffect(() => {
    fetchItems();
  }, [spaceId]);

  async function fetchItems() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('space_id', spaceId)
        .order('name');

      if (error) throw error;
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Add new item
  async function handleAddItem(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('items')
        .insert([
          {
            ...newItem,
            space_id: spaceId,
            user_id: (await supabase.auth.getUser()).data.user.id
          }
        ])
        .select();

      if (error) throw error;

      setItems([...items, data[0]]);
      setNewItem({ name: '', quantity: 1, description: '', location: '' });
    } catch (err) {
      setError(err.message);
    }
  }

  // Delete item
  async function handleDeleteItem(itemId) {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      setError(err.message);
    }
  }

  // Update item
  async function handleUpdateItem(updatedItem) {
    try {
      const { data, error } = await supabase
        .from('items')
        .update(updatedItem)
        .eq('id', updatedItem.id)
        .select();

      if (error) throw error;
      setItems(items.map(item => item.id === updatedItem.id ? data[0] : item));
      setEditingItem(null);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div className="text-center py-4">Loading items...</div>;
  if (error) return <div className="text-red-600 text-center py-4">{error}</div>;

  return (
    <div className="p-4">
      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Item name"
            value={newItem.name}
            onChange={e => setNewItem({...newItem, name: e.target.value})}
            className="border rounded p-2"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={e => setNewItem({...newItem, quantity: parseInt(e.target.value)})}
            className="border rounded p-2"
            min="1"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={newItem.location}
            onChange={e => setNewItem({...newItem, location: e.target.value})}
            className="border rounded p-2"
            required
          />
          <textarea
            placeholder="Description"
            value={newItem.description}
            onChange={e => setNewItem({...newItem, description: e.target.value})}
            className="border rounded p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Item
        </button>
      </form>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <div className="space-x-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this item?')) {
                      handleDeleteItem(item.id);
                    }
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-2 text-gray-600">
              <p>Quantity: {item.quantity}</p>
              <p>Location: {item.location}</p>
              <p className="mt-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center text-gray-500 mt-4">
          No items found in this space. Add some items above!
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onSave={handleUpdateItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
} 
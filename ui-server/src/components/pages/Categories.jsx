import React, { useEffect, useState } from 'react';

/**
 * Example Category Management UI
 * 
 * 1) Lists all categories in a table
 * 2) Lets user add a new category
 * 3) Lets user click "Rename" to inline-edit a category’s name
 * 4) Lets user delete a category
 */
function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // On mount, fetch categories from the backend
  useEffect(() => {
    fetchCategories();
  }, []);

  // 1) Fetch existing categories from backend
  const fetchCategories = async () => {
    try {
      // e.g. GET /api/categories
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error fetching categories');
      }
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Could not fetch categories');
    }
  };

  // 2) Add a new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newCategoryName })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error adding category');
      }
      const result = await res.json();
      // Suppose the backend returns { category: { _id, name } }
      setCategories([...categories, result.category]);
      setNewCategoryName('');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Could not add category');
    }
  };

  // 3) Start rename (inline editing)
  const handleRenameInit = (index) => {
    setEditingIndex(index);
    setEditingName(categories[index].name);
  };

  // 4) Confirm rename (save to backend)
  const handleRenameConfirm = async (index) => {
    const categoryId = categories[index]._id;
    const updatedName = editingName.trim();
    if (!updatedName) {
      setEditingIndex(null);
      setEditingName('');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: updatedName })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error renaming category');
      }
      // Suppose the backend returns { category: { _id, name } }
      const result = await res.json();
      // Update local array
      const updated = [...categories];
      updated[index] = result.category;
      setCategories(updated);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Could not rename category');
    } finally {
      setEditingIndex(null);
      setEditingName('');
    }
  };

  // 5) Cancel rename
  const handleRenameCancel = () => {
    setEditingIndex(null);
    setEditingName('');
  };

  // 6) Delete a category
  const handleDeleteCategory = async (index) => {
    const categoryId = categories[index]._id;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error deleting category');
      }
      // On success, remove from local
      const updated = [...categories];
      updated.splice(index, 1);
      setCategories(updated);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Could not delete category');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Manage Categories</h2>

      {/* If there's an error */}
      {errorMessage && (
        <p className="text-red-600 text-center mb-4">{errorMessage}</p>
      )}

      {/* Add Category */}
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 mb-6">
        <input
          type="text"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="border border-gray-300 rounded-md text-sm px-2 py-1
                     focus:outline-none focus:ring-2 focus:ring-indigo-300 flex-1"
        />
        <button
          onClick={handleAddCategory}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm"
        >
          Add Category
        </button>
      </div>

      {/* Category List */}
      {categories.length > 0 ? (
        <table className="table-auto w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Category Name</th>
              <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat._id} className="border-b border-gray-200">
                <td className="px-3 py-2">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="border border-gray-300 rounded-md text-sm px-2 py-1
                                 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-full"
                    />
                  ) : (
                    <span>{cat.name}</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {editingIndex === index ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRenameConfirm(index)}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleRenameCancel}
                        className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRenameInit(index)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(index)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-sm text-center text-gray-600">No categories found.</p>
      )}
    </div>
  );
}

export default Categories;

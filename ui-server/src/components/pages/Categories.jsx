// src/pages/Categories.jsx
import React, { useEffect, useState } from "react";

function Categories() {
  /* ───────── state ───────── */
  const [categories,      setCategories     ] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingIndex,    setEditingIndex   ] = useState(null);
  const [editingName,     setEditingName    ] = useState("");
  const [errorMessage,    setErrorMessage   ] = useState("");

  /* ───────── api helpers ───────── */
  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error fetching categories");
      setCategories(data.categories || []);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  /* on mount */
  useEffect(() => void fetchCategories(), []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error adding category");
      setCategories((prev) => [...prev, data.category]);
      setNewCategoryName("");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleRenameInit    = (i) => { setEditingIndex(i); setEditingName(categories[i].name); };
  const handleRenameCancel  = ()  => { setEditingIndex(null); setEditingName(""); };

  const handleRenameConfirm = async (i) => {
    const _id = categories[i]._id;
    const name = editingName.trim();
    if (!name) return handleRenameCancel();

    try {
      const res = await fetch(`http://localhost:5000/api/categories/${_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error renaming category");

      setCategories((prev) => {
        const copy = [...prev];
        copy[i] = data.category;
        return copy;
      });
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      handleRenameCancel();
    }
  };

  const handleDeleteCategory = async (i) => {
    const _id = categories[i]._id;
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error deleting category");
      setCategories((prev) => prev.filter((_, idx) => idx !== i));
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  /* ───────── UI ───────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex justify-center py-8 font-sans">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-xl p-8">

        {/* header */}
        <h2 className="text-3xl font-bold text-indigo-600 text-center mb-6">
          Manage Categories
        </h2>

        {errorMessage && (
          <p className="text-center text-red-600 mb-4">{errorMessage}</p>
        )}

        {/* add category */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="New category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleAddCategory}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg
                       shadow transition disabled:opacity-50"
            disabled={!newCategoryName.trim()}
          >
            Add
          </button>
        </div>

        {/* list */}
        {categories.length ? (
          <div className="overflow-x-auto rounded-lg shadow-inner">
            <table className="min-w-full text-sm">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-indigo-700">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-indigo-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, i) => (
                  <tr
                    key={cat._id}
                    className="even:bg-gray-50 animate-[fadeIn_300ms_ease-in]"
                  >
                    {/* name / input */}
                    <td className="px-4 py-3">
                      {editingIndex === i ? (
                        <input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md
                                     focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                      ) : (
                        <span>{cat.name}</span>
                      )}
                    </td>

                    {/* buttons */}
                    <td className="px-4 py-3">
                      {editingIndex === i ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRenameConfirm(i)}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600
                                       text-white rounded-md shadow transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleRenameCancel}
                            className="px-3 py-1 bg-gray-300 hover:bg-gray-400
                                       text-gray-800 rounded-md transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRenameInit(i)}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600
                                       text-white rounded-md shadow transition"
                          >
                            Rename
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(i)}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600
                                       text-white rounded-md shadow transition"
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
          </div>
        ) : (
          <p className="text-center text-gray-600">No categories yet.</p>
        )}
      </div>
    </div>
  );
}

export default Categories;

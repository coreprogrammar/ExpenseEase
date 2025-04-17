// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview]           = useState(null);

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  /* ---------------- fetch profile (unchanged) ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    const fetchUserProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers:{ Authorization:`Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setFormData({ name:data.user.name, email:data.user.email });
        } else { localStorage.removeItem("token"); navigate("/login"); }
      } catch { localStorage.removeItem("token"); navigate("/login"); }
      finally { setLoading(false); }
    };
    fetchUserProfile();
  }, [navigate]);

  /* ---------------- handlers (all original) ---------------- */
  const handleEditClick   = () => setEditing(true);
  const handleCancelClick = () => { setEditing(false); setFormData({ name:user.name, email:user.email }); setMessage(""); };
  const handleChange      = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSaveClick   = async () => { /* unchanged logic */ };
  const handleFileChange  = e => { const f=e.target.files[0]; if(f){ setSelectedImage(f); setPreview(URL.createObjectURL(f));}};
  const handleUpload      = async () => { /* unchanged logic */ };
  const handleLogout      = () => { localStorage.removeItem("token"); navigate("/login"); };

  if (loading) return <p className="text-center mt-12 text-gray-500">Loading profile…</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 font-sans">
      <div className="relative w-full max-w-xl bg-white shadow-2xl rounded-2xl overflow-hidden transform transition hover:shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
        {/* Decorative header bar */}
        <div className="h-28 bg-gradient-to-r from-indigo-500 to-purple-500" />
        {/* Avatar */}
        <div className="-mt-14 flex justify-center">
          <img
            src={ user?.profileImage ? user.profileImage : preview || "https://via.placeholder.com/150" }
            alt="avatar"
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover hover:scale-105 transition"
          />
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800">My Profile</h2>
          <p className="text-center text-gray-500 mb-4">Manage your personal information</p>

          {message && <p className="text-center text-green-600 mb-4">{message}</p>}

          {/* ---------- Photo upload ---------- */}
          <div className="flex flex-col items-center gap-2 mt-4">
            <label htmlFor="imgUpload"
                   className="cursor-pointer px-4 py-2 text-sm font-medium bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-300 hover:bg-indigo-100 transition">
              Choose photo
            </label>
            <input id="imgUpload" type="file" accept="image/*" className="hidden" onChange={handleFileChange}/>
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm shadow focus:outline-none focus:ring-2 focus:ring-green-400">
              Upload
            </button>
          </div>

          {/* ---------- Info fields ---------- */}
          {user && (
            <div className="mt-8 space-y-6">
              {[
                { label:'Name',  field:'name',  type:'text'  },
                { label:'Email', field:'email', type:'email' }
              ].map(({label,field,type})=>(
                <div key={field} className="flex justify-between items-center gap-4">
                  <span className="min-w-[80px] text-gray-500 font-medium">{label}:</span>
                  {editing ? (
                    <input
                      type={type}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="flex-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  ) : (
                    <span className="flex-1 text-gray-800">{user[field]}</span>
                  )}
                </div>
              ))}

              {/* Non‑editable rows */}
              <div className="flex justify-between text-gray-500">
                <span>User ID:</span><span className="text-gray-800">{user._id}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Joined:</span><span className="text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          {/* ---------- Action buttons ---------- */}
          <div className="mt-10 flex flex-wrap justify-between gap-3">
            {editing ? (
              <>
                <button
                  onClick={handleSaveClick}
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition">
                  Save
                </button>
                <button
                  onClick={handleCancelClick}
                  className="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg shadow transition">
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEditClick}
                className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow transition">
                Edit Profile
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

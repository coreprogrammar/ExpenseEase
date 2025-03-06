import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
          setFormData({ name: data.user.name, email: data.user.email });
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // ✅ Handle Edit Click
  const handleEditClick = () => setEditing(true);

  // ✅ Handle Cancel Click
  const handleCancelClick = () => {
    setEditing(false);
    setFormData({ name: user.name, email: user.email });
    setMessage("");
  };

  // ✅ Handle Input Changes
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Handle Save Click (Update Profile)
  const handleSaveClick = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setMessage("Profile updated successfully!");
        setEditing(false);
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (error) {
      setMessage("Error updating profile.");
    }
  };

  // ✅ Handle Image Selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file)); // ✅ Show preview before upload
    }
  };

  // ✅ Handle Image Upload
  const handleUpload = async () => {
    const token = localStorage.getItem("token");

    if (!selectedImage) {
      setMessage("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", selectedImage);

    try {
      const response = await fetch("http://localhost:5000/api/users/upload-photo", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUser((prev) => ({ ...prev, profileImage: data.profileImage }));
        setMessage("Profile photo updated successfully!");
      } else {
        setMessage("Failed to update profile photo.");
      }
    } catch (error) {
      setMessage("Error uploading profile photo.");
    }
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <p className="text-center mt-5 text-gray-500">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-600">User Profile</h2>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        {message && <p className="text-center text-green-500 mt-4">{message}</p>}

        {user ? (
          <div className="mt-6">
            <div className="flex items-center justify-center">
            <img
                className="w-24 h-24 rounded-full border-4 border-indigo-500"
                src={user.profileImage ? user.profileImage : preview || "https://via.placeholder.com/100"}
                alt="User Avatar"
                />
            </div>

            <div className="mt-6">
              <input type="file" accept="image/*" className="mt-4" onChange={handleFileChange} />
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mt-4" onClick={handleUpload}>
                Upload Photo
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-500 font-semibold">Name:</span>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md"
                  />
                ) : (
                  <span className="text-gray-900">{user.name}</span>
                )}
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-500 font-semibold">Email:</span>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md"
                  />
                ) : (
                  <span className="text-gray-900">{user.email}</span>
                )}
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-500 font-semibold">User ID:</span>
                <span className="text-gray-900">{user._id}</span>
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-500 font-semibold">Joined On:</span>
                <span className="text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              {editing ? (
                <>
                  <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg" onClick={handleSaveClick}>
                    Save Changes
                  </button>
                  <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg" onClick={handleCancelClick}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg" onClick={handleEditClick}>
                  Edit Profile
                </button>
              )}

              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-center mt-6">Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;

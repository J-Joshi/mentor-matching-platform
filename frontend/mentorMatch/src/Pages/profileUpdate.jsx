import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileUpdate = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/api/profile/getprofile`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch profile data.");

        const data = await response.json();
        setName(data.name || "");
        setRole(data.role || "");
        setSkills(Array.isArray(data.skills) ? data.skills.join(", ") : ""); // Convert array to string
        setInterests(
          Array.isArray(data.interests) ? data.interests.join(", ") : ""
        ); // Convert array to string
        setBio(data.bio || "");
      } catch (err) {
        setError("Failed to load profile data. Please try again.");
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/profile/updateProfile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            role,
            skills: skills.split(",").map((s) => s.trim()), // Convert string to array
            interests: interests.split(",").map((i) => i.trim()), // Convert string to array
            bio,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile.");

      setMessage("Profile updated successfully!");

      setTimeout(() => navigate("/profileview"), 3000); // Redirect after 3 seconds
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Update Your Profile
        </h1>
        {message && (
          <p className="text-green-500 text-center mb-4">{message}</p>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="mentor">Mentor</option>
              <option value="mentee">Mentee</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            <textarea
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. DSA, React (comma-separated)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interests
            </label>
            <textarea
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. Web development, Competitive Programing (comma-separated)"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Write a brief bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;

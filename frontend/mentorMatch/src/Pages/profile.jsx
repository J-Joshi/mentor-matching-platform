import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Fetch token from localStorage
        const response = await fetch(
          "http://localhost:5001/api/profile/getprofile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile.");
        }

        const data = await response.json();
        setProfile(data); // Set profile data in state
      } catch (err) {
        console.error(err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  const navigate = useNavigate();
  const handleUpdateClick = () => {
    navigate("/profile-update"); // Navigate to the profile setup page
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
          My Profile
        </h1>
        <div className="space-y-4">
          <div className="flex items-center gap-x-9">
            <h2 className="text-lg font-semibold text-gray-700 ">Name:</h2>
            <p className="text-gray-600 ">{profile.name}</p>
          </div>
          <div className="flex items-center gap-x-12">
            <h2 className="text-lg font-semibold text-gray-700">Role:</h2>
            <p className="text-gray-600 capitalize">{profile.role}</p>
          </div>
          <div className="flex items-center gap-x-10">
            <h2 className="text-lg font-semibold text-gray-700">Skills:</h2>
            <p className="text-gray-600">
              {profile.skills ? profile.skills.join(", ") : "Not provided"}
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <h2 className="text-lg font-semibold text-gray-700">Interests:</h2>
            <p className="text-gray-600">
              {profile.interests
                ? profile.interests.join(", ")
                : "Not provided"}
            </p>
          </div>
          <div className="flex items-center gap-x-12">
            <h2 className="text-lg font-semibold text-gray-700">Bio:</h2>
            <p className="text-gray-600">
              {profile.bio ? profile.bio : "No bio available."}
            </p>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={handleUpdateClick}
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-200"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

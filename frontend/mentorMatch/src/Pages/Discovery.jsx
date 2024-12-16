import React, { useState, useEffect } from "react";

const Discovery = () => {
  const [users, setUsers] = useState([]); // Fetched users
  const [role, setRole] = useState("All"); // Role filter
  const [skills, setSkills] = useState(""); // Skills filter
  const [interests, setInterests] = useState(""); // Interests filter
  const [error, setError] = useState(""); // Error message
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        role: role,
        skills: skills,
        interests: interests,
      }).toString();

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/discovery?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users.");
      }

      const data = await response.json();
      setUsers(data.users || []); // Update users
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Send Mentorship Request
  const sendRequest = async (receiverId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_URL
        }/api/mentorship-requests/sendrequest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ receiverId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send request.");
      }

      alert("Mentorship request sent successfully!");
    } catch (err) {
      alert("Failed to send request. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Discover Mentors & Mentees
        </h1>

        {/* Filters */}
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="All">All</option>
              <option value="mentor">Mentor</option>
              <option value="mentee">Mentee</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Skills</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., React, Python"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Interests</label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., Coding, Teaching"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </div>

        {/* Apply Filters */}
        <button
          onClick={fetchUsers}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Apply Filters
        </button>

        {/* Loading State */}
        {loading && <p className="text-center mt-4">Loading...</p>}

        {/* Error State */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {/* User List */}
        <div className="mt-8 space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="border rounded-md p-4 bg-gray-50 shadow-sm"
              >
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
                <p>
                  <strong>Skills:</strong>{" "}
                  {Array.isArray(user.skills)
                    ? user.skills.join(", ")
                    : user.skills || "Not provided"}
                </p>
                <p>
                  <strong>Interests:</strong>{" "}
                  {Array.isArray(user.interests)
                    ? user.interests.join(", ")
                    : user.interests || "Not provided"}
                </p>
                <button
                  onClick={() => sendRequest(user.id)}
                  className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                >
                  Send Request
                </button>
              </div>
            ))
          ) : (
            <p className="text-center">
              No users found. Try adjusting filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discovery;

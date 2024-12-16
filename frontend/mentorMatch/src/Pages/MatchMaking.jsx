import React, { useState, useEffect } from "react";

const Matchmaking = () => {
  const [matches, setMatches] = useState([]); // List of suggested matches
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  // Fetch matches on component mount
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/api/matchmaking`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch matches.");
        }

        const data = await response.json();
        setMatches(data.matches);
      } catch (err) {
        setError("Failed to load matches. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Mentorship Matches
        </h1>

        {loading && (
          <p className="text-center text-gray-700">Loading matches...</p>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Matches */}
        <div className="space-y-4">
          {matches.length > 0
            ? matches.map((match) => (
                <div
                  key={match.id}
                  className="border rounded-md p-4 bg-gray-50 shadow-sm"
                >
                  <h2 className="text-xl font-bold">{match.name}</h2>
                  <p>
                    <span className="font-medium">Role:</span> {match.role}
                  </p>
                  <p>
                    <span className="font-medium">Skills:</span>{" "}
                    {Array.isArray(match.skills)
                      ? match.skills.join(", ")
                      : match.skills || "Not provided"}
                  </p>
                  <p>
                    <span className="font-medium">Interests:</span>{" "}
                    {Array.isArray(match.interests)
                      ? match.interests.join(", ")
                      : match.interests || "Not provided"}
                  </p>
                  <p>
                    <span className="font-medium">Bio:</span> {match.bio}
                  </p>
                  <button
                    onClick={() => alert(`Request sent to ${match.name}!`)}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                  >
                    Send Request
                  </button>
                </div>
              ))
            : !loading && (
                <p className="text-center text-gray-700">No matches found.</p>
              )}
        </div>
      </div>
    </div>
  );
};

export default Matchmaking;

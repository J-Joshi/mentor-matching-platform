import React, { useState, useEffect } from "react";

const ConnectionRequests = () => {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch requests from backend
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_URL
        }/api/mentorship-requests/getrequest`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch mentorship requests.");
      }

      const { receivedRequests, sentRequests } = await response.json();

      setReceivedRequests(receivedRequests);
      setSentRequests(sentRequests);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle Accept
  const handleAccept = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${process.env.VITE_BACKEND_API_URL}/api/mentorship-requests/updaterequest/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "accepted" }),
        }
      );

      fetchRequests(); // Refresh requests after action
      alert("Request accepted!");
    } catch (err) {
      alert("Failed to accept request.");
    }
  };

  // Handle Reject
  const handleReject = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${
          import.meta.env.VITE_BACKEND_API_URL
        }/api/mentorship-requests/updaterequest/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "rejected" }),
        }
      );

      fetchRequests(); // Refresh requests after action
      alert("Request rejected!");
    } catch (err) {
      alert("Failed to reject request.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Connection Requests
        </h1>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Requests Received */}
        <h2 className="text-lg font-bold mb-4">New Requests (Pending)</h2>
        <div className="space-y-4">
          {receivedRequests
            .filter((req) => req.status === "pending")
            .map((req) => (
              <div key={req.id} className="border p-4 rounded-md shadow-sm">
                <h3 className="font-bold">{req.sender?.name}</h3>
                <p>Role: {req.sender?.role}</p>
                <p>
                  Skills: {req.sender?.skills?.join(", ") || "Not provided"}
                </p>
                <p>
                  Interests:{" "}
                  {req.sender?.interests?.join(", ") || "Not provided"}
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Accepted Requests */}
        <h2 className="text-lg font-bold mt-8 mb-4">Accepted Requests</h2>
        <div className="space-y-4">
          {receivedRequests
            .filter((req) => req.status === "accepted")
            .map((req) => (
              <div key={req.id} className="border p-4 rounded-md shadow-sm">
                <h3 className="font-bold">{req.sender?.name}</h3>
                <p>Role: {req.sender?.role}</p>
                <p>
                  Skills: {req.sender?.skills?.join(", ") || "Not provided"}
                </p>
                <p>
                  Interests:{" "}
                  {req.sender?.interests?.join(", ") || "Not provided"}
                </p>
                <p>Status: {req.status}</p>
              </div>
            ))}
        </div>

        {/* Rejected Requests */}
        <h2 className="text-lg font-bold mt-8 mb-4">Rejected Requests</h2>
        <div className="space-y-4">
          {receivedRequests
            .filter((req) => req.status === "rejected")
            .map((req) => (
              <div key={req.id} className="border p-4 rounded-md shadow-sm">
                <h3 className="font-bold">{req.sender?.name}</h3>
                <p>Role: {req.sender?.role}</p>
                <p>
                  Skills: {req.sender?.skills?.join(", ") || "Not provided"}
                </p>
                <p>
                  Interests:{" "}
                  {req.sender?.interests?.join(", ") || "Not provided"}
                </p>
                <p>Status: {req.status}</p>
              </div>
            ))}
        </div>

        {/* Sent Requests */}
        <h2 className="text-lg font-bold mt-8 mb-4">Requests Sent</h2>
        <div className="space-y-4">
          {sentRequests.map((req) => (
            <div key={req.id} className="border p-4 rounded-md shadow-sm">
              <h3 className="font-bold">{req.receiver?.name}</h3>
              <p>Role: {req.receiver?.role}</p>
              <p>
                Skills: {req.receiver?.skills?.join(", ") || "Not provided"}
              </p>
              <p>
                Interests:{" "}
                {req.receiver?.interests?.join(", ") || "Not provided"}
              </p>
              <p>Status: {req.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConnectionRequests;

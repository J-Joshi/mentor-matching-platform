import React, { useState, useEffect } from "react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]); // List of notifications
  const [error, setError] = useState(""); // Error state
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5001/api/notifications",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications.");
        }

        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        setError("Failed to load notifications. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Notifications</h1>

        {loading && (
          <p className="text-center text-gray-700">Loading notifications...</p>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="space-y-4">
          {notifications.length > 0
            ? notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border rounded-md p-4 bg-gray-50 shadow-sm"
                >
                  <p className="text-gray-800">
                    <span className="font-medium">{notification.message}</span>
                  </p>
                  <p className="text-gray-500 text-sm">
                    {notification.timestamp}
                  </p>
                </div>
              ))
            : !loading && (
                <p className="text-center text-gray-700">
                  No notifications available.
                </p>
              )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

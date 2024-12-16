import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RedirectToProfile = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_API_URL
          }/api/profile/checkprofilestatus`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile status.");
        }

        const data = await response.json();

        // Redirect based on profile status
        if (data.profileComplete) {
          navigate("/discovery"); // Redirect to Discovery page
        } else {
          navigate("/profile-update"); // Redirect to Setup Profile page
        }
      } catch (err) {
        console.error("Error checking profile status:", err);
        navigate("/login"); // Redirect to login if something goes wrong
      } finally {
        setLoading(false);
      }
    };

    checkProfileStatus();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null;
};

export default RedirectToProfile;

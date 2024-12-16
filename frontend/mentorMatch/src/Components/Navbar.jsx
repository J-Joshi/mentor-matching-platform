import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    navigate("/login"); // Redirect to login page
  };

  const isLoggedIn = !!localStorage.getItem("token"); // Check if user is logged in

  return (
    <nav className="bg-blue-500 text-white py-4">
      <div className="container mx-auto flex items-center justify-between ">
        <Link to="/" className="text-xl font-bold">
          Mentorship Platform
        </Link>
        <ul className="flex space-x-6 ">
          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/login" className="hover:text-gray-200">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gray-200">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/profileview" className="hover:text-gray-200">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/discovery" className="hover:text-gray-200">
                  Discover
                </Link>
              </li>
              <li>
                <Link to="/match-making" className="hover:text-gray-200">
                  Matches
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="hover:text-gray-200">
                  Notifications
                </Link>
              </li>
              <li>
                <Link to="/connectionrequests" className="hover:text-gray-200">
                  Connections
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:text-gray-200 focus:outline-none"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

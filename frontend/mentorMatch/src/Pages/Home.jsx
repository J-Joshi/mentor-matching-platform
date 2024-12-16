import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();
  if (isLoggedIn) {
    navigate("/profile");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-500">
          Welcome to Mentorship Platform
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Find the perfect mentor or mentee to help you grow. Connect, learn,
          and thrive in a community built to foster mentorship opportunities.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/login"
            className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-200"
          >
            Register
          </Link>
        </div>
        <div className="mt-8">
          <img
            src="https://hbr.org/resources/images/article_assets/2023/06/A_Jun23_07_BridgeMentors_1250588875.jpg"
            alt="Mentorship illustration"
            className="rounded-md shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;

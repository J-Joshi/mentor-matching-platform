import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import ProfileUpdate from "./Pages/profileUpdate";
import RedirectToProfile from "./Services/redirectToProfile";
import Discovery from "./Pages/Discovery";
import MatchMaking from "./Pages/MatchMaking";
import Notifications from "./Pages/Notifications";
import Profile from "./Pages/profile";
import ConnectionRequests from "./Pages/ConnectionRequests";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile-update" element={<ProfileUpdate />} />
        <Route path="/profile" element={<RedirectToProfile />} />
        <Route path="/profileview" element={<Profile />} />
        <Route path="/discovery" element={<Discovery />} />
        <Route path="/match-making" element={<MatchMaking />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/connectionrequests" element={<ConnectionRequests />} />
      </Routes>
    </Router>
  );
}

export default App;

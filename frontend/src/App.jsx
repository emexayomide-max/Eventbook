import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

import Home from "./pages/Home";
import Events from "./pages/Events";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EventDetails from "./pages/EventDetails";
import Bookings from "./pages/Bookings";
import ProtectedRoute from "./components/ProtectedRoute";
import MyEvents from "./pages/MyEvents";

function App() {

 const [isLoggedIn, setIsLoggedIn] = useState(
  Boolean(localStorage.getItem("token"))
);

useEffect(() => {
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  window.addEventListener("login", handleLogin);

  return () => {
    window.removeEventListener("login", handleLogin);
  };
}, []);

const handleLogout = () => {
  localStorage.removeItem("token");
  setIsLoggedIn(false);
  window.location.href = "/login";

};
  return (
    <BrowserRouter>
      <div className="app">
        <header className="navbar">
        <div className="brand">
  <span className="brand-icon">📖</span>
  <span>EventBook</span>
</div>

         <nav>
  <Link to="/">Home</Link>
  <Link to="/events">Events</Link>

  {isLoggedIn ? (
  <>
    <Link to="/profile">Profile</Link>
    <Link to="/bookings">My Bookings</Link>
    <Link to="/my-events">My Events</Link>
    <button onClick={handleLogout}>Logout</button>
  </>
): (
    <>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </>
  )}
</nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
         <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
          <Route path="/events/:id" element={<EventDetails />} />
          <Route
  path="/bookings"
  element={
    <ProtectedRoute>
      <Bookings />
    </ProtectedRoute>
  }
/>
<Route
  path="/my-events"
  element={
    <ProtectedRoute>
      <MyEvents />
    </ProtectedRoute>
  }
/>
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
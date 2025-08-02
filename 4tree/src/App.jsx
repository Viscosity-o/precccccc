import React from "react";
import Navbar from "./Components/Navbar"; 

// Sirf Navbar import kar rahe hain


import Home from "./pages/Home";
import Footer  from "./components/Footer";
import ReactDOM from "react-dom/client";
import { createBrowserRouter,RouterProvider } from "react-router-dom";
import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import NgoDashboard from "./pages/dashboard/NgoDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/user-dashboard",
    element: <UserDashboard />,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/ngo-dashboard",
    element: <NgoDashboard />,
  },
  {
    path: "*",
    element: <h1>404 - Page Not Found</h1>,
  },
]);




function App() {
  return (

    
    <div>
      <Navbar /> {/* Navbar component render ho raha hai */}
      <Home />
      <Footer />
    </div>
  );
}

export default App;

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
import Signup from "./pages/Signup"

const router = createBrowserRouter([
  {
    path: "/",
    element:
    <div>
      <Navbar/>
      <Home />,
      <Footer/>
    </div>  
    
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
    path: "/dashboard/:slug",
    element:<div>
      
      <UserDashboard />,
      <Footer/>
    </div>  
  },
  {
    path: "/admin-dashboard/:slug",
    element: <div>
      <Navbar/>
      <AdminDashboard />,
      <Footer/>
    </div>  
  },
  {
    path: "/ngo-dashboard/:slug",
    element: <div>
      <Navbar/>
      <NgoDashboard />,
      <Footer/>
    </div>  
  },
  {
    path: "*",
    element: <h1>404 - Page Not Found</h1>,
  },
]);




function App() {
  return (

    
    <div>
      <RouterProvider router={router}/>
      
    </div>
  );
}

export default App;

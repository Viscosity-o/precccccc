import React from "react";
import Navbar from "./Components/Navbar"; 

// Sirf Navbar import kar rahe hain


import Home from "./pages/Home";
import Footer  from "./components/Footer";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";



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

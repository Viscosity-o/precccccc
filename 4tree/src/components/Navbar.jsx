import React from "react";
import "./Navbar.css"; // Link to external CSS

const Navbar = () => {
  const toggleMobileMenu = () => {
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu) {
      mobileMenu.classList.toggle("active");
    }
  };

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      const navbar = document.querySelector(".navbar");
      const mobileMenu = document.getElementById("mobileMenu");

      if (navbar && !navbar.contains(event.target)) {
        mobileMenu?.classList.remove("active");
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      if (window.scrollY > 50) {
        navbar.style.background = "rgba(255, 255, 255, 0.95)";
        navbar.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.15)";
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.85)";
        navbar.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="logo-section">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
              <path
                d="M12 12L13.09 18.26L20 19L13.09 19.74L12 26L10.91 19.74L4 19L10.91 18.26L12 12Z"
                opacity="0.6"
              />
            </svg>
          </div>
          <div className="logo-text">4Tree NGO</div>
        </div>

        <div className="nav-buttons">
          <a href="#donate" className="btn btn-donate">Donate</a>
          <a href="#signin" className="btn btn-signin">Sign In</a>
        </div>

        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <div className="mobile-menu" id="mobileMenu">
          <a href="#donate" className="btn btn-donate">Donate</a>
          <a href="#signin" className="btn btn-signin">Sign In</a>
        </div>
      </nav>

     
    </>
  );
};

export default Navbar;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";
import logo from "../assets/images/logo.png";

/**
 * @author Amol Dhaliwal
 * Logic and content for navbar utilised for navigation
 */

const Navbar = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMenu = () => setClick(false);
  return (
    <div className="header">
      <nav className="navbar">
        <a href="/" className="logo">
          <img src={logo} alt="logo" />
        </a>
        <div className="hamburger" onClick={handleClick}>
          {click ? (
            <FaTimes size={30} style={{ color: "#ffffff" }} />
          ) : (
            <FaBars
              className="nav-toggle"
              size={30}
              style={{ color: "#ffffff" }}
            />
          )}
        </div>
        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/About" onClick={closeMenu}>
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/CreatePost" onClick={closeMenu}>
              Add Sighting
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/Sightings" onClick={closeMenu}>
              View Sightings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default Navbar;

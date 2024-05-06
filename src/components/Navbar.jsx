import React from 'react';
import './Navbar.css'; // Import CSS file for styling
import image from '../assets/letter-w.png'
import { FaHandSparkles } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <img src={image} className="app-name"/>
      </div>
      <div className="login-button">
        <span> 👋  </span>
        <p>Siddharth</p>
      </div>
    </div>
  );
};

export default Navbar;

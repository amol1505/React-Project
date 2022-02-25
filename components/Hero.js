import React from "react";
import "./Hero.css";
import { useNavigate } from "react-router-dom";
/**
 * @author Amol Dhaliwal
 * Logic and content for hero component used on home screen
 */
const Hero = () => {
  let navigate = useNavigate();
  return (
    <div className="hero-container">
      <h1>SAVE THE PANGOLINS</h1>
      <p>Make a diffference</p>
      <div className="hero-btns">
        <button
          className="btn--outline"
          onClick={() => {
            navigate("/About");
          }}
        >
          LEARN MORE
        </button>
        <button
          className="btn--primary"
          onClick={() => {
            navigate("/CreatePost");
          }}
        >
          ADD SIGHTING
        </button>
      </div>
    </div>
  );
};

export default Hero;

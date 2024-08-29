import React from "react";
import './SkeletonPage.css';
import Navbar from "../navbar/Navbar";

export default function SkeletonPage() {
  return (
    <div>  <Navbar isEditPage={false}/>
    <div className="skeleton-container">
      
      <div className="skeleton-upper">
        <div className="skeleton-section skeleton-left"></div>
        <div className="skeleton-section skeleton-right"></div>
      </div>
      <div className="skeleton-lower"></div>
    </div>
    </div>
  );
}

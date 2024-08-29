import React from "react";
import "./SkeletonPage.css";

export default function ListingPageSkeleton() {
    const arr = ["","","","","",""]
  return (
<div className="lp-wrapper">
{arr.map((ele)=>(
    <div className='lp-container'>
    <div className="thumbnail">

    </div>
    <div className="title"></div>
    <div className="date"></div>
  </div>
 ))}</div>
  );
}
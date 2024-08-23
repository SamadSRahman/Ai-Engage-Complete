import React from "react";
import styles from "./ContactUs.module.css";
import arrowBack from "../../images/arrow_back.svg";
import map from "../../images/map.png";
import pin from "../../images/pin.svg";
import xircular from "../../images/XircularText.svg";
import copy from "../../images/content_copy.svg";
import outwardArrow from "../../images/arrow_outward.svg";
import { useNavigate } from "react-router-dom";

export default function ContactUs() {
    const navigate = useNavigate() 
    function copyToClipboard() {
        navigator.clipboard.writeText("8951142369").then(() => {
          // Provide user feedback
          alert('Text copied to clipboard');
        }).catch(err => {
          console.error('Failed to copy text: ', err);
        });
      }
function viewInMap(){
    window.open("https://maps.app.goo.gl/b27rzHDHT4KkQSLS9")
}
const handleArrowClick = () => {
    window.location.href = `mailto:info@xircular.io`;
  };
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <button onClick={()=>navigate("/")} className={styles.backBtn}>
          <img src={arrowBack} alt="" />
          Back
        </button>
      </div>
      <div className={styles.header}>
        <h2>Contact Us</h2>
      </div>
      <div className={styles.body}>
        <div className={styles.mapSection}>
          <img src={map} className={styles.mapImg} alt="" />
          <img src={pin} className={styles.pin} alt="" />
          <img src={xircular} alt="" className={styles.pinLabel} />
          <button className={styles.mapBtn} onClick={viewInMap}>View in map</button>
        </div>
        <div className={styles.infoSection}>
          <div className={styles.primarySection}>
            <span className={styles.title}>Merchant Legal entity name</span>
            <span className={styles.content}>
              XIRCULAR TECH PRIVATE LIMITED
            </span>
          </div>
          <div className={styles.primarySection}>
            <span className={styles.title}>Registered Address</span>
            <span className={styles.content}>
              18, 3rd Floor, 9th Main Road, 2nd Block, Jayanagar, Bangalore,
              Karnataka, India -560011
            </span>
          </div>
          <div className={styles.secondarySection}>
            <span className={styles.title}>Contact no</span>

            <div className={styles.imgWrapper}>
              <span className={styles.content}>8951142369</span>

             <div onClick={copyToClipboard}>
             <img src={copy} alt="" />
             </div>
            </div>
          </div>
          <div className={styles.secondarySection}>
            <span className={styles.title}>Email id</span>
            <div className={styles.imgWrapper}>
              <span className={styles.content}>info@xircular.io</span>
              <div onClick={handleArrowClick}>
              <img src={outwardArrow} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import styles from "./alert.module.css";
import close from "../../images/close_small.png";

export default function Alert({
  title,
  text,
  primaryBtnText,
  secondaryBtnText,
  onClose,
  onSuccess,
}) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

const handleClose=()=>{
  setIsVisible(false)
  setTimeout(()=>onClose(),500)
}
const handleSuccess = ()=>{
  setIsVisible(false)
  setTimeout(()=>onSuccess(),500)
}
  return (
    <div
      className={styles.wrapper}
      style={{ backdropFilter: `${isVisible ? "blur(5px)" : "blur(0px)"}` }}
    >
      <div
        className={styles.container}
        style={{ opacity: `${isVisible ? "1" : "0"}` }}
      >
        <div className={styles.header}>
          <span>{title}</span>
          <img onClick={handleClose} src={close} alt="" />
        </div>
        <div className={styles.body}>{text}</div>
        <div className={styles.btnSection}>
          {secondaryBtnText && (
            <button
              onClick={handleClose}
              className={styles.secondaryBtn}
            >
              {secondaryBtnText}
            </button>
          )}
          {primaryBtnText && (
            <button onClick={handleSuccess} className={styles.primaryBtn}>
              {primaryBtnText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

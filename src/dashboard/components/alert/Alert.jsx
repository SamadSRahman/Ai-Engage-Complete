import React from "react";
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
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span>{title}</span>
          <img onClick={onClose} src={close} alt="" />
        </div>
        <div className={styles.body}>{text}</div>
        <div className={styles.btnSection}>
          {secondaryBtnText && (
            <button onClick={onClose} className={styles.secondaryBtn}>
              {secondaryBtnText}
            </button>
          )}
          {primaryBtnText && (
            <button onClick={onSuccess} className={styles.primaryBtn}>
              {primaryBtnText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

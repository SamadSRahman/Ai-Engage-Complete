import React, { useEffect, useState, useCallback } from "react";
import PropTypes from 'prop-types';
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
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 500);
  }, [onClose]);

  const handleSuccess = useCallback(() => {
    setIsVisible(false);
    setTimeout(onSuccess, 500);
  }, [onSuccess]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  }, [handleClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className={styles.wrapper}
      style={{ backdropFilter: `blur(${isVisible ? 5 : 0}px)` }}
      role="dialog"
      aria-labelledby="alert-title"
      aria-describedby="alert-description"
    >
      <div
        className={styles.container}
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <div className={styles.header}>
          <span id="alert-title">{title}</span>
          <button style={{backgroundColor:'white', padding:"5px"}} onClick={handleClose} aria-label="Close alert">
            <img src={close} alt="" />
          </button>
        </div>
        <div id="alert-description" className={styles.body}>{text}</div>
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

Alert.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  primaryBtnText: PropTypes.string,
  secondaryBtnText: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
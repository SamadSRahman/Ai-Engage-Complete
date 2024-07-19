import React, { useEffect, useRef, useState } from "react";
import styles from "./forgetPassword.module.css";
import passIcon from "../../images/lock.svg";
import codeIcon from "../../images/password.svg";
import visibilityOffIcon from '../../images/visibility_off (1).svg'
import visibilityOnIcon from '../../images/visibility (1).svg'
import axios from "axios";

export default function ResetPassword({ onClose, onSuccess }) {
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const containerRef = useRef(null);
  const [isPassVisible, setIsPassVisible] = useState(false)
  const [isConfirmPassVisible, setIsConfirmPassVisible] = useState(false)

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const validatePassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const handleSendCode = async () => {
    const error = validatePassword(pass, confirmPass);
    if (error) {
      setPasswordError(error);
      return;
    }

    try {
      const response = await axios.post("https://stream.xircular.io/api/v1/customer/resetpassword", { password: pass });
      console.log(response.data);
      localStorage.setItem("password", pass);
      alert(response.data.message);
      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={containerRef}>
        <img src={codeIcon} alt="" className={styles.logo} />
        <label className={styles.primaryText}>Reset Password</label>
        <label className={styles.secondaryText}> Please enter your new password</label>
        <div id={styles.inputWrapper} className="inputWrapper">
          <img src={passIcon} alt="" />
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type={isPassVisible?"text":"password"}
            placeholder="New Password"
          />
          <img onClick={()=>setIsPassVisible(!isPassVisible)}  src={isPassVisible? visibilityOnIcon: visibilityOffIcon} alt="" />
        </div>
        <div id={styles.inputWrapper} className="inputWrapper">
          <img src={passIcon} alt="" />
          <input
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            type={isConfirmPassVisible?"text":"password"}
            placeholder="Confirm New Password"
          />
             <img onClick={()=>setIsConfirmPassVisible(!isConfirmPassVisible)}  src={isConfirmPassVisible? visibilityOnIcon: visibilityOffIcon} alt="" />
        </div>
        {passwordError && <span className={styles.errorText}>{passwordError}</span>}
        <button disabled={!pass||!confirmPass} className={styles.sendBtn} onClick={handleSendCode}>
          Reset Password
        </button>
      </div>
    </div>
  );
}

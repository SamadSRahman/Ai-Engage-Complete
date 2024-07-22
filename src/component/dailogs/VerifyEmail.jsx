import React, { useEffect, useRef, useState } from "react";
import styles from "./forgetPassword.module.css";
import mail from "../../images/mail.svg";

import pass from "../../images/mark_email_read (2).svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail({ onClose }) {
  const [otp, setOtp] = useState("");
  const containerRef = useRef(null);
  const email = localStorage.getItem("email");
  const [isResendVisible, setIsResendVisible] = useState(false);
  const [timer, setTimer] = useState(30)
const navigate = useNavigate()

  useEffect(()=>{
    setTimeout(() => {
     if(timer>0){
      setTimer(timer-1)
     }
     if(timer===0){
      setIsResendVisible(true)
     }
    }, 1000);
  }, [timer])
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        // onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };
  async function handleResendOTP() {
    try {
      const response = await axios.post(
        "https://stream.xircular.io/api/v1/customer/sendOtp",
        { email: email }
      );
      console.log(response.data);
      if(response.data.message){
        alert(response.data.message)
        setTimer(30)
        setIsResendVisible(false)

      }
    } catch (error) {
      console.log(error);
    }
  }
  async function handleSendCode() {
    try {
      const response = await axios.post(
        "https://stream.xircular.io/api/v1/customer/sendOtp",
        { email: email, otp:otp }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleVerifyCode() {
    try {
      const response = await axios.post(
        "https://stream.xircular.io/api/v1/customer/emailVerification",
        { email: email , otp:otp}
      );
      console.log(response.data);
      if(response.data.success){
        alert("Email verification successful. Please log in to continue")
        // onClose();
        navigate("/SignIn");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={containerRef}>
        <img
          width={"40px"}
          style={{ padding: "10px" }}
          src={pass}
          alt=""
          className={styles.logo}
        />
        <label className={styles.primaryText}>Verify your email</label>
        <label className={styles.secondaryText}>
          {" "}
          We’ve sent an OTP to your email
        </label>
        <div id={styles.inputWrapper} className="inputWrapper">
          {/* <img src={mail} alt="" /> */}
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            type="number"
            placeholder="OTP"
          />
        </div>
        {!isResendVisible ? (
          <div className="signUpSection">
            <span>Resend OTP in</span>
            <span onClick={""} className="linkSpan">
              {formatTime(timer)}
            </span>
          </div>
        ) : (
          <div className="signUpSection">
            <span>Didn’t receive OTP</span>
            <span onClick={handleResendOTP} className="linkSpan">
              Resend OTP
            </span>
          </div>
        )}
        <button
          disabled={otp ? false : true}
          className={styles.sendBtn}
          onClick={handleVerifyCode}
        >
          Verify
        </button>
      </div>
    </div>
  );
}

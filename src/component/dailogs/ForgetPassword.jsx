import React, { useEffect, useRef, useState } from "react";
import styles from "./forgetPassword.module.css";
import mail from "../../images/mail.svg";
import close from "../../images/cancel.svg";
import pass from "../../images/password.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgetPassword({ onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const containerRef = useRef(null);
  const [isLinkSent, setIsLinkSent] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isResendVisible,setIsResendVisible] = useState(false)
  const [isLoading,setIsLoading] = useState(false)
  const navigate = useNavigate()
  
  useEffect(()=>{
    setTimeout(() => {
     if(timer>0){
      setTimer(timer-1)
     }
     if(timer===0){
      setIsLinkSent(false)
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

  async function handleSendCode() {
    setError("")
    setIsLoading(true)
    try {
      const response = await axios.post(
        "https://aiengage.xircular.io/api/v1/customer/forgotpassword",
        { email: email }
      );
      console.log(response.data);
      localStorage.setItem("email", email);
      localStorage.setItem("customerId", response.data.customerId);
      alert(response.data.message);
      setIsLoading(false)
      setIsLinkSent(true)
      // onSuccess();
      // onClose()
      setTimer(30)
    } catch (error) {
      console.log(error);
      if(error.response.status===404 ||error.response.status===400){
        setError(error.response.data.message)
      }
      setIsLoading(false)
    }
  }
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={containerRef}>
      <div className={styles.topSection}>
          <img src={close} alt="" onClick={()=>navigate("/SignIn")} />
        </div>
        <img src={pass} alt="" className={styles.logo} />
        <label className={styles.primaryText}>Forgot Password?</label>
     {isLinkSent? (
      <label>
        We have a sent a reset password link to your email.<br/>
          <div className="signUpSection">
            <span>Resend code in</span>
            <span onClick={""} className="linkSpan">
              {formatTime(timer)}
            </span>
          </div>
      </label>
     ):(<div>
      <label className={styles.secondaryText}>
         
          Please enter your email to receive reset password link
        </label>
        <div id={styles.inputWrapper} className="inputWrapper">
          <img src={mail} alt="" />
          <input
          name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
          />
        </div>
        {error && <span className={styles.errorText}>{error}</span>}
        <button
          disabled={isLoading?isLoading:email? false : true}
          className={styles.sendBtn}
          onClick={handleSendCode}
        >  Send link</button>
        {/* {!isResendVisible ? (
          <div className="signUpSection">
            <span>Resend code in</span>
            <span onClick={""} className="linkSpan">
              {formatTime(timer)}
            </span>
          </div>
        ) : (
         
        )} */}


     </div>)  }
        
      
      </div>
    </div>
  );
}

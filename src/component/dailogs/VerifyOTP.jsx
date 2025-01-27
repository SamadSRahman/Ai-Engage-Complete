import React, { useEffect, useRef, useState } from "react";
import styles from "./forgetPassword.module.css";
import mail from "../../images/mail.svg";
import pass from "../../images/password.svg";
import axios from "axios";

export default function VerifyOtp({onClose}) {
  const [otp, setOtp] = useState("");
  const containerRef = useRef(null);
  const email = localStorage.getItem('email')

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        // onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  async function handleSendCode() {
   try{
    const response = await axios.post("https://aiengage.xircular.io/api/v1/customer/forgotpassword", {email:email})
    console.log(response.data)
   }
   catch(error){
    console.log(error);
   }
}
  async function handleVerifyCode() {
   try{
    const response = await axios.post("https://aiengage.xircular.io/api/v1/customer/forgotpassword", {email:email})
    console.log(response.data)
   }
   catch(error){
    console.log(error);
   }
}
  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={containerRef}>
        <img src={pass} alt="" className={styles.logo} />
        <label className={styles.primaryText}>Verify Code</label>
        <label className={styles.secondaryText}>
          {" "}
          Please enter the code received on your email
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
        <div className="signUpSection">
                <span>Didn’t receive OTP</span>
                <span onClick={""} className="linkSpan">Resend OTP</span>
              </div>
        <button disabled={otp ? false : true} className={styles.sendBtn}
onClick={handleSendCode}        >
          Verify code
        </button>
      </div>
    </div>
  );
}

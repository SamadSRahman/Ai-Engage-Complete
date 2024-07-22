import React, { useEffect, useRef, useState } from "react";
import styles from "./forgetPassword.module.css";
import mail from "../../images/mail.svg";
import pass from "../../images/password.svg";
import axios from "axios";

export default function ForgetPassword({ onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const containerRef = useRef(null);
  const [isLinkSent, setIsLinkSent] = useState(false)

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
    try {
      const response = await axios.post(
        "https://stream.xircular.io/api/v1/customer/forgotpassword",
        { email: email }
      );
      console.log(response.data);
      localStorage.setItem("email", email);
      localStorage.setItem("customerId", response.data.customerId);
      alert(response.data.message);
      setIsLinkSent(true)
      // onSuccess();
      // onClose()
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={containerRef}>
        <img src={pass} alt="" className={styles.logo} />
        <label className={styles.primaryText}>Forgot Password</label>
     {isLinkSent? (
      <label>
        We have a sent a reset password link to your email.
      </label>
     ):(<div>
      <label className={styles.secondaryText}>
         
          Please enter your email to receive reset password link
        </label>
        <div id={styles.inputWrapper} className="inputWrapper">
          <img src={mail} alt="" />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
          />
        </div>
        <button
          disabled={email ? false : true}
          className={styles.sendBtn}
          onClick={handleSendCode}
        >  Send code</button>
     </div>)  }
        
      
      </div>
    </div>
  );
}

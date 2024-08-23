import React, { useEffect, useRef } from "react";
import styles from "./otpVerifier.module.css";

function OTPVerifier({ otpValues, setOtpValues }) {
  const otpRefs = useRef([]);

  // Function to handle input change and focus shifting
  const handleInput = (index, value) => {
    // Update the OTP value at the specified index
    const updatedValues = [...otpValues];
    updatedValues[index] = value;
    setOtpValues(updatedValues);

    // If the value is not empty and the nextRef exists, focus on it
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  // Function to handle key down event for backspace navigation
  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && index > 0 && !otpValues[index]) {
      otpRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    console.log(otpValues);
  }, [otpValues]);

  return (
    <div className={styles.inputContainer}>
      {otpValues.map((value, index) => (
        <input
          key={index}
          type="text"
          placeholder="_"
          maxLength="1"
          ref={(el) => (otpRefs.current[index] = el)}
          value={value}
          onChange={(e) => handleInput(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </div>
  );
}

export default OTPVerifier;

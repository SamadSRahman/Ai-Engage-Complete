import { Builder } from "@builder.io/react";
import React, { useEffect, useRef, useState } from "react";
import styles from "./otpVerifier.module.css";
import { otpValuesAtom } from "../../Recoil/store";
import { useRecoilState } from "recoil";


function OTPVerifier() {
  // Use state to store the OTP values
  const [otpValues, setOtpValues] = useRecoilState(otpValuesAtom);

  // Use useRef to create refs for each input field
  const otp1Ref = useRef(null);
  const otp2Ref = useRef(null);
  const otp3Ref = useRef(null);
  const otp4Ref = useRef(null);
  const otp5Ref = useRef(null);
  const otp6Ref = useRef(null);

  // Function to handle input change and focus shifting
  const handleInput = (index, value) => {
    // Update the OTP value at the specified index
    const updatedValues = [...otpValues];
    updatedValues[index] = value;
    setOtpValues(updatedValues);

    // If the value is not empty and the nextRef exists, focus on it
    if (value && index < 5) {
      const nextRef = index === 4 ? otp6Ref : index === 3 ? otp5Ref : index === 2 ? otp4Ref : index === 1 ? otp3Ref : otp2Ref;
      nextRef.current.focus();
    }
  };
useEffect(()=>{
console.log(otpValues)
},[otpValues])
  return (
    <div className={styles.inputContainer}>
      {otpValues.map((value, index) => (
        <input
          key={index}
          type="number"
          placeholder="_"
          maxLength="1"
          ref={index === 0 ? otp1Ref : index === 1 ? otp2Ref : index === 2 ? otp3Ref : index === 3 ? otp4Ref : index === 4 ? otp5Ref : otp6Ref}
          value={value}
          onChange={(e) => handleInput(index, e.target.value)}
        />
      ))}
    </div>
  );
}

export default OTPVerifier;
Builder.registerComponent(OTPVerifier, {
  name: "OTP field",
  noWrap: true,
});

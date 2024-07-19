import React, { useState } from "react";
import "react-phone-number-input/style.css";
import "./SignUp.css";
import axios from "axios";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useNavigate } from "react-router-dom";
import logo from "../../images/AIENGAGE 2.svg";
import video from "../../images/Group.svg";
import logic from "../../images/Group (1).svg";
import insight from "../../images/Vector (1).svg";
import mail from "../../images/mail.svg";
import pass from "../../images/lock.svg";
import visibilityOff from "../../images/visibility_off (1).svg";
import visibilityOn from "../../images/visibility (1).svg";
import wave from "../../images/Microsoft-Fluentui-Emoji-3d-Waving-Hand-3d-Default 1.svg";
import VerifyEmail from "../dailogs/VerifyEmail";

const SignUp = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [error, setError] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [emailerr, setEmailerr] = useState("");
  const [PasswordErr, setPasswordErr] = useState("");
  const navigate = useNavigate();
  const [isVerifyEmailVisible, setIsVerifyEmailVisible] = useState(false);

  const handlePhoneChange = (value) => {
    try {
      setPhone(value);
      if (!isValidPhoneNumber(value)) {
        setPhoneErr("Invalid phone number");
      } else {
        setPhoneErr("");
      }
    } catch (error) {
      console.error("Error in handlePhoneChange:", error);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPhoneErr("");
    setEmailerr("");
    setPasswordErr("");

    if (!isValidPhoneNumber(phone)) {
      setPhoneErr("Invalid phone number");
      return;
    }

    if (!validateEmail(email)) {
      setEmailerr("Invalid email address");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordErr(
        "Password should be strong with one number, one letter, one special character and between 8 to 15 characters"
      );
      return;
    }

    const item = { phone, email, password };
    const headerObject = {
      "Content-Type": "application/json",
      Accept: "*/*",
    };
    const SignUpApi = "https://stream.xircular.io/api/v1/customer/signup";

    axios
      .post(SignUpApi, item, { headers: headerObject })
      .then((res) => {
        console.log("signupai res", res);
        console.log("successmsg", res.data.message);
        alert("Please verify your email to continue")
        verifyEmail()
        setIsVerifyEmailVisible(true)
        // navigate("/SignIn");
      })
      .catch((err) => {
        console.log("errors", err);
        if (err.response && err.response.data) {
          if (err.response.data?.message) {
            setEmailerr(err.response.data.message);
          }
          else if (err.response.data?.errors){
            setEmailerr(err.response.data?.errors[0]?.msg)
        }
          else {
            // setError(" ");
            setPhoneErr(" ");
            setEmailerr(" ");
            setPasswordErr("");
          }
        }
     
      });
  };
  function verifyEmail(){
    localStorage.setItem('email', email)
    const headerObject = {
      "Content-Type": "application/json",
      Accept: "*/*",
    };
    axios.post("https://stream.xircular.io/api/v1/customer/sendOtp", {email:email},{headers: headerObject})
    .then((response)=>{
      console.log(response.data)
      setIsVerifyEmailVisible(true)
      
    })
    .catch((error)=>{
      console.log(error)
    })
  }

  const handleLogin = () => {
    navigate("/SignIn");
  };

  return (
    <div className="signInContainer">
      {isVerifyEmailVisible && (
        <VerifyEmail onClose={() => setIsVerifyEmailVisible(false)} />
      )}
      <div className="leftSection">
        <img className="logoIcon" src={logo} alt="" />

        <div className="mapSection">
          <div className="mapSectionCard">
            <img src={video} alt="" />
            <label htmlFor="">Interactive Video</label>
          </div>
          <div className="mapSectionCard">
            <img src={logic} alt="" />
            <label htmlFor="">Branching Logic</label>
          </div>
          <div className="mapSectionCard">
            <img src={insight} alt="" />
            <label htmlFor="">AI-Powered Insights</label>
          </div>
        </div>
      </div>
      <div className="rightSection">
        <div className="loginBox">
        <img className="loginBoxLogo" src={logo} alt="" />
          <div className="heading">
            <label className="welcomeText">Hi, Welcome</label>
            <img src={wave} alt="" />
          </div>
          <label className="boxHeaderText">Sign up</label>
          <div className="inputSection">
            <div>
              <PhoneInput
                value={phone}
                onChange={handlePhoneChange}
                defaultCountry="IN"
                placeholder="Phone"
              />
              {phoneErr && (
                <p
                  style={{
                    color: "red",
                    fontSize: "12px",
                    fontFamily: "Inter",
                    marginBottom: "0px",
                  }}
                >
                  {phoneErr}
                </p>
              )}
            </div>
            <div className="inputWrapper">
              <img src={mail} alt="" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
              />
            </div>
            <span className="errorText">{emailerr}</span>
            <div className="inputWrapper">
              <img src={pass} alt="" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
              />
              <img
                onClick={() => setShowPassword(!showPassword)}
                src={showPassword ? visibilityOn : visibilityOff}
                alt=""
              />
            </div>
            <span className="errorText">{PasswordErr}</span>

            <div className="bottomSection">
              <button onClick={handleSubmit}>Sign up</button>
              {/* <div className="signUpSection">
              <span>By creating an account you agree with our Terms of service & Privacy policy</span>
              <span onClick={handleLogin} className="termsSpan">Terms of service & Privacy policy</span>
            </div> */}
              <div className="signUpSection">
                <span>Don’t have an account please</span>
                <span onClick={handleLogin} className="linkSpan">
                  Log in
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

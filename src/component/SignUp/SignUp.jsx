import React, { useState } from "react";
import "react-phone-number-input/style.css";
import "./SignUp.css";
import axios from "axios";
import PhoneInput, { isValidPhoneNumber, isPossiblePhoneNumber , parsePhoneNumber} from "react-phone-number-input";
import { useNavigate } from "react-router-dom";
import logo from "../../images/AIENGAGE 2.svg";
import video from "../../images/Group.svg";
import leftArrow from "../../images/Arrow 1.svg";
import rightArrow from "../../images/Arrow 2.svg";
import logic from "../../images/Group (1).svg";
import insight from "../../images/Vector (1).svg";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
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
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [phoneErr, setPhoneErr] = useState("");
  const [error, setError] = useState("");
  const [emailerr, setEmailerr] = useState("");
  const [PasswordErr, setPasswordErr] = useState("");
  const navigate = useNavigate();
  const [isVerifyEmailVisible, setIsVerifyEmailVisible] = useState(false);

  function handleChange(field, e) {
    setError("");
    if (field === "name") {
      setName(e.target.value);
    }
    if (field === "phone") {
      setPhone(e);
    }
    if (field === "email") {
      setEmail(e.target.value);
    }
    if (field === "pass") {
      setPassword(e.target.value);
    }
  }
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/;
    return passwordRegex.test(password);
  };
  const nameRegex = /^[A-Za-z][A-Za-z\s'-]{2,29}$/;
  const validateName = (name) => {
    return nameRegex.test(name);
  };

  function validateIndianPhoneNumber(phoneNumber) {
    // Regex pattern for Indian phone numbers with optional country code
    const indianPhoneNumberPattern = /^(\+91[-\s]?)?[6-9]\d{9}$/;
  
    // Test the phone number against the regex pattern
    return indianPhoneNumberPattern.test(phoneNumber);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!accepted) {
      alert("Please accept the terms and conditions to continue");
      return;
    }

    setPhoneErr("");
    setEmailerr("");
    setPasswordErr("");

    if (!phone && !email && !password) {
      setEmailerr("This field is required");
      setPhoneErr("This field is required");
      setPasswordErr("This field is required");
      setError("This field is required");
      return;
    }
    if (!phone) {
      setPhoneErr("Field cannot be empty");
      setError("Field cannot be empty");
      return;
    }
    if (!email) {
      setEmailerr("Field cannot be empty");
      setError("Field cannot be empty");
      return;
    }
    if (!password) {
      setPasswordErr("Field cannot be empty");
      setError("Field cannot be empty");
      return;
    }
    // if (!validateName(name)) {
    //   setNameError(
    //     "Please enter a valid name. The name should start with a letter, can include spaces, hyphens, or apostrophes, and must be between 3 to 30 characters long."
    //   );
    //   setError(
    //     "Please enter a valid name. The name should start with a letter, can include spaces, hyphens, or apostrophes, and must be between 3 to 30 characters long."
    //   );
    //   return;
    // }
    // const number = parsePhoneNumberFromString(phone)
    // console.log("number", number)
    const num = parsePhoneNumber(phone)
    console.log(num)
    if (!isValidPhoneNumber(phone)||!isPossiblePhoneNumber(phone)) {
      setPhoneErr("Invalid phone number");
      setError("Invalid phone number");
      return;
    }
    else if(num.countryCallingCode==="91"){
      if(!validateIndianPhoneNumber(num.nationalNumber)){
        setError("Invalid phone number")
        return;
      }
    }
  
    // else if(number[0]!==9||number[0]!==8||number[0]!==7||number[0]!==6){
    //   setPhoneErr("Invalid phone number");
    //   setError("Invalid phone number"); 
    // }

    // if (!validateEmail(email)) {
    //   setEmailerr("Invalid email address");
    //   setError("Invalid email address");
    //   return;
    // }

    // if (!validatePassword(password)) {
    //   setPasswordErr(
    //     "Password should be strong with one number, one letter, one special character and between 8 to 15 characters"
    //   );
    //   setError(
    //     "Password should be strong with one number, one letter, one special character and between 8 to 15 characters"
    //   );
    //   return;
    // }

    const item = { phone, email, password, name };
    const headerObject = {
      "Content-Type": "application/json",
    };
    const SignUpApi = "https://stream.xircular.io/api/v1/customer/signup";

    axios
      .post(SignUpApi, item, { headers: headerObject })
      .then((res) => {
        console.log("signupai res", res);
        console.log("successmsg", res.data.message);
        alert("Please verify your email to continue");
        verifyEmail();
        setIsVerifyEmailVisible(true);
        // navigate("/SignIn");
      })
      .catch((err) => {
        console.log("errors", err);
        if (err.response && err.response.data) {
          setError(err.response.data?.message);
          if (err.response.data?.message.toLowerCase()?.includes("phone")) {
            setPhoneErr(err.response.data.message);
          } else if (err.response.data?.message.toLowerCase()?.includes("name")) {
            setNameError(err.response.data.message);
          }
          
          else if (err.response.data?.message?.includes("Email")||err.response.data?.message?.includes("email")) {
            setEmailerr(err.response.data.message);
          } else if (err.response.data?.message?.includes("Password")) {
            setPasswordErr(err.response.data.message);
          } else if (
            err.response?.data?.errors[0]?.path === "phone" ||
            err.response.data?.errors[0]?.msg.includes("number")
          ) {
            setPhoneErr(err.response.data?.errors[0]?.msg);
          } else if (
            err.response.data?.errors[0]?.path === "email" ||
            err.response.data?.errors[0]?.msg.includes("email")
          ) {
            setEmailerr(err.response.data?.errors[0]?.msg);
          } else {
            // setError(" ");
            setPhoneErr(" ");
            setEmailerr(" ");
            setPasswordErr("");
          }
        }
      });
  };
  function verifyEmail() {
    localStorage.setItem("email", email);
    const headerObject = {
      "Content-Type": "application/json",
      Accept: "*/*",
    };
    axios
      .post(
        "https://stream.xircular.io/api/v1/customer/sendOtp",
        { email: email },
        { headers: headerObject }
      )
      .then((response) => {
        console.log(response.data);
        setIsVerifyEmailVisible(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleLogin = () => {
    navigate("/SignIn");
  };

  return (
    <div className="signInContainer">
      {error && <div className="snackbar-error">{error}</div>}
      {isVerifyEmailVisible && (
        <VerifyEmail onClose={() => setIsVerifyEmailVisible(false)} />
      )}
      <div className="leftSection">
        <img className="logoIcon" src={logo} alt="" />
        <div className="mapSection">
          <div className="mapSectionCard">
            <img src={video} alt="Interactive Video" />
            <label>Interactive Video</label>
            <img className="leftArrow" src={leftArrow} alt="" />
          </div>
          <div className="mapSectionCard">
            <img src={logic} alt="Branching Logic" />
            <label>Branching Logic</label>
            <img className="rightArrow" src={rightArrow} alt="" />
          </div>
          <div className="mapSectionCard">
            <img src={insight} alt="AI-Powered Insights" />
            <label>AI-Powered Insights</label>
            <div className="arrow left-arrow"></div>
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
          <form onSubmit={handleSubmit}>
            <div className="inputSection">
              <div>
                <PhoneInput
                  value={phone}
                  onChange={(e) => handleChange("phone", e)}
                  defaultCountry="IN"
                  placeholder="Phone"
                  // style={
                  //   phoneErr
                  //     ? {
                  //         borderRadius: "7px",
                  //         boxShadow: "1px 1px 4px rgba(255, 0, 0, 0.379)",
                  //       }
                  //     : {}
                  // }
                />
                {/* {phoneErr && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "15px",
                      fontFamily: "Inter",
                      marginBottom: "0px",
                    }}
                  >
                    {phoneErr}
                  </p>
                )} */}
              </div>
              <div
                className="inputWrapper"
                // style={
                //   nameError
                //     ? {
                //         borderRadius: "7px",
                //         boxShadow: "1px 1px 4px rgba(255, 0, 0, 0.379)",
                //       }
                //     : {}
                // }
              >
                <PersonOutlineOutlinedIcon
                  sx={{ color: "#1c1b1fd6", fontWeight: "normal" }}
                />
                <input
                  value={name}
                  onChange={(e) => handleChange("name", e)}
                  type="name"
                  placeholder="Name"
                  name="name"
                />
              </div>
              <div
                className="inputWrapper"
                // style={
                //   emailerr
                //     ? {
                //         borderRadius: "7px",
                //         boxShadow: "0.2px 0.2px 4px crimson",
                //       }
                //     : {}
                // }
              >
                <img src={mail} alt="" />
                <input
                  value={email}
                  onChange={(e) => handleChange("email", e)}
                  type="email"
                  placeholder="Email"
                />
              </div>
              {emailerr && <span className="errorText">{emailerr}</span>}
              <div
                className="inputWrapper"
                // style={
                //   PasswordErr
                //     ? {
                //         borderRadius: "7px",
                //         boxShadow: "1px 1px 8px rgba(255, 0, 0, 0.5)",
                //       }
                //     : {}
                // }
              >
                <img src={pass} alt="" />
                <input
                  value={password}
                  onChange={(e) => handleChange("pass", e)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                />
                <img
                  onClick={() => setShowPassword(!showPassword)}
                  src={showPassword ? visibilityOff : visibilityOn}
                  alt=""
                />
              </div>
              <span className="errorText">{PasswordErr}</span>

              <div className="bottomSection">
                <button onClick={handleSubmit}>Sign up</button>
                <div className="termsSection">
                  <input
                    type="checkbox"
                    value={accepted}
                    onChange={() => setAccepted(!accepted)}
                  />
                  <span>
                    By creating an account you agree with our{" "}
                    <span
                      onClick={() => navigate("/termsAndConditions")}
                      className="termsSpan"
                    >
                      Terms of service & Privacy policy
                    </span>
                  </span>
                </div>
                <div className="signUpSection">
                  <span>Already have an account?</span>
                  <span onClick={handleLogin} className="linkSpan">
                    Log in
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

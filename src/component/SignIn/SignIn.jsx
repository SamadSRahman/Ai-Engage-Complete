import React, { useState } from "react";
import "./SignIn.css";
import axios from "axios";
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
import ForgetPassword from "../dailogs/ForgetPassword";
import VerifyOtp from "../dailogs/VerifyOTP";
import ResetPassword from "../dailogs/ResetPassword";
import VerifyEmail from "../dailogs/VerifyEmail";

const SignIn = ({ setIsAuthenticated }) => {
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailerr, setEmailerr] = useState("");
  const [PasswordErr, setPasswordErr] = useState("");
  const [isForgetPasswordVisible, setIsForgetPasswordVisible] = useState(false)
  const [isVerifyOtpVisible, setIsVerifyOtpVisible] = useState(false)
  const [isVerifyEmailVisible, setIsVerifyEmailVisible] = useState(false)
  const navigate = useNavigate();



  function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
      setEmailerr("*Email cannot be empty"); // Frontend error for empty username
      return;
    } else {
      setEmailerr(""); // Clear the frontend error when the username is not empty
    }

    if (!password.trim()) {
      setPasswordErr("*Password cannot be empty"); // Frontend error for empty username
      return;
    } else {
      setPasswordErr(""); // Clear the frontend error when the username is not empty
    }

    const details = {
      email: email,
      password: password,
    };

    const headerObject = {
      "Content-Type": "application/json",
      Accept: "*/*",
    };

    axios
      .post("https://stream.xircular.io/api/v1/customer/signin", details, {
        headers: headerObject,
      })
      .then((res) => {
        console.log("data", res.data);
        // Store the access token
        const userId = res.data.id;
        const userName = res.data.email;
        const accessToken = res.data.token;
        console.log("accesstoken", accessToken);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", userName);

        // window.alert("success");

        setIsAuthenticated(true);

        navigate("/home"); // Use navigate
      })
      .catch((err) => {
        console.log("siginerror", err.response.data.message);
        if (err.response.data.message === "Customer not found.") {
          setEmailerr(err.response.data.message);
        } else if (err.response.data.message === "Invalid password.") {
          setPasswordErr(err.response.data.message);
        } 
        else if(err.response.data.message === "Email not verified"){
          verifyEmail()
        }
        else      
        {
          // Handle other types of errors or set a generic error message
          setEmailerr("");
          setPasswordErr("");
        }
      });
  }
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

  const handlleSignup = () => {
    navigate("/SignUp");
  };

  // const handlePassword = () =>{
  //   navigate('/forgotpassword')
  // }

  return (
    <div className="signInContainer">
     {isForgetPasswordVisible && (
       
          <ResetPassword onClose={()=>setIsForgetPasswordVisible(false)} onSuccess={()=>setIsVerifyOtpVisible(true)} />
       
      )}
      {
isVerifyOtpVisible && <VerifyOtp onClose={()=>setIsVerifyOtpVisible(false)} />

      }
      {isVerifyEmailVisible && <VerifyEmail  onClose={()=>setIsVerifyEmailVisible(false)} />}
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
            <img  src={wave} alt="" />
          </div>
          <label className="boxHeaderText">Log in</label>
          <div className="inputSection">
            <div className="inputWrapper">
              <img src={mail} alt="" />
              <input
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
              />
            </div>
            <span className="errorText"            >
              {emailerr}
            </span>
            <div className="inputWrapper">
              <img src={pass} alt="" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword?"text":"password"}
                placeholder="Password"
              />
              <img onClick={()=>setShowPassword(!showPassword)} src={showPassword?visibilityOn:visibilityOff} alt="" />
            </div>
            <span className="errorText"            >
              {PasswordErr}
            </span>
            <label onClick={()=>setIsForgetPasswordVisible(true)} className="forgotPasswordLabel">Forgot Password</label>

            <div className="bottomSection">
              <button onClick={handleSubmit}>Log in</button>
              <div className="signUpSection">
                <span>Don’t have an account please</span>
                <span onClick={handlleSignup} className="linkSpan">Sign up</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

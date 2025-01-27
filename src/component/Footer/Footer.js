import React from "react";
import "./footer.css";
import aiengagelogo from "../navbar/aiengagelogo.png";
import { ReactComponent as Facebookicon } from "./Facebookicon.svg";
import { ReactComponent as Instagramicon } from "./Instagramicon.svg";
import { ReactComponent as LinkedIn } from "./LinkedIn.svg";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="footer container">
      <div className="footerwrapper">
        <div className="footerlogowrapper">
          <img src={aiengagelogo} alt="Ai Engage footer logo" />

          <h5 id="footertext">
            {" "}
            Revolutionize your Surveys with Interactive Video Campaigns and AI.{" "}
          </h5>
        </div>

        <div className="footerlinkswrapper">
          {/* <p className="footerlinks" onClick={()=>navigate("/contactUs")}> Contact Us </p> */}
          <p className="footerlinks" onClick={()=>navigate("/termsAndConditions")}> Terms & Conditions </p>
          <p className="footerlinks" onClick={()=>navigate("/privacyPolicy")}> Privacy Policy </p>
          <p className="footerlinks" onClick={()=>navigate("/refundPolicy")}> Refund Policy </p>
        </div>

        <div className="footersocilamediawrapper">
          <Facebookicon />
          <Instagramicon />
          <LinkedIn />
        </div>
      </div>
    </div>
  );
};

export default Footer;

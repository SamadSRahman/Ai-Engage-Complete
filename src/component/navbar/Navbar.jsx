import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./aiengagelogo.png";

const Navbar = () => {
  const navigate = useNavigate();
  // Retrieve accessToken from localStorage
  const accessToken = localStorage.getItem("accessToken");
  console.log("Acesss Token:", accessToken);
  const userName = localStorage.getItem("userName");
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [isTrialActive, setIsTrialActive] = useState(null);

  useEffect(() => {
    // Fetch user subscription information only if accessToken is available
    if (accessToken) {
      axios
        .get(
          "https://stream.xircular.io/api/v1/subscription/getCustomerSubscription",
          {
            headers: {
              authorization: accessToken,
            },
          }
        )
        .then((response) => {
          const user = response.data[0]; // Adjust based on the actual response structure
          console.log(user);
          setIsSubscribed(user.isSubscribed);
          setIsTrialActive(user.isTrialActive);
        })
        .catch((error) => {
          console.error("Error fetching user subscription data", error);
        });
    }
  }, [accessToken]);

  function handlelogout() {
    localStorage.clear();
    window.location.href = "";
  }
  return (
    <div className="navbar">
      <div className="logowrapper">
        <img src={logo} alt="Online video survey maker" />
      </div>

      {/* Render the "Sign in" button if accessToken does not exist */}
      {!accessToken && (
        <button className="" onClick={() => navigate("/SignIn")}>
          Sign in
        </button>
      )}

      {/* Render the userName if it exists */}
      {accessToken && (
        <div className="userName">
          {/*   <p>  Hi,{Name}   </p> */}
          {/* <button
            className='gotodashboard' 
            onClick={() => window.location.href = `https://new-video-editor.vercel.app/listings?accessToken=${accessToken}`}
            disabled={isSubscribed === false && isTrialActive === false}
            > Go to Dashboard </button>   */}

          <button className="logoutbtn" onClick={handlelogout}>
            {" "}
            Logout{" "}
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;

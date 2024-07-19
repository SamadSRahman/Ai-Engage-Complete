import axios from 'axios';
import React from 'react';
import { useNavigate } from "react-router-dom";

const PayButton = ({ planPrice, features, frequency, planName, description , isPlanAlreadyPurchased }) => {
  const navigate = useNavigate();

  const handlePurchase = () => {
    // Log the data when the button is clicked
    console.log("Plan Price:", planPrice);
    console.log("Features:", features);
    console.log("frequency:", frequency);
    console.log("Plan Name:", planName);
    console.log("Description:", description);
    console.log("isPlanAlreadyPurchased:", isPlanAlreadyPurchased);

    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');


    if (!accessToken || !userId) {
      // If either accessToken or userId is not available, redirect to SignIn
      navigate("/SignIn");
      return; // Exit function to prevent further execution
    }

    // Both accessToken and userId are available, proceed with creating checkout session
    axios.post("https://stream.xircular.io/api/v1/stripe/create-checkout-session", {
          planPrice,
          features,
          frequency,
          planName,
          description,
          userId: userId,
          userName: userName,
          accessToken:accessToken
       })
      .then((res) => {
        if (res.data.url) {
          // Redirect to the checkout URL returned by the server
          window.location.href = res.data.url;
        }
      })
      .catch((err) => console.log(err.message));
  };

  return (
       <div className='subcrpbtnwrapper'>
          <button 
              className="subscribebtn" 
              onClick={handlePurchase}
              disabled={isPlanAlreadyPurchased}
              >
              Subscribe
          </button>
       </div>
  );
};

export default PayButton;

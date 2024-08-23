import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { cashfree, convertUsdToInr } from "./utils";

// // Define the getCookie function here
// const getCookie = (name) => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
// };

const PayButton = ({
  planPrice,
  features,
  frequency,
  planName,
  description,
  isPlanAlreadyPurchased,
}) => {
  console.log(planPrice)
  const [loading, setLoading] = useState(false);
  const [amountInInr, setAmountInInr] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    const convertCurrency = async () => {
      const convertedAmount = await convertUsdToInr(planPrice);
      setAmountInInr(convertedAmount);
    };

    convertCurrency();
  }, [planPrice]);

  const getUserDetails = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error("User ID not found in localStorage");
    }
    try {
      const response = await axios.get(
        `https://stream.xircular.io/api/v1/customer/getUser/${userId}`,
        {
          headers: {
            Cookie: "lng=en",
          },
          withCredentials:true
        }
      );
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error getting user details:", error);
      throw error;
    }
  };

  const createOrder = async () => {
    try {
      const response = await axios.post(
        "https://stream.xircular.io/api/v1/order/createOrder",
        {
          userId: localStorage.getItem("userId"),
          subscription: {
            planName,
            frequency,
            features,
            userId: localStorage.getItem("userId"),
          },
        },{withCredentials:true}
      );
      return response.data.data.id;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const cashfreeOrder = async (orderId, phone,name) => {
    try {
      const response = await axios.post(
        "https://stream.xircular.io/api/v1/cashfree/create-checkout-session",
        {
          orderId,
          userName: localStorage.getItem("userName"),
          phone,
          name,
          userId: localStorage.getItem("userId"),
          planPrice:Math.round(amountInInr),
        },
        {withCredentials:true}
      );
      console.log(planPrice);
      
      return response.data.data;
    } catch (error) {
      console.error("Error creating Cashfree session:", error);
      throw error;
    }
  };

  const handlePurchase = async () => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken || !userId) {
      navigate("/SignIn");
      return;
    }

    setLoading(true);
    try {
      // Get user details including phone number
      const userDetails = await getUserDetails();
      const phone = userDetails.phone;
      const name=userDetails.name;
      console.log(name,phone);
      //

      const orderId = await createOrder();
      const sessionId = await cashfreeOrder(orderId, phone,name);

      let checkoutOptions = {
        paymentSessionId: sessionId,
        returnUrl:
          "https://stream.xircular.io/api/v1/cashfree/getStatus/{order_id}"
      };
      cashfree.checkout(checkoutOptions).then(function (result) {
        if (result.error) {
          alert(result.error);
        }
        if (result.redirect) {
          console.log("redirection");
          console.log(result);
        }
      });
    } catch (error) {
      console.error("Error during purchase process:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const accessToken = getCookie('accessToken');
  //   if (accessToken) {
  //     localStorage.setItem('accessToken', accessToken);
  //   }
  // }, []);

  return (
    <div className="subcrpbtnwrapper">
      <button
        className="subscribebtn"
        onClick={handlePurchase}
        disabled={isPlanAlreadyPurchased || loading}
      >
        {loading ? "Processing..." : "Subscribe"}
      </button>
    </div>
  );
};

export default PayButton;

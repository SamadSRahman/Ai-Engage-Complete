import React, { useState, useEffect, lazy, Suspense, useRef } from "react";
import "./Pricing.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

let cookies = document.cookie;
console.log(cookies);
const PayButton = lazy(() => import("../payment/PayButton"));



const renderLoader = () => <p>Loading</p>;

export default function Pricing() {
  const [selectedTab, setSelectedTab] = useState("monthly");
  const [subscriptiondata, setSubscriptiondata] = useState([]);
  const [userplandata, setUserplanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  const pricingRef = useRef()

  const {field} = useParams()

  // useEffect(() => {
  //   if (field === "plans") {
  //     window.scroll(0, 11000)
  //     if(pricingRef.current){
  //       console.log("useEffect triggered");
        
  //       // pricingRef.current.scrollIntoView({ behavior: 'smooth' });
  //     }
  //   }
  // }, [field, pricingRef]);


  const navigate = useNavigate();
  /* Api call for fetching subscription plans */
  useEffect(() => {
    const fetchsubscriptiondata = async () => {
      try {
        const requesturl = `https://stream.xircular.io/api/v1/subscription_plan/getByFrequency?frequency=${selectedTab}`;
        const response = await axios.get(requesturl);

        console.log("All Subscriptiondata Response", response.data);
        setSubscriptiondata(response.data.subscriptionPlans);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
        console.error("Error fetching data:", error);
      }
    };

    fetchsubscriptiondata();
  }, [selectedTab]);

  /* Api call for fetching user subscription plans */
  useEffect(() => {
    const fetchUserSubscriptionPlan = async () => {
      if (!accessToken) {
        // navigate('/signin');
        return;
      }

      try {
        const response = await axios.get(
          "https://stream.xircular.io/api/v1/subscription/getCustomerSubscription",
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // Ensures cookies are sent
          }
        );
        setUserplanData(response.data[0].subscriptions);
        console.log("User Subscription plan:", response.data[0].subscriptions);
      } catch (error) {
        console.error("Error fetching data:", error);

        if (error) {
          // Handle other types of errors
          setError(
            error.message ||
              "An error occurred while fetching user subscription data."
          );
        }
      }
    };

    fetchUserSubscriptionPlan();
  }, [accessToken, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // if (error) {
  //   return <div>Error fetching data: {error}</div>;
  // }
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const getPriceLabel = (plan) => {
    switch (selectedTab) {
      case "monthly":
        return "month";
      case "annually":
        return "year";
      case "half-yearly":
        return "half year";
      case "quarterly":
        return "quarter";
      default:
        return "";
    }
  };

  return (
    <div ref={pricingRef} className="pricingcnt container section">
      <div className="pricingcntwrapper">
        <div className="pricing-heading">
          <h2 id="pricingtitle"> Pricing </h2>
          <p id="pricingdesc">
            {" "}
            Find the ideal pricing plan to suit your needs with our flexible
            options and our dedicated supported{" "}
          </p>
        </div>

        <div className="plan-type">
          <div className="planswrapper">
            <div
              className={`tab ${selectedTab === "monthly" ? "active" : ""}`}
              onClick={() => handleTabClick("monthly")}
            >
              Monthly
            </div>
            <div
              className={`tab ${selectedTab === "quarterly" ? "active" : ""}`}
              onClick={() => handleTabClick("quarterly")}
            >
              Quarterly
            </div>
            <div
              className={`tab ${selectedTab === "half-yearly" ? "active" : ""}`}
              onClick={() => handleTabClick("half-yearly")}
            >
              Half-Yearly
            </div>
            <div
              className={`tab ${selectedTab === "annually" ? "active" : ""}`}
              onClick={() => handleTabClick("annually")}
            >
              Annual
            </div>
          </div>
        </div>

        <div className="pricing-plans">
          {subscriptiondata
            .sort((a, b) => a.price - b.price)
            .map((plan) => {
              const isSubscribed = userplandata.some(
                (userPlan) =>
                  userPlan.plan === plan.product.name &&
                  userPlan.frequency === plan.frequency
              );

              return (
                <div
                  key={plan.id}
                  className="pricing-card"
                  style={{ background: isSubscribed ? "#d9d9d9" : "#fff" }}
                >
                  <h2 id="subcrpname">{plan.product.name}</h2>
                  <p id="subcrpprice">
                    <strong id="subpricestrong">
                      {"$"}
                      {plan.price}/
                    </strong>
                    {getPriceLabel(plan.frequency)}
                  </p>
                  <span id="subcrpdescp">{plan.product.description}</span>
                  <div className="featureswrapper">
                    <ul className="features">
                      <li className="feature-list">
                        Number of campaigns:{" "}
                        {plan.product.features["no.of campaign"]}
                      </li>
                      <li className="feature-list">
                        Video length: {plan.product.features["video length"]}{" "}
                        sec
                      </li>
                    </ul>
                  </div>
                  <Suspense fallback={renderLoader()}>
                    <PayButton
                      planPrice={plan.price}
                      features={plan.product.features}
                      planName={plan.product.name}
                      frequency={plan.frequency}
                      description={plan.product.description}
                      isPlanAlreadyPurchased={isSubscribed}
                    />
                  </Suspense>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

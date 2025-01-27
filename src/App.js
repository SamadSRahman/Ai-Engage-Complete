import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Pricing from "./component/pricing/Pricing";
import SignUp from "./component/SignUp/SignUp";
import SignIn from "./component/SignIn/SignIn";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
// import CheckoutForm from '';
import CheckoutSuccess from "./component/CheckoutSuccess";
import CheckoutFail from "./component/CheckoutFail";
import NotFound from "./component/NotFound";
import Home from "./Home";
import ListingPage from "./dashboard/pages/listingPage/ListingPage";
import Analytics from "./dashboard/pages/analytics/Analytics";

import Logout from "./component/Logout";
import CreateCampaign from "./dashboard/App";
import EditCampaign from "./dashboard/editingSection/Builder";
import TermsAndConditions from "./component/termsAndCondition/TermsAndCondition";
import PrivacyPolicy from "./component/PrivacyPolicy/PrivacyPolicy";
import RefundPolicy from "./component/refundPolicy/RefundPolicy";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Checking  authentication status over here, checking by looking at a token in local storage
    const userToken = localStorage.getItem("accessToken");
    if (userToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);
  return (
    <Router>
      {/* {clientSecret && ( */}
      {/* // <Elements stripe={stripePromise}> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plans" element={<Home />} />
        <Route path="/logoutRequest" element={<Logout />} />

        <Route path="/SignUp" element={<SignUp />} />
        <Route
          path="/SignIn/:popup?/:token?"
          element={<SignIn setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/termsAndConditions" element={<TermsAndConditions />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/refundPolicy" element={<RefundPolicy />} />
        <Route path="/checkoutSuccess" element={<CheckoutSuccess />} />
        <Route path="/checkoutFail" element={<CheckoutFail />} />
        <Route path="*" element={<NotFound />} />

        {/* Dashboard Routes */}
        <Route path="/listings" element={<ListingPage />} />
        <Route path="/createNew" element={<CreateCampaign />} />
        <Route path="/edit/:id" element={<EditCampaign />} />
        <Route path="/analytics/:id" element={<Analytics />} />
      </Routes>
      {/* // </Elements> */}
      {/* )} */}
    </Router>
  );
}

export default App;

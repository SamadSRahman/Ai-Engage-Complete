import React, { useEffect, useRef, useState } from "react";
import styles from "./admin.popup.module.css";
import { useRecoilState } from "recoil";
import { isPopupVisibleAtom } from "../../Recoil/store";
import CustomizationPopup from "../customizationPopup/CustomizationPopup";
import axios from "axios";
import { getLatestSubscriptionIndex } from "../../Utils/services";
import { useNavigate } from "react-router-dom";

export default function AdminPopup() {
  const navigate = useNavigate();
  const containerRef = useRef();
  const [isPopupVisible, setIsPopupVisible] =
    useRecoilState(isPopupVisibleAtom);
  const handleLogout = () => {
    localStorage.clear("accessToken");
    setIsPopupVisible(false);
    navigate("/SignIn");
  };
  const [adminDetails, setAdminDetails] = useState(null);
  const [isCustomizationPopupVisible, setIsCustomizationPopupVisible] =
    useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsPopupVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function onClose() {
    setIsCustomizationPopupVisible(false);
  }

  useEffect(() => {
    getSessionData();
  }, []);

  const getSessionData = async () => {
    const params = new URLSearchParams(window.location.search);
    const accessToken =
      params.get("accessToken") || localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        `https://stream.xircular.io/api/v1/subscription/getCustomerSubscription`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      const latestSubscriptionIndex = getLatestSubscriptionIndex(response.data);
      console.log(latestSubscriptionIndex);

      const adminObj = {
        email: response.data[0].email,
        phone: response.data[0].phone,
        name: response.data[0].name,
        isSubscribed: response.data[0].isSubscribed,
        isTrialActive: response.data[0].isTrialActive && response.data,
        endDate:
          response.data[0].subscriptions[latestSubscriptionIndex]?.endDate,
        startDate:
          response.data[0].subscriptions[latestSubscriptionIndex]?.startDate,
        plan: response.data[0].subscriptions[latestSubscriptionIndex]?.plan,
      };
      localStorage.setItem(
        "plans",
        JSON.stringify(response.data[0].subscriptions)
      );
      localStorage.setItem(
        "features",
        JSON.stringify(
          response.data[0].subscriptions[latestSubscriptionIndex]?.features
        )
      );
      localStorage.setItem("apiKey", response.data[0].api_key);
      if (response.data[0].isTrialActive) {
        adminObj.plan = "Free Trail";
        adminObj.endDate = new Date(
          response.data[0].trialEndDate
        ).toLocaleString();
        adminObj.startDate = new Date(
          response.data[0].trialStartDate
        ).toLocaleString();
        localStorage.setItem(
          "features",
          JSON.stringify(response.data[0].freeTrialFeature)
        );
      }
      setAdminDetails(adminObj);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div ref={containerRef}>
      <div
        className={styles.popupWrapper}
        onClick={() => setIsPopupVisible(!isPopupVisible)}
      >
        <span>{adminDetails ? adminDetails?.email[0].toUpperCase() : "A"}</span>
      </div>
      {isPopupVisible && (
        <div className={styles.popupContainer}>
          <div className={styles.upperSection}>
            <div className={styles.upperLeftSection}>
              <div className={styles.popupWrapper}>
                <span>
                  {adminDetails ? adminDetails?.email[0].toUpperCase() : "A"}
                </span>
              </div>
            </div>
            <div className={styles.upperRightSection}>
              <span>{adminDetails?.name}</span>
              <span>{adminDetails?.email}</span>
              <span>{adminDetails?.phone}</span>
            </div>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.planSection}>
            <div className={styles.planTag}>
              {adminDetails?.plan}{" "}
              {adminDetails?.plan.includes("trail" ? "" : "plan")}
            </div>
            <span>
              Currently your are running on {adminDetails?.plan}{" "}
              {adminDetails?.plan.includes("trail" ? "" : "plan")} <br /> Click
              here to{" "}
              <u
                onClick={() =>{
                  navigate("/plans")
                  setIsPopupVisible(false)
                }
                }
              >
                Upgrade
              </u>
            </span>
          </div>
          <div className={styles.btnDiv}>
            <button
              className={styles.customizeBtn}
              onClick={() => {
                setIsCustomizationPopupVisible(true);
                setIsPopupVisible(false);
              }}
            >
              Customize Response Platform
            </button>

            <button
              className={styles.logoutBtn}
              style={{ width: "40%", fontSize: "smaller" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
      {isCustomizationPopupVisible && <CustomizationPopup onClose={onClose} />}
    </div>
  );
}

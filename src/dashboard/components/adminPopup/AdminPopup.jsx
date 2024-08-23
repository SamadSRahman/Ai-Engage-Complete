import React, { useEffect, useState } from "react";
import styles from "./admin.popup.module.css";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isPopupVisibleAtom } from "../../Recoil/store";
import CustomizationPopup from "../customizationPopup/CustomizationPopup";
import axios from "axios";
import { getLatestSubscriptionIndex } from "../../Utils/services";

export default function AdminPopup() {
  const [isPopupVisible, setIsPopupVisible] =
    useRecoilState(isPopupVisibleAtom);
  const handleLogout = () => {
    localStorage.clear("accessToken");
    setIsPopupVisible(false);
    window.location.href =
      "https://aiengage.xircular.io/logoutRequest";
  };
  const [isSettingSectionVisible, setIsSettingsSectionVisible] =
    useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  // const adminDetails = JSON.parse(localStorage.getItem("adminDetails"));
  const [adminDetails, setAdminDetails] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [isCustomizationPopupVisible, setIsCustomizationPopupVisible] =
    useState(false);

  function onClose() {
    setIsCustomizationPopupVisible(false);
  }

  useEffect(() => {
    getSessionData()
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
        name:response.data[0].name,
        isSubscribed: response.data[0].isSubscribed,
        isTrialActive: response.data[0].isTrialActive,
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

  function handleChangePassword(event) {
    let token = localStorage.getItem("accessToken");
    event.preventDefault();
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must contain at least 8 characters, including one uppercase letter and one special character."
      );
      return;
    }
    if (currentPassword && confirmPassword && password) {
      fetch("https://videosurvey.xircular.io/api/v1/users/password/update", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          oldPassword: currentPassword,
          password: password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((errors) => console.log(errors));
    }
  }
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    return regex.test(password);
  };

  return (
    <div>
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
       {adminDetails?.plan} plan
          </div>
          <span>
          Currently your are running on {adminDetails?.plan} plan <br /> Click here to <u onClick={()=>window.location.href="https://aiengage.xircular.io"}>Upgrade</u>
          </span>
       </div>




          {/* <span className={styles.detailsHeader}>
            <strong>Email:</strong> <span>{adminDetails?.email}</span>
          </span>
          <span className={styles.detailsHeader}>
            <strong>Phone:</strong> <span>{adminDetails?.phone}</span>
          </span>
          <span className={styles.detailsHeader}>
            <strong>Plan:</strong> <span>{adminDetails?.plan}</span>
          </span>
          {adminDetails?.isSubscribed || adminDetails?.isTrialActive ? (
            <div className={styles.dateContainer}>
              <span className={styles.detailsHeader}>
                <strong>Start Date:</strong>{" "}
                <span>{adminDetails?.startDate}</span>
              </span>
              <span className={styles.detailsHeader}>
                <strong>End Date:</strong> <span>{adminDetails?.endDate}</span>
              </span>
            </div>
          ) : (
            <span>You currently don't have any active plans</span>
          )} */}
          <div className={styles.btnDiv}>
            {/* <button
              onClick={() =>
                setIsSettingsSectionVisible(!isSettingSectionVisible)
              }
              className={styles.settingsBtn}
            >
              Change Password
            </button> */}
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
          {isSettingSectionVisible && (
            <div className={styles.settingsSection}>
              <form onSubmit={handleChangePassword}>
                <label>Current password</label>
                <input
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type="password"
                  name=""
                  id=""
                />
                <label>New password</label>

                <input
                  value={password}
                  type="password"
                  name=""
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label>Confirm password</label>

                <input
                  value={confirmPassword}
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  name=""
                  id=""
                />
                {passwordError && (
                  <p className={styles.error}>{passwordError}</p>
                )}

                <button>Save</button>
              </form>
            </div>
          )}
        </div>
      )}
      {isCustomizationPopupVisible && <CustomizationPopup onClose={onClose} />}
    </div>
  );
}

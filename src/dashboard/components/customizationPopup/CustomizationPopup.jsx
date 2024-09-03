/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import styles from "./customizationPopup.module.css";
import { IoCloseSharp } from "react-icons/io5";
// import { MdDashboardCustomize } from "react-icons/md";
import axios from "axios";
import Spinner from "../spinner/Spinner";
import backup from '../../images/backup.svg'
import Alert from "../alert/Alert";

export default function CustomizationPopup({ onClose }) {
  const logoRef = useRef(null);
  const backgroundRef = useRef(null);
  const [logo, setLogo] = useState("");
  const [backgroundImg, setBackgroundImg] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brandDes, setBrandDes] = useState("");
  const [url, setUrl] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [bgFile, setBgFile] = useState(null);
  let accessToken = localStorage.getItem("accessToken");
  const [dataReceivedFromAPI, setDataReceivedFromAPI] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false)
  const [alertText, setAlertText] = useState("")

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://videosurvey.xircular.io/api/v1/users/app-branding",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.data) {
        setBrandName(response.data.data.brandName);
        setBrandDes(response.data.data.description);
        setUrl(response.data.data.url);
        setLogo(
          `https://videosurvey.xircular.io/admin/${response.data.data.logo}`
        );
        setBackgroundImg(
          `https://videosurvey.xircular.io/admin/${response.data.data.coverImage}`
        );
        setDataReceivedFromAPI(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  function handleLogoChange(event) {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
      setLogoFile(file);
    }
  }
  function handleBgChange(event) {
    const file = event.target.files[0];
    if (file) {
      setBackgroundImg(URL.createObjectURL(file));
      setBgFile(file);
    }
  }

  async function handleUpdate() {
    if (!brandName) {
      setAlertText("Please enter a valid name for your brand");
      setIsAlertVisible(true)
    } else if (!brandDes) {
      setAlertText("Please enter a valid description for your brand");
      setIsAlertVisible(true)
    } else {
      try {
        setIsLoading(true);
        let apiUrl =
          "https://videosurvey.xircular.io/api/v1/users/details/app-branding";
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        };
        const body = {
          brandName: brandName,
          description: brandDes,
          url: url,
        };
        const response = await axios.put(apiUrl, body, { headers });
        console.log(response.data);
        if (response.data.message === "Data Updated Successfully") {
          setAlertText(response.data.message);
          setIsAlertVisible(true)
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
      if (logoFile) {
        try {
          setIsLoading(true);
          let url =
            "https://videosurvey.xircular.io/api/v1/users/logo/app-branding";
          let formData = new FormData();
          formData.append("logo", logoFile);
          const headers = {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          };
          const response = await axios.patch(url, formData, { headers });
          console.log(response.data);
          setLogoFile(null);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      }
      if (bgFile) {
        try {
          setIsLoading(true);
          let url =
            "https://videosurvey.xircular.io/api/v1/users/coverImage/app-branding";
          let formData = new FormData();
          formData.append("coverImage", bgFile);
          const headers = {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          };
          const response = await axios.patch(url, formData, { headers });
          console.log(response.data);
          setBgFile(null);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      }
    }
  }
  async function handleSave() {
    if (!brandName) {
      setAlertText("Please enter a valid name for your brand");
      setIsAlertVisible(true)
    } else if (!brandDes) {
      setAlertText("Please enter a valid description for your brand");
      setIsAlertVisible(true)
    } else {
      try {
        setIsLoading(true);
        let url = "https://videosurvey.xircular.io/api/v1/users/app-branding";
        let formData = new FormData();
        formData.append("brandName", brandName);
        formData.append("description", brandDes);
        formData.append("logo", logoFile);
        formData.append("coverImage", bgFile);
        if (url) {
          isValidURL(url);
          formData.append("url", url);
        } else{ setAlertText("Please enter a valid URL");
          setIsAlertVisible(true)
        }
        const headers = {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`, 
        };
        const response = await axios.post(url, formData, { headers });
        console.log(response.data);
        if (response.data.message === "AppBranding Created Successully") {
          setIsLoading(false);
          setAlertText("Changes Saved");
          setIsAlertVisible(true)
        }
      } catch (error) {
        console.log(error);
        if (error.response.data.message) {
          setAlertText(error.response.data.message);
          setIsAlertVisible(true)
        }
        setIsLoading(false);
      }
    }
    function isValidURL(url) {
      const regex =
        /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*(\?[\w=&]*)?$/i;
      return regex.test(url);
    }
  }
  return (
    <div className={styles.wrapper}>
    {isAlertVisible && (<Alert
    title={"Alert"}
    text={alertText}
    primaryBtnText={"Okay"}
    onSuccess={()=>setIsAlertVisible(false)}
    onClose={()=>setIsAlertVisible(false)}
    />)}
      <div className={styles.container}>
        <div className={styles.header}>
          <span>Customize your Response Platform</span>
          <IoCloseSharp
            onClick={() => onClose()}
            className={styles.crossIcon}
          />
        </div>
        <div className={styles.body}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className={styles.customizationForm}
            action=""
          >
            <label htmlFor="brandName">Brand Name:</label>
            <input
              id="brandName"
              type="text"
              value={brandName}
              placeholder="Click here to write"
              onChange={(e) => setBrandName(e.target.value)}
            />
            <label htmlFor="brandDes">
              Description <span>(under 220 characters):</span>
            </label>
            <textarea
              name="brandDes"
              id="brandDes"
              rows={4}
              placeholder="Click here to write"
              maxLength={220}
              value={brandDes}
              onChange={(e) => setBrandDes(e.target.value)}
            ></textarea>
            <label htmlFor="url">URL(optional):</label>
            <input
              id="url"
              type="text"
              placeholder="Click here to write"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <div className={styles.imgSection}>
              <div className={styles.previewImgSection}>
                <label htmlFor="logo">Brand Logo:</label>
                <input
                  id="logo"
                  ref={logoRef}
                  type="file"
                  onChange={handleLogoChange}
                  style={{ display: "none" }}
                />

                {logo ? (
                  <div className={styles.placeholderWrapper}>
                    <div>
                      <img className={styles.previewImg} src={logo} alt="" onClick={() => logoRef.current.click()} />
                    </div>
                    {/* <button onClick={() => logoRef.current.click()}>
                      Change Image
                    </button> */}
                  </div>
                ) : (
                  <div className={styles.placeholderWrapper}>
                    <span
                      onClick={() => logoRef.current.click()}
                      className={styles.placeholder}
                    >
                    <img src={backup} alt="" />
                    Upload Image
                      <br />
                      <br />
                      (Recommended Resolution: 200x200 pixels)
                    </span>
                  </div>
                )}
              </div>
              <div className={styles.previewImgSection}>
                <label htmlFor="bgImg">Background Image:</label>
                {/* <span className={styles.helperText}></span>{" "} */}
                <input
                  id="bgImg"
                  style={{ display: "none" }}
                  ref={backgroundRef}
                  onChange={handleBgChange}
                  type="file"
                />
                {backgroundImg ? (
                  <div className={styles.placeholderWrapper}>
                    <div>
                      <img
                        className={styles.previewImg}
                        src={backgroundImg}
                        alt=""
                        onClick={() => backgroundRef.current.click()}
                      />
                    </div>
                    {/* <button onClick={() => backgroundRef.current.click()}>
                      Change Image
                    </button> */}
                  </div>
                ) : (
                  <div className={styles.placeholderWrapper}>
                  
                    <span
                      onClick={() => backgroundRef.current.click()}
                      className={styles.placeholder}
                    >
                        <img src={backup} alt="" />
                      Upload Image
                      <br />
                      <br />
                      (Recommended Resolution: 1855x3300)
                    </span>
                  </div>
                )}
              </div>
            </div>
           
          </form>
          <div className={styles.btnSection}>
              <button className={styles.discardBtn} onClick={() => onClose()}>
                Cancel
              </button>
              <button
                onClick={dataReceivedFromAPI ? handleUpdate : handleSave}
                className={styles.saveBtn}
              >
                {isLoading ? (
                  <Spinner size="small" color="#fff" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}

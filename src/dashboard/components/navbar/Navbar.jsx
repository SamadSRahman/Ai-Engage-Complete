import React, { useState, useRef, useEffect } from "react";
import styles from "./navbar.module.css";
import { Builder } from "@builder.io/react";
import logo from "../../images/ai_engage logo.png";
import name from "../../images/Name.png";
import share from "../../images/share.png";
import save from "../../images/save_as.svg";
import {
  copyToClipboard,
  handleUpdate,
  handleUpload,
  handleWhatsAppClick,
} from "../../Utils/services";
import AdminPopup from "../adminPopup/AdminPopup";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../spinner/Spinner";
import { IoMdCopy } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import Alert from "../alert/Alert";

export default function Navbar(props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);
  const [isSaveAlertVisible, setIsSaveAlertVisible] = useState(false);
  const [alertText, setAlertText] = useState("");
  const containerRef = useRef(null);
  const [isSharePopupVisible, setIsSharePopupVisible] = useState(false);
  const [title, setTitle] = useState(localStorage.getItem("fileName") || "");
  let mainId = localStorage.getItem("mainId");
  const adminId = localStorage.getItem("adminId");
  const apiKey = localStorage.getItem("apiKey");
  let shareUrl = `https://final-video-player.vercel.app/${adminId}/${mainId}/${apiKey}`;

  const setLoadingFalse = (value) => setLoading(value);

  useEffect(() => {
    localStorage.setItem("fileName", title);
  }, [title]);
  function handleShare() {
    if (mainId || props.isEditPage) {
      setIsSharePopupVisible(!isSharePopupVisible);
    } else {
      setAlertText("Please save the file before sharing");
      setIsAlertVisible(true);
    }
  }
  function onClose() {
    setIsSharePopupVisible(false);
  }
  function whatsappShare() {
    handleWhatsAppClick(shareUrl);
    onClose();
  }
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsSharePopupVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  const handleConfirmSave = () => {
    const selectedVideo = JSON.parse(localStorage.getItem("selectedVideo"));
    if (!selectedVideo) {
      setAlertText("No file found. Please add a file to save.")
      setIsAlertVisible(true)
      return;
    }
    if (!selectedVideo.videoSrc) {
      setAlertText("No video selected. Please select a video before saving the campaign.")
      setIsAlertVisible(true)
      return;
    }
    setAlertText(
      `The selected video "${selectedVideo.name}" will be saved as the main video and will serve as the starting point for your campaign. Do you want to proceed?`
    );
    setIsSaveAlertVisible(true);
  };
  return (
    <div>
      {isAlertVisible && (
        <Alert
          text={alertText}
          primaryBtnText={"Okay"}
          title={"Alert"}
          onClose={() => setIsAlertVisible(false)}
          onSuccess={() => setIsAlertVisible(false)}
        />
      )}
      {isSuccessAlertVisible && (
        <Alert
          text={alertText}
          primaryBtnText={"Okay"}
          title={"Alert"}
          onClose={() => setIsSuccessAlertVisible(false)}
          onSuccess={() => {
            navigate(`/edit/${localStorage.getItem("mainId")}`);
          }}
        />
      )}
      {isSaveAlertVisible && (
        <Alert
          text={alertText}
          primaryBtnText={"Yes"}
          secondaryBtnText={"No"}
          title={"Alert"}
          onClose={() => setIsSaveAlertVisible(false)}
          onSuccess={() => {
            handleUpload(
              setIsSuccessAlertVisible,
              setIsAlertVisible,
              setAlertText,
              title,
              (value) => setLoadingFalse(value),
              navigate
            );
            setIsSaveAlertVisible(false)
          }}
        />
      )}
      <div className={styles.navbarContainer}>
        <div className={styles.leftSide}>
          <img
            src={logo}
            alt=""
            onClick={() => {
              window.location.href =
                "https://new-video-editor.vercel.app/listings";
            }}
          />
        </div>

        {props.showrightmenu === "false" ? (
          <div className={styles.rightSide}>
            {" "}
            <AdminPopup />{" "}
          </div>
        ) : (
          <div className={styles.rightSide}>
            <div className={styles.editableSpanContainer}>
              <img src={name} alt="" />
              <span className={styles.divider}>|</span>
              {props.title ? (
                <span className={styles.editableSpan}>{props.title}</span>
              ) : (
                <input
                  type="text"
                  placeholder="Untitled"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  className={styles.titleInput}
                />
              )}
            </div>
            {!props.isSaveBtnVisible && (
              <div
                className={styles.shareBtnContainer}
                onClick={() => {
                  if (props.isEditPage)
                    handleUpdate((value) => setLoadingFalse(value));
                  else handleConfirmSave();
                }}
              >
                {loading ? (
                  <Spinner size="small" />
                ) : (
                  <>
                    {" "}
                    <img src={save} alt="" />
                    <span>Save</span>
                  </>
                )}
              </div>
            )}
            {!props.isShareBtnHidden && (
              <div ref={containerRef} className={styles.shareWrapper}>
                <div className={styles.shareBtnContainer} onClick={handleShare}>
                  <img src={share} alt="" />
                  <span>Share</span>
                </div>
                {isSharePopupVisible && (
                  <div className={styles.sharePopup}>
                    <span
                      onClick={() => copyToClipboard(shareUrl, id, onClose())}
                    >
                      {" "}
                      <IoMdCopy /> Copy URL
                    </span>
                    <span onClick={whatsappShare}>
                      {" "}
                      <FaWhatsapp /> Share via WhatsApp
                    </span>
                  </div>
                )}
              </div>
            )}
            {props.isExportBtnVisible && (
              <div
                className={styles.shareBtnContainer}
                onClick={props.onExportClick}
              >
                <img
                  style={{ width: "17px", marginBottom: "2px" }}
                  src={share}
                  alt=""
                />
                <span>Export pdf</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

Builder.registerComponent(Navbar, {
  name: "Navbar",
  noWrap: true,
  inputs: [{ name: "isEditPage", type: "boolean" }],
});

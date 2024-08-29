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
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  fileNameAtom,
  isSaveBtnVisibleForEditAtom,
  reloadCounterForEditAtom,
  videoFilesArrayAtom,
} from "../../Recoil/store";

export default function Navbar(props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const videoArray = useRecoilValue(videoFilesArrayAtom);
  const [loading, setLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);
  const [isSaveAlertVisible, setIsSaveAlertVisible] = useState(false);
  const [alertText, setAlertText] = useState("");
  const containerRef = useRef(null);
  const [fileName, setFileName] = useRecoilState(fileNameAtom);
  const [isSharePopupVisible, setIsSharePopupVisible] = useState(false);
  const isSaveBtnVisibleForEdit = useRecoilValue(isSaveBtnVisibleForEditAtom);
  let mainId = localStorage.getItem("mainId");
  const adminId = localStorage.getItem("adminId");
  const apiKey = localStorage.getItem("apiKey");
  let shareUrl = `https://final-video-player.vercel.app/${adminId}/${mainId}/${apiKey}`;
  const setReloadCounterForEdit = useSetRecoilState(reloadCounterForEditAtom);
  const [isNavigationAlertVisible, setIsNavigationAlertVisible] = useState(false)

  useEffect(() => {
    localStorage.setItem("fileName", fileName);
  }, [fileName]);

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
      setAlertText("No file found. Please add a file to save.");
      setIsAlertVisible(true);
      return;
    }
    if (!selectedVideo.videoSrc) {
      setAlertText(
        "No video selected. Please select a video before saving the campaign."
      );
      setIsAlertVisible(true);
      return;
    }
    setAlertText(
      `The selected video "${selectedVideo.name}" will be saved as the main video and will serve as the starting point for your campaign. Do you want to proceed?`
    );
    setIsSaveAlertVisible(true);
  };

  const handleLogoClick=()=>{
    if(props.isEditPage && isSaveBtnVisibleForEdit){ //if edit page and save bnt visible
      setAlertText("You have some unsaved changes, are you sure you want to leave the page without saving?")
      setIsNavigationAlertVisible(true)
    }
    else if(!props.isSaveBtnVisible &&
      videoArray.length > 1 && !props.isEditPage){ //is not edit page and save btn visible
        setAlertText("You have some unsaved changes, are you sure you want to leave the page without saving?")
        setIsNavigationAlertVisible(true)
    }
    else{
      navigate("/listings")
    }

  }
  return (
    <div>
      {isNavigationAlertVisible && (
        <Alert
        text={alertText}
        secondaryBtnText={"No"}
          primaryBtnText={"Yes"}
          title={"Alert"}
          onClose={() => setIsNavigationAlertVisible(false)}
          onSuccess={() => navigate("/listings")}
        />
      )}
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
            // props.isEditPage?{setIsSuccessAlertVisible(false)}:)
            if (props.isEditPage) {
              setIsSuccessAlertVisible(false);
              setReloadCounterForEdit((prevValue) => prevValue + 1);
            } else {
              navigate(`/edit/${localStorage.getItem("mainId")}`);
            }
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
            if (props.isEditPage) {
              handleUpdate(
                setIsSuccessAlertVisible,
                setIsAlertVisible,
                setAlertText,
                fileName,
                setLoading,
                navigate
              );
            } else {
              handleUpload(
                setIsSuccessAlertVisible,
                setIsAlertVisible,
                setAlertText,
                fileName,
                setLoading,
                navigate
              );
            }
            setIsSaveAlertVisible(false);
          }}
        />
      )}
      <div className={styles.navbarContainer}>
        <div className={styles.leftSide}>
          <img
            src={logo}
            alt=""
            onClick={handleLogoClick}
          />
        </div>
        {/* <div className={styles.rightSide}> */} {/* </div> */}
        <div className={styles.rightSide}>
          {/* className={styles.adminWrapper} */}
          {props.isrightsidemenu && (
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
                    onChange={(e) => setFileName(e.target.value)}
                    value={fileName}
                    className={styles.titleInput}
                  />
                )}
              </div>
              {props.isEditPage ? (
                <div
                  className={styles.shareBtnContainer}
                  style={{
                    width: isSaveBtnVisibleForEdit ? "auto" : "0",
                    padding: isSaveBtnVisibleForEdit ? "10px" : "0",
                  }}
                  onClick={handleConfirmSave}
                >
                  {loading ? (
                    <Spinner size="small" />
                  ) : (
                    <>
                      <img src={save} alt="" />
                      <span>Save</span>
                    </>
                  )}
                </div>
              ) : (
                !props.isSaveBtnVisible &&
                videoArray.length > 1 && (
                  <div
                    className={styles.shareBtnContainer}
                    style={{
                      width:  !props.isSaveBtnVisible &&
                      videoArray.length > 1  ? "auto" : "0",
                      padding:  !props.isSaveBtnVisible &&
                      videoArray.length > 1  ? "10px" : "0",
                    }}
                    onClick={handleConfirmSave}
                  >
                    {loading ? (
                      <Spinner size="small" />
                    ) : (
                      <>
                        <img src={save} alt="" />
                        <span>Save</span>
                      </>
                    )}
                  </div>
                )
              )}

              {!props.isShareBtnHidden && (mainId || props.isEditPage) && (
                <div ref={containerRef} className={styles.shareWrapper}>
                  <div
                    className={styles.shareBtnContainer}
                    onClick={handleShare}
                  >
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

          <div className={styles.adminWrapper}>
            <AdminPopup />
          </div>
        </div>
      </div>
    </div>
  );
}

Builder.registerComponent(Navbar, {
  name: "Navbar1",
  noWrap: true,
  inputs: [
    { name: "isEditPage", type: "boolean" },
    { name: "showrightmenu", type: "boolean" },
  ],
});

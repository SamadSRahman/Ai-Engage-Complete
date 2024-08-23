import React, { useState } from "react";
import styles from "./edit&DeletePopup.module.css";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  fileNameAtom,
  selectedVideoAtom,
  videoResultAtom,
} from "../../Recoil/store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import analyticsIcon from "../../images/equalizer.png";
import shareIcon from "../../images/shareicon.png";
import editIcon from "../../images/edit.png";
import deleteIcon from "../../images/delete.png";
import { FaWhatsapp } from "react-icons/fa";
import { copyToClipboard, handleWhatsAppClick } from "../../Utils/services";


export default function EditandDeletePopup({ onClose, video, id, style }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const token = localStorage.getItem("accessToken");
  const adminId = localStorage.getItem("adminId");
  const navigate = useNavigate();
  console.log(style);
  const  setSelectedVideo = useSetRecoilState(selectedVideoAtom);
  const setFileName = useSetRecoilState(fileNameAtom);
  const [videoResult, setVideoResult] = useRecoilState(videoResultAtom);
  const apiKey = localStorage.getItem("apiKey")
  let shareUrl = `https://final-video-player.vercel.app/${adminId}/${id}/${apiKey}`;

  
 
  const handleAnalyticsClick = () => {
    onClose();
    navigate(`/analytics/${id}`);
  };
  const handleEdit = () => {
    onClose();
    console.log(video);
    localStorage.setItem(
      "selectedVideo",
      JSON.stringify(video.videoSelectedFile)
    );
    localStorage.setItem("fileName", video.title);
    setFileName(video.title);
    setSelectedVideo(video.videoSelectedFile);
    navigate(`/edit/${id}`);
  };
  const handleDelete = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(
        "This action will delete the video survey and you won't be able to access it again"
      ) === true
    ) {
      setIsDeleting(true);
      axios
        .delete(
          `https://videosurvey.xircular.io/api/v1/video/deleteVideo/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("Delete request successful");
          console.log(response.data);
          let newArray = videoResult.filter((ele) => ele.video_id !== id);
          setVideoResult(newArray);
          setIsDeleting(false);
          onClose();
        })
        .catch((error) => {
          console.log(error);
          setIsDeleting(false);
          onClose();
        });
    }
  };

  const handleShare = ()=>{

    copyToClipboard(shareUrl)
    fetch(`https://videosurvey.xircular.io/api/v1/video/update/shared/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isShared: true }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
}  
return (
    <div>
      <div className={styles.container} style={style ? style : {}}>
        <button className={styles.popupitem} onClick={handleAnalyticsClick}>
          {" "}
          <img src={analyticsIcon} alt="Analytics icon" />{" "}
          <span> View analytics </span>{" "}
        </button>

        <button className={styles.popupitem}  onClick={handleEdit}>
          {" "}
          <img src={editIcon} alt="Edit icon" />
          <span> Edit Campaign </span>{" "}
        </button>

        <button className={styles.popupitem} 
        onClick={handleShare}
        >
          {" "}
          <img src={shareIcon} alt="Share icon" />{" "}
          <span>
            {" "}
            Share Campaign{" "}
          </span>{" "}
        </button>
        <button className={styles.popupitem} onClick={()=>handleWhatsAppClick(shareUrl, id)}>
          {" "}
          <FaWhatsapp size={"1.8em"}/>
          {/* <img src={deleteIcon} alt="Delete icon" /> */}
          <span className={styles.deleteSpan} >
           WhatsApp Share{" "}
            {/* {isDeleting && <div className={styles.deleteLoader}></div>} */}
          </span>
        </button>
  

        <button className={styles.popupitem}  onClick={handleDelete}>
          {" "}
          <img src={deleteIcon} alt="Delete icon" />
          <span className={styles.deleteSpan}>
            Delete Campaign{" "}
            {isDeleting && <div className={styles.deleteLoader}></div>}
          </span>
        </button>
      </div>
    </div>
  );
}

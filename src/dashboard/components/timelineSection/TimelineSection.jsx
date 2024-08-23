import React, { useState } from "react";
import styles from "./timelineSection.module.css";
import message from "../../images/messageBlack.png";
import add from "../../images/add.png";
import addEnabled from "../../images/addEnabled.png";
import downEnabled from "../../images/keyboard_arrow_down_enabled.png";
import down from "../../images/keyboard_arrow_down.png";
import time from "../../images/Time frame.png";
import video from "../../images/videocam.png";
import VideoTimeline from "../../videoTimeline";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  isEditorVisibleAtom,
  isPlayingAtom,
  isThumbnailGeneratingAtom,
  isVideoLoadingAtom,
  selectedVideoAtom,
} from "../../Recoil/store";
import AddQuestionPopup from "../addQuestionPopup/AddQuestionPopup";
import { useParams } from "react-router-dom";
import VideoTimelineEdit from "../../editingSection/videoTimelineEdit";
import Alert from "../alert/Alert";

export default function TimelineSection() {
  const { id } = useParams();
  const [isAddQuestionVisible, setIsAddQuestionVisible] = useState(false);
  const selectedVideo = useRecoilValue(selectedVideoAtom);
  const isThumbnailsGenerated = useRecoilValue(isThumbnailGeneratingAtom);
  const [isAlertVisible, setIsAlertVisible] = useState(false)
  const [alertText, setAlertText] = useState("")
  const isVideoLoading = useRecoilValue(isVideoLoadingAtom);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingAtom);
  const setIsEditorVisible = useSetRecoilState(isEditorVisibleAtom);

  function handleAddPointerClick() {
    if (isVideoLoading || isThumbnailsGenerated) {
      alert("Please wait while your video is uploading");
      return;
    }

    if (selectedVideo?.videoSrc) {
      setIsAddQuestionVisible(true);
      setIsPlaying(!isPlaying);
    } else {
      setIsAddQuestionVisible(false);
    }
  }
  function handlePointerClick() {
    if (selectedVideo?.questions?.length > 0) {
      setIsEditorVisible(true);
    } else {
      setAlertText("No pointers available for this video")
      setIsAlertVisible(true)
    }
  }

  return (
    <div className={styles.container}>
      {isAlertVisible && <Alert
      text={alertText}
      title={"Alert"}
      primaryBtnText={"Okay"}
      onClose={()=>setIsAlertVisible(false)}
      onSuccess={()=>setIsAlertVisible(false)}
     />}
      <div className={styles.topSection}>
        <div className={styles.topLeft}>
          <img src={message} alt="" />
          <span>Message Pointer</span>
        </div>
        <div className={styles.topRight}>
          <div
            className={
              selectedVideo?.videoSrc
                ? styles.pointerBtnEnabled
                : styles.pointerBtnDisabled
            }
            onClick={handleAddPointerClick}
          >
            <img
              src={selectedVideo?.videoSrc ? addEnabled : add}
              alt=""
              style={{ width: "15px" }}
            />
            <span>Add pointer</span>
          </div>
          <div
            className={
              selectedVideo?.videoSrc
                ? styles.pointerBtnEnabled
                : styles.pointerBtnDisabled
            }
            onClick={handlePointerClick}
          >
            <span>View pointer</span>
            <img
              src={selectedVideo?.videoSrc ? downEnabled : down}
              alt=""
              style={{ width: "15px" }}
            />
          </div>
        </div>
      </div>
      <div className={styles.mainSection}>
        <div className={styles.mainLeft}>
          <div className={styles.timeLeft}>
            <img src={time} alt="" />
            <span>Time frame</span>
          </div>
          <div className={styles.timeLeft} style={{ marginTop: "10px" }}>
            <img src={video} alt="" />
            <span>Video frame</span>
          </div>
          <div className={styles.timeLeft} style={{ marginTop: "10px" }}>
            <img src={message} alt="" />
            Pointer
          </div>
        </div>
        {selectedVideo?.videoSrc && (
          <div className={styles.mainRight}>
            {selectedVideo?.videoSrc && !id ? (
              <VideoTimeline />
            ) : (
              <VideoTimelineEdit />
            )}
          </div>
        )}
        {isAddQuestionVisible && (
          <AddQuestionPopup onClose={() => setIsAddQuestionVisible(false)} />
        )}
      </div>
    </div>
  );
}

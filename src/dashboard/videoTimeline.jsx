/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import "./videoTimeline.css";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  videoDurationAtom,
  videoSrcAtom,
  currentTimeAtom,
  pinPositionAtom,
  selectedVideoAtom,
  currentIndexAtom,
  isThumbnailGeneratingAtom,
  vidAtom,
} from "./Recoil/store";
import polygon from "./images/Polygon.png";

import message from "./images/newMessageIcon.png";
import { Builder } from "@builder.io/react";
import { getDataFromStorage } from "./Utils/services";

import Popup from "./components/messagePopup";
import axios, { Axios } from "axios";
import Alert from "./components/alert/Alert";

const VideoTimeline = (props) => {
  let token = localStorage.getItem("accessToken");
  const currentIndex = useRecoilValue(currentIndexAtom);
  const videoSrc = useRecoilValue(videoSrcAtom);
  const [currentTime, setCurrentTime] = useRecoilState(currentTimeAtom);
  const videoDuration = useRecoilValue(videoDurationAtom);
  const [isDeleteAlertVisible,setIsDeleteAlertVisible] = useState(false)
  const [isSuccessAlertVisible,setIsSuccessAlertVisible] = useState(false)
  const [id, setId] = useState("")
  const [showPopup, setShowPopup] = useState(false);
  let timelineLength = videoDuration;
  const [pinPosition, setPinPosition] = useRecoilState(pinPositionAtom);
  const timelineRef = useRef(null);
  const [videoThumbnails, setVideoThumbnails] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedVideo, setSelectedVideo] = useRecoilState(selectedVideoAtom);
  const [pinLeft, setPinLeft] = useState("0")
  const setIsThumbanilGenerating = useSetRecoilState(isThumbnailGeneratingAtom)
  const setVid = useSetRecoilState(vidAtom)

  useEffect(() => {
    let newSelectedVideo = JSON.parse(localStorage.getItem("selectedVideo"));
    setSelectedVideo(newSelectedVideo);
  }, [props.isEditorVisible]);

  const handleDelete = () => {  
    const newSelectedVideo = { ...selectedVideo };
    const newArray = newSelectedVideo.questions.filter((ele) => ele.id !== id);
    newSelectedVideo.questions = newArray;
    setSelectedVideo(newSelectedVideo);
    localStorage.setItem("selectedVideo", JSON.stringify(newSelectedVideo));
    let vidData = JSON.parse(localStorage.getItem("vidData"));
    const index = vidData.findIndex((ele) => ele.id === newSelectedVideo.id);
    vidData[index] = newSelectedVideo;
    localStorage.setItem("vidData", JSON.stringify(vidData));
    setVid(vidData)
    setShowPopup(false);
    setIsSuccessAlertVisible(true)
    setIsDeleteAlertVisible(false)
  };


  useEffect(() => {
    timelineLength = videoDuration;
  }, [videoDuration]);

  useEffect(() => {
    const handleDragOver = (event) => {
      event.preventDefault();
      const timelineElement = timelineRef.current;
      const timelineRect = timelineElement.getBoundingClientRect();
      const positionX = event.clientX - timelineRect.left;
      if (positionX >= 0 && positionX <= timelineRect.width) {
        const time = (positionX / timelineRect.width) * timelineLength;
        setPinPosition(time.toFixed(1));
        localStorage.setItem("pinPosition", JSON.stringify(time.toFixed(1)));
      }
    };
    const timelineElement = timelineRef.current;
    timelineElement.addEventListener("dragover", handleDragOver);
    return () => {
      timelineElement.removeEventListener("dragover", handleDragOver);
    };
  }, [timelineLength]);
  const handleDragStart = (event) => {
    event.dataTransfer.effectAllowed = "move";
    // Set a transparent image as drag data to prevent the default drag image
    const emptyImage = new Image();
    emptyImage.src =
      "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='0' height='0'%3E%3C/svg%3E";
    event.dataTransfer.setDragImage(emptyImage, 0, 0);
    event.dataTransfer.setData("text/plain", event.target.id);
    setPinPosition(null);
    localStorage.setItem("pinPosition", null);
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const time = calculateTime();
    setCurrentTime(time);
  };
  const barWidth = 13; // Set the width of the bars in pixels
  const barHeight = 10; // Set the height of the bars in pixels
  const timelineBars = [];
  for (let i = 0; i <= timelineLength; i++) {
    const isHalfSecondInterval = i % 5 === 0;
    const isSecondInterval = i % 10 === 0;
    const barStyle = {
      width: isHalfSecondInterval ? `${barWidth}px` : `${barWidth}px`,
      height: isHalfSecondInterval ? `${barHeight}px` : `${barHeight / 2}px`,
      backgroundColor: i === 0 || isSecondInterval ? "black" : "darkgrey",
      marginRight: "15.5px", // Adjust margin between bars
      position: "relative",
      minWidth:"1px"
    };
    timelineBars.push(
      <div key={i} style={barStyle}>
        {(isSecondInterval || i === 0) && (
          <span className="timelineMarkers">{i}</span>
        )}
      </div>
    );
  }
  useEffect(()=>{
    setPinLeft(pinPosition ? `${(pinPosition / timelineLength) * 99}%` : "0%");
  },[pinPosition])
  const [thumbnailsGenerated, setThumbnailsGenerated] = useState(false);

  const generateThumbnails = (src) => {
    if (!src || thumbnailsGenerated) return;
    setIsThumbanilGenerating(true)
    const video = document.createElement("video");
    video.src = src;
    video.preload = "metadata"; // Load metadata to get video dimensions
  
    // Set to keep track of timestamps for which thumbnails have been generated
    const generatedTimes = new Set();
  
    video.addEventListener("loadedmetadata", () => {
      let currentTime = 0;
  
      const thumbnailGeneration = (currentTimeForThumbnail) => {
        if (generatedTimes.has(currentTimeForThumbnail)) {
          console.log(
            `Thumbnail for time ${currentTimeForThumbnail} already generated.`
          );
          generateThumbnail(currentTimeForThumbnail + 7);
          return;
        }
  
        const canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 120;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, 200, 120);
  
        canvas.toBlob(async (thumbnailBlob) => {
          // Mark this time as processed immediately to avoid duplicate generation
          generatedTimes.add(currentTimeForThumbnail);
          await storeThumbnail(thumbnailBlob, currentTimeForThumbnail);
        }, "image/jpeg");
      };
  
      const storeThumbnail = async (thumbnailBlob, currentTimeForThumbnail) => {
        const formData = new FormData();
        formData.append("thumbnail", thumbnailBlob, "thumbnail.jpg");
  
        try {
          const response = await axios.post(
            "https://videosurvey.xircular.io/api/v1/video/upload/thumbnail",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          setVideoThumbnails((prevThumbnails) => {
            const newThumbnails = [
              ...prevThumbnails,
              {
                time: currentTimeForThumbnail,
                url: `https://videosurvey.xircular.io/thumbnails/${response.data.thumbnailUrl}`,
              },
            ];
  
            // Remove duplicates based on time
            const uniqueThumbnails = newThumbnails.filter(
              (value, index, self) =>
                index === self.findIndex((t) => t.time === value.time)
            );
  
            return uniqueThumbnails;
          });
  
          generateThumbnail(currentTimeForThumbnail + 7);
        } catch (error) {
          console.log(error);
        }
      };
  
      const generateThumbnail = (nextTime) => {
        if (nextTime >= video.duration) {
          console.log("Video thumbnails", videoThumbnails)
          setIsThumbanilGenerating(false)
          const newArray = JSON.parse(localStorage.getItem("vidData"));
          let newObj = { ...newArray[currentIndex] };
          newObj.thumbnails = videoThumbnails;
          setSelectedVideo(newObj);
          localStorage.setItem("selectedVideo", JSON.stringify(newObj));
          newArray[currentIndex] = { ...newObj };
          localStorage.setItem("vidData", JSON.stringify(newArray));
          setThumbnailsGenerated(true);
          video.removeEventListener("seeked", thumbnailGeneration);
          return;
        }
  
        video.currentTime = nextTime;
        video.addEventListener(
          "seeked",
          () => {
            if (video.readyState >= video.HAVE_CURRENT_DATA) {
              thumbnailGeneration(nextTime);
            }
          },
          { once: true }
        );
      };
  
      setVideoThumbnails([]);
      generateThumbnail(currentTime);
    });
  };
  

  useEffect(() => {
    if(videoThumbnails.length>0){
      let newObj = JSON.parse(localStorage.getItem("selectedVideo"));
    newObj.thumbnails = videoThumbnails;
    setSelectedVideo(newObj);
    localStorage.setItem("selectedVideo", JSON.stringify(newObj));
    }
  }, [videoThumbnails]);
  useEffect(() => {
    setThumbnailsGenerated(false);
    setVideoThumbnails([]);
    setPinPosition(0.0);
  }, [videoSrc]);
  useEffect(() => {
    let selectedVideo = JSON.parse(localStorage.getItem("selectedVideo"))
    if (selectedVideo?.thumbnails?.length > 0) {
      setVideoThumbnails(selectedVideo.thumbnails);
    } else generateThumbnails(videoSrc, timelineLength);
  }, [videoSrc, timelineLength, thumbnailsGenerated]);
  // Generate the thumbnail elements for the secondary timeline
  const thumbnailElements = videoThumbnails.map((thumbnail, index) => (
    <img
      key={index}
      src={thumbnail.url}
      alt={`Thumbnail at ${thumbnail.time}s`}
      style={{
        minWidth: "118px", // Set the width based on the timeline length
        height: "3.2rem", // Define the height of the thumbnail timeline
        objectFit: "cover", // Ensure the thumbnail fits within its container
      }}
    />
  ));
  const handleDragOver = (event) => {
    event.preventDefault();
    const timelineElement = timelineRef.current;
    const timelineRect = timelineElement.getBoundingClientRect();
    const positionX = event.clientX - timelineRect.left;
    if (positionX >= 0 && positionX <= timelineRect.width) {
      const time = (positionX / timelineRect.width) * timelineLength;
      setPinPosition(time.toFixed(1));
      localStorage.setItem("pinPosition", JSON.stringify(time.toFixed(1)));
    }
  };
  const calculateTime = () => {
    // Calculate the time based on the pin's position
    const time = Math.round((pinPosition / timelineLength) * videoDuration);
    setCurrentTime(time);
    return time;
  };
  const handleTimelineClick = (event) => {
    const timelineElement = timelineRef.current;
    const timelineRect = timelineElement.getBoundingClientRect();
    const positionX = event.clientX - timelineRect.left;

    if (positionX >= 0 && positionX <= timelineRect.width) {
        const preciseTime = (positionX / timelineRect.width) * timelineLength;
        const roundedTime = Math.round(preciseTime * 10) / 10; // Round to one decimal place

        setPinPosition(roundedTime);
        setCurrentTime(roundedTime);
        localStorage.setItem("pinPosition", roundedTime);
    }
};
  const markedPositionElements = selectedVideo?.questions?.map(
    (position, index) => (
      <div
        key={index}
        style={{
          position: "absolute",
          left: `${(position.time / timelineLength) * 99}%`,
          top: "5px",
          height: "50%",
          borderRadius: "8px",
          width: "35px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex" }}>
          <img
            src={message}
            alt=""
            style={{
              marginTop: "30px",
              marginRight: "35px",
              height: "30px",

              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedId(position.id);
              setShowPopup(true);
              console.log(showPopup);
            }}
          />
          {showPopup && selectedId === position.id && (
            <Popup
              id={position.id}
              onDelete={() => {
                setIsDeleteAlertVisible(true)
                setId(position.id)}}
              onClose={() => setShowPopup(false)}
              index={index}
            />
          )}
        </div>
      </div>
    )
  );
  // causing error of maximum depth
  // useEffect(() => {
  //   setIsEditPopupVisible(props.isEditPopup);
  // }, [props.isEditPopup]);
  return (
    <>
   {isDeleteAlertVisible && (<Alert text={"Are you sure you want to delete this pointer?"}
    title={"Alert"}
    primaryBtnText={"Yes"}
    secondaryBtnText={"Cancel"}
    onClose={()=>setIsDeleteAlertVisible(false)}
    onSuccess={handleDelete}
    />)}
   {isSuccessAlertVisible && (<Alert text={"Pointer deleted successfully"}
    title={"Alert"}
    primaryBtnText={"Okay"}
    onClose={()=>setIsSuccessAlertVisible(false)}
    onSuccess={()=>setIsSuccessAlertVisible(false)}
    />)}
      <div className="timelineContainer">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          ref={timelineRef}
          style={{
            position: "relative",
            height: "90%",
            width: `${timelineLength * (barWidth + 4)}px `,
            margin: "5px",
            padding: "0px",
          }}
        >
          <div
            onClick={handleTimelineClick}
            style={{
              display: "flex",
              alignItems: "end",
              height: "2.7rem",
              boxSizing: "border-box",
              paddingBottom: "7px",
              cursor: "pointer",
            }}
          >
            {timelineBars}
          </div>
          {timelineLength > 0 && (
            <div
              id="pin"
              draggable
              onDragStart={handleDragStart}
              style={{
                width: "0.0001px",
                height: "165px",
                position: "absolute",
                top: "-5px",
                left: `calc(${pinLeft} - 0.05px)`,
                cursor: "grab",
                border: "1px dashed #4D67EB",
                transition: "left 0.3s linear",
              }}
            >
              <img
                src={polygon}
                alt=""
                style={{
                  width: "20px",
                  position: "relative",
                  left: "-10.1px",
                  bottom: "6px",
                }}
              />
            </div>
          )}
          <div
            className="thumbnailContainer"
            style={{
              width: `${timelineLength * (barWidth + 3.8)}px `,
            }}
          >
            {thumbnailElements}
          </div>
          <div>
            <div
              className="markedElements"
              style={{ position: "relative", height: "2.8rem" }}
            >
              {markedPositionElements}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoTimeline;
Builder.registerComponent(VideoTimeline, {
  name: "videoTimeline",
  inputs: [
    { name: "isEditPopup", type: "boolean" },
    { name: "isEditorVisible", type: "boolean" },
  ],
});

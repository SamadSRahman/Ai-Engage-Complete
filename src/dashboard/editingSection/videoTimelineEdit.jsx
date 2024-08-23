/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import "../videoTimeline.css";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  videoDurationAtom,
  videoSrcAtom,
  currentTimeAtom,
  pinPositionAtom,
  selectedVideoAtom,
  isEditPopupAtom,
  currentIndexAtom,
} from "../Recoil/store";
import polygon from "../images/Polygon.png";
import message from "../images/newMessageIcon.png";
import { Builder } from "@builder.io/react";
import Popup from "../components/messagePopup";
import axios from "axios";

const VideoTimelineEdit = (props) => {
  const currentIndex = useRecoilValue(currentIndexAtom);
  const videoSrc = useRecoilValue(videoSrcAtom);
  const [currentTime, setCurrentTime] = useRecoilState(currentTimeAtom);
  const videoDuration = useRecoilValue(videoDurationAtom);
  const [showPopup, setShowPopup] = useState(false);
  let timelineLength = videoDuration;
  const setIsEditPopupVisible = useSetRecoilState(isEditPopupAtom);
  const [pinPosition, setPinPosition] = useRecoilState(pinPositionAtom);
  const timelineRef = useRef(null);
  const [videoThumbnails, setVideoThumbnails] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedVideo, setSelectedVideo] = useRecoilState(selectedVideoAtom);
  const token = localStorage.getItem("accessToken");

  const handleDelete = (id) => {
    const newSelectedVideo = { ...selectedVideo };
    const newArray = newSelectedVideo.questions.filter((ele) => ele.id != id);
    newSelectedVideo.questions = newArray;
    setSelectedVideo(newSelectedVideo);
    console.log(
      "Edit check: selectedVideo updated at handleDelete ",
      newSelectedVideo
    );
    localStorage.setItem("selectedVideo", JSON.stringify(newSelectedVideo));
    let vidData = JSON.parse(localStorage.getItem("vidData"));
    const index = vidData.findIndex((ele) => ele.id === newSelectedVideo.id);
    vidData[index] = newSelectedVideo;
    localStorage.setItem("vidData", JSON.stringify(vidData));
    setShowPopup(false);
  };

  let thumbnailsFromApi = [];
  useEffect(() => {
    const selectedVideo = JSON.parse(localStorage.getItem("selectedVideo"));
    if (selectedVideo?.thumbnails) {
      console.log("line 62", selectedVideo);
      thumbnailsFromApi = [...selectedVideo.thumbnails];
      console.log("thumbnails from API", thumbnailsFromApi);
      setVideoThumbnails(thumbnailsFromApi);
    }
  }, [selectedVideo]);

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
      marginRight: "15px", // Adjust margin between bars
      position: "relative",
    };
    timelineBars.push(
      <div key={i} style={barStyle}>
        {(isSecondInterval || i === 0) && (
          <span className="timelineMarkers">{i}</span>
        )}
      </div>
    );
  }
  let pinLeft = pinPosition ? `${(pinPosition / timelineLength) * 99}%` : "0";
  const [thumbnailsGenerated, setThumbnailsGenerated] = useState(false);

  const generateThumbnails = (src) => {
    if (!src || thumbnailsGenerated) return;
  
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
    console.log("videoTimeline video source", videoSrc);
  }, [videoSrc]);
  useEffect(() => {
    setThumbnailsGenerated(false);
    setVideoThumbnails([]);
    setPinPosition(0.0);
  }, [videoSrc]);

  useEffect(() => {
   setTimeout(()=>{
    let selectedVideo = JSON.parse(localStorage.getItem("selectedVideo"));
    console.log(
      "Edit check: selctedVideo from videoTimelineEdit",
      selectedVideo
    );

    if (selectedVideo?.thumbnails?.length > 0) {
      setVideoThumbnails(selectedVideo.thumbnails);
    } else {
      let videoFiles = JSON.parse(localStorage.getItem("videoFiles"));
      console.log(videoFiles);
      let vidData = JSON.parse(localStorage.getItem("vidData"));
      let length = vidData?.length;
      let src = "";
      if (videoFiles) {
        src = videoFiles[currentIndex];
      }
      console.log("Edit check", src, length, currentIndex);

      generateThumbnails(src, timelineLength);
      console.log("Edit check: generate thumbnails triggered");
    }
   }, 1000)
  }, [videoSrc]);
  // Generate the thumbnail elements for the secondary timeline
  const thumbnailElements = videoThumbnails.map((thumbnail, index) => {
    return (
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
    );
  });
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
    const time = calculateTime();
    setCurrentTime(time);
    const timelineElement = timelineRef.current;
    const timelineRect = timelineElement.getBoundingClientRect();
    const positionX = event.clientX - timelineRect.left;
    if (positionX >= 0 && positionX <= timelineRect.width) {
      const time = (positionX / timelineRect.width) * timelineLength;
      setPinPosition(time.toFixed(1));
      setCurrentTime(time.toFixed(1));
      localStorage.setItem("pinPosition", time.toFixed(1));
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
              onDelete={() => handleDelete(position.id)}
              onClose={() => setShowPopup(false)}
              index={index}
            />
          )}
        </div>
      </div>
    )
  );
  useEffect(() => {
    setIsEditPopupVisible(props.isEditPopup);
  }, [props.isEditPopup]);
  return (
    <>
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
                transition: "left 1s ease",
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
export default VideoTimelineEdit;
Builder.registerComponent(VideoTimelineEdit, {
  name: "videoTimelineEdit",
  inputs: [
    { name: "isEditPopup", type: "boolean" },
    { name: "isEditorVisible", type: "boolean" },
  ],
});

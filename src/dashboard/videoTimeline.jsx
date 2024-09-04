/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */
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
import { Builder } from "@builder.io/react";
import axios from "axios";
import MarkedPositions from "./components/videoTimelineComponents/MarkedComponentsEdit";
import ThumbnailTimeline from "./components/videoTimelineComponents/ThumbnailsTimeline";
import TimelineBarMarkers from "./components/videoTimelineComponents/TimelineMarkers";

const VideoTimeline = (props) => {
  let token = localStorage.getItem("accessToken");
  const currentIndex = useRecoilValue(currentIndexAtom);
  const videoSrc = useRecoilValue(videoSrcAtom);
  const setCurrentTime = useSetRecoilState(currentTimeAtom);
  const videoDuration = useRecoilValue(videoDurationAtom);
  const [pinPosition, setPinPosition] = useRecoilState(pinPositionAtom);
  const timelineRef = useRef(null);
  const [videoThumbnails, setVideoThumbnails] = useState([]);
  const [selectedVideo, setSelectedVideo] = useRecoilState(selectedVideoAtom);
  const [pinLeft, setPinLeft] = useState("0");
  const [isThumbnailGenerating,setIsThumbanilGenerating] = useRecoilState(isThumbnailGeneratingAtom);
  const setVid = useSetRecoilState(vidAtom);
  const [timelineClickTriggered, setTimelineClickTriggered] = useState(false);

  useEffect(() => {
    let newSelectedVideo = JSON.parse(localStorage.getItem("selectedVideo"));
    setSelectedVideo(newSelectedVideo);
  }, [props.isEditorVisible]);

  useEffect(() => {
    const handleDragOver = (event) => {
      event.preventDefault();
      const timelineElement = timelineRef.current;
      const timelineRect = timelineElement.getBoundingClientRect();
      const positionX = event.clientX - timelineRect.left;
      if (positionX >= 0 && positionX <= timelineRect.width) {
        const time = (positionX / timelineRect.width) * videoDuration;
        setPinPosition(time.toFixed(1));
        localStorage.setItem("pinPosition", JSON.stringify(time.toFixed(1)));
      }
    };
    const timelineElement = timelineRef.current;
    timelineElement.addEventListener("dragover", handleDragOver);
    return () => {
      timelineElement.removeEventListener("dragover", handleDragOver);
    };
  }, [videoDuration]);
  const handleDragStart = (event) => {
    event.dataTransfer.effectAllowed = "move";

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
  useEffect(() => {
    setPinLeft(pinPosition ? `${(pinPosition / videoDuration) * 99}%` : "0%");
  }, [pinPosition]);
  const [thumbnailsGenerated, setThumbnailsGenerated] = useState(false);
useEffect(()=>{console.log("isThumbnailGenerating", isThumbnailGenerating);
}, [isThumbnailGenerating])
  const generateThumbnails = (src) => {
    if (!src || thumbnailsGenerated) return;
    setIsThumbanilGenerating(true);
    const video = document.createElement("video");
    video.src = src;
    video.preload = "metadata"; // Load metadata to get video dimensions

    // Set to keep track of timestamps for which thumbnails have been generated
    const generatedTimes = new Set();

    video.addEventListener("loadedmetadata", () => {
      let currentTime = 0;

      const thumbnailGeneration = (currentTimeForThumbnail) => {
        if (generatedTimes.has(currentTimeForThumbnail)) {
    
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
          setIsThumbanilGenerating(false);
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
    if (videoThumbnails.length > 0) {
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
    let selectedVideo = JSON.parse(localStorage.getItem("selectedVideo"));
    if (selectedVideo?.thumbnails?.length > 0) {
      setTimeout(() => setVideoThumbnails(selectedVideo.thumbnails), 400);
    } else generateThumbnails(videoSrc, videoDuration);
  }, [videoSrc, videoDuration, thumbnailsGenerated]);

  const handleDragOver = (event) => {
    event.preventDefault();
    const timelineElement = timelineRef.current;
    const timelineRect = timelineElement.getBoundingClientRect();
    const positionX = event.clientX - timelineRect.left;
    if (positionX >= 0 && positionX <= timelineRect.width) {
      const time = (positionX / timelineRect.width) * videoDuration;
      setPinPosition(time.toFixed(1));
      localStorage.setItem("pinPosition", JSON.stringify(time.toFixed(1)));
    }
  };
  const calculateTime = () => {
    // Calculate the time based on the pin's position
    const time = Math.round((pinPosition / videoDuration) * videoDuration);
    setCurrentTime(time);
    return time;
  };
  useEffect(() => {
    if (timelineClickTriggered) {
      setTimeout(() => setTimelineClickTriggered(false), 500);
    }
  }, [timelineClickTriggered]);
  const handleTimelineClick = (event) => {
    if (timelineClickTriggered) {
      return;
    }
    setTimelineClickTriggered(true);
    const timelineElement = timelineRef.current;
    const timelineRect = timelineElement.getBoundingClientRect();
    const positionX = event.clientX - timelineRect.left;
    if (positionX >= 0 && positionX <= timelineRect.width) {
      const preciseTime = (positionX / timelineRect.width) * videoDuration;
      const roundedTime = Math.round(preciseTime * 10) / 10; // Round to one decimal place
      setPinPosition(roundedTime);
      setCurrentTime(roundedTime);
      localStorage.setItem("pinPosition", roundedTime);
    }
  };
  return (
    <>
      <div className="timelineContainer">
        <div
          className="timeline"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          ref={timelineRef}
          style={{
            width: `${videoDuration * (barWidth + 4)}px `,
          }}
        >
          <TimelineBarMarkers
            videoDuration={videoDuration}
            handleTimelineClick={handleTimelineClick}
          />
          {videoDuration > 0 && (
            <div
              id="pin"
              draggable
              onDragStart={handleDragStart}
              style={{
                left: `calc(${pinLeft} - 0.05px)`, // Center the line under the triangle
              }}
            >
              <img src={polygon} alt="" />
            </div>
          )}
          <div
            className="thumbnailContainer"
            style={{
              width: `${videoDuration * (barWidth + 3.8)}px `,
            }}
          >
            <ThumbnailTimeline videoThumbnails={videoThumbnails} />
          </div>
          <div>
            <div
              className="markedElements"
              style={{ position: "relative", height: "2.8rem" }}
            >
              <MarkedPositions
                selectedVideo={selectedVideo}
                setSelectedVideo={setSelectedVideo}
                timelineLength={videoDuration}
                setVid={setVid}
              />
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

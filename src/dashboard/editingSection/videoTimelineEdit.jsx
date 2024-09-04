/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

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
  vidAtom,
} from "../Recoil/store";
import { Builder } from "@builder.io/react";
import axios from "axios";
import MarkedPositions from "../components/videoTimelineComponents/MarkedComponentsEdit";
import ThumbnailTimeline from "../components/videoTimelineComponents/ThumbnailsTimeline";
import TimelineBarMarkers from "../components/videoTimelineComponents/TimelineMarkers";
import polygon from '../images/Polygon.png'

const VideoTimelineEdit = (props) => {
  const currentIndex = useRecoilValue(currentIndexAtom);
  const videoSrc = useRecoilValue(videoSrcAtom);
  const setCurrentTime = useSetRecoilState(currentTimeAtom);
  const videoDuration = useRecoilValue(videoDurationAtom);
  const setIsEditPopupVisible = useSetRecoilState(isEditPopupAtom);
  const [pinPosition, setPinPosition] = useRecoilState(pinPositionAtom);
  const timelineRef = useRef(null);
  const [videoThumbnails, setVideoThumbnails] = useState([]);
  const [selectedVideo, setSelectedVideo] = useRecoilState(selectedVideoAtom);
  const token = localStorage.getItem("accessToken");
  const setVid = useSetRecoilState(vidAtom);
  const [pinLeft, setPinLeft] = useState("0");
  const [timelineClickTriggered, setTimelineClickTriggered] = useState(false);

  let thumbnailsFromApi = [];
  useEffect(() => {
    const selectedVideo = JSON.parse(localStorage.getItem("selectedVideo"));
    if (selectedVideo?.thumbnails) {
      thumbnailsFromApi = [...selectedVideo.thumbnails];
      setVideoThumbnails(thumbnailsFromApi);
    }
  }, [selectedVideo]);

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
    event.dataTransfer.setData("text/plain", event.target.id);
    setPinPosition(null);
    localStorage.setItem("pinPosition", null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const time = calculateTime();
    setCurrentTime(time);
  };
  const barWidth = 13;
  useEffect(() => {
    setPinLeft(pinPosition ? `${(pinPosition / videoDuration) * 99}%` : "0%");
  }, [pinPosition]);
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
    setThumbnailsGenerated(false);
    setVideoThumbnails([]);
    setPinPosition(0.0);
    setTimeout(() => {
      let selectedVideo = JSON.parse(localStorage.getItem("selectedVideo"));

      if (selectedVideo?.thumbnails?.length > 0) {
        setVideoThumbnails(selectedVideo.thumbnails);
      } else {
        let videoFiles = JSON.parse(localStorage.getItem("videoFiles"));
        let vidData = JSON.parse(localStorage.getItem("vidData"));
        let length = vidData?.length;
        let src = "";
        if (videoFiles) {
          src = videoFiles[currentIndex];
        }
        generateThumbnails(src, videoDuration);
      }
    }, 1000);
  }, [videoSrc]);
  // Generate the thumbnail elements for the secondary timeline

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
    const time = calculateTime();
    setCurrentTime(time);
    const timelineElement = timelineRef.current;
    const timelineRect = timelineElement.getBoundingClientRect();
    const positionX = event.clientX - timelineRect.left;
    if (positionX >= 0 && positionX <= timelineRect.width) {
      const time = (positionX / timelineRect.width) * videoDuration;
      setPinPosition(time.toFixed(1));
      setCurrentTime(time.toFixed(1));
      localStorage.setItem("pinPosition", time.toFixed(1));
    }
  };
  useEffect(() => {
    setIsEditPopupVisible(props.isEditPopup);
  }, [props.isEditPopup]);
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
            handleTimelineClick={handleTimelineClick}
            videoDuration={videoDuration}
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
            {/* {thumbnailElements} */}
            <ThumbnailTimeline videoThumbnails={videoThumbnails} />
          </div>
          <div>
            <div
              className="markedElements"
              style={{ position: "relative", height: "2.8rem" }}
            >
              <MarkedPositions
                selectedVideo={selectedVideo}
                timelineLength={videoDuration}
                setSelectedVideo={setSelectedVideo}
                setVid={setVid}
              />
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

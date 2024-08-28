/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { Builder, withChildren } from "@builder.io/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentIndexAtom,
  isThumbnailGeneratingAtom,
  isVideoLoadingAtom,
  pinPositionAtom,
  selectedVideoAtom,
  vidAtom,
  videoAtom,
  videoFilesArrayAtom,
  videoFilesAtom,
  videoSrcArrayAtom,
  videoSrcAtom,
} from "./Recoil/store";
import { handleFileChange, clearLocalStorage } from "./Utils/services";
import axios from "axios";
import { uid } from "uid";
import "./videojs.css";
import "./inputField.css";
import dropAreaPlaceholder from "./images/backup.svg";
import backupWhite from "./images/backup_white.svg";
import Spinner from "./components/spinner/Spinner";
import Alert from "./components/alert/Alert";

const InputField = (props) => {
  const inputRef = useRef(null);
  const [videoSrcArray, setVideoSrcArray] = useRecoilState(videoSrcArrayAtom);
  const setCurrentIndex = useSetRecoilState(currentIndexAtom);
  const [loading, setLoading] = useState(false);
  const [isVideoUploaded, setIsVideoUploaded] = useState(true);
  const [videoFiles, setVideoFiles] = useRecoilState(videoFilesAtom);
  const setVideoSrc = useSetRecoilState(videoSrcAtom);
  const [thumbnails, setThumbnails] = useState([]);
  const [videoArray, setVideoArray] = useRecoilState(videoFilesArrayAtom);
  const setVideo = useSetRecoilState(videoAtom);
  const [uploadPercentage, setUploadPercentage] = useState(null);
  const [vid, setVid] = useRecoilState(vidAtom);
  const setPinPosition = useSetRecoilState(pinPositionAtom);
  const [selectedVideo, setSelectedVideo] = useRecoilState(selectedVideoAtom);
  const [isVideoLoading, setVideoLoading] = useRecoilState(isVideoLoadingAtom);
  const isThumbnailGenerating = useRecoilValue(isThumbnailGeneratingAtom);
  const [isAlertVisible, setIsAlertVisible] = useState(false)
  const [alertText, setAlertText] = useState("")
  let thumbnailsFromApi = [];
  let token = localStorage.getItem("accessToken");

  useEffect(() => {
    //to remove thumbnails from iPad
    setTimeout(() => {
      if (vid.length < 1) setThumbnails([]);
      setVideoArray([]);
      // localStorage.setItem("videoArray", JSON.stringify([])); commented to resolve dropdown being emptied
    }, 1000);
  }, []);

  useEffect(() => {
    let selectedVideo = localStorage.getItem("selectedVideo");
    if (selectedVideo === null) {
      localStorage.setItem("vidData", []);
      localStorage.setItem("thumbnails", JSON.stringify([]));
    }
  }, []);
  useEffect(() => {
    const storedThumbnails =
      JSON.parse(localStorage.getItem("thumbnails")) || thumbnailsFromApi || [];
    if (selectedVideo) {
      setThumbnails(storedThumbnails);
    }
    let vidData = localStorage.getItem("vidData");
    if (vidData === null) localStorage.setItem("vidData", []);
  }, []);
  useEffect(() => {
    localStorage.setItem("thumbnails", JSON.stringify(thumbnails));
  }, [thumbnails]);

  const generateThumbnail = (videoFile, timeInSeconds) => {
    setLoading(true);
    const video = document.createElement("video");
    video.preload = "metadata";

    const reader = new FileReader();
    reader.onload = function (e) {
      video.src = e.target.result;
      video.addEventListener("loadedmetadata", () => {
        video.currentTime = timeInSeconds;
        video.addEventListener("seeked", () => {
          const canvas = document.createElement("canvas");
          canvas.width = 520;
          canvas.height = 320;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, 520, 320);

          canvas.toBlob((thumbnailBlob) => {
            let videoDuration = video.duration;
            const minutes = Math.floor(videoDuration / 60);
            const seconds = Math.floor(videoDuration % 60);
            const timestamp = `${minutes < 10 ? "0" : ""}${minutes}:${
              seconds < 10 ? "0" : ""
            }${seconds}`;
            setLoading(false);
            storeThumbnail(thumbnailBlob, timestamp);
          }, "image/jpeg");
        });
      });
    };
    reader.readAsDataURL(videoFile);
  };

  const storeThumbnail = async (thumbnailBlob, timestamp) => {
    const formData = new FormData();
    formData.append("thumbnail", thumbnailBlob, "thumbnail.jpg"); // Assuming the blob is an image

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
      setThumbnails((prevThumbnails) => [
        ...prevThumbnails,
        {
          url: `https://videosurvey.xircular.io/thumbnails/${response.data.thumbnailUrl}`,
          timestamp,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    localStorage.setItem("vidData", JSON.stringify(vid));
  }, [vid]);
  useEffect(() => {
    let selectedVideoData = JSON.parse(localStorage.getItem("selectedVideo"));
    if (selectedVideoData) {
      let newVidData = JSON.parse(localStorage.getItem("vidData"));
      const newArray = newVidData.map((item) => {
        // Replace the object with the specified ID
        if (item.id === selectedVideoData.id) {
          // Replace this object with your new object
          return { ...selectedVideoData };
        }
        // Keep other objects unchanged
        return item;
      });
      console.log("new vid data", newArray);
      localStorage.setItem("vidData", JSON.stringify(newArray));
    }
  }, [props.isEditorVisible]);

  const onFileChange = (event) => {
    event.preventDefault();
    const MAX_SIZE_MB = 100;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    const id = uid();
    const files = event.target.files;

    if (files.length > 1) {
      alert("Please select only one file.");
      return;
    }

    const file = files[0];

    if (file.size > MAX_SIZE_BYTES) {
      alert(
        `File size exceeds ${MAX_SIZE_MB} MB. Please select a smaller file.`
      );
      return;
    }

    setVideo(file);

    let videoArray = JSON.parse(localStorage.getItem("videoArray")) || [];
    if (videoArray.length < 1) videoArray.push("Select a Video");
    videoArray = [...videoArray, file.name];
    localStorage.setItem("videoArray", JSON.stringify(videoArray));
    setVideoArray(videoArray);

    handleSingleUpload(file, id);
    handleFileChange(files, setVideoFiles, generateThumbnail, videoFiles);
  };

  const handleSingleUpload = async (file, id) => {
    setIsVideoUploaded(false);
    const formData = new FormData();
    formData.append("video", file);

    const apiUrl = "https://videosurvey.xircular.io/api/v1/video/upload/media";
    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadPercentage(percentCompleted);
          if (percentCompleted === 100) {
            setVideoLoading(true);
          }
        },
      });
      console.log("Upload successful:", response.data);
      setVideoLoading(false);
      const newObject = {
        id: id,
        videoSrc: `${response.data.videoUrl.replace("/playlist.m3u8", "")}`,
        questions: [],
      };
      const vidData = JSON.parse(localStorage.getItem("vidData"));
      setVid([...vidData, newObject]);
      let newArray = [...videoSrcArray];
      // let mp4URL = response.data.videoUrl.replace("/playlist.m3u8", "");
      newArray.push(response.data.videoUrl.replace("/playlist.m3u8", ""));
      setVideoSrcArray([...newArray]);
      setTimeout(() => {
        handleThumbnailClick(newArray.length - 1);
      }, 500);
      localStorage.setItem("videoSrcArray", JSON.stringify(newArray));
      localStorage.setItem("vidData", JSON.stringify([...vidData, newObject]));
      setIsVideoUploaded(true);
      localStorage.setItem("selectedVideo", JSON.stringify({ ...newObject }));
    } catch (error) {
      setIsVideoUploaded(true);
      console.error("Error uploading data:", error);
      if (error.response.status === 401) {
        alert("Session expired. Please login again");
        window.location.href =
          "https://aiengage-samadsrahmans-projects.vercel.app/logoutRequest";
      }
    }
  };
  useEffect(() => {
    const vidData = JSON.parse(localStorage.getItem("vidData"));
    if (selectedVideo) {
      const index = vidData.findIndex((item) => item.id === selectedVideo.id);

      if (index !== -1) {
        // If an object with the same id exists, replace it with selectedVideo
        vidData[index] = selectedVideo;

        // Update localStorage with the modified vidData
        localStorage.setItem("vidData", JSON.stringify(vidData));
      }
    }
  }, [selectedVideo]);

  useEffect(() => {
    localStorage.setItem("videoFiles", JSON.stringify(videoFiles));
  }, [videoFiles]);

  const handleThumbnailClick = (index) => {
   setTimeout(()=>{
    console.log("handleThumbnailClick triggered");
    
    if (isVideoLoading || isThumbnailGenerating) {
      alert("Please wait while your video is uploading");
      return;
    }
    let thumbnails = JSON.parse(localStorage.getItem("thumbnails"));
    let videoFiles = JSON.parse(localStorage.getItem("videoFiles"));
    let videoArray = JSON.parse(localStorage.getItem("videoArray")) || [];
    setCurrentIndex(index);
    let vidArray = JSON.parse(localStorage.getItem("vidData"));
    setVid(vidArray);
    let newArray = [...vidArray];
    if (vidArray[index] && videoFiles.length > 0) {
      let obj = { ...vidArray[index] };
      obj.thumbnail = { ...thumbnails[index] };
      obj.name = videoArray[index + 1];
      setSelectedVideo(obj);
      newArray[index] = obj;
      setVid(newArray);
      localStorage.setItem("selectedVideo", JSON.stringify(obj));
      setVideoSrc(videoFiles[index]);
      localStorage.setItem("questionsArray", JSON.stringify([]));
      localStorage.setItem("pinPosition", 0);
      setPinPosition(0);
    }
   },1000)
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const MAX_SIZE_MB = 100;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    const id = uid();
    const files = event.dataTransfer.files;

    if (files.length > 1) {
      alert("Please select only one file.");
      return;
    }

    const file = files[0];

    if (file.size > MAX_SIZE_BYTES) {
      alert(
        `File size exceeds ${MAX_SIZE_MB} MB. Please select a smaller file.`
      );
      return;
    }

    setVideo(file);

    let videoArray = JSON.parse(localStorage.getItem("videoArray")) || [];
    if (videoArray.length < 1) videoArray.push("Select a Video");
    videoArray = [...videoArray, file.name];
    localStorage.setItem("videoArray", JSON.stringify(videoArray));
    setVideoArray(videoArray);

    handleSingleUpload(file, id);
    handleFileChange(files, setVideoFiles, generateThumbnail, videoFiles);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleThumbnailDelete = (thumbnail, index) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(
        "This action will delete the video, are you sure you want to continue?"
      )
    ) {
      // Update thumbnails
      const updatedThumbnails = thumbnails.filter((ele) => ele !== thumbnail);
      setThumbnails(updatedThumbnails);
      localStorage.setItem("thumbnails", JSON.stringify(updatedThumbnails));

      // Update video list
      const updatedVid = [...vid];
      updatedVid.splice(index, 1);
      setVid(updatedVid);

      // Update video files
      const updatedVideoFiles = [...videoFiles];
      updatedVideoFiles.splice(index, 1);
      setVideoFiles(updatedVideoFiles);
      localStorage.setItem("videoFiles", JSON.stringify(updatedVideoFiles));

      // Reset selected video
      const emptySelectedVideo = {};
      setSelectedVideo(emptySelectedVideo);
      localStorage.setItem("selectedVideo", JSON.stringify(emptySelectedVideo));

      // Update video array
      const videoArray = JSON.parse(localStorage.getItem("videoArray")) || [];
      videoArray.splice(index + 1, 1);
      localStorage.setItem("videoArray", JSON.stringify(videoArray));
      setVideoArray(videoArray);
    }
  };

  return (
    <div
      {...props.attributes}
      className={`my-class ${props.attributes.className}`}
    >
      {isAlertVisible && <Alert />}
      <div>
        {thumbnails.length < 1 && (
          <div
            className="drop-area"
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
            onDragOver={handleDragOver}
            style={{
              display: videoFiles.length > 0 ? "none" : "flex",
            }}
          >
            <div className="placeholderImg">
              <img src={dropAreaPlaceholder} alt="" />
              <span className="dropAreaHeader">Upload File</span>
              <span className="dropAreaText">
                Click to drop, or drag & drop your file
              </span>
            </div>
          </div>
        )}
        <input
          type="file"
          accept="video/mp4"
          multiple={false}
          onChange={onFileChange}
          style={{ display: "none" }}
          id="fileInput"
          ref={inputRef}
        />
      </div>
      <div
        className="inputHeader"
        style={thumbnails.length > 0 ? {} : { display: "none" }}
      >
        <span className="inputHeading">
          {thumbnails.length} {thumbnails.length === 1 ? "Video" : "Videos"}
        </span>
        <button
          className="uploadBtnDiv"
          onClick={() => inputRef.current.click()}
          disabled={isVideoLoading || isThumbnailGenerating}
          style={
            isVideoLoading || isThumbnailGenerating
              ? { cursor: "not-allowed", backgroundColor: "grey" }
              : {}
          }
        >
          <img src={backupWhite} alt="" />
          <span>Upload file</span>
        </button>
      </div>
      <div
        className="thumbnails"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={thumbnails.length > 0 ? {} : { display: "none" }}
      >
        {thumbnails.map((thumbnail, index) => (
          <div className="thumbnailImgWrapper" key={index}>
            <img
              style={
                uploadPercentage < 100 &&
                index === thumbnails.length - 1 &&
                videoFiles.length === thumbnails.length
                  ? { filter: `brightness(${uploadPercentage}%)` }
                  : JSON.parse(localStorage.getItem("vidData"))[index]?.id ===
                    selectedVideo.id
                  ? { border: "3px solid #4D67EB" }
                  : {}
              }
              src={thumbnail.url}
              alt={`Thumbnail ${index + 1}`}
              onClick={() =>
                uploadPercentage < 100 &&
                !isVideoUploaded &&
                videoFiles.length === thumbnails.length &&
                index === thumbnails.length - 1
                  ? {}
                  : handleThumbnailClick(index)
              }
              className="thumbnailImg"
            ></img>
            <span className="timestamp">{thumbnail.timestamp}</span>
            <span
              className="uploadPercentage"
              style={
                uploadPercentage < 100 &&
                videoFiles.length === thumbnails.length &&
                index === thumbnails.length - 1
                  ? !isVideoUploaded
                    ? {}
                    : { display: "none" }
                  : { display: "none" }
              }
            >
              {uploadPercentage}%
            </span>
            <span
              className="crossIcon"
              onClick={() => handleThumbnailDelete(thumbnail, index)}
            >
              &#10006;
            </span>
            <span className="name">
              {JSON.parse(localStorage.getItem("videoArray"))[index + 1]}
            </span>
          </div>
        ))}
        {loading && (
          // <div className="loader-container">
          //   <div className="loader"></div>
          // </div>
          <div className="spinnerWrapper">
            <Spinner size="medium" />
          </div>
        )}
      </div>
    </div>
  );
};
export default InputField;

export const InputFieldWithChildren = withChildren(InputField);
Builder.registerComponent(InputFieldWithChildren, {
  name: "InputField",
  defaultChildren: [],
  noWrap: true,
  inputs: [
    { name: "content", type: "text" },
    { name: "color", type: "color" },
    { name: "fontSize", type: "text" },
    { name: "backgroundColor", type: "color" },
    { name: "height", type: "text" },
    { name: "isEditorVisible", type: "boolean" },
  ],
});

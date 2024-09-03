/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { Builder, withChildren } from "@builder.io/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentIndexAtom,
  pinPositionAtom,
  selectedVideoAtom,
  vidAtom,
  videoAtom,
  videoDataAtom,
  videoFilesArrayAtom,
  videoFilesAtom,
  videoSrcArrayAtom,
  videoSrcAtom,
} from "../Recoil/store";
import { handleFileChange } from "../Utils/services";
import axios from "axios";
import { uid } from "uid";
import "../videojs.css";
import "../inputField.css";
import backup from "../images/backup.svg";
import backupWhite from "../images/backup_white.svg";


const InputFieldEdit = (props) => {
  const setCurrentIndex = useSetRecoilState(currentIndexAtom)
  const inputRef = useRef(null);
let token = localStorage.getItem("accessToken")
  const [loading, setLoading] = useState(false);
  const [isVideoUploaded, setIsVideoUploaded] = useState(true);
  const [videoFiles, setVideoFiles] = useRecoilState(videoFilesAtom);
  const setVideoSrc = useSetRecoilState(videoSrcAtom);
  const videoData = useRecoilValue(videoDataAtom)
  const videoArray = useRecoilValue(videoFilesArrayAtom)
  const [thumbnails, setThumbnails] = useState([]);
  const [video, setVideo] = useRecoilState(videoAtom);
  const [uploadPercentage, setUploadPercentage] = useState(null);
  const [vid, setVid] = useRecoilState(vidAtom);
  const setPinPosition = useSetRecoilState(pinPositionAtom);
  const [selectedVideo, setSelectedVideo] = useRecoilState(selectedVideoAtom);
 

useEffect(()=>{
  console.log("videoData changed",vid , thumbnails)
  let thumbs = vid?.map((ele)=>{
    return ele.thumbnail
  })
  console.log("line 50", thumbs);

  if (thumbs !== undefined && thumbs.every(thumb => thumb !== undefined && typeof(thumb)==='object')) {
    setThumbnails(thumbs);
  } else {
    console.log("Some elements in thumbs are undefined or thumbs itself is undefined");
  }  
},[vid])


  useEffect(() => {
    console.log(thumbnails);
    localStorage.setItem("thumbnails", JSON.stringify(thumbnails));
  }, [thumbnails]);


  const generateThumbnail = (videoFile, timeInSeconds) => {
    console.log("Edit check: generateTbumbnail triggered in InputField")
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
          canvas.width = 480;
          canvas.height = 320;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, 480, 320);
  
          canvas.toBlob((thumbnailBlob) => {
            let videoDuration = video.duration;
            const minutes = Math.floor(videoDuration / 60);
            const seconds = Math.floor(videoDuration % 60);
            const timestamp = `${minutes < 10 ? "0" : ""}${minutes}:${
              seconds < 10 ? "0" : ""
            }${seconds}`;
            setLoading(false);
            storeThumbnail(thumbnailBlob, timestamp)
          }, "image/jpeg");
        });
      });
    };
    reader.readAsDataURL(videoFile);
  };

  const  storeThumbnail = async (thumbnailBlob, timestamp) => {
    const formData = new FormData();
    formData.append('thumbnail', thumbnailBlob, 'thumbnail.jpg'); // Assuming the blob is an image
  
  
    try{
      const response = await axios.post("https://videosurvey.xircular.io/api/v1/video/upload/thumbnail", formData, {
        headers:{
          "Content-Type":'multipart/form-data',
           Authorization: `Bearer ${token}` 
        }
      })
      console.log("line 116",response.data)
      setThumbnails((prevThumbnails) => [
                ...prevThumbnails,
                { url:`https://videosurvey.xircular.io/thumbnails/${response.data.thumbnailUrl}` , timestamp },
              ]);
  
    }
    catch(error){
      console.log(error)
      
    }
  
    };

  useEffect(() => {
    localStorage.setItem("vidData", JSON.stringify(vid));
  }, [vid]);
  useEffect(() => {
    let selectedVideoData = JSON.parse(localStorage.getItem("selectedVideo"));
    console.log("selectedVideo when editor is changed", selectedVideoData);
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

    const id = uid();
    const file = event.target.files[0];
    const currentVideo = event.target.files[0];
    console.log("Video name", currentVideo.name)
    setVideo(video);
    let videoArray = JSON.parse(localStorage.getItem("videoArray")) || [];
    if (videoArray.length < 1) videoArray.push("Select a Video");
    videoArray = [...videoArray, event.target.files[0].name];
    console.log(videoArray)
    localStorage.setItem("videoArray", JSON.stringify(videoArray));
    const files = event.target.files;
    handleSingleUpload(file, id);
    handleFileChange(files, setVideoFiles, generateThumbnail, videoFiles);
  };
  const handleSingleUpload = async (file, id) => {
    console.log("access token", token)
    setIsVideoUploaded(false);
    const formData = new FormData();
    formData.append("video", file);
    
    
    const apiUrl = "https://videosurvey.xircular.io/api/v1/video/upload/media";
    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization":`Bearer ${token}` 
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadPercentage(percentCompleted);
        },
      });
      console.log("Upload successful:", response.data);
      const newObject = {
        id: id,
        videoSrc: `${response.data.videoUrl.replace("/playlist.m3u8", "")}`,
        questions: [],
      };
      setVid([...vid, newObject]);
      setIsVideoUploaded(true);
      let videoFiles = JSON.parse(localStorage.getItem("videoFiles"));

      setTimeout(() => {
        handleThumbnailClick(videoFiles.length-1  );
      }, 1000);
      localStorage.setItem("vidData", JSON.stringify([...vid, newObject]));
      console.log("vidData updated", vid);
      setIsVideoUploaded(true);
      setSelectedVideo(newObject)
      console.log("Edit check: selectedVideo updated at handleSingleUpload", newObject)
      localStorage.setItem("selectedVideo", JSON.stringify({ ...newObject }));

      
    } catch (error) {
      console.error("Error uploading data:", error);
      if(error.response.status===401){
        alert("Session expired. Please login again")
        window.location.href = "https://aiengage-samadsrahmans-projects.vercel.app/logoutRequest"
      }
    }
  };
  useEffect(() => {
    localStorage.setItem("videoFiles", JSON.stringify(videoFiles));
  }, [videoFiles]);

  const handleThumbnailClick = (index) => {
    console.log("handleClick index",index)
    setCurrentIndex(index)
    let vidArray = JSON.parse(localStorage.getItem("vidData"));
    const videoFiles = JSON.parse(localStorage.getItem("videoFiles"));
    let thumbnails = JSON.parse(localStorage.getItem("thumbnails"));
    console.log("line 50 from HTC",thumbnails)
    console.log("videoFiles from ife", videoFiles)
    console.log("line 228", videoFiles[index])
    setVideoSrc(videoFiles[index]);
    setVid(vidArray);
    if (vidArray[index]) {
      let obj = { ...vidArray[index] };
      obj.thumbnail = thumbnails[index];
      if(obj.questions===undefined)
      obj.questions = []
      console.log(obj);
      setSelectedVideo(obj);
      localStorage.setItem("selectedVideo", JSON.stringify(obj));
      console.log("video source",videoFiles[index]);
      setVideoSrc(videoFiles[index]);
      localStorage.setItem("questionsArray", JSON.stringify([]));
      localStorage.setItem("pinPosition", 0);
      setPinPosition(0);
    }
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFileChange(files, setVideoFiles, generateThumbnail);
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleThumbnailDelete = (thumbnail, index) => {
    const updatedThumbnails = [...thumbnails];
    const newThumbnails = updatedThumbnails.filter((ele) => ele != thumbnail);
    setThumbnails(newThumbnails);
    localStorage.setItem("thumbnails", JSON.stringify(newThumbnails));
    const newVideo = [...vid];
    newVideo.splice(index, 1);
    setVid(newVideo);
    const newVideoFiles = [...videoFiles];
    newVideoFiles.splice(index, 1);
    setVideoFiles(newVideoFiles);
    let videoArray = JSON.parse(localStorage.getItem("videoArray")) || [];
    videoArray.splice(index + 1, 1);
    localStorage.setItem("videoArray", JSON.stringify(videoArray));
    setSelectedVideo(null)
    localStorage.setItem("selectedVideo", null)
  };
  return (
    <div
      {...props.attributes}
      className={`my-class ${props.attributes.className}`}
    >
      <div
        className="drop-area"
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        onDragOver={handleDragOver}
        style={{
          display: thumbnails.length > 0 ? "none" : "flex",
        }}
      >
         {/* {thumbnails.length < 1 && (
          <div className="placeholderImg">
          
          <img src={backup} alt="" />
          <span className="dropAreaHeader">Upload File</span>
          <span className="dropAreaText">Click to drop, or
drag & drop your file</span>
          </div>
        )} */}
        <input
          type="file"
          accept="video/*"
          multiple
          // onChange={onFileChange}
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
        {/* <div className="uploadBtnDiv" onClick={() => inputRef.current.click()}>
          <img src={backupWhite} alt="" />
          <span>Upload file</span>
        </div> */}
      </div>
      <div className="thumbnails">
      {thumbnails.map((thumbnail, index) => (
          <div className="thumbnailImgWrapper" key={index}>
            <img
                style={
                  uploadPercentage < 100 &&
                  index === thumbnails.length - 1 &&
                  videoFiles.length !== thumbnails.length
                    ? { filter: `brightness(${uploadPercentage}%)` }
                    : JSON.parse(localStorage.getItem("vidData"))[index]?.id===selectedVideo.id?{border:"3px solid #4D67EB"}:{}
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
            <span className="name">{videoArray[index+1]}</span>
          </div>
        ))}
        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
};
export default InputFieldEdit;

export const InputFieldWithChildrenEdit = withChildren(InputFieldEdit);
Builder.registerComponent(InputFieldWithChildrenEdit, {
  name: "InputFieldEdit",
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

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { uid } from "uid";
import axios from "axios";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import VideoJsEdit from "./VideojsEdit";
import InputFieldWithChildrenEdit from "./InputFieldEdit";
import VideoTimelineEdit from "./videoTimelineEdit";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import {
  videoFilesAtom,
  videoSrcAtom,
  questionPopupVisibleAtom,
  currentTimeAtom,
  videoAtom,
  markedPositionAtom,
  isViewMessagePopupVisibleAtom,
  isEditPopupAtom,
  selectedVideoAtom,
  questionIndexAtom,
  selectedQuestionAtom,
  isEditorVisibleAtom,
  fileNameAtom,
  videoDataAtom,
  vidAtom,
  videoSrcArrayAtom,
  videoFilesArrayAtom,
} from "../Recoil/store";
import {
  addQuestion,
  getSelectedQuestion,
  editQuestions,
  handleDeleteQuestion,
  handleUpdate,
  updateSubVideo,
} from "../Utils/services";
import { useNavigate, useParams } from "react-router-dom";
import TimelineSection from "../components/timelineSection/TimelineSection";
import Navbar from "../components/navbar/Navbar";

builder.init("403c31c8b557419fb4ad25e34c2b4df5");

export default function EditCampaign() {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useRecoilState(fileNameAtom);
  const isEditorVisible = useRecoilValue(isEditorVisibleAtom);
  const selectedQuestion = useRecoilValue(selectedQuestionAtom);
  const [selectedVideo, setSelectedVideo] = useRecoilState(selectedVideoAtom);
  const [isViewMessagePopupVisible, setIsViewMessagePopupVisible] =
    useRecoilState(isViewMessagePopupVisibleAtom);
  const setVideoSrc = useSetRecoilState(videoSrcAtom);
  const setVideoArray = useSetRecoilState(videoFilesArrayAtom);
  const isEditPopup = useRecoilValue(isEditPopupAtom);
  const [playerVideoSrc, setPlayerVideoSrc] = useState("");
  const [markedPositions, setMarkedPositions] =
    useRecoilState(markedPositionAtom);
    const [questionPopupVisible,setQuestionPopupVisible] = useRecoilState(questionPopupVisibleAtom);
    const isPreviewingInBuilder = useIsPreviewing();
  const [notFound, setNotFound] = useState(false);
  const [content, setContent] = useState(null);
  const videoSrc = useRecoilValue(videoSrcAtom);
  const setVideoData = useSetRecoilState(videoDataAtom);
  const setVid = useSetRecoilState(vidAtom);
  const video = useRecoilValue(videoAtom);
  const currentTime = useRecoilValue(currentTimeAtom);
  const videoFiles = useRecoilValue(videoFilesAtom);
  const questions = [];
  const questionIndex = useRecoilValue(questionIndexAtom);
  const setVideoFiles = useSetRecoilState(videoFilesAtom)

  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    //fetching data for questions
    let token = localStorage.getItem("accessToken")
    fetch(`https://videosurvey.xircular.io/api/v1/video/getVideoById/${id}`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.data);
        console.log("videoData", data.data.videoData);

        let dataFromApi = (data.data.videoSelectedFile);
        setSelectedVideo(dataFromApi);
        console.log("Edit check: selectedVideo updated according to API Response", dataFromApi)
        localStorage.setItem("selectedVideo", JSON.stringify({...dataFromApi}));
        let names = data.data.videoData.map((ele)=>ele.name)
       names.unshift("Select a video")
       console.log("names", names)

        localStorage.setItem("videoArray", JSON.stringify(names))
        setVideoArray(names)
        console.log("videoArray updated")
        localStorage.setItem("editId", data.data.video_id);
        localStorage.setItem("fileName", data.data.title);
        let newVideoFiles = [...data.data.videoFileUrl]

        localStorage.setItem("videoFiles", JSON.stringify(newVideoFiles))
        setVideoFiles(newVideoFiles)
        localStorage.setItem(
          "videoSrcArray",
          JSON.stringify(data.data.videoFileUrl)
        );
        setFileName(data.data.title);
        setVideoSrc(dataFromApi.videoSrc);
        setVid([...data.data.videoData]);
        localStorage.setItem("vidData", JSON.stringify(data.data.videoData))
        console.log(dataFromApi);
      })
      .catch((error) => {
        console.error("There was a problem fetching the data:", error);
      });
  }, []);

  useEffect(()=>{
    const vidData = JSON.parse(localStorage.getItem("vidData"))
      console.log("line 1211")
 setTimeout(()=>{
  const videoArray = JSON.parse(localStorage.getItem("videoArray"))

  if(videoArray?.length<1){
    const names = vidData.map((ele)=>ele.name)
    names.unshift("Select a video")
    console.log("line 126",names)
    localStorage.setItem("videoArray", JSON.stringify(names))
    console.log("videoArray updated")

  }
 }, 1000)
  },[isEditorVisible])

  useEffect(() => {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/");
    }
  }, []);
  useEffect(()=>console.log("line 124",isEditorVisible),[isEditorVisible])
  const addQuestions = (question) => {
    addQuestion(question);
    let selectedVideo = localStorage.getItem("selectedVideo");
    if (selectedVideo !== undefined) selectedVideo = JSON.parse(selectedVideo);
    setSelectedVideo(selectedVideo);
  };
  const editQuestion = (questionObject, selectedId) => {
    editQuestions(questionObject, selectedId);
    let selectedVideo = localStorage.getItem("selectedVideo");
    if (selectedVideo !== undefined) selectedVideo = JSON.parse(selectedVideo);
    setSelectedVideo(selectedVideo);
  };
  const markPosition = (markedPositions) => {
    let pinPosition = localStorage.getItem("pinPosition");
    if (pinPosition !== undefined) pinPosition = JSON.parse(pinPosition);
    if (pinPosition !== null) {
      setMarkedPositions([...markedPositions, pinPosition]);
    }
  };
  const getVidData = (data) => {
    console.log("data from builder", data);
    setTimeout(() => {
      localStorage.setItem("vidData", JSON.stringify(data));
    }, 500);
  };
  useEffect(() => {
    async function fetchContent() {
      const content = await builder
        .get("page", {
          url: "/editor-edit",
        })
        .promise();
      setContent(content);
      setNotFound(!content);
      if (content?.data.title) {
        document.title = "Edit campaign";
      }
    }
    fetchContent();
  }, []);

  if (notFound && !isPreviewingInBuilder) {
    return <div>404</div>;
  }

  const onClose = ()=>{
    setQuestionPopupVisible(false)
  }

  // localStorage.setItem("fileName", JSON.stringify("Untitled"));
  const handleUpdate = async () => {
    let videoSrcArray = JSON.parse(localStorage.getItem("videoSrcArray"));

    let token = localStorage.getItem("accessToken");

    let editId = localStorage.getItem("editId");
    let vidData = JSON.parse(localStorage.getItem("vidData"));

    let selectedVideo = JSON.parse(localStorage.getItem("selectedVideo"));
    const originalObject = { ...selectedVideo };
    const updatedQuestions = updateSubVideo(originalObject.questions, vidData);
    const updatedObject = { ...originalObject, questions: updatedQuestions };
    console.log("Updated Object", updatedObject);
    const index = vidData.findIndex((item) => item.id === updatedObject.id);

    if (index !== -1) {
      vidData[index] = updatedObject;
      console.log(vidData[index]);
      localStorage.setItem("vidData", JSON.stringify(vidData));
    }
    const selectedVideoJSON = JSON.stringify(updatedObject);
    //parse removed from title due to errors while saving edit
    const title = (localStorage.getItem("fileName"))
    console.log(title);
    let object = {
      title: title,
      videoSelectedFile: selectedVideoJSON,
      videoFileUrl: videoSrcArray ? videoSrcArray : [],
      videoData: vidData,
    };
    console.log(object);
    console.log("Access token", token);
    const apiUrl = `https://videosurvey.xircular.io/api/v1/video/updateVideo/${editId}`;
    try {
      setIsUploading(true);
      const response = await axios.put(apiUrl, object, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Upload successful:", response.data);
      setIsUploading(false);
      alert("File uploaded successfully");
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading data:", error);
    }
  };
  return (
    <>
      <BuilderComponent
        model="page"
        content={content}
        data={{
          isUploading: isUploading,
          selectedVideo: { ...selectedVideo },
          selectedQuestion: selectedQuestion,
          isEditPopup: isEditPopup,
          playerVideoSrc: playerVideoSrc,
          markedPositions: markedPositions,
          fileName: fileName,

          video: video,
          axios: axios,
          questionPopupVisible: questionPopupVisible,
          currentTime: currentTime,
          videoScr: videoSrc,
          videoFiles: videoFiles,
          answersCount: [],
          questionsArray: questions,
          newQuestionArray: [],
          isEditorVisible: isEditorVisible,
          questionIndex: questionIndex,
          isViewMessagePopupVisible: isViewMessagePopupVisible,
          questionsObject: {
            time: "",
            id: "",
            question: "",
            answers: [{}],
            multiple: true,
            skip: true,
          },
          answersObject: {
            id: uid(),
            answer: "",
          },
        }}
        context={{
          getId: () => {
            let id = uid();
            return id;
          },
          addQuestion: (question) => {
            addQuestions(question);
          },
          markPosition: (markedPositions) => {
            markPosition(markedPositions);
          },
          handleUpload: () => handleUpdate(),
          getSelectedQuestion: () => getSelectedQuestion(),
          editQuestions: (questionsObject, selectedId) =>
            editQuestion(questionsObject, selectedId),
          handleDeleteQuestion: (mainArray, mainArrayItem) =>
            handleDeleteQuestion(mainArray, mainArrayItem),
          getVidData: (data) => getVidData(data),
          onClose:()=>onClose(),
        }}
      />
         {!isEditorVisible &&    <TimelineSection/>}
    </>
  );
}

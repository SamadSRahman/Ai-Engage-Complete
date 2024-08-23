/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { uid } from "uid";
import axios from "axios";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import VideoJs from "./Videojs";
import InputFieldWithChildren from "./InputField";
import Navbar from "./components/navbar/Navbar";
import SideNavbar from "./components/sideNavbar/SideNavbar";
import VideoTimeline from "./videoTimeline";
import PointerComponent from "./components/pointerComponent/PointerComponent";
import { useRecoilValue, useRecoilState } from "recoil";
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
  videoListAtom,
} from "./Recoil/store";
import {
  addQuestion,
  getSelectedQuestion,
  editQuestions,
  handleDeleteQuestion,
  clearStorage,
} from "./Utils/services";
import TimelineSection from "./components/timelineSection/TimelineSection";
import Alert from "./components/alert/Alert";

builder.init("403c31c8b557419fb4ad25e34c2b4df5");

export default function CreateCampaign() {
  const fileName = useRecoilValue(fileNameAtom);
  const isEditorVisible = useRecoilValue(isEditorVisibleAtom);
  const selectedQuestion = useRecoilValue(selectedQuestionAtom);
  const [selectedVideo, setSelectedVideo] = useRecoilState(selectedVideoAtom);
  const [isViewMessagePopupVisible, setIsViewMessagePopupVisible] =
    useRecoilState(isViewMessagePopupVisibleAtom);
const [isUploading, setIsUploading] = useState(false)
  const isEditPopup = useRecoilValue(isEditPopupAtom);
  const [playerVideoSrc, setPlayerVideoSrc] = useState("");
  const [markedPositions, setMarkedPositions] =
    useRecoilState(markedPositionAtom);
  const [questionPopupVisible,setQuestionPopupVisible] = useRecoilState(questionPopupVisibleAtom);
  const isPreviewingInBuilder = useIsPreviewing();
  const [notFound, setNotFound] = useState(false);
  const [content, setContent] = useState(null);
  const videoSrc = useRecoilValue(videoSrcAtom);
  const video = useRecoilValue(videoAtom);
  const currentTime = useRecoilValue(currentTimeAtom);
  const videoFiles = useRecoilValue(videoFilesAtom);
  const [isAlertVisible, setIsAlertVisible] = useState(false)
  const questions = [];
  const videoList = useRecoilValue(videoListAtom)
  const questionIndex = useRecoilValue(questionIndexAtom);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const vidData = JSON.parse(localStorage.getItem("videoArray")) || [];
      if (vidData.length > 0) {
        event.preventDefault();
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
  
    const handlePopState = (event) => {
      const vidData = JSON.parse(localStorage.getItem("videoArray")) || [];
  
      if (vidData.length > 0) {
        const confirmNavigation = window.confirm('You have unsaved changes. Are you sure you want to leave?');
        
        if (confirmNavigation) {
          clearLocalStorage();
          // Allow the navigation to proceed
          return;
        } else {
          // If the user clicks "Cancel", prevent navigation
          event.preventDefault();
          window.history.pushState(null, '', window.location.pathname);
        }
      }
    };
  
    const clearLocalStorage = () => {
      const accessToken = localStorage.getItem("accessToken");
      const adminDetails = localStorage.getItem("adminDetails");
  
      localStorage.clear();
      console.log("Clear event triggered");
  
      if (accessToken !== null) {
        localStorage.setItem("accessToken", accessToken);
      }
      if (adminDetails !== null) {
        localStorage.setItem("adminDetails", adminDetails);
      }
    };
  
    // Push a state when the component mounts
    window.history.pushState(null, '', window.location.pathname);
  
    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
  
    return () => {
      // Remove event listeners
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(()=>{
    document.title="Create new campaign"
    let accessToken = localStorage.getItem("accessToken")
    if(!accessToken){
      // window.location.href = "https://aiengage-samadsrahmans-projects.vercel.app/"
    }
  },[])

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
          url: "/editor",
        })
        .promise();
      setContent(content);
      setNotFound(!content);
      if (content?.data.title) {
        // document.title = content.data.title;
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
  return (
    <div style={{height:'100vh', backgroundColor:'rgba(245, 245, 245, 1)'}}>
  {isAlertVisible &&   <Alert
    text={"You have unsaved data, are you sure you want to leave this page?"}
    primaryBtnText={"Yes"}
    title={"Alert"}
    secondaryBtnText={"No"}
    onClose={()=>setIsAlertVisible(false)}
    onSuccess={()=>{clearStorage(); setIsAlertVisible(false)}}
    />}
      <BuilderComponent
        model="page"
        content={content}
        data={{
          videoList:[...videoList],
          isUploading:isUploading,
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
          onClose:()=>onClose(),
          markPosition: (markedPositions) => {
            markPosition(markedPositions);
          },
          getSelectedQuestion: () => getSelectedQuestion(),
          editQuestions: (questionsObject, selectedId) =>
            editQuestion(questionsObject, selectedId),
          handleDeleteQuestion: (mainArray, mainArrayItem) =>
            handleDeleteQuestion(mainArray, mainArrayItem),
          getVidData: (data) => getVidData(data),
        }}
      />
   {!isEditorVisible &&    <TimelineSection/>}
    </div>
  );
}

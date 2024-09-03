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
  getSelectedQuestion,
  handleDeleteQuestion,
  clearStorage,
} from "./Utils/services";
import TimelineSection from "./components/timelineSection/TimelineSection";
import Alert from "./components/alert/Alert";
import { useNavigate } from "react-router-dom";
import SkeletonPage from "./components/skeletons/SkeletonPage";
import "./App.css";

builder.init("403c31c8b557419fb4ad25e34c2b4df5");

export default function App() {
  const [fileName, setFileName] = useRecoilState(fileNameAtom);
  const isEditorVisible = useRecoilValue(isEditorVisibleAtom);
  const selectedQuestion = useRecoilValue(selectedQuestionAtom);
  const [selectedVideo, setSelectedVideo] = useRecoilState(selectedVideoAtom);
  const [isViewMessagePopupVisible, setIsViewMessagePopupVisible] =
    useRecoilState(isViewMessagePopupVisibleAtom);
  const [isUploading, setIsUploading] = useState(false);
  const isEditPopup = useRecoilValue(isEditPopupAtom);
  const [playerVideoSrc, setPlayerVideoSrc] = useState("");
  const [markedPositions, setMarkedPositions] =
    useRecoilState(markedPositionAtom);
  const [questionPopupVisible, setQuestionPopupVisible] = useRecoilState(
    questionPopupVisibleAtom
  );
  const isPreviewingInBuilder = useIsPreviewing();
  const [notFound, setNotFound] = useState(false);
  const [content, setContent] = useState(null);
  const videoSrc = useRecoilValue(videoSrcAtom);
  const video = useRecoilValue(videoAtom);
  const currentTime = useRecoilValue(currentTimeAtom);
  const videoFiles = useRecoilValue(videoFilesAtom);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const questions = [];
  const videoList = useRecoilValue(videoListAtom);
  const questionIndex = useRecoilValue(questionIndexAtom);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const thumbnails = JSON.parse(localStorage.getItem("thumbnails"));
    console.log();
    const unloadCallback = (event) => {
      if (thumbnails.length > 0) {
        console.log("Reload condition triggered", thumbnails);
        event.preventDefault();
        event.returnValue = "";
        return "";
      }
    };
    window.addEventListener("beforeunload", unloadCallback);
    clearLocalStorage();
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

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
  const getVidData = (data) => {
    console.log("data from builder", data);
    setTimeout(() => {
      localStorage.setItem("vidData", JSON.stringify(data));
    }, 500);
  };

  useEffect(() => {
    async function fetchContent() {
      setIsLoading(true);
      const content = await builder
        .get("page", {
          url: "/editor",
        })
        .promise();
      setContent(content);
      setNotFound(!content);
      setIsLoading(false);
    }
    fetchContent();
    document.title = "Create new campaign";
    let accessToken = localStorage.getItem("accessToken");
    setFileName("");
    if (!accessToken) {
      navigate("/");
    }
  }, []);

  if (notFound && !isPreviewingInBuilder) {
    return <div>404</div>;
  }
  if (isLoading) {
    return <SkeletonPage />;
  }
  return (
    <div className="CreateContainer">
      {isAlertVisible && (
        <Alert
          text={
            "You have unsaved data, are you sure you want to leave this page?"
          }
          primaryBtnText={"Yes"}
          title={"Alert"}
          secondaryBtnText={"No"}
          onClose={() => setIsAlertVisible(false)}
          onSuccess={() => {
            clearStorage();
            setIsAlertVisible(false);
          }}
        />
      )}
      <Navbar isrightsidemenu={true} />
      <BuilderComponent
        model="page"
        content={content}
        data={{
          videoList: [...videoList],
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
          getSelectedQuestion: () => getSelectedQuestion(),
          handleDeleteQuestion: (mainArray, mainArrayItem) =>
            handleDeleteQuestion(mainArray, mainArrayItem),
          getVidData: (data) => getVidData(data),
        }}
      />
      {!isEditorVisible && <TimelineSection />}
    </div>
  );
}

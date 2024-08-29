/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { uid } from "uid";
import axios from "axios";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import VideoJsEdit from "./VideojsEdit";
import InputFieldWithChildrenEdit from "./InputFieldEdit";
import VideoTimelineEdit from "./videoTimelineEdit";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import isEqual from 'lodash/isEqual';
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
  isSaveBtnVisibleForEditAtom,
  reloadCounterForEditAtom,
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
import SkeletonPage from "../components/skeletons/SkeletonPage";


builder.init("403c31c8b557419fb4ad25e34c2b4df5");

export default function Builder() {
  const videoDataForEdit = useRef();
  const titleRefForEdit = useRef();
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useRecoilState(fileNameAtom);
  const isEditorVisible = useRecoilValue(isEditorVisibleAtom);
  const selectedQuestion = useRecoilValue(selectedQuestionAtom);
  const [selectedVideo, setSelectedVideo] = useRecoilState(selectedVideoAtom);
  const [isViewMessagePopupVisible, setIsViewMessagePopupVisible] =
    useRecoilState(isViewMessagePopupVisibleAtom);
  const setVideoSrc = useSetRecoilState(videoSrcAtom);
  const [videoArray, setVideoArray] = useRecoilState(videoFilesArrayAtom);
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
  const setVideoData = useSetRecoilState(videoDataAtom);
  const [vid, setVid] = useRecoilState(vidAtom);
  const video = useRecoilValue(videoAtom);
  const currentTime = useRecoilValue(currentTimeAtom);
  const [videoFiles, setVideoFiles] = useRecoilState(videoFilesAtom);
  const questions = [];
  const questionIndex = useRecoilValue(questionIndexAtom);
  const [isSaveBtnVisibleForEdit, setIsSaveBtnVisibleForEdit] = useRecoilState(
    isSaveBtnVisibleForEditAtom
  );
  const reloadCounterForEdit = useRecoilValue(reloadCounterForEditAtom);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    setLoading(true);
    let token = localStorage.getItem("accessToken");
    fetch(`https://videosurvey.xircular.io/api/v1/video/getVideoById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        let dataFromApi = data.data.videoSelectedFile;
        setSelectedVideo(dataFromApi);
        console.log(
          "Edit check: selectedVideo updated according to API Response",
          dataFromApi
        );
        localStorage.setItem(
          "selectedVideo",
          JSON.stringify({ ...dataFromApi })
        );
        let names = data.data.videoData.map((ele) => ele.name);
        names.unshift("Select a video");
        localStorage.setItem("videoArray", JSON.stringify(names));
        if(names.length>0){
         setTimeout(()=> setVideoArray(names), 2000)
          console.log("Value of videoArray updated", names)
        }
        localStorage.setItem("editId", data.data.video_id);
        titleRefForEdit.current = data.data.title;
        setFileName(data.data.title);
        let newVideoFiles = [...data.data.videoFileUrl];
        localStorage.setItem("videoFiles", JSON.stringify(newVideoFiles));
        setVideoFiles(newVideoFiles);
        localStorage.setItem(
          "videoSrcArray",
          JSON.stringify(data.data.videoFileUrl)
        );
        setVideoSrc(dataFromApi.videoSrc);
        setVid([...data.data.videoData]);
        videoDataForEdit.current = [...data.data.videoData];
        localStorage.setItem("vidData", JSON.stringify(data.data.videoData));
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false);
        console.error("There was a problem fetching the data:", error);
      });
  }, [reloadCounterForEdit]);



  useEffect(() => {
    console.log("Save btn", videoDataForEdit.current, vid, fileName, titleRefForEdit.current);
    
    if (
      !isEqual(videoDataForEdit.current, vid) || // Deep comparison
      titleRefForEdit.current !== fileName // Simple string comparison
    ) {
      setIsSaveBtnVisibleForEdit(true);
    } else {
      setIsSaveBtnVisibleForEdit(false);
    }
  }, [vid, fileName]);

  useEffect(() => {
    const vidData = JSON.parse(localStorage.getItem("vidData"));
    setTimeout(() => {
      const videoArray = JSON.parse(localStorage.getItem("videoArray"));
      if (videoArray?.length < 1) {
        const names = vidData.map((ele) => ele.name);
        names.unshift("Select a video");
        console.log("line 126", names);
        localStorage.setItem("videoArray", JSON.stringify(names));
        console.log("videoArray updated");
      }
    }, 1000);
  }, [isEditorVisible]);

  useEffect(() => {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/");
    }
  }, []);

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
    document.title = "Edit campaign";
    async function fetchContent() {
      const content = await builder
        .get("page", {
          url: "/editor-edit",
        })
        .promise();
      setContent(content);
      setNotFound(!content);
    }
    fetchContent();
  }, []);

  if (notFound && !isPreviewingInBuilder) {
    return <div>404</div>;
  }
if(loading){
  return <SkeletonPage />;
}
  return (
    <div className="CreateContainer">
    <Navbar isEditPage={true} isrightsidemenu={true}/>
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
          // onClose:()=>onClose(),
        }}
      />
         {!isEditorVisible &&    <TimelineSection/>}
    </div>
  );
}

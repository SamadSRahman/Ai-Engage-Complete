/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
import "video.js/dist/video-js.css";
import "./style.css";
import { Builder } from "@builder.io/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  currentTimeAtom,
  isEditorVisibleAtom,
  isPlayingAtom,
  isThumbnailGeneratingAtom,
  isVideoLoadingAtom,
  pinPositionAtom,
  selectedVideoAtom,
  videoDurationAtom,
  videoRefAtom,
  videoSrcAtom,
} from "./Recoil/store";
import MCQSection from "./components/videoPlayerComponents/MCQSection";
import ControlBar from "./components/videoPlayerComponents/ControlBar";
import VideoPlayer from "./components/videoPlayerComponents/VideoPlayer";

const VideoJs = (props) => {
  const setIsEditorVisible = useSetRecoilState(isEditorVisibleAtom);
  const videoRef = useRef(null);
  const setVideoRef = useSetRecoilState(videoRefAtom);
  const [videoSrc, setVideoSrc] = useRecoilState(videoSrcAtom);
  let videoPlayer;
  const [allAnswers, setAllAnswers] = useState([]);
  const [isDisplay, setIsDisplay] = useState(true);
  const [question, setQuestion] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [skip, setSkip] = useState(false);
  const [pinPosition, setPinPosition] = useRecoilState(pinPositionAtom);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [multilple, setMultiple] = useState(false);
  const [selectedVideo, setSelectedVideo] = useRecoilState(selectedVideoAtom);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimeRecoil, setCurrentTimeRecoil] =
    useRecoilState(currentTimeAtom);
  const [isMuted, setIsMuted] = useState(false);
  const [videoDuration, setVideoDuration] = useRecoilState(videoDurationAtom);
  const [isPlaying, setIsPlaying] = useState(false);
  const [questions, setQuestions] = useState(selectedVideo?.questions);
  let newQues = selectedVideo?.questions;
  const isVideoPlaying = useRecoilValue(isPlayingAtom);
  const isThumbnailsGenerating = useRecoilValue(isThumbnailGeneratingAtom);
  const isVideoLoading = useRecoilValue(isVideoLoadingAtom);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isVideoPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      const videoPlayer = videoRef.current;
      setVideoRef(videoPlayer);
      videoPlayer.load();
      videoPlayer.addEventListener("loadedmetadata", () => {
        setVideoDuration(videoPlayer.duration);
      });
      videoPlayer.addEventListener("timeupdate", () => {
        setCurrentTime(videoPlayer.currentTime);
      });
    }
    setIsPlaying(false);
  }, [selectedVideo, videoSrc]);
  useEffect(() => {
    if (videoRef.current) {
      const videoPlayer = videoRef.current;
      videoPlayer.currentTime = currentTimeRecoil;
    }
  }, [currentTimeRecoil]);
  useEffect(() => {
    if (!selectedVideo.videoSrc) {
      setCurrentTime(0);
      setVideoDuration(0);
    }
    if (videoRef.current) {
      const videoPlayer = videoRef.current;
      setVideoRef(videoPlayer);
      videoPlayer.load();
      videoPlayer.addEventListener("loadedmetadata", () => {
        setVideoDuration(videoPlayer.duration);
      });
      videoPlayer.addEventListener("timeupdate", () => {
        if (videoPlayer.currentTime - pinPosition >= 0.2) {
          setPinPosition(videoPlayer.currentTime);
        }
        setCurrentTime(videoPlayer.currentTime);
        localStorage.setItem("pinPosition", videoPlayer.currentTime);
      });
    }
    setIsPlaying(false);
  }, [selectedVideo, videoSrc]);

  useEffect(() => {
    if (videoRef.current) {
      videoPlayer = videoRef.current;
      let tracks = videoPlayer.textTracks;
      let questionTrack;

      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        if (track.label === "questions") {
          track.mode = "hidden";
          questionTrack = track;
        }
      }
      const cueChangeHandler = (event) => {
        if (isDisplay) {
          const cue = event.target.activeCues[0]?.text;
          const cueData = JSON.parse(cue);
          if (selectedVideo.questions.some((q) => q.id === cueData.id)) {
            displayMCQOverlay(cueData);
          }
        }
      };
      videoPlayer.addEventListener("ended", () => {
        setIsPlaying(false);
        setDisplayedQuestions([]);
        setCurrentTime(0);
        removeExistingCues();
        setPinPosition(0);
        if (videoRef.current) {
          const videoPlayer = videoRef.current;
          videoPlayer.currentTime = 0;
        }
      });
      videoPlayer.addEventListener("seeked", () => {
        if (displayedQuestions.length > 0) setDisplayedQuestions([]);
      });
      removeExistingCues(); // Remove existing cues before adding new ones
      newQues?.forEach((questionObject) => {
        if (!displayedQuestions.includes(questionObject.id)) {
          const startTime = JSON.parse(questionObject.time);
          const endTime = startTime + 1;
          const cueText = {
            question: questionObject.question,
            answers: questionObject.answers,
            multiple: questionObject.multiple,
            skip: questionObject.skip,
            id: questionObject.id,
          };
          const dynamicCue = new VTTCue(
            startTime,
            endTime,
            JSON.stringify(cueText)
          );
          questionTrack.addCue(dynamicCue);
          setDisplayedQuestions((prevDisplayedQuestions) => [
            ...prevDisplayedQuestions,
            questionObject.id,
          ]);
        }
      });
      questionTrack.addEventListener("cuechange", cueChangeHandler);
      return () => {
        questionTrack.removeEventListener("cuechange", cueChangeHandler);
        videoPlayer.removeEventListener("seeked", () => {
          setDisplayedQuestions([]);
        });
      };
    }
  }, [
    selectedVideo,
    isDisplay,
    props.isEditorVisible,
    props.newArray,
    questions,
    displayedQuestions,
  ]);

  useEffect(() => {
    setIsEditorVisible(props.isEditorVisible);
    setTimeout(() => {
      setIsPlaying(false);
      setDisplayedQuestions([]);
      setCurrentTime(0);
      removeExistingCues();
    }, 500);
  }, [props.isEditorVisible]);

  // Function to remove existing cues
  const removeExistingCues = () => {
    if (videoRef.current) {
      const videoPlayer = videoRef.current;
      const tracks = videoPlayer.textTracks;
      let questionTrack;
      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        if (track.label === "questions") {
          questionTrack = track;
          break;
        }
      }
      if (questions && Array.isArray(questions) && questionTrack.activeCues) {
        const activeCues = Array.from(questionTrack.activeCues);
        activeCues.forEach((cue) => {
          questionTrack.removeCue(cue);
        });
      }
    }
  };

  const displayMCQOverlay = (data) => {
    setQuestion(data.question);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setSkip(data.skip);
    setMultiple(data.multiple);
    videoPlayer.pause();
    setIsDisplay(false);
    setAllAnswers([...data.answers]);
  };

  useEffect(() => {
    removeExistingCues();
    setDisplayedQuestions([]);
  }, [selectedVideo, questions]);
  const handlePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
    setQuestions(selectedVideo.questions);
  };

  return (
    <div className="videoContainer">
      <VideoPlayer
        isMuted={isMuted}
        trackSrc={props.trackSrc}
        videoRef={videoRef}
        videoSrc={videoSrc}
        isDisplay={isDisplay}
        selectedVideo={selectedVideo}
        isThumbnailsGenerating={isThumbnailsGenerating}
        isVideoLoading={isVideoLoading}
      />
      <MCQSection
        allAnswers={allAnswers}
        handlePlay={handlePlay}
        isDisplay={isDisplay}
        multilple={multilple}
        skip={skip}
        question={question}
        selectedAnswer={selectedAnswer}
        setIsDisplay={setIsDisplay}
        setSelectedAnswer={setSelectedAnswer}
        answeredQuestions={answeredQuestions}
        newQues={newQues}
        removeExistingCues={removeExistingCues}
        setAnsweredQuestions={setAnsweredQuestions}
        setDisplayedQuestions={setDisplayedQuestions}
        setQuestions={setQuestion}
        setSelectedVideo={setSelectedVideo}
        setVideoSrc={setVideoSrc}
      />
      <ControlBar
        currentTime={currentTime}
        handlePlay={handlePlay}
        isPlaying={isPlaying}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        videoDuration={videoDuration}
        videoSrc={videoSrc}
        setCurrentTimeRecoil={setCurrentTimeRecoil}
        currentTimeRecoil={currentTimeRecoil}
      />
    </div>
  );
};
export default VideoJs;

Builder.registerComponent(VideoJs, {
  name: "VideoJS",
  noWrap: false,
  inputs: [
    { name: "videoSrc", type: "text" },
    { name: "trackSrc", type: "text" },
    { name: "isEditorVisible", type: "boolean" },
  ],
});

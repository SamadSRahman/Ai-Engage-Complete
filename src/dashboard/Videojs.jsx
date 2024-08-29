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
import fastRewind from "./images/fast_rewind.svg";
import fastForward from "./images/fast_forward.svg";
import mute from "./images/volume_up.svg";
import volumeOff from "./images/volume_off.png";
import play from "./images/play_circle.svg";
import pause from "./images/pause.png";
import { formatTime } from "./Utils/services";
import VideoPlaceholder from "./VideoPlaceholder";
import Spinner from "./components/spinner/Spinner";

const VideoJs = (props) => {
  const setIsEditorVisible = useSetRecoilState(isEditorVisibleAtom);
  const videoRef = useRef(null);
  const setVideoRef = useSetRecoilState(videoRefAtom);
  const [videoSrc, setVideoSrc] = useRecoilState(videoSrcAtom);
  let videoPlayer;
  const [isFullscreen, setIsFullscreen] = useState(false);
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
  let vidData = JSON.parse(localStorage.getItem("vidData")) || [];
  const [questions, setQuestions] = useState(selectedVideo?.questions);
  let newQues = selectedVideo?.questions;
  const isVideoLoading = useRecoilValue(isVideoLoadingAtom);
  const isThumbnailsGenerating = useRecoilValue(isThumbnailGeneratingAtom);
  const isVideoPlaying = useRecoilValue(isPlayingAtom)

  useEffect(()=>{
      if (videoRef.current) {
      videoRef.current.pause();   
      setIsPlaying(false); 
      }
  },[isVideoPlaying])
 
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
        if(videoPlayer.currentTime-pinPosition>=0.2){
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
      // videoPlayer.src = selectedVideo.videoSrc
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
      setIsFullscreen(true);
    }
    setSkip(data.skip);
    setMultiple(data.multiple);
    videoPlayer.pause();
    setIsDisplay(false);
    setAllAnswers([...data.answers]);
  };

  function handleDone() {
    if (!selectedAnswer.length) {
      alert("Please select an answer before submitting.");
      return;
    }
    let newSelectedAnswer = [...selectedAnswer];
    if (newSelectedAnswer[0].subVideo) {
      removeExistingCues();
      setDisplayedQuestions([]);
      setVideoSrc(newSelectedAnswer[0].subVideo.videoSrc);
      let index = newSelectedAnswer[0].subVideoIndex;
      setSelectedVideo(vidData[index]);
      localStorage.setItem("selectedVideo", JSON.stringify(vidData[index]));
      setQuestions(newSelectedAnswer[0].subVideo.questions);
      newQues = [...newSelectedAnswer[0].subVideo.questions];
      setTimeout(() => {
        handlePlay();
      }, 500);
    }
    const updatedQuestion = {
      question,
      selectedAns: newSelectedAnswer,
    };
    setSelectedAnswer([]);
    setAnsweredQuestions([...answeredQuestions, updatedQuestion]);
    handlePlay();
    setIsDisplay(true);
  }
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
  const handleAnswerSelection = (answer) => {
    let newSelectedAnswer = [...selectedAnswer];
    if (multilple === "false") {
      newSelectedAnswer = [answer];
    } else {
      const answerIndex = newSelectedAnswer.indexOf(answer);
      if (answerIndex !== -1) {
        newSelectedAnswer.splice(answerIndex, 1);
      } else {
        newSelectedAnswer.push(answer);
      }
    }
    setSelectedAnswer(newSelectedAnswer);
  };
  const handleSkip = () => {
    setIsDisplay(true);
    handlePlay();
  };
  const handleProgressChange = (e) => {
    if (videoRef.current) {
      const videoPlayer = videoRef.current;
      const newTime = (e.target.value / videoDuration) * videoDuration;
      videoPlayer.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  function handleTimeUpdate(func) {
    if (func === "skip") {
      if (currentTimeRecoil + 5 <= videoDuration) {
        setCurrentTimeRecoil((prevValue) => prevValue + 5);
      } 
    } else {
      if (currentTimeRecoil - 5 >= 0) {
        setCurrentTimeRecoil((prevValue) => prevValue - 5);
      } 
    }
  }
  return (
    <div className="videoContainer">
      <div
        style={{ width: props.width ? props.width : "95%" }}
        className="videoPlayer"
      >
        <div
          className="videoWrapper"
          style={isDisplay ? {} : { display: "none" }}
        >
          {selectedVideo?.videoSrc && !isThumbnailsGenerating &&!isVideoLoading ? (
            <div data-vjs-player>
              <video
                id="my-video"
                ref={videoRef}
                className="video-js vjs-big-play-centered"
                // controls
                muted={isMuted}
                style={{
                  borderRadius: "8px",
                  width: "auto",
                  maxHeight: "15.5rem",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
                width={props.width ? props.width : "430"}
              >
                <source src={videoSrc} type="video/mp4" />
                <track
                  src={props.trackSrc}
                  label="questions"
                  kind="captions"
                  srcLang="en"
                  default={true}
                />
              </video>
            </div>
          ) : isVideoLoading || isThumbnailsGenerating ? (
            <div className="spinnerContainer">
              {" "}
             {!isThumbnailsGenerating && <Spinner size={"medium"} /> }<span>{isThumbnailsGenerating?"Generating Thumbnails...":"Loading your Video..."}</span>
            </div>
          ) : (
            <VideoPlaceholder />
          )}
        </div>
      </div>
      <div
        className="mcqSection"
        style={!isDisplay ? { width: "95%" } : { display: "none" }}
      >
        <div className="header">
          {/* <span style={{ minWidth: "20%" }}></span> */}
          <span className="questionHead">QUESTION</span>
        </div>
        <p className="questionText">{question}</p>
        <div className="answerSection">
          {allAnswers.map((answer) => (
            <div key={answer}>
              {multilple === "true" ? (
                <label>
                  <input
                    type="checkbox"
                    checked={selectedAnswer.includes(answer)}
                    onChange={() => handleAnswerSelection(answer)}
                  />
                  {answer.answer}
                </label>
              ) : (
                <label>
                  <input
                    type="radio"
                    checked={selectedAnswer.includes(answer)}
                    onChange={() => handleAnswerSelection(answer)}
                    name="answer"
                  />
                  {answer.answer}
                </label>
              )}
              <br />
            </div>
          ))}
        </div>
        <div className="submitSection">
          <button
            className="skipBtn"
            style={skip === "true" ? {} : { display: "none" }}
            onClick={handleSkip}
          >
            Skip
          </button>
          <button className="doneBtn" onClick={handleDone}>
            Submit
          </button>
        </div>
      </div>
      <div
        className="progressBarWrapper"
        style={{
          backgroundColor: props.backgroundColor,
        }}
      >
        {props.isProgressVisible && (
          <input
            id="progressBar"
            step={0.000001}
            type="range"
            min="0"
            max={videoDuration}
            value={currentTime}
            onChange={handleProgressChange}
          />
        )}
        <br />
        <div className="controlBarWrapper">
          <div className="timeContainer">
            <p className="time" style={videoSrc ? {} : { opacity: "0.5" }}>
              {formatTime(currentTime)} / {formatTime(videoDuration)}
            </p>
            {/* <p className="time" style={{paddingLeft:'2px'}} >  </p> */}
          </div>
          <div className="controlBar">
            <img
              src={fastRewind}
              alt=""
              width={28}
              height={28}
              onClick={() => handleTimeUpdate("rewind")}
              style={videoSrc ? currentTimeRecoil-5<0? {opacity:"0.5"} : {} : { opacity: "0.5" }}
            />
            <img
              src={isPlaying ? pause : play}
              onClick={handlePlay}
              width="30"
              height="30"
              alt="playIcon"
              style={videoSrc ? {} : { opacity: "0.5" }}
            />
            <img
              src={fastForward}
              alt="next icon"
              onClick={() => handleTimeUpdate("skip")}
              width={28}
              height={28}
              style={videoSrc ? currentTimeRecoil+5>videoDuration? {opacity:"0.5"} : {} : { opacity: "0.5" }}
            />
          </div>
          <div className="imgDiv">
            <img
              className="muteIcon"
              src={!isMuted ? mute : volumeOff}
              onClick={() => setIsMuted(!isMuted)}
              alt="MuteIcon"
              style={videoSrc ? {} : { opacity: "0.5" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoJs;

Builder.registerComponent(VideoJs, {
  name: "VideoJS",
  noWrap: false,
  inputs: [
    { name: "width", type: "text" },
    { name: "height", type: "text" },
    { name: "videoSrc", type: "text" },
    { name: "trackSrc", type: "text" },
    { name: "backgroundColor", type: "color" },
    { name: "color", type: "color" },
    { name: "progressBarWidth", type: "text" },
    { name: "isEditorVisible", type: "boolean" },
    { name: "newArray", type: "text" },
    { name: "isProgressVisible", type: "boolean" },
  ],
});

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useEffect, useState, useCallback } from "react";
import "video.js/dist/video-js.css";
import "../style.css";
import { Builder } from "@builder.io/react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  isEditorVisibleAtom,
  selectedVideoAtom,
  videoDurationAtom,
  videoRefAtom,
  pinPositionAtom,
  videoSrcAtom,
  currentTimeAtom,
} from "../Recoil/store";
import mute from "../images/volume_up.svg";
import volumeOff from "../images/volume_off.png";
import fastRewind from "../images/fast_rewind.svg";
import fastForward from "../images/fast_forward.svg";
import play from "../images/play_circle.svg";
import pause from "../images/pause.png";
import { formatTime } from "../Utils/services";
import VideoPlaceholder from "../VideoPlaceholder";

const VideoJsEdit = (props) => {
  const [isEditorVisible, setIsEditorVisible] =
    useRecoilState(isEditorVisibleAtom);
  const [canCallFunction, setCanCallFunction] = useState(true);
  const [currentTimeRecoil, setCurrentTimeRecoil] =
    useRecoilState(currentTimeAtom);
  const videoRef = useRef(null);
  const setVideoRef = useSetRecoilState(videoRefAtom);
  const [videoSrc, setVideoSrc] = useRecoilState(videoSrcAtom);
  console.log(videoSrc);

  let videoPlayer;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [allAnswers, setAllAnswers] = useState([]);
  const [isDisplay, setIsDisplay] = useState(true);
  const [question, setQuestion] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const [skip, setSkip] = useState(true);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [multilple, setMultiple] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const setPinPosition = useSetRecoilState(pinPositionAtom);
  const [selectedVideo, setSelectedVideo] = useRecoilState(selectedVideoAtom);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useRecoilState(videoDurationAtom);
  const [isPlaying, setIsPlaying] = useState(false);
  let vidData = JSON.parse(localStorage.getItem("vidData")) || [];
  const [questions, setQuestions] = useState(selectedVideo?.questions);
  let newQues = selectedVideo?.questions;

  useEffect(() => {
    const clearLocalStorage = () => {
      // Retrieve the accessToken from localStorage
      const accessToken = localStorage.getItem("accessToken");
      const adminDetails = localStorage.getItem("adminDetails");

      // Clear all data in localStorage
      localStorage.clear();

      // If accessToken exists, set it back into localStorage
      if (accessToken !== null) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("adminDetails", adminDetails);
      }
    };

    // Add the event listener for beforeunload
    window.addEventListener("beforeunload", clearLocalStorage);

    return () => {
      // Remove the event listener when the component unmounts
      window.removeEventListener("beforeunload", clearLocalStorage);
    };
  }, []);


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
        setPinPosition(videoPlayer.currentTime);
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
      console.log("line 121", selectedVideo)
      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        if (track.label === "questions") {
          track.mode = "hidden";
          questionTrack = track;
        }
      }

      const cueChangeHandler = (event) => {
        console.log("event triggered");
        if (isDisplay) {
          const length = event.target.cues.length;
          const cue = event.target.activeCues[0]?.text;
          console.log(event.target);
          let cueData = null;
          if (cue !== undefined) {
            cueData = JSON.parse(cue);
            if (selectedVideo.questions.some((q) => q.id === cueData.id)) {
              displayMCQOverlay(cueData);
            }
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
      videoPlayer.addEventListener("loadedmetadata", () => {
        setVideoDuration(videoPlayer.duration);
      });
      videoPlayer.addEventListener("timeupdate", () => {
        setCurrentTime(videoPlayer.currentTime);
      });


      removeExistingCues(); // Remove existing cues before adding new ones
      newQues?.forEach((questionObject) => {
        console.log("Question obj", questionObject);
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
    videoSrc,
    isDisplay,
    props.isEditorVisible,
    props.newArray,
    questions,
    displayedQuestions,
  ]);
  useEffect(()=>{console.log("line 198",selectedVideo)},[selectedVideo])

  useEffect(() => {
    if (videoRef.current) {
      const videoPlayer = videoRef.current;
      videoPlayer.currentTime = currentTimeRecoil;
    }
  }, [currentTimeRecoil]);
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

      // Remove existing cues before adding new ones
      if (questions && Array.isArray(questions) && questionTrack.activeCues) {
        const activeCues = Array.from(questionTrack.activeCues);
        activeCues.forEach((cue) => {
          questionTrack.removeCue(cue);
        });
      }
    }
  };

  const displayMCQOverlay = (data) => {
    console.log("display called");
    setQuestion(data.question);
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(true);
    }
    setSkip(data.skip);
    setMultiple(data.multiple);
    videoPlayer.pause();
    setIsDisplay(false);
    setCanCallFunction(false);
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
      setVideoSrc(newSelectedAnswer[0]?.subVideo?.videoSrc);
      let index = newSelectedAnswer[0].subVideoIndex;
      setSelectedVideo(vidData[index]);
      console.log("Edit check: selectedVideo updated at handleDone ", vidData[index])

      localStorage.setItem("selectedVideo", JSON.stringify(vidData[index]));

      setQuestions(newSelectedAnswer[0]?.subVideo?.questions);
      newQues = [...newSelectedAnswer[0]?.subVideo?.questions];
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
    setTimeout(() => {
      setCanCallFunction(true);
    }, 500);
  }
  useEffect(() => {
    removeExistingCues();
    setDisplayedQuestions([]);
  }, [selectedVideo, questions]);
  const handlePlay = useCallback(() => {
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
  }, [selectedVideo, videoRef]);
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
    setTimeout(() => {
      setCanCallFunction(true);
    }, 1000);
  };
  const handleProgressChange = (e) => {
    if (videoRef.current) {
      const videoPlayer = videoRef.current;
      const newTime = (e.target.value / videoDuration) * videoDuration;
      videoPlayer.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  return (
    <div className="videoContainer">
      <div
        style={{ width: props.width ? props.width : "95%",}}
        className="videoPlayer">
        <div className="videoWrapper"
        style={isDisplay ? {} : { display: "none" }}>
          {selectedVideo?.videoSrc ? (
            <div data-vjs-player >
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
                playsInline
                src={videoSrc}
              >
                {/* <source
                  src={videoSrc}
                  type="video/mp4"
                /> */}
                <track
                  src={props.trackSrc}
                  label="questions"
                  kind="captions"
                  srcLang="en"
                  default={true}
                />
              </video>
            </div>
          ) : (
            <VideoPlaceholder />
          )}
        </div>
      </div>
      <div
        className="mcqSection"
        style={!isDisplay ? { width: props.width } : { display: "none" }}
      >
        <div className="header">
          <span style={{ minWidth: "20%" }}></span>
          <span className="questionHead">QUESTION</span>
        </div>
        <p className="questionText">{question}</p>
        <div className="answerSection">
          {allAnswers.map((answer) => (
            <div key={answer}>
              {multilple === 'true' ? (
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
            style={skip === 'true' ? {} : { display: "none" }}
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
            <p className="time">
              {formatTime(currentTime)} / {formatTime(videoDuration)}
            </p>
          </div>{" "}
          <div className="controlBar">
            <img
              src={fastRewind}
              alt=""
              width={28}
              height={28}
              style={videoSrc ? {} : { opacity: "0.5" }}
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
              width={28}
              height={28}
              style={videoSrc ? {} : { opacity: "0.5" }}
            />
          </div>
          <div className="imgDiv">
            <img
              className="muteIcon"
              src={!isMuted ? mute : volumeOff}
              onClick={() => setIsMuted(!isMuted)}
              style={videoSrc ? {} : { opacity: "0.5" }}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoJsEdit;

Builder.registerComponent(VideoJsEdit, {
  name: "VideoJsEdit",
  noWrap: true,
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

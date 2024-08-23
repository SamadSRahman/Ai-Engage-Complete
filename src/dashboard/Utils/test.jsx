// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
// import { useRef, useEffect, useState } from "react";
// import "video.js/dist/video-js.css";
// import "./style.css";
// import { Builder } from "@builder.io/react";
// import { useRecoilState,  useSetRecoilState } from "recoil";
// import {   isEditorVisibleAtom, selectedVideoAtom, videoDurationAtom, videoRefAtom, videoSrcAtom } from "./Recoil/store";
// import fastRewind from "./images/fast_rewind.png";
// import fastForward from "./images/fast_forward.png";
// import play from './images/play_circle.png'
// import pause from './images/pause.png'
// import { formatTime } from "./Utils/services";

// const VideoJs = (props) => {
//   const [isEditorVisible, setIsEditorVisible] = useRecoilState(isEditorVisibleAtom)
  
//   const videoRef = useRef(null);
//   const setVideoRef = useSetRecoilState(videoRefAtom) 
//   const [videoSrc, setVideoSrc] = useRecoilState(videoSrcAtom);
//   let videoPlayer;
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [allAnswers, setAllAnswers] = useState([]);
//   const [isDisplay, setIsDisplay] = useState(true);
//   const [question, setQuestion] = useState("");
//   const [selectedAnswer, setSelectedAnswer] = useState([]);
//   const [skip, setSkip] = useState(false);
//   const [displayedQuestions, setDisplayedQuestions] = useState([]);
//   const [answeredQuestions, setAnsweredQuestions] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState([])
//   const [multilple, setMultiple] = useState(false);
//   const [selectedVideo, setSelectedVideo] = useRecoilState(selectedVideoAtom)
//   const [currentTime, setCurrentTime] = useState(0)
//   const [videoDuration, setVideoDuration] = useRecoilState(videoDurationAtom);
//   const [isPlaying, setIsPlaying] = useState(false);
//   let questionsArray = JSON.parse(localStorage.getItem("questionsArray")) || [];
//   let vidData = JSON.parse(localStorage.getItem("vidData")) || [];
// const [questions, setQuestions] = useState(selectedVideo.questions)
//   let newQues = selectedVideo.questions
//   useEffect(() => {
//     if (videoRef.current) {
//       const videoPlayer = videoRef.current;
//       setVideoRef(videoPlayer)
//       videoPlayer.load(); 
//       videoPlayer.addEventListener("loadedmetadata", () => {
//         setVideoDuration(videoPlayer.duration);
//       });
//       videoPlayer.addEventListener("timeupdate", () => {
//         setCurrentTime(videoPlayer.currentTime);
//             });
//     }
//   setIsPlaying(false)
//   }, [selectedVideo,videoSrc]);
//   useEffect(() => {
//     console.log(props.isEditorVisible)
//     if (videoRef.current) {
//       videoPlayer = videoRef.current;
//       let tracks = videoPlayer.textTracks;
//       let questionTrack;
//       for (var i = 0; i < tracks.length; i++) {
//         var track = tracks[i];
//         if (track.label === "questions") {
//           track.mode = "hidden";
//           questionTrack = track;
//         }
//       }
//       const cueChangeHandler = (event) => {
//         console.log("event triggered")
//         if (isDisplay) {
//           const cue = event.target.activeCues[0].text;
//           const cueData = JSON.parse(cue);
//           console.log(cueData)
//           if (selectedVideo.questions.some(q => q.id === cueData.id)){
//           if (event.target.activeCues[0]?.text !== undefined) {
//             console.log("Active Cues:", event.target.activeCues);
//             const cue = event.target.activeCues[0]?.text;
//             const cueData = JSON.parse(cue);
//             displayMCQOverlay(cueData);
//             setCurrentQuestion(cueData);
//           }
//         }
//         }
//       };
//       videoPlayer.addEventListener("ended", () => {
//         setIsPlaying(false);
//         setDisplayedQuestions([]);
//         setCurrentTime(0);
//       });
  
//       videoPlayer.addEventListener("seeked", () => {
//         if (displayedQuestions.length > 0) setDisplayedQuestions([]);
//       });
//       console.log("Questions added:",questions)
//       newQues?.forEach((questionObject) => {
//     console.log("displayedQuestion before check", displayedQuestions)
//         if (!displayedQuestions.includes(questionObject.id)) {
//     console.log("first condition")
//     console.log("Question Object", questionObject)
//         const startTime = questionObject.time;
//         const endTime = startTime + 1;
//         const cueText = {
//           question: questionObject.question,
//           answers: questionObject.answers,
//           multiple: questionObject.multiple,
//           skip: questionObject.skip,
//           id:questionObject.id
//         };
//         const dynamicCue = new VTTCue(startTime, endTime, JSON.stringify(cueText));
//         console.log("dynamicCue", dynamicCue)
//         questionTrack.addCue(dynamicCue);
//         setDisplayedQuestions((prevDisplayedQuestions) => [
//           ...prevDisplayedQuestions,
//           questionObject.id,
//         ]);
       
//         }
//       });
  
//       questionTrack.addEventListener("cuechange", cueChangeHandler);
//       return () => {
//         questionTrack.removeEventListener("cuechange", cueChangeHandler);
//         videoPlayer.removeEventListener("seeked", () => {
//           setDisplayedQuestions([]);
//         });
//       };
//     }
//   }, [selectedVideo, isDisplay, props.isEditorVisible, props.newArray]);
// useEffect(()=>{
//   setIsEditorVisible(props.isEditorVisible)
//   console.log("editor changed")
// },[props.isEditorVisible])

  
//   // Function to remove existing cues
//   const removeExistingCues = () => {
//     if (videoRef.current) {
//       const videoPlayer = videoRef.current;
//       const tracks = videoPlayer.textTracks;
//       let questionTrack;
  
//       for (var i = 0; i < tracks.length; i++) {
//         var track = tracks[i];
//         if (track.label === "questions") {
//           questionTrack = track;
//           break;
//         }
//       }
  
//       // Remove existing cues before adding new ones
//       if (questions && Array.isArray(questions) && questionTrack.activeCues) {
//         const activeCues = Array.from(questionTrack.activeCues);
//         activeCues.forEach((cue) => {
//           questionTrack.removeCue(cue);
//         });
//         console.log("cuesRemoved")
//       }
//     }
//   };

//   const displayMCQOverlay = (data) => {
//     setQuestion(data.question);
//     if (document.fullscreenElement) {
//       document.exitFullscreen();
//       setIsFullscreen(true);
//     }
//     setSkip(data.skip);
//     setMultiple(data.multiple);
//     videoPlayer.pause();
//     setIsDisplay(false);
//     setAllAnswers([...data.answers]);
//   };
// useEffect(()=>{
// console.log(questions)
// },[questions])

//   function handleDone() {
//     if (!selectedAnswer.length) {
//       alert("Please select an answer before submitting.");
//       return;
//     }
//     let newSelectedAnswer = [...selectedAnswer];
//     console.log(newSelectedAnswer[0])
//     if(newSelectedAnswer[0].subVideo){
//       removeExistingCues();
//       setDisplayedQuestions([]);
//       setVideoSrc(newSelectedAnswer[0].subVideo.videoSrc)
//       console.log(newSelectedAnswer[0].subVideo.videoSrc)
//       let index = newSelectedAnswer[0].subVideoIndex
//       setSelectedVideo(vidData[index])
//       // localStorage.setItem("selectedVideo", JSON.stringify(vidData[index]))
//       setQuestions(newSelectedAnswer[0].subVideo.questions)
//       newQues = [...newSelectedAnswer[0].subVideo.questions]
//       setTimeout(()=>{
//         handlePlay();
//       },1000)
//     }
//     const updatedQuestion = {
//       question,
//       selectedAns: newSelectedAnswer,
//     };
//     setSelectedAnswer([]);
//     setAnsweredQuestions([...answeredQuestions, updatedQuestion]);
//     handlePlay();
//     setIsDisplay(true);
//   }
//   useEffect(()=>{
//     removeExistingCues();
//     setDisplayedQuestions([]);

//   },[selectedVideo, questions ])
//   useEffect(()=>{console.log("displayed question changed",displayedQuestions)},[displayedQuestions])
//   const handlePlay = () => {
//     console.log(selectedVideo.questions)
//     if (videoRef.current) {
//       if (videoRef.current.paused) {
//         videoRef.current.play();
//         setIsPlaying(true);
//       } else {
//         videoRef.current.pause();
//         setIsPlaying(false);
//       }
//     }
//     questionsArray = JSON.parse(localStorage.getItem("questionsArray")) || [];
//      setQuestions(selectedVideo.questions)
//   };
//   const handleAnswerSelection = (answer) => {
//     let newSelectedAnswer = [...selectedAnswer];
//     if (multilple === "false") {
//       newSelectedAnswer = [answer];
//     } else {
//       const answerIndex = newSelectedAnswer.indexOf(answer);
//       if (answerIndex !== -1) {
//         newSelectedAnswer.splice(answerIndex, 1);
//       } else {
//         newSelectedAnswer.push(answer);
//       }
//     }
//     setSelectedAnswer(newSelectedAnswer);
//   };
//   const handleSkip = () => {
//     setIsDisplay(true);
//     handlePlay();
//   };
//   const handleProgressChange = (e) => {
//     if (videoRef.current) {
//       const videoPlayer = videoRef.current;
//       const newTime = (e.target.value / videoDuration) * videoDuration;
//       videoPlayer.currentTime = newTime;
//       setCurrentTime(newTime);
//     }
//   };
//   return (
//     <div>
//       <div
//         {...props.attributes}
//         className={`my-class ${props.attributes.className}`}
//       >
//         <div data-vjs-player style={isDisplay ? {} : { display: "none" }}>
//           <video
//             id="my-video"
//             ref={videoRef}
//             className="video-js vjs-big-play-centered"
//             // controls
//             muted
//             style={{ borderRadius: "10px 10px 0px 0px" }}
//             width={props.width ? props.width : "430"}
//             height={props.height ? props.height : "200"}
//           >
//             <source
//               src={props.videoSrc ? props.videoSrc : videoSrc}
//               type="video/mp4"
//             />
//             <track
//               src={props.trackSrc}
//               label="questions"
//               kind="captions"
//               srcLang="en"
//               default={true}
//             />
//           </video>
//         </div>
    
//       </div>
//       <div className="mcqSection" style={!isDisplay ? {width:props.width} : { display: "none" }}>
//         <div className="header">
//           <span style={{ minWidth: "20%" }}></span>
//           <span className="questionHead">QUESTION</span>
//         </div>
//         <p className="questionText">{question}</p>
//         <div className="answerSection">
//           {allAnswers.map((answer) => (
//             <div key={answer}>
//               {multilple === true ? (
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={selectedAnswer.includes(answer)}
//                     onChange={() => handleAnswerSelection(answer)}
//                   />
//                   {answer.answer}
//                 </label>
//               ) : (
//                 <label>
//                   <input
//                     type="radio"
//                     checked={selectedAnswer.includes(answer)}
//                     onChange={() => handleAnswerSelection(answer)}
//                     name="answer"
//                   />
//                   {answer.answer}
//                 </label>
//               )}
//               <br />
//             </div>
//           ))}
//         </div>
//         <div className="submitSection">
//           <button
//             className="skipBtn"
//             style={skip === true ? {} : { display: "none" }}
//             onClick={handleSkip}
//           >
//             Skip
//           </button>
//           <button className="doneBtn" onClick={handleDone}>
//             Submit
//           </button>
//         </div>
//       </div>
//       <div className="progressBarWrapper"
//             style={
//             {  width:props.width?props.width:'630px',
//                   backgroundColor: props.backgroundColor,
//             }
//             }
//           >
//             <input
//               id="progressBar"
//               step={0.000001}
//               type="range"
//               min="0"
//               max={videoDuration}
//               value={currentTime}
//               onChange={handleProgressChange}
//             />
//             <br />
//             <div className="controlBarWrapper">
//               <p className="time">{formatTime(currentTime)}</p>
//               <div className="controlBar">
//                 <img src={fastRewind} alt="" width={30} height={30} />
//                 <img src={isPlaying?pause:play} 
//                 onClick={handlePlay}
//                 width="40"
//                   height="40" alt="playIcon" />
//                 <img src={fastForward} alt="next icon" width={20} height={15} />
//               </div>
//               <p className="time" style={{textAlign:'right'}}>{formatTime(videoDuration)}</p>
//             </div>
//           </div>
//     </div>
//   );
// };
// export default VideoJs;

// Builder.registerComponent(VideoJs, {
//   name: "VideoJS",
//   noWrap: true,
//   inputs: [
//     { name: "width", type: "text" },
//     { name: "height", type: "text" },
//     { name: "videoSrc", type: "text" },
//     { name: "trackSrc", type: "text" },
//     { name: "backgroundColor", type: "color" },
//     { name: "color", type: "color" },
//     { name: "progressBarWidth", type: "text" },
//     { name: "isEditorVisible", type: "boolean" },
//     { name: "newArray", type: "text" },
//   ],
// });
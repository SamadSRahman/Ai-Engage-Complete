import React, { useEffect, useState } from "react";
import styles from "./AddQuestionPopup.module.css";
import message from "../../images/messageBlack.png";
import close from "../../images/close_small.png";
import add from "../../images/addEnabled.png";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedVideoAtom, videoDurationAtom } from "../../Recoil/store";
import { uid } from "uid";
import Alert from "../alert/Alert";
export default function AddQuestionPopup({ onClose }) {
  const obj = {
    id: uid(),
    question: "",
    answers: [
      {
        answer: "",
        id: uid(),
      },
    ],
    multiple: "true",
    skip: "true",
  };
  const [selectedVideo, setSelectedVideo] = useRecoilState(selectedVideoAtom);
  const videoArray = JSON.parse(localStorage.getItem("videoArray"));
  const [position, setPosition] = useState({ x: 390, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [questionObject, setQuestionObject] = useState(obj);
  const [alertText, setAlertText] = useState("")
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const videoDuration = useRecoilValue(videoDurationAtom);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);

  useEffect(()=>{console.log("Line 33", isSuccessAlertVisible);
  },[isSuccessAlertVisible])
  let pinPosition = localStorage.getItem("pinPosition");
  if (pinPosition) {
    pinPosition = JSON.parse(pinPosition);
  }

  const [time, setTime] = useState(pinPosition);
  function addQuestion() {
    if (time > videoDuration) {
      setIsAlertVisible(true);
      setAlertText("Pointer time cannot be more than video length, please enter a time within the video time frame")
      return;
    }
    if(!questionObject.question){
      setIsAlertVisible(true);
      setAlertText("Please enter a question")
      return
    }
    if(questionObject.answers.length<1){
      setIsAlertVisible(true);
      setAlertText("Please add atleast one option")
      return
    }
    for(let i=0;i<questionObject.answers.length;i++){
      if(!questionObject.answers[i].answer){
        setIsAlertVisible(true);
        setAlertText("Option cannot be empty")
        return
      }
    }
    localStorage.setItem("pinPosition", time);
    let newObj = JSON.parse(JSON.stringify(selectedVideo));
    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const remainingSeconds = seconds % 3600;
      const minutes = Math.floor(remainingSeconds / 60);
      const remainingMinutes = remainingSeconds % 60;

      const pad = (num) => (num < 10 ? `0${num}` : num); // Add leading zero if needed

      if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(remainingMinutes)}`;
      } else {
        return `${pad(minutes)}:${pad(remainingMinutes)}`;
      }
    };
    newObj.questions.push({
      ...questionObject,
      time: time,
      formattedTime: formatTime(time),
    });
    newObj.questions.sort((a, b) => {
      return a.time - b.time;
    });
    setSelectedVideo({ ...newObj });
    console.log("hi")
    setIsSuccessAlertVisible(true)
    localStorage.setItem("selectedVideo", JSON.stringify({ ...newObj }));
    let newQuesObj = {
      id: uid(),
      question: "",
      answers: [
        {
          answer: "",
          id: uid(),
        },
      ],
      multiple: "true",
      skip: "true",
      time: "",
    };
    setQuestionObject(newQuesObj);  
  }
  useEffect(() => {
    console.log(questionObject);
  }, [questionObject]);
  function deleteAnswer(id) {
    let newObj = JSON.parse(JSON.stringify(questionObject));
    let newArray = newObj.answers.filter((ele) => ele.id != id);
    newObj.answers = newArray;
    setQuestionObject(newObj);
  }
  function handleAddAnswer() {
    let newObj = { ...questionObject };
    let newArray = [...newObj.answers];
    newArray.push({ answer: "", id: uid() });
    newObj.answers = [...newArray];
    setQuestionObject({ ...newObj });
  }

  function handleSubVideoChange(e, index) {
    const vidData = JSON.parse(localStorage.getItem("vidData"));

    console.log(e.target.value, "subvideo value");
    let newObject = { ...questionObject };
    let newArray = [...newObject.answers];
    let newAns = { ...newArray[index] };
    newAns.subVideo = vidData[e.target.value - 1];
    newAns.subVideoIndex = e.target.value - 1;
    newArray[index] = newAns;
    newObject.answers = newArray;
    setQuestionObject(newObject);
    console.log(newObject);
  }

  function handleAnswerChange(e, i) {
    let newObj = { ...questionObject };
    let newArray = [...newObj.answers];
    newArray[i].answer = e.target.value;
    newObj.answers = [...newArray];
    setQuestionObject({ ...newObj });
  }
  function handleQuestionChange(e) {
    let obj = { ...questionObject };
    obj.question = e.target.value;
    setQuestionObject({ ...obj });
  }
  function handleTypeChange(e, type) {
    let obj = { ...questionObject };
    obj[type] = e.target.value;
    setQuestionObject({ ...obj });
  }
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  useEffect(() => {
    console.log(questionObject);
  }, [questionObject]);

  return (
    <div className={styles.wrapper}>
      {isAlertVisible && (
        <Alert
          text={alertText}
          title={"Alert"}
          primaryBtnText={"Okay"}
          onSuccess={() => setIsAlertVisible(false)}
          onClose={() => setIsAlertVisible(false)}
        />
      )}
      {isSuccessAlertVisible && (
        <Alert
          text={"Pointer added successfully"}
          title={"Alert"}
          primaryBtnText={"Okay"}
          onSuccess={onClose}
          onClose={onClose}
        />
      )}
      <div
        className={styles.container}
        style={{ top: position.y, left: position.x }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className={styles.header}>
          <div className={styles.leftSide}>
            <img src={message} alt="" />
            <span>Add message/question</span>
          </div>
          <div className={styles.rightSide}></div>
          <img
            className={styles.closeIcon}
            src={close}
            onClick={() => onClose()}
            alt=""
          />
        </div>

        <div className={styles.body}>
          <div className={styles.timeSection}>
            <span>Time Frame: </span>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className={styles.questionSection}>
            <span>Write your question below </span>
            <input
              type="text"
              value={questionObject.question}
              onChange={handleQuestionChange}
              placeholder="Click here to write"
            ></input>
          </div>
          <div className={styles.ansSection}>
            <div className={styles.ansSectionHeader}>
              <span>Write your options</span>

              <div className={styles.typeSection}>
                <span>Option type</span>

                <select
                  value={questionObject.multiple}
                  onChange={(e) => handleTypeChange(e, "multiple")}
                  name=""
                  id=""
                >
                  <option value={"true"}>Multiple answers</option>
                  <option value={"false"}> Single answer </option>
                </select>
              </div>
            </div>
            <div className={styles.skipSection}>
              <span>Skip option visible</span>
              <select
                onChange={(e) => handleTypeChange(e, "skip")}
                name=""
                id=""
              >
                <option value={"true"}>Yes</option>
                <option value={"false"}> No </option>
              </select>
            </div>

            <div className={styles.answerSectionWrapper}>
              {questionObject.answers.map((ans, ind) => (
                <div className={styles.ansMainSection}>
                  <div className={styles.ansInputSection}>
                    <span>{ind + 1}.</span>
                    <div className={styles.inputBox}>
                      <input
                        type="text"
                        placeholder="Click here to write"
                        value={questionObject.answers[ind].answer}
                        onChange={(e) => handleAnswerChange(e, ind)}
                      />
                      <img
                        src={close}
                        alt=""
                        onClick={() => deleteAnswer(ans.id)}
                      />
                    </div>
                  </div>
                  <div className={styles.ansSelectSection}>
                    <span>Sub video for this option</span>
                    <select
                      onChange={(e) => handleSubVideoChange(e, ind)}
                      placeholder="select video"
                      name=""
                      id=""
                    >
                      {videoArray?.map((video, index) => (
                        <option value={index}>{video}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <div onClick={handleAddAnswer} className={styles.addBtn}>
              <span>Add</span>
              <img src={add} alt="" />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div onClick={() => onClose()} className={styles.cancelBtn}>
            Cancel
          </div>
          <div onClick={addQuestion} className={styles.saveBtn}>
            Save
          </div>
        </div>
      </div>
    </div>
  );
}

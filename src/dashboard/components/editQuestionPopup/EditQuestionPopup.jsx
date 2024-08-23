import React, { useState } from "react";
import styles from "../addQuestionPopup/AddQuestionPopup.module.css";
import message from "../../images/messageBlack.png";
import close from "../../images/close_small.png";
import add from "../../images/addEnabled.png";
import { useRecoilState } from "recoil";
import { selectedVideoAtom } from "../../Recoil/store";
import { uid } from "uid";
export default function EditQuestionPopup({ question, onClose }) {
  const [proxyQuestion, setProxyQuestion] = useState({ ...question });
  const [selectedVideo, setSelectedVideo] = useRecoilState(selectedVideoAtom);
  const videoArray = JSON.parse(localStorage.getItem("videoArray"));
  const [position, setPosition] = useState({ x: 380, y: -350 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });


  console.log("line 18 ", question)
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
  function handleQuestionEdit(e, field) {
    let newObject = { ...proxyQuestion };
    newObject[field] = e.target.value;
    setProxyQuestion(newObject);
  }
  function handleAnswerEdit(e, id) {
    let newObject = { ...proxyQuestion };
    let newArray = [...newObject.answers];
    let index = newArray.findIndex((ans) => ans.id === id);
    let newAns = { ...newArray[index] };
    newAns.answer = e.target.value;
    newArray[index] = newAns;
    newObject.answers = newArray;
    setProxyQuestion(newObject);
  }
  function handleAddAnswer() {
    let newObject = { ...proxyQuestion };
    let newArray = [...newObject.answers];
    newArray.push({ answer: "", id: uid() });
    newObject.answers = newArray;
    setProxyQuestion(newObject);
  }
  function handleSubVideoChange(e, id) {
    const vidData = JSON.parse(localStorage.getItem("vidData"));

    console.log(e.target.value, "subvideo value");
    let newObject = { ...proxyQuestion };
    let newArray = [...newObject.answers];
    let index = newArray.findIndex((ans) => ans.id === id);
    let newAns = { ...newArray[index] };
    newAns.subVideo = vidData[e.target.value - 1];
    newAns.subVideoIndex = vidData[e.target.value - 1];
    newArray[index] = newAns;
    newObject.answers = newArray;
    setProxyQuestion(newObject);
    console.log(newObject);
  }
  function handleSave() {
    const newObj = { ...selectedVideo };
    let newArray = [...newObj.questions];
    let index = newArray.findIndex((ques) => ques.id === question.id);
    newArray[index] = proxyQuestion;
    newObj.questions = newArray;
    setSelectedVideo(newObj);
    localStorage.setItem("selectedVideo", JSON.stringify(newObj));
    onClose();
  }

  function deleteAnswer(id) {
    let newObj = JSON.parse(JSON.stringify(proxyQuestion));
    let newArray = newObj.answers.filter((ele) => ele.id !== id);
    newObj.answers = newArray;
    setProxyQuestion(newObj);
  }

  return (
      <div
        className={styles.container}
        style={{ top: position.y, left: position.x }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className={styles.header}

        >
          <div className={styles.leftSide}>
            <img src={message} alt="" />
            <span>Edit message/question</span>
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
          <div className={styles.questionSection}>
            <span>Write your question below </span>
            <input
              type="text"
              value={proxyQuestion.question}
              onChange={(e) => handleQuestionEdit(e, "question")}
              placeholder="Click here to write"
            ></input>
          </div>
          <div className={styles.ansSection}>
            <div className={styles.ansSectionHeader}>
              <span>Write your options</span>

              <div className={styles.typeSection}>
                <span>Option type</span>

                <select
                  value={proxyQuestion.multiple}
                  onChange={(e) => handleQuestionEdit(e, "multiple")}
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
              value={proxyQuestion.skip}
                onChange={(e) => handleQuestionEdit(e, "skip")}
                name=""
                id=""
              >
                <option value={"true"}>Yes</option>
                <option value={"false"}> No </option>
              </select>
            </div>

            <div className={styles.answerSectionWrapper}>
              {proxyQuestion.answers.map((ans, ind) => (
                <div className={styles.ansMainSection}>
                  <div className={styles.ansInputSection}>
                    <span>{ind + 1}.</span>
                    <div className={styles.inputBox}>
                      <input
                        type="text"
                        placeholder="Click here to write"
                        value={proxyQuestion.answers[ind].answer}
                        onChange={(e)=>handleAnswerEdit(e,ans.id)}
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
                      value={ans.subVideoIndex+1}
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
          <div onClick={handleSave} className={styles.saveBtn}>
            Save
          </div>
        </div>
      </div>
  );
}

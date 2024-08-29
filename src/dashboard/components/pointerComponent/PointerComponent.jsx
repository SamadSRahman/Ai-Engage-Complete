import React, { useEffect, useState } from "react";
import styles from "./pointeerComponent.module.css";
import { Builder } from "@builder.io/react";
import menuIcon from "../../images/menu_icon.png";
import { useRecoilValue } from "recoil";
import { selectedVideoAtom } from "../../Recoil/store";
import EditQuestionPopup from "../editQuestionPopup/EditQuestionPopup";
import { convertTimestamp } from "../../Utils/services";

export default function PointerComponent() {
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState({});
  const selectedVideo = useRecoilValue(selectedVideoAtom);

  const [questions, setQuestions] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  useEffect(() => {
    console.log("selectedVideo from PointerComponent", selectedVideo);
    setQuestions(selectedVideo?.questions);
  }, [selectedVideo]);

  function handleMenuClick(id) {
    setSelectedId(id);
    setIsPopupVisible((prevValue) => !prevValue);
  }

  function handleDelete(id) {
    let newArray = questions.filter((ques) => ques.id !== id);
    setQuestions(newArray);
    let newSelectedVideo = JSON.parse(JSON.stringify(selectedVideo))
    newSelectedVideo.questions = newArray;
    localStorage.setItem("selectedVideo", JSON.stringify(newSelectedVideo))
  }
  function handleEdit(question) {
    setIsEditPopupVisible(true);
    setSelectedQuestion(question);
  }
  function handleOnClose() {
    setIsEditPopupVisible(false);
  }
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <span>Pointers</span>
      </div>
      <div className={styles.questionsSection}>
        {questions?.map((ques, index) => (
          <div
            className={styles.question}
            onMouseLeave={() => setIsPopupVisible(false)}
            style={
              selectedId === ques.id && isPopupVisible
                ? { border: "1px solid darkgray" }
                : {}
            }
          >
            <div className={styles.questionBox}>
              <span className={styles.timeStamp}>
                {convertTimestamp(ques.formattedTime)}
              </span>
              <span className={styles.quesText}>
                Q{index + 1}: {ques.question}
              </span>
            </div>
            <div className={styles.iconBox}>
              {selectedId === ques.id && isPopupVisible && (
                <div className={styles.popup}>
                  <span onClick={() => handleEdit(ques)}>Edit</span>
                  <span onClick={() => handleDelete(ques.id)}>Delete</span>
                </div>
              )}
              <img
                onClick={() => handleMenuClick(ques.id)}
                src={menuIcon}
                alt=""
              />
            </div>
          </div>
        ))}
      </div>
      {isEditPopupVisible && (
        <EditQuestionPopup
          question={selectedQuestion}
          onClose={handleOnClose}
        />
      )}
    </div>
  );
}

Builder.registerComponent(PointerComponent, {
  name: "pointerComponent",
  noWrap: false,
  inputs: [{ name: "questions", type: "text" }],
});

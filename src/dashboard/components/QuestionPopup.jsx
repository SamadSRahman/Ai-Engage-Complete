import { Builder } from "@builder.io/react";
import  { useState, useEffect } from "react";
import "./questionPopup.css";
import { uid } from "uid";
import { useRecoilState } from "recoil";
import { questionPopupVisibleAtom } from "../Recoil/store";

export default function QuestionPopup() {
    const [questionPopupVisible, setQuestionPopupVisible] = useRecoilState(questionPopupVisibleAtom)
    const [questionsArray, setQuestionsArray] = useState([]);
  const [questionObject, setQuestionObject] = useState({
    id: uid(),
    question: "",
    time: 0,
    answers: [{id:uid()}],
  });

  useEffect(() => {
    console.log(questionObject);
  }, [questionObject]);

  const addAnswers = () => {
    const newAnswer = { id: uid() };
    setQuestionObject((prevState) => ({
      ...prevState,
      answers: [...prevState.answers, newAnswer],
    }));
    console.log(questionObject);
  };
const handleSave = ()=>{
    const id= uid()
   setQuestionsArray([...questionsArray, questionObject])
   setQuestionObject({
    id:id,
    time:0,
    answers:[{id:uid()}],
    question:""
   })
}
useEffect(()=>{console.log(questionsArray)},[questionsArray])

return(

      <div className="wrapper">
        <div className="header">
          <div className="leftSection">
            <img src="" alt="" />
            <span>Add Message/Question</span>
          </div>
          <img src="" alt="" />
        </div>
        <div className="body">
          <div className="typeSection">
            <span>Question Type:</span>
            <select name="typeOfSection" id="">
              <option value="options">Options</option>
              <option value="normal">Normal</option>
            </select>
          </div>
          <span>Write your Question/Message below:</span>
          <textarea
  value={questionObject.question}
  onChange={(e) => {
    setQuestionObject((prevState) => ({
      ...prevState,
      question: e.target.value,
    }));
  }}
  name=""
  id=""
  cols="30"
  rows="3"
  placeholder="Click here to write"
></textarea>

      <div className="addAnswersSection">
        <span>Write your options</span>
        <button onClick={addAnswers}>Add +</button>
      </div>
      {questionObject.answers.map((ele, index) => (
        <input
          key={index}
          type="text"
          placeholder="Click here to type"
          value={questionObject.answers[index].answer}
          onChange={(e) => {
            const updatedAnswers = [...questionObject.answers];
            updatedAnswers[index].answer = e.target.value;
            setQuestionObject((prevState) => ({
              ...prevState,
              answers: updatedAnswers,
            }));
          }}
        />
      ))}
          <div className="btnDiv">
            <button onClick={()=>setQuestionPopupVisible(false)}>Cancel</button>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    
  );
}

Builder.registerComponent(QuestionPopup, {
  name: "questionPopup",
});

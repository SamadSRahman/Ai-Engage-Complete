import React from "react";
import '../../videojs.css'

export default function MCQSection({
  isDisplay,
  question,
  allAnswers,
  multilple,
  selectedAnswer,
  setSelectedAnswer,
  skip,
  setIsDisplay,
  removeExistingCues,
  setDisplayedQuestions,
  handlePlay,
  setVideoSrc,
  setSelectedVideo,
  setQuestions,
  newQues,
  answeredQuestions,
  setAnsweredQuestions
}) {

  let vidData = JSON.parse(localStorage.getItem("vidData")) || [];
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
      console.log(
        "Edit check: selectedVideo updated at handleDone ",
        vidData[index]
      );

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
  }

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

  return (
    <div className="mcqSection" style={!isDisplay ? {} : { display: "none" }}>
      <div className="header">
        <span style={{ minWidth: "20%" }}></span>
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
  );
}

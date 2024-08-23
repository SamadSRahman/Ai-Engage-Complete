/* eslint-disable react/prop-types */
import message from "../images/messageBlack.png";
import closeIcon from "../images/close_small.png";
import {  useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
   isEditorVisibleAtom, selectedQuestionAtom, selectedVideoAtom,
} from "../Recoil/store";

const Popup = ({ onDelete,onClose, index}) => {
  const selectedVideo = useRecoilValue(selectedVideoAtom)
  const setSelectedQuestion = useSetRecoilState(selectedQuestionAtom)
  const [isEditPopup, setIsEditPopup] = useRecoilState(isEditorVisibleAtom);

  const handleView = () => {
    setIsEditPopup(!isEditPopup);
    setSelectedQuestion(selectedVideo.questions[index])
    localStorage.setItem("selectedQuestion",JSON.stringify(selectedVideo.questions[index]))
  };
  return (
    <div
      className="popup"
      style={{
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        left: "1.3rem",
        zIndex: "5",
      }}
    >
      <div className="headerMP">
        <img src={message} alt="" />
        <span className="heading">Message Pointer</span>
        <img src={closeIcon} alt="" onClick={onClose} />
      </div>
      <div className="bodyMP">
        <span onClick={handleView}>Open</span>
        <span onClick={onDelete}>Delete</span>
      </div>
    </div>
  );
};
export default Popup;

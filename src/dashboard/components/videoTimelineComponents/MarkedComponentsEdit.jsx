import React, { useMemo, useState, useCallback } from "react";
import Popup from "../messagePopup";
import message from "../../images/newMessageIcon.png";
import Alert from "../alert/Alert";

const MarkedPositions = ({
  selectedVideo,
  timelineLength,
  setVid,
  setSelectedVideo,
}) => {
  const [idToDelete, setIdToDelete] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);

  const handleConfirmDelete = useCallback((id) => {
    setIsDeleteAlertVisible(true);
    setIdToDelete(id);
  }, []);

  const handleDelete = useCallback(
    (id) => {
      const newSelectedVideo = { ...selectedVideo };
      const newArray = newSelectedVideo.questions.filter(
        (ele) => ele.id !== id
      );
      newSelectedVideo.questions = newArray;
      setSelectedVideo(newSelectedVideo);
      localStorage.setItem("selectedVideo", JSON.stringify(newSelectedVideo));
      let vidData = JSON.parse(localStorage.getItem("vidData"));
      const index = vidData.findIndex((ele) => ele.id === newSelectedVideo.id);
      vidData[index] = newSelectedVideo;
      localStorage.setItem("vidData", JSON.stringify(vidData));
      setVid(vidData);
      setShowPopup(false);
      setIsSuccessAlertVisible(true);
      setIsDeleteAlertVisible(false);
    },
    [selectedVideo, setSelectedVideo, setVid]
  );

  const markedPositionElements = useMemo(() => {
    return selectedVideo?.questions?.map((position, index) => (
      <React.Fragment key={position.id}>
        <div
          style={{
            position: "absolute",
            left: `${(position.time / timelineLength) * 99}%`,
            top: "5px",
            height: "50%",
            borderRadius: "8px",
            width: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex" }}>
            <img
              src={message}
              alt=""
              style={{
                marginTop: "30px",
                marginRight: "62px",
                height: "30px",
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedId(position.id);
                setShowPopup(true);
              }}
            />
            {showPopup && selectedId === position.id && (
              <Popup
                id={position.id}
                onDelete={() => handleConfirmDelete(position.id)}
                onClose={() => setShowPopup(false)}
                index={index}
              />
            )}
          </div>
        </div>
      </React.Fragment>
    ));
  }, [
    selectedVideo?.questions,
    timelineLength,
    showPopup,
    selectedId,
    handleConfirmDelete,
  ]);

  return (
    <>
      {isDeleteAlertVisible && (
        <Alert
          title={"Alert"}
          text={"Are you sure you want to delete this pointer"}
          primaryBtnText={"Yes"}
          secondaryBtnText={"No"}
          onClose={() => setIsDeleteAlertVisible(false)}
          onSuccess={() => handleDelete(idToDelete)}
        />
      )}
      {isSuccessAlertVisible && (
        <Alert
          text={"Pointer deleted successfully"}
          title={"Alert"}
          primaryBtnText={"Okay"}
          onClose={() => setIsSuccessAlertVisible(false)}
          onSuccess={() => setIsSuccessAlertVisible(false)}
        />
      )}
      {markedPositionElements}
    </>
  );
};

export default MarkedPositions;

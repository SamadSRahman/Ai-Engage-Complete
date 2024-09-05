import React, { useCallback, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedVideoAtom, videoFilesAtom } from "../../Recoil/store";
import Alert from "../alert/Alert";
import Spinner from "../spinner/Spinner";
import "../../inputField.css";

export default function ThumbnailList({
  thumbnails,
  uploadPercentage,
  isVideoUploaded,
  handleThumbnailClick,
  handleThumbnailDelete,
  handleDragOver,
  handleDrop,
  loading,
  setIsAlertVisible,
  isAlertVisible,
}) {
  const videoFiles = useRecoilValue(videoFilesAtom);
  const selectedVideo = useRecoilValue(selectedVideoAtom);
  const [alertText, setAlertText] = useState("");
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const thumbnailStyles = useMemo(
    () => (index) =>({
      filter: `brightness(${
        uploadPercentage < 100 &&
        index === thumbnails.length - 1 &&
        videoFiles.length === thumbnails.length &&
        !isVideoUploaded
          ? uploadPercentage
          : 100
      }%)`,
      border:
        JSON.parse(localStorage.getItem("vidData"))[index]?.id ===
        selectedVideo?.id
          ? "3px solid #4D67EB"
          : "1px solid rgb(0,0,0,0.3)",
    }),
    [
      uploadPercentage,
      thumbnails.length,
      videoFiles.length,
      selectedVideo,
      isVideoUploaded,
    ]
  )

  const timestampStyles = useMemo(
    () => (index) => ({
      display:
        uploadPercentage < 100 &&
        !isVideoUploaded &&
        index === thumbnails.length - 1 &&
        videoFiles.length === thumbnails.length
          ? "none"
          : "inline",
    }),
    [uploadPercentage, isVideoUploaded, thumbnails.length, videoFiles.length]
  );
  const uploadPercentageStyles = useMemo(
    () => (index) => ({
      display:
        uploadPercentage < 100 &&
        videoFiles.length === thumbnails.length &&
        index === thumbnails.length - 1
          ? !isVideoUploaded
            ? "block"
            : "none"
          : "none",
    }),
    [uploadPercentage, videoFiles.length, thumbnails.length, isVideoUploaded]
  );
  const handleConfirmDelete = useCallback(
    (thumbnail, index) => {
      const vidArray = JSON.parse(localStorage.getItem("videoArray"));
      setSelectedIndex(index);
      setSelectedThumbnail(thumbnail);
      setIsAlertVisible(true);
      setAlertText(
        `This action will delete "${
          vidArray[index + 1]
        }", are you sure you want to continue?`
      );
    },
    [setIsAlertVisible, setAlertText]
  );

  return (
    <div
      className="thumbnails"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={thumbnails.length > 0 ? {} : { display: "none" }}
    >
      {thumbnails.map((thumbnail, index) => (
        <div className="thumbnailImgWrapper" key={index}>
          <img
            style={thumbnailStyles(index)}
            src={thumbnail.url}
            alt={`Thumbnail ${index + 1}`}
            onClick={() =>
              uploadPercentage < 100 &&
              !isVideoUploaded &&
              videoFiles.length === thumbnails.length &&
              index === thumbnails.length - 1
                ? {}
                : handleThumbnailClick(index)
            }
            className="thumbnailImg"
          />
          <span style={timestampStyles(index)} className="timestamp">
            {thumbnail.timestamp}
          </span>
          <span
            className="uploadPercentage"
            style={uploadPercentageStyles(index)}
          >
            {uploadPercentage}%
          </span>

          <span
            className="crossIcon"
            onClick={() => handleConfirmDelete(thumbnail, index)}
          >
            &#10006;
          </span>
          {isAlertVisible && (
            <Alert
              title={"Alert"}
              text={alertText}
              primaryBtnText={"Yes"}
              secondaryBtnText={"No"}
              onClose={() => setIsAlertVisible(false)}
              onSuccess={() =>
                handleThumbnailDelete(selectedThumbnail, selectedIndex)
              }
            />
          )}
          <span className="name">
            {JSON.parse(localStorage.getItem("videoArray"))[index + 1]}
          </span>
        </div>
      ))}
      {loading && (
        <div className="spinnerWrapper">
          <Spinner size="medium" />
        </div>
      )}
    </div>
  );
}

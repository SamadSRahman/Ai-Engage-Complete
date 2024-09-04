import React, { useMemo } from "react";
import "../../inputField.css";
import backupWhite from "../../images/backup_white.svg";
import { useRecoilValue } from "recoil";
import {
  isThumbnailGeneratingAtom,
  isVideoLoadingAtom,
} from "../../Recoil/store";


export default function InputHeader({ thumbnails, inputRef, isUploadBtnVisible }) {
  const isVideoLoading = useRecoilValue(isVideoLoadingAtom);
  const isThumbnailGenerating = useRecoilValue(isThumbnailGeneratingAtom);

  const uploadButtonStyles = useMemo(
    () => ({
      cursor:
        isVideoLoading || isThumbnailGenerating ? "not-allowed" : "pointer",
      backgroundColor: isVideoLoading || isThumbnailGenerating ? "grey" : "",
      display: isUploadBtnVisible?"flex":"none"
    }),
    [isVideoLoading, isThumbnailGenerating, isUploadBtnVisible]
  );
  return (
    <div
      className="inputHeader"
      style={thumbnails.length > 0 ? {} : { display: "none" }}
    >
      <span className="inputHeading">
        {thumbnails.length} {thumbnails.length === 1 ? "Video" : "Videos"}
      </span>
      <button
        className="uploadBtnDiv"
        onClick={() => inputRef.current.click()}
        disabled={isVideoLoading || isThumbnailGenerating}
        style={uploadButtonStyles}
      >
        <img src={backupWhite} alt="" />
        <span>Upload file</span>
      </button>
    </div>
  );
}

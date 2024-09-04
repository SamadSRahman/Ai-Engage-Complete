import React, { useEffect } from "react";
import VideoPlaceholder from "../../VideoPlaceholder";
import Spinner from "../spinner/Spinner";

export default function VideoPlayer({
  videoRef,
  isMuted,
  videoSrc,
  trackSrc,
  isDisplay,
  selectedVideo,
  isVideoLoading,
  isThumbnailsGenerating,
}) {

useEffect(()=>console.log("isVideoLoading",isVideoLoading),[isVideoLoading])

  return (
    <div className="videoPlayer">
      <div className="videoWrapper" style={isDisplay ? {} : { display: "none" }}>
      {selectedVideo?.videoSrc &&
          !isThumbnailsGenerating &&
          !isVideoLoading ? (
            <div data-vjs-player>
              <VideoPlayer
                isMuted={isMuted}
                trackSrc={trackSrc}
                videoRef={videoRef}
                videoSrc={videoSrc}
                isDisplay={isDisplay}
              />
            </div>
          ) : isVideoLoading || isThumbnailsGenerating ? (
            <div className="spinnerContainer">
              {" "}
              {!isThumbnailsGenerating && <Spinner size={"medium"} />}
              <span>
                {isThumbnailsGenerating
                  ? "Generating Thumbnails..."
                  : "Loading your Video..."}
              </span>
            </div>
          ) : (
            <VideoPlaceholder />
          )}
      </div>
    </div>
  );
};

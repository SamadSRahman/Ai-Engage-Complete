import React from "react";
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

  const renderVideoContent = () => {
    if (!selectedVideo?.videoSrc && !isVideoLoading) {
      return <VideoPlaceholder />;
    }

    if (isVideoLoading) {
      return (
        <div className="spinnerContainer">
          <Spinner size="medium" />
          <span>Loading your Video...</span>
        </div>
      );
    }

    if (isThumbnailsGenerating) {
      return (
        <div className="spinnerContainer">
          <span>Generating Thumbnails...</span>
        </div>
      );
    }

  return (
      <div data-vjs-player>
        <video
          id="my-video"
          ref={videoRef}
          className="video-js vjs-big-play-centered"
          muted={isMuted}
          style={{
            borderRadius: "8px",
            width: "auto",
            maxHeight: "15.5rem",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          <track
            src={trackSrc}
            label="questions"
            kind="captions"
            srcLang="en"
            default={true}
          />
        </video>
      </div>
    );
  };

  return (
    <div className="videoPlayer">
      <div className="videoWrapper" style={isDisplay ? {} : { display: "none" }}>
        {renderVideoContent()}
      </div>
    </div>
  );
};

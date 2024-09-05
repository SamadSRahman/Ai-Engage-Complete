import React from "react";
import "../../videojs.css";
import mute from "../../images/volume_up.svg";
import volumeOff from "../../images/volume_off.png";
import fastRewind from "../../images/fast_rewind.svg";
import fastForward from "../../images/fast_forward.svg";
import play from "../../images/play_circle.svg";
import pause from "../../images/pause.png";
import { formatTime } from "../../Utils/services";

export default function ControlBar({
  currentTime,
  videoDuration,
  videoSrc,
  isMuted,
  isPlaying,
  handlePlay,
  setIsMuted,
  currentTimeRecoil,
  setCurrentTimeRecoil,
}) {
  function handleTimeUpdate(func) {
    if (func === "skip") {
      if (currentTimeRecoil + 5 <= videoDuration) {
        setCurrentTimeRecoil((prevValue) => prevValue + 5);
      }
    } else {
      if (currentTimeRecoil - 5 >= 0) {
        setCurrentTimeRecoil((prevValue) => prevValue - 5);
      }
    }
  }

  return (
    <div className="progressBarWrapper">
      <br />
    <div className="controlBarWrapper">   
      <div className="timeContainer">
        <p className="time">
          {formatTime(currentTime)} / {formatTime(videoDuration)}
        </p>
      </div>{" "}
      <div className="controlBar">
        <img
          src={fastRewind}
          alt=""
          width={28}
          height={28}
          onClick={() => handleTimeUpdate("rewind")}
          style={
            videoDuration
              ? currentTime - 5 < 0
                ? { opacity: "0.5" }
                : {}
              : { opacity: "0.5" }
          }
        />
        <img
          src={isPlaying ? pause : play}
          onClick={handlePlay}
          width="30"
          height="30"
          alt="playIcon"
          style={videoDuration ? {} : { opacity: "0.5" }}
        />
        <img
          src={fastForward}
          alt="next icon"
          width={28}
          height={28}
          onClick={() => handleTimeUpdate("skip")}
          style={
            videoDuration
              ? currentTime + 5 > videoDuration
                ? { opacity: "0.5" }
                : {}
              : { opacity: "0.5" }
          }
        />
      </div>
      <div className="imgDiv">
        <img
          className="muteIcon"
          src={!isMuted ? mute : volumeOff}
          onClick={() => setIsMuted(!isMuted)}
          style={videoDuration ? {} : { opacity: "0.5" }}
          alt=""
        />
      </div>
    </div>
    </div>
  );
}

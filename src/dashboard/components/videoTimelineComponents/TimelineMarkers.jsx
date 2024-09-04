import React, { useMemo } from "react";
import PropTypes from "prop-types";
import "../../videoTimeline.css";

const TimelineBarMarkers = ({ videoDuration, handleTimelineClick }) => {
  const barWidth = 13; // Set the width of the bars in pixels
  const barHeight = 10; // Set the height of the bars in pixels

  const timelineBars = useMemo(() => {
    const bars = [];
    for (let i = 0; i <= videoDuration; i++) {
      const isHalfSecondInterval = i % 5 === 0;
      const isSecondInterval = i % 10 === 0;
      const barStyle = {
        width: `${barWidth}px`,
        height: isHalfSecondInterval ? `${barHeight}px` : `${barHeight / 2}px`,
        backgroundColor: i === 0 || isSecondInterval ? "black" : "darkgrey",
        marginRight: "15.5px", // Adjust margin between bars
        position: "relative",
        minWidth: "1px",
      };
      bars.push(
        <div key={i} style={barStyle}>
          {(isSecondInterval || i === 0) && (
            <span className="timelineMarkers">{i}</span>
          )}
        </div>
      );
    }
    return bars;
  }, [videoDuration]);

  return (
    <div className="timelineBarWrapper" onClick={handleTimelineClick}>
      {timelineBars}
    </div>
  );
};

TimelineBarMarkers.propTypes = {
  videoDuration: PropTypes.number.isRequired,
};

export default TimelineBarMarkers;

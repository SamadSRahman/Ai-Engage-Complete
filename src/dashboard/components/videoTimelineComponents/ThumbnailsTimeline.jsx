import React, { useMemo } from 'react';

const ThumbnailTimeline = ({ videoThumbnails }) => {
  const thumbnailElements = useMemo(
    () =>
      videoThumbnails.map((thumbnail, index) => (
        <img
          key={index}
          src={thumbnail.url}
          alt={`Thumbnail at ${thumbnail.time}s`}
          style={{
            minWidth: "118px", // Set the width based on the timeline length
            height: "3.2rem", // Define the height of the thumbnail timeline
            objectFit: "cover", // Ensure the thumbnail fits within its container
          }}
        />
      )),
    [videoThumbnails]
  );
  return <div className="thumbnail-timeline" style={{display:'flex'}}>{thumbnailElements}</div>;
};

export default ThumbnailTimeline;
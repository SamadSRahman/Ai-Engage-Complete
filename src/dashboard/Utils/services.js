import axios from "axios";

//InputField
export const handleFileChange = (files, setVideoFiles, generateThumbnail) => {
  if (files) {
    Array.from(files).forEach((file) => {
      setVideoFiles((prevFiles) => [...prevFiles, URL.createObjectURL(file)]);
      generateThumbnail(file, 5);
    });
  }
};

export const handlePlay = (videoRef, setIsPlaying) => {
  if (videoRef.current) {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }
};
export const markPosition = (
  pinPosition,
  markedPositions,
  setMarkedPositions
) => {
  console.log(pinPosition);
  console.log(markedPositions);
  if (pinPosition !== null) {
    setMarkedPositions([...markedPositions, pinPosition]);
  }
};

export const getDataFromStorage = (key) => {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  } else {
    return [];
  }
};

//VideoPlayer
export const formatTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};



export const updateSubVideo = (questions, vidData) => {
  const MAX_RECURSION_DEPTH = 1000; // Maximum recursion depth threshold

  // Function to handle recursion with a depth counter
  const updateSubVideoRecursive = (questions, vidData, depth) => {
    if (depth > MAX_RECURSION_DEPTH) {
      // If recursion depth exceeds the threshold, show a warning alert
      alert(
        "Maximum recursion depth exceeded. Potential infinite loop detected."
      );
      return questions; // Return the unmodified questions array
    }

    return questions.map((question) => {
      const updatedQuestion = { ...question };

      if (updatedQuestion.answers) {
        updatedQuestion.answers = updatedQuestion.answers.map((answer) => {
          if (answer.subVideo && vidData[answer.subVideoIndex]) {
            answer.subVideo = vidData[answer.subVideoIndex];
            if (answer.subVideo.questions) {
              // Recursively update subvideo questions only if there are any
              answer.subVideo.questions = updateSubVideoRecursive(
                answer.subVideo.questions,
                vidData,
                depth + 1 // Increment depth for recursion
              );
            }
          }
          return answer;
        });
      }

      if (updatedQuestion.subVideo && vidData[updatedQuestion.subVideoIndex]) {
        updatedQuestion.subVideo = vidData[updatedQuestion.subVideoIndex];
        if (updatedQuestion.subVideo.questions) {
          // Recursively update subvideo questions only if there are any
          updatedQuestion.subVideo.questions = updateSubVideoRecursive(
            updatedQuestion.subVideo.questions,
            vidData,
            depth + 1 // Increment depth for recursion
          );
        }
      }

      return updatedQuestion; // Return the updated question
    });
  };

  // Start recursion with an initial depth of 0
  return updateSubVideoRecursive(questions, vidData, 0);
};


function convertTimestampToSeconds(timestamp) {
  const [minutes, seconds] = timestamp.split(":").map(Number);
  return minutes * 60 + seconds;
}

function calculateTotalVideoLength(videos) {
  return videos.reduce((total, video) => {
    return total + convertTimestampToSeconds(video.timestamp);
  }, 0);
}

export const handleUpload = async (
  setIsSuccessAlertVisible,
  setIsAlertVisible,
  setAlertText,
  title,
  setLoading,
  navigate
) => {
  const videos = JSON.parse(localStorage.getItem("thumbnails"));

  let selectedVideo = JSON.parse(localStorage.getItem("selectedVideo"));
  let token = localStorage.getItem("accessToken");
  let videoSrcArray = JSON.parse(localStorage.getItem("videoSrcArray"));

  let mainID = JSON.parse(localStorage.getItem("mainId"));
  if (mainID) {
    setAlertText("File has already been uploaded");
    setIsAlertVisible(true);
    return;
  }
  let vidData = JSON.parse(localStorage.getItem("vidData"));
  const totalLengthInSeconds = calculateTotalVideoLength(videos);
  console.log(totalLengthInSeconds);
  const originalObject = { ...selectedVideo };
  const updatedQuestions = updateSubVideo(originalObject.questions, vidData);
  const updatedObject = { ...originalObject, questions: updatedQuestions };
  console.log("Updated Object", updatedObject);
  const index = vidData.findIndex((item) => item.id === updatedObject.id);

  if (index !== -1) {
    vidData[index] = updatedObject;
    console.log(vidData[index]);
    // Update localStorage with the modified vidData
    localStorage.setItem("vidData", JSON.stringify(vidData));
  }
  if (!title) {
    setAlertText("Please enter a title");
    setIsAlertVisible(true);
    return;
  }

  console.log(title);
  let object = {
    // video_id: id,
    videoLength: totalLengthInSeconds,
    title: title,
    videoSelectedFile: updatedObject,
    videoFileUrl: videoSrcArray,
    videoData: vidData,
  };
  console.log(object);
  console.log("Access token", token);
  setLoading(true);
  const apiUrl =
    "https://videosurvey.xircular.io/api/v1/video/upload/multipleMedia";
  try {
    const response = await axios.post(apiUrl, object, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Upload successful:", response.data);
    localStorage.setItem("mainId", response.data.videoData.video_id);
    localStorage.setItem("adminId", response.data.videoData.createdBy);
    setLoading(false);
    setAlertText("File uploaded successfully");
    setIsSuccessAlertVisible(true);
    // navigate(`/edit/${response.data.videoData.video_id}`)
  } catch (error) {
    console.error("Error uploading data:", error);
    setAlertText("Unable to save campaign. Please try again.");
    setIsAlertVisible(true);
    setLoading(false);
  }
};
export const handleUpdate = async (
  setIsSuccessAlertVisible,
  setAlertText,
  title,
  setLoading,
) => {
  const videos = JSON.parse(localStorage.getItem("thumbnails"));
  console.log("title", title)
  let videoSrcArray = JSON.parse(localStorage.getItem("videoSrcArray"));
  const totalLengthInSeconds = calculateTotalVideoLength(videos);
  let token = localStorage.getItem("accessToken");
  let editId = localStorage.getItem("editId");
  let vidData = JSON.parse(localStorage.getItem("vidData"));

  let selectedVideo = JSON.parse(localStorage.getItem("selectedVideo"));
  const originalObject = { ...selectedVideo };
  const updatedQuestions = updateSubVideo(originalObject.questions, vidData);
  const updatedObject = { ...originalObject, questions: updatedQuestions };
  const index = vidData.findIndex((item) => item.id === updatedObject.id);

  if (index !== -1) {
    vidData[index] = updatedObject;
    console.log(vidData[index]);
    // Update localStorage with the modified vidData
    localStorage.setItem("vidData", JSON.stringify(vidData));
  }
  let object = {
    videoLength: totalLengthInSeconds,
    title: title,
    videoSelectedFile: updatedObject,
    videoFileUrl: videoSrcArray ? videoSrcArray : [],
    videoData: vidData,
  };
  setLoading(true);
  const apiUrl = `https://videosurvey.xircular.io/api/v1/video/updateVideo/${editId}`;
  try {
    const response = await axios.put(apiUrl, object, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Upload successful:", response.data);
    setLoading(false);
    setAlertText("File uploaded successfully");
    setIsSuccessAlertVisible(true);
  } catch (error) {
    console.error("Error uploading data:", error);
    setLoading(false);
  }
};

// export const getSelectedQuestion = () => {
//   const selectedQuestion =
//     JSON.parse(localStorage.getItem("selectedQuestion")) || {};
//   return selectedQuestion;
// };




export function calculateDaysPassed(timestamp) {
  const startDate = new Date(timestamp);
  const currentDate = new Date();

  const timeDifference = currentDate - startDate;

  // Convert milliseconds to days
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // Determine the appropriate return value based on the number of days
  if (daysDifference === 0) {
    return "today";
  } else {
    // Determine the suffix based on the number of days
    const suffix = daysDifference === 1 ? "day" : "days";
    return `${daysDifference} ${suffix} ago`;
  }
}

export async function generateThumbnail(videoUrl) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata"; // Load metadata to get video dimensions

    video.onloadedmetadata = function () {
      video.currentTime = 5; // Set the time to capture the thumbnail
    };

    video.onseeked = function () {
      const canvas = document.createElement("canvas");
      canvas.width = 120;
      canvas.height = 80;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, 120, 80);
      const thumbnailURL = canvas.toDataURL("image/jpeg");
      resolve(thumbnailURL);
    };

    video.onerror = function () {
      reject(new Error("Failed to load video"));
    };

    video.src = videoUrl;
  });
}

// export function getVideoList() {
//   console.log("getVideoList function triggered");
//   let videoArray = JSON.parse(localStorage.getItem("videoArray")) || [];

//   videoArray = videoArray.map((ele, index) => ({
//     name: ele,
//     value: index,
//   }));
//   return videoArray;
// }

// export const clearStorage = () => {
//   // Retrieve the accessToken from localStorage
//   const accessToken = localStorage.getItem("accessToken");
//   const adminDetails = localStorage.getItem("adminDetails");
//   const apiKey = localStorage.getItem("apiKey");

//   // Clear all data in localStorage
//   localStorage.clear();

//   // If accessToken exists, set it back into localStorage
//   if (accessToken !== null) {
//     localStorage.setItem("accessToken", accessToken);
//     localStorage.setItem("apiKey", apiKey);
//   }
//   if (adminDetails !== null) {
//     localStorage.setItem("adminDetails", adminDetails);
//     localStorage.setItem("videoFiles", JSON.stringify([]));
//     localStorage.setItem("vidData", JSON.stringify([]));
//   }

//   // Add the event listener for beforeunload
//   window.addEventListener("beforeunload", clearStorage);

//   return () => {
//     // Remove the event listener when the component unmounts
//     window.removeEventListener("beforeunload", clearStorage);
//   };
// };
export function convertTimestamp(timestampStr) {
  const [minutes, secondsWithMillis] = timestampStr.split(":");
  const [seconds, millis] = secondsWithMillis.split(".");
  const milliseconds = Math.floor(parseFloat(`0.${millis}`) * 100);

  return `${minutes}:${seconds}:${milliseconds.toString().padStart(2, "0")}`;
}

export const responses = {
  videoId: "xyz",
  analyticData: [
    {
      question: "Did you like the concert?",
      responses: {
        Yes: 2,
        No: 3,
      },
      multiple: false,
      skip: false,
    },
    {
      question: "What aspects of the concert did you disliked?",
      responses: {
        "Well organiseed": 2,
        "Time well spent": 2,
        "Good vibes": 1,
        "Content was good": 4,
        Pricing: 10,
      },
      multiple: true,
      skip: true,
    },
    {
      question: "What aspects of the concert did you disliked?",
      responses: {
        "Well organiseed": 3,
        "Time well spent": 1,
        "Good vibes": 0,
      },
      multiple: true,
      skip: true,
    },
  ],
  totalResponse: 5,
};

export const copyToClipboard = (url, id, onClose) => {
  const token = localStorage.getItem("accessToken");
  fetch(`https://videosurvey.xircular.io/api/v1/video/update/shared/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isShared: true }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
  navigator.clipboard
    .writeText(url)
    .then(() => {
      // Optionally provide feedback to the user
      alert("Campaign URL copied to clipboard!");
      onClose();
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
};
export const handleWhatsAppClick = (shareUrl, id) => {
  const token = localStorage.getItem("accessToken");
  fetch(`https://videosurvey.xircular.io/api/v1/video/update/shared/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isShared: true }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((error) => console.log(error));

  const encodedMessage = encodeURIComponent(`Check out this link: ${shareUrl}`);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");
};

export function getLatestSubscriptionIndex(data) {
  const subscriptions = data[0].subscriptions;
  let latestIndex = 0;
  let latestDate = new Date(subscriptions[0]?.endDate);

  subscriptions.forEach((subscription, index) => {
    const endDate = new Date(subscription.endDate);
    if (endDate > latestDate) {
      latestDate = endDate;
      latestIndex = index;
    }
  });

  return latestIndex;
}

export function getLimitPercentage(allPlans, plans, videoLength) {
  // const allPlans = JSON.parse(localStorage.getItem("plans"))

  const currentDate = new Date();
  const subPlans = allPlans.filter(
    (plan) => new Date(plan.endDate) > currentDate
  );
  let responseLimit = 0;
  //subcription API
  let usedResponses = 0;

  for (let i = 0; i < subPlans.length; i++) {
    responseLimit += Math.ceil(
      subPlans[i].features.totalResponse / (videoLength / 60)
    );
  }
  //maxLimit = 5 videoLength = 2
  for (let i = 0; i < plans.length; i++) {
    // responseLimit =
    //   responseLimit + Math.ceil(plans[i].maxLimit / (videoLength / 60));
    usedResponses += plans[i].totalUsedResponses;
  }
  let percentage = Math.round((usedResponses * 100) / responseLimit);

  console.log(responseLimit, usedResponses, percentage);

  return percentage;
}
export const clearLocalStorage = () => {
  const accessToken = localStorage.getItem("accessToken");
  const adminDetails = localStorage.getItem("adminDetails");
  localStorage.clear();
  if (accessToken !== null) {
    localStorage.setItem("accessToken", accessToken);
  }
  if (adminDetails !== null) {
    localStorage.setItem("adminDetails", adminDetails);
  }
};



export const confirmDelete = (setIsDeleting, videoResult, setVideoResult, onClose, id)=>{
  let token = localStorage.getItem("accessToken")
  setIsDeleting(true);
  axios
    .delete(
      `https://videosurvey.xircular.io/api/v1/video/deleteVideo/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      console.log("Delete request successful");
      console.log(response.data);
      let newArray = videoResult.filter((ele) => ele.video_id !== id);
      setVideoResult(newArray);
      setIsDeleting(false);
      onClose();
    })
    .catch((error) => {
      console.log(error);
      setIsDeleting(false);
      onClose();
    });
}
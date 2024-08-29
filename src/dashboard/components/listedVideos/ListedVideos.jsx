import React, { useEffect, useState } from "react";
import styles from "./listedVideos.module.css";
import { calculateDaysPassed, confirmDelete, getLimitPercentage } from "../../Utils/services";
import menuIcon from "../../images/more_vert.png";
import placeholder from "../../images/videoPlaceholder.png";
import EditandDeletePopup from "../edit&DeletePopup/Edit&DeletePopup";
import axios from "axios";
import Pagination from "../pagination/Pagination";
import ListingPageSkeleton from "../skeletons/LisitngPageSkeleton";
import Spinner from "../spinner/Spinner";
import Alert from "../alert/Alert";

export default function ListedVideos({
  videos,
  totalPages,
  currentPage,
  setCurrentPage,
  isLoading,
  setVideos
}) {
  const [sharedVideos, setSharedVideos] = useState(videos.slice(0, 5));
  const [isAllVideoPopupVisible, setIsAllVideoPopupVisible] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [showallvideo, setShowAllVideo] = useState(true);
  const [showsharedfile, setShowSharedfile] = useState(false);
  const [allPlans, setAllPlans] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [onSuccess, setOnSuccess] = useState(null);

  const getSessionData = async () => {
    const params = new URLSearchParams(window.location.search);
    const accessToken =
      params.get("accessToken") || localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        `https://stream.xircular.io/api/v1/subscription/getCustomerSubscription`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setAllPlans(response.data[0].subscriptions);
      // localStorage.setItem("plans",JSON.stringify(response.data[0].subscriptions))
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const sharedVid = videos.filter((ele) => ele.isShared === true);
    setSharedVideos(sharedVid);
    console.log(videos);
    getSessionData();
  }, [videos]);

  const handleAllVideosMenuClick = (id) => {
    setSelectedId(id);
    setIsAllVideoPopupVisible(!isAllVideoPopupVisible);
    // setIsRecentPopupVisible(false);
  };

  const onAllVideoClose = () => {
    setIsAllVideoPopupVisible(false);
  };

  const handleshowallfiles = () => {
    setShowAllVideo(true);
    setShowSharedfile(false);
  };

  const handlesharedfiles = () => {
    setShowAllVideo(false);
    setShowSharedfile(true);
  };
  function handleFormatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    // Pad the minutes and seconds with leading zeros if necessary
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");
    return `${paddedMinutes}:${paddedSeconds}`;
  }

  return (
    <div className={styles.container}>
      {isAlertVisible && (
        <Alert
          text={alertText}
          onClose={() => setIsAlertVisible(false)}
          onSuccess={()=>confirmDelete(setIsDeleting, videos, setVideos, ()=>setIsAllVideoPopupVisible(false), selectedId)}
          primaryBtnText={"Yes"}
          secondaryBtnText={"Cancel"}
          title={"Confirm Delete"}
        />
      )}
      <div className="tabbtnpanel">
        <button
          id={styles.allvideosbtn}
          onClick={handleshowallfiles}
          style={{
            borderBottom: showallvideo ? "2px solid blue" : "",
            color: showallvideo ? "#4D67EB" : "#1C1B1F",
            fontWeight: showallvideo ? 700 : 400,
            borderRadius: "0px",
          }}
        >
          {" "}
          All Campaigns{" "}
        </button>
        <button
          id={styles.sharedfilebtn}
          onClick={handlesharedfiles}
          style={{
            borderBottom: showsharedfile ? "2px solid blue" : "",
            color: showsharedfile ? "#4D67EB" : "#1C1B1F",
            fontWeight: showsharedfile ? 700 : 400,
            borderRadius: "0px",
          }}
        >
          {" "}
          Shared Campaigns{" "}
        </button>
      </div>
      {isLoading ? (
        <ListingPageSkeleton />
      ) : (
        <>
          {showallvideo && (
            <div className={styles.allVideosSection}>
              <div className={styles.allVideos}>
                {videos.map((video) => (
                  <div
                    key={video.id}
                    onMouseLeave={onAllVideoClose}
                    className={styles.videoWrapper}
                  >
                    {isDeleting && selectedId === video.video_id && (
                      <div className={styles.deleteSpinnerWrapper}>
                        <Spinner size={"medium"} />
                      </div>
                    )}
                    <div className={styles.recentVideo}>
                      <img
                        className={styles.videoThumbnail}
                        src={
                          video?.videoSelectedFile?.thumbnail
                            ? video.videoSelectedFile.thumbnail.url
                            : placeholder
                        }
                        alt=""
                      />
                      <div className={styles.titleBar}>
                        <span id={styles.firsttext}>{video.title}</span>
                        <span id={styles.secondtext}>
                          Saved {calculateDaysPassed(video.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <span className={styles.timeStamp}>
                      {handleFormatTime(video.videoLength)}
                    </span>
                    <div className={styles.limitIndicatorWrapper}>
                      {video?.plans[0]?.plans &&
                        (() => {
                          const combinedUsedPercentage = getLimitPercentage(
                            allPlans,
                            video?.plans[0].plans,
                            video.videoLength
                          );
                          if (combinedUsedPercentage >= 90) {
                            return (
                              <span className={styles.limitIndicator}>
                                {combinedUsedPercentage}% of response limit
                                reached
                              </span>
                            );
                          }
                          return null;
                        })()}
                    </div>
                    <div
                      className={styles.menuIcon}
                      onClick={() => handleAllVideosMenuClick(video.video_id)}
                    >
                      <img src={menuIcon} alt="Menu" />
                    </div>
                    {isAllVideoPopupVisible &&
                      selectedId === video.video_id && (
                        <EditandDeletePopup
                          setIsDeleting={setIsDeleting}
                          onClose={onAllVideoClose}
                          video={video}
                          id={video.video_id}
                          setAlertText={setAlertText}
                          setIsAlertVisible={setIsAlertVisible}
                          setOnSuccess={setOnSuccess}
                        />
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {showsharedfile && (
            <div className={styles.allVideosSection}>
              <div className={styles.allVideos}>
                {sharedVideos.map((video) => (
                  <div
                    key={video.id}
                    onMouseLeave={onAllVideoClose}
                    className={styles.videoWrapper}
                  >
                    <div className={styles.recentVideo}>
                      <img
                        className={styles.videoThumbnail}
                        src={
                          video?.videoSelectedFile?.thumbnail
                            ? video.videoSelectedFile.thumbnail.url
                            : placeholder
                        }
                        alt=""
                      />
                      <div className={styles.titleBar}>
                        <span id={styles.firsttext}>{video.title}</span>
                        <span id={styles.secondtext}>
                          Shared {calculateDaysPassed(video.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <span className={styles.timeStamp}>
                      {handleFormatTime(video.videoLength)}
                    </span>
                    <div
                      className={styles.menuIcon}
                      onClick={() => handleAllVideosMenuClick(video.video_id)}
                    >
                      <img src={menuIcon} alt="Menu" />
                    </div>
                    {isAllVideoPopupVisible &&
                      selectedId === video.video_id && (
                        <EditandDeletePopup
                          onClose={onAllVideoClose}
                          video={video}
                          id={video.video_id}
                        />
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}

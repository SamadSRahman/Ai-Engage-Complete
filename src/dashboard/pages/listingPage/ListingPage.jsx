import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "./listingPage.module.css";
import webcam from "../../images/videocam.svg";
import axios from "axios";
import ListedVideos from "../../components/listedVideos/ListedVideos";
import { useNavigate } from "react-router-dom";
import EditandDeletePopup from "../../components/edit&DeletePopup/Edit&DeletePopup";
import search from "../../images/search.png";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  isPopupVisibleAtom,
  selectedVideoAtom,
  vidAtom,
  videoResultAtom,
  videoFilesAtom,
} from "../../Recoil/store";
import Navbar from "../../components/navbar/Navbar";
import introJs from "intro.js";
import { Steps } from "intro.js-react";
import "intro.js/introjs.css";
import { clearStorage } from "../../Utils/services";
import Spinner from "../../components/spinner/Spinner";
import Pagination from "../../components/pagination/Pagination";

export default function ListingPage() {
  const setVid = useSetRecoilState(vidAtom);
  const setVideoFiles = useSetRecoilState(videoFilesAtom);
  const setSelectedVideo = useSetRecoilState(selectedVideoAtom);
  const [vidoes, setVideo] = useRecoilState(videoResultAtom);
  const setIsPopupVisible = useSetRecoilState(isPopupVisibleAtom);
  const [loading, setLoading] = useState(false);
  const [isSearchPopupVisible, setIsSearchPopupVisible] = useState(false);
  const [isSearchDrawVisible, setIsSearchDrawVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchVideos, setSearchVideos] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getAccessToken = () => {
    const accessToken = Cookies.get("access_token");
    if (accessToken) localStorage.setItem("accessToken", accessToken);
  };

  useEffect(() => {
    setVid([]);
    setVideoFiles([]);
    setSelectedVideo({});
    document.title = "Home";
    getAccessToken();
  }, []);

  const [intro, setIntro] = useState(null);
  useEffect(() => {
    const introInstance = introJs();
    setIntro(introInstance);

    return () => {
      if (introInstance) {
        introInstance.exit();
      }
    };
  }, []);

  const steps = [
    {
      intro:
        "Welcome to Campaign Creator App! Let me show you how things work out here",
      position: "right",
      tooltipClass: "myTooltipClass",
      highlightClass: "myHighlightClass",
    },
    {
      intro: "You can find your created campaings here",
      element: ".mainContainer",
    },
    {
      intro: "You can search for campaigns using their title",
      element: "#searchDraw",
    },
    { intro: "You can start a new campaign from here", element: "#btnSection" },
    {
      intro: "You can check your profile and log out of your account from here",
      element: "#navbarWrapper",
      position: "bottom",
      tooltipClass: "myTooltipClass",
      highlightClass: "myHighlightClass",
    },
  ];
  // let token = localStorage.getItem("accessToken");
  async function getData(token) {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://videosurvey.xircular.io/api/v1/video/getAllVideo?page=${currentPage}&limit=12}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.setItem("adminId", response.data.videoResult[0]?.createdBy);
      let videoResult = [...response.data.videoResult].reverse();
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      console.log(videoResult);
      setVideo([...videoResult]);
      setSearchVideos([...videoResult]);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      if (error.response.status === 401) {
        alert("Session expired. Please log in again");
        localStorage.removeItem("accessToken")
        navigate("/SignIn")
      }
      setLoading(false);
      throw error;
    }
  }
  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const accessToken =
  //     params.get("accessToken") || localStorage.getItem("accessToken");
  //   const sessionId =
  //     params.get("sessionId") || localStorage.getItem("sessionId");
  //   if (!accessToken) {
  //     window.location.href = "https://aiengage.xircular.io/";
  //   } else {
  //     localStorage.setItem("accessToken", accessToken);
  //     localStorage.setItem("sessionId", sessionId);
  //     getData(accessToken);
  //   }
  // }, [currentPage]);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    let search = e.target.value.toLowerCase();
    console.log(search);
    const searchedItems = vidoes.filter((ele) => {
      return ele.title.toLowerCase().includes(search);
    });
    console.log(searchedItems);
    setSearchVideos(searchedItems);
  };
  const onClose = () => {
    setIsSearchPopupVisible(false);
  };
  const handleSearchClick = (ele) => {
    setSelectedId(ele.video_id);
    setIsSearchPopupVisible(!isSearchPopupVisible);
  };
  const handlePopupClose = () => {
    setIsSearchDrawVisible(false);
    setIsPopupVisible(false);
  };

  function handleCreateNew() {
    const features = JSON.parse(localStorage.getItem("features"));
    // if(features){
    //   if(features["no.of campaign"]>vidoes.length){
    //     clearStorage();
    //     navigate("/createNew");

    //   }
    //   else{
    //     alert("You have reached the limit for your plan, please upgrade your plan or delete exisitng camp")
    //   }
    // }

    // else{
    clearStorage();
    navigate("/createNew");
    // }
  }

  return (
    <div className={styles.ListingPageWrapper}>
      <div className="mainContainer">
        <div id="navbarWrapper">
          <Navbar showrightmenu={"false"} />
        </div>

        <nav className={styles.navbar}>
          <h3> Video Campaigns </h3>
          <div id="searchDraw">
            {vidoes.length > 0 && (
              <div className={styles.inputWrapper}>
                <img className={styles.searchImg} src={search} alt="" />
                <input
                  onFocus={() => setIsSearchDrawVisible(!isSearchDrawVisible)}
                  value={searchText}
                  onChange={handleSearch}
                  type="text"
                  placeholder="Search for campaigns"
                />
                {isSearchDrawVisible && searchVideos.length > 0 ? (
                  <div className={styles.searchDrawWrapper}>
                    {searchVideos.map((ele, i) => (
                      <div
                        key={ele.id}
                        onClick={() => handleSearchClick(ele)}
                        className={styles.searchDraw}
                      >
                        <span>{ele.title}</span>
                        {selectedId === ele.video_id &&
                          isSearchPopupVisible && (
                            <EditandDeletePopup
                              style={{ top: `${i * 40 + 10}px`, left: "16rem" }}
                              onClose={onClose}
                              video={ele}
                              id={ele.video_id}
                            />
                          )}
                      </div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}
          </div>
          <div id="btnSection" className={styles.btnSection}>
            <button onClick={handleCreateNew}> + Create new campaign </button>
          </div>
        </nav>

        {loading ? (
          <div
            className={styles.placeholderWrapper}
            style={{ display: "flex", justifyContent: "center" }}
          >
            {" "}
            <div style={{ margin: "auto" }}>
              <Spinner size={"large"} />
            </div>
          </div>
        ) : (
          <div
            id="test1"
            onClick={handlePopupClose}
            className={styles.placeholderWrapper}
          >
            {!vidoes.length > 0 ? (
              <div className={styles.emptyPage}>
                <img src={webcam} alt="" />
                <span className={styles.placeholderHeader}>
                  No campaigns created yet
                </span>
                <span
                  onClick={handleCreateNew}
                  className={styles.placeholderText}
                >
                  Click here to start
                </span>
              </div>
            ) : (
              <div className="listedVideoWrapper">
                <ListedVideos
                  videos={vidoes}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import VideoJs from "./Videojs";
import InputFieldWithChildren from "./InputField";
import PointerComponent from "./components/pointerComponent/PointerComponent";
import Navbar from "./components/navbar/Navbar";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isEditorVisibleAtom, fileNameAtom } from "./Recoil/store";
import TimelineSection from "./components/timelineSection/TimelineSection";
import Alert from "./components/alert/Alert";
import { useNavigate } from "react-router-dom";
import SkeletonPage from "./components/skeletons/SkeletonPage";
import "./App.css";

builder.init("403c31c8b557419fb4ad25e34c2b4df5");

export default function App() {
  const setFileName = useSetRecoilState(fileNameAtom);
  const isEditorVisible = useRecoilValue(isEditorVisibleAtom);
  const isPreviewingInBuilder = useIsPreviewing();
  const [notFound, setNotFound] = useState(false);
  const [content, setContent] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const thumbnails = JSON.parse(localStorage.getItem("thumbnails"));
    console.log(thumbnails);
    const unloadCallback = (event) => {
      if (thumbnails.length > 0) {
        console.log("Reload condition triggered", thumbnails);
        event.preventDefault();
        event.returnValue = "";
        return "";
      }
    };
    window.addEventListener("beforeunload", unloadCallback);
    clearLocalStorage();
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  const clearLocalStorage = () => {
    const accessToken = localStorage.getItem("accessToken");
    const adminDetails = localStorage.getItem("adminDetails");

    localStorage.clear();
    console.log("Clear event triggered");

    if (accessToken !== null) {
      localStorage.setItem("accessToken", accessToken);
    }
    if (adminDetails !== null) {
      localStorage.setItem("adminDetails", adminDetails);
    }
  };

  useEffect(() => {
    async function fetchContent() {
      setIsLoading(true);
      const content = await builder
        .get("page", {
          url: "/editor",
        })
        .promise();
      setContent(content);
      setNotFound(!content);
      setIsLoading(false);
    }
    fetchContent();
    document.title = "Create new campaign";
    let accessToken = localStorage.getItem("accessToken");
    setFileName("");
    if (!accessToken) {
      navigate("/");
    }
  }, []);

  if (notFound && !isPreviewingInBuilder) {
    return <div>404</div>;
  }
  if (isLoading) {
    return <SkeletonPage />;
  }
  return (
    <div className="CreateContainer">
      {isAlertVisible && (
        <Alert
          text="You have unsaved data, are you sure you want to leave this page?"
          primaryBtnText={"Yes"}
          title={"Alert"}
          secondaryBtnText={"No"}
          onClose={() => setIsAlertVisible(false)}
          onSuccess={() => {
            clearLocalStorage();
            setIsAlertVisible(false);
          }}
        />
      )}
      <Navbar isrightsidemenu={true} />
      <BuilderComponent
        model="page"
        content={content}
        data={{
          isEditorVisible: isEditorVisible,
        }}
      />
      {!isEditorVisible && <TimelineSection />}
    </div>
  );
}

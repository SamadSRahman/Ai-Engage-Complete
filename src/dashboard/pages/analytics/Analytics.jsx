import React, { useEffect, useState } from "react";
import styles from "./analytics.module.css";
import Navbar from "../../components/navbar/Navbar";
import arrowBack from "../../images/arrow_back.svg";
import analyticsLogo from "../../images/equalizer.svg";
import Charts from "../../components/chart/Chart";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Spinner from "../../components/spinner/Spinner";
import placeHolder from "../../images/analyticPlaceholder.jpg";
import Summary from "./Summary";

export default function Analytics() {
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const [isAnalyticDataPresent, setIsAnalyticDataPresent] = useState(false);
  const [totalResponse, setTotalResponse] = useState();
  const [analyticId, setAnalyticId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("Title");
  const navigate = useNavigate();
  const { id } = useParams();
  const [analyticData, setAnalyticData] = useState([]);
  useEffect(() => {
    document.title = "Analytics";

    let token = localStorage.getItem("accessToken");
    const fetchAnalytics = () => {
      fetch(
        `https://videosurvey.xircular.io/api/v1/video/analytic/feedback/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false);
          console.log(data);
          if (
            data.message === "No data found with videoId associated with admin"
          ) {
            // alert("No analytic data is awailable for this campagin yet")
            setIsAnalyticDataPresent(false);
          } else {
            setAnalyticData(data.data.analyticData);
            setTitle(data.data.videoRes.title);
            setTotalResponse(data.data.totalResponse);
            setAnalyticId(data.data.id);
            setIsAnalyticDataPresent(true);
          }
          localStorage.setItem("fileName", data.data.videoId.title);
        })
        .catch((error) => console.log(error));
    };
    fetchAnalytics();
  }, []);
  const downloadPDF = () => {
    const input = document.getElementById("chartContainer");

    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("chart.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  return (
    <div>
      <Navbar
        onExportClick={downloadPDF}
        isSaveBtnVisible={true}
        isExportBtnVisible={true}
        isShareBtnHidden={true}
        title={title}
      />

      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div
              className={styles.backBtn}
              onClick={() => navigate("/listings")}
            >
              <img src={arrowBack} alt="" />
              <span>Back</span>
            </div>
            <div className={styles.title}>
              <img src={analyticsLogo} alt="" />
              <span>Analytics</span>
            </div>
          </div>

          <div className={styles.body}>
            {isLoading ? (
              <div className={styles.spinnerContainer}>
                <Spinner size={"large"} />
              </div>
            ) : isAnalyticDataPresent ? (
              <div className={styles.questionsDiv} id="chartContainer">
                {analyticData.map((question, index) => (
                  <div
                    style={
                      index === 0
                        ? {
                            borderTopLeftRadius: "0px",
                            borderTopRightRadius: "0px",
                          }
                        : {}
                    }
                    key={index}
                    className={styles.questionCard}
                  >
                    <span className={styles.questionIndex}>
                      Question {index + 1}
                    </span>
                    <span>{question.question}</span>
                    <Charts
                      data={question.responses}
                      totalResponse={totalResponse}
                      noOfSkips={question.noOfSkip}
                    />
                  </div>
                ))}
                <div className={styles.summarySection}>
                  <button
                    className={styles.summaryBtn}
                    onClick={() => setIsSummaryVisible(true)}
                  >
                    Generate Summary
                  </button>
                  {isSummaryVisible && (
                    <div className={styles.summaryBody}>
                      <Summary id={analyticId} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.placeHolderContainer}>
                <img src={placeHolder} alt="" />
                <span>No Analytic Data available for this campagin</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

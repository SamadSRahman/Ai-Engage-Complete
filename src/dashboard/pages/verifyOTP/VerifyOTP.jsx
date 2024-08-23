import { useEffect, useState } from "react";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OTPVerifier from "../../components/otpVerifier/OTPVerifier";
import { useRecoilValue } from "recoil";
import { otpValuesAtom } from "../../Recoil/store";

builder.init("403c31c8b557419fb4ad25e34c2b4df5");

export default function VerifyOTP() {
    const otpValues = useRecoilValue(otpValuesAtom)
  const isPreviewingInBuilder = useIsPreviewing();
  const [notFound, setNotFound] = useState(false);
  const [content, setContent] = useState(null);
  const [counter, setCounter] = useState(30);

  const navigate = useNavigate();
  useEffect(() => {
    async function fetchContent() {
      const content = await builder
        .get("page", {
          url: "/verify-otp",
        })
        .promise();
      setContent(content);
      setNotFound(!content);
      if (content?.data.title) {
        document.title = content.data.title;
      }
    }
    fetchContent();
  }, [window.location.pathname]);


  useEffect(() => {
    // If counter reaches 0, stop the timer
    if (counter === 0) return;

    // Update the counter every second
    const timer = setInterval(() => {
      setCounter(prevCounter => prevCounter - 1);
    }, 1000);

    // Clear the interval when component unmounts or when counter reaches 0
    return () => clearInterval(timer);
  }, [counter]);

  if (notFound && !isPreviewingInBuilder) {
    return <div>Page not found</div>;
  }

  return (
    <>
      <BuilderComponent
        model="page"
        content={content}
        data={{
          formData: {
            email: "",
            password: "",
          },
          otpValues:otpValues,
          isVisible:'false',
          navigate: navigate,
          errorMess: {
            email: "",
            forgotPassEmail: "",
          },
          counter:counter,
        }}
        context={{
          axios: axios,
        }}
      />
    </>
  );
}

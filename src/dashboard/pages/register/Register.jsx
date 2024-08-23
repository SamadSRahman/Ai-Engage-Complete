import { useEffect, useState } from "react";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import axios from "axios";

builder.init("403c31c8b557419fb4ad25e34c2b4df5");

export default function Register() {
  const isPreviewingInBuilder = useIsPreviewing();
  const [notFound, setNotFound] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    async function fetchContent() {
      const content = await builder
        .get("page", {
          url: "/editor-register",
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

  if (notFound && !isPreviewingInBuilder) {
    return <div>Page not found</div>;
  }

  return (
    <>
      <BuilderComponent model="page" content={content} data={{
        formData:{
            name:"",
            email:"",
            password:"",
            confirmPass:""
        },
        isForgotPassVisible:false,
        errorMess:{
            name:"",
            email:"",
            pass:"",
            confirmPass:""
        }
      }} 
      context={{
        axios:axios
      }}
      />
    </>
  );
}

import { useEffect, useState } from "react";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

builder.init("403c31c8b557419fb4ad25e34c2b4df5");

export default function ChangePassword() {
  const isPreviewingInBuilder = useIsPreviewing();
  const [notFound, setNotFound] = useState(false);
  const [content, setContent] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchContent() {
      const content = await builder
        .get("page", {
          url: "/change-password",
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
      <BuilderComponent
        model="page"
        content={content}
        data={{
          formData: {
            password: "",
            confirmPassword: "",
          },
          navigate: navigate,
          errorMess: {
            pass: "",
            confirmPass: "",
          },
        }}
        context={{
          axios: axios,
        }}
      />
    </>
  );
}

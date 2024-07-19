import React from 'react'
import { Helmet } from "react-helmet";

const NotFound = () => {
  return (
    <div>
        <Helmet>
        <meta name="robots" content="noindex" />
        </Helmet>

     <h1>404</h1>
     <h1>Not Found</h1>
    </div>
  )
}

export default NotFound

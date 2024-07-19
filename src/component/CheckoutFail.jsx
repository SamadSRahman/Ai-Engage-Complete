import React from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Helmet } from 'react-helmet';

const CheckoutFail = () => {
    const navigate = useNavigate(); 
    const handleClick = () => {
        navigate("/");
    };
  return (
    <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center', fontFamily:'Inter',marginTop:'8rem'}}>
        <Helmet>
        <meta name="robots" content="noindex" />
        </Helmet>
    
    <div><h1>payment failed</h1></div>
      <div><Button  variant="contained" className="signIn-button" onClick={handleClick}>Back</Button></div>
    </div>
  )
}

export default CheckoutFail

import React from 'react'
import { Helmet } from 'react-helmet'

const CheckoutSuccess = () => {
  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center', fontFamily:'Inter',marginTop:'8rem'}}>
    
        <Helmet>
        <meta name="robots" content="noindex" />
        </Helmet>
  
        <h1>payment successful</h1>
    </div>
  )
}

export default CheckoutSuccess

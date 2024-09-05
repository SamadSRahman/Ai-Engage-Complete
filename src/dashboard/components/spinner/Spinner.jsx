import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';



// Create the Spinner component
const Spinner = ({size, color}) => {

  const [width, setWidth] = useState('20px')
  const [border, setBorder] = useState('3px')

useEffect(()=>{
  if(size==='large'){
    setWidth("80px")
    setBorder('5px')
      }
      else if(size==='medium'){
        setWidth("40px")
        setBorder('4px')
      }

},[size])

  // Define the animation keyframes
const rotate = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
`;

// Create the styled component for the spinner
const SpinnerContainer = styled.div`
display: inline-block;
position: relative;

`;
/*
width: 35px;
height: 35px;

position: absolute;

*/

const SpinnerCircle = styled.div`
box-sizing: border-box;
display: block;
width: ${width};
height: ${width};
margin: 0px;
border: ${border} solid #fff;
border-radius: 50%;
animation: ${rotate} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
border-color: ${color?color:"#4D67EB"} transparent transparent transparent;
`;
return(
  <SpinnerContainer>
    <SpinnerCircle />
  </SpinnerContainer>
);
}

export default Spinner;
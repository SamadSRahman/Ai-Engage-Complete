import React, { useEffect, useRef } from 'react'
import Navbar from './component/navbar/Navbar'
import Pricing from './component/pricing/Pricing'
import Herosection from './component/herosection/Herosection'
import Uniqueus from './component/Uniqueus/Uniqueus'
import Usecases from './component/Usecases/Usecases'
import Intro from './component/Introsection/Intro'
import FreeTrialBanner from './component/Freetrialbanner/FreeTrialBanner'
import { useLocation } from 'react-router-dom'


const Home = () => {
  const pricingRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/plans") {
      pricingRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);
  return (
     <>
          <Navbar />
          <Herosection />
          <Intro />
          <Uniqueus />
          <Usecases />
 <div ref={pricingRef}>
 <Pricing />
 </div>
          <FreeTrialBanner />       
     </>
  )
}

export default Home
import React from 'react'
import Navbar from './component/navbar/Navbar'
import Pricing from './component/pricing/Pricing'
import Herosection from './component/herosection/Herosection'
import Uniqueus from './component/Uniqueus/Uniqueus'
import Usecases from './component/Usecases/Usecases'
import Intro from './component/Introsection/Intro'
import FreeTrialBanner from './component/Freetrialbanner/FreeTrialBanner'


const Home = () => {
  return (
     <>
          <Navbar />
          <Herosection />
          <Intro />
          <Uniqueus />
          <Usecases />
          <Pricing />
          <FreeTrialBanner />       
     </>
  )
}

export default Home
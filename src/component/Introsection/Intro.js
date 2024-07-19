import React, { useRef } from 'react';
import './intro.css';
import demo from './demo.mp4';
import demo2 from './demo2.mp4';
import portal from './Icon.png';
import dmtag from './training-video-icon 1.png';
import fstag from './fullscreen.png';

const Intro = () => {

  const videoRef = useRef(null);
  const fullscreenBtnRef = useRef(null);

  const handleVideoClick = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className='intro container'>
    
      <div className='introwrapper'>
      
          <div className='videosec'>
          <div className='introvideowrapper'>
            <video  
              autoPlay 
              muted 
              loop  
              ref={videoRef}
              onClick={handleVideoClick}>
            <source src={demo2} type="video/mp4"></source>
            </video>
              <div className="demovideotag"> <img src={dmtag} width={15}  height={16} alt="Online customer surveying tool" /> <span> Demo video </span> </div>
               <button 
                id="fullscreenbtn"
                ref={fullscreenBtnRef}
                onClick={toggleFullscreen} > 
              <img src={fstag} alt="Online customer surveying solution"  /> 
              </button>
          </div>
          </div>

           <div className='contentsec'>
            <div className='introcontent'>
                <img  id ="shineiconwrapper" src={portal} alt="customer survey tools" />
                <h2> Tired of static surveys with <br></br> low completion rates and bland data ? </h2>
                <p><strong style={{color:'#E87211'}}>AI Engage</strong> ushers in a new era of data collection with interactive video surveys. Craft engaging experiences that capture rich insights - all powered by the magic of AI. </p>
            </div>
           </div>

      </div>

    </div>
  )
}

export default Intro
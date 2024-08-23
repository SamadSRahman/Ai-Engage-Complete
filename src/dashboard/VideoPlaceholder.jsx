import './videoPlaceholder.css'
import videoCam from './images/videocam.png'
import video from './images/videos-icon 1.svg'
function VideoPlaceholder() {
  return (
    <div className='videoPHContainer'>
        <div className='imgContainer'>
    <img src={video} alt="" className="vidPImg" />
        </div>
        <span>
            No videos to show
        </span>
    </div>
  )
}

export default VideoPlaceholder
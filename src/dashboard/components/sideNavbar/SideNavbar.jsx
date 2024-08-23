import React from 'react'
import styles from "./sideNavbar.module.css"
import { Builder } from '@builder.io/react'
import videoActive from '../../images/createVideoActive.png'
import audio from '../../images/createAudio.png'
import text from '../../images/createText.png'


export default function SideNavbar() {
  return (
    <div className={styles.container}>
        <img src={videoActive} alt="" />
        <img src={audio} alt="" />
        <img src={text} alt="" />
    </div>
  )
}
Builder.registerComponent(SideNavbar,{
    name:"Side Navbar",
    noWrap:false
})
import { atom } from "recoil";

export const videoSrcAtom = atom({
    key:'videoSrcAtom',
    default:""
})
export const fileNameAtom = atom({
    key:'fileNameAtom',
    default:""
})
export const videoAtom = atom({
    key:'videoAtom',
    default:null
})
export const videoRefAtom = atom({
    key:'videoRefAtom',
    default:null
})
export const mainIdAtom = atom({
    key:'mainIdAtom',
    default:"",
})
export const pinPositionAtom = atom({
    key:'pinPositionAtom',
    default:null
})
export const markedPositionAtom = atom({
    key:'markedPositionAtom',
    default:[]
})

export const videoFilesAtom = atom({
    key:"videoFilesAtom",
    default:[]
})
export const questionsArrayAtom = atom({
    key:"questionsArrayAtom",
    default:[]
})
export const videoDurationAtom = atom({
    key:"videoDurationAtom",
    default:0,
})
export const currentTimeAtom = atom({
    key:"currentTimeAtom",
    default:0,
})
export const questionPopupVisibleAtom = atom({
    key:"questionPopupVisibleAtom",
    default:false,
})
export const isViewMessagePopupVisibleAtom = atom({
    key:"isViewMessagePopupVisibleAtom",
    default:false,
})
export const isEditPopupAtom = atom({
    key:"isEditPopupAtom",
    default:false,
})
// let vidData = JSON.parse(localStorage.getItem("vidData"))||[]
export const vidAtom = atom({
    key:"vidAtom",
    default:[]
})
export const questionIndexAtom = atom({
    key:"questionIndexAtom",
    default:null
})
export const videoFilesArrayAtom = atom({
    key:"videoFilesArrayAtom",
    default:[]
})
let selectedVideo = {}
let selectVideo = localStorage.getItem("selectedVideo")
if(selectVideo!==undefined){
    
}
else{
    console.log(selectVideo,selectedVideo)
    selectedVideo=JSON.parse(selectVideo)
}

export const selectedVideoAtom = atom({
    key:"selectedVideoAtom",
    default:selectedVideo,
})
export const selectedQuestionAtom = atom({
    key:"selectedQuestionAtom",
    default:{}
})
export const isEditorVisibleAtom = atom({
    key:"isEditorVisibleAtom",
    default:false
})
export const otpValuesAtom = atom({
    key:"otpValuesAtom",
    default:["", "", "", "", "", ""]
})
export const currentIndexAtom = atom({
    key:"currentIndexAtom",
    default:0
})
export const isPopupVisibleAtom = atom({
    key:"isPopupVisibleAtom",
    default:false
})
export const videoDataAtom = atom({
    key:"videoDataAtom",
    default:[]
})
export const videoSrcArrayAtom = atom({
    key:"videoSrcArrayAtom",
    default:[]
})
export const videoResultAtom = atom({
    key:"videoResultAtom",
    default:[]
})
export const isDeletingAtom = atom({
    key:'isDeletingAtom',
    default:false
})
export const isVideoLoadingAtom = atom({
    key:'isVideoLoadingAtom',
    default:false
})
export const isThumbnailGeneratingAtom = atom({
    key:'isThumbnailGeneratingAtom',
    default:false
})
export const videoListAtom = atom({
    key:'videoListAtom',
    default:[]
})
export const isPlayingAtom = atom({
    key:"isPlayingAtom",
    default:false
})

export const isSaveBtnVisibleForEditAtom = atom({
    key:"isSaveBtnVisibleForEditAtom",
    default:false
})

export const reloadCounterForEditAtom = atom({
    key:"reloadCounterForEditAtom",
    default:0
})
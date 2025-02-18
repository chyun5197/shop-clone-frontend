import {useContext, useEffect, useState} from "react";
import {PrimaryStateContext} from "../App.jsx";

const Banner = () => {
    const primaryInfo = useContext(PrimaryStateContext)
    // const [bannerImg, setBannerImg] = useState(null);
    // useEffect(() => {
    //     setBannerImg(localStorage.getItem("banner"))
    // }, [localStorage.getItem("banner")])


    return (
        <p className='banner'>
            <img className='bannerImg' src={localStorage.getItem("banner")} alt='배너'/>
            {/*<img className='bannerImg' src={primaryInfo['banner']} alt='배너'/>*/}
            {/*<div>{primaryInfo['banner']}</div>*/}
        </p>
    )
}
export default Banner;

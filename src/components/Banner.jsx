import {useContext, useEffect} from "react";
import {PrimaryStateContext} from "../App.jsx";

const Banner = () => {
    const primaryInfo = useContext(PrimaryStateContext)




    return (
        <p className='banner'>
            <img className='bannerImg' src={primaryInfo['banner']} alt='배너'/>
            {/*<div>{primaryInfo['banner']}</div>*/}
        </p>
    )
}
export default Banner;

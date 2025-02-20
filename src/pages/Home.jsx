import home1 from "../assets/home-1-2.jpg"
import {useContext} from "react";
const Home = () => {
    localStorage.setItem("banner", home1)

    return <div>
        <img className='homeImg' src={localStorage.getItem("banner")} alt='실제'/>
    </div>
};
export default Home;
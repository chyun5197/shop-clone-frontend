import home1 from "../assets/home-1-2.jpg"
import {useContext} from "react";
const Home = () => {


    return <div>
        <img className='homeImg' src={home1} alt='실제'/>
        <h2>
            홈화면
        </h2>
    </div>
};
export default Home;
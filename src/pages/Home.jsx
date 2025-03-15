import {useCallback, useEffect} from "react";
import axios from "axios";

const Home = () => {
    localStorage.setItem("banner", "https://cdn.hyun-clone.shop/home-1-2.jpg")

    // 헬스체크
    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get(
                    import.meta.env.VITE_API_URL + '/health'
                );
                console.log(response.data);
            }catch(error){
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return <div>
        <img className='homeImg' src={localStorage.getItem("banner")} alt='실제'/>
    </div>
};
export default Home;
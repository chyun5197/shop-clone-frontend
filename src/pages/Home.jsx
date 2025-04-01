import {useContext, useEffect} from "react";
import axios from "axios";
import {useSearchParams} from "react-router-dom";
import {PrimaryStateContext} from "../App.jsx";

const Home = () => {
    localStorage.setItem("banner", "https://cdn.hyun-clone.shop/home-1-2.jpg")
    // const primaryInfo = useContext(PrimaryStateContext)

    // 소셜로그인 액세스토큰 저장 : 쿼리파라미터에 액세스토큰 있으면 저장
    // const [params, setParams] = useSearchParams();
    // if(params.get("access_token")){
    //     localStorage.setItem("access_token", params.get("access_token"));
    //     primaryInfo.isLogin = true;
    // }

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
import {useContext, useEffect} from "react";
import {PrimaryStateContext} from "../App.jsx";
import {useNavigate, useSearchParams} from "react-router-dom";

const OauthHandler = () => {
    const primaryInfo = useContext(PrimaryStateContext)
    const nav = useNavigate()

    // 소셜로그인 액세스토큰 저장 : 쿼리파라미터에 액세스토큰 있으면 저장
    const [params, setParams] = useSearchParams();
    useEffect(()=>{
        if(params.get("access_token")){
            alert("로그인 성공!")
            localStorage.setItem("access_token", params.get("access_token"));
            // 만료시간 4시간 (액세스 토큰과 동일)
            let tokenExpiration = new Date().getTime() + 1000 * 60 * 60 * 4;
            localStorage.setItem("expiration", tokenExpiration)
            primaryInfo.isLogin = true;
        }else{
            alert("사용자 정보를 가져오지 못했습니다.")
        }
        nav('/')
    }, [])

};
export default OauthHandler;
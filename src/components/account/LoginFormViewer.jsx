import './LoginFormViewer.css'
import {Link, useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {PrimaryStateContext} from "../../App.jsx";
import axios from "axios";
import {useCookies} from "react-cookie";

const LoginFormViewer = () => {
    const nav = useNavigate()
    const primaryInfo = useContext(PrimaryStateContext)

    const [user, setUser] = useState({
        id: "",
        pw: "",
    });

    const [cookies, setCookie, removeCookie] = useCookies(['refresh_token']); //쿠키이름

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        })
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('email', user.id);
            formData.append('password', user.pw);

            const response = await axios({
                url: import.meta.env.VITE_API_URL + '/login-form',
                method: 'POST',
                data: formData,
                withCredentials: true,
            });
            if (response.status === 200) {
                alert('로그인 성공! ');
                localStorage.setItem("access_token", response.data.accessToken);

                // 만료시간 4시간 (액세스 토큰과 동일)
                let tokenExpiration = new Date().getTime() + 1000 * 60 * 60 * 4;

                localStorage.setItem("expiration", tokenExpiration)

                // 현재 스프링에서 받아온 쿠키는 새로고침하면 사라진다.. => 일단 바디로 받아서 훅으로 setCookie
                // localStorage.setItem("refresh_token", response.data.refreshToken);
                setCookie('refresh_token', response.data.refreshToken);
                primaryInfo.isLogin = true;

                nav('/')
            }
        } catch (error) { // 리액트는 400번대를 에러로 처리
            alert('아이디 혹은 비밀번호가 틀렸습니다!')
            // alert(error.response.data.message)
            // alert(error.status) // 401
        }
        // console.log(cookies.refresh_token)
    };



    return (
        <div className="contents">
            <div className="titleArea">
                <h2>로그인</h2>
            </div>
            <div className="login-background">
                <div className="login">
                    <h3>
                        <img src="//img.echosting.cafe24.com/skin/base_ko_KR/member/h3_login.gif" alt="회원로그인"/>
                    </h3>
                    <fieldset>
                        <form onSubmit={handleLogin}>
                            <label className="id" title="아이디">
                                <input type="text" name="id" placeholder="아이디"
                                       value={user.id} onChange={handleChange}/>
                            </label>
                            <label className="password" title="비밀번호">
                                <input type="password" name="pw" placeholder="비밀번호"
                                       value={user.pw} onChange={handleChange}/>
                            </label>
                            <p className="security">
                                <img src="//img.echosting.cafe24.com/design/skin/default/member/ico_access.gif"
                                     alt="보안접속"/> 보안접속
                            </p>
                            <button className="submit-button" type="submit">
                                <img src="//img.echosting.cafe24.com/skin/base_ko_KR/member/btn_login.gif" alt="로그인"/>
                            </button>
                            <p>
                                <Link to="/register">
                                    <img src="//img.echosting.cafe24.com/skin/base_ko_KR/member/btn_join.gif" alt="회원가입"/>
                                </Link>
                            </p>
                        </form>


                    </fieldset>
                </div>
            </div>
        </div>
    )

}
export default LoginFormViewer;
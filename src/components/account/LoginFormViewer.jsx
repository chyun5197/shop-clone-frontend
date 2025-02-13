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

    const [cookies, setCookie, removeCookie] = useCookies(['refreshToken']); //쿠키이름

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
                localStorage.setItem("refresh_token", response.data.refreshToken); // -> 추후 Redis에 저장
                primaryInfo.isLogin = true;

                setCookie('refresh_token', response.data.refreshToken);

                nav('/')
            }
        } catch (error) {
            console.log('로그인 에러: ', error);
        }
    };



    return (
        <div>
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
import {Link, useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {PrimaryStateContext} from "../App.jsx";
import axios from "axios";

const LoginFormPage = () => {
    const nav = useNavigate()
    const primaryInfo = useContext(PrimaryStateContext)

    const [user, setUser] = useState({
        id: "",
        pw: "",
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('email', user.id);
            formData.append('password', user.pw);

            const response = await axios({
                url: 'http://localhost:8080/login-form',
                method: 'POST',
                data: formData,
                withCredentials: true,
            });
            if (response.status === 200) {
                alert('로그인 성공! ');
                console.log('유저 이메일: ' + response.data.email);
                console.log('액세스 토큰: ' + response.data.token);
                primaryInfo.isLogin = true;
                console.log(primaryInfo.isLogin);
                nav('/')
            }
        } catch (error) {
            console.log('로그인 에러: ', error);
        }
    };



    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="id" placeholder="이메일" value={user.id} onChange={handleChange}/>
                <input type="password" name="pw" placeholder="비밀번호" value={user.pw} onChange={handleChange}/>
                <button type="submit">로그인</button>
            </form>
            <Link to="/register">
                <button>회원가입</button>
            </Link>
        </div>
)

}
export default LoginFormPage;
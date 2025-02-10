import {useState, useRef, useEffect, useContext} from "react";
import axios from "axios";
import {PrimaryStateContext} from "../App.jsx";
import {useNavigate} from "react-router-dom";
const Register = () => {
    const nav = useNavigate()
    // const primaryInfo = useContext(PrimaryStateContext)

    const [user, setUser] = useState({
        id: "",
        pw: "",
    });
    const onChange = (e) => { // e에 입력 받은 두 객체
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        })

    }

    const idRef = useRef();
    const pwRef = useRef();
    const onSubmit = async (e) => {
        e.preventDefault(); // submit 이벤트 발생시 reload 안하기
        if(user.id===""){ // 입력 빈값이면 포커싱 주기
            idRef.current.focus();
            alert('아이디를 입력하세요');
            return
        }else if(user.pw===""){
            alert('비밀번호를 입력하세요');
            pwRef.current.focus();
            return
        }
        console.log(user);

        try {
            await axios.post('http://localhost:8080/signup', {
                email: user.id,
                password: user.pw,
            });
            alert('회원가입 완료');
            // primaryInfo.isLogin = true;
            // console.log(primaryInfo.isLogin);
            nav('/'); // 홈으로
        } catch (error) {
            alert('회원가입 에러');
            console.log('회원가입 에러: ' + error);
        }
    }

    return (
        <div>
            <div>
                <input
                    ref={idRef}
                    name='id'
                    value={user.id}
                    onChange={onChange}
                    placeholder='아이디 입력'
                />
            </div>
            <div>
                <input
                    ref={pwRef}
                    name='pw'
                    value={user.password}
                    onChange={onChange}
                    placeholder='비밀번호 입력'
                />
            </div>
            <button onClick={onSubmit}>회원가입</button>
        </div>
    )
}
export default Register;
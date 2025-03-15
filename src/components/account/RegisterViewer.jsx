import './RegisterViewer.css'
import {useState, useRef, useEffect, useContext} from "react";
import axios from "axios";
import {PrimaryStateContext} from "../../App.jsx";
import {useNavigate} from "react-router-dom";
const RegisterViewer = () => {
    const nav = useNavigate()
    // const primaryInfo = useContext(PrimaryStateContext)

    const [user, setUser] = useState({
        id: "",
        pw: "",
        name:"",
        address:"",
        phone1: "010",
        phone2: "",
        phone3: "",
    });
    const onChange = (e) => { // e에 입력 받은 두 객체
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        })

    }
    // focus 용도
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
        // console.log(user);

        try {
            await axios.post(import.meta.env.VITE_API_URL + '/api/user/signup', {
                email: user.id,
                password: user.pw,
                name: user.name,
                address: user.address,
                phone: user.phone1+user.phone2+user.phone3,
            });
            alert('회원가입 완료');
            nav('/');
        } catch (error) {
            if (error.status === 409) {
                alert('아이디 중복입니다!')
            }else{
                alert('회원가입 에러\n' + error.response.data.message);
            }
        }
    }

    const onConfirmId = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(import.meta.env.VITE_API_URL + `/api/user/check/${user.id}`);
            if(response.data){
                alert("이미 존재하는 아이디입니다. \n다른 아이디를 입력해 주세요.")
            }else{
                alert("사용 가능한 아이디입니다.")
            }
        } catch (error) {
            alert("아이디를 입력해주세요")
        }
    }

    return (
        <div className='contents'>
            {/*{user.phone1}-{user.phone2}-{user.phone3}*/}
            <div style={{height: "70px"}}></div>
            <div className="titleArea">
                <h2>회원가입</h2>
            </div>
            <div className="join">
                <h3 className=" ">기본정보</h3>
                <p className="required ">
                    <img src="http://img.echosting.cafe24.com/skin/base/common/ico_required.gif"
                         alt="필수"/> 필수입력사항
                </p>
                <div className="boardWrite">
                    <table>
                        <tbody>
                        <tr>
                            <th scope="row">아이디
                                <img src="http://img.echosting.cafe24.com/skin/base/common/ico_required.gif" alt="필수"/>
                            </th>
                            <td>
                                <input
                                    ref={idRef}
                                    name='id'
                                    placeholder='아이디 입력'
                                    value={user.id}
                                    onChange={onChange}
                                    type="text"
                                /> <a> </a>
                                <button className="id-confirm" onClick={onConfirmId}>중복 확인</button>
                                <span className="line-through-ment"> (이메일 주소)</span> => 자유
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">비밀번호
                                <img
                                    src="http://img.echosting.cafe24.com/skin/base/common/ico_required.gif" alt="필수"/>
                            </th>
                            <td>
                                <input
                                    ref={pwRef}
                                    name='pw'
                                    value={user.password}
                                    onChange={onChange}
                                    placeholder='비밀번호 입력'
                                    type="password"
                                /> <a> </a>
                                <span className="line-through-ment"> (영문 대소문자/숫자/특수문자 중 3가지 이상 조합, 8자~16자) </span>
                                => 자유
                                <span style={{color: "red"}}> (비번 확인: {user.pw})</span>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row" id="nameTitle">이름</th>
                            <td>
                                <span id="nameContents">
                                    <input
                                        name='name'
                                        value={user.name}
                                        onChange={onChange}
                                        // placeholder='이름 입력'
                                        type="text"
                                    />
                                </span>
                            </td>
                        </tr>

                        <tr className="">
                            <th scope="row">주소</th>
                            <td>
                                <input id="addr1"
                                       className="inputTypeText"
                                       name='address'
                                       value={user.address}
                                       onChange={onChange}
                                    // placeholder='주소 입력'
                                       type="text" size="60"/> <br/>
                            </td>
                        </tr>

                        <tr className="">
                            <th scope="row">휴대전화</th>
                            <td>
                                <select id="mobile1" name="phone1" onChange={onChange}>
                                    <option value="010">010</option>
                                    <option value="011">011</option>
                                    <option value="016">016</option>
                                    <option value="017">017</option>
                                    <option value="018">018</option>
                                    <option value="019">019</option>
                                </select> -
                                <a> </a>
                                <input id="phone2"
                                       name='phone2'
                                       value={user.phone2}
                                       onChange={onChange}
                                       maxLength="4" size="10"
                                       type="text"/> - <a> </a>
                                <input id="phone3"
                                       name='phone3'
                                       value={user.phone3}
                                       onChange={onChange}
                                       maxLength="4"
                                       size="10"
                                       placeholder="" type="text"/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div onClick={onSubmit} className="ec-base-button">
                <img src="http://img.echosting.cafe24.com/skin/base_ko_KR/member/btn_member_join1.gif" alt="회원가입"/>
            </div>
        </div>
    )
}
export default RegisterViewer;
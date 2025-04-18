import './MyPageViewer.css'
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {PrimaryStateContext} from "../../App.jsx";

const MyPageViewer = () => {
    const nav = useNavigate()
    const [cookies, setCookie, removeCookie] = useCookies(['refreshToken']); //쿠키이름
    const primaryInfo = useContext(PrimaryStateContext)

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const onChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        })
    }

    const updateMemberInfo = async () => {
        try{
            await axios({
                url: import.meta.env.VITE_API_URL + `/api/member/update`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    'Content-Type': 'application/json'
                },
                data: {
                    name: user.name,
                    address: user.address,
                    phone: user.phone,
                },
                method: 'PUT',
                withCredentials: true,
            });
            alert('회원정보가 수정되었습니다.')
            location.reload()
        } catch (error){
            console.log(error);
        }
    }

    const signOut = async () => {
        const confirmResult = window.confirm("정말 탈퇴하시겠습니까? \n(모든 위시리스트, 장바구니, 주문 기록들이 삭제됩니다.)")
        if (!confirmResult) {
            return;
        }

        try{
            const response = await axios({
                url: import.meta.env.VITE_API_URL + `/api/member/signout/${user.memberId}`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    'Content-Type': 'application/json'
                },
                method: 'DELETE',
                withCredentials: true,
            });
            if (response.data === "complete") {
                alert("회원탈퇴가 완료되었습니다.")
                localStorage.removeItem("access_token");
                removeCookie('refresh_token');
                primaryInfo.isLogin = false;
                nav("/");
            }else if(response.data === "mismatch"){
                alert("회원정보 불일치")
            }
        } catch (error){
            console.log(error);
            alert("회원탈퇴 에러")
            nav("/");
        }
    }

    // 조회
    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                setLoading(true);
                setError(null);
                const response = await axios.get(
                    import.meta.env.VITE_API_URL + '/api/member',
                    {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                        }
                    },
                );
                setUser(response.data);

                // console.log(response.data);
            } catch (e) {
                setError(e);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!user) return null;

    return (
        <div className="MyPageViewer contents">
            <div style={{height: "70px"}}></div>
            {/*{user.phone1}-{user.phone2}-{user.phone3}*/}
            <div className="titleArea">
                <h2>마이페이지</h2>
            </div>
            <div className="join">
                <h3 className="basic_info">기본정보</h3>
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
                                    name='id'
                                    value={user.email}
                                    type="text" size="40"
                                /> <a> </a>
                            </td>
                        </tr>

                        {/*<tr>*/}
                        {/*    <th scope="row">비밀번호*/}
                        {/*        <img*/}
                        {/*            src="http://img.echosting.cafe24.com/skin/base/common/ico_required.gif" alt="필수"/>*/}
                        {/*    </th>*/}
                        {/*    <td>*/}
                        {/*        <input*/}
                        {/*            name='pw'*/}
                        {/*            value={user.password}*/}
                        {/*            placeholder='비밀번호 입력'*/}
                        {/*            type="password"*/}
                        {/*        /> <a> </a>*/}
                        {/*        <button className='change-pw' onClick={NotProvided}>변경하기</button>*/}
                        {/*        <span style={{color: "red"}}> (비번 확인: {user.pw})</span>*/}
                        {/*    </td>*/}
                        {/*</tr>*/}

                        <tr>
                            <th scope="row" id="nameTitle">이름</th>
                            <td>
                                <span id="nameContents">
                                    <input
                                        name='name'
                                        value={user.name}
                                        type="text"
                                        onChange={onChange}
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
                                       type="text" size="60"/> <br/>
                            </td>
                        </tr>

                        <tr className="">
                            <th scope="row">휴대전화</th>
                            <td>
                                <input id="phone"
                                       name='phone'
                                       value={user.phone}
                                    // value={user.phone1}
                                       maxLength="13" size="13"
                                       onChange={onChange}
                                       type="text"/>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row" id="nameTitle">적립금</th>
                            <td>
                                <span id="nameContents" style={{color: 'black'}}>
                                    {user.savings}원
                                </span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/*<div  className="ec-base-button">*/}
            {/*    <img src="http://img.echosting.cafe24.com/skin/base_ko_KR/member/btn_member_join1.gif" alt="회원가입"/>*/}
            {/*</div>*/}
            {/*<button className='info-modify' onClick={updateMemberInfo}>회원정보 수정하기</button>*/}
            <div style={{position: 'relative', textAlign: 'center', padding: "10px 0"}}>
                <a onClick={updateMemberInfo} style={{textAlign: "center"}}>
                    <img
                        style={{verticalAlign: "top"}}
                        src="http://img.echosting.cafe24.com/skin/base_ko_KR/member/btn_modify_member.gif"
                        alt="회원정보수정"/>
                </a>
                <span className="gRight">
                    <a onClick={signOut}>
                        <img
                        src="http://img.echosting.cafe24.com/skin/base_ko_KR/member/btn_modify_out.gif" alt="회원탈퇴"/>
                    </a>
                </span>
            </div>

        </div>)
}

export default MyPageViewer
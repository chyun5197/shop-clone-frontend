import './MyPageViewer.css'
import {useEffect, useState} from "react";
import axios from "axios";

const MyPageViewer = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const NotProvided = () => {
        alert('준비중입니다')
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
                                    placeholder='아이디 입력'
                                    value={user.email}
                                    type="text"
                                /> <a> </a>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">비밀번호
                                <img
                                    src="http://img.echosting.cafe24.com/skin/base/common/ico_required.gif" alt="필수"/>
                            </th>
                            <td>
                                <input
                                    name='pw'
                                    value={user.password}
                                    placeholder='비밀번호 입력'
                                    type="password"
                                /> <a> </a>
                                <button className='change-pw' onClick={NotProvided}>변경하기</button>
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
                                    // placeholder='주소 입력'
                                       type="text" size="60"/> <br/>
                            </td>
                        </tr>

                        <tr className="">
                            <th scope="row">휴대전화</th>
                            <td>
                                <input id="phone1"
                                       name='phone1'
                                       value={user.phone.slice(0, 3)}
                                       maxLength="4" size="10"
                                       type="text"/> - <a> </a>
                                <a> </a>
                                <input id="phone2"
                                       name='phone2'
                                       value={user.phone.slice(3, 7)}
                                       maxLength="4" size="10"
                                       type="text"/> - <a> </a>
                                <input id="phone3"
                                       name='phone3'
                                       value={user.phone.slice(7)}
                                       maxLength="4"
                                       size="10"
                                       placeholder="" type="text"/>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row" id="nameTitle">위시리스트</th>
                            <td>
                                <span id="nameContents" style={{color: 'black'}}>
                                    {user.wishCount}개
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" id="nameTitle">장바구니</th>
                            <td>
                                <span id="nameContents" style={{color: 'black'}}>
                                    {user.cartCount}개
                                </span>
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
            <br></br>
            <button className='info-modify' onClick={NotProvided}>회원정보 수정하기</button>
        </div>)
}

export default MyPageViewer
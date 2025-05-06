import './Header.css'
import {categroy} from "../global/Category.js"
import CategoryMenu from "./menubar/CategoryMenu.jsx";
import {useNavigate} from "react-router-dom";
import React, {useContext, useEffect, useState, useRef} from "react";
import {PrimaryStateContext} from "../App.jsx";
import axios from "axios";
import {useCookies} from "react-cookie";
import { PiUserCircleFill } from "react-icons/pi";
import { FaSearch, FaHeart, FaShoppingCart } from "react-icons/fa";
import Chat from "./Chat.jsx";
import ReactDOM from "react-dom/client";

const Header = () => {
    const cateKeys = Object.keys(categroy);
    const nav = useNavigate()

    const primaryInfo = useContext(PrimaryStateContext)

    const [middleMenu1, setMiddleMenu1] = useState('로그인');
    const [middleMenu2, setMiddleMenu2] = useState('회원가입');

    const onClickHome = () => {
        window.scrollTo(0, 0);
        nav(`/`)
        // location.reload();
    }

    // 로그인 여부에 따른 상태화면 처리
    useEffect(() => {
        const fetchData =  () =>{
            if (primaryInfo.isLogin) {
                setMiddleMenu1('회원정보수정');
                setMiddleMenu2('로그아웃');

            }else{
                setMiddleMenu1('로그인');
                setMiddleMenu2('회원가입');
            }
        }
        fetchData();
    }, [primaryInfo.isLogin]);

    // 로그인 or 회원정보수정
    const onLoginClick = () => {
        if (!primaryInfo.isLogin) { // 미로그인 상태일때
            window.scrollTo(0, 0);
            nav('/login-form') // 로그인페이지로 이동
        }else{ // 로그인 상태일때
            // nav('/myinfo-form')
        }
    }

    // 회원가입 or 로그아웃
    const [cookies, setCookie, removeCookie] = useCookies(['refreshToken']); //쿠키이름
    const onJoinClick = () => {
        if (!primaryInfo.isLogin) { // 미로그인 상태일때
            nav('/register') // 회원가입으로 이동
        }else{ // 로그인 상태일때
            primaryInfo.isLogin = false; // 로그아웃하기
            handleLogout();
            alert('로그아웃 완료');

            // 토큰 모두 삭제
            localStorage.removeItem("access_token");
            removeCookie('refresh_token');
            // localStorage.removeItem("refresh_token");

            nav("/")
            location.reload();
        }
    }

    // 로그아웃 핸들러
    const handleLogout = async () => {
        try {
            await axios.get(import.meta.env.VITE_API_URL + '/api/user/logout')
                // {headers: {Authorization: 'Bearer ' + localStorage.getItem("refresh_token")}})
        } catch (error) {
            console.error('로그아웃 에러:', error);
        }
    };

    // 장바구니 이동
    const onCartClick = () =>{
        if (!primaryInfo.isLogin) {
            alert('로그인을 해주세요')
            return
        }

        window.scrollTo(0, 0);
        nav('/myshop/cart');
    }

    // 주문조회 이동
    const onOrderClick = () =>{
        if (!primaryInfo.isLogin) {
            alert('로그인을 해주세요')
            return
        }

        window.scrollTo(0, 0);
        nav("/myshop/order/list")
    }

    // 위시리스트 이동
    const onWishClick = () => {
        if (!primaryInfo.isLogin) {
            alert('로그인을 해주세요')
            return
        }

        window.scrollTo(0, 0);
        nav('/myshop/wishlist');
    }

    const onMyShopClick = () => {
        if (!primaryInfo.isLogin) {
            alert('로그인을 해주세요')
            return
        }

        window.scrollTo(0, 0);
        nav('/myshop');
    }

    const [complete, setComplete] = useState(false);
    const handleOpenNewTab = (url) => {
        window.open(url, "_blank", "noopener, noreferrer");
    };

    const newWindowRef = useRef(null);
    const openChatWindow = async () => {
        // 로그인해야 접근 가능
        if (!primaryInfo.isLogin) {
            alert('로그인을 해주세요')
            return
        }

        let memberId, chatRoomId, role;
        try {
            const response = await axios.get(
                import.meta.env.VITE_API_URL + '/api/chat',
                {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }
                },
            );
            memberId = response.data.memberId;
            chatRoomId = response.data.chatRoomId;
            role = response.data.role;
        } catch (error) {
            alert(error.message);
            return;
        }

        // 상담사이면 채팅방 리스트로 이동
        if (role === 'COUNSELOR'){
            nav(`/chat/list/${memberId}`);
            return
        }
        // 고객이면 채팅창 생성 유무 확인 후 채팅방 실행
        if(chatRoomId === -1){ // 채팅방 없으면 새로 생성
            try {
                const response = await axios.post(
                    import.meta.env.VITE_API_URL + '/api/chat',
                    {},
                    {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                        }
                    },
                );
                chatRoomId = response.data.chatRoomId;
            } catch (error) {
                alert(error.message);
                return;
            }
        }
        // 새 창에서 채팅창 실행
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.innerWidth - width) / 2;
        const top = window.screenY + (window.innerHeight - height) / 2;
        const newWindow = window.open(
            "",
            "_blank",
            `width=${width},height=${height},left=${left},top=${top}`
        );
        // const newWindow = window.open("", "_blank", "noopene");
        if (!newWindow) return;

        newWindow.document.title = "새 창";
        // 새 창의 HTML 구조 초기화
        newWindow.document.body.innerHTML = '<div id="chat-root"></div>';

        // React 컴포넌트 렌더링
        const root = ReactDOM.createRoot(newWindow.document.getElementById("chat-root"));
        root.render(<Chat memberId={memberId} chatRoomId={chatRoomId} role={role} />);

        // 창 닫힐 때 언마운트 처리
        newWindow.onunload = () => {
            root.unmount();
        };
        // 새 창 참조 저장
        newWindowRef.current = newWindow;
    }
    useEffect(() => {
        // 컴포넌트 언마운트 시 창 닫기
        return () => {
            if (newWindowRef.current) {
                newWindowRef.current.close();
                newWindowRef.current = null;
            }
        };
    }, []);

    return (
        <header className="Header">
            <div className="header_line1">
                <div className="line1_left">
                    {/*<button className="btn_grey">A</button>*/}
                    <button
                        id = "page_check"
                        className={"btn_check"+(complete ? " active" : "")}
                        onClick={()=>{complete?setComplete(false):setComplete(true)}}>구현된 페이지 보기
                    </button>
                    {/*<button className={"btn_grey"+(complete ? " active" : "")}*/}
                    {/*        onClick={()=>nav("/products/search")}>*/}
                    {/*    <FaSearch style={{verticalAlign:'sub'}} size='14' />*/}
                    {/*</button>*/}
                    <button
                        className={"btn_grey"+(complete ? " active" : "")}
                        onClick={onMyShopClick}>
                        <PiUserCircleFill style={{verticalAlign:'sub'}} size='18'/> 마이페이지
                    </button>
                </div>
                <div className="line1_middle">
                    <a className={"isCompleted"+(complete ? " active" : "")} onClick={onLoginClick}>{middleMenu1}</a>
                    <span className="logline"></span>
                    <a className={"isCompleted"+(complete ? " active" : "")} onClick={onJoinClick}>{middleMenu2}</a>
                    <span className="logline"></span>
                    <a className={"isCompleted"+(complete ? " active" : "")} onClick={onCartClick}>장바구니</a>
                    <span className="logline"></span>
                    <a className={"isCompleted"+(complete ? " active" : "")} onClick={onOrderClick}>주문조회</a>
                </div>
                <div className="line1_right">
                    {/*위시리스트*/}
                    <button className={"btn_grey" + (complete ? " active" : "")}
                            style={{width:"30px"}}
                            onClick={onWishClick}>
                        <FaHeart style={{verticalAlign: 'sub'}} size='15'/>
                    </button>
                    {/*장바구니*/}
                    <button className={"btn_grey" + (complete ? " active" : "")}
                            style={{width:"30px"}}
                            onClick={onCartClick}>
                        <FaShoppingCart style={{verticalAlign: 'sub'}} size='15'/>
                    </button>
                    {/*검색*/}
                    <button className={"btn_grey" + (complete ? " active" : "")}
                            style={{width:"30px"}}
                            onClick={() => nav("/products/search")}>
                        <FaSearch style={{verticalAlign: 'sub'}} size='15'/>
                    </button>
                </div>
            </div>
            <div className="header_line2">
                <img src="https://cdn.hyun-clone.shop/logo.jpg" onClick={onClickHome} alt=''></img>

                {/*카테고리별 조회*/}
                {cateKeys.map((key, index) => (
                    <CategoryMenu cateKey={key} complete={complete} index={index} key={key}/>))}

                <li className="board">
                    <button className={'btn_blue'+(complete ? " active" : "")}
                        onClick={()=>nav("/products/best")}>
                    베스트</button>
                </li>
                <li className="board">
                    <button className='btn_blue'
                            onClick={openChatWindow}
                    >채팅상담</button>
                </li>
                <li className="board">
                    <button className='btn_blue'>게시판2</button>
                </li>
                <button className='btn_close'
                        onClick={() => handleOpenNewTab('https://musicforce.co.kr/')}>
                    <PiUserCircleFill size='45' style={{verticalAlign: 'top'}}/><br/>
                    <a style={{fontFamily: "Nanum Gothic Bold"}}>origin</a>
                </button>
            </div>

        </header>
    )
};


export default Header;
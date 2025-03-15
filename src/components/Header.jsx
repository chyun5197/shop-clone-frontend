import logo from '../assets/logo.jpg';
import './Header.css'
import {categroy} from "../global/Category.js"
import CategoryMenu from "./menubar/CategoryMenu.jsx";
import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {PrimaryDispatchContext, PrimaryStateContext} from "../App.jsx";
import axios from "axios";
import {useCookies} from "react-cookie";
import { PiUserCircleFill } from "react-icons/pi";
import { FaSearch } from "react-icons/fa";

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
        }else{
            window.scrollTo(0, 0);
            nav('/myshop/cart');
        }
    }

    // 관심상품 이동
    const onWishClick = () => {
        if (!primaryInfo.isLogin) {
            alert('로그인을 해주세요')
        }else{
            window.scrollTo(0, 0);
            nav('/myshop/wishlist');
        }
    }

    const onMyShopClick = () => {
        if (!primaryInfo.isLogin) {
            alert('로그인을 해주세요')
        }else{
            window.scrollTo(0, 0);
            nav('/myshop');
        }
    }

    const [complete, setComplete] = useState(false);
    const handleOpenNewTab = (url) => {
        window.open(url, "_blank", "noopener, noreferrer");
    };

    return (
        <header className="Header">
            <div className="header_line1">
                <div className="line1_left">
                    {/*<button className="btn_grey">A</button>*/}
                    <button
                        id = "page_check"
                        className={"btn_check"+(complete ? " active" : "")}
                        onClick={()=>{complete?setComplete(false):setComplete(true)}}>구현된 페이지 확인
                    </button>
                    <button className={"btn_grey"+(complete ? " active" : "")}
                            onClick={()=>nav("/products/search")}>
                        <FaSearch style={{verticalAlign:'sub'}} size='14' />
                    </button>
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
                    <a>주문조회</a>
                    <span className="logline"></span>
                    <a>International Shipping Available</a>
                    <span className="logline"></span>
                    <a>Global Tax Free</a>
                </div>
                <div className="line1_right">
                    <button className={"btn_grey"+(complete ? " active" : "")} onClick={onWishClick}>wish</button>
                    <button className={"btn_grey"+(complete ? " active" : "")} onClick={onCartClick}>cart</button>
                    <button className={"btn_grey"+(complete ? " active" : "")} onClick={()=>nav("/products/search")}>search</button>
                </div>
            </div>
            <div className="header_line2">
                <img src="https://cdn.hyun-clone.shop/logo.jpg" onClick={onClickHome} alt=''></img>

                {/*<li>Best</li>*/}
                {cateKeys.map((key, index) => (
                    <CategoryMenu cateKey={key} complete={complete} index={index} key={key}/>))}

                <li className="board">
                    <button className={'btn_blue'+(complete ? " active" : "")}
                        onClick={()=>nav("/products/best")}>
                    베스트</button>
                </li>
                <li className="board">
                    <button className='btn_blue'>게시판1</button>
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
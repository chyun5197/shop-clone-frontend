import logo from '../assets/logo.jpg';
import './Header.css'
import {categroy} from "../global/Category.js"
import CategoryMenu from "./menubar/CategoryMenu.jsx";
import {Link, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {PrimaryDispatchContext, PrimaryStateContext} from "../App.jsx";
import axios from "axios";

const Header = () => {
    const cateKeys = Object.keys(categroy);
    const nav = useNavigate()

    const {onBranding} = useContext(PrimaryDispatchContext)
    const primaryInfo = useContext(PrimaryStateContext)

    const [middleMenu1, setMiddleMenu1] = useState('로그인');
    const [middleMenu2, setMiddleMenu2] = useState('회원가입');

    const onClickHome = () => {

        onBranding('없음')

        // console.log(primaryInfo.isLogin);
        nav(`/`)
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
            nav('/login-form') // 로그인페이지로 이동
        }else{ // 로그인 상태일때
            // nav('/myinfo-form')
        }
    }

    // 회원가입 or 로그아웃
    const onJoinClick = () => {
        if (!primaryInfo.isLogin) { // 미로그인 상태일때
            nav('/register') // 회원가입으로 이동
        }else{ // 로그인 상태일때
            primaryInfo.isLogin = false; // 로그아웃하기
            handleLogout();
            location.reload();
        }
    }

    // 로그아웃 핸들러
    const handleLogout = async () => {
        try {
            await axios.get('/api/user/logout');
            alert('로그아웃 완료');
        } catch (error) {
            console.error('로그아웃 에러:', error);
        }
    };

    const onCartClick = () =>{
        if (!primaryInfo.isLogin) {
            alert('로그인을 해주세요')
        }else{
            nav('/order/cart');
        }
    }

    return (
        <header className="Header">
            <div className="header_line1">
                <div className="line1_left">
                    <button className="btn_grey">별</button>
                    <button className="btn_grey">+</button>
                    <button className="btn_grey">마이페이지</button>
                </div>
                <div className="line1_middle">
                    <a onClick={onLoginClick}>{middleMenu1}</a>
                    <span className="logline"></span>
                    <a onClick={onJoinClick}>{middleMenu2}</a>
                    <span className="logline"></span>
                    <a onClick={onCartClick}>장바구니</a>
                    <span className="logline"></span>
                    <a>주문조회</a>
                    <span className="logline"></span>

                    <a>International Shipping Available</a>
                    <span className="logline"></span>
                    <a>Global Tax Free</a>
                </div>
                <div className="line1_right">
                    <button className="btn_grey">wish</button>
                    <button className="btn_grey" onClick={onCartClick}>cart</button>
                    <button className="btn_grey">search</button>
                </div>
            </div>
            <div className="header_line2">
                <img src={logo} onClick={onClickHome} alt=''></img>

                {cateKeys.map(key => (<CategoryMenu cateKey={key} key={key}/>))}

                <li className="viewgallery">
                    <button className='btn_blue'>베이스컬렉션</button>
                </li>
                <li className="viewgallery">
                    <button className='btn_blue'>어쿠스틱라인</button>
                </li>
                <li className="board">
                    <button className='btn_blue'>게시판</button>
                </li>
                <button className='btn_close'>닫기</button>
            </div>
            {/*<img className='bannerImg' src={primaryInfo['banner']} alt=''/>*/}

        </header>

    )
};


export default Header;
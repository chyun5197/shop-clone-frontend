import logo from '../assets/logo.jpg';
import './Header.css'
import {categroy} from "../util/Category.js"
import CategoryMenu from "./menubars/CategoryMenu.jsx";
import {useNavigate} from "react-router-dom";

const Header = () => {
    const cateKeys = Object.keys(categroy);
    const nav = useNavigate()

    return (
        <header className="Header">
            <div className="header_line1">
                <div className="line1_left">
                    <button className="btn_grey">별</button>
                    <button className="btn_grey">+</button>
                    <button className="btn_grey">마이페이지</button>
                </div>
                <div className="line1_middle">
                    <a>로그인</a>
                    <span className="logline"></span>
                    <a>회원가입</a>
                    <span className="logline"></span>
                    <a>장바구니</a>
                    <span className="logline"></span>
                    <a>주문조회</a>
                    <span className="logline"></span>

                    <a>International Shipping Available</a>
                    <span className="logline"></span>
                    <a>Global Tax Free</a>
                </div>
                <div className="line1_right">
                    <button className="btn_grey">wish</button>
                    <button className="btn_grey">cart</button>
                    <button className="btn_grey">search</button>
                </div>
            </div>
            <div className="header_line2">
                <img src={logo} onClick={()=>nav(`/`)}></img>

                {cateKeys.map(key => (<CategoryMenu cateKey={key} key={key} /> ))}

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
        </header>

    )
};



export default Header;
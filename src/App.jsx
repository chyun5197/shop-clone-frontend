import './App.css'
import {Route, Routes} from "react-router-dom";
import {CookiesProvider, useCookies} from 'react-cookie';
import Header from './components/Header.jsx'
import Home from './pages/Home'
import Wishlist from "./pages/myInfo/Wishlist.jsx";
import Cart from "./pages/myInfo/Cart.jsx";
import Notfound from "./pages/Notfound.jsx";
import MyPage from "./pages/myInfo/MyPage.jsx";
import {createContext, useCallback, useEffect, useReducer} from "react";
import ProductSearch from "./pages/product/ProductSearch.jsx";
import ProductDetail from "./components/product/ProductDetail.jsx";
import ProductList from "./pages/product/ProductList.jsx";
import LoginForm from "./pages/account/LoginForm.jsx";
import ProductBest from "./pages/product/ProductBest.jsx";
import Register from "./pages/account/Register.jsx";
import OauthHandler from "./pages/OauthHandler.jsx";
import OrderSheet from "./pages/myInfo/OrderSheet.jsx";
import OrderList from "./pages/myInfo/OrderList.jsx";

export const PrimaryStateContext = createContext();
export const PrimaryDispatchContext = createContext();


const primaryInitialInfo = {
    isLogin: localStorage.getItem("access_token") !== null, // 로그인 여부
    date: new Date().getTime(), // 현재 시각
}
// console.log(primaryInitialInfo);

function reducer(state, action) {
    switch (action.type) {
        case "BRANDING": state.banner = action.imageUrl // 브랜드 배너 이미지 변경
            return state;
        case "LOCATE": state.location = action.location // 미사용
            return state;
        default: state;
    }
}
function App() {
    const [cookies, setCookie, removeCookie] = useCookies(['refresh_token']); //쿠키이름

    // 토큰 만료기간 지나면 삭제해서 자동 로그아웃
    // 원래는 리프레시토큰이 기준이어야하지만, 리액트에 토큰 재발급 코드를 안만들었으니 일단 액세스 토큰를 기준
    // 현재 스프링 액세스 토큰도 4시간으로 길게 설정
    useEffect(()=>{
        if (localStorage.getItem("access_token") === null) {
            return;
        }
        if (new Date().getTime() > localStorage.getItem("expiration")) {
            localStorage.removeItem("expiration");
            localStorage.removeItem("access_token");
            removeCookie('refresh_token');
            primaryInitialInfo.isLogin = false
            // alert('로그인이 만료되어 로그아웃합니다')
        }
    }, []) // 현재는 새로고침/새로접속의 렌더링시에만 자동 로그아웃
    // 라우팅할때마다 렌더링되도록 하는 방법이 있을텐데..


    const [data, dispatch] = useReducer(reducer, primaryInitialInfo);

    const onBranding = useCallback((imageUrl)=>{
        dispatch({
            type: "BRANDING",
            imageUrl: imageUrl
        })
    }, [])

    const onLocate = useCallback((location)=>{
        dispatch({
            type: "LOCATE",
            location: location,
        })
    }, [])

    // return <div><h1>점검중</h1></div>

    return (
        <>
            <div className="all_wrap">
                <CookiesProvider>
                    <PrimaryStateContext.Provider value={data}>
                        <PrimaryDispatchContext.Provider value={{onBranding, onLocate}}>
                            <Header/>
                            <div id="content_wrap">
                                <div id="container">
                                    <Routes>
                                        <Route path="/" element={<Home/>}/>
                                        <Route path="/myshop/wishlist" element={<Wishlist/>}/>
                                        <Route path="/myshop" element={<MyPage/>}/>
                                        <Route path="/myshop/cart" element={<Cart/>}/>
                                        <Route path="/myshop/order/sheet" element={<OrderSheet/>}/>
                                        <Route path="/myshop/order/list" element={<OrderList/>}/>
                                        <Route path="/products/list" element={<ProductList/>}/>
                                        <Route path="/products/detail" element={<ProductDetail/>}/>
                                        <Route path="/products/search" element={<ProductSearch/>}/>
                                        <Route path="/products/best" element={<ProductBest/>}/>
                                        <Route path="/login-form" element={<LoginForm/>}/>
                                        <Route path="/register" element={<Register/>}/>
                                        <Route path="/oauth/success" element={<OauthHandler/>}/>
                                        <Route path="*" element={<Notfound/>}/>
                                    </Routes>
                                </div>
                            </div>
                        </PrimaryDispatchContext.Provider>
                    </PrimaryStateContext.Provider>
                </CookiesProvider>
            </div>
        </>
    )
}

export default App

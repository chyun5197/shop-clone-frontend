import './App.css'
import {Route, Routes} from "react-router-dom";
import {CookiesProvider, useCookies} from 'react-cookie';
import Header from './components/Header.jsx'
import Home from './pages/Home'
import Wishlist from "./pages/myInfo/Wishlist.jsx";
import Cart from "./pages/myInfo/Cart.jsx";
import Notfound from "./pages/Notfound.jsx";
import MyPage from "./pages/myInfo/MyPage.jsx";
import {createContext, useCallback, useContext, useMemo, useReducer, useState} from "react";
import ProductList from "./pages/product/ProductList.jsx";
import ProductSearch from "./pages/product/ProductSearch.jsx";
import ProductDetail from "./pages/product/ProductDetail.jsx";
import LoginFormViewer from "./components/account/LoginFormViewer.jsx";
import home1 from "./assets/home-1-2.jpg";
import RegisterViewer from "./components/account/RegisterViewer.jsx";
import Banner from "./components/Banner.jsx";

export const PrimaryStateContext = createContext();
export const PrimaryDispatchContext = createContext();

// const [cookies, setCookie, removeCookie] = useCookies(['refresh_token']); //쿠키이름

const primaryInitialInfo = {
    isLogin: localStorage.getItem("access_token") !== null, // 로그인 여부
    // isLogin: cookies.refresh_token !== null, // 로그인 여부
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

    const memoizedDispatch = useMemo(()=>{
        return {onBranding, onLocate};
    }, [])

    // console.log(import.meta.env.VITE_API_URL)


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
                                        <Route path="/product/list" element={<ProductList/>}/>
                                        <Route path="/product/detail" element={<ProductDetail/>}/>
                                        <Route path="/product/serach" element={<ProductSearch/>}/>
                                        <Route path="/login-form" element={<LoginFormViewer/>}/>
                                        <Route path="/register" element={<RegisterViewer/>}/>
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

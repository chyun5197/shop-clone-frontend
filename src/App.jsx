import './App.css'
import {Route, Routes} from "react-router-dom";
import Header from './components/Header.jsx'
import Home from './pages/Home'
import Wishlist from "./pages/myInfo/Wishlist.jsx";
import Product from "./pages/product/Product.jsx";
import Cart from "./pages/myInfo/Cart.jsx";
import Notfound from "./pages/Notfound.jsx";
import Mypage from "./pages/myInfo/Mypage.jsx";
import {createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState} from "react";
import ProductList from "./pages/product/PrdocutList.jsx";
import ProductSearch from "./pages/product/ProductSearch.jsx";
import ProductDetail from "./pages/product/ProductDetail.jsx";
import LoginFormPage from "./pages/LoginFormPage.jsx";
import Banner from "./components/Banner.jsx";
import home1 from "./assets/home-1-2.jpg";
import Register from "./components/Register.jsx";

export const PrimaryStateContext = createContext();
export const PrimaryDispatchContext = createContext();

const primaryInitialInfo = {
    id: 0,
    banner: home1,
    isLogin: false,
    date: new Date().getTime(),
}

function reducer(state, action) {
    switch (action.type) {
        case "BRANDING": state.banner = action.imageUrl
            return state;
        case "LOCATE": state.location = action.location
            return state;
        default: state;
    }
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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

    const primaryInfo = useContext(PrimaryStateContext)

    return (
        <>
            
            <div className="all_wrap">
                <PrimaryStateContext.Provider value={data}>
                    <PrimaryDispatchContext.Provider value={{onBranding, onLocate}}>
                        <Header/>
                            <div id="content_wrap">
                                <div id="container">
                                    <div className='protitle'>
                                        {/*<Banner />*/}
                                    </div>
                                    <div id='contents'>
                                    <Routes>
                                        <Route path="/" element={<Home/>}/>
                                        <Route path="/myshop/wishlist" element={<Wishlist/>}/>
                                        <Route path="/myshop" element={<Mypage/>}/>
                                        <Route path="/order/cart" element={<Cart/>}/>
                                        <Route path="/product/list" element={<ProductList/>}/>
                                        <Route path="/product/detail" element={<ProductDetail/>}/>
                                        <Route path="/product/serach" element={<ProductSearch/>}/>
                                        <Route path="/login-form" element={<LoginFormPage/>}/>
                                        <Route path="/register" element={<Register/>}/>
                                        <Route path="*" element={<Notfound/>}/>
                                    </Routes>
                                    </div>
                                </div>
                            </div>

                    </PrimaryDispatchContext.Provider>
                </PrimaryStateContext.Provider>
            </div>
        </>
    )
}

export default App

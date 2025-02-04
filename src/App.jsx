import './App.css'
import {Route, Routes} from "react-router-dom";
import Header from './components/Header.jsx'
import Home from './pages/Home'
import Wishlist from "./pages/myInfo/Wishlist.jsx";
import Product from "./pages/product/Product.jsx";
import Cart from "./pages/myInfo/Cart.jsx";
import Notfound from "./pages/Notfound.jsx";
import Mypage from "./pages/myInfo/Mypage.jsx";
import {createContext, useReducer, useState} from "react";
import ProductList from "./pages/product/PrdocutList.jsx";
import ProductSearch from "./pages/product/ProductSearch.jsx";
import ProductDetail from "./pages/product/ProductDetail.jsx";

export const ProductStateContext = createContext();
export const ProductDispatchContext = createContext();

// export const ProductPageStateContext = createContext();
// export const ProductPageDispatchContext = createContext();

function reducer() {
    
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [data, dispatch] = useReducer(reducer, []);


    return (
        <>
            <div className="all_wrap">
                <Header/>
                <div id="content_wrap">
                    <div id="container">
                        <div id='contents'>
                            <ProductStateContext.Provider value={data}>
                                <Routes>
                                    <Route path="/" element={<Home/>}/>
                                    <Route path="/myshop/wishlist" element={<Wishlist/>}/>
                                    <Route path="/myshop" element={<Mypage/>}/>
                                    <Route path="/order/cart" element={<Cart/>}/>
                                    <Route path="/product/list" element={<ProductList/>}/>
                                    <Route path="/product/detail" element={<ProductDetail/>}/>
                                    <Route path="/product/serach" element={<ProductSearch/>}/>
                                    <Route path="*" element={<Notfound/>}/>
                                </Routes>
                            </ProductStateContext.Provider>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default App

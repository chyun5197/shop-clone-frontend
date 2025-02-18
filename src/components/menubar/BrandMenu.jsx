import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {PrimaryDispatchContext, PrimaryStateContext} from "../../App.jsx";
import axios from "axios";
import {categroy} from "../../global/Category.js";
import home1 from "../../assets/home-1-2.jpg";

//brandName: "Fender" | cateKey: "Guitars 1"
const BrandMenu = ({brandName, cateKey}) => {
    const nav = useNavigate()

    // const [cate, setCate] = useState(null);
    const primaryInfo = useContext(PrimaryStateContext);
    const {onBranding} = useContext(PrimaryDispatchContext)

    const onClickBrand = async () => {
        const cate = categroy[cateKey].find((item) => item.name === brandName).cate;
        console.log(brandName);

        // onBranding(response.data.image);
        // console.log(response.data.image);

        // 브랜드 페이지 이동할때 초기화할 값들
        const response = await axios.get(
            import.meta.env.VITE_API_URL + `/api/products/brand/${cate}`
        );
        localStorage.setItem("banner", response.data.image);
        localStorage.setItem("page", 1);
        localStorage.setItem("sorting", "new")
        localStorage.setItem("brand", brandName);
        localStorage.setItem("category", cateKey);

        nav(`/product/list?brand=${brandName}&cate=${cate}&page=1&category=${cateKey}`) // category: "Guitars 1"
        window.scrollTo(0, 0);
    }

    // console.log(name);
    return <li onClick={onClickBrand}>{brandName}</li>
};
export default BrandMenu;
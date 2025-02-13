import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {PrimaryDispatchContext, PrimaryStateContext} from "../../App.jsx";
import axios from "axios";
import {categroy} from "../../global/Category.js";

//brandName: "Fender" | cateKey: "Guitars 1"
const BrandMenu = ({brandName, cateKey}) => {
    const nav = useNavigate()

    // const [cate, setCate] = useState(null);
    const primaryInfo = useContext(PrimaryStateContext);
    const {onBranding} = useContext(PrimaryDispatchContext)

    const onClickBrand = async () => {
        const cate = categroy[cateKey].find((item) => item.name === brandName).cate;
        const response = await axios.get(
            import.meta.env.VITE_API_URL + `/api/products/brand/${cate}`
        );
        onBranding(response.data.image);
        // console.log(response.data.image);
        window.scrollTo(0, 0);
        nav(`/product/list?brand=${brandName.toLowerCase()}&cate=${cate}&page=1&category=${cateKey}`) // category: "Guitars 1"
    }

    // console.log(name);
    return <li onClick={onClickBrand}>{brandName}</li>
};
export default BrandMenu;
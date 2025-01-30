import './ProductList.css'
import {useNavigate, useSearchParams} from "react-router-dom";
const ProductList = () => {
    const [params, setParams] = useSearchParams();
    const nav = useNavigate();
    return (
        <div>
            <h2>
                {params.get("brand")} 상품 목록
            </h2>
        </div>
    )
};
export default ProductList;
import ProductList from "./PrdocutList.jsx";
import {useNavigation, useParams} from "react-router-dom";

const Product = () => {
    const params = useParams();
    const nav = useNavigation();

    // 헤더 이미지 바뀌어야 useBrandImg
    // 소분류 목록 바뀌어야 useModelList
    const curBrand = useBrand(params.name);

    return (
        <div>
            <div>
                <h2>
                    상품 상세 페이지
                </h2>
            </div>
        </div>
    )
};
export default Product;
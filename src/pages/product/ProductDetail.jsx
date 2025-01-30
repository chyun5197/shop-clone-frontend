import './ProductDetail.css'
import {useNavigate, useSearchParams, Link} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import {categroy} from "../../util/Category.js";

const ProductDetail = () => {
    const [params, setParams] = useSearchParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [productKeys, setProductKeys] = useState(null);

    const nav = useNavigate()

    // => hook 따로 빼야?
    useEffect(() => {
        const fetchData = async () => {
            try{
                setError(null);
                setProduct(null);
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:8080/api/products/detail/${params.get("id")}`
                );
                setProduct(response.data);
                setProductKeys(Object.keys(response.data));
            }catch(e){
                setError(e);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <div>로딩중..</div>;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!product) return null;

    return (
        <div>
            <h2>
                {params.get("id")}번 상품 상세 페이지
            </h2>
            {productKeys.map(key => (<li>{product[key]}</li>))}
            <h2>상품명: {product.name}</h2>
            <img
                src={product.image}
                alt=""
                style={{width: '500px'}}
            />
        </div>
    )
};
export default ProductDetail;
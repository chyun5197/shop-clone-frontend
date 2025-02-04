import './ProductList.css'
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

const ProductList = () => {
    const [params, setParams] = useSearchParams();
    const nav = useNavigate();

    const [productList, setProductList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [productKeys, setProductKeys] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try{
                setError(null);
                setProductList(null);
                setLoading(true);
                const response = await axios.get(
                    // 'http://localhost:8080/api/products/all'
                    `http://localhost:8080/api/products?brand=${params.get("brand")}&page=${params.get("page")}&pageSize=${params.get("pageSize")}`,
                );
                setProductList(response.data);
                setProductKeys(Object.keys(response.data));
                console.log(productList);
            }catch(e){
                setError(e);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <div>로딩중..</div>;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!productList) return null;
    return (
        <div>
            <h2>
                {params.get("brand")} 상품 목록 &nbsp 
                {productList.productCount} 개
                <div className="list_wrapper">
                    <ul>
                        {productList.productThumbs.map((product) => (
                            <li key={product.id}>{product.name}</li>
                        ))}
                    </ul>
                </div>
            </h2>
        </div>
    )
};
export default ProductList;
import {useEffect, useState} from "react";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import ProductBestThumb from "./ProductBestThumb.jsx";

const ProductBestViewer = () => {

    const [productList, setProductList] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try{
                setError(null);
                setLoading(true);
                setProductList(null);
                const response = await axios.get(
                    import.meta.env.VITE_API_URL + '/api/products/best'
                );
                setProductList(response.data);
                console.log("rend");
            }catch(error){
                setError(error);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return (
        <div>
            <div style={{height:"150px"}}></div>
            <BeatLoader
                color="#023d86"
                loading={loading}
            />
        </div>
    )
    if (error) return <div>에러가 발생했습니다</div>;
    if (!productList) return null;


    return (

        <div>
            <div className="contents">
                <div style={{height: "70px"}}></div>
                <div className="titleArea">
                    <h2>베스트 상품</h2>
                </div>
                <div style={{height: "20px"}}></div>
                <div className="product-listnormal common_list">
                    <ul className="prdList column5">
                        {productList.productThumbs.map((product, index) => (
                            <ProductBestThumb product={product} index={index} key={index}/>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default ProductBestViewer;
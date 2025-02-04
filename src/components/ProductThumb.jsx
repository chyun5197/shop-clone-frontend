import {useNavigate} from "react-router-dom";

const ProductThumb = ({currentProducts}) => {
    const nav = useNavigate();

    return (
        <div>
            <h3>
                {currentProducts.productThumbs.map((product) => (
                    <li key={product.id} onClick={()=>nav(`/product/detail?id=${product.id}`)}>
                        {product.id}번 {product.name}
                    </li>
                ))}
            </h3>
        </div>
    )
}

export default ProductThumb;
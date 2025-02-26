import {useNavigate} from "react-router-dom";

const ProductThumb = ({product}) => {
    const nav = useNavigate();
    return (
        <li className='item'
            key={product.id}
            onClick={() => nav(`/product/detail?id=${product.id}`)}>
            <div className="box">
                <div className="thumb_wrap">
                    <img src={product.cdnImage} alt=""/>
                </div>
                <div className="title">
                    {product.name}
                </div>
                <ul className='product-price'>
                    <li className='record'>
                                            <span
                                                className='origin-price'>{product.originPrice.toLocaleString()}원</span>
                    </li>
                    <li className='record'>
                        <span className='price'>{product.price.toLocaleString()}원</span>
                    </li>
                </ul>

            </div>
        </li>
    )
}

export default ProductThumb;
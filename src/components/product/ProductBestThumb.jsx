import {useNavigate} from "react-router-dom";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";

const ProductBestThumb = ({product, index}) => {
    const nav = useNavigate();
    return (
        <li className='item'
            key={product.id}
            onClick={() => nav(`/products/detail?id=${product.id}`)}>
            <div className="box">
                <div style={{fontFamily:"Nanum Gothic Bold", fontSize: "14px", color:"black", textAlign:"left"}}>{index + 1}</div>
                <div className="thumb_wrap">
                    <img src={product.cdnImage} alt=""/>
                </div>
                <div className="title">
                    {product.name}
                </div>
                <ul className='product-price'>
                    <li className='record' style={{color:'black'}}>
                        <span style={{fontWeight: "bold", fontSize: "13px"}}>
                            <GoHeartFill style={{verticalAlign: 'text-top'}} size='14' /> {product.wishCount}개
                        </span>
                    </li>
                    <li className='record'>
                        <span className='price'>{product.price.toLocaleString()}원</span>
                    </li>
                </ul>

            </div>
        </li>
    )
}

export default ProductBestThumb;
import './ProductList.css'
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

import Pagination from "../../components/Pagination.jsx"
import ProductThumb from "../../components/ProductThumb.jsx";

const ProductList = () => {
    const [params, setParams] = useSearchParams();
    const nav = useNavigate();
    // const nowPage = params.get("page");

    const [productList, setProductList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const [productKeys, setProductKeys] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sorting, setSorting] = useState('new');

    useEffect(() => {
        const fetchData = async () => {
            try{
                setError(null);
                setProductList(null);
                setLoading(true);
                const response = await axios.get(
                    // 'http://localhost:8080/api/products/all'
                    `http://localhost:8080/api/products?brand=${params.get("brand")}&page=${currentPage}&pageSize=35&sorting=${sorting}`,
                );
                setProductList(response.data);
                setCurrentPage(Number(params.get("page")));
                // setProductKeys(Object.keys(response.data));
                // setCurrentPage(params.get("page"))
                // console.log(currentPage);
            }catch(e){
                setError(e);
            }
            setLoading(false);
        };
        fetchData();
    }, [params.get("page"), sorting]);

    if (loading) return <div>로딩중..</div>;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!productList) return null;

    // const [currentPage, setCurrentPage] = useState(1);
    // const currentItems = items.slice(itemOffset, endOffset);
    // const pageCount = Math.ceil(items.length / itemsPerPage);
    const pageCount = Math.ceil(productList.productCount / 35);
    const totalPage = Math.ceil(productList.totalCount / 35);

    // 페이지를 이동하면 스크롤을 맨 위로
    const handlePageChange = ({ selected, isNext, isPrevious}) => {
        // console.log(nowPage);
        if (isNext) {
            if(currentPage< totalPage - 1){
                nav(`/product/list?brand=fender&page=${currentPage+1}`)
            }
        }else if(isPrevious){
            if(currentPage > 1){
                nav(`/product/list?brand=fender&page=${currentPage-1}`)
            }
        }else{
            nav(`/product/list?brand=fender&page=${selected+1}`)
        }
        // window.scrollTo(0, 0);
    };


    return (
        <div>
            <div className="hanblank_50"></div>
            <div className="headcategory-path">
                <ol>
                    <li>홈</li>
                    <li className="category-path">Guitars 1</li>
                    <li className="category-path">Fender</li>
                </ol>
            </div>
            <div className="hanblank_80"></div>
            <div className="list-bar">
                <p className="prdCount">등록 제품:
                    <strong> {productList.totalCount}개</strong>
                </p>
                <ul id='type'>
                    <li className='pogrd-hov'><a onClick={()=>setSorting('new')}>신상품</a></li>
                    <li className='pogrd-hov'><a onClick={()=>setSorting('asc')}>낮은가격</a></li>
                    <li className='pogrd-hov'><a onClick={()=>setSorting('desc')}>높은가격</a></li>
                </ul>
            </div>
            <div className="hanblank_70"></div>
            <div className="product-listnormal common_list">
                <ul className="prdList column5">
                    {/*<ProductThumb currentProducts={productList}/>*/}
                    {productList.productThumbs.map((product) => (
                        <li className='item'
                            key={product.id}
                            onClick={()=>nav(`/product/detail?id=${product.id}`)}>
                            <div className="box">
                                <div className="thumb_wrap">
                                        <img src={product.image} alt="" />
                                </div>
                                <div className="title">
                                    {product.name}
                                </div>
                                <ul className='product-price'>
                                    <li className='record'>
                                        <span className='origin-price'>{product.originPrice.toLocaleString()}원</span>
                                    </li>
                                    <li className='record'>
                                        <span className='price'>{product.price.toLocaleString()}원</span>
                                    </li>
                                </ul>

                            </div>
                        </li>
                    ))}
                </ul>
                <div className='current'>현재 페이지: {currentPage}</div>
                {pageCount > 0 && (
                    <Pagination
                        pageCount={pageCount}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                )}
            </div>

        </div>
    )
};
export default ProductList;
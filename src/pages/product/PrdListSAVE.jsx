import '../../components/product/ProductListViewer.css'
import axios from "axios";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";


import Pagination from "../../components/Pagination.jsx"
import ProductThumb from "../../components/product/ProductThumb.jsx";
import {PrimaryDispatchContext, PrimaryStateContext} from "../../App.jsx";

const ProductList = () => {
    const [params, setParams] = useSearchParams();
    const nav = useNavigate();
    // const nowPage = params.get("page");

    // const [productKeys, setProductKeys] = useState(null);
    const [currentPage, setCurrentPage] = useState(params.get("page"));
    // const [sorting, setSorting] = useState('new');

    const [productList, setProductList] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => { // 페이지 누를때마다 매번 api 요청해서 상품들 가져온다. 페이지당 35개
        const fetchData = async () => {
            try{
                setError(null);
                setLoading(true);
                setProductList(null);
                const response = await axios.get(
                    import.meta.env.VITE_API_URL + '/api/products/list?'
                    +`cate=${params.get("cate")}&page=${localStorage.getItem("page")}&pageSize=35&sorting=${localStorage.getItem("sorting")}`
                    // => 분류번호, 현재페이지, 분류기준 요청
                );
                setProductList(response.data);
                setCurrentPage(localStorage.getItem("page"));
            }catch(error){
                setError(error);
            }
            setLoading(false);
        };
        fetchData();
    }, [params.get("page"), params.get("sorting"), params.get("cate")]);

    if (loading) return /*<div>로딩중..</div>*/;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!productList) return null;

    const totalPage = Math.ceil(productList.totalCount / 35); // 총 몇페이지

    // ReactPaginate의 onPageChange 메서드
    // onClick 메서드의 clickEvent 파라미터도 어째선지 onPageChange 메서드에서도 똑같이 활용 가능(isNext, isPrevious 사용)
    const onPageChange = ({ selected, isNext, isPrevious}) => {// console.log(nowPage);
        if (isNext) {
            if(currentPage< totalPage - 1){
                nav(`/products/list?cate=${params.get("cate")}&page=${currentPage+1}`)
            }
        }else if(isPrevious){
            if(currentPage > 1){
                nav(`/products/list?cate=${params.get("cate")}&page=${currentPage-1}`)
            }
        }else{
            // 현재 페이지 숫자를 로컬스토리지에서 관리해야 다른 브랜드로 넘어가도 1페이지로 시작 가능
            // useState로 관리하면 실행순서상 이전에 있던 페이지가 남은채로 라우팅해버려서 다른 브랜드 클릭시 1페이지로 갱신이 안됨
            localStorage.setItem("page", selected+1);
            nav(`/products/list?cate=${params.get("cate")}&page=${selected+1}`)
        }
        window.scrollTo(0, 0);
    };

    // 정렬 클릭 이벤트
    const handleSorting = (sorting) => {
        if (loading) return; // 상품 로딩중이면 기다리도록

        // 페이지와 마찬가지 이유로 정렬도 로컬스토리지로 관리
        localStorage.setItem("sorting", sorting);
        localStorage.setItem("page", 1);
        nav(`/products/list?cate=${params.get("cate")}&sorting=${sorting}`)
    }


    return (
        <div>
            <img className='bannerImg' src={localStorage.getItem("banner")} alt='임시'/>
            <div className='contents'> {/*className = 'contents'*/}
                <div className="hanblank_50"></div>
                <div className="headcategory-path">
                    <ol>
                        <li>홈</li>
                        <li className="category-path">{localStorage.getItem("category")}</li>
                        <li className="category-path">{localStorage.getItem("brand")}</li>
                    </ol>
                </div>
                <div className="hanblank_80"></div>
                <div className="list-bar">
                    <p className="prdCount">등록 제품:
                        <strong> {productList.totalCount}개</strong>
                    </p>
                    <ul id='type'>
                        <li className='pogrd-hov'><a onClick={() => handleSorting("new")}>신상품</a></li>
                        <li className='pogrd-hov'><a onClick={() => handleSorting("asc")}>낮은가격</a></li>
                        <li className='pogrd-hov'><a onClick={() => handleSorting("desc")}>높은가격</a></li>
                    </ul>
                </div>
                <div className="hanblank_70"></div>
                <div className="product-listnormal common_list">
                    <ul className="prdList column5">
                        {/*<ProductThumb currentProducts={productList}/>*/}
                        {productList.productThumbs.map((product) => (
                            <li className='item'
                                key={product.id}
                                onClick={() => nav(`/products/detail?id=${product.id}`)}>
                                <div className="box">
                                    <div className="thumb_wrap">
                                        <img src={product.image} alt=""/>
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
                        ))}
                    </ul>
                    {/*<div className='current'>현재 페이지: {currentPage}</div>*/}
                    {
                        <Pagination
                            totalPage={totalPage}
                            onPageChange={onPageChange}
                            currentPage={currentPage}
                        />
                    }

                </div>

            </div>
        </div>

    )
};
export default ProductList;
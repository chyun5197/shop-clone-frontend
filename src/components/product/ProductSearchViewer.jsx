import './ProductSearchViewer.css'
import {useState, useRef} from "react";
import {categroy} from '../../global/Category.js'
import axios from "axios";
import ProductThumb from "./ProductThumb.jsx";
import Pagination from "../Pagination.jsx";

const ProductSearchViewer = () => {
    const [search, setSearch] = useState({
        keyword: '',
        category: '',
        brand: '',
        start: '',
        end: '',
        sort: "new"
    });
    const onChangeSearch = (e) => {

        setSearch({
            ...search,
            [e.target.name]: e.target.value
        });

        // 카테고리 선택 -> 브랜드 리스트 o3ption 변화
        if (e.target.name === "category") {
            onChangeCate(e)
        }
    }

    const [brandList, setBrandList] = useState([]);
    const onChangeCate = (e) => {
        const list = []
        if (e.target.value==="Guitar") {
            categroy["Guitars 1"].map((item) => {list.push(item.name)})
            categroy["Guitars 2"].map((item) => {list.push(item.name)})
        }else if(e.target.value==="Bass"){
            categroy["Bass 1"].map((item) => {list.push(item.name)})
            categroy["Bass 2"].map((item) => {list.push(item.name)})
        }else if(e.target.value==="Acoustic"){
            categroy["Acoustic 1"].map((item) => {list.push(item.name)})
            categroy["Acoustic 2"].map((item) => {list.push(item.name)})
        }
        setBrandList(list);
    }

    const keywordRef = useRef();
    const [productList, setProductList] = useState({
        "productThumbs": [],
        "productCount": 0,
        "totalCount": 0
    });
    const onSubmit = async (e) => {
        e.preventDefault();
        if(search.keyword===''){
            keywordRef.current.focus();
            alert('검색어를 입력해주세요')
            return
        }

        try{
            const response = await axios.get(
                import.meta.env.VITE_API_URL + "/api/products/search?"
                +`keyword=${search.keyword}`
                +`&cate=${search.category}&brand=${search.brand}`
                +`&start=${search.start}&end=${search.end}&sort=${search.sort}`
                +'&page=1&pageSize=300'
            );
            setProductList(response.data);
        }catch(err){
            alert(err)
        }
    };

    return (
        <div className='contents'>
            <div style={{height: "100px"}}></div>
            <div className="titleArea">
                <h2>상품검색</h2>
            </div>

            <div style={{fontSize: '12px'}}>
                등록된 상품: <strong style={{fontFamily:"Nanum Gothic Bold"}}>3509</strong>개
            </div>

            <div className="searchbox">
                <fieldset>
                    <div className="cate">
                        <strong>카테고리</strong>
                        <select name='category' onChange={onChangeSearch}>
                            <option value=''>카테고리 선택</option>
                            <option value="Guitar">Guitar</option>
                            <option value="Bass">Bass</option>
                            <option value="Acoustic">Acoustic</option>
                        </select>
                    </div>
                    <div className="brand">
                        <strong>브랜드</strong>
                        <select name='brand' onChange={onChangeSearch}>
                            <option value=''>브랜드 선택</option>
                            {brandList.map((brand, index) => (
                                <option key={index} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>
                    <div className="keyword">
                        <strong>검색어</strong>
                        <input
                            id='keywordInput'
                            ref={keywordRef}
                            name='keyword'
                            value={search.keyword}
                            onChange={onChangeSearch}
                            onKeyDown={(e)=>e.key === "Enter"? onSubmit(e):undefined}
                            type='text'
                        />
                        <a style={{color:"gray"}}> 예시) es-335, mccarty, strat 2024, classic antique, martin om.. </a>
                    </div>
                    <div className="price">
                        <strong>가격대</strong>
                        <input
                            id='product_price1'
                            name='start'
                            value={search.start}
                            onChange={onChangeSearch}
                            type='number'
                            step='1000000'
                        /><a> </a>
                        ~ <a> </a>
                        <input
                            id='product_price2'
                            name='end'
                            value={search.end}
                            onChange={onChangeSearch}
                            type='number'
                            step='1000000'
                        />
                    </div>
                    <div className="sort">
                        <strong>정렬기준</strong>
                        <select name='sort' onChange={onChangeSearch}>
                            <option value=''>정렬 선택</option>
                            <option value="new">신상품 순</option>
                            <option value="asc">낮은가격 순</option>
                            <option value="desc">높은가격 순</option>
                        </select>

                    </div>
                    <p></p>
                    <div>
                        <img
                            onClick={onSubmit} className='button'
                            src="http://img.echosting.cafe24.com/skin/base_ko_KR/product/btn_search2.gif" alt="검색"/>
                    </div>
                </fieldset>
            </div>

            <div className='recordCount'>
                총 <strong style={{fontFamily:"Nanum Gothic Bold"}}> {productList.totalCount}</strong>개의 상품이 검색되었습니다. [최대 300개까지만 조회하도록 설정]
            </div>
            <p></p>

            <div className="product-listnormal common_list">
                <ul className="prdList column5">
                    {productList.productThumbs.map((product) => (
                        <ProductThumb product={product} key={product}/>
                    ))}
                </ul>
            </div>
        </div>
    )
}
export default ProductSearchViewer
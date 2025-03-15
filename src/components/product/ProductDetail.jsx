import './ProductDetail.css'
import custom_44 from '../../assets/custom_44.gif'
import btn_count_up from '../../assets/btn_count_up.gif'
import btn_count_down from '../../assets/btn_count_down.gif'
import notice_1 from '../../assets/Notice-1.jpg'
import notice_2 from '../../assets/Notice-2.jpg'
import notice_3 from '../../assets/Notice-3.jpg'
import {useNavigate, useSearchParams, Link} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import BeatLoader from "react-spinners/BeatLoader";

const ProductDetail = () => {
    const [params, setParams] = useSearchParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [count, setCount] = useState(1);

    // 상품 상세 조회
    useEffect(() => {
        const fetchData = async () => {
            try{
                setError(null);
                setProduct(null);
                setLoading(true);
                const response = await axios.get(
                    import.meta.env.VITE_API_URL + `/api/products/detail/${params.get("id")}`
                );
                setProduct(response.data);

            }catch(e){
                setError(e);
            }
            setLoading(false);
            window.scrollTo(0, 0);
        };
        fetchData();
    }, []);

    if (loading) return (
        <div>
            <div style={{height: "150px"}}></div>
            <BeatLoader
                color="#023d86"
                loading={loading}
            />
        </div>
    )/*<div>로딩중..</div>*/;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!product) return null;

    // 장바구니 등록
    const onClickAddCart = async (e) => {
        e.preventDefault();
        try {
            const response = await axios({
                // params.get("id"): productId
                url: import.meta.env.VITE_API_URL + `/api/cart/${params.get("id")}?count=${count}`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                },
                method: 'POST',
                // data: count,
                withCredentials: true,
            });
            if (response.status === 201) {
                alert('장바구니에 추가되었습니다!')
            }else if (response.status === 208){ // 장바구니 중복
                alert('이미 장바구니에 있습니다!')
            }
        } catch (error) {
            alert('서버 에러')
        }
    };

    // 위시 등록
    const onClickWish = async (e) => {
        e.preventDefault();
        try {
            const response = await axios({
                // params.get("id"): productId
                url: import.meta.env.VITE_API_URL + `/api/wish/${params.get("id")}`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                },
                method: 'POST',
                withCredentials: true,
            });
            if (response.status === 201) {
                alert('위시리스트에 추가되었습니다!')
            }else if (response.status === 208){ // 위시 중복
                alert('이미 관심상품에 있습니다!')
            }
        } catch (error) {
            alert('서버 에러')
        }
    }

    // 에러 로그 안뜨게 선언만
    const onChangeCount = (e) => {}

    return (
        <div>
            <div className="hanblank_160"></div>
            <div className="headcategory-path headcategory-path-detail">
                <ol>
                    <li style={{fontSize:"11px"}}>홈</li>
                    <li style={{fontSize:"11px"}} className="category-path">{product.category}</li>
                    <li style={{fontSize:"11px"}} className="category-path">{product.brand}</li>
                </ol>
            </div>
            <div style={{height:"12px"}}></div>
            <div className="product-detail">
                <div className="detailArea">
                    {/*이미지 영역*/}
                    <div className="imgArea">
                        <div className="keyImg">
                            <div className="thumbnail">
                                <img
                                    src={product.cdnImage}
                                    alt=""
                                />
                            </div>
                        </div>
                        <div className="controlline">
                            <div className="controll">
                                <span className="prev"><a>&lt; </a></span>
                                <a>ZOOM</a>
                                <span className="next"><a>&gt;</a></span>
                            </div>
                        </div>
                        <div className="listImg"></div>

                    </div>
                    {/*상세정보 영역*/}
                    <div className="infoArea">

                        <div className="infoArea_in">
                            <div className="headingArea">
                                <h2>{product.name} </h2>
                                <span className="icon">
                                <img src={custom_44} alt="" />
                            </span>
                            </div>
                            <div className="pricewrap">
                                <div className="custom_de">
                                    {product.price.toLocaleString()}
                                    <span>원</span>
                                </div>
                                <div className="price_de" >{product.originPrice.toLocaleString()}원</div>
                                <div className="leftper">
                                    <div className="percent">
                                        <span className="cost">{product.discountRate}</span>
                                        <span className="mark">%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="product-detaildesign">
                                <table border="1" >
                                    <tbody>
                                    <tr className="record">
                                        <th scope="row">
                                            <div className="sqb"></div>
                                            <span>제조사</span></th>
                                        <td><span>{product.brand}</span></td>
                                    </tr>
                                    <tr className="record">
                                        <th scope="row">
                                            <div className="sqb"></div>
                                            <span>원산지</span></th>
                                        <td><span>{product.country}</span></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="guideArea">
                            <p className="info"
                            ></p>
                        </div>

                        <div className="totalProducts">
                            <table border="1">
                                <colgroup>
                                    <col className="col1"/>
                                    <col className="col2"/>
                                    <col className="col3"/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <th scope="col">상품명</th>
                                    <th scope="col">상품수</th>
                                    <th scope="col">가격</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{product.name}
                                    </td>
                                    <td>
                                        <span className="quantity">
                                            <input id="quantity" name="quantity_opt[]"
                                                   value={count} onChange={onChangeCount}
                                                   type="text"/>

                                            <img
                                                src={btn_count_up}
                                                alt="수량증가" className="quantityUp"
                                                onClick={()=>setCount(count + 1)}
                                            />

                                            <img
                                                src={btn_count_down}
                                                alt="수량감소" className="quantityDown"
                                                onClick={()=>
                                                    count > 1 ? setCount(count - 1) : setCount(1)
                                                } // 1미만 금지
                                            />

                                        </span>
                                    </td>
                                    <td className="right">
                                        <span className="quantity_price">
                                            {product.price.toLocaleString()}원
                                            <input type="hidden"
                                                   name="option_box_price"
                                                   className="option_box_price"
                                            />
                                        </span>
                                    </td>
                                </tr>
                                </tbody>

                                <tfoot>
                                <tr>
                                    <td colSpan="3">
                                        <strong>총 상품금액 </strong><span className="total"><strong><em>{(product.price*count).toLocaleString()}원</em></strong> (1개)</span>
                                    </td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className="product-action">
                            <div className="btnArea">
                                <a className="first">구매하기</a>
                                <a className="addCart" onClick={onClickAddCart}>장바구니</a>
                                <span className="displaynone">SOLD OUT</span>
                                <a className="wishList" onClick={onClickWish}>위시리스트</a>
                            </div>

                            {/*<div id="NaverChk_Button">*/}
                            {/*    <div id="NC_ID_1738408003941237" className="npay_storebtn_bx npay_type_A_2">*/}
                            {/*        <div id="NPAY_BUTTON_BOX_ID" className="npay_button_box ">*/}
                            {/*            <div className="npay_button">*/}
                            {/*                <div className="npay_text">*/}
                            {/*                    <span className="npay_blind">NAVER 네이버 ID로 간편구매 네이버페이</span>*/}
                            {/*                </div>*/}
                            {/*                <table className="npay_btn_list" cellSpacing="0" cellPadding="0">*/}
                            {/*                    <tbody>*/}
                            {/*                    <tr>*/}
                            {/*                        <td className="npay_btn_item"><a*/}
                            {/*                            id="NPAY_BUY_LINK_IDNC_ID_1738408003941237"*/}
                            {/*                            className="npay_btn_link npay_btn_pay btn_green"*/}
                            {/*                            title="새창"><span*/}
                            {/*                            className="npay_blind">네이버페이 구매하기</span></a></td>*/}
                            {/*                        <td className="npay_btn_item btn_width"><a*/}
                            {/*                            id="NPAY_WISH_LINK_IDNC_ID_1738408003941237"*/}
                            {/*                            className="npay_btn_link npay_btn_zzim " title="새창"><span*/}
                            {/*                            className="npay_blind">찜하기</span></a></td>*/}
                            {/*                    </tr>*/}
                            {/*                    </tbody>*/}
                            {/*                </table>*/}
                            {/*            </div>*/}
                            {/*            <div id="NPAY_EVENT_ID" className="npay_event"><a*/}
                            {/*                id="NPAY_PROMOTION_PREV_IDNC_ID_1738408003941237" href="#"*/}
                            {/*                className="npay_more npay_more_prev"><span className="npay_blind">이전</span></a>*/}
                            {/*                <p id="NPAY_PROMOTION_IDNC_ID_1738408003941237" className="npay_event_text">*/}
                            {/*                    <strong className="event_title">이벤트</strong><a*/}
                            {/*                    href="https://new-m.pay.naver.com/pcpay/eventbenefit"*/}
                            {/*                    className="event_link" target="_blank">네이버페이</a></p>            <a*/}
                            {/*                    id="NPAY_PROMOTION_NEXT_IDNC_ID_1738408003941237" href="#"*/}
                            {/*                    className="npay_more npay_more_next"><span*/}
                            {/*                    className="npay_blind">다음</span></a></div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            <div className="add_action"></div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="middle-blank"></div>
            <center>
                <p><a><img src={notice_1} /></a></p>
                <p><a><img src={notice_2} /></a></p>
                <p><a><img src={notice_3} /></a></p>
                {/*<h2>*/}
                {/*    {params.get("id")}번 상품 상세 페이지*/}
                {/*</h2>*/}
                {/*{productKeys.map(key => (<li>{product[key]}</li>))}*/}
                {/*<h2>상품명: {product.name}</h2>*/}
                {/*<img*/}
                {/*    src={product.image}*/}
                {/*    alt=""*/}
                {/*    style={{width: '500px'}}*/}
                {/*/>*/}
            </center>
            <div className="product-additional">
                    <div id="prdDetail" className="posthan">
                        <div className="no-name"></div>
                        <div className="link">
                            <ul>
                                <li className="selected"><a>상품상세정보</a></li>
                                <li ><a>관련상품</a></li>
                                <li ><a>쇼핑몰 이용정보</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
        </div>
    )
};
export default ProductDetail;
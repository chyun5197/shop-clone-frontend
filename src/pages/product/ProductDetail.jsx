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
import {categroy} from "../../global/Category.js";
import npay_sp_text from '../../assets/npay_sp_text.png'

const ProductDetail = () => {
    const [params, setParams] = useSearchParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [productKeys, setProductKeys] = useState(null);
    const nav = useNavigate()
    const [count, setCount] = useState(1);

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
            <div className="hanblank_50"></div>
            <div className="headcategory-path">
                <ol>
                    <li>홈</li>
                    <li className="category-path">Guitars 1</li>
                    <li className="category-path">Fender</li>
                </ol>
            </div>
            <div className="product-detail">
                <div className="detailArea">
                    {/*이미지 영역*/}
                    <div className="imgArea">
                        <div className="keyImg">
                            <div className="thumbnail">
                                <img
                                    src={product.image}
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
                                        <td><span>Fender</span></td>
                                    </tr>
                                    <tr className="record">
                                        <th scope="row">
                                            <div className="sqb"></div>
                                            <span>원산지</span></th>
                                        <td><span>USA</span></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="guideArea">
                            <p className="info "><span className="displaynone"></span></p>
                        </div>

                        <div className="totalProducts">
                            <p className="info "></p>
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
                                            <input id="quantity" name="quantity_opt[]" value={count} type="text"/>

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
                                                }
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
                                <a>장바구니</a>
                                <span className="displaynone">SOLD OUT</span>
                                <a>위시리스트</a>
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
import './CartViewer.css'
import cartImg from '../../assets/img_step1.png'
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useSearchParams} from "react-router-dom";
import btn_count_up from "../../assets/btn_count_up.gif";
import btn_count_down from "../../assets/btn_count_down.gif";

const CartViewer = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cartResponse, setCartResponse] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    const [checkedId, setCheckedId] = useState([]);
    const [isAllChecked, setIsAllChecked] = useState(false);

    // 상품별 id, count, price
    const [cartItemInfo, setCartItemInfo] = useState(null);

    const nav = useNavigate();

    // 조회
    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                setLoading(true);
                setCartResponse(null);
                const response = await axios.get(
                    import.meta.env.VITE_API_URL + '/api/cart',
                    {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                        }
                    },
                );
                setCartResponse(response.data);

                // 따로 관리할 정보
                let total = 0;
                let infoArr = []
                response.data.cartItemList.map((item) => {
                    // 가격 총합
                    total += item.price*item.count;
                    // 상품별 id, count, price 저장
                    infoArr.push({
                            cartItemId: item.cartItemId,
                            count: Number(item.count),
                            price: Number(item.price),
                    });
                })
                setTotalPrice(total);
                setCartItemInfo(infoArr);
                console.log(cartItemInfo);

            } catch (e) {
                setError(e);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <div>로딩중..</div>;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!cartResponse) return null;

    const onClickNone = () => {}
    const onChangeQuantity = () => {}
    const onClickNotProvided = () =>{alert('준비중입니다.')}
    const onChangeQuantityUp = (id) => {
        setCartItemInfo(cartItemInfo.map((item)=>
            item.cartItemId===id ? {...item, count: item.count+1} : item));
    }
    const onChangeQuantityDown = (id) => {
        setCartItemInfo(cartItemInfo.map((item)=>
            item.cartItemId===id ? {...item, count: item.count-1} : item));
    }

    // 체크박스
    const onCheckboxAll = () => {
        if(!isAllChecked){ // 전체 체크
            const idList = [];
            cartResponse.cartItemList.map((item)=>{
                idList.push(item.cartItemId);
            })
            setCheckedId(idList);
            setIsAllChecked(true);
        }else{ // 전체 해제
            setCheckedId([]);
            setIsAllChecked(false);
        }
    }
    const onCheckbox = (cartItemId) => {
        if (!checkedId.includes(cartItemId)) { // 추가
            setCheckedId([cartItemId, ...checkedId]);
        }else{ // 삭제
            setCheckedId(checkedId.filter((id) => id !== cartItemId));
        }
    }

    // 아이템 수량 변경하기
    const onUpdateCartItemCount = async (cartItemId, count) => {
        try {
            const response = await axios({
                url: import.meta.env.VITE_API_URL + `/api/cart/${cartItemId}`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    'Content-Type': 'application/json',
                },
                method: 'PATCH',
                data: count,
                withCredentials: true,
            });
            if (response.status === 200) {
                alert('수량이 변경되었습니다');
            }
        } catch (error) {
            console.log(count);
            alert('에러');
        }
        location.reload();
    }

    // 클릭한 상품 위시 추가
    const onClickWish = async (productId) => {
        try {
            const response = await axios({
                // params.get("id"): productId
                url: import.meta.env.VITE_API_URL + `/api/wish/${productId}`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                },
                method: 'POST',
                withCredentials: true,
            });
            if (response.status === 201) {
                alert('위시리스트에 추가되었습니다!');
            }else if (response.status === 208){ // 위시 중복
                alert('이미 위시리스트에 들어있습니다')
            }
        } catch (error) {
            alert('에러');
        }
    }

    // 클릭한 장바구니 아이템 삭제
    const onClickDelete = async (cartItemId) => {
        try {
            const response = await axios({
                url: import.meta.env.VITE_API_URL + `/api/cart/${cartItemId}`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                },
                method: 'DELETE',
                withCredentials: true,
            });
            if (response.status === 200) {
                alert('장바구니에서 삭제되었습니다');
            }
        } catch (error) {
            alert('에러');
        }
        location.reload();
    }

    // 체크한 장바구니 아이템 삭제
    const onCheckedDelete = async () => {
        try {
            const response = await axios({
                url: import.meta.env.VITE_API_URL + `/api/cart`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    'Content-Type': 'application/json',
                },
                data: checkedId, // 상품ID 전송
                method: 'DELETE',
                withCredentials: true,
            });
            if (response.status === 200) {
                alert('선택한 상품이 장바구니에서 삭제되었습니다');
                location.reload();
            }else if (response.status === 204) { // 체크 안하고 삭제 버튼 눌렀을때
                alert('삭제할 상품을 선택해주세요')
            }
        } catch (error) {
            alert('에러 발생');
        }
    }

    // 장바구니 비우기
    const onDeleteAll = async () => {
        try {
            const response = await axios({
                url: import.meta.env.VITE_API_URL + `/api/cart/clear`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                },
                method: 'DELETE',
                withCredentials: true,
            });
            if (response.status === 200) {
                alert('장바구니를 비웠습니다');
                location.reload();
            }
        } catch (error) {
            alert('에러 발생');
        }
    }



    // 계속 쇼핑하기 navigate
    const onClickHome = () => {
        window.scrollTo(0, 0)
        nav('/')
    }


    return (
        <div>
            <div className="titleArea">
                <h2>장바구니</h2>
            </div>

            <p className="orderStep">
                <img src={cartImg} alt=""/>
            </p>

            {/*주문 박스*/}
            <div className="orderListArea">
                <div className="order-normtitle">
                    <h3>일반상품 ({cartResponse.cartCount})</h3>
                </div>

                <table className="cartTable">
                    <colgroup>
                        <col style={{width: "27px"}}/>
                        <col style={{width: "92px"}}/>
                        <col style={{width: "230px"}}/>
                        <col style={{width: "auto}"}}/>
                        <col style={{width: "auto}"}}/>
                        <col style={{width: "auto}"}}/>
                        <col style={{width: "auto}"}}/>
                        <col style={{width: "auto}"}}/>
                        <col style={{width: "auto}"}}/>
                        <col style={{width: "110px"}}/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col">
                                <input type="checkbox"
                                       onChange={onCheckboxAll}
                                />
                            </th>
                            <th scope="col">이미지</th>
                            <th scope="col">상품정보</th>
                            <th scope="col">판매가</th>
                            <th scope="col">수량</th>
                            <th scope="col">적립금</th>
                            <th scope="col">배송구분</th>
                            <th scope="col">배송비</th>
                            <th scope="col">합계</th>
                            <th scope="col">선택</th>
                        </tr>
                    </thead>

                    {/*주문금액(small)*/}
                    <tfoot>
                    <tr>
                        <td colSpan="10">
                            <strong className="type">[기본배송]</strong> 상품구매금액
                            <strong> {totalPrice.toLocaleString()} <span
                            className="displaynone">()</span>
                            </strong><span className="displaynone"> </span> + 배송비 0
                            (무료)<span className="displaynone"> </span> <span
                            className="displaynone"> - 상품할인금액 0 </span> =
                            합계 : <strong className="total"><span>{totalPrice.toLocaleString()}</span>원</strong> <span
                            className="displaynone"> </span>
                        </td>
                    </tr>
                    </tfoot>

                    {/*장바구니 아이템*/}
                    <tbody className="orderList">
                    {cartResponse.cartItemList.map((item, index) => (
                        <tr className="record">
                            <td>
                                <input type="checkbox"
                                       id="basket_chk_id_0"
                                       name="basket_product_normal_type_normal"
                                       onChange={() => onCheckbox(item.cartItemId)}
                                       checked={checkedId.includes(item.cartItemId)}
                                />
                            </td>
                            <td className="thumb">
                                <a>
                                    <img
                                        src={item.image}
                                        onClick={() => nav(`/product/detail?id=${item.productId}`)}
                                        alt={item.name}/>
                                </a>
                            </td>
                            <td className="product">
                                <strong
                                    onClick={() => nav(`/product/detail?id=${item.productId}`)}
                                    style={{cursor: 'pointer'}}
                                >
                                    {item.name}
                                </strong>
                            </td>
                            <td className="price grey">
                                <div>
                                    <strong>{item.price.toLocaleString()}원</strong>
                                </div>
                            </td>
                            <td>
                            <span className="quantity">
                               <input id="quantity_id"
                                      onChange={onChangeQuantity}
                                      // value={item.count}
                                      value={cartItemInfo[index].count} // 수량 변경 cartItemInfo 사용
                                      size="2"
                                      type="text"
                               />

                               <img
                                   src={btn_count_up}
                                   // src="https://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_quantity_up.gif"
                                   alt="수량증가" className="quantityUp"
                                   // section08 - App.jsx 체크박스 onUpdate 참고
                                   onClick={()=>onChangeQuantityUp(item.cartItemId)}
                               />

                               <img
                                   src={btn_count_down}
                                   // src="https://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_quantity_down.gif"
                                   alt="수량감소" className="quantityDown"
                                   onClick={()=>cartItemInfo[index].count > 1 ? onChangeQuantityDown(item.cartItemId): {}}
                                   // 1미만 금지
                               />
                            </span>
                                <a className="changeQuantity">
                                    <img
                                        src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_quantity_modify.gif"
                                        onClick={()=>onUpdateCartItemCount(item.cartItemId, cartItemInfo[index].count)}
                                        alt="변경"/>
                                </a>
                            </td>
                            <td className="mileage">-</td>
                            <td className="delivery">기본배송</td>
                            <td>무료</td>
                            <td className="total grey">
                                <strong>{(item.price * item.count).toLocaleString()}원</strong>
                            </td>
                            <td className="button">
                                <a onClick={onClickNotProvided}><img
                                    src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_order.gif"
                                    alt="주문하기"/></a>
                                <a onClick={()=>onClickWish(item.productId)}><img
                                    src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_wish.gif"
                                    alt="관심상품등록"/></a>
                                <a onClick={()=>onClickDelete(item.cartItemId)}><img
                                    src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_delete.gif"
                                    alt="삭제"/></a>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/*할인정보*/}
                <div className="xans-element- xans-order xans-order-basketpriceinfoguide  ">
                    <p className="info ">할인 적용 금액은
                        주문서작성의 결제예정금액에서 확인 가능합니다.</p>
                </div>

                {/*선택상품 제어 버튼*/}
                <div className="selectorder">
                <span className="gLeft">
                    <strong className="text">선택상품을</strong>
                    <a onClick={onCheckedDelete}>
                        <img src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_delete2.gif" alt="삭제하기"/>
                    </a>
                    <a> </a>
                    <a onClick={onClickNone} className="">
                        <img src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_foreign.gif"
                             alt="해외배송상품 장바구니로 이동"/>
                    </a>
                </span>
                    <span className="gRight">
                    <a onClick={onDeleteAll}>
                        <img src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_clear.gif" alt="장바구니비우기"/>
                    </a>
                    <a> </a>
                    <a onClick={onClickNone}>
                        <img src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_estimate.gif" alt="견적서출력"/>
                    </a>
                </span>
                </div>

                {/*총 주문금액*/}
                <div className="totalsummary">
                    <table>
                        <caption>총 주문금액</caption>
                        <colgroup>
                            <col style={{width: "23%"}}/>
                            <col style={{width: "24%"}}/>
                            <col style={{width: "23%"}} className="displaynone"/>
                            <col style={{width: "auto"}}/>
                        </colgroup>
                        <thead>
                        <tr>
                            <th scope="col">
                                <span>총 상품금액</span>
                                <a className="more displaynone">
                                    <img src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_list.gif"
                                         alt="내역보기"/>
                                </a>
                            </th>
                            <th scope="col">총 배송비</th>
                            <th scope="col" className="displaynone">
                                총 할인금액
                                <a>
                                    <img src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_list.gif"
                                         alt="내역보기"/>
                                </a>
                            </th>
                            <th scope="col">결제예정금액</th>
                        </tr>
                        </thead>

                        <tbody>
                        <tr>
                            <td className="price">
                                <div className="box">
                                    <strong>
                                        <span className="total_product_price_display_front">
                                            {totalPrice.toLocaleString()}
                                        </span>
                                    </strong>원
                                    <span className="tail displaynone">
                                    <span className="total_product_price_display_back"></span></span>
                                </div>
                            </td>
                            <td className="option">
                                <div className="box">
                                    <strong>+</strong>
                                    <strong>
                                        <span className="total_delv_price_front">0</span>
                                    </strong>원
                                    <span className="tail displaynone">
                                    <span className="total_delv_price_back"></span></span>
                                </div>
                            </td>
                            <td className="discount displaynone">
                                <div className="box">
                                    <strong>-</strong><strong>0</strong>원 <span className="tail displaynone"></span>
                                </div>
                            </td>
                            <td className="total">
                                <div className="box">
                                    <strong>= </strong>
                                    <strong>
                                        {totalPrice.toLocaleString()}
                                    </strong>원
                                    <span className="tail displaynone"></span>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/*주문 버튼*/}
                <div className="justify">
                    <img onClick={onClickNotProvided} src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_order_all.gif" alt="전체상품주문"/>
                    <a> </a>
                    <img onClick={onClickNotProvided} src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_order_select.gif" alt="선택상품주문"/>
                    <span className="gRight">
                    <img onClick={onClickHome} src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_order_ing.gif" alt="쇼핑계속하기"/>
                </span>
                </div>

            </div>
        </div>
    )
}
export default CartViewer;
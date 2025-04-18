import './OrderListViewer.css'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import orderImg from "../../assets/img_step3.png";
const OrderListViewer = () => {
    const nav = useNavigate();
    const [orderList, setOrderList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onClickNav = (productId) =>{
        window.scrollTo(0, 0)
        nav(`/products/detail?id=${productId}`)
    }

    // 주문목록 모두 조회
    useEffect(() => {
        const fetchData = async () => {
            try{
                setError(null);
                setLoading(true);
                setOrderList(null);
                const response = await axios.get(
                    import.meta.env.VITE_API_URL + '/api/order/list',
                    {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                        }
                    }
                );
                setOrderList(response.data);
                console.log(response.data);
            }catch (error) {
                setError(error);
            }
            setLoading(false);
        }
        fetchData();
    }, [])

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
    if (!orderList) return null;

    const refund = async (merchantUid) =>{
        const confirmResult = window.confirm("정말 환불하시겠습니까? \n(환불 신청 여부와 관계없이 테스트 결제이므로 당일 자정 전(23:00~23:50)에 자동 환불됩니다.)")
        if (!confirmResult) {
            alert('환불 취소')
            return;
        }
        try{
            const response = await axios({
                url: import.meta.env.VITE_API_URL + `/api/payment/cancel/${merchantUid}`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                },
                method: "POST",
                withCredentials: true
            })
            if(response.data === "cancel"){
                alert('환불이 완료되었습니다.')
                window.scrollTo(0,0)
                location.reload();
            }else if(response.data === "already canceled"){
                alert('이미 환불 완료된 주문입니다.')
            }
        }catch (error) {
            console.log(error);
        }

    }

    return (
        <div className="contents">
            <div style={{height: "70px"}}></div>
            <div className="titleArea">
                <h2>주문조회</h2>
            </div>

            <p className="orderStep">
                <img src={orderImg} alt=""/>
            </p>

            <div className="orderhistory">
                <ul className="menu">
                    <li className="tab_class selected">
                        <a>주문내역조회(
                            <span id="xans_myshop_total_orders">{orderList.length}</span>
                            )
                        </a>
                    </li>
                    {/*<li className="tab_class_cs">*/}
                    {/*    <a>*/}
                    {/*        취소/반품/교환 내역 (*/}
                    {/*        <span id="xans_myshop_total_orders_cs">0</span>*/}
                    {/*        )*/}
                    {/*    </a>*/}
                    {/*</li>*/}
                </ul>
            </div>

            <div className="orderhistorylistitem">
                <div className="title">
                    <h3>주문 상품 정보</h3>
                </div>
                <table border="1">
                    <thead>
                    <tr>
                        <th scope="col" style={{width: "150px"}} className="number">주문일자<br/>[주문번호]</th>
                        <th scope="col" style={{width: "92px"}} className="thumb">이미지</th>
                        <th scope="col" style={{width: "auto"}} className="product">상품정보</th>
                        <th scope="col" style={{width: "60px"}} className="quantity">수량</th>
                        <th scope="col" style={{width: "110px"}} className="price">실제상품가격</th>
                        <th scope="col" style={{width: "90px"}} className="state">주문처리상태</th>
                        <th scope="col" style={{width: "90px"}} className="payMethod">결제카드</th>
                        <th scope="col" style={{width: "70px"}} className="service">환불하기</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderList.map(((orderList, index) => (
                        orderList.orderItems.map((orderItem, index) => (
                            <tr>
                                <td rowSpan={index === 0 ? orderList.orderItems.length : 0} scope="col"
                                    className={index === 0 ? "number" : "displaynone"}
                                >
                                    <div style={{fontFamily: "Nanum Gothic Bold"}}>
                                        {orderList.orderDate}
                                        <p style={{textDecoration: "underline"}}>[{orderList.merchantUid}]</p>
                                    </div>
                                </td>
                                <td scope="col" style={{}} className="thumb">
                                    <img style={{width: "80px"}}
                                         src={orderItem.image}
                                         alt=""
                                         onClick={() => onClickNav(orderItem.productId)}
                                    />
                                </td>
                                <td scope="col" style={{textAlign: "left", paddingLeft: "10px", verticalAlign: "top"}}
                                    className="product">
                                    <strong style={{fontFamily: "Nanum Gothic Bold", cursor: "pointer"}}
                                            onClick={() => onClickNav(orderItem.productId)}
                                    >{orderItem.productName}</strong>
                                </td>
                                <td scope="col" style={{}} className="quantity">{orderItem.quantity}</td>
                                <td scope="col" style={{}} className="price">{orderItem.realPrice.toLocaleString()}원
                                </td>
                                <td rowSpan={index === 0 ? orderList.orderItems.length : 0} scope="col"
                                    style={{fontFamily: "Nanum Gothic Bold"}}
                                    className={index === 0 ? "state" : "displaynone"}><p>{orderList.paymentStatus}</p>
                                </td>
                                <td rowSpan={index === 0 ? orderList.orderItems.length : 0} scope="col"
                                    className={index === 0 ? "payMethod" : "displaynone"}>{orderList.payCard}</td>
                                <td rowSpan={index === 0 ? orderList.orderItems.length : 0} scope="col"
                                    style={{fontSize: "9px"}}
                                    className={index === 0 ? "service" : "displaynone"}>
                                    <button onClick={() => {
                                        refund(orderList.merchantUid)
                                    }}>환불하기
                                    </button>
                                </td>
                            </tr>
                        ))
                    )))}
                    {/*<tr>*/}
                    {/*    <th scope="col" style={{}} className="number"><div>주문일자</div></th>*/}
                    {/*    <th scope="col" style={{}} className="thumb">*/}
                    {/*        <img style={{width:"80px"}}*/}
                    {/*            src="//musicforce.co.kr/web/product/medium/musicforce1_3340.jpg"*/}
                    {/*            alt=""/>*/}
                    {/*    </th>*/}
                    {/*    <th scope="col" style={{}} className="product">*/}
                    {/*            <strong>GHS Pick Heavy(A55)</strong>*/}
                    {/*    </th>*/}
                    {/*    <th scope="col" style={{}} className="quantity">111</th>*/}
                    {/*    <th scope="col" style={{}} className="price">1,000원</th>*/}
                    {/*    <th scope="col" style={{}} className="state"><p>결제완료</p></th>*/}
                    {/*    <th scope="col" style={{}} className="state">결제방법</th>*/}
                    {/*    <th scope="col" style={{}} className="service">환불하기</th>*/}
                    {/*</tr>*/}
                    </tbody>
                </table>
            </div>
            <ul className="controlInfo">
                <li className={"alert2"}>결제 금액은 매일 자정 전(23:00~23:50)에 자동으로 일괄 결제 취소되어 환불됩니다.</li>
            </ul>
        </div>
    )
};
export default OrderListViewer;
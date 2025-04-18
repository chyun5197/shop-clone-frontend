import './OrderSheetViewer.css'
import orderImg from "../../assets/img_step2.png";
import {useEffect, useRef, useState} from "react";
import BeatLoader from "react-spinners/BeatLoader";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const OrderSheetViewer = () => {
    const { IMP } = window; // IMP(아임포트 모듈) 객체를 IMP window에서 추출
    IMP.init('imp06008388') // 고객사 식별코드
    const nav = useNavigate()
    const [user, setUser] = useState({
        fullName:"",
        email:"",
    });
    const onChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        })
    }
    // focus 용도
    const nameRef = useRef();
    const emailRef = useRef();

    // email 정규식
    const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderSheetResponse, setOrderSheetResponse] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    // 주문아이템, 주문자명 조회
    useEffect(() => {
        const fetchData = async () => {
            try{
                setError(null);
                setLoading(true);
                setOrderSheetResponse(null);
                const response = await axios({
                    url: import.meta.env.VITE_API_URL + '/api/order/sheet',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                        'Content-Type': 'application/json',
                    },
                    data: JSON.parse(localStorage.getItem('orderSheetRequest')), // {상품ID, 개수} 리스트 요청
                    method: 'POST',
                    withCredentials: true,
                });

                // 회원정보
                // let member = response.data.orderMemberInfo

                // if (member.name)
                // setUser({...user, 'fullName': member.name});
                // setUser({...user, 'email': member.email});

                // 총가격
                let total = 0
                response.data.orderItemSummaryList.map((item) => {
                    total += item.price;
                })
                setTotalPrice(total);
                setOrderSheetResponse(response.data);

            }catch(e){
                setError(e);
            }
            setLoading(false);
        };
        fetchData();
    }, [])

    if (loading) return (
        <BeatLoader
            color="#023d86"
            loading={loading}
        />
    );
    if (error) return <div>에러가 발생했습니다</div>;
    if (!orderSheetResponse) return null;

    // 결제하기
    const requestPayment = async (e) => {
        e.preventDefault();

        // 주문자 정보 입력 확인
        if(user.fullName===""){
            nameRef.current.focus();
            alert('이름을 입력하세요');
            return
        }else if(user.email===""){
            emailRef.current.focus();
            alert('이메일을 입력하세요');
            return
        }else if(!emailRegEx.test(user.email)){
            alert('이메일을 형식에 맞게 입력해주세요')
            return
        }

        // 쇼핑몰 주문번호
        let merchantId = orderSheetResponse.merchantId;

        // 결제 금액 사전등록 요청(->스프링)(Order, Payment 테이블도 생성)
        // 사전등록된 가맹점 주문번호(merchant_uid)에 대해,
        // IMP.request_pay()에 전달된 merchant_uid가 일치하는 주문의 결제금액이 다른 경우 PG사 결제창 호출이 중단됩니다.
        const prepareResponse = await axios({
            url: import.meta.env.VITE_API_URL + '/api/payment/prepare',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            },
            method: 'POST',
            data: {
                merchantUid: merchantId,
                email: user.email,
                orderName: user.fullName,
                orderSheetItems: JSON.parse(localStorage.getItem('orderSheetRequest'))
            }
        })
        if (prepareResponse.data === 'pass'){ // 사전등록
            console.log('이미 사전등록을 했습니다.')
        }

        // 결제 요청(->포트원V1)
        IMP.request_pay(
            {
                channelKey: "channel-key-4520d30d-e080-4edb-9caf-9589065008eb",
                pay_method: "card",
                merchant_uid: merchantId, // 쇼핑몰 주문번호
                name: "쇼핑몰 프로젝트 결제(포트원V1)",
                amount: 1000,
                buyer_email: "chyun51@naver.com", // 형식 맞춰서 필수
                buyer_name: "최현",
                // buyer_tel: "010-4242-4242",
                // buyer_addr: "서울특별시 서초구 방배동",
                // buyer_postcode: "01181",
            },
            async (response) => {
                if (response.error_code != null) {
                    return alert(`결제 요청에 실패하였습니다. \n실패 사유: ${response.error_msg}`);
                }
                else if (response.success === false){
                    return alert("결제를 취소하였습니다.")
                }
                let impUid = response.imp_uid; // 포트원 결제 고유번호

                // 결제 검증 및 결제 완료 처리(->스프링)
                try {
                    const notified = await axios({
                        url: import.meta.env.VITE_API_URL + `/api/payment/complete`,
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                            'Content-Type': 'application/json'
                        },
                        data: {
                            impUid: impUid,
                            merchantUid: merchantId
                        },
                        method: 'POST',
                        withCredentials: true,
                    });
                    console.log(notified.data);
                    if (notified.data === "complete") {
                        alert("결제가 정상적으로 완료되었습니다.")
                        window.scrollTo(0, 0);
                        nav("/myshop/order/list")
                    }else{
                        alert("결제 요청 금액이 잘못되어 결제가 취소되었습니다.")
                    }
                } catch (error) {
                    if(error.status === 429){
                        alert("주문 요청한 상품의 재고가 부족합니다")
                    }else{
                        alert('결제 서버 에러');
                    }
                }
            },
        );

        // 결제 요청(->포트원V2)
        // const response = await PortOne.requestPayment({
        //     storeId: "store-5720e249-b9e8-45e4-bb09-b1ba9891c2c2", // 가맹점 Store ID 설정
        //     channelKey: "channel-key-6402fc21-0850-4da0-99a5-923a91e252f4", // 채널 키 설정
        //     paymentId: 'merchant_98765', // 주문번호(paymentId) 중복 불가 | paymentId = merchantId = merchant_uid = orderNumber
        //     orderName: "쇼핑몰 프로젝트 모의 결제", // 결제창에 보여지는 주문명
        //     totalAmount: 1000, // 주문금액 (최소 1000원 이상)
        //     currency: "CURRENCY_KRW",
        //     payMethod: "CARD",
        //     customer: { // 필수 입력
        //         // fullName : user.fullName,
        //         // email : user.email,
        //         // phoneNumber: user.phone1+"-"+user.phone2+"-"+user.phone3,
        //     }
        // });
        // // 오류 발생 시
        // if (response.code !== undefined) {
        //     return alert(response.message);
        // }
    }


    return (
        <div className="contents">
            <div style={{height: "70px"}}></div>
            <div className="titleArea">
                <h2>주문서작성</h2>
            </div>

            <p className="orderStep">
                <img src={orderImg} alt=""/>
            </p>

            <ul className="controlInfo">
                <li className={"alert"}>상품의 옵션 및 수량 변경은 상품상세 또는 장바구니에서 가능합니다.</li>
            </ul>

            {/*주문박스*/}
            <div className="orderListArea">
                <div className="order-normtitle" style={{margin: 0}}>
                    <h3 style={{color: "black", fontFamily: "Nanum Gothic Bold"}}>국내배송상품 주문내역</h3>
                </div>
                <div className="boardList">
                    <table className="cartTable" border="1" summary>
                        <caption>기본배송</caption>
                        <thead className="orderThead">
                        <tr className={"orderTheadTr"} style={{color: "black", fontFamily: "Nanum Gothic"}}>
                            <th scope="col" className="thumb" style={{width: "92px"}}>이미지</th>
                            <th scope="col" className="product" style={{width: "auto"}}>상품정보</th>
                            <th scope="col" className="price" style={{width: "95px"}}>판매가</th>
                            <th scope="col" className="quantity" style={{width: "40px"}}>수량</th>
                            <th scope="col" className="mileage" style={{width: "85px"}}>적립금</th>
                            <th scope="col" className="delivery" style={{width: "90px"}}>배송구분</th>
                            <th scope="col" className="charge" style={{width: "70px"}}>배송비</th>
                            <th scope="col" className="total" style={{width: "90px"}}>합계</th>
                        </tr>
                        </thead>
                        <tfoot>
                        <tr>
                            <td colSpan="9">
                                <strong className="type">[기본배송]</strong>
                                합계 : <strong className="total"><span
                                id="domestic_ship_fee_sum">{totalPrice.toLocaleString()}</span>원</strong>
                                <span className="displaynone"></span>
                            </td>
                        </tr>
                        </tfoot>

                        {/*주문 아이템*/}
                        <tbody className="orderList">
                        {orderSheetResponse.orderItemSummaryList.map((item, index) => (
                            <tr className="record">
                                <td className="thumb">
                                    <a>
                                        <img
                                            src={item.image}
                                            onClick={() => nav(`/products/detail?id=${item.productId}`)}
                                            alt={item.name}/>
                                    </a>
                                </td>
                                <td className="product" style={{fontSize: "11px", fontFamily: "Nanum Gothic Bold"}}>
                                    <strong
                                        onClick={() => nav(`/products/detail?id=${item.productId}`)}
                                        style={{cursor: 'pointer'}}>
                                        {item.name}
                                    </strong>
                                </td>
                                <td className="price" style={{fontSize: "11px", fontFamily: "Nanum Gothic Bold"}}>
                                    <div>
                                        <strong>{item.price.toLocaleString()}원</strong>
                                    </div>
                                </td>
                                <td className="quantity">{item.quantity}</td>
                                <td className="mileage" style={{fontSize: "11px"}}>
                                    <img src="//img.echosting.cafe24.com/design/common/icon_cash.gif"/>
                                    {(item.price * item.quantity / 100).toLocaleString() }원
                                </td>
                                <td className="delivery" style={{fontSize: "11px"}}>
                                    기본배송
                                </td>
                                <td className="charge" style={{fontSize: "11px"}}>[무료]</td>
                                <td className="total" style={{fontSize: "12px"}}>
                                    <strong>{item.price.toLocaleString()}원</strong>
                                    <div className="displaynone"></div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/*입력사항*/}
            <br/>
            <p className="required ">
                <img src="http://img.echosting.cafe24.com/skin/base/common/ico_required.gif"
                     alt="필수"/> 필수입력사항
            </p>

            <div className="join">
                <div className="boardWrite">
                    <table>
                        <tbody>
                        <tr>
                            <th scope="row" >
                                이름
                                <img src="http://img.echosting.cafe24.com/skin/base/common/ico_required.gif" alt="필수"/>
                            </th>
                            <td>
                                <input
                                    ref ={nameRef}
                                    name='fullName'
                                    placeholder='이름 입력'
                                    value={user.fullName}
                                    onChange={onChange}
                                    type="text"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" id="email">이메일
                                <img src="http://img.echosting.cafe24.com/skin/base/common/ico_required.gif" alt="필수"/>
                            </th>
                            <td>
                                <input
                                    ref = {emailRef}
                                    name='email'
                                    placeholder='이메일 입력'
                                    value={user.email}
                                    onChange={onChange}
                                    type="text"
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/*결제 예정 금액*/}
            <div className="title" style={{margin: "40px 0 10px 10px"}}>
                <h3>결제 예정 금액</h3>
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
                    <tr style={{color: "black", fontFamily: "Nanum Gothic Bold"}}>
                        <th scope="col">
                            <span>실제 상품금액</span>
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
                                <strong style={{textDecoration: "line-through"}}>
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
                            <div className="box" style={{color: "#008bcc"}}>
                                <strong>= </strong>
                                <strong>
                                    1000
                                </strong>원
                                <span className="tail displaynone"></span>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <br/>

            <ul className="controlInfo">
                <li className={"alert2"}>실제 상품 구매가 아닌 테스트 결제가 진행됩니다.</li>
                <li>실제 상품금액에 관계 없이 결제 요청 가능한 최소 금액인 1000원이 테스트 결제 됩니다.</li>
                <li>결제 금액은 매일 자정 전(23:00~23:50)에 자동으로 일괄 결제 취소되어 환불됩니다.</li>
            </ul>

            {/*결제버튼*/}
            <div className="button" style={{textAlign: "center"}}>
                <img
                    src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_place_order.gif" id="btn_payment"
                    alt="결제하기"
                    onClick={requestPayment}
                />
            </div>

        </div>

    )
};
export default OrderSheetViewer;
import './WishViewer.css'
import {useEffect, useState} from "react";
import axios from "axios";

const WishViewer = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [wishResponse, setWishResponse] = useState(null);

    const [checkedId, setCheckedId] = useState([]);
    const [isAllChecked, setIsAllChecked] = useState(false);

    useEffect(() => {
        const fetchData =  async () => {
            try{
                setError(null);
                setLoading(true);
                setWishResponse(null)
                const response = await axios.get(
                    import.meta.env.VITE_API_URL + '/api/wish',
                    {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                        }
                    },
                );
                setWishResponse(response.data);
            }catch(e){
                setError(e);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <div>로딩중..</div>;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!wishResponse) return null;

    // 조회
    const onClickOrder = () => {alert('준비중입니다')}

    // 체크박스
    const onCheckboxAll = () => {
        if(!isAllChecked){ // 전체 체크
            const idList = [];
            wishResponse.map((wish)=>{
                idList.push(wish.productId);
            })
            setCheckedId(idList);
            setIsAllChecked(true);
        }else{ // 전체 해제
            setCheckedId([]);
            setIsAllChecked(false);
        }
    }
    const onCheckbox = (productId) => {
        if (!checkedId.includes(productId)) { // 추가
            setCheckedId([productId, ...checkedId]);
        }else{ // 삭제
            setCheckedId(checkedId.filter((id) => id !== productId));
        }
    }

    // 클릭한 상품 장바구니 추가
    const onClickCart = async (productId) => {
        try {
            const response = await axios({
                url: import.meta.env.VITE_API_URL + `/api/cart/${productId}`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                },
                method: 'POST',
                withCredentials: true,
            });
            if (response.status === 201) {
                alert('장바구니에 추가되었습니다!')
            }else if (response.status === 208){ // 장바구니 중복
                alert('이미 장바구니에 들어있습니다')
            }
        } catch (error) {
            alert('에러 발생')
        }
    }

    // 클릭한 위시 삭제
    const onClickDelete = async (wishId) => {
        try {
            const response = await axios({
                url: import.meta.env.VITE_API_URL + `/api/wish/${wishId}`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                },
                method: 'DELETE',
                withCredentials: true,
            });
            if (response.status === 200) {
                alert('위시리스트에서 삭제되었습니다');
            }
        } catch (error) {
            alert('에러 발생');
        }
        location.reload();
    }

    // 체크한 상품들 위시 삭제
    const onCheckedDelete = async () => {
        try {
            const response = await axios({
                url: import.meta.env.VITE_API_URL + `/api/wish`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    'Content-Type': 'application/json',
                },
                data: checkedId, // 상품ID 전송
                method: 'DELETE',
                withCredentials: true,
            });
            if (response.status === 200) {
                alert('선택한 상품이 위시리스트에서 삭제되었습니다');
                location.reload();
            }else if (response.status === 204) { // 체크 안하고 삭제 버튼 눌렀을때
                alert('삭제할 상품을 선택해주세요')
            }
        } catch (error) {
            alert('에러 발생');
        }
    }

    // 체크한 상품들 장바구니 추가
    const onCheckedAddCart = async () => {
        try {
            const response = await axios({
                url: import.meta.env.VITE_API_URL + `/api/cart`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    'Content-Type': 'application/json',
                },
                data: checkedId, // 상품ID 전송
                method: 'POST',
                withCredentials: true,
            });
            if (response.status === 201) {
                alert('선택한 상품이 장바구니에 추가되었습니다');
            }else if (response.status === 204) { // 체크 안하고 버튼 눌렀을때
                alert('상품을 선택해주세요')
            }
        } catch (error) {
            alert('에러 발생');
        }
    }

    // 위시리스트 비우기
    const onDeleteAll = async () => {
        try {
            const response = await axios({
                url: import.meta.env.VITE_API_URL + `/api/wish`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    'Content-Type': 'application/json',
                },
                data: [-1], // 전부 삭제할 경우 같은 api에 -1만 넣어 보내서 스프링 처리
                method: 'DELETE',
                withCredentials: true,
            });
            if (response.status === 200) {
                alert('위시리스트의 모든 상품이 삭제되었습니다');
                location.reload();
            }
        } catch (error) {
            alert('에러 발생');
        }
    }


    return (
        <div>
            {/*<div>{checkedId}</div>*/}
            <div className="titleArea">
                <h2>위시리스트</h2>
            </div>

            <div className="orderListArea">
                {/*카트 테이블 그대로 활용*/}
                <table className="wishTable">
                    <colgroup>
                        <col style={{width: "27px"}}/>
                        <col style={{width: "92px"}}/>
                        <col style={{width: "200px"}}/>
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
                            <th scope="col">적립금</th>
                            <th scope="col">배송구분</th>
                            <th scope="col">배송비</th>
                            <th scope="col">합계</th>
                            <th scope="col">선택</th>
                        </tr>
                    </thead>
                    {/*아이템*/}
                    <tbody className="wishListItem">
                    {wishResponse.map((wish) => (
                        <tr className="record">
                            <td>
                                <input type="checkbox"
                                       name="wish_idx[]"
                                       value={wish.price}
                                       onChange={() => onCheckbox(wish.productId)}
                                       checked={checkedId.includes(wish.productId)}
                                />
                            </td>
                            <td className="thumb">
                                <a>
                                    <img src={wish.image}
                                         alt={wish.productId}/>
                                </a>
                            </td>
                            <td className="product">
                                <strong>{wish.name}</strong>
                            </td>
                            <td className="price">
                                <strong>{wish.price.toLocaleString()}원</strong>
                            </td>
                            <td className="mileage">-</td>
                            <td className="delivery">기본배송</td>
                            <td style={{color:"black"}}>무료</td>
                            <td className="total">
                                {wish.price.toLocaleString()}원
                            </td>
                            <td className="button">
                                <a onClick={onClickOrder}><img
                                    src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_order.gif"
                                    alt="주문하기"/></a>
                                <a onClick={()=>onClickCart(wish.productId)}><img
                                    src="https://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_basket.gif"
                                    alt="장바구니"/></a>
                                <a onClick={()=>onClickDelete(wish.wishId)}><img
                                    src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_delete.gif"
                                    alt="삭제"/></a>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/*하단 라인*/}
            <div className="ec-base-button">
                <span className="gLeft">
                    <strong className="text">선택상품을</strong>
                    <a onClick={onCheckedDelete}>
                        <img src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_delete2.gif" alt="삭제하기"/>
                    </a>
                    <a> </a>
                    <a onClick={onCheckedAddCart}>
                        <img src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_basket2.gif" alt="장바구니 담기"/>
                    </a>
                </span>
                <span className="gRight">
                    <a onClick={onClickOrder}>
                        <img
                            src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_order_all.gif" alt="전체상품주문"/>
                    </a>
                    <a> </a>
                    <a onClick={onDeleteAll}>
                        <img
                            src="http://img.echosting.cafe24.com/skin/base_ko_KR/order/btn_order_empty.gif" alt="관심상품 비우기"/>
                    </a>
                </span>
            </div>


            {/*{wishResponse.map((wish) => (*/}
            {/*    <li key={wish.id}>{wish.name} {wish.price}원</li>*/}
            {/*))}*/}
        </div>
    )
}
export default WishViewer;
import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import ReactDOM from "react-dom/client";
import Chat from "./Chat.jsx";
import {PrimaryStateContext} from "../App.jsx";

const ChatRoomList = () => {
    const params = useParams();
    const [chatRoomList, setChatRoomList] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try{
                setError(null);
                setLoading(true);
                setChatRoomList(null);
                const response = await axios.get(
                    import.meta.env.VITE_API_URL + '/api/chat/list',
                    {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                        }
                    },

                );
                setChatRoomList(response.data);
            }catch(error){
                setError(error);
            }
            setLoading(false);
        };
        fetchData();
    }, []);
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
    if (!chatRoomList) return null;

    const primaryInfo = useContext(PrimaryStateContext)
    const openChatWindow = async (roomId) => {
        // 로그인해야 접근 가능
        if (!primaryInfo.isLogin) {
            alert('로그인을 해주세요')
            return
        }
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.innerWidth - width) / 2;
        const top = window.screenY + (window.innerHeight - height) / 2;
        const newWindow = window.open(
            "",
            "_blank",
            `noopene,width=${width},height=${height},left=${left},top=${top}`
        );
        // const newWindow = window.open("", "_blank", "width=600,height=400");
        if (!newWindow) return;

        newWindow.document.title = "새 창";
        // 새 창의 HTML 구조 초기화
        newWindow.document.body.innerHTML = '<div id="chat-root"></div>';
        // 스타일 추가 (선택 사항)
        const style = newWindow.document.createElement("style");
        style.textContent = `
            body { margin: 0; font-family: Arial, sans-serif; }
            .list-item { padding: 10px; border-bottom: 1px solid #ccc; }
        `;
        newWindow.document.head.appendChild(style);

        // React 컴포넌트 렌더링
        const root = ReactDOM.createRoot(newWindow.document.getElementById("chat-root"));
        root.render(<Chat memberId={params.id} chatRoomId={roomId} role={"COUNSELOR"}/>);
        // 창 닫힐 때 언마운트 처리
        newWindow.onbeforeunload = () => {
            root.unmount();
        };


        // 새 창 참조 저장
        newWindowRef.current = newWindow;
    }


    return <div>
        <div style={{height: "150px"}}></div>
        <h2>
            채팅방 리스트
        </h2>
        {chatRoomList.map((item, index) => (
            <h1 onClick={() => openChatWindow(item.chatRoomId)}
                style={{ cursor: 'pointer' }}>{item.chatRoomId}</h1>
        ))}
    </div>
};
export default ChatRoomList;
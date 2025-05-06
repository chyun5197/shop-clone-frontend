import React, {useEffect, useState, useRef} from "react";
import axios from "axios";
// npm install @stomp/stompjs --save
import {Stomp} from "@stomp/stompjs" // => stompjs 버전4 이하 (정적 유틸리티 객체)
import { Client } from '@stomp/stompjs'; // => stompjs 버전5 이상 (구조화된 클래스)

const Chat = ({memberId, chatRoomId, role}) => {
    //웹소켓 연결 객체
    const stompClient = useRef(null);
    // 메세지 리스트
    const [messages, setMessages] = new useState([]);
    // 사용자 입력을 저장할 변수
    const [inputValue, setInputValue] = useState('');
    // 입력 필드 변경 핸들러
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    // 웹소켓 연결 후, 구독한 주소로 메세지 수신
    const connect = () => {
        // 이렇게 선언하면 WebSocket 객체를 재사용할 수 없음, 재연결 불가
        // const socket = new WebSocket(import.meta.env.VITE_SOCKET_URL);
        // stompClient.current = Stomp.over(socket);

        //=================
        // Stomp 라이브러리
        // stompClient.current = Stomp.over(function() {
        //     return new WebSocket(import.meta.env.VITE_SOCKET_URL);
        // });
        //
        // // 자동 재연결 설정 (5초 후 재연결 시도)
        // stompClient.current.reconnectDelay = 5000;
        //
        // stompClient.current.connect({}, () => {
        //     console.log("STOMP 연결 성공");
        //     stompClient.current.subscribe(`/sub/chatroom/${chatRoomId}`, (message) => {
        //         // 상대가 발송한 메세지를 추가
        //         const newMessage = JSON.parse(message.body);
        //         setMessages((prevMessages) => [...prevMessages, newMessage]);
        //     });
        // }, (error) => {
        //     console.error("STOMP 연결 실패:", error);
        // });

        // Client 라이브러리
        if (stompClient.current) {
            console.warn("이미 연결된 WebSocket이 있습니다.");
            return;
        }

        // StompJS 클라이언트 생성
        stompClient.current = new Client({
            brokerURL: import.meta.env.VITE_SOCKET_URL, // WebSocket URL 설정
            reconnectDelay: 5000, // 자동 재연결 (5초 후 시도)
            debug: (str) => console.log(`STOMP DEBUG: ${str}`), // 디버그 로그 (선택 사항)
            onConnect: () => {
                console.log("STOMP 연결 성공");

                // 특정 채팅방 구독
                stompClient.current.subscribe(`/sub/chatroom/${chatRoomId}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                });
            },
            onStompError: (error) => {
                console.error("STOMP 에러:", error.headers.message);
            },
        });

        // WebSocket 활성화
        stompClient.current.activate();
    };

    // 기존의 채팅 내역 불러오기
    const fetchMessages = () => {
        return axios.get(import.meta.env.VITE_API_URL+`/api/chat/${chatRoomId}`)
            .then(response => {setMessages(response.data)});
    };

    // STOMP  연결 해제
    // const disconnect = () => {
    //     if (stompClient.current) {
    //         stompClient.current.disconnect();
    //         console.log("STOMP 연결 해제");
    //     }
    // };

    // Client 연결 해제
    const disconnect = () => {
        if (stompClient.current) {
            stompClient.current.deactivate();
            stompClient.current = null;
            console.log("STOMP 연결 해제");
        }
    };

    useEffect(() => {
        connect();
        fetchMessages();
        // 컴포넌트 언마운트 시 웹소켓 연결 해제
        return () => disconnect();
    }, []);

    // 메세지 송신
    const sendMessage = () => {
        if (stompClient.current && inputValue) {
            const body = {
                chatRoomId : chatRoomId,
                memberId : memberId,
                role: role,
                message : inputValue
            };
            // stompClient.current.send(`/pub/message`, {}, JSON.stringify(body)); // 메세지 내용 송신
            // send 대신 publish를 사용하는 것이 최신 StompJS의 권장 방식
            stompClient.current.publish({
                destination: `/pub/message`,
                body: JSON.stringify(body),
            });
            setInputValue('');
        }
    };

    const styles = {
        chatContainer: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: '#f5f5f5',
            fontFamily: 'Arial, sans-serif',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: '#3263ac',
            color: '#ffffff',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        headerTitle: {
            fontSize: '18px',
            fontWeight: 'bold',
        },
        chatButton: {
            backgroundColor: '#ffffff',
            color: '#3263ac',
            border: 'none',
            borderRadius: '4px',
            padding: '5px 15px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        chatButtonHover: {
            backgroundColor: '#f0f0f0',
        },
        messageList: {
            flex: 1,
            overflowY: 'auto',
            padding: '10px 20px',
            margin: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
        },
        listItem: {
            maxWidth: '60%',
            margin: '5px 0',
            padding: '10px',
            borderRadius: '8px',
            wordWrap: 'break-word',
            fontSize: '14px',
        },
        counselorMessage: {
            backgroundColor: '#3263ac',
            color: '#ffffff',
            alignSelf: 'flex-start',
        },
        customerMessage: {
            backgroundColor: '#6da7f5',
            color: '#ffffff',
            alignSelf: 'flex-end',
            textAlign: 'right',
        },
        inputContainer: {
            display: 'flex',
            alignItems: 'center',
            padding: '15px 20px',
            backgroundColor: '#ffffff',
            boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
            margin: '0',
        },
        inputField: {
            flex: 1,
            padding: '10px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginRight: '10px',
            outline: 'none',
        },
        sendButton: {
            backgroundColor: '#3263ac',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 20px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        sendButtonHover: {
            backgroundColor: '#26497d',
        },
    };

    return (
        <div style={styles.chatContainer}>
            <div style={styles.header}>
                <h2 style={styles.headerTitle}>1:1 채팅상담</h2>
                <button style={styles.chatButton}
                >상담 종료하기
                </button>
            </div>

            <ul style={styles.messageList}>
                {messages.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.listItem,
                            ...(item.role === 'COUNSELOR' ? styles.counselorMessage : styles.customerMessage),
                        }}
                    >
                        {item.role === 'COUNSELOR' ? (
                            <>
                                <span style={{fontWeight: 'bold'}}>상담사</span>
                                <br/>
                            </>
                        ) : ""}
                        {item.message.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line}
                                <br/>
                            </React.Fragment>
                        ))}
                    </div>
                ))}
            </ul>

            <form
                style={styles.inputContainer}
                onSubmit={(e) => {
                    e.preventDefault(); // 폼 기본 동작(페이지 새로고침) 방지
                    sendMessage(); // 버튼의 onClick과 동일한 동작 실행
                }}
            >
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="메시지를 입력하세요"
                    style={styles.inputField}
                />
                <button style={styles.sendButton} type="submit">
                    입력
                </button>
            </form>
        </div>
    );
}
export default Chat
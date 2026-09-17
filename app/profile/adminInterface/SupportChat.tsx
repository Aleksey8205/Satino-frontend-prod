"use client"

import ReactModal from "react-modal";
import { useEffect, useRef, useState } from "react";
import { SendHorizontal, X } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "@/app/libs/interface";
import "../styles/chat.css";
import { Message } from "../interface/message";

ReactModal.setAppElement("main");

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
  userId: string; 
};

const SupportChat = ({ isOpen = false, onClose = () => {}, userId }: Props) => {
  const user = useSelector((state: RootState) => state.auth);
  const userName = user.user?.name || "Менеджер"; 

  const [messages, setMessages] = useState<Message []>([]); 
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const newSocket = io("http://localhost:3000/chat", { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.emit("join", userId);

    const handleInit = (roomData: any) => {
      setMessages(roomData.messages || []);
    };

    newSocket.on("init", handleInit);

    const handleNewMessage = (newMsg: any) => {
      setMessages((prev) => [...prev, newMsg]);
    };

    newSocket.on("newMessage", handleNewMessage);

    return () => {
      newSocket.off("init", handleInit);
      newSocket.off("newMessage", handleNewMessage);
      newSocket.disconnect();
    };
  }, [isOpen, userId]);

  useEffect(() => {
    if (scrollRef.current ) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const sendMessage = () => {
    const text = inputValue.trim();
    if (!text || !socket) return;

    socket.emit('sendMessage', { roomId: userId, text, author: userName });
    setInputValue("");
  };

  return (
    <ReactModal isOpen={isOpen} onRequestClose={onClose} overlayClassName="chat-overlay" className="support-chat">
      <X className="chat-close-btn" onClick={onClose} size={20} />
      
      <div className="chat-header">
        <h2>Чат с пользователем</h2>
        {!socket && <span>Нет соединения...</span>}
        {socket && <span>Соединение установлено</span>}
      </div>
      
      <div className="chat-message">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg._id} className={`message ${msg.author === userName ? "right" : "left"}`}>
              <p>{msg.author}</p>
              <p>{msg.text}</p>
              <span className="date-send">{formatDate(msg.sentAt)}</span>
            </div>
          ))
        ) : (
          <p>Сообщений нет. Начните диалог!</p>
        )}
        
        <div ref={scrollRef} style={{ float: "left", clear: "both" }} />
        
      </div>
      
      <div className="send-message-block">
        <input
          type="text"
          placeholder="Введите сообщение"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="message-text-send"
        />
        
        <SendHorizontal
          size={20}
          onClick={sendMessage}
        />
        
      </div>
      
    </ReactModal>
  );
};

export default SupportChat;
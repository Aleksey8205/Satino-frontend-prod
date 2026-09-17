"use client";

import ReactModal from "react-modal";
import { useEffect, useRef, useState } from "react";
import { SendHorizontal, X } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../../libs/interface";
import { Message } from "../interface/message";
import "../styles/chat.css";

ReactModal.setAppElement("main");



const ChatClient = () => {
  const user = useSelector((state: RootState) => state.auth);
  const userId = user.user?.id;
  const userName = user.user?.name || "Пользователь";

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const newSocket = io("http://localhost:3000/chat", {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    // Присоединяемся к своей комнате
    newSocket.emit("join", userId);

    // Обрабатываем получение истории
    const handleInit = (roomData: any) => {
      setMessages(roomData.messages || []);
    };

    newSocket.on("init", handleInit);

    // Новые сообщения
    const handleNewMessage = (newMsg: Message) => {
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
    if (scrollRef.current && !isLoading) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const closeChat = () => {
    setIsOpen(false);
    setInputValue("");
  };

  const sendMessage = () => {
    const text = inputValue.trim();
    if (!text || !socket) return;

    socket.emit("sendMessage", { roomId: userId, text, author: userName });
    setInputValue("");
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      <div className="chat-container">
        <button className="btnSubmit" onClick={() => setIsOpen(true)}>
          Напишите нам!
        </button>

        <ReactModal
          isOpen={isOpen}
          onRequestClose={closeChat}
          className="support-chat"
          overlayClassName="chat-overlay"
        >
          <X className="chat-close-btn" onClick={closeChat} size={20} />

          <div className="chat-header">
            <h2 className="chat-caption">Чат с поддержкой</h2>
          </div>

          <div className="chat-message">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message ${msg.author === userName ? "right" : "left"}`}
                >
                  <p>{msg.author}</p>
                  <p>{msg.text}</p>
                  <span className="date-send">{formatDate(msg.sentAt)}</span>
                </div>
              ))
            ) : (
              <p>Сообщений нет. Вы можете начать диалог.</p>
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
              className="send-horizontal"
              onClick={sendMessage}
            />
          </div>
        </ReactModal>
      </div>
    </>
  );
};

export default ChatClient;
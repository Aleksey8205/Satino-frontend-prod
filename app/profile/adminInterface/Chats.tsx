import { useState, useEffect } from "react";
import type { Users } from "../interface/userInerface";
import "../styles/usersProfile.css";
import { CircleUserRound, ShieldUser, Search, Check } from "lucide-react";
import SupportChat from './SupportChat';

type UserWithMessage = {
  user: Users; 
  lastMessage?: {
    text: string; 
    sentAt: Date; 
    author: string;
  } | null; 
};

const Chats = () => {
  const [users, setUsers] = useState<UserWithMessage[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithMessage[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [selectUser, setSelectUser] = useState("");
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    async function userFetch() {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/users",
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    }
    userFetch();
  }, []);

  const handleSearch = (search: string) => {
    const lowerSearch = search.toLowerCase();
    const filtered = users.filter(
      (item) =>
        item.user.name.toLowerCase().includes(lowerSearch) ||
        item.user.email.toLowerCase().includes(lowerSearch)
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    handleSearch(userSearch);
  }, [userSearch, users]);

  if (users.length === 0) {
    return <div>Загрузка информации...</div>;
  }

  const openChat = () => {
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month} ${hours}:${minutes}`;
  };

  return (
    <>
      <div className="users-container">
        <h2>Чаты</h2>
        
        <div className="search">
          <label htmlFor="search">Поиск пользователя:</label>
          <input
            className="input-search"
            id="search"
            placeholder="Введите имя или почту"
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
          <Search className="search-btn" size={30} />
        </div>

        {filteredUsers.map((item) => (
          <div 
            className="user-chat" 
            key={item.user._id} 
            onClick={() => {
              setSelectUser(item.user._id);
              setIsOpen(true);
            }}
          >
            <div className="img-text">
              {item.user.role === "client" && <CircleUserRound size={70} />}
              {item.user.role === "admin" && <ShieldUser size={70} />}
              
              <div>
                <p>{item.user.name}</p>
                <p>{item.lastMessage?.author}</p>
                <p className="last-message">
                  {item.lastMessage?.text || "Нет сообщений"}
                </p>
               
              </div>
            </div>
            <div> 
              {item.lastMessage?.sentAt && (
                    <span className="message-date">
                      {formatDate(item.lastMessage?.sentAt)}
                    </span>
                  )}
                  </div>
          </div>
        ))}

        {/* КОМПОНЕНТ САМОГО ЧАТА */}
        <SupportChat
          userId={selectUser}
          isOpen={isOpen}
          onClose={closeChat}
        />
      </div>
    </>
  );
};

export default Chats;
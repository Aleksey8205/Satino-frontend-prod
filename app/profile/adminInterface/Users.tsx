import { useState, useEffect } from "react";
import type { Users } from "../interface/userInerface"; 
import "../styles/usersProfile.css";
import { UserRound, ShieldUser, Search } from "lucide-react";
import Chats from "./Chats";

type ApiUserResponse = {
  user: Users; 
  lastMessage?: any; 
};

const UsersProfile = () => {
  const [users, setUsers] = useState<ApiUserResponse[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ApiUserResponse[]>([]);
  const [userSearch, setUserSearch] = useState("");

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
      (item) => {
          return (
            item.user.name.toLowerCase().includes(lowerSearch) ||
            item.user.email.toLowerCase().includes(lowerSearch)
          );
      }
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    handleSearch(userSearch);
  }, [userSearch, users]);

  if (users.length === 0) {
    return <div>Загрузка информации...</div>;
  }

  return (
    <>
      <div className="users-container">
        <h2>Пользователи</h2>
        <div className="userHeader">
        </div>

        {filteredUsers.map((item, id) => (
          <div className="user-items" key={id}>
            <p>{item.user.name}</p>
            <p>{item.user.email}</p>
            <p>{item.user.contactPhone}</p>
            {item.user.role === "client" && <UserRound />}
            {item.user.role === "admin" && <ShieldUser />}
          </div>
        ))}
      </div>
      <Chats></Chats>
    </>
  );
};

export default UsersProfile;
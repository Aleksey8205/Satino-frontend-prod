"use client";

import { useSelector } from "react-redux";
import { RootState } from "../../libs/interface";
import Forms from "./Forms";
import ChatClient from "./Chat";

const ProfileClient = () => {
  const user = useSelector((state: RootState) => state.auth);

  return (
    <>
      <div className="profile-container">
        <div className="profile">
          <div className="flex">
            <p className="gray-text">Имя:</p>
            <p className="p-profile">{user.user?.name}</p>
          </div>
          <div className="flex">
            <p className="gray-text">Почта:</p>
            <p className="p-profile">{user.user?.email}</p>
          </div>
          <div className="flex">
            <p className="gray-text">Телефон:</p>
            <p className="p-profile">{user.user?.contactPhone}</p>
          </div>
          <div className="flex">
            <p className="gray-text">Роль</p>
            <p className="p-profile">
              {user.user?.role === "client" ? "Клиент" : ""}
            </p>
          </div>
        </div>
        <ChatClient />

        <Forms />
      </div>
    </>
  );
};

export default ProfileClient;

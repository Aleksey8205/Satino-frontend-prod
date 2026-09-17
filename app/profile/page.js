'use client'

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileAdmin from "./adminInterface/ProfileAdmin";
import ProfileClient from "./clientInterface/ProfileClient";
import "./styles/profile.css";
import {loginSuccess, loginError} from "../libs/slices/authSlice"


const Profile = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/check-user", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка сети: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.email && data.id) {
          dispatch(loginSuccess(data));
        } else {
          dispatch(loginError("Ошибка входа"));
        }
      })
      .catch((error) => {
        dispatch(loginError("Ошибка входа: " + error.message));
      });
  }, []);

  const userState = useSelector((state) => state.auth);

  const isAuthenticated = userState.authentificated && userState.user;

  return (
    <div className="profile-cont">
      {!isAuthenticated ? (
        <div>Не авторизован</div>
      ) : (
        <div>
          {userState.user.role === "admin" && <ProfileAdmin />}
          {userState.user.role === "client" && <ProfileClient />}
        </div>
      )}
    </div>
  );
};

export default Profile;
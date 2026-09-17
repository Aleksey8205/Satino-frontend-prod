"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, loginError } from "./slices/authSlice";

const AuthCheck = ({ children }) => {
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

  return <>{children}</>;
};

export default AuthCheck;
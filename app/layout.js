"use client";

import "./globals.css";
import { Provider } from "react-redux";
import store from "./libs/store";
import HeaderFunc from "./components/Header";
import FooterFunc from "./components/Footer";
import AuthCheck from "./libs/authCheck";

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
      <script
        src="https://api-maps.yandex.ru/2.1/?lang=ru_RU"
        defer
        type="text/javascript"
      ></script>
        </head >
      <body>
        <Provider store={store}>
          <AuthCheck>
            <HeaderFunc />
            <main>{children}</main>
            <FooterFunc />
          </AuthCheck>
        </Provider>
      </body>
      
    </html>
  );
}

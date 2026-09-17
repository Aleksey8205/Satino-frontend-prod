import Link from "next/link";
import "./styles/styleHeader.css";
import { Auth } from "./AuthRegister";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../libs/slices/authSlice";
import { RootState } from "../libs/interface";


const HeaderFunc = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);

  const Logout = () => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Logout failed");
        }
      })
      .then(() => {
        dispatch(logout());
        location.reload();
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  // if(window.innerWidth) {
  //   console.log(window.innerWidth)
  // }



  return (
    <>
      <header className="header">
        <nav className="nav">
          <ul className="header_navigation">
            <li className="link-item">
              <Link className="link" href="/">
                Главная
              </Link>
            </li>
            <li className="link-item">
              <Link className="link" href="/about">
                О храме
              </Link>
            </li>
            <li className="link-item">
              <Link className="link" href="/sundaySchool">
                Воскресная Школа
              </Link>
            </li>
            <li className="link-item">
              <Link className="link" href="/pilgrimage">
                Паломничество
              </Link>
            </li>
            <li className="link-item">
              <Link className="link" href="/allnews">
                Все новости
              </Link>
            </li>
            <li className="link-item">
              <Link className="link" href="/contact">
                Контакты
              </Link>
            </li>
            <li className="link-item">
              <Link className="link" href="/galery">
                Фотогалерея
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      {!authState.authentificated ? (
        <Auth />
      ) : (
        <div className="header auth">
          <ul className="header_navigation">
            <li className="link-item">
              <a className="link" onClick={Logout}>
                Выход
              </a>
            </li>
            <li className="link-item">
              <Link 
              href={'/profile'}
              className="link">
                Профиль
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default HeaderFunc;

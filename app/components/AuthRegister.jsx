import  { useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../libs/slices/authSlice";

Modal.setAppElement("main");

export const Auth = () => {
  const dispatch = useDispatch();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [name, setName] = useState("");
  const [mail, setEmail] = useState("");
  const [contactPhone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordDouble, setPasswordDouble] = useState("");

  const [message, setMessage] = useState("");

  const handleCloseModals = () => {
    setShowAuthModal(false);
    setShowRegisterModal(false);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = mail.toLowerCase()
    const userLogin = {
      email,
      password,
    };
    fetch(process.env.NEXT_PUBLIC_API_URL + '/api/auth/login', {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userLogin),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 400 || !response.ok) {
          setMessage(response.message);
          return response.json().then((data) => {
            throw new Error(data.message || `Ошибка ${response.status}`);
          });
        }
      })
      .then((result) => {
        dispatch(loginSuccess(result.data));
        console.log(result)
        setShowAuthModal(false);
      })
      .catch((error) => {
        setMessage(error.message);
      });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const email = mail.toLowerCase()
    if (password === passwordDouble) {
      const userData = {
        name,
        email,
        contactPhone,
        password,
      };
      fetch(process.env.NEXT_PUBLIC_API_URL + `/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else if (response.status === 400 || !response.ok) {
            setMessage(response.message);
            return response.json().then((data) => {
              throw new Error(data.message || `Ошибка ${response.status}`);
            });
          }
        })
        .then((result) => {
          setMessage(result.message);
        })
        .catch((error) => {
          setMessage(error.message);
        });
    } else {
      setMessage("Пароли не совпадают");
    }
  };


  const handleYandexLogin = () => {
    window.location.href = process.env.NEXT_PUBLIC_API_URL + '/api/auth/login-yandex';
  }

  return (
    <div className="header auth">
      <ul className="header_navigation">
        <li className="link-item">
          <a href="#" className="link" onClick={() => setShowAuthModal(true)}>
            Вход
          </a>
        </li>
        <li className="link-item">
          <a
            href="#"
            className="link"
            onClick={() => setShowRegisterModal(true)}
          >
            Регистрация
          </a>
        </li>
      </ul>

      <Modal
        isOpen={showAuthModal}
        onRequestClose={handleCloseModals}
        className="modal__content"
        overlayClassName="modal__overlay"
      >
        <div className="close" onClick={handleCloseModals}>
          <span className="cross-icon"> </span>
        </div>
        <form className="form" onSubmit={handleLogin}>
          <h2 className="">Авторизация</h2>
          <div className="block-form">
            <p>Почта</p>
            <input
              className="input-form"
              type="text"
              placeholder="Ivanov@mail.ru"
              value={mail}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p>Пароль:</p>
            <input
              className="input-form"
              type="password"
              placeholder="Введите пароль"
              value={password}
              required={true}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="submit">Войти</button>
        </form>

        <button onClick={handleYandexLogin} className="btn-yandex-signin">
            Войти с помощью Яндекс ID
          </button>
          <p style={{ marginTop: "15px", color: "red" }}>{message}</p>
      </Modal>

      <Modal
        isOpen={showRegisterModal}
        onRequestClose={handleCloseModals}
        className="modal__content"
        overlayClassName="modal__overlay"
      >
        <div className="close" onClick={handleCloseModals}>
          <span className="cross-icon"></span>
        </div>
        <form className="form" onSubmit={handleRegister}>
          <h2>Регистрация</h2>
          <div className="block-form">
            <p>Имя:</p>
            <input
              className="input-form"
              type="text"
              placeholder="Введите ФИО"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <p>Почта:</p>
            <input
              className="input-form"
              type="email"
              placeholder="Введите почту"
              value={mail}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p>Телефон:</p>
            <input
              className="input-form"
              type="text"
              placeholder="Введите телефон"
              value={contactPhone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <p>Пароль:</p>
            <input
              className="input-form"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={true}
            />
            <p>Подтверждение пароля:</p>
            <input
              className="input-form"
              type="password"
              placeholder="Подтвердите пароль"
              value={passwordDouble}
              onChange={(e) => setPasswordDouble(e.target.value)}
              required={true}
            />
          </div>
          <button className="submit">Зарегистрироваться</button>
          <p style={{ marginTop: "15px", color: "red" }}>{message}</p>
        </form>
      </Modal>
    </div>
  );
};

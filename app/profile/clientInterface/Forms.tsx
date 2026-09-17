import { useState } from "react";
import { RootState } from "./../../libs/interface";
import { useSelector } from "react-redux";

const Forms = () => {
  const user = useSelector((state: RootState) => state.auth);

  const [nameZdrav, setNameZdrav] = useState("");
  const [nameUpok, setNameUpok] = useState("");
  const [message, setMessage] = useState("");

  const userId = user.user?.id;

  const handleZdrav = async (e: any) => {
    e.preventDefault()
    try {
      const textPrayer = "За здравие";
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/api/prayer`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            textPrayer: textPrayer,
            prayerName: nameZdrav,
            // будет оплата
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setNameZdrav("");
      } else {
        setMessage("Ошибка на стороне сервера");
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      setMessage("Произошла сетевая ошибка. Попробуйте позже.");
    }
  };

  const handleUpok = async (e: any) => {
    e.preventDefault()
    try {
      const textPrayer = "За упокой";
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/api/prayer`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.user?.id,
            textPrayer: textPrayer,
            prayerName: nameUpok,
            // будет оплата
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setNameUpok("");
      } else {
        setMessage("Ошибка на стороне сервера");
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      setMessage("Произошла сетевая ошибка. Попробуйте позже.");
    }
  };

  return (
    <>
      <div className="flex">
        <form onSubmit={handleZdrav} className="create">
          <h3>Форма за здравие</h3>
          <label htmlFor="zdrav">
            <p className="text-form">Введите Имя</p>
          </label>
          <input
            id="zdrav"
            className="input-create"
            type="text"
            value={nameZdrav}
            onChange={(e) => setNameZdrav(e.target.value)}
          />
          <button className="btnSubmit">Заказать</button>
        </form>
        <form onSubmit={handleUpok} className="create">
          <h3>Форма за упокой</h3>
          <label htmlFor="upok">
            <p className="text-form">Введите Имя</p>
          </label>
          <input
            id="upok"
            className="input-create"
            type="text"
            value={nameUpok}
            onChange={(e) => setNameUpok(e.target.value)}
          />
          <button className="btnSubmit">Заказать</button>
          <p>{message}</p>
        </form>
      </div>
    </>
  );
};

export default Forms;

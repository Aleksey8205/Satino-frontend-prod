"use client";
import React, { useEffect, useState } from "react";
import { PrayerInterface } from "../interface/prayerInterface";
import "../styles/prayer.css";

const Prayer = () => {
  const [prayers, setPrayers] = useState<PrayerInterface[]>([]);
  const [message, setMessage] = useState("");

  async function prayerFetch() {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/api/prayer`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setPrayers(data);
      } else {
        setMessage("Ошибка на стороне сервера");
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      setMessage("Произошла сетевая ошибка. Попробуйте позже.");
    }
  }

  useEffect(() => {
    prayerFetch();
  }, []);

  const sortPrayersByStatus = (prayersList: PrayerInterface[]) => {
    const activePrayers = prayersList.filter((p) => p.isActive);
    const inactivePrayers = prayersList.filter((p) => !p.isActive);
    return [...activePrayers, ...inactivePrayers];
  };

  const sortedHealthPrayers = React.useMemo(
    () => {
      const healthList = prayers.filter((p) => p.textPrayer === "За здравие");
      return sortPrayersByStatus(healthList);
    },
    [prayers]
  );

  const sortedRestPrayers = React.useMemo(
    () => {
      const restList = prayers.filter((p) => p.textPrayer === "За упокой");
      return sortPrayersByStatus(restList);
    },
    [prayers]
  );

  const handleSuccess = async (id: string) => {
    const updatedPrayers = prayers.map((p) =>
      p.id === id ? { ...p, isActive: false } : p
    );

    setPrayers(updatedPrayers);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/api/prayer/${id}`,
        {
          credentials: "include",
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: false,
          }),
        }
      );

      if (!response.ok) {
        console.error("Ошибка сервера");
        setMessage("Ошибка на стороне сервера. Попробуйте еще раз.");
        setPrayers(prayers); 
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      setMessage("Произошла сетевая ошибка. Попробуйте позже.");
      setPrayers(prayers);
    }
  };


  return (
    <>
      <h2>Записки</h2>
    <p>{message}</p>
      <div className="container-prayer">
        <div className="prayer-container">
          <div className="column">
            <h3>За здравие</h3>
            {sortedHealthPrayers.map((prayer) => (
              <div
                key={prayer.id}
                className={`prayer-item ${
                  prayer.isActive ? "" : "prayer-item_inactive"
                }`}
              >
                <p>Имя пользователя: {prayer.userName}</p>
                <p>Телефон: {prayer.userPhone}</p>
                <p>Молитва: {prayer.prayerName}</p>
                {prayer.isActive && (
                  <button
                    className="btnSubmit"
                    onClick={() => handleSuccess(prayer.id)}
                  >
                    Выполнено
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="column">
            <h3>За упокой</h3>
            {sortedRestPrayers.map((prayer) => (
              <div
                key={prayer.id}
                className={`prayer-item ${
                  prayer.isActive ? "" : "prayer-item_inactive"
                }`}
              >
                <p>Имя пользователя: {prayer.userName}</p>
                <p>Телефон: {prayer.userPhone}</p>
                <p>Молитва: {prayer.prayerName}</p>
                {prayer.isActive && (
                  <button
                    className="btnSubmit"
                    onClick={() => handleSuccess(prayer.id)}
                  >
                    Выполнено
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Prayer;
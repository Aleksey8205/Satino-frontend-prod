"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/form-create.css";

const FormCreatePilgrimage = () => {
  // 1. Типы изменены на Date | null
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const [startTime, setStartTime] = useState("15:00");
  const [endTime, setEndTime] = useState("18:00");

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const safeSetDate = (
    setter: React.Dispatch<React.SetStateAction<Date | null>>,
    date: unknown
  ) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      setter(date);
    } else {
      setter(null);
    }
  };

  const buildISOString = (
    date: Date | null,
    timeString: string
  ): string | undefined => {
    if (!date) return undefined;

    const [hours, minutes] = timeString.split(":");
    const isoDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      Number(hours),
      Number(minutes)
    );
    return isoDate.toISOString();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Проверка обязательных полей перед отправкой
    if (!startDate || !endDate || !title.trim()) {
      setMessage("Пожалуйста, заполните все обязательные поля.");
      return;
    }

    const isoStart = buildISOString(startDate, startTime);
    const isoEnd = buildISOString(endDate, endTime);

    if (!isoStart || !isoEnd) {
      setMessage("Ошибка формирования дат.");
      return;
    }

    console.log(isoStart);
    console.log(isoEnd);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pilgrimage`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            message: message.trim(), // Отправляем описание
            start: isoStart,
            end: isoEnd,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || "Событие успешно создано!");

        // Сброс формы к начальным значениям
        setTitle("");
        setMessage("");
        setStartDate(new Date());
        setEndDate(new Date());
        setStartTime("15:00");
        setEndTime("18:00");
      } else {
        const errorData = await response.text();
        throw new Error(`Ошибка сервера (${response.status}): ${errorData}`);
      }
    } catch (error) {
      console.error("Не удалось отправить данные:", error);
      setMessage((error as Error).message || "Неизвестная ошибка сети");
    }
  };

  return (
    <form className="create-pilgrimage" onSubmit={handleSubmit}>
      <div
        className="calendar-container"
        style={{ display: "flex", gap: "20px", marginBottom: "15px" }}
      >
        {/* Блок для даты и времени начала */}
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Дата начала
          </label>
          <Calendar
            value={startDate}
            // 2. Используем безопасную установку через замыкание
            onChange={(date) => safeSetDate(setStartDate, date)}
            locale="ru-RU"
            minDetail="month" // Рекомендуемое ограничение, чтобы не выбирать века
          />
          <label
            style={{ display: "block", marginTop: "10px", marginBottom: "5px" }}
          >
            Время начала
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Дата окончания
          </label>
          <Calendar
            onChange={(date) => safeSetDate(setEndDate, date)}
            value={endDate}
            locale="ru-RU"
            minDetail="month"
          />
          <label
            style={{ display: "block", marginTop: "10px", marginBottom: "5px" }}
          >
            Время окончания
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>

      {/* 3. Поле описания заменено на textarea и привязано к верному состоянию */}
      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="description"
          style={{ display: "block", marginBottom: "5px" }}
        >
          Описание паломничества
        </label>
        <textarea
          className="input-create"
          id="description"
          value={message}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setMessage(e.target.value)
          }
          placeholder="Расскажите о цели поездки, маршруте и условиях..."
          rows={4}
          required
        />
      </div>

      {/* Название лучше оставить отдельным коротким полем */}
      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="title"
          style={{ display: "block", marginBottom: "5px" }}
        >
          Название события *
        </label>
        <input
          className="input-create"
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Например: Паломничество в Дивеево"
          required
        />
      </div>

      <button type="submit" className="btnSubmit">
        Создать событие
      </button>

      {/* Отображение сообщений об успехе или ошибках */}
      {message && (
        <p
          style={{
            marginTop: "15px",
            color: message.includes("Ошибка") ? "#d32f2f" : "#388e3c",
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default FormCreatePilgrimage;

import { useState } from "react";
import "../styles/createShedule.css";

const CreateShedule = () => {
  const [event, setEvent] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("")

  const handleCreate = async (e: any) => {
    e.preventDefault();
  
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/event/create", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event,
          date,
          description,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage("Событие успешно опубликовано!");
        setEvent("");
        setDate("");
        setDescription("");
      } else {
        setMessage( "Ошибка на стороне сервера");
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      setMessage("Произошла сетевая ошибка. Попробуйте позже.");
    }
  };

  return (
    <>
      <form onSubmit={handleCreate} className="create">
        <h2 className="caption-create">Создать расписание храма</h2>
        <div>
          <label htmlFor="event">
            <p className="text-form">Событие:</p>
          </label>
          <input
            type="text"
            id="event"
            className="input-create"
            placeholder="Событие"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="date">
            <p className="text-form">Дата и время (текстом):</p>
          </label>
          <input
            type="text"
            id="date"
            className="input-create"
            placeholder="Дата и время (текстом)"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">
            <p className="text-form">Описание:</p>
          </label>
          <textarea
            name=""
            id="description"
            className="create-decription-post"
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <div className="form-submit">
            <button className="btnSubmit">Создать дату</button>
             <p>{message}</p> 
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateShedule;

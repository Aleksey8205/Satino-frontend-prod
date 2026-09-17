import { useState, useEffect } from "react";
import type { Event } from "./interface/EventInterface";
import "./styles/event.css";
import { useSelector } from "react-redux";
import { RootState } from "./../libs/interface";
import { PencilLine, X } from "lucide-react";
import ReactModal from "react-modal";

ReactModal.setAppElement("main");

const ShedulePlain = () => {
  const [events, setEvent] = useState<Event[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event>();

  const [event, setEventUpdate] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const user = useSelector((state: RootState) => state.auth);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/event",
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setEvent(data);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCloseModals = () => {
    setModalOpen(false);
    setMessage("");
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/api/event/${id}`,
        {
          credentials: "include",
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event,
            date,
            description,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        fetchEvents();
      } else {
        setMessage("Ошибка на стороне сервера");
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      setMessage("Произошла сетевая ошибка. Попробуйте позже.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
     const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/event/${id}`, {
        credentials: "include",
        method: "DELETE"
      })

      const data = await response.json()
      if(response.ok) {
        console.log("Удалено")
        fetchEvents()
      } else {
        console.log("ошибка удаления")
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
    }
  };

  return (
    <>
      <h2>
        Расписание Богослужений в храме Вознесения Господня в Сатино-Русском
      </h2>
      {events && events.length > 0 ? (
        <div className="event-container">
          {events.map((evt, id) => (
            <div className="event-item" key={id}>
              <div>
                <h3 className="event-caption">{evt.event}</h3>
                <p className="event-date">{evt.date}</p>
                <p className="event-description">{evt.description}</p>
              </div>
              {user && user.user?.role === "admin" && (
                <>
                  <div className="update-flex">
                  <X className="delete"
                  onClick={() => {
                    handleDelete(evt._id)
                  }}
                  ></X>
                    <PencilLine
                      onClick={() => {
                        setSelectedEvent(evt);
                        setModalOpen(true);
                        setEventUpdate(evt.event);
                        setDate(evt.date);
                        setDescription(evt.description);
                      }}
                      className="edit-pencil"
                    />
                    
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>Загрузка...</div>
      )}

      <ReactModal
        isOpen={modalOpen}
        onRequestClose={handleCloseModals}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        {selectedEvent ? (
          <>
            <div className="modal-close-btn" onClick={handleCloseModals}>
              <X className="x-icon" />
            </div>

            <div className="update-event">
              <h2 className="caption-create">Изменить запись</h2>
              <div>
                <label htmlFor="event">
                  <p className="text-form">Событие:</p>
                </label>
                <input
                  type="text"
                  id="event"
                  className="input-update"
                  placeholder="Событие"
                  value={event}
                  onChange={(e) => setEventUpdate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="date">
                  <p className="text-form">Дата и время (текстом):</p>
                </label>
                <input
                  type="text"
                  id="date"
                  className="input-update"
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
                  className="update-decription-post"
                  placeholder="Описание"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <div className="form-submit">
                  <button
                    className="btnSubmit"
                    onClick={() => handleUpdate(selectedEvent._id)}
                  >
                    Изменить запись
                  </button>
                  <p>{message}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Загрузка...</p>
        )}
      </ReactModal>
    </>
  );
};

export default ShedulePlain;

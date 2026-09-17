"use client"
import React, { useState, useEffect } from "react";
import "./styles/newsHome.css";
import Modal from "react-modal";
import { X, Eye } from "lucide-react";
import { incrementVision } from "./functions/CountVision";

Modal.setAppElement("main");


const NewsHome = () => {
  const [newsData, setNewsData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/news/latest");
        const data = await response.json();
        setNewsData(data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    }
    fetchNews();
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <h2 className="caption-news">Актуальные события:</h2>
      <div className="card-container">
        {newsData.length > 0 ? (
          newsData.map((item, index) => (
            <div className="news-card" key={index}>
              {item.video ? (
                  <div
                    className="video-container"
                    dangerouslySetInnerHTML={{ __html: item.video }}
                  />
                ) : (
                  <img className="img-news" src={item.coverImage} alt="" />
                )}
              <h3 className="caption-desc">{item.title}</h3>
              <p className="text-desc">{item.description}</p>
              <div className="count-and-date">
                <div className="count-vision">
              <Eye></Eye>
              <p>{item.countVision}</p>
              </div>
              <p className="date">
                Дата публикации:
                {new Intl.DateTimeFormat("ru-Ru", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }).format(new Date(item.publishDate))}
              </p>
              </div>
              <button className="btnDesc" onClick={async () =>  {
                await incrementVision(item._id)
                openModal(item)
              }
              }>
                Подробнее
              </button>
                
            </div>
          ))
        ) : (
          <p>Загрузка новостей...</p>
        )}
      </div>

      <Modal
        overlayClassName="modal-overlay"
        className="modal-content"
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Подробнее"
      >
        {selectedItem && (
          <>
            <button className="modal-close-btn" onClick={closeModal}>
              <X className="x-icon" />
            </button>
            <div className="modal-description">
              <h2 className="modalCaption">{selectedItem.title}</h2>
              <p className="modal-text">{selectedItem.description}</p>
              <p className="date">
                Дата публикации:
                {new Intl.DateTimeFormat("ru-Ru", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }).format(new Date(selectedItem.publishDate))}
              </p>
              <div className="img-container-news">
                {selectedItem.files &&
                  selectedItem.files.map((file, index) => (
                    <img
                    className="image-news-min"
                      key={index}
                      src={`${file}`}
                      alt={`Дополнительное изображение ${index}`}
                      
                    />
                  ))}
              </div>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default NewsHome;

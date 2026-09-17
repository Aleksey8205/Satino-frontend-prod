"use client";

import React, { useState, useEffect } from "react";
import "../components/styles/newsHome.css";
import "../profile/styles/profile.css";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import { incrementVision } from "../components/functions/CountVision"

import { X, Eye } from "lucide-react";

Modal.setAppElement("main");

const AllNews = () => {
  const [newsData, setNewsData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  // const [selectUpdate, setSelectUpdate] = useState(null);
  // const [updateModalOpen, setUpdateModalOpen] = useState(false);

  // const [newsTitle, setNewsTitle] = useState("");
  // const [newsMainFile, setNewsMainFile] = useState(null);
  // const [newsGalleryFiles, setNewsGalleryFiles] = useState([]);
  // const [newsDescription, setNewsDescription] = useState("");
  // const [urlVideo, setUrlVideo] = useState("");
  // const [message, setMessage] = useState("");

  const user = useSelector((state) => state.auth);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/news/all"
        );
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
    setUpdateModalOpen(false)
  };

  // const updateNewsModal = (item) => {
  //   setSelectUpdate(item);
  //   setUpdateModalOpen(true);
  // };

  const deleteNews = async (idx) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/news/delete/${idx}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok || response.status === 204) {
        const updatedResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/news/all`
        );
        const updatedData = await updatedResponse.json();
        setNewsData(updatedData);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // const handleSubmitNews = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("title", newsTitle);
  //   formData.append("description", newsDescription);
  //   if (newsMainFile) {
  //     formData.append("coverImage", newsMainFile, newsMainFile.name);
  //   }
  //   formData.append("video", urlVideo);
  //   newsGalleryFiles.forEach((file, index) => {
  //     formData.append(`files[]`, file, file.name);
  //   });

  //   fetch(process.env.NEXT_PUBLIC_API_URL + "/api/news/create", {
  //     credentials: "include",
  //     method: "POST",
  //     "Content-Type": "multipart/fomr-data",
  //     body: formData,
  //   })
  //     .then((response) => {
  //       if (response.ok) {
  //         setMessage("Запись успешно добавлена!");
  //         setNewsDescription("");
  //         setNewsTitle("");
  //         setUrlVideo("");
  //         setNewsMainFile(null);
  //         setNewsGalleryFiles([]);
  //         return response.json();
  //       } else if (response.status === 400 || !response.ok) {
  //         setMessage("ошибка сервера");
  //       }
  //     })
  //     .catch((error) => {
  //       setMessage(error.message);
  //     });
  // };

  const updateNews = async (idx) => {};

  return (
    <>
      <div className="container">
        <div className="card-container">
          {newsData.length > 0 ? (
            newsData.map((item, index) => (
              <div className="news-card" key={index}>
                {" "}
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
                  }}>
                  Подробнее
                </button>
                {user && user.user?.role === "admin" && (
                  <>
                    {/* <button
                      className="btnDesc"
                      onClick={() => updateNewsModal(item)}
                    >
                      Редактировать
                    </button> */}
                    <button
                      className="btnDesc"
                      style={{ color: "#FF0000" }}
                      onClick={() => deleteNews(item._id)}
                    >
                      Удалить
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>Загрузка новостей...</p>
          )}
        </div>

        {/* <Modal
          overlayClassName="modal-overlay"
          className="modal-content"
          isOpen={updateModalOpen}
          onRequestClose={closeModal}
          contentLabel="Редактировать"
        >
          {selectUpdate && (
            <>
              <div>
                <button className="modal-close-btn" onClick={closeModal}>
                  <X className="x-icon" />
                </button>
                <div className="modal-update">
                  <form onSubmit={handleSubmitNews} className="modal-update-form">
                    <h2>Создать новостную запись</h2>
                    <label htmlFor="news-title">
                      <p>Заголовок</p>
                    </label>
                    <input
                      required
                      type="text"
                      className="input-create"
                      name="news-title"
                      id="news-title"
                      value={selectUpdate.title}
                      onChange={(e) => setNewsTitle(e.target.value)}
                    />

                    <div className="flex">
                      <div>
                        <label htmlFor="news-main-file">
                          <div className="flex-file">
                            <p>Главное фото или видео </p>
                            <Paperclip size={24} />
                          </div>
                        </label>
                        <input
                          className="file"
                          type="file"
                          name="news-main-file"
                          id="news-main-file"
                          onChange={(e) => {
                            setNewsMainFile(
                              e.target.files ? e.target.files[0] : null
                            );
                          }}
                        />
                        {!newsMainFile ? (
                          <p></p>
                        ) : (
                          <p>Загружено: {newsMainFile?.name}</p>
                        )}
                        <label htmlFor="urlVideo">
                          Адрес плеера (если видео)
                        </label>
                        <input
                          type="text"
                          className="input-create url"
                          name="urlVideo"
                          id="urlVideo"
                          value={selectUpdate.video}
                          onChange={(e) => setUrlVideo(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="news-gallery-files">
                          <div className="flex-file">
                            <p>Загрузка галереи файлов</p>
                            <Paperclip size={24} />
                          </div>
                        </label>
                        <input
                          className="file"
                          type="file"
                          id="news-gallery-files"
                          multiple
                          accept="image/*"
                          onChange={(e) =>
                            setNewsGalleryFiles(
                              Array.from(e.target.files || [])
                            )
                          }
                        />
                        {newsGalleryFiles && newsGalleryFiles.length > 0 ? (
                          <p>
                            Загружено:{" "}
                            {newsGalleryFiles
                              ?.map((file) => file.name)
                              ?.join(", ") ?? ""}
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <label htmlFor="news-description">
                      <p>Описание</p>
                    </label>
                    <textarea
                      className="create-decription-post"
                      name="news-description"
                      id="news-description"
                      value={selectUpdate.description}
                      onChange={(e) => setNewsDescription(e.target.value)}
                      required
                    ></textarea>
                    <div className="form-submit">
                      <button className="btnSubmit" type="submit">
                        Отправить новость
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </Modal> */}

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
                  {new Intl.DateTimeFormat("ru-RU", {
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
      </div>
    </>
  );
};

export default AllNews;

"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Paperclip } from "lucide-react";
import UsersProfile from './Users';
import CreateShedule from './CreateShedule';
import Prayer from './Prayer';

const ProfileAdmin = () => {
  const user = useSelector((state) => state.auth);

  const [newsTitle, setNewsTitle] = useState("");
  const [newsMainFile, setNewsMainFile] = useState(null);
  const [newsGalleryFiles, setNewsGalleryFiles] = useState([]);
  const [newsDescription, setNewsDescription] = useState("");
  const [urlVideo, setUrlVideo] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmitNews = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newsTitle);
    formData.append("description", newsDescription);
    if (newsMainFile) {
      formData.append("coverImage", newsMainFile, newsMainFile.name);
    }
    formData.append("video", urlVideo)
    newsGalleryFiles.forEach((file, index) => {
      formData.append(`files[]`, file, file.name);
    });

    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/news/create", {
      credentials: "include",
      method: "POST",
      "Content-Type": "multipart/fomr-data",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          setMessage("Запись успешно добавлена!");
          setNewsDescription('')
          setNewsTitle('')
          setUrlVideo("")
          setNewsMainFile(null)
          setNewsGalleryFiles([])
          return response.json();
        } else if (response.status === 400 || !response.ok) {
          setMessage("ошибка сервера");
        }
      })
      .catch((error) => {
        setMessage(error.message);
      });
  };

  return (
    <>
      {user && user.user.role === "admin" && (
        <>
          <div className="profile-container">
            <div className="profile">
              <div className="flex">
                <p className="gray-text">Имя:</p>
                <p className="p-profile">{user.user.name}</p>
              </div>
              <div className="flex">
                <p className="gray-text">Почта:</p>
                <p className="p-profile">{user.user.email}</p>
              </div>
              <div className="flex">
                <p className="gray-text">Телефон:</p>
                <p className="p-profile">{user.user.contactPhone}</p>
              </div>
              <div className="flex">
                <p className="gray-text">Роль</p>
                <p className="p-profile">
                  {user.user.role === "admin" ? "Администратор" : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="flex">
            <form onSubmit={handleSubmitNews} className="create">
              <h2>Создать новостную запись</h2>
              <label htmlFor="news-title">
                <p className="text-form">Заголовок:</p>
              </label>
              <input
                required
                type="text"
                className="input-create"
                name="news-title"
                id="news-title"
                value={newsTitle}
                placeholder="Заголовок новости"
                onChange={(e) => setNewsTitle(e.target.value)}
              />

              <div className="">
                <div>
                  <label htmlFor="news-main-file">
                    <div className="flex-file">
                    <p className="text-form">
                      Главное фото или видео{" "}
                    </p>
                    <Paperclip size={27} />
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
                    <></>
                  ) : (
                    <p>Загружено: {newsMainFile?.name}</p>
                  )}
                  <label htmlFor="urlVideo"><p className="text-form">Адрес плеера (если видео)</p></label>
                  <input type="text" 
                  className="input-create url"
                  name="urlVideo" 
                  id="urlVideo" 
                  placeholder="Код для вставки"
                  value={urlVideo}
                  onChange={(e) => setUrlVideo(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="news-gallery-files">
                    <div className="flex-file">
                    <p className="text-form">
                      Загрузка галереи файлов
                    </p>
                    <Paperclip size={27} />
                    </div>
                  </label>
                  <input
                    className="file"
                    type="file"
                    id="news-gallery-files"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setNewsGalleryFiles(Array.from(e.target.files || []))
                    }
                  />
                  {newsGalleryFiles && newsGalleryFiles.length > 0 ? (
                    <p>
                      Загружено:{" "}
                      {newsGalleryFiles?.map((file) => file.name)?.join(", ") ??
                        ""}
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <label htmlFor="news-description">
                <p className="text-form">Описание:</p>
              </label>
              <textarea
                className="create-decription-post"
                name="news-description"
                id="news-description"
                value={newsDescription}
                onChange={(e) => setNewsDescription(e.target.value)}
                required
              ></textarea>
              <div className="form-submit">
              <button className="btnSubmit" type="submit">Отправить новость</button>
              <p>{message}</p>
              </div>
            </form>
           <CreateShedule></CreateShedule>
          </div>
          <UsersProfile></UsersProfile>
          <Prayer></Prayer>
        </>
      )}
    </>
  );
};

export default ProfileAdmin;

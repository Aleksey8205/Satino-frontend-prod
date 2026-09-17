"use client";

import { useEffect, useState } from "react";
import { Images } from "./interface/interface";
import ReactModal from "react-modal";
import "./styles/galery.css";
import { X } from "lucide-react";

ReactModal.setAppElement("main");

const Galery = () => {
  const [images, setImages] = useState<Images[]>([]);
  const [selectedImage, setSelectedImage] = useState<string >('');
  const [isOpen, setIsOpen] = useState(false);

  const openImage = (item: string) => {
    if (typeof window !== 'undefined' && window.innerWidth < 600) {
      return; 
    }
    setIsOpen(true);
    setSelectedImage(item);
  };

  const close = () => {
    setIsOpen(false);
    setSelectedImage("");
  };

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/news/images"
        );
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    }
    fetchImages();
  }, []);

  const combinedFiles = images.map((item) => item.files).flat();

  return (
    <>
      <div className="galery-container">
        {combinedFiles.length > 0 ? (
          combinedFiles.map((item) => (
            <img
              src={item}
              className="galery-image"
              key={item}
              alt="фотогалерея"
              // loading="lazy"
              onClick={() => openImage(item)}
              // aria-label={`Открыть изображение ${index + 1}`}
            />
          ))
        ) : (
          <p>Загрузка данных</p>
        )}
      </div>

      <ReactModal
        isOpen={isOpen}
        onRequestClose={close}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button className="modal-close-btn" onClick={close}>
                <X className="x-icon" />
              </button>
        <div className="modal-content-galery">
          <img className="image-modal" src={selectedImage} alt="" />
        </div>
      </ReactModal>
    </>
  );
};

export default Galery;

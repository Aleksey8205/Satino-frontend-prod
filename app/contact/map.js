"use client";

import React, { useEffect, useRef } from "react";

const Map = () => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const initMap = () => {
      if (!ymaps || !mapContainer.current) return;
      if (mapInstance.current) return;

      const myMap = new ymaps.Map(mapContainer.current, {
        center: [55.375907, 37.355285],
        zoom: 14,
      });

      const myPlacemark = new ymaps.Placemark(
        [55.375907, 37.355285],
        {
          hintContent: "Вознесенская церковь",
        },
        {
          iconLayout: "default#image",
          iconImageSize: [35, 35],
          iconImageOffset: [-15, -30],
        }
      );

      myMap.geoObjects.add(myPlacemark);
      mapInstance.current = myMap;
    };

    if (window.ymaps) {
      initMap();
    } else {
      // Иначе ждём загрузки API
      window.addEventListener("load", initMap);
    }

    // Очистка при размонтировании компонента
    return () => {
      window.removeEventListener("load", initMap);
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, []);

  return <div className="mapsYandex" ref={mapContainer} />;
};

export default Map;
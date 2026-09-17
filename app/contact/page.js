import React from "react";
import Map from "./map.js";
import "./styles/contact.css";

const Contact = () => {
  return (
    <>
      <div className="contact">
        <div className="contact_text_item">
          <p>
            <b>Адрес:</b> 108827, город Москва, поселение Краснопахорское, деревня
            Сатино-Русское, дом 60
          </p>
          <p><b>Телефон:</b> 8 (916) 985 64 19</p>
          <p><b>E-mail:</b> abbat05@mail.ru</p>
          <p>Храм открыт ежедневно:</p>
          <p><b>-</b> в будние дни с 9.00 до 15.00;</p>
          <p><b>-</b> в субботу с 9.00 до окончания вечернего богослужения;</p>
          <p><b>-</b> в воскресенье с 8.00 до 17.00.</p>
        </div>
        <Map />
      </div>
    </>
  );
};

export default Contact;

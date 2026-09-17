"use client";

import NewsHome from "./components/newsHome";
import Calendar from "./components/FetchCalendar";
import ShedulePlain from "./components/ShedulePlain";

const Home = () => {

  return (
    <>
      <div className="image_home">
        <h1 className="caption">
          Храм вознесения господня в сатино-русское<br></br> города Москвы
          русской православной церкви (московский патриархат)
        </h1>
      </div>
      <div className="container">
        <NewsHome></NewsHome>
      </div>
      <div className="calendar">
        <Calendar></Calendar>
      </div>
      <div className="container">
      <ShedulePlain />
      </div>
    </>
  );
};

export default Home;

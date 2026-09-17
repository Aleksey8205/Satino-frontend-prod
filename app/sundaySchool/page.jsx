"use client";

import React, { useState } from "react";
import "./styles/sundaySchool.css";
import imagesHeader from "../components/imagesHeader";
import Image from 'next/image';

const SundaySchool = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="main-school">
        <div>
          <h2>Дорогие братья и сёстры!</h2>
          <p>
            При нашем храме действует Воскресная школа по изучению Закона
            Божьего <br /> и курсы для взрослых по изучению Священного Писания.
          </p>
        </div>
        <div className="schedule">
          <h3>Расписание занятий</h3>
          <p>
            (каждый воскресный день) <br /> младшая группа - с 9.00 до 10.00 (в
            помещении трапезной) <br /> взрослая группа - с 11.00 до 13.00 (в
            помещении трапезной)
          </p>
        </div>
        <div>
          <h3>Наши преподаватели, всегда рады видеть вас и ваших деток</h3>
          <div className="teachers">
            <div className="item-teacher">
              <Image
              width={200}
                className="image-teacher"
                src={imagesHeader.prokina}
                alt=""
              />
              <section>
                <h3>Прокина Наталья Игоревна</h3>
                <p>Директор Воскресной школы.</p>
                <p>
                  Преподаватель детской Воскресной школы "Ангел". Помощник в
                  работе театральной студии при нашем храме.
                </p>
              </section>
            </div>
            <div className="item-teacher">
              <Image
              width={200}
                className="image-teacher"
                src={imagesHeader.khamatdinov}
                alt=""
              />
              <section>
                <h3>Хаматдинов Олег Тагирович</h3>
                <p>
                  Преподаватель взрослой группы Воскресной школы "Хлеб
                  Насущный".
                </p>
                <div className={`extra-info ${isExpanded ? "expanded" : ""}`}>
                  <p>Ответственный за катехизаторскую деятельность Прихода.</p>

                  <p>
                    Выпускник школы миссионерства имени отца Даниила Сысоева.
                  </p>
                  <p>
                    Окончил катехизаторские курсы священномученика Фаддея при
                    православном институте апостола Иоанна Богослова.
                  </p>
                  <p>
                    Социальный педагог по специализации "Педагогика" при МГГУ
                    имени Шолохова.
                  </p>
                </div>
                <button className="btnSubmit" onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? "Скрыть" : "Показать больше"}
                </button>
              </section>
            </div>
            <div className="item-teacher">
              <Image
              width={200}
                className="image-teacher"
                src={imagesHeader.fetisova}
                alt=""
              />
              <section>
                <h3>Фетисова Юлия Алексеевна</h3>
                <p>Воспитатель детской театральной студии при нашем храме.</p>
                <p>Помощник преподавателя детской Воскресной школы "Ангел".</p>
              </section>
            </div>
          </div>
        </div>
        <div>
          <h3>СВИДЕТЕЛЬСТВО О ПРОВЕДЕНИИ ЕПАРХИАЛЬНОЙ АТТЕСТАЦИИ</h3>
          <Image
          width={800}
          className="cert" src={imagesHeader.svidetelstvo} alt="" />
        </div>
        <div>
          <h3>Учебный план</h3>
          <p>ниже описание</p>
        </div>
      </div>
    </>
  );
};

export default SundaySchool;

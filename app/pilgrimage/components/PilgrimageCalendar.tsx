"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDate } from "date-fns";
import { ru as ruLocale } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/calendar.css";
import { useEffect, useState } from "react";

const locales = {
  ru: ruLocale,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay: (date: any) => date.getDay(),
  getDate,
  locales,
});

interface ServerEvent {
  title: string;
  start: string;
  end: string;
}

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
}

const PilgrimageCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/pilgrimage`
        );
        if (!response.ok) {
          throw new Error(`Ошибка сети: ${response.status}`);
        }

        const dataFromServer: ServerEvent[] = await response.json();
        const eventsForCalendar: CalendarEvent[] = dataFromServer.map(
          (item) => ({
            title: `Начало: ${format(new Date(item.start), "HH:mm")} ${
              item.title
            }`,
            start: new Date(item.start),
            end: new Date(item.end),
          })
        );

        setEvents(eventsForCalendar);
      } catch (error) {
        console.error("Не удалось загрузить события:", error);
      }
    };
    fetchData();
  }, []);

  const ruMessages = {
    today: "Сегодня",
    previous: "‹",
    next: "›",
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    if (window.innerWidth < 500) {
        
        setSelectedEvent(event);
      }
  };



  const eventStyleGetter = (event: CalendarEvent) => {
    const style = {
      backgroundColor: "#007bff", // Цвет события
      opacity: 0.8,
      color: "white",
      border: "0px",
      display: "block", 
    };
    return { style };
  };

  return (
    <>
      <div style={{ height: "90vh" }}>
        <Calendar
          localizer={localizer}
          events={events}
          views={["month"]}
          defaultView="month"
          defaultDate={new Date()}
          scrollToTime={new Date()}
          culture="ru"
          messages={ruMessages}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
        />
      </div>
      {selectedEvent && (
        <div className="event-details-panel">
          <h4>{selectedEvent.title}</h4>
          <p>
            {format(selectedEvent.start, "HH:mm")} -{" "}
            {format(selectedEvent.end, "HH:mm")}
          </p>
          <button className="link" onClick={() => setSelectedEvent(null)}>Закрыть</button>
        </div>
      )}
    </>
  );
};

export default PilgrimageCalendar;

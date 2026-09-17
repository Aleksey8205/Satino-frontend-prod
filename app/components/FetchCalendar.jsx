import React, { useState, useEffect } from "react";
import "./styles/calendar.css"

const Calendar = () => {
  const [htmlContent, setHtmlContent] = useState(null);

  useEffect(() => {
    const fetchWidget = async () => {
        try {
          const response = await fetch("http://localhost:3000/proxy/pravmir");
          if (!response.ok) {
            throw new Error("Ошибка при получении данных");
          }
          let rawText = await response.text();

          let htmlContent = rawText.match(/'(.*?)'/)[1];
      
          const styleStart = htmlContent.indexOf('<style');
          const styleEnd = htmlContent.indexOf('</style>', styleStart) + '</style>'.length;
          if (styleStart > -1 && styleEnd > -1) {
            htmlContent = htmlContent.slice(0, styleStart) + htmlContent.slice(styleEnd);
          }
      
          setHtmlContent(htmlContent);
        } catch (error) {
          console.error("Ошибка при получении данных:", error);
        }
      };
      
      fetchWidget();
  }, []);

  return (
    <div>
      {htmlContent ? (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }}>
        </div>
      ) : (
        <p className="download">Загрузка данных...</p>
      )}
    </div>
  );
};

export default Calendar;

// src/views/programacion/CalendarioPautas.js  
import React, { useEffect, useState } from "react";  
import FullCalendar from "@fullcalendar/react";  
import timeGridPlugin from "@fullcalendar/timegrid";  
import dayGridPlugin from "@fullcalendar/daygrid";  
import { programacionService } from "../../services/programacion/programacionService";  
  
const CalendarioPautas = () => {  
  const [eventos, setEventos] = useState([]);  
  const [loading, setLoading] = useState(true);  
  
  useEffect(() => {  
    cargarPautas();  
  }, []);  
  
  const cargarPautas = async () => {  
    try {  
      setLoading(true);  
      const data = await programacionService.obtenerProgramacionCompleta();  
  
      const eventosFormateados = [];  
      data.forEach(bloque => {  
        bloque.comerciales.forEach(comercial => {  
          if (comercial.empresas.length > 0) {  
            const horaCompleta = `2025-03-10T${convertirHora(comercial.hora)}`;  
  
            eventosFormateados.push({  
              title: `${bloque.bloque} (${comercial.empresas.length} empresas)`,  
              start: horaCompleta,  
              description: comercial.empresas.join(", "),  
              backgroundColor: "#007bff",  
              borderColor: "#007bff",  
              textColor: "#fff"  
            });  
          }  
        });  
      });  
  
      setEventos(eventosFormateados);  
    } catch (error) {  
      console.error("Error al cargar pautas", error);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const convertirHora = (hora) => {  
    const isPM = hora.toLowerCase().includes("pm");  
    const cleanHora = hora.replace(/(AM|PM)/gi, "").trim();  
    let [h, m] = cleanHora.split(":");  
    h = parseInt(h);  
    if (isPM && h < 12) h += 12;  
    if (!isPM && h === 12) h = 0;  
    return `${String(h).padStart(2, "0")}:${m || "00"}`;  
  };  
  
  if (loading) {  
    return <div className="text-center">Cargando programación...</div>;  
  }  
  
  return (  
    <div className="mt-4">  
      <FullCalendar  
        plugins={[timeGridPlugin, dayGridPlugin]}  
        initialView="timeGridDay"  
        allDaySlot={false}  
        height="auto"  
        slotMinTime="06:00:00"  
        slotMaxTime="22:00:00"  
        events={eventos}  
        eventContent={renderEventContent}  
        headerToolbar={{  
          left: "prev,next today",  
          center: "title",  
          right: "timeGridDay,timeGridWeek"  
        }}  
      />  
    </div>  
  );  
};  
  
function renderEventContent(eventInfo) {  
  return (  
    <div title={eventInfo.event.extendedProps.description}>  
      <b>{eventInfo.timeText}</b>  
      <br />  
      <span>{eventInfo.event.title}</span>  
    </div>  
  );  
}  
  
export default CalendarioPautas;
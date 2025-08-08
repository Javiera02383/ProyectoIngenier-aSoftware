import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";

const CalendarioPautas = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const cargarPautas = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/optica"); // ajusta tu ruta
        const data = res.data;

        // Formato FullCalendar
        const eventosFormateados = [];
        data.forEach(bloque => {
          bloque.comerciales.forEach(comercial => {
            const horaCompleta = `2025-03-10T${convertirHora(comercial.hora)}`; // día fijo o dinámico

            eventosFormateados.push({
              title: `${bloque.bloque} (${comercial.empresas.length} empresas)`,
              start: horaCompleta,
              description: comercial.empresas.join(", "),
              backgroundColor: "#007bff", // azul
              borderColor: "#007bff",
              textColor: "#fff"
            });
          });
        });

        setEventos(eventosFormateados);
      } catch (error) {
        console.error("Error al cargar pautas", error);
      }
    };

    cargarPautas();
  }, []);

  const convertirHora = (hora) => {
    // Convierte "7:05" o "10:00 PM" en formato "HH:mm"
    const isPM = hora.toLowerCase().includes("pm");
    const cleanHora = hora.replace(/(AM|PM)/gi, "").trim();
    let [h, m] = cleanHora.split(":");
    h = parseInt(h);
    if (isPM && h < 12) h += 12;
    if (!isPM && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${m}`;
  };

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

// 👇 Personaliza cómo se ve cada evento
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

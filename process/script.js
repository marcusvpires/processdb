import * as db from "./db";
import * as A from "./assets";

/* Horário e Local */

const info = {
  calculo: {
    materia: "cálculo",
    horarios: [
      {
        dia: "Quinta",
        local: "CE-301",
        inicio: [13],
        fim: [15, 30]
      },
      {
        dia: "Terça",
        local: "CE-201",
        inicio: [13],
        fim: [15, 30]
      }
    ]
  },
  magnetismo: {
    materia: "magnetismo",
    horarios: [
      {
        dia: "Quinta",
        local: "CE-301",
        inicio: [13],
        fim: [15, 30]
      },
      {
        dia: "Terça",
        local: "CE-201",
        inicio: [13],
        fim: [15, 30]
      }
    ]
  }
};

const script = () => {
  const calculo = A.parseCSV(db.calculo);
  const calendar = {
    calculo: A.calendarEvent(calculo, info.calculo)
  };

  let prevDate = "";
  let events = [];
  calendar.calculo.forEach((row) => {
    if (row.date !== undefined && row.date === prevDate) {
      if (row.name === "AV CA-102 Libras") {
        events[events.length - 1].name = "AV CA-102 Libras";
      }
      events[events.length - 1].content += "\n " + row.content;
      events[events.length - 1].num += " - " + row.num;
      events[events.length - 1].type += " - " + row.type;
      events[events.length - 1].Peso += " - " + row.Peso;
      row.num = "del";
      events.push(row);
    } else {
      prevDate = row.date;
      events.push(row);
    }
  });
  events = events.filter((row) => row.num !== "del");
  return events;
};

export default script;

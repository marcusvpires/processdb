export const parseCSV = (csv) => {
  const array = csv
    .split("\n")
    .map((row) => row.split(";").map((cell) => cell.split(/[""]/)[1]));
  array.shift();
  array.pop();
  const header = array[0];
  array.shift();
  const object = array.map((row) => {
    let target = {};
    header.forEach((element, index) => {
      target[element] = row[index];
    });
    return target;
  });

  return object;
};

const getHL = (dia, data, info) => {
  data = data.split("/");

  const dt = { dia: data[0], mes: Number(data[1]) - 1, ano: data[2] };
  const newDate = (hora, minutos = 0) =>
    new Date(dt.ano, dt.mes, dt.dia, hora, minutos);

  let result;
  info.horarios.forEach((hl) => {
    if (hl.dia === dia) {
      result = {
        inicio: newDate(...hl.inicio),
        fim: newDate(...hl.fim),
        local: hl.local
      };
    }
  });

  if (result) {
    return result;
  } else {
    throw new Error(`O horário do dia "${dia}" não foi definido`);
  }
};

const getNome = (tipo, materia) => {
  let nome = {};
  switch (tipo) {
    case "Aula normal":
      nome.obs = "";
      break;
    case "Avaliação":
      nome.obs = "AV ";
      break;
    case "":
      nome.obs = "ND ";
      break;
    default:
      throw new Error("O tipo '", tipo, "' não foi definido");
  }
  nome.materia = " " + materia;
  return nome;
};

export const calendarEvent = (object, info) => {
  const events = object.map((row) => {
    try {
      const HL = getHL(row.dia, row.data, info);
      const nome = getNome(row.tipo, info.materia);
      row.HL = HL;
      row.nome = nome;
      return row;
    } catch (err) {
      console.error(err);
      return [];
    }
  });

  const calendar = [];
  events.forEach((ev) => {
    const prev = calendar[calendar.length - 1];
    if (prev && prev.data === ev.data) {
      prev.n += " - " + ev.n;
      prev.tipo += " - " + ev.tipo;
      prev.aulas += " - " + ev.aulas;
      prev.conteudo += " \n\n" + ev.conteudo;
      if (prev.HL.local !== ev.HL.local) {
        prev.HL.local += " - " + ev.HL.local;
      }
      prev.nome.obs += ev.nome.obs;
    } else {
      calendar.push(ev);
    }
  });
  return calendar.map((ev) => {
    const descricao = `
${ev.conteudo}
 
Tipo: 
${ev.tipo}
 
Aulas / valor: 
${ev.aulas}
 
Número: 
${ev.n}
`;
    const nome = `${ev.nome.obs} ${ev.HL.local} ${ev.nome.materia}`;
    return {
      nome,
      data: ev.data,
      inicio: ev.HL.inicio,
      fim: ev.HL.fim,
      descricao
    };
  });
};

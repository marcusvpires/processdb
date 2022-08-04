import script from "./script";

console.clear();
let db = script();
let keys = Object.keys(db[0]);
let maxWidth = (100 / keys.length) * 2.5 + "vw";

const constructor = () => {
  Head();
  db.forEach((object) => Row(object));
  document.querySelector(".log").innerHTML = JSON.stringify(db);
  console.log(db);
};

const print = (value) => {
  var str = "{";
  for (const key in value) {
    if (typeof value[key] === "object") {
      const sub = print(value[key]);
      str += `<div class="pd">${key}: ${sub}</div>`;
    } else {
      str += `<div class="pd">${key}: ${JSON.stringify(value[key])}</div>`;
    }
  }
  str += "}";
  return str;
};

const Head = () => {
  const ths = keys.map((key) => {
    const th = document.createElement("th");
    th.innerText = key;
    return th;
  });
  const thead = document.querySelector("thead > tr");
  thead.append(...ths);
};

const Row = (object) => {
  const tds = Object.values(object).map((value) => {
    const th = document.createElement("td");
    th.innerHTML = formatValue(value);
    th.style.maxWidth = maxWidth;
    return th;
  });
  const row = document.createElement("tr");
  row.append(...tds);
  const body = document.querySelector("tbody");
  body.appendChild(row);
};

const formatValue = (value) => {
  if (typeof value === "string") {
    return value.replaceAll("\n", "");
  } else if (typeof value === "object") {
    return JSON.stringify(value).replaceAll('"', "").replaceAll("\n", "");
  } else if (typeof value === "boolean") {
    const el = document.createElement("div");
    if (value) {
      el.style.color = "green";
      el.innerText = "sim";
    } else {
      el.style.color = "red";
      el.innerText = "não";
    }
    el.style.textAlign = "center";
    return el.outerHTML;
  } else if (typeof value === "number") {
    const el = document.createElement("div");
    el.style.textAlign = "right";
    return el.outerHTML;
  }
};

constructor();

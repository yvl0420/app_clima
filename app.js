const API_KEY = import.meta.env.VITE_CLIMA_KEY;

const formulario = document.getElementById("formularioClima");
const entradaCiudad = document.getElementById("entradaCiudad");
const resultadoClima = document.getElementById("resultadoClima");
const nombreCiudad = document.getElementById("nombreCiudad");
const descripcion = document.getElementById("descripcion");
const temperatura = document.getElementById("temperatura");
const humedad = document.getElementById("humedad");
const viento = document.getElementById("viento");
const iconoClima = document.getElementById("iconoClima");
const contenedorHistorial = document.getElementById("contenedorHistorial");
const pronosticoSection = document.getElementById("pronosticoSection");
const contenedorPronosticos = document.getElementById("contenedorPronosticos");
const histPager = document.getElementById("histPager");
const themeToggle = document.getElementById("themeToggle");

const STORAGE = {
  HISTORIAL: "appClima_historial_v1",
  THEME: "appClima_theme_v1"
};

const ITEMS_POR_PAGINA = 5;
let paginaActual = 1;

function aplicarTema(tema) {
  if (tema === "light") document.body.classList.add("light");
  else document.body.classList.remove("light");
  localStorage.setItem(STORAGE.THEME, tema);
}
function initTema() {
  const guardado = localStorage.getItem(STORAGE.THEME);
  aplicarTema(guardado || "dark");
}
themeToggle.addEventListener("click", () => {
  const actual = document.body.classList.contains("light") ? "light" : "dark";
  aplicarTema(actual === "light" ? "dark" : "light");
});
initTema();

function iconoSvg(condition) {
  const c = (condition || "").toLowerCase();
  if (c.includes("clear")) return `<svg width="44" height="44" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/></svg>`;
  if (c.includes("cloud")) return `<svg width="44" height="44" viewBox="0 0 24 24"><path d="M20 17H6a4 4 0 010-8 5 5 0 0110 0 3 3 0 01.5 6z" stroke="currentColor" stroke-width="1.4"/></svg>`;
  if (c.includes("rain") || c.includes("drizzle")) return `<svg width="44" height="44" viewBox="0 0 24 24"><path d="M20 17H6a4 4 0 010-8 5 5 0 0110 0 3 3 0 01.5 6z" stroke="currentColor" stroke-width="1.4"/><path d="M8 20l1.2-1.6M12 20l1.2-1.6M16 20l1.2-1.6" stroke="currentColor" stroke-width="1.4"/></svg>`;
  if (c.includes("snow")) return `<svg width="44" height="44" viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.2 6.2l2.8 2.8M17 14l2.8 2.8M1 12h4M19 12h4M4.2 17.8L7 15M17 9l2.8-2.8" stroke="currentColor" stroke-width="1.4"/></svg>`;
  if (c.includes("storm") || c.includes("thunder")) return `<svg width="44" height="44" viewBox="0 0 24 24"><path d="M20 17H6a4 4 0 010-8 5 5 0 0110 0 3 3 0 01.5 6z" stroke="currentColor" stroke-width="1.4"/><path d="M13 11l-3 5h4l-3 5" stroke="currentColor" stroke-width="1.4"/></svg>`;
  return `<svg width="44" height="44" viewBox="0 0 24 24"><rect x="3" y="10" width="18" height="2" rx="1" stroke="currentColor" stroke-width="1.4"/><rect x="3" y="14" width="12" height="2" rx="1" stroke="currentColor" stroke-width="1.4"/></svg>`;
}

function cargarHistorial() {
  return JSON.parse(localStorage.getItem(STORAGE.HISTORIAL) || "[]");
}
function guardarHistorial(arr) {
  localStorage.setItem(STORAGE.HISTORIAL, JSON.stringify(arr));
}
function pushHistorial(ciudad, data) {
  let h = cargarHistorial();
  h = h.filter(item => item.ciudad.toLowerCase() !== ciudad.toLowerCase());
  h.unshift({
    ciudad,
    temp: Math.round(data.main.temp),
    cond: data.weather[0].main,
    ts: Date.now()
  });
  if (h.length > 20) h.pop();
  guardarHistorial(h);
  paginaActual = 1;
  renderHistorial();
}

function renderHistorial() {
  const h = cargarHistorial();
  contenedorHistorial.innerHTML = "";
  histPager.innerHTML = "";
  if (h.length === 0) {
    contenedorHistorial.innerHTML = `<div class="hist-empty">Aún no hay búsquedas</div>`;
    return;
  }

  const totalPaginas = Math.max(1, Math.ceil(h.length / ITEMS_POR_PAGINA));
  if (paginaActual > totalPaginas) paginaActual = totalPaginas;

  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const pagina = h.slice(inicio, inicio + ITEMS_POR_PAGINA);

  pagina.forEach((item) => {
    const el = document.createElement("div");
    el.className = "hist-item card";
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.innerHTML = `
      <div style="display:flex;gap:10px;align-items:center">
        <div style="width:46px;height:46px;color:var(--accent)">${iconoSvg(item.cond)}</div>
        <div>
          <div class="ciudad">${item.ciudad}</div>
          <small>${item.temp} °C</small>
        </div>
      </div>
    `;
    el.addEventListener("click", () => { buscarCiudad(item.ciudad); window.scrollTo({ top: 0, behavior: "smooth" }); });
    el.addEventListener("keydown", (e) => { if (e.key === "Enter") { buscarCiudad(item.ciudad); } });
    contenedorHistorial.appendChild(el);
  });

  renderPagerSmart(h.length, totalPaginas);
}

function renderPagerSmart(totalItems, totalPaginas) {
  const maxVisible = 7;
  const current = paginaActual;
  const pager = document.createDocumentFragment();

  const btnPrev = document.createElement("button");
  btnPrev.className = "pager-prev";
  btnPrev.innerHTML = "‹";
  btnPrev.disabled = current === 1;
  btnPrev.addEventListener("click", () => { if (paginaActual > 1) { paginaActual--; renderHistorial(); } });
  pager.appendChild(btnPrev);

  function addPageButton(n) {
    const b = document.createElement("button");
    b.className = "pager-num";
    b.textContent = String(n);
    if (n === current) b.classList.add("active");
    b.addEventListener("click", () => { paginaActual = n; renderHistorial(); });
    pager.appendChild(b);
  }

  if (totalPaginas <= maxVisible) {
    for (let i = 1; i <= totalPaginas; i++) addPageButton(i);
  } else {
    const left = 1;
    const right = totalPaginas;
    const windowSize = 3; // pages around current
    addPageButton(1);

    let start = Math.max(2, current - windowSize);
    let end = Math.min(totalPaginas - 1, current + windowSize);

    if (start > 2) {
      const dots = document.createElement("span"); dots.className = "pager-dots"; dots.textContent = "…";
      pager.appendChild(dots);
    } else {
      start = 2;
    }

    for (let i = start; i <= end; i++) addPageButton(i);

    if (end < totalPaginas - 1) {
      const dots = document.createElement("span"); dots.className = "pager-dots"; dots.textContent = "…";
      pager.appendChild(dots);
    }

    addPageButton(totalPaginas);
  }

  const btnNext = document.createElement("button");
  btnNext.className = "pager-next";
  btnNext.innerHTML = "›";
  btnNext.disabled = current === totalPaginas;
  btnNext.addEventListener("click", () => { if (paginaActual < totalPaginas) { paginaActual++; renderHistorial(); } });
  pager.appendChild(btnNext);

  histPager.appendChild(pager);
}

async function obtenerClimaActual(ciudad) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&units=metric&lang=es&appid=${API_KEY}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error("Ciudad no encontrada");
  return await resp.json();
}

async function obtenerPronostico(ciudad) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(ciudad)}&units=metric&lang=es&appid=${API_KEY}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error("No se pudo obtener el pronóstico");
  const data = await resp.json();
  const lista = data.list || [];
  const diasMap = {};
  lista.forEach((item) => {
    const fecha = new Date(item.dt * 1000);
    const diaKey = fecha.toISOString().slice(0, 10);
    if (!diasMap[diaKey]) diasMap[diaKey] = [];
    diasMap[diaKey].push(item);
  });

  const diasArr = Object.keys(diasMap)
    .map((dk) => {
      const items = diasMap[dk];
      let elegido = items.reduce((prev, cur) => {
        const absPrev = Math.abs(new Date(prev.dt * 1000).getHours() - 12);
        const absCur = Math.abs(new Date(cur.dt * 1000).getHours() - 12);
        return absCur < absPrev ? cur : prev;
      }, items[0]);
      return { dia: dk, item: elegido };
    })
    .sort((a, b) => a.dia.localeCompare(b.dia));

  return diasArr.slice(0, 5);
}

function renderClimaActual(datos) {
  nombreCiudad.textContent = `${datos.name}${datos.sys?.country ? ", " + datos.sys.country : ""}`;
  descripcion.textContent = datos.weather?.[0]?.description || "";
  temperatura.textContent = (datos.main?.temp ?? "").toFixed(1);
  humedad.textContent = datos.main?.humidity ?? "";
  viento.textContent = datos.wind?.speed ?? "";
  iconoClima.innerHTML = iconoSvg(datos.weather?.[0]?.main || "");
  resultadoClima.classList.remove("hidden");
}

function renderPronostico(dias) {
  contenedorPronosticos.innerHTML = "";
  if (!dias || dias.length === 0) {
    pronosticoSection.classList.add("hidden");
    return;
  }
  dias.forEach((d) => {
    const fecha = new Date(d.item.dt * 1000);
    const opciones = { weekday: "short", day: "numeric" };
    const label = fecha.toLocaleDateString("es-ES", opciones);
    const temp = Math.round(d.item.main.temp);
    const cond = d.item.weather[0].main;
    const html = document.createElement("div");
    html.className = "card-pron";
    html.innerHTML = `
      <div class="icon" style="color:var(--accent)">${iconoSvg(cond)}</div>
      <div class="dia">${label}</div>
      <div class="t">${temp} °C</div>
      <small style="text-transform:capitalize">${d.item.weather[0].description}</small>
    `;
    contenedorPronosticos.appendChild(html);
  });
  pronosticoSection.classList.remove("hidden");
}

async function buscarCiudad(ciudad) {
  try {
    const current = await obtenerClimaActual(ciudad);
    if (!current) return;
    renderClimaActual(current);
    const forecast = await obtenerPronostico(ciudad);
    renderPronostico(forecast);
    pushHistorial(ciudad, current);
  } catch (e) {
    alert(e.message || "Error al obtener datos");
  }
}

formulario.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const ciudad = entradaCiudad.value.trim();
  if (ciudad) {
    buscarCiudad(ciudad);
    entradaCiudad.value = "";
  }
});

renderHistorial();

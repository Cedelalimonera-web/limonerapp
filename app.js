const app = document.getElementById("app");

/* ======================
   CONFIGURACIÓN
====================== */

const FINCAS = [
  "Finca Juan Luis",
  "Finca La Limonera",
  "Finca San Jorge"
];

const LOTES = Array.from({ length: 20 }, (_, i) => `Lote ${i + 1}`);

/* ======================
   ESTADO
====================== */

let state = {
  view: "home",
  selectedId: null,
  filtroUbicacion: "campo",
  fincaSeleccionada: null,
  loteSeleccionado: null,

  insumos: JSON.parse(localStorage.getItem("insumos")) || []
};

function save() {
  localStorage.setItem("insumos", JSON.stringify(state.insumos));
}

/* ======================
   RENDER GENERAL
====================== */

function render() {
  if (state.view === "home") renderHome();
  if (state.view === "list") renderList();
  if (state.view === "detail") renderDetail();
  if (state.view === "lotes") renderLotesFincas();
  if (state.view === "lotesFinca") renderLotesPorFinca();
  if (state.view === "loteDetalle") renderLoteDetalle();
}

/* ======================
   HOME
====================== */

function renderHome() {
  app.innerHTML = `
    <div class="card" onclick="openList('campo')">
      <div class="card-row">
        <div>
          <div class="big">Insumos Campo</div>
          <div class="ok">Stock</div>
        </div>
        🌱
      </div>
    </div>

    <div class="card" onclick="openList('empaque')">
      <div class="card-row">
        <div>
          <div class="big">Insumos Empaque</div>
          <div class="warn">Control</div>
        </div>
        📦
      </div>
    </div>

    <div class="card" onclick="goLotes()">
      <div class="card-row">
        <div>
          <div class="big">Lotes</div>
          <div class="ok">Historial</div>
        </div>
        🗺️
      </div>
    </div>
  `;
}

/* ======================
   INSUMOS
====================== */

function openList(ubicacion) {
  state.filtroUbicacion = ubicacion;
  state.view = "list";
  render();
}

function renderList() {
  const lista = state.insumos.filter(i => i.ubicacion === state.filtroUbicacion);

  app.innerHTML = `
    <button class="btn btn-gray" onclick="goHome()">← Volver</button>
    <h1>Insumos ${state.filtroUbicacion === "campo" ? "Campo" : "Empaque"}</h1>

    ${lista.map(i => `
      <div class="list-item" onclick="openDetail(${i.id})">
        <strong>${i.nombre}</strong>
        <span>${i.stock} ${i.unidad}</span>
      </div>
    `).join("")}
  `;
}

function openDetail(id) {
  state.selectedId = id;
  state.view = "detail";
  render();
}

function renderDetail() {
  const i = state.insumos.find(x => x.id === state.selectedId);

  app.innerHTML = `
    <button class="btn btn-gray" onclick="renderList()">← Volver</button>
    <h1>${i.nombre}</h1>
    <p>Stock: ${i.stock} ${i.unidad}</p>
  `;
}

/* ======================
   LOTES – PASO 2
====================== */

function goLotes() {
  state.view = "lotes";
  render();
}

function renderLotesFincas() {
  app.innerHTML = `
    <button class="btn btn-gray" onclick="goHome()">← Volver</button>
    <h1>Fincas</h1>

    ${FINCAS.map(f => `
      <div class="list-item" onclick="selectFinca('${f}')">
        ${f}
      </div>
    `).join("")}
  `;
}

function selectFinca(finca) {
  state.fincaSeleccionada = finca;
  state.view = "lotesFinca";
  render();
}

function renderLotesPorFinca() {
  app.innerHTML = `
    <button class="btn btn-gray" onclick="goLotes()">← Volver</button>
    <h1>${state.fincaSeleccionada}</h1>

    ${LOTES.map(l => `
      <div class="list-item" onclick="selectLote('${l}')">
        ${l}
      </div>
    `).join("")}
  `;
}

function selectLote(lote) {
  state.loteSeleccionado = lote;
  state.view = "loteDetalle";
  render();
}

function renderLoteDetalle() {
  const movimientos = [];

  state.insumos.forEach(insumo => {
    insumo.movimientos.forEach(m => {
      if (m.finca === state.fincaSeleccionada && m.lote === state.loteSeleccionado) {
        movimientos.push({
          insumo: insumo.nombre,
          unidad: insumo.unidad,
          cantidad: m.cantidad,
          fecha: m.fecha
        });
      }
    });
  });

  const totales = {};
  movimientos.forEach(m => {
    totales[m.insumo] = (totales[m.insumo] || 0) + m.cantidad;
  });

  app.innerHTML = `
    <button class="btn btn-gray" onclick="renderLotesPorFinca()">← Volver</button>
    <h1>${state.fincaSeleccionada} – ${state.loteSeleccionado}</h1>

    <div class="card">
      <h3>Totales</h3>
      ${
        Object.keys(totales).length === 0
          ? "<p>Sin movimientos</p>"
          : Object.entries(totales).map(
              ([i, v]) => `<p>${i}: <strong>${v}</strong></p>`
            ).join("")
      }
    </div>

    <div class="card">
      <h3>Historial</h3>
      ${
        movimientos.length === 0
          ? "<p>Sin registros</p>"
          : movimientos.map(m => `
              <p style="margin-top:6px">
                🕒 ${m.fecha}<br>
                ${m.insumo} – ${m.cantidad} ${m.unidad}
              </p>
            `).join("")
      }
    </div>
  `;
}

/* ======================
   OTROS
====================== */

function goHome() {
  state.view = "home";
  render();
}

/* ======================
   INIT
====================== */

render();

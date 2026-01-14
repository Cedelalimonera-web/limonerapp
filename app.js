const app = document.getElementById("app");

let state = {
  view: "home",
  selectedId: null,
  insumos: JSON.parse(localStorage.getItem("insumos")) || [
    {
      id: 1,
      nombre: "UREA",
      unidad: "kg",
      stock: 2070,
      minimo: 200,
      movimientos: [
        { fecha: "13/01/2026 01:07", texto: "Se usaron 30 kg en Finca Juan Luis – Lote 1" }
      ]
    }
  ],
  lluvia: {
    mes: "Enero",
    anio: 2026,
    diasConLluvia: [15,16,17,18,19],
    totalMm: 65,
    alerta: "Lluvia prolongada del 15 al 18"
  }
};

function save() {
  localStorage.setItem("insumos", JSON.stringify(state.insumos));
}

/* -------- RENDER GENERAL -------- */

function render() {
  if (state.view === "home") renderHome();
  if (state.view === "list") renderList();
  if (state.view === "detail") renderDetail();
  if (state.view === "lluvia") renderLluvia();
}

/* -------- HOME -------- */

function renderHome() {
  app.innerHTML = `
    <div class="card" onclick="go('list')">
      <div class="card-row">
        <div>
          <div class="big">Insumos Campo</div>
          <div class="ok">Stock OK</div>
        </div>
        🌱
      </div>
    </div>

    <div class="card" onclick="go('lluvia')">
      <div class="card-row">
        <div>
          <div class="big">Lluvia</div>
          <div class="warn">${state.lluvia.alerta}</div>
        </div>
        🌧️
      </div>
    </div>
  `;
}

/* -------- INSUMOS -------- */

function renderList() {
  app.innerHTML = `
    <button class="btn btn-gray" onclick="go('home')">← Volver</button>
    <h1>Insumos Campo</h1>

    ${state.insumos.map(i => `
      <div class="list-item" onclick="openDetail(${i.id})">
        <strong>${i.nombre}</strong>
        <span>Stock: ${i.stock} ${i.unidad}</span>
      </div>
    `).join("")}

    <button class="btn btn-green btn-full" onclick="addInsumo()">+ Agregar insumo</button>
  `;
}

function renderDetail() {
  const i = state.insumos.find(x => x.id === state.selectedId);
  const pct = Math.min((i.stock / 5000) * 100, 100);

  app.innerHTML = `
    <button class="btn btn-gray" onclick="go('list')">← Volver</button>
    <h1>${i.nombre}</h1>
    <p>⚠️ Stock mínimo: ${i.minimo}</p>

    <div class="card">
      <div class="stock">${i.stock} ${i.unidad}</div>
      <div class="progress"><div style="width:${pct}%"></div></div>

      <div class="card-row">
        <button class="btn btn-green" onclick="movimiento('ingreso')">+ Ingresar</button>
        <button class="btn btn-orange" onclick="movimiento('uso')">− Usar</button>
        <button class="btn btn-gray">↔ Transferir</button>
      </div>
    </div>

    <div class="card">
      <h3>Últimos movimientos</h3>
      ${i.movimientos.map(m => `
        <p style="margin-top:8px">🕒 ${m.fecha} — ${m.texto}</p>
      `).join("")}
    </div>
  `;
}

/* -------- LLUVIA -------- */

function renderLluvia() {
  const dias = Array.from({length:31},(_,i)=>i+1);

  app.innerHTML = `
    <button class="btn btn-gray" onclick="go('home')">← Volver</button>
    <h1>Lluvia – ${state.lluvia.mes} ${state.lluvia.anio}</h1>

    <div class="card warn">⚠️ ${state.lluvia.alerta}</div>

    <div class="calendar">
      ${dias.map(d => `
        <div class="day ${state.lluvia.diasConLluvia.includes(d) ? "rain":""}">
          ${d}
        </div>
      `).join("")}
    </div>

    <div class="card">
      <p>Total mes: <strong>${state.lluvia.totalMm} mm</strong></p>
      <p>Días con lluvia: <strong>${state.lluvia.diasConLluvia.length}</strong></p>
    </div>
  `;
}

/* -------- ACCIONES -------- */

function go(v) {
  state.view = v;
  render();
}

function openDetail(id) {
  state.selectedId = id;
  state.view = "detail";
  render();
}

function addInsumo() {
  const nombre = prompt("Nombre del insumo");
  if (!nombre) return;

  state.insumos.push({
    id: Date.now(),
    nombre,
    unidad: "kg",
    stock: 0,
    minimo: 0,
    movimientos: []
  });

  save();
  render();
}

function movimiento(tipo) {
  const i = state.insumos.find(x => x.id === state.selectedId);
  const cant = Number(prompt("Cantidad"));
  if (!cant) return;

  if (tipo === "uso") i.stock -= cant;
  if (tipo === "ingreso") i.stock += cant;

  i.movimientos.unshift({
    fecha: new Date().toLocaleString(),
    texto: tipo === "uso"
      ? `Se usaron ${cant} ${i.unidad}`
      : `Se ingresaron ${cant} ${i.unidad}`
  });

  save();
  render();
}

render();

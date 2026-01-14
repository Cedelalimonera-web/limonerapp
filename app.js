const app = document.getElementById("app");

let state = {
  view: "home",
  selectedId: null,
  filtroUbicacion: "campo",

  insumos: JSON.parse(localStorage.getItem("insumos")) || [
    {
      id: 1,
      nombre: "UREA",
      unidad: "kg",
      ubicacion: "campo",
      stock: 2070,
      minimo: 200,
      movimientos: []
    },
    {
      id: 2,
      nombre: "Cajas cartón 18kg",
      unidad: "u",
      ubicacion: "empaque",
      stock: 3200,
      minimo: 500,
      movimientos: []
    }
  ]
};

function save() {
  localStorage.setItem("insumos", JSON.stringify(state.insumos));
}

/* ---------- RENDER ---------- */

function render() {
  if (state.view === "home") renderHome();
  if (state.view === "list") renderList();
  if (state.view === "detail") renderDetail();
}

/* ---------- HOME ---------- */

function renderHome() {
  app.innerHTML = `
    <div class="card" onclick="openList('campo')">
      <div class="card-row">
        <div>
          <div class="big">Insumos Campo</div>
          <div class="ok">Stock OK</div>
        </div>
        🌱
      </div>
    </div>

    <div class="card" onclick="openList('empaque')">
      <div class="card-row">
        <div>
          <div class="big">Insumos Empaque</div>
          <div class="warn">Controlar stock</div>
        </div>
        📦
      </div>
    </div>
  `;
}

/* ---------- LISTADO ---------- */

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
        <div>
          <strong>${i.nombre}</strong><br>
          <span class="tag">${i.ubicacion}</span>
        </div>
        <span>${i.stock} ${i.unidad}</span>
      </div>
    `).join("")}

    <button class="btn btn-green btn-full" onclick="addInsumo()">+ Agregar insumo</button>
  `;
}

/* ---------- DETALLE ---------- */

function openDetail(id) {
  state.selectedId = id;
  state.view = "detail";
  render();
}

function renderDetail() {
  const i = state.insumos.find(x => x.id === state.selectedId);
  const pct = Math.min((i.stock / 5000) * 100, 100);

  app.innerHTML = `
    <button class="btn btn-gray" onclick="renderList()">← Volver</button>

    <h1>${i.nombre}</h1>
    <span class="tag">${i.ubicacion}</span>
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
  `;
}

/* ---------- ACCIONES ---------- */

function goHome() {
  state.view = "home";
  render();
}

function addInsumo() {
  const nombre = prompt("Nombre del insumo");
  if (!nombre) return;

  state.insumos.push({
    id: Date.now(),
    nombre,
    unidad: "u",
    ubicacion: state.filtroUbicacion,
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

  save();
  render();
}

render();

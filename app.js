const app = document.getElementById("app");

/* ======================
   CONFIG
====================== */

const FINCAS = ["Finca Juan Luis", "Finca La Limonera", "Finca San Jorge"];
const LOTES = Array.from({ length: 20 }, (_, i) => `Lote ${i + 1}`);

/* ======================
   STORAGE SAFE INIT
====================== */

let storedInsumos = JSON.parse(localStorage.getItem("insumos"));
if (!storedInsumos || storedInsumos.length === 0) {
  storedInsumos = [{
    id: 1,
    nombre: "UREA",
    unidad: "kg",
    ubicacion: "campo",
    stock: 2070,
    minimo: 200,
    movimientos: []
  }];
}

let state = {
  view: "home",
  filtroUbicacion: "campo",
  selectedId: null,
  fincaSeleccionada: null,
  loteSeleccionado: null,

  insumos: storedInsumos,
  tareas: JSON.parse(localStorage.getItem("tareas")) || []
};

function save() {
  localStorage.setItem("insumos", JSON.stringify(state.insumos));
  localStorage.setItem("tareas", JSON.stringify(state.tareas));
}

/* ======================
   RENDER
====================== */

function render() {
  if (state.view === "home") renderHome();
  if (state.view === "list") renderList();
  if (state.view === "detail") renderDetail();
  if (state.view === "tareas") renderTareas();
}

function renderHome() {
  app.innerHTML = `
    <div class="card" onclick="openList('campo')">🌱 Insumos Campo</div>
    <div class="card" onclick="openList('empaque')">📦 Insumos Empaque</div>
    <div class="card" onclick="goTareas()">🧑‍🌾 Tareas</div>
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
    <button onclick="goHome()">← Volver</button>
    <h1>Insumos ${state.filtroUbicacion}</h1>

    ${
      lista.length === 0
        ? "<p>No hay insumos</p>"
        : lista.map(i => `
            <div class="list-item" onclick="openDetail(${i.id})">
              ${i.nombre} – ${i.stock} ${i.unidad}
            </div>
          `).join("")
    }

    <button onclick="abrirModalInsumo()">+ Agregar insumo</button>
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
    <button onclick="renderList()">← Volver</button>
    <h1>${i.nombre}</h1>
    <p>Stock: ${i.stock} ${i.unidad}</p>
    <p>Mínimo: ${i.minimo}</p>
  `;
}

/* ======================
   MODAL INSUMO
====================== */

function abrirModalInsumo() {
  const m = document.createElement("div");
  m.className = "modal-backdrop";

  m.innerHTML = `
    <div class="modal">
      <h3>Nuevo insumo</h3>

      <input id="iNombre" placeholder="Nombre" />
      <input id="iUnidad" placeholder="Unidad (kg, l, u)" />
      <select id="iUbicacion">
        <option value="campo">Campo</option>
        <option value="empaque">Empaque</option>
      </select>
      <input id="iStock" type="number" placeholder="Stock inicial" />
      <input id="iMin" type="number" placeholder="Stock mínimo" />

      <button onclick="cerrarModal()">Cancelar</button>
      <button onclick="guardarInsumo()">Guardar</button>
    </div>
  `;

  document.body.appendChild(m);
}

function guardarInsumo() {
  const nuevo = {
    id: Date.now(),
    nombre: document.getElementById("iNombre").value,
    unidad: document.getElementById("iUnidad").value,
    ubicacion: document.getElementById("iUbicacion").value,
    stock: Number(document.getElementById("iStock").value),
    minimo: Number(document.getElementById("iMin").value),
    movimientos: []
  };

  if (!nuevo.nombre || !nuevo.unidad) {
    alert("Faltan datos");
    return;
  }

  state.insumos.push(nuevo);
  save();
  cerrarModal();
  render();
}

function cerrarModal() {
  document.querySelector(".modal-backdrop")?.remove();
}

/* ======================
   TAREAS (sin tocar)
====================== */

function goTareas() {
  state.view = "tareas";
  render();
}

function renderTareas() {
  app.innerHTML = `
    <button onclick="goHome()">← Volver</button>
    <h1>Tareas</h1>

    ${
      state.tareas.length === 0
        ? "<p>No hay tareas</p>"
        : state.tareas.map(t => `
            <div>${t.descripcion} – ${t.finca} ${t.lote}</div>
          `).join("")
    }
  `;
}

/* ======================
   OTROS
====================== */

function goHome() {
  state.view = "home";
  render();
}

render();

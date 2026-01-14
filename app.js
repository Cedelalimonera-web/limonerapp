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
  filtroUbicacion: "campo",
  selectedId: null,
  fincaSeleccionada: null,
  loteSeleccionado: null,

  insumos: JSON.parse(localStorage.getItem("insumos")) || [],
  tareas: JSON.parse(localStorage.getItem("tareas")) || []
};

function save() {
  localStorage.setItem("insumos", JSON.stringify(state.insumos));
  localStorage.setItem("tareas", JSON.stringify(state.tareas));
}

/* ======================
   RENDER GENERAL
====================== */

function render() {
  if (state.view === "home") renderHome();
  if (state.view === "list") renderList();
  if (state.view === "detail") renderDetail();
  if (state.view === "lotes") renderFincas();
  if (state.view === "lotesFinca") renderLotes();
  if (state.view === "loteDetalle") renderLoteDetalle();
  if (state.view === "tareas") renderTareas();
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

    <div class="card" onclick="goTareas()">
      <div class="card-row">
        <div>
          <div class="big">Tareas</div>
          <div class="ok">${state.tareas.length} registradas</div>
        </div>
        🧑‍🌾
      </div>
    </div>
  `;
}

/* ======================
   INSUMOS (sin cambios)
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

    ${
      lista.length === 0
        ? "<p>No hay insumos</p>"
        : lista.map(i => `
            <div class="list-item" onclick="openDetail(${i.id})">
              <strong>${i.nombre}</strong>
              <span>${i.stock} ${i.unidad}</span>
            </div>
          `).join("")
    }
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
   LOTES – PASO 2 + 3
====================== */

function goLotes() {
  state.view = "lotes";
  render();
}

function renderFincas() {
  app.innerHTML = `
    <button class="btn btn-gray" onclick="goHome()">← Volver</button>
    <h1>Fincas</h1>
    ${FINCAS.map(f => `<div class="list-item" onclick="selectFinca('${f}')">${f}</div>`).join("")}
  `;
}

function selectFinca(f) {
  state.fincaSeleccionada = f;
  state.view = "lotesFinca";
  render();
}

function renderLotes() {
  app.innerHTML = `
    <button class="btn btn-gray" onclick="goLotes()">← Volver</button>
    <h1>${state.fincaSeleccionada}</h1>
    ${LOTES.map(l => `<div class="list-item" onclick="selectLote('${l}')">${l}</div>`).join("")}
  `;
}

function selectLote(l) {
  state.loteSeleccionado = l;
  state.view = "loteDetalle";
  render();
}

function renderLoteDetalle() {
  // INSUMOS
  const movimientosInsumos = [];
  state.insumos.forEach(insumo => {
    insumo.movimientos.forEach(m => {
      if (m.finca === state.fincaSeleccionada && m.lote === state.loteSeleccionado) {
        movimientosInsumos.push(m);
      }
    });
  });

  // TAREAS
  const tareasLote = state.tareas.filter(
    t => t.finca === state.fincaSeleccionada && t.lote === state.loteSeleccionado
  );

  app.innerHTML = `
    <button class="btn btn-gray" onclick="renderLotes()">← Volver</button>
    <h1>${state.fincaSeleccionada} – ${state.loteSeleccionado}</h1>

    <div class="card">
      <h3>🌱 Insumos</h3>
      ${
        movimientosInsumos.length === 0
          ? "<p>Sin insumos registrados</p>"
          : movimientosInsumos.map(m => `
              <p>🕒 ${m.fecha}<br>${m.texto}</p>
            `).join("")
      }
    </div>

    <div class="card">
      <h3>🧑‍🌾 Tareas</h3>
      ${
        tareasLote.length === 0
          ? "<p>Sin tareas registradas</p>"
          : tareasLote.map(t => `
              <p>
                🕒 ${t.fecha}<br>
                <strong>${t.descripcion}</strong><br>
                👷 ${t.personas} | ⏱ ${t.horasH}h | 🚜 ${t.horasM}h | ⛽ ${t.gasoil} L
              </p>
            `).join("")
      }
    </div>
  `;
}

/* ======================
   TAREAS
====================== */

function goTareas() {
  state.view = "tareas";
  render();
}

function renderTareas() {
  app.innerHTML = `
    <button class="btn btn-gray" onclick="goHome()">← Volver</button>
    <h1>Tareas</h1>

    ${
      state.tareas.length === 0
        ? "<p>No hay tareas</p>"
        : state.tareas.map(t => `
            <div class="list-item">
              <strong>${t.descripcion}</strong><br>
              ${t.finca} – ${t.lote}<br>
              👷 ${t.personas} | ⏱ ${t.horasH}h | 🚜 ${t.horasM}h | ⛽ ${t.gasoil} L
            </div>
          `).join("")
    }

    <button class="btn btn-green btn-full" onclick="abrirModalTarea()">+ Agregar tarea</button>
  `;
}

function abrirModalTarea() {
  const modal = document.createElement("div");
  modal.className = "modal-backdrop";

  modal.innerHTML = `
    <div class="modal">
      <h3>Nueva tarea</h3>

      <label>Descripción</label>
      <input id="tDesc" />

      <label>Finca</label>
      <select id="tFinca">${FINCAS.map(f => `<option>${f}</option>`).join("")}</select>

      <label>Lote</label>
      <select id="tLote">${LOTES.map(l => `<option>${l}</option>`).join("")}</select>

      <label>Personas</label>
      <input type="number" id="tPers" />

      <label>Horas hombre</label>
      <input type="number" id="tHH" />

      <label>Horas maquinaria</label>
      <input type="number" id="tHM" />

      <label>Litros gasoil</label>
      <input type="number" id="tGas" />

      <div class="modal-actions">
        <button class="btn btn-gray" onclick="cerrarModal()">Cancelar</button>
        <button class="btn btn-green" onclick="guardarTarea()">Guardar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function guardarTarea() {
  const tarea = {
    descripcion: document.getElementById("tDesc").value,
    finca: document.getElementById("tFinca").value,
    lote: document.getElementById("tLote").value,
    personas: Number(document.getElementById("tPers").value),
    horasH: Number(document.getElementById("tHH").value),
    horasM: Number(document.getElementById("tHM").value),
    gasoil: Number(document.getElementById("tGas").value),
    fecha: new Date().toLocaleString()
  };

  if (!tarea.descripcion) {
    alert("Falta descripción");
    return;
  }

  state.tareas.unshift(tarea);
  save();
  cerrarModal();
  render();
}

function cerrarModal() {
  document.querySelector(".modal-backdrop")?.remove();
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

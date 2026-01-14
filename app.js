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

  insumos: JSON.parse(localStorage.getItem("insumos")) || [
    {
      id: 1,
      nombre: "UREA",
      unidad: "kg",
      ubicacion: "campo",
      stock: 2070,
      minimo: 200,
      movimientos: []
    }
  ]
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
  `;
}

/* ======================
   LISTADO
====================== */

function openList(ubicacion) {
  state.filtroUbicacion = ubicacion;
  state.view = "list";
  render();
}

function renderList() {
  const lista = state.insumos.filter(
    i => i.ubicacion === state.filtroUbicacion
  );

  app.innerHTML = `
    <button class="btn btn-gray" onclick="goHome()">← Volver</button>
    <h1>Insumos ${state.filtroUbicacion === "campo" ? "Campo" : "Empaque"}</h1>

    ${lista.map(i => `
      <div class="list-item" onclick="openDetail(${i.id})">
        <strong>${i.nombre}</strong>
        <span>${i.stock} ${i.unidad}</span>
      </div>
    `).join("")}

    <button class="btn btn-green btn-full" onclick="addInsumo()">
      + Agregar insumo
    </button>
  `;
}

/* ======================
   DETALLE INSUMO
====================== */

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
    <p>Ubicación: ${i.ubicacion}</p>
    <p>Stock mínimo: ${i.minimo}</p>

    <div class="card">
      <div class="stock">${i.stock} ${i.unidad}</div>

      ${
        i.ubicacion === "campo"
          ? `<button class="btn btn-orange btn-full" onclick="abrirModalUso()">− Usar en campo</button>`
          : ""
      }
    </div>

    <div class="card">
      <h3>Últimos movimientos</h3>
      ${
        i.movimientos.length === 0
          ? "<p>No hay movimientos</p>"
          : i.movimientos.map(m => `
              <p style="margin-top:8px">
                🕒 ${m.fecha}<br>
                ${m.texto}
              </p>
            `).join("")
      }
    </div>
  `;
}

/* ======================
   MODAL USO CAMPO
====================== */

function abrirModalUso() {
  const modal = document.createElement("div");
  modal.className = "modal-backdrop";

  modal.innerHTML = `
    <div class="modal">
      <h3>Uso de insumo</h3>

      <label>Cantidad</label>
      <input type="number" id="usoCantidad" min="0" />

      <label>Finca</label>
      <select id="usoFinca">
        <option value="">Seleccionar</option>
        ${FINCAS.map(f => `<option>${f}</option>`).join("")}
      </select>

      <label>Lote</label>
      <select id="usoLote">
        <option value="">Seleccionar</option>
        ${LOTES.map(l => `<option>${l}</option>`).join("")}
      </select>

      <div class="modal-actions">
        <button class="btn btn-gray" onclick="cerrarModal()">Cancelar</button>
        <button class="btn btn-orange" onclick="confirmarUso()">Confirmar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function cerrarModal() {
  document.querySelector(".modal-backdrop")?.remove();
}

function confirmarUso() {
  const cantidad = Number(document.getElementById("usoCantidad").value);
  const finca = document.getElementById("usoFinca").value;
  const lote = document.getElementById("usoLote").value;

  const insumo = state.insumos.find(x => x.id === state.selectedId);

  if (!cantidad || cantidad <= 0) {
    alert("Cantidad inválida");
    return;
  }
  if (!finca || !lote) {
    alert("Seleccioná finca y lote");
    return;
  }
  if (cantidad > insumo.stock) {
    alert("Stock insuficiente");
    return;
  }

  insumo.stock -= cantidad;

  insumo.movimientos.unshift({
    fecha: new Date().toLocaleString(),
    tipo: "uso",
    cantidad,
    finca,
    lote,
    texto: `Se usaron ${cantidad} ${insumo.unidad} – ${finca} – ${lote}`
  });

  save();
  cerrarModal();
  render();
}

/* ======================
   OTROS
====================== */

function addInsumo() {
  const nombre = prompt("Nombre del insumo");
  if (!nombre) return;

  state.insumos.push({
    id: Date.now(),
    nombre,
    unidad: "kg",
    ubicacion: state.filtroUbicacion,
    stock: 0,
    minimo: 0,
    movimientos: []
  });

  save();
  render();
}

function goHome() {
  state.view = "home";
  render();
}

/* ======================
   INIT
====================== */

render();

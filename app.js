const app = document.getElementById("app");

/* ======================
   CONFIGURACIÓN BASE
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
          ? `<button class="btn btn-orange btn-full" onclick="usarInsumoCampo()">− Usar en campo</button>`
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
   USO POR FINCA Y LOTE
====================== */

function usarInsumoCampo() {
  const insumo = state.insumos.find(x => x.id === state.selectedId);

  const cantidad = Number(prompt("Cantidad a usar"));
  if (!cantidad || cantidad <= 0) return;

  if (cantidad > insumo.stock) {
    alert("Stock insuficiente");
    return;
  }

  const finca = prompt(
    "Elegí la finca:\n" + FINCAS.join("\n")
  );
  if (!FINCAS.includes(finca)) {
    alert("Finca inválida");
    return;
  }

  const lote = prompt(
    "Elegí el lote:\n" + LOTES.join("\n")
  );
  if (!LOTES.includes(lote)) {
    alert("Lote inválido");
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

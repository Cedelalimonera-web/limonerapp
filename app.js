const app = document.getElementById(“app”);

/* ======================
CONFIGURACIÓN
====================== */

const FINCAS = [
“Finca Juan Luis”,
“Finca La Limonera”,
“Finca San Jorge”
];

const LOTES = Array.from({ length: 20 }, (_, i) => `Lote ${i + 1}`);

/* ======================
ESTADO
====================== */

let state = {
view: “home”,
filtroUbicacion: “campo”,
selectedId: null,
fincaSeleccionada: null,
loteSeleccionado: null,

insumos: JSON.parse(localStorage.getItem(“insumos”)) || [],
tareas: JSON.parse(localStorage.getItem(“tareas”)) || []
};

function save() {
localStorage.setItem(“insumos”, JSON.stringify(state.insumos));
localStorage.setItem(“tareas”, JSON.stringify(state.tareas));
}

/* ======================
RENDER GENERAL
====================== */

function render() {
if (state.view === “home”) renderHome();
if (state.view === “list”) renderList();
if (state.view === “detail”) renderDetail();
if (state.view === “lotes”) renderFincas();
if (state.view === “lotesFinca”) renderLotes();
if (state.view === “loteDetalle”) renderLoteDetalle();
if (state.view === “tareas”) renderTareas();
}

/* ======================
HOME
====================== */

function renderHome() {
// Contar insumos con stock bajo
const bajoStock = state.insumos.filter(i => i.stockMinimo && i.stock <= i.stockMinimo).length;

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

```
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

${bajoStock > 0 ? `
  <div class="card" style="border: 1px solid #fb923c;">
    <div class="card-row">
      <div>
        <div class="big" style="font-size:16px;">⚠️ Stock bajo</div>
        <div class="warn">${bajoStock} insumo${bajoStock > 1 ? "s" : ""} por debajo del mínimo</div>
      </div>
    </div>
  </div>
` : ""}
```

`;
}

/* ======================
INSUMOS
====================== */

function openList(ubicacion) {
state.filtroUbicacion = ubicacion;
state.view = “list”;
render();
}

function renderList() {
const lista = state.insumos.filter(i => i.ubicacion === state.filtroUbicacion);

app.innerHTML = `
<button class="btn btn-gray" onclick="goHome()">← Volver</button>
<h1 style="margin-top:14px;">Insumos ${state.filtroUbicacion === “campo” ? “Campo” : “Empaque”}</h1>

```
${
  lista.length === 0
    ? "<p style='margin-top:12px;opacity:.7;'>No hay insumos cargados</p>"
    : lista.map(i => {
        const bajo = i.stockMinimo && i.stock <= i.stockMinimo;
        return `
          <div class="list-item" onclick="openDetail(${i.id})" style="${bajo ? "border: 1px solid #fb923c;" : ""}">
            <div>
              <strong>${i.nombre}</strong>
              ${bajo ? `<div class="warn" style="font-size:12px;">⚠️ Stock bajo</div>` : ""}
            </div>
            <span style="color:${bajo ? "#fb923c" : "#4ade80"}">${i.stock} ${i.unidad}</span>
          </div>
        `;
      }).join("")
}

<button class="btn btn-green btn-full" onclick="abrirModalInsumo()">+ Agregar insumo</button>
```

`;
}

function openDetail(id) {
state.selectedId = id;
state.view = “detail”;
render();
}

function renderDetail() {
const i = state.insumos.find(x => x.id === state.selectedId);
const bajo = i.stockMinimo && i.stock <= i.stockMinimo;

app.innerHTML = `
<button class="btn btn-gray" onclick="openList('${i.ubicacion}')">← Volver</button>
<h1 style="margin-top:14px;">${i.nombre}</h1>

```
<div class="card" style="margin-top:12px; ${bajo ? "border: 1px solid #fb923c;" : ""}">
  <div class="stock" style="color:${bajo ? "#fb923c" : "#4ade80"}">${i.stock} ${i.unidad}</div>
  <div style="opacity:.7; margin-top:4px; font-size:13px;">Stock actual</div>
  ${i.stockMinimo ? `<div style="opacity:.6; font-size:12px; margin-top:4px;">Mínimo: ${i.stockMinimo} ${i.unidad}</div>` : ""}
</div>

<div style="display:flex; gap:10px; margin-top:14px;">
  <button class="btn btn-green" style="flex:1;" onclick="abrirModalMovimiento(${i.id}, 'entrada')">➕ Entrada</button>
  <button class="btn btn-orange" style="flex:1;" onclick="abrirModalMovimiento(${i.id}, 'salida')">➖ Salida</button>
</div>

<button class="btn btn-gray btn-full" style="margin-top:10px;" onclick="eliminarInsumo(${i.id})">🗑 Eliminar insumo</button>
```

`;
}

/* ======================
MODAL – NUEVO INSUMO
====================== */

function abrirModalInsumo() {
const modal = document.createElement(“div”);
modal.className = “modal-backdrop”;

modal.innerHTML = `
<div class="modal">
<h3>Nuevo insumo</h3>

```
  <label>Nombre</label>
  <input id="iNombre" placeholder="Ej: Herbicida, Cajas..." />

  <label>Unidad</label>
  <select id="iUnidad">
    <option value="L">Litros (L)</option>
    <option value="kg">Kilogramos (kg)</option>
    <option value="u">Unidades (u)</option>
    <option value="m">Metros (m)</option>
    <option value="tn">Toneladas (tn)</option>
  </select>

  <label>Stock inicial</label>
  <input type="number" id="iStock" placeholder="0" />

  <label>Stock mínimo (alerta)</label>
  <input type="number" id="iMin" placeholder="Opcional" />

  <div class="modal-actions">
    <button class="btn btn-gray" onclick="cerrarModal()">Cancelar</button>
    <button class="btn btn-green" onclick="guardarInsumo()">Guardar</button>
  </div>
</div>
```

`;

document.body.appendChild(modal);
}

function guardarInsumo() {
const nombre = document.getElementById(“iNombre”).value.trim();
const unidad = document.getElementById(“iUnidad”).value;
const stock = Number(document.getElementById(“iStock”).value) || 0;
const stockMinimo = document.getElementById(“iMin”).value !== “”
? Number(document.getElementById(“iMin”).value)
: null;

if (!nombre) {
alert(“Ingresá un nombre para el insumo”);
return;
}

const nuevo = {
id: Date.now(),
nombre,
unidad,
stock,
stockMinimo,
ubicacion: state.filtroUbicacion,
movimientos: []
};

state.insumos.push(nuevo);
save();
cerrarModal();
render();
}

/* ======================
MODAL – MOVIMIENTO DE STOCK
====================== */

function abrirModalMovimiento(id, tipo) {
const insumo = state.insumos.find(x => x.id === id);
const modal = document.createElement(“div”);
modal.className = “modal-backdrop”;

modal.innerHTML = `
<div class="modal">
<h3>${tipo === “entrada” ? “➕ Entrada de stock” : “➖ Salida de stock”}</h3>
<p style="opacity:.7; font-size:13px; margin-bottom:8px;">${insumo.nombre} · Stock actual: ${insumo.stock} ${insumo.unidad}</p>

```
  <label>Cantidad (${insumo.unidad})</label>
  <input type="number" id="mCantidad" placeholder="0" />

  <label>Nota (opcional)</label>
  <input id="mNota" placeholder="Ej: Compra, Aplicación lote 3..." />

  <div class="modal-actions">
    <button class="btn btn-gray" onclick="cerrarModal()">Cancelar</button>
    <button class="btn ${tipo === "entrada" ? "btn-green" : "btn-orange"}" onclick="guardarMovimiento(${id}, '${tipo}')">Confirmar</button>
  </div>
</div>
```

`;

document.body.appendChild(modal);
}

function guardarMovimiento(id, tipo) {
const cantidad = Number(document.getElementById(“mCantidad”).value);
const nota = document.getElementById(“mNota”).value.trim();

if (!cantidad || cantidad <= 0) {
alert(“Ingresá una cantidad válida”);
return;
}

const insumo = state.insumos.find(x => x.id === id);

if (tipo === “salida” && cantidad > insumo.stock) {
alert(`No hay suficiente stock. Stock actual: ${insumo.stock} ${insumo.unidad}`);
return;
}

if (tipo === “entrada”) {
insumo.stock += cantidad;
} else {
insumo.stock -= cantidad;
}

insumo.movimientos = insumo.movimientos || [];
insumo.movimientos.unshift({
tipo,
cantidad,
nota: nota || (tipo === “entrada” ? “Entrada” : “Salida”),
fecha: new Date().toLocaleString(),
finca: state.fincaSeleccionada || null,
lote: state.loteSeleccionado || null,
texto: `${tipo === "entrada" ? "+" : "-"}${cantidad} ${insumo.unidad} – ${nota || ""} (${new Date().toLocaleString()})`
});

save();
cerrarModal();
render();
}

/* ======================
ELIMINAR INSUMO
====================== */

function eliminarInsumo(id) {
if (!confirm(”¿Eliminár este insumo? Se perderá todo su historial.”)) return;
state.insumos = state.insumos.filter(x => x.id !== id);
save();
state.view = “list”;
render();
}

/* ======================
LOTES
====================== */

function goLotes() {
state.view = “lotes”;
render();
}

function renderFincas() {
app.innerHTML = `<button class="btn btn-gray" onclick="goHome()">← Volver</button> <h1 style="margin-top:14px;">Fincas</h1> ${FINCAS.map(f =>`<div class="list-item" onclick="selectFinca('${f}')">${f}</div>`).join("")} `;
}

function selectFinca(f) {
state.fincaSeleccionada = f;
state.view = “lotesFinca”;
render();
}

function renderLotes() {
app.innerHTML = `<button class="btn btn-gray" onclick="goLotes()">← Volver</button> <h1 style="margin-top:14px;">${state.fincaSeleccionada}</h1> ${LOTES.map(l =>`<div class="list-item" onclick="selectLote('${l}')">${l}</div>`).join("")} `;
}

function selectLote(l) {
state.loteSeleccionado = l;
state.view = “loteDetalle”;
render();
}

function renderLoteDetalle() {
const movimientos = [];

state.insumos.forEach(insumo => {
(insumo.movimientos || []).forEach(m => {
if (m.finca === state.fincaSeleccionada && m.lote === state.loteSeleccionado) {
movimientos.push({ …m, nombreInsumo: insumo.nombre, unidad: insumo.unidad });
}
});
});

app.innerHTML = `<button class="btn btn-gray" onclick="renderLotes()">← Volver</button> <h1 style="margin-top:14px;">${state.fincaSeleccionada} – ${state.loteSeleccionado}</h1> ${ movimientos.length === 0 ? "<p style='margin-top:12px;opacity:.7;'>Sin movimientos en este lote</p>" : movimientos.map(m =>`
<div class="list-item" style="flex-direction:column; align-items:flex-start; gap:4px;">
<strong>${m.nombreInsumo}</strong>
<span style=“color:${m.tipo === “entrada” ? “#4ade80” : “#fb923c”}”>
${m.tipo === “entrada” ? “+” : “-”}${m.cantidad} ${m.unidad}
</span>
<span style="opacity:.6; font-size:12px;">${m.nota} · ${m.fecha}</span>
</div>
`).join("") } `;
}

/* ======================
TAREAS
====================== */

function goTareas() {
state.view = “tareas”;
render();
}

function renderTareas() {
app.innerHTML = `
<button class="btn btn-gray" onclick="goHome()">← Volver</button>
<h1 style="margin-top:14px;">Tareas</h1>

```
${
  state.tareas.length === 0
    ? "<p style='margin-top:12px;opacity:.7;'>No hay tareas registradas</p>"
    : state.tareas.map(t => `
        <div class="list-item" style="flex-direction:column; align-items:flex-start; gap:4px;">
          <strong>${t.descripcion}</strong>
          <span style="opacity:.8;">${t.finca} – ${t.lote}</span>
          <span style="opacity:.6; font-size:13px;">👷 ${t.personas} personas · ⏱ ${t.horasH}h hombre · 🚜 ${t.horasM}h máquina · ⛽ ${t.gasoil} L</span>
          <span style="opacity:.5; font-size:12px;">${t.fecha}</span>
        </div>
      `).join("")
}

<button class="btn btn-green btn-full" onclick="abrirModalTarea()">+ Agregar tarea</button>
```

`;
}

function abrirModalTarea() {
const modal = document.createElement(“div”);
modal.className = “modal-backdrop”;

modal.innerHTML = `
<div class="modal">
<h3>Nueva tarea</h3>

```
  <label>Descripción</label>
  <input id="tDesc" />

  <label>Finca</label>
  <select id="tFinca">
    <option value="">Seleccionar</option>
    ${FINCAS.map(f => `<option>${f}</option>`).join("")}
  </select>

  <label>Lote</label>
  <select id="tLote">
    <option value="">Seleccionar</option>
    ${LOTES.map(l => `<option>${l}</option>`).join("")}
  </select>

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
```

`;

document.body.appendChild(modal);
}

function guardarTarea() {
const tarea = {
descripcion: document.getElementById(“tDesc”).value,
finca: document.getElementById(“tFinca”).value,
lote: document.getElementById(“tLote”).value,
personas: Number(document.getElementById(“tPers”).value),
horasH: Number(document.getElementById(“tHH”).value),
horasM: Number(document.getElementById(“tHM”).value),
gasoil: Number(document.getElementById(“tGas”).value),
fecha: new Date().toLocaleString()
};

if (!tarea.descripcion || !tarea.finca || !tarea.lote) {
alert(“Completá descripción, finca y lote”);
return;
}

state.tareas.unshift(tarea);
save();
cerrarModal();
render();
}

function cerrarModal() {
document.querySelector(”.modal-backdrop”)?.remove();
}

/* ======================
OTROS
====================== */

function goHome() {
state.view = “home”;
render();
}

/* ======================
INIT
====================== */

render();

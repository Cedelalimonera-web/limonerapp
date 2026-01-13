const FINCAS = {
  "Finca Juan Luis": 20,
  "Finca La Limonera": 20,
  "Finca San Jorge": 20
};

const INSUMOS = {
  urea: { nombre:"UREA", tipo:"campo", unidad:"kg", stock:2080, movimientos:[] },
  fosfito: { nombre:"Fosfito K", tipo:"campo", unidad:"kg", stock:480, movimientos:[] },
  glifosato: { nombre:"Glifosato", tipo:"campo", unidad:"l", stock:120, movimientos:[] },

  cajas: { nombre:"Cajas Cartón", tipo:"empaque", unidad:"un", stock:1500, movimientos:[] },
  bins: { nombre:"Bins", tipo:"empaque", unidad:"un", stock:320, movimientos:[] },
  film: { nombre:"Film", tipo:"empaque", unidad:"rollos", stock:45, movimientos:[] }
};

let activo = null;

const home = document.getElementById("home");
const listaCampo = document.getElementById("listaCampo");
const listaEmpaque = document.getElementById("listaEmpaque");
const detalle = document.getElementById("detalle");
const back = document.getElementById("btnBack");
const modal = document.getElementById("modal");

function ocultarTodo() {
  home.style.display = "none";
  listaCampo.style.display = "none";
  listaEmpaque.style.display = "none";
  detalle.style.display = "none";
  modal.style.display = "none";
}

function irCampo() {
  ocultarTodo();
  listaCampo.style.display = "block";
  back.style.display = "block";
}

function irEmpaque() {
  ocultarTodo();
  listaEmpaque.style.display = "block";
  back.style.display = "block";
}

back.onclick = () => {
  ocultarTodo();
  home.style.display = "block";
  back.style.display = "none";
};

function abrirInsumo(id) {
  activo = INSUMOS[id];
  ocultarTodo();
  detalle.style.display = "block";
  back.style.display = "block";

  document.getElementById("detalleNombre").textContent = activo.nombre;
  document.getElementById("detalleUbicacion").textContent =
    activo.tipo === "campo" ? "Almacén Campo" : "Empaque";

  document.getElementById("detalleStock").textContent =
    `${activo.stock} ${activo.unidad}`;

  document.getElementById("campoExtra").style.display =
    activo.tipo === "campo" ? "block" : "none";

  renderMovimientos();
}

function renderMovimientos() {
  const ul = document.getElementById("movimientos");
  ul.innerHTML = "";

  activo.movimientos.forEach(m => {
    const li = document.createElement("li");
    li.textContent = m;
    ul.appendChild(li);
  });
}

function abrirModal() {
  modal.style.display = "flex";

  if (activo.tipo === "campo") {
    const finca = document.getElementById("finca");
    finca.innerHTML = "";
    Object.keys(FINCAS).forEach(f => finca.innerHTML += `<option>${f}</option>`);
    cargarLotes();
  }
}

function cargarLotes() {
  const finca = document.getElementById("finca").value;
  const lote = document.getElementById("lote");
  lote.innerHTML = "";
  for (let i = 1; i <= FINCAS[finca]; i++) {
    lote.innerHTML += `<option>Lote ${i}</option>`;
  }
}

document.getElementById("finca").onchange = cargarLotes;

function cerrarModal() {
  modal.style.display = "none";
}

function confirmarUso() {
  const cant = Number(document.getElementById("cantidad").value);
  if (!cant || cant <= 0) return;

  activo.stock -= cant;

  const ahora = new Date().toLocaleString("es-AR");

  let texto = `🕒 ${ahora} — Se usaron ${cant} ${activo.unidad}`;

  if (activo.tipo === "campo") {
    texto += ` en ${document.getElementById("finca").value} – ${document.getElementById("lote").value}`;
  }

  activo.movimientos.unshift(texto);
  cerrarModal();
  abrirInsumo(Object.keys(INSUMOS).find(k => INSUMOS[k] === activo));
}

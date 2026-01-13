const FINCAS = {
  "Finca Juan Luis": 20,
  "Finca La Limonera": 20,
  "Finca San Jorge": 20
};

const INSUMOS = {
  urea: {
    nombre: "UREA",
    unidad: "kg",
    stock: 2100,
    capacidad: 5000,
    movimientos: []
  },
  fosfito: {
    nombre: "Fosfito K",
    unidad: "kg",
    stock: 480,
    capacidad: 1000,
    movimientos: []
  },
  glifosato: {
    nombre: "Glifosato",
    unidad: "l",
    stock: 120,
    capacidad: 500,
    movimientos: []
  }
};

let insumoActivo = null;

// Elementos
const lista = document.getElementById("listaCampo");
const detalle = document.getElementById("detalleInsumo");
const back = document.getElementById("btnBack");
const modal = document.getElementById("modalUsar");

// 🔒 Estado inicial seguro (Safari)
function estadoInicial() {
  lista.style.display = "block";
  detalle.style.display = "none";
  back.style.display = "none";
  modal.style.display = "none";
}
estadoInicial();

// -------- NAVEGACIÓN --------

function abrirInsumo(id) {
  insumoActivo = INSUMOS[id];

  lista.style.display = "none";
  detalle.style.display = "block";
  back.style.display = "block";

  document.getElementById("nombreInsumo").textContent = insumoActivo.nombre;
  document.getElementById("stockValue").textContent =
    `${insumoActivo.stock} ${insumoActivo.unidad}`;
  document.getElementById("capacidadMax").textContent =
    `${insumoActivo.capacidad} ${insumoActivo.unidad}`;

  document.getElementById("stockBar").style.width =
    Math.min((insumoActivo.stock / insumoActivo.capacidad) * 100, 100) + "%";

  renderMovimientos();
}

back.onclick = estadoInicial;

// -------- MOVIMIENTOS --------

function renderMovimientos() {
  const ul = document.getElementById("movimientos");
  ul.innerHTML = "";

  insumoActivo.movimientos.forEach(m => {
    const li = document.createElement("li");

    li.textContent =
      `🕒 ${m.fecha} ${m.hora} — ` +
      `Se usaron ${m.cantidad} ${m.unidad} en ${m.finca} – ${m.lote}`;

    ul.appendChild(li);
  });
}

// -------- MODAL --------

function abrirModal() {
  modal.style.display = "flex";
  cargarFincas();
}

function cerrarModal() {
  modal.style.display = "none";
  document.getElementById("cantidadUsar").value = "";
}

// cerrar tocando fondo
modal.addEventListener("click", (e) => {
  if (e.target === modal) cerrarModal();
});

function cargarFincas() {
  const fincaSel = document.getElementById("fincaSelect");
  fincaSel.innerHTML = "";
  Object.keys(FINCAS).forEach(f => {
    fincaSel.innerHTML += `<option>${f}</option>`;
  });
  cargarLotes();
}

function cargarLotes() {
  const finca = document.getElementById("fincaSelect").value;
  const loteSel = document.getElementById("loteSelect");
  loteSel.innerHTML = "";
  for (let i = 1; i <= FINCAS[finca]; i++) {
    loteSel.innerHTML += `<option>Lote ${i}</option>`;
  }
}

document.getElementById("fincaSelect").onchange = cargarLotes;

// -------- CONFIRMAR USO --------

function confirmarUso() {
  const cant = Number(document.getElementById("cantidadUsar").value);
  if (!cant || cant <= 0 || cant > insumoActivo.stock) return;

  const finca = document.getElementById("fincaSelect").value;
  const lote = document.getElementById("loteSelect").value;

  const ahora = new Date();
  const fecha = ahora.toLocaleDateString("es-AR");
  const hora = ahora.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

  insumoActivo.stock -= cant;

  insumoActivo.movimientos.unshift({
    tipo: "uso",
    cantidad: cant,
    unidad: insumoActivo.unidad,
    finca,
    lote,
    fecha,
    hora
  });

  cerrarModal();

  abrirInsumo(
    Object.keys(INSUMOS).find(k => INSUMOS[k] === insumoActivo)
  );
}

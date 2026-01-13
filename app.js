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

const lista = document.getElementById("listaCampo");
const detalle = document.getElementById("detalleInsumo");
const back = document.getElementById("btnBack");

function abrirInsumo(id) {
  insumoActivo = INSUMOS[id];
  lista.classList.add("hidden");
  detalle.classList.remove("hidden");
  back.classList.remove("hidden");

  document.getElementById("nombreInsumo").textContent = insumoActivo.nombre;
  document.getElementById("stockValue").textContent =
    `${insumoActivo.stock} ${insumoActivo.unidad}`;
  document.getElementById("capacidadMax").textContent =
    `${insumoActivo.capacidad} ${insumoActivo.unidad}`;

  document.getElementById("stockBar").style.width =
    Math.min((insumoActivo.stock / insumoActivo.capacidad) * 100, 100) + "%";

  renderMovimientos();
}

back.onclick = () => {
  detalle.classList.add("hidden");
  lista.classList.remove("hidden");
  back.classList.add("hidden");
};

function renderMovimientos() {
  const ul = document.getElementById("movimientos");
  ul.innerHTML = "";
  insumoActivo.movimientos.forEach(m => {
    const li = document.createElement("li");
    li.textContent = m;
    ul.appendChild(li);
  });
}

function abrirModal() {
  document.getElementById("modalUsar").classList.remove("hidden");
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

function cerrarModal() {
  document.getElementById("modalUsar").classList.add("hidden");
}

function confirmarUso() {
  const cant = Number(document.getElementById("cantidadUsar").value);
  if (!cant || cant <= 0) return;

  insumoActivo.stock -= cant;
  insumoActivo.movimientos.unshift(
    `Se usaron ${cant} ${insumoActivo.unidad}`
  );

  cerrarModal();
  abrirInsumo(Object.keys(INSUMOS).find(k => INSUMOS[k] === insumoActivo));
}

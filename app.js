// ================================
// LimonerApp – app.js
// ================================

let insumos = JSON.parse(localStorage.getItem("insumos")) || [];
let insumoActual = null;

// ----------------
// Inicialización
// ----------------
document.addEventListener("DOMContentLoaded", () => {
  renderLista();
});

// ----------------
// Guardar en localStorage
// ----------------
function guardar() {
  localStorage.setItem("insumos", JSON.stringify(insumos));
}

// ----------------
// Render lista principal
// ----------------
function renderLista() {
  const contenedor = document.getElementById("lista-insumos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  insumos.forEach((insumo, index) => {
    const div = document.createElement("div");
    div.className = "insumo-card";
    div.innerHTML = `
      <h3>${insumo.nombre}</h3>
      <p>Stock: <strong>${insumo.stock} ${insumo.unidad}</strong></p>
    `;
    div.onclick = () => abrirDetalle(index);
    contenedor.appendChild(div);
  });
}

// ----------------
// Abrir detalle insumo
// ----------------
function abrirDetalle(index) {
  insumoActual = index;
  const insumo = insumos[index];

  document.getElementById("detalle-nombre").innerText = insumo.nombre;
  document.getElementById("detalle-stock").innerText =
    `Stock actual: ${insumo.stock} ${insumo.unidad}`;

  renderMovimientos();

  document.getElementById("pantalla-lista").style.display = "none";
  document.getElementById("pantalla-detalle").style.display = "block";
}

// ----------------
// Volver
// ----------------
function volver() {
  document.getElementById("pantalla-detalle").style.display = "none";
  document.getElementById("pantalla-lista").style.display = "block";
}

// ----------------
// Ingresar stock
// ----------------
function ingresarStock() {
  const cantidad = prompt("Cantidad a ingresar:");
  if (!cantidad || isNaN(cantidad)) return;

  const insumo = insumos[insumoActual];
  const valor = Number(cantidad);

  insumo.stock += valor;
  insumo.movimientos.push({
    tipo: "Ingreso",
    cantidad: valor,
    fecha: new Date().toLocaleString()
  });

  guardar();
  abrirDetalle(insumoActual);
}

// ----------------
// Usar stock
// ----------------
function usarStock() {
  const cantidad = prompt("Cantidad a usar:");
  if (!cantidad || isNaN(cantidad)) return;

  const detalle = prompt("Detalle (ej: Cuadro 5):") || "Uso";
  const valor = Number(cantidad);

  const insumo = insumos[insumoActual];
  if (valor > insumo.stock) {
    alert("Stock insuficiente");
    return;
  }

  insumo.stock -= valor;
  insumo.movimientos.push({
    tipo: "Uso",
    cantidad: valor,
    detalle: detalle,
    fecha: new Date().toLocaleString()
  });

  guardar();
  abrirDetalle(insumoActual);
}

// ----------------
// Render movimientos
// ----------------
function renderMovimientos() {
  const lista = document.getElementById("lista-movimientos");
  if (!lista) return;

  lista.innerHTML = "";
  const insumo = insumos[insumoActual];

  if (!insumo.movimientos || insumo.movimientos.length === 0) {
    lista.innerHTML = "<p style='opacity:.6'>Sin movimientos</p>";
    return;
  }

  insumo.movimientos
    .slice()
    .reverse()
    .forEach(mov => {
      const div = document.createElement("div");
      div.className = "movimiento";
      div.innerHTML = `
        <strong>${mov.tipo}</strong> – ${mov.cantidad} ${insumo.unidad}<br>
        ${mov.detalle ? mov.detalle + "<br>" : ""}
        <small>${mov.fecha}</small>
      `;
      lista.appendChild(div);
    });
}

// ----------------
// BOTONES
// ----------------
document.getElementById("btn-ingresar")?.addEventListener("click", ingresarStock);
document.getElementById("btn-usar")?.addEventListener("click", usarStock);
document.getElementById("btn-volver")?.addEventListener("click", volver);

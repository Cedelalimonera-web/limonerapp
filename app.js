// ================================
// LimonerApp – app.js (ESTABLE)
// Base visual avanzada + lógica sólida
// ================================

let insumos = JSON.parse(localStorage.getItem("insumos")) || [];
let insumoActualId = null;

// -------------------------------
// Utilidades
// -------------------------------
function guardar() {
  localStorage.setItem("insumos", JSON.stringify(insumos));
}

function hoy() {
  return new Date().toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function asegurarMovimientos(insumo) {
  if (!Array.isArray(insumo.movimientos)) {
    insumo.movimientos = [];
  }
}

// -------------------------------
// Render lista de insumos
// -------------------------------
function renderLista() {
  const contenedor = document.getElementById("lista-insumos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  insumos.forEach(insumo => {
    asegurarMovimientos(insumo);

    const card = document.createElement("div");
    card.className = "insumo-card";
    card.innerHTML = `
      <strong>${insumo.nombre}</strong>
      <span>Stock: ${insumo.stock} ${insumo.unidad}</span>
    `;

    card.onclick = () => abrirDetalle(insumo.id);
    contenedor.appendChild(card);
  });
}

// -------------------------------
// Abrir detalle
// -------------------------------
function abrirDetalle(id) {
  insumoActualId = id;
  const insumo = insumos.find(i => i.id === id);
  if (!insumo) return;

  asegurarMovimientos(insumo);

  document.getElementById("detalle-nombre").innerText = insumo.nombre;
  document.getElementById("detalle-stock-valor").innerText =
    `${insumo.stock} ${insumo.unidad}`;

  // Barra de stock (si existe)
  const barra = document.getElementById("barra-stock");
  if (barra && insumo.stockMaximo) {
    const pct = Math.min(100, (insumo.stock / insumo.stockMaximo) * 100);
    barra.style.width = pct + "%";
  }

  renderMovimientos();

  document.getElementById("pantalla-lista").style.display = "none";
  document.getElementById("pantalla-detalle").style.display = "block";
}

// -------------------------------
// Volver
// -------------------------------
function volver() {
  document.getElementById("pantalla-detalle").style.display = "none";
  document.getElementById("pantalla-lista").style.display = "block";
  insumoActualId = null;
}

// -------------------------------
// Ingresar stock
// -------------------------------
function ingresarStock() {
  const insumo = insumos.find(i => i.id === insumoActualId);
  if (!insumo) return;

  const cantidad = Number(prompt("Cantidad a ingresar:"));
  if (!cantidad || cantidad <= 0) return;

  const detalle = prompt("Detalle (opcional):") || "Ingreso a almacén";

  insumo.stock += cantidad;
  insumo.movimientos.push({
    tipo: "Ingreso",
    cantidad,
    unidad: insumo.unidad,
    detalle,
    fecha: hoy()
  });

  guardar();
  abrirDetalle(insumo.id);
}

// -------------------------------
// Usar stock
// -------------------------------
function usarStock() {
  const insumo = insumos.find(i => i.id === insumoActualId);
  if (!insumo) return;

  const cantidad = Number(prompt("Cantidad a usar:"));
  if (!cantidad || cantidad <= 0) return;

  if (cantidad > insumo.stock) {
    alert("Stock insuficiente");
    return;
  }

  const detalle = prompt("Destino / detalle (ej: Finca – Lote):");
  if (!detalle) return;

  insumo.stock -= cantidad;
  insumo.movimientos.push({
    tipo: "Uso",
    cantidad,
    unidad: insumo.unidad,
    detalle,
    fecha: hoy()
  });

  guardar();
  abrirDetalle(insumo.id);
}

// -------------------------------
// Render movimientos
// -------------------------------
function renderMovimientos() {
  const contenedor = document.getElementById("lista-movimientos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const insumo = insumos.find(i => i.id === insumoActualId);
  if (!insumo || insumo.movimientos.length === 0) {
    contenedor.innerHTML =
      "<p style='opacity:.6'>Sin movimientos registrados</p>";
    return;
  }

  insumo.movimientos
    .slice()
    .reverse()
    .forEach(mov => {
      const div = document.createElement("div");
      div.className = "movimiento-card";
      div.innerHTML = `
        <div>
          <strong>${mov.fecha}</strong> — 
          ${mov.tipo === "Ingreso" ? "Se ingresaron" : "Se usaron"}
          ${mov.cantidad} ${mov.unidad}
        </div>
        <div style="opacity:.8">${mov.detalle}</div>
      `;
      contenedor.appendChild(div);
    });
}

// -------------------------------
// Botones
// -------------------------------
document.getElementById("btn-ingresar")?.addEventListener("click", ingresarStock);
document.getElementById("btn-usar")?.addEventListener("click", usarStock);
document.getElementById("btn-transferir")?.setAttribute("disabled", true);
document.getElementById("btn-volver")?.addEventListener("click", volver);

// -------------------------------
// Init
// -------------------------------
document.addEventListener("DOMContentLoaded", renderLista);

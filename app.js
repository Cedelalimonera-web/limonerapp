// ==============================
// LimonerApp - app.js
// ==============================

// Traemos elementos del DOM
const btnAgregar = document.getElementById("btnAgregar");
const btnGuardar = document.getElementById("btnGuardar");
const form = document.getElementById("formInsumo");
const lista = document.getElementById("listaInsumos");

const inputNombre = document.getElementById("nombre");
const inputCantidad = document.getElementById("cantidad");
const selectUnidad = document.getElementById("unidad");

// ==============================
// LocalStorage helpers
// ==============================
function obtenerInsumos() {
  return JSON.parse(localStorage.getItem("insumos")) || [];
}

function guardarInsumos(insumos) {
  localStorage.setItem("insumos", JSON.stringify(insumos));
}

// ==============================
// Render de la lista
// ==============================
function renderInsumos() {
  const insumos = obtenerInsumos();
  lista.innerHTML = "";

  if (insumos.length === 0) {
    lista.innerHTML = "<p style='opacity:0.6'>Sin insumos cargados</p>";
    return;
  }

  insumos.forEach((insumo) => {
    const item = document.createElement("div");
    item.className = "insumo-item";
    item.innerText = `${insumo.nombre} – ${insumo.cantidad} ${insumo.unidad}`;
    lista.appendChild(item);
  });
}

// ==============================
// Eventos
// ==============================

// Mostrar / ocultar formulario
btnAgregar.addEventListener("click", () => {
  form.classList.toggle("hidden");
});

// Guardar insumo
btnGuardar.addEventListener("click", () => {
  const nombre = inputNombre.value.trim();
  const cantidad = inputCantidad.value;
  const unidad = selectUnidad.value;

  if (!nombre || !cantidad) {
    alert("Completá nombre y cantidad");
    return;
  }

  const insumo = {
    nombre: nombre,
    cantidad: cantidad,
    unidad: unidad
  };

  const insumos = obtenerInsumos();
  insumos.push(insumo);
  guardarInsumos(insumos);

  // Limpiar formulario
  inputNombre.value = "";
  inputCantidad.value = "";
  selectUnidad.value = "kg";

  // Ocultar formulario
  form.classList.add("hidden");

  // Volver a renderizar
  renderInsumos();
});

// ==============================
// Init
// ==============================
renderInsumos();

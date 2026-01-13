// === ESTADO ===
let insumos = JSON.parse(localStorage.getItem("insumos")) || [];

// === ELEMENTOS ===
const list = document.getElementById("insumosList");
const btnAdd = document.getElementById("btnAdd");

// === RENDER ===
function renderInsumos() {
  list.innerHTML = "";

  if (insumos.length === 0) {
    list.innerHTML = "<p>No hay insumos cargados</p>";
    return;
  }

  insumos.forEach((insumo, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div>
        <div class="card-title">${insumo.nombre}</div>
        <div class="card-unit">Unidad: ${insumo.unidad}</div>
      </div>
    `;

    list.appendChild(card);
  });
}

// === AGREGAR ===
btnAdd.addEventListener("click", () => {
  const nombre = prompt("Nombre del insumo:");
  if (!nombre) return;

  const unidad = prompt("Unidad (lts, kgs, unidades, bolsas, bins):", "kgs");
  if (!unidad) return;

  insumos.push({ nombre, unidad });
  localStorage.setItem("insumos", JSON.stringify(insumos));

  renderInsumos();
});

// === INIT ===
renderInsumos();

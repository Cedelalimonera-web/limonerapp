let insumos = JSON.parse(localStorage.getItem("insumos")) || [];
let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

function guardar() {
  localStorage.setItem("insumos", JSON.stringify(insumos));
  localStorage.setItem("movimientos", JSON.stringify(movimientos));
}

function render() {
  const lista = document.getElementById("lista-insumos");
  const contador = document.getElementById("contador");
  lista.innerHTML = "";
  contador.textContent = insumos.length;

  insumos.forEach((i, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div>
        <strong>${i.nombre}</strong>
        <small>${i.cantidad} ${i.unidad}</small>
      </div>
      <div class="actions">
        <button onclick="usarInsumo(${index})">➖</button>
        <button onclick="ingresarInsumo(${index})">➕</button>
        <button onclick="editarInsumo(${index})">✏️</button>
        <button onclick="borrarInsumo(${index})">🗑️</button>
      </div>
    `;
    lista.appendChild(li);
  });

  renderHistorial();
}

function agregarInsumo() {
  const nombre = prompt("Nombre del insumo:");
  if (!nombre) return;

  const cantidad = Number(prompt("Cantidad inicial:"));
  const unidad = prompt("Unidad (kg, l, unid):", "kg");

  insumos.push({ nombre, cantidad, unidad });
  guardar();
  render();
}

function editarInsumo(i) {
  const nuevoNombre = prompt("Nuevo nombre:", insumos[i].nombre);
  const nuevaCantidad = Number(prompt("Nueva cantidad:", insumos[i].cantidad));
  if (!nuevoNombre) return;

  insumos[i].nombre = nuevoNombre;
  insumos[i].cantidad = nuevaCantidad;
  guardar();
  render();
}

function borrarInsumo(i) {
  if (!confirm("¿Eliminar insumo?")) return;
  insumos.splice(i, 1);
  guardar();
  render();
}

function usarInsumo(i) {
  const cant = Number(prompt("Cantidad usada:"));
  if (!cant) return;

  insumos[i].cantidad -= cant;
  registrarMovimiento(insumos[i].nombre, -cant);
  guardar();
  render();
}

function ingresarInsumo(i) {
  const cant = Number(prompt("Cantidad ingresada:"));
  if (!cant) return;

  insumos[i].cantidad += cant;
  registrarMovimiento(insumos[i].nombre, cant);
  guardar();
  render();
}

function registrarMovimiento(nombre, cantidad) {
  movimientos.unshift({
    fecha: new Date().toLocaleString(),
    nombre,
    cantidad
  });
}

function renderHistorial() {
  const h = document.getElementById("historial");
  h.innerHTML = "";

  movimientos.slice(0, 20).forEach(m => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${m.nombre}</strong>
        <small>${m.fecha}</small>
      </div>
      <div>${m.cantidad > 0 ? "+" : ""}${m.cantidad}</div>
    `;
    h.appendChild(li);
  });
}

render();

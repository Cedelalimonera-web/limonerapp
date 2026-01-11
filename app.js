let insumos = JSON.parse(localStorage.getItem("limonerapp_insumos")) || [];

function guardar() {
  localStorage.setItem("limonerapp_insumos", JSON.stringify(insumos));
}

function render() {
  const lista = document.getElementById("listaInsumos");
  lista.innerHTML = "";

  insumos.forEach((insumo, index) => {
    const li = document.createElement("li");
    li.className = "insumo";

    li.innerHTML = `
      <div>
        <div class="insumo-nombre">${insumo.nombre}</div>
        <div>Stock: ${insumo.cantidad}</div>
      </div>
      <div class="controles">
        <button onclick="sumar(${index})">➕</button>
        <button onclick="restar(${index})">➖</button>
        <button onclick="eliminar(${index})">🗑</button>
      </div>
    `;

    lista.appendChild(li);
  });
}

function agregarInsumo() {
  const nombre = document.getElementById("nombreInsumo").value.trim();
  const cantidad = parseInt(document.getElementById("cantidadInsumo").value);

  if (!nombre || isNaN(cantidad)) return;

  insumos.push({ nombre, cantidad });
  guardar();
  render();

  document.getElementById("nombreInsumo").value = "";
  document.getElementById("cantidadInsumo").value = "";
}

function sumar(index) {
  insumos[index].cantidad++;
  guardar();
  render();
}

function restar(index) {
  if (insumos[index].cantidad > 0) {
    insumos[index].cantidad--;
    guardar();
    render();
  }
}

function eliminar(index) {
  const ok = confirm("¿Eliminar este insumo?");
  if (!ok) return;

  insumos.splice(index, 1);
  guardar();
  render();
}

render();

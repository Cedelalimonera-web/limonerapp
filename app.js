let insumos = JSON.parse(localStorage.getItem("insumos")) || [];
let historial = JSON.parse(localStorage.getItem("historial")) || [];

const list = document.getElementById("insumosList");
const histList = document.getElementById("historialList");

const modal = document.getElementById("modal");
document.getElementById("addBtn").onclick = () => modal.classList.remove("hidden");
document.getElementById("cancelar").onclick = () => modal.classList.add("hidden");

document.getElementById("guardar").onclick = () => {
  const nombre = document.getElementById("nombre").value;
  const cantidad = Number(document.getElementById("cantidad").value);
  const unidad = document.getElementById("unidad").value;

  if (!nombre || !cantidad) return;

  insumos.push({ nombre, cantidad, unidad });
  historial.unshift(`${new Date().toLocaleString()} ➜ Alta de ${nombre}: ${cantidad} ${unidad}`);

  guardar();
  modal.classList.add("hidden");
  document.getElementById("nombre").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("unidad").value = "";

  render();
};

function modificar(index, delta) {
  insumos[index].cantidad += delta;
  historial.unshift(
    `${new Date().toLocaleString()} ➜ ${delta > 0 ? "Ingreso" : "Uso"} de ${insumos[index].nombre}: ${Math.abs(delta)} ${insumos[index].unidad}`
  );
  guardar();
  render();
}

function render() {
  list.innerHTML = "";
  insumos.forEach((i, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${i.nombre}</strong><br>
      Stock: ${i.cantidad} ${i.unidad}<br>
      <button onclick="modificar(${index}, 1)">+1</button>
      <button onclick="modificar(${index}, -1)">-1</button>
    `;
    list.appendChild(li);
  });

  histList.innerHTML = "";
  historial.slice(0, 20).forEach(h => {
    const li = document.createElement("li");
    li.textContent = h;
    histList.appendChild(li);
  });
}

function guardar() {
  localStorage.setItem("insumos", JSON.stringify(insumos));
  localStorage.setItem("historial", JSON.stringify(historial));
}

render();

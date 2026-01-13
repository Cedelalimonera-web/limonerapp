const btnAgregar = document.getElementById("btnAgregar");
const modal = document.getElementById("modal");
const guardar = document.getElementById("guardar");
const cancelar = document.getElementById("cancelar");
const lista = document.getElementById("listaInsumos");

let insumos = JSON.parse(localStorage.getItem("insumos")) || [];

function render() {
  lista.innerHTML = "";
  insumos.forEach(i => {
    const li = document.createElement("li");
    li.textContent = `${i.nombre} (${i.unidad})`;
    lista.appendChild(li);
  });
}

btnAgregar.onclick = () => {
  modal.classList.remove("hidden");
};

cancelar.onclick = () => {
  modal.classList.add("hidden");
};

guardar.onclick = () => {
  const nombre = document.getElementById("nombre").value.trim();
  const unidad = document.getElementById("unidad").value;

  if (!nombre || !unidad) return;

  insumos.push({ nombre, unidad });
  localStorage.setItem("insumos", JSON.stringify(insumos));

  document.getElementById("nombre").value = "";
  document.getElementById("unidad").value = "";

  modal.classList.add("hidden");
  render();
};

render();

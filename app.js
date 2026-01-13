const btnAgregar = document.getElementById("btnAgregar");
const formulario = document.getElementById("formulario");
const guardar = document.getElementById("guardar");
const lista = document.getElementById("lista");

let insumos = JSON.parse(localStorage.getItem("insumos")) || [];

btnAgregar.addEventListener("click", () => {
  formulario.classList.toggle("hidden");
});

guardar.addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value;
  const cantidad = document.getElementById("cantidad").value;
  const unidad = document.getElementById("unidad").value;

  if (!nombre || !cantidad) return;

  insumos.push({ nombre, cantidad, unidad });
  localStorage.setItem("insumos", JSON.stringify(insumos));

  document.getElementById("nombre").value = "";
  document.getElementById("cantidad").value = "";

  formulario.classList.add("hidden");
  render();
});

function render() {
  lista.innerHTML = "";
  insumos.forEach(i => {
    const li = document.createElement("li");
    li.textContent = `${i.nombre} – ${i.cantidad} ${i.unidad}`;
    lista.appendChild(li);
  });
}

render();

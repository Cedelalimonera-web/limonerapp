let items = JSON.parse(localStorage.getItem("insumos")) || [];

const addBtn = document.getElementById("addBtn");
const formSection = document.getElementById("formSection");
const saveBtn = document.getElementById("saveBtn");
const nameInput = document.getElementById("nameInput");
const unitInput = document.getElementById("unitInput");
const itemList = document.getElementById("itemList");

// Mostrar / ocultar formulario
addBtn.addEventListener("click", () => {
  formSection.classList.toggle("hidden");
});

// Guardar insumo
saveBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const unit = unitInput.value;

  if (!name || !unit) {
    alert("Completá nombre y unidad");
    return;
  }

  const newItem = {
    id: Date.now(),
    name,
    unit
  };

  items.push(newItem);
  localStorage.setItem("insumos", JSON.stringify(items));

  nameInput.value = "";
  unitInput.value = "";
  formSection.classList.add("hidden");

  renderList();
});

// Renderizar lista
function renderList() {
  itemList.innerHTML = "";

  items.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name}</span>
      <span>${item.unit}</span>
    `;
    itemList.appendChild(li);
  });
}

renderList();

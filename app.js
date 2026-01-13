const addBtn = document.getElementById("addBtn");
const modal = document.getElementById("modal");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const nameInput = document.getElementById("nameInput");
const unitInput = document.getElementById("unitInput");
const itemsDiv = document.getElementById("items");

let items = JSON.parse(localStorage.getItem("items")) || [];

function saveItems() {
  localStorage.setItem("items", JSON.stringify(items));
}

function renderItems() {
  itemsDiv.innerHTML = "";

  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${item.name}</h3>
      <div class="quantity">${item.qty} ${item.unit}</div>
      <div class="actions">
        <button class="plus">+</button>
        <button class="minus">−</button>
        <button class="delete">🗑</button>
      </div>
    `;

    card.querySelector(".plus").onclick = () => {
      item.qty++;
      saveItems();
      renderItems();
    };

    card.querySelector(".minus").onclick = () => {
      if (item.qty > 0) item.qty--;
      saveItems();
      renderItems();
    };

    card.querySelector(".delete").onclick = () => {
      items.splice(index, 1);
      saveItems();
      renderItems();
    };

    itemsDiv.appendChild(card);
  });
}

addBtn.onclick = () => {
  nameInput.value = "";
  unitInput.value = "";
  modal.classList.remove("hidden");
};

cancelBtn.onclick = () => {
  modal.classList.add("hidden");
};

saveBtn.onclick = () => {
  const name = nameInput.value.trim();
  const unit = unitInput.value;

  if (!name || !unit) {
    alert("Completá nombre y unidad");
    return;
  }

  items.push({
    name,
    unit,
    qty: 0
  });

  saveItems();
  renderItems();
  modal.classList.add("hidden");
};

renderItems();

const STORAGE_KEY = "limonerapp_urea";

const DEFAULT_DATA = {
  nombre: "UREA",
  ubicacion: "Almacén Campo",
  stock: 2400,
  stockMinimo: 200,
  capacidadMax: 5000,
  movimientos: [
    { texto: "Se usaron 600 kg en Lote 4", tipo: "out" },
    { texto: "Se ingresaron 1.200 kg (Compra)", tipo: "in" }
  ]
};

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : DEFAULT_DATA;
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let data = loadData();

const stockValue = document.getElementById("stockValue");
const stockBar = document.getElementById("stockBar");
const movimientosList = document.getElementById("movimientos");

function render() {
  stockValue.textContent = `${data.stock.toLocaleString()} kg`;

  const percent = Math.min(
    (data.stock / data.capacidadMax) * 100,
    100
  );
  stockBar.style.width = percent + "%";

  movimientosList.innerHTML = "";
  data.movimientos.forEach(m => {
    const li = document.createElement("li");
    li.textContent = m.texto;
    movimientosList.appendChild(li);
  });
}

document.getElementById("btnIngresar").onclick = () => {
  const cantidad = prompt("Cantidad a ingresar (kg):");
  const n = Number(cantidad);
  if (!n || n <= 0) return;

  data.stock += n;
  data.movimientos.unshift({
    texto: `Se ingresaron ${n} kg`,
    tipo: "in"
  });

  saveData(data);
  render();
};

document.getElementById("btnUsar").onclick = () => {
  const cantidad = prompt("Cantidad a usar (kg):");
  const n = Number(cantidad);
  if (!n || n <= 0) return;

  if (n > data.stock) {
    alert("Stock insuficiente");
    return;
  }

  data.stock -= n;
  data.movimientos.unshift({
    texto: `Se usaron ${n} kg`,
    tipo: "out"
  });

  saveData(data);
  render();
};

render();

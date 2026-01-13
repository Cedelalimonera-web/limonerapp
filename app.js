const STORAGE_KEY = "limonerapp_urea_v2";

const FINCAS = {
  "Finca Juan Luis": 20,
  "Finca La Limonera": 20,
  "Finca San Jorge": 20
};

const DEFAULT_DATA = {
  stock: 2400,
  capacidadMax: 5000,
  movimientos: [
    {
      texto: "Se usaron 600 kg en Finca Juan Luis – Lote 4",
      fecha: "11/01/2026",
      hora: "10:30"
    },
    {
      texto: "Se ingresaron 1.200 kg (Compra)",
      fecha: "10/01/2026",
      hora: "18:10"
    }
  ]
};

function loadData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_DATA;
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let data = loadData();

const stockValue = document.getElementById("stockValue");
const stockBar = document.getElementById("stockBar");
const movimientosList = document.getElementById("movimientos");

const modal = document.getElementById("modalUsar");
const fincaSelect = document.getElementById("fincaSelect");
const loteSelect = document.getElementById("loteSelect");
const cantidadInput = document.getElementById("cantidadUsar");

function render() {
  stockValue.textContent = `${data.stock.toLocaleString()} kg`;
  stockBar.style.width = Math.min((data.stock / data.capacidadMax) * 100, 100) + "%";

  movimientosList.innerHTML = "";
  data.movimientos.forEach(m => {
    const li = document.createElement("li");
    li.textContent = `🕒 ${m.fecha} ${m.hora} — ${m.texto}`;
    movimientosList.appendChild(li);
  });
}

function cargarFincas() {
  fincaSelect.innerHTML = "";
  Object.keys(FINCAS).forEach(f => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f;
    fincaSelect.appendChild(opt);
  });
  cargarLotes();
}

function cargarLotes() {
  loteSelect.innerHTML = "";
  const finca = fincaSelect.value;
  const total = FINCAS[finca];
  for (let i = 1; i <= total; i++) {
    const opt = document.createElement("option");
    opt.value = `Lote ${i}`;
    opt.textContent = `Lote ${i}`;
    loteSelect.appendChild(opt);
  }
}

document.getElementById("btnUsar").onclick = () => {
  modal.classList.remove("hidden");
  cargarFincas();
};

document.getElementById("cancelarUso").onclick = () => {
  modal.classList.add("hidden");
  cantidadInput.value = "";
};

document.getElementById("confirmarUso").onclick = () => {
  const cantidad = Number(cantidadInput.value);
  if (!cantidad || cantidad <= 0 || cantidad > data.stock) {
    alert("Cantidad inválida");
    return;
  }

  const ahora = new Date();
  const fecha = ahora.toLocaleDateString();
  const hora = ahora.toLocaleTimeString().slice(0,5);

  data.stock -= cantidad;
  data.movimientos.unshift({
    texto: `Se usaron ${cantidad} kg en ${fincaSelect.value} – ${loteSelect.value}`,
    fecha,
    hora
  });

  saveData(data);
  modal.classList.add("hidden");
  cantidadInput.value = "";
  render();
};

fincaSelect.onchange = cargarLotes;

render();

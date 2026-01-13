// --------- NAVEGACIÓN ----------
const home = document.getElementById("home");
const lluviaSec = document.getElementById("lluvia");
const back = document.getElementById("btnBack");

function ocultarTodo() {
  home.style.display = "none";
  lluviaSec.style.display = "none";
  document.getElementById("modalLluvia").style.display = "none";
}

back.onclick = () => {
  ocultarTodo();
  home.style.display = "block";
  back.style.display = "none";
};

function irCampo() {
  alert("Campo (ya implementado en versión anterior)");
}

function irEmpaque() {
  alert("Empaque (ya implementado en versión anterior)");
}

// --------- LLUVIA ----------
const calendario = document.getElementById("calendario");
const mesTitulo = document.getElementById("mesTitulo");
const totalMesEl = document.getElementById("totalMes");
const diasLluviaEl = document.getElementById("diasLluvia");
const resumenHome = document.getElementById("lluviaResumen");

let lluviaData = {};
let diaActual = "";

function irLluvia() {
  ocultarTodo();
  lluviaSec.style.display = "block";
  back.style.display = "block";
  renderCalendario();
}

function renderCalendario() {
  calendario.innerHTML = "";

  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = hoy.getMonth();

  mesTitulo.textContent = hoy.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric"
  });

  const primerDia = new Date(año, mes, 1);
  const offset = (primerDia.getDay() + 6) % 7; // lunes primero
  const diasMes = new Date(año, mes + 1, 0).getDate();

  for (let i = 0; i < offset; i++) {
    calendario.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= diasMes; d++) {
    const fechaKey = `${año}-${mes+1}-${d}`;
    const div = document.createElement("div");
    div.className = "dia";
    div.textContent = d;

    if (lluviaData[fechaKey] > 0) div.classList.add("lluvia");

    div.onclick = () => abrirModalLluvia(fechaKey, d);
    calendario.appendChild(div);
  }

  actualizarResumen();
}

function abrirModalLluvia(key, dia) {
  diaActual = key;
  document.getElementById("diaSeleccionado").textContent = `Día ${dia}`;
  document.getElementById("mmInput").value = lluviaData[key] || 0;
  document.getElementById("modalLluvia").style.display = "flex";
}

function cerrarModalLluvia() {
  document.getElementById("modalLluvia").style.display = "none";
}

function guardarLluvia() {
  const mm = Number(document.getElementById("mmInput").value);
  if (mm < 0 || mm > 400) return;

  lluviaData[diaActual] = mm;
  cerrarModalLluvia();
  renderCalendario();
}

function actualizarResumen() {
  const valores = Object.values(lluviaData);
  const total = valores.reduce((a,b)=>a+b,0);
  const dias = valores.filter(v=>v>0).length;

  totalMesEl.textContent = total;
  diasLluviaEl.textContent = dias;
  resumenHome.textContent = `${total} mm · ${dias} días`;
}

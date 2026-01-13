/* ================= ESTADO ================= */

let vistaActual = "home";
let insumoActual = null;
let tipoActual = null; // campo | empaque
let accionActual = null;

const fincas = [
  "Finca Juan Luis",
  "Finca La Limonera",
  "Finca San Jorge"
];

const lotes = Array.from({length:20}, (_,i)=>`Lote ${i+1}`);

/* ================= DATOS ================= */

let campo = JSON.parse(localStorage.getItem("campo")) || [
  {id:1, nombre:"UREA", stock:2080, unidad:"kg"},
  {id:2, nombre:"Fosfito K", stock:480, unidad:"kg"},
  {id:3, nombre:"Glifosato", stock:120, unidad:"l"}
];

let empaque = JSON.parse(localStorage.getItem("empaque")) || [
  {id:101, nombre:"Cajas cartón", stock:3500, unidad:"u"},
  {id:102, nombre:"Bin plástico", stock:120, unidad:"u"},
  {id:103, nombre:"Film stretch", stock:18, unidad:"rollos"}
];

let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

/* ================= NAVEGACIÓN ================= */

function mostrar(id){
  document.querySelectorAll("section").forEach(s=>s.style.display="none");
  document.getElementById(id).style.display="block";
  document.getElementById("btnBack").style.display = id==="home" ? "none":"block";
  vistaActual = id;
}

function volverHome(){
  mostrar("home");
}

function irCampo(){
  renderCampo();
  mostrar("campo");
}

function irEmpaque(){
  renderEmpaque();
  mostrar("empaque");
}

/* ================= LISTAS ================= */

function renderCampo(){
  const c = document.getElementById("listaCampo");
  c.innerHTML = "";
  campo.forEach(i=>{
    c.innerHTML += `
      <div class="item" onclick="abrirDetalle(${i.id},'campo')">
        <strong>${i.nombre}</strong>
        <span>Stock: ${i.stock} ${i.unidad}</span>
      </div>`;
  });
}

function renderEmpaque(){
  const e = document.getElementById("listaEmpaque");
  e.innerHTML = "";
  empaque.forEach(i=>{
    e.innerHTML += `
      <div class="item" onclick="abrirDetalle(${i.id},'empaque')">
        <strong>${i.nombre}</strong>
        <span>Stock: ${i.stock} ${i.unidad}</span>
      </div>`;
  });
}

/* ================= DETALLE ================= */

function abrirDetalle(id,tipo){
  tipoActual = tipo;
  insumoActual = (tipo==="campo"?campo:empaque).find(i=>i.id===id);

  let html = `
    <h2>${insumoActual.nombre}</h2>
    <p>Stock actual: <strong>${insumoActual.stock} ${insumoActual.unidad}</strong></p>

    <div class="acciones">
      <button class="btn green" onclick="abrirModal('ingresar')">+ Ingresar</button>
      <button class="btn orange" onclick="abrirModal('usar')">- Usar</button>
    </div>

    <h3>Últimos movimientos</h3>
  `;

  movimientos
    .filter(m=>m.insumo===insumoActual.nombre)
    .slice(-5)
    .reverse()
    .forEach(m=>{
      html += `<p>${m.fecha} — ${m.texto}</p>`;
    });

  document.getElementById("detalle").innerHTML = html;
  mostrar("detalle");
}

/* ================= MODAL ================= */

function abrirModal(accion){
  accionActual = accion;
  document.getElementById("modal").style.display="flex";
  document.getElementById("modalTitulo").textContent =
    (accion==="ingresar"?"Ingresar":"Usar")+" "+insumoActual.nombre;

  document.getElementById("modalCantidad").value="";

  const f = document.getElementById("modalFinca");
  const l = document.getElementById("modalLote");

  if(tipoActual==="campo"){
    f.style.display="block";
    l.style.display="block";
    f.innerHTML = fincas.map(x=>`<option>${x}</option>`).join("");
    l.innerHTML = lotes.map(x=>`<option>${x}</option>`).join("");
  } else {
    f.style.display="none";
    l.style.display="none";
  }
}

function cerrarModal(){
  document.getElementById("modal").style.display="none";
}

/* ================= CONFIRMAR ================= */

function confirmarModal(){
  const cant = Number(document.getElementById("modalCantidad").value);
  if(!cant || cant<=0) return;

  if(accionActual==="ingresar") insumoActual.stock += cant;
  else insumoActual.stock -= cant;

  const ahora = new Date().toLocaleString("es");

  let texto = accionActual==="ingresar"
    ? `Se ingresaron ${cant} ${insumoActual.unidad}`
    : `Se usaron ${cant} ${insumoActual.unidad}`;

  if(tipoActual==="campo"){
    texto += ` en ${modalFinca.value} - ${modalLote.value}`;
  }

  movimientos.push({
    insumo: insumoActual.nombre,
    texto,
    fecha: ahora
  });

  localStorage.setItem("campo",JSON.stringify(campo));
  localStorage.setItem("empaque",JSON.stringify(empaque));
  localStorage.setItem("movimientos",JSON.stringify(movimientos));

  cerrarModal();
  abrirDetalle(insumoActual.id,tipoActual);
}

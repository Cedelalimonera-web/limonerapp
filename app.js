const home = document.getElementById("home");
const lluviaSec = document.getElementById("lluvia");
const back = document.getElementById("btnBack");

const resumenHome = document.getElementById("lluviaResumen");

let lluvias = {};
let selAnio, selMes, selDia;
let alertaIntervalo = null;

// ---------------- NAVEGACIÓN ----------------
function irLluvia(){
  home.style.display="none";
  lluviaSec.style.display="block";
  back.style.display="block";
  initLluvia();
}

back.onclick=()=>{
  lluviaSec.style.display="none";
  home.style.display="block";
  back.style.display="none";
};

// ---------------- LLUVIA ----------------
function initLluvia(){
  const hoy=new Date();
  selAnio=hoy.getFullYear();
  selMes=hoy.getMonth()+1;

  cargarSelectores();
  renderCalendario();
}

function cargarSelectores(){
  const anioSel=document.getElementById("anio");
  const mesSel=document.getElementById("mes");

  anioSel.innerHTML="";
  mesSel.innerHTML="";

  for(let a=2024;a<=2028;a++){
    anioSel.innerHTML+=`<option ${a===selAnio?"selected":""}>${a}</option>`;
  }

  const meses=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  meses.forEach((m,i)=>{
    mesSel.innerHTML+=`<option value="${i+1}" ${i+1===selMes?"selected":""}>${m}</option>`;
  });

  anioSel.onchange=e=>{selAnio=+e.target.value;renderCalendario();}
  mesSel.onchange=e=>{selMes=+e.target.value;renderCalendario();}
}

function renderCalendario(){
  const cal=document.getElementById("calendario");
  cal.innerHTML="";

  if(!lluvias[selAnio]) lluvias[selAnio]={};
  if(!lluvias[selAnio][selMes]) lluvias[selAnio][selMes]={};

  const diasMes=new Date(selAnio,selMes,0).getDate();

  for(let d=1;d<=diasMes;d++){
    const mm=lluvias[selAnio][selMes][d]||0;
    const div=document.createElement("div");
    div.className="dia"+(mm>0?" lluvia":"");
    div.textContent=d;
    div.onclick=()=>abrirModal(d);
    cal.appendChild(div);
  }

  actualizarResumen();
  detectarAlerta();
}

function abrirModal(d){
  selDia=d;
  document.getElementById("diaTxt").textContent=`Día ${d}`;
  document.getElementById("mmInput").value=lluvias[selAnio][selMes][d]||0;
  document.getElementById("modalLluvia").style.display="flex";
}

function cerrarModal(){
  document.getElementById("modalLluvia").style.display="none";
}

function guardarLluvia(){
  const mm=+document.getElementById("mmInput").value;
  lluvias[selAnio][selMes][selDia]=mm;
  cerrarModal();
  renderCalendario();
}

// ---------------- RESUMEN + HOME ----------------
function actualizarResumen(){
  const datos=Object.values(lluvias[selAnio][selMes]);
  const total=datos.reduce((a,b)=>a+b,0);
  const dias=datos.filter(v=>v>0).length;

  document.getElementById("totalMes").textContent=total;
  document.getElementById("diasLluvia").textContent=dias;

  const mesTxt=new Date(selAnio,selMes-1).toLocaleString("es",{month:"long"});
  let resumen=`${mesTxt} · ${total} mm · ${dias} días`;

  if(alertaIntervalo){
    resumen+=`\n⚠️ ${alertaIntervalo}`;
  }

  resumenHome.textContent=resumen;
}

// ---------------- ALERTA LLUVIA PROLONGADA ----------------
function detectarAlerta(){
  const alerta=document.getElementById("alertaLluvia");
  alerta.style.display="none";
  alertaIntervalo=null;

  let seguidos=0;
  let inicio=null;

  const datos=lluvias[selAnio][selMes];

  for(let d=1;d<=31;d++){
    if((datos[d]||0)>0){
      if(seguidos===0) inicio=d;
      seguidos++;

      if(seguidos>=4){
        const mesTxt=new Date(selAnio,selMes-1).toLocaleString("es",{month:"short"});
        alertaIntervalo=`${inicio}–${d} ${mesTxt} (${seguidos} días)`;
        alerta.style.display="block";
        alerta.textContent=`⚠️ Lluvia prolongada del ${inicio} al ${d}`;
        break;
      }
    }else{
      seguidos=0;
      inicio=null;
    }
  }
}

let cantidad = 5;
let aciertos = 0;
let indice = 0;
let inicio = 0;
let operaciones = [];

const $ = (s) => document.querySelector(s);
const el = {
  config: $("#config"),
  inputCantidad: $("#cantidad"),
  btnIniciar: $("#btnIniciar"),

  juego: $("#juego"),
  pregunta: $("#pregunta"),
  respuesta: $("#respuesta"),
  btnResponder: $("#btnResponder"),
  feedback: $("#feedback"),
  progreso: $("#progreso"),

  resumen: $("#resumen"),
};

const CLAVE_CANTIDAD = "juego.cantidad";

function cargarPreferencias() {
  const guardado = Number(localStorage.getItem(CLAVE_CANTIDAD));
  if (Number.isFinite(guardado) && guardado >= 1 && guardado <= 10) {
    cantidad = guardado;
    el.inputCantidad.value = cantidad;
  } else {
    el.inputCantidad.value = 5;
  }
}

function guardarPreferencias() {
  localStorage.setItem(CLAVE_CANTIDAD, String(cantidad));
}

function iniciarJuego() {
  const n = Number(el.inputCantidad.value);
  cantidad = Number.isFinite(n) && n >= 1 && n <= 10 ? n : 5;
  guardarPreferencias();

  aciertos = 0;
  indice = 0;
  inicio = Date.now();
  operaciones = crearOperaciones(cantidad);

  el.config.style.display = "none";
  el.juego.style.display = "block";
  el.resumen.style.display = "none";

  mostrarPregunta();
}

function crearOperaciones(n) {
  const lista = [];
  for (let i = 0; i < n; i++) {
    const a = Math.floor(Math.random() * 100) + 1;
    const b = Math.floor(Math.random() * 100) + 1;
    const esSuma = Math.random() < 0.5;
    const texto = esSuma ? `${a} + ${b}` : `${a} - ${b}`;
    const resultado = esSuma ? a + b : a - b;
    lista.push({ texto, resultado });
  }
  return lista;
}

function mostrarPregunta() {
  if (indice >= operaciones.length) {
    terminarJuego();
    return;
  }
  const op = operaciones[indice];
  el.pregunta.textContent = `Pregunta ${indice + 1}/${cantidad}: ¿Cuánto es ${
    op.texto
  }?`;
  el.progreso.textContent = `Aciertos: ${aciertos} | Restan: ${
    cantidad - indice
  }`;
  el.respuesta.value = "";
  el.feedback.textContent = "";
  el.respuesta.focus();
}

function comprobarRespuesta() {
  const op = operaciones[indice];
  const valor = Number(el.respuesta.value);

  if (Number.isFinite(valor) && valor === op.resultado) {
    aciertos++;
    el.feedback.textContent = "Correcto";
    el.feedback.style.color = "green";
  } else {
    el.feedback.textContent = `Incorrecto. Era ${op.resultado}`;
    el.feedback.style.color = "red";
  }

  indice++;
  setTimeout(mostrarPregunta, 600);
}

function terminarJuego() {
  el.juego.style.display = "none";
  el.resumen.style.display = "block";

  const segundos = Math.floor((Date.now() - inicio) / 1000);
  const porcentaje = Math.round((aciertos / cantidad) * 100);

  el.resumen.innerHTML = `
    <h2>Juego finalizado</h2>
    <p>Aciertos: <strong>${aciertos}</strong> de ${cantidad} (${porcentaje}%)</p>
    <p>Tiempo: <strong>${segundos}</strong> segundos</p>
    <p id="datoExtra">Cargando dato extra...</p>
    <div style="display:flex; gap:.5rem; flex-wrap:wrap; margin-top:.5rem">
      <button id="btnReintentar">Reintentar</button>
      <button id="btnCambiar">Cambiar cantidad</button>
    </div>
  `;

  axios
    .get("https://uselessfacts.jsph.pl/random.json?language=es")
    .then((res) => {
      document.getElementById("datoExtra").textContent =
        "Dato curioso: " + res.data.text;
    })
    .catch((err) => {
      document.getElementById("datoExtra").textContent =
        "No se pudo cargar el dato extra.";
      console.error(err);
    });

  $("#btnReintentar").addEventListener("click", () => {
    aciertos = 0;
    indice = 0;
    inicio = Date.now();
    operaciones = crearOperaciones(cantidad);
    el.resumen.style.display = "none";
    el.juego.style.display = "block";
    mostrarPregunta();
  });

  $("#btnCambiar").addEventListener("click", () => {
    el.config.style.display = "block";
    el.juego.style.display = "none";
    el.resumen.style.display = "none";
    el.inputCantidad.focus();
  });
}

function iniciarApp() {
  cargarPreferencias();
  el.btnIniciar.addEventListener("click", iniciarJuego);
  el.btnResponder.addEventListener("click", comprobarRespuesta);
  el.respuesta.addEventListener("keydown", (e) => {
    if (e.key === "Enter") comprobarRespuesta();
  });
}

document.addEventListener("DOMContentLoaded", iniciarApp);

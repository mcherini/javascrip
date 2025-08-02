let texto;
let resultado;

function iniciarSimulador() {
  let cantidad = Number(
    prompt("¿Cuántas operaciones querés realizar? (máx. 10)", "5")
  );
  if (isNaN(cantidad) || cantidad < 1 || cantidad > 10) {
    alert("Se usarán 5 ya que no fue correcto tu ingreso.");
    console.log("Se usarán 5 ya que no fue correcto tu ingreso.");
    cantidad = 5;
  }

  let aciertos = 0;
  let inicio = Date.now();
  console.log(`Jugamos a contestar  ${cantidad} preguntas`);

  for (let i = 0; i < cantidad; i++) {
    let a = Math.floor(Math.random() * 100) + 1;
    let b = Math.floor(Math.random() * 100) + 1;
    let esSuma = Math.random() < 0.5;
    if (esSuma) {
      texto = a + " + " + b;
      resultado = a + b;
    } else {
      texto = a + " - " + b;
      resultado = a - b;
    }

    console.log(`Pregunta ${i + 1}: calcular ${texto} (esperado ${resultado})`);

    let resp = prompt(`Pregunta ${i + 1}/${cantidad}: ¿Cuánto es ${texto}?`);
    let numResp = Number(resp);
    let esAcierto = resp !== null && numResp === resultado;

    if (esAcierto) {
      aciertos++;
      console.log(`  → Respuesta: ${resp} (correcta)`);
    } else {
      console.log(`  → Respuesta: ${resp} (incorrecta)`);
    }
  }

  let tiempoMs = Date.now() - inicio;
  let tiempoSegs = Math.floor(tiempoMs / 1000);
  let resumen =
    "juego finalizado \n" +
    "Aciertos: " +
    aciertos +
    " de " +
    cantidad +
    "\n" +
    "Tiempo empleado: " +
    tiempoSegs +
    " segundos";
  alert(resumen);
  console.log("Resumen");
  console.log("Aciertos:", aciertos, "de", cantidad);
  console.log("Tiempo:", tiempoSegs, "segundos");
}

if (confirm("¿Querés iniciar el juego de las operaciones?")) {
  iniciarSimulador();
} else {
  console.log("juego cancelado por el usuario");
  alert("juego cancelado por el usuario");
}

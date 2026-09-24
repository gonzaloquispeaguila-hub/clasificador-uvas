const URL_MODELO = "https://teachablemachine.withgoogle.com/models/-wd3-bPoo/";

const imagenInput = document.getElementById("imagen-input");
const vistaPrevia = document.getElementById("vista-previa");
const imagenPreview = document.getElementById("imagen-preview");
const analizarBtn = document.getElementById("analizar-btn");
const estado = document.getElementById("estado");
const resultado = document.getElementById("resultado");
const clasePredicha = document.getElementById("clase-predicha");
const porcentajeConfianza = document.getElementById("porcentaje-confianza");

let modelo = null;

imagenInput.addEventListener("change", () => {
  const archivo = imagenInput.files[0];

  resultado.hidden = true;
  analizarBtn.disabled = true;

  if (!archivo) {
    vistaPrevia.hidden = true;
    estado.textContent = "Selecciona una fotografía para comenzar.";
    return;
  }

  if (!archivo.type.startsWith("image/")) {
    vistaPrevia.hidden = true;
    estado.textContent = "Selecciona un archivo de imagen válido.";
    return;
  }

  const lector = new FileReader();

  lector.onload = () => {
    imagenPreview.onload = () => {
      vistaPrevia.hidden = false;
      analizarBtn.disabled = false;
      estado.textContent = "Imagen lista. Presiona «Analizar uvas».";
    };

    imagenPreview.src = lector.result;
  };

  lector.onerror = () => {
    estado.textContent = "No se pudo abrir la imagen. Inténtalo de nuevo.";
  };

  lector.readAsDataURL(archivo);
});

analizarBtn.addEventListener("click", async () => {
  analizarBtn.disabled = true;
  resultado.hidden = true;
  estado.textContent = "Analizando imagen...";

  try {
    if (!modelo) {
      estado.textContent = "Cargando el modelo de inteligencia artificial...";

      modelo = await tmImage.load(
        URL_MODELO + "model.json",
        URL_MODELO + "metadata.json"
      );
    }

    estado.textContent = "Analizando imagen...";

    const predicciones = await modelo.predict(imagenPreview);

    const mejorPrediccion = predicciones.reduce((mejor, actual) =>
      actual.probability > mejor.probability ? actual : mejor
    );

    clasePredicha.textContent = mejorPrediccion.className;
    porcentajeConfianza.textContent =
      (mejorPrediccion.probability * 100).toFixed(2) + " %";

    resultado.hidden = false;
    estado.textContent = "Análisis completado.";
  } catch (error) {
    console.error("Error al analizar la imagen:", error);
    estado.textContent =
      "No se pudo analizar la imagen. Comprueba tu conexión a internet e inténtalo nuevamente.";
  } finally {
    analizarBtn.disabled = false;
  }
});
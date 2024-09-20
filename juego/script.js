const flags = [
  { src: "./banderas/Bandera_nacional_de_España.png", correct: "España", options: ["España", "Francia", "Alemania", "Italia"] },
  { src: "./banderas/Flag_of_France.svg.png", correct: "Francia", options: ["España", "Francia", "Alemania", "Italia"] },
  { src: "./banderas/Flag_of_Germany.svg.png", correct: "Alemania", options: ["España", "Francia", "Alemania", "Italia"] },
  // Añade más banderas y opciones aquí
];

let currentFlag = 0;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function loadFlag() {
  // Cambiar la imagen de la bandera
  document.getElementById("flagImg").src = flags[currentFlag].src;

  // Mezclar las opciones para que no siempre aparezca en el mismo lugar
  const shuffledOptions = shuffle([...flags[currentFlag].options]);

  // Asignar las opciones a los botones
  document.querySelectorAll('.options button').forEach((button, index) => {
    button.textContent = shuffledOptions[index];
    button.onclick = () => checkAnswer(shuffledOptions[index]);
  });
}

function checkAnswer(selectedAnswer) {
  const result = document.getElementById("result");

  if (selectedAnswer === flags[currentFlag].correct) {
    result.textContent = "¡Correcto!";
  } else {
    result.textContent = `Incorrecto. Era ${flags[currentFlag].correct}`;
  }

  currentFlag = (currentFlag + 1) % flags.length;
  setTimeout(loadFlag, 2000); // Cargar la siguiente bandera después de 2 segundos
}

window.onload = loadFlag;

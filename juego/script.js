let countries = [];
let currentFlag = {};
let difficulty = 'medium'; // Nivel de dificultad por defecto
let score = 0; // Puntuación del jugador
let roundsPlayed = 0;
const maxRounds = 10; // Número de rondas por juego

// Configuración de niveles de dificultad
const levels = {
  easy: 2,
  medium: 4,
  hard: 6,
};

// Obtener datos de todos los países usando la API, excluyendo la bandera de Israel
async function fetchCountries() {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const data = await response.json();
  countries = data
    .filter(country => country.translations.spa?.common !== "Israel")
    .map(country => ({
      name: country.translations.spa?.common || country.name.common,  // Nombre en español o común
      flag: country.flags.svg,
    }));
}

// Función para iniciar el juego con la dificultad seleccionada
function startGame(selectedDifficulty) {
  difficulty = selectedDifficulty;
  score = 0;
  roundsPlayed = 0;

  // Esconder el menú y mostrar el juego
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('gameTitle').classList.remove('hidden');
  document.getElementById('flagImg').classList.remove('hidden');
  document.querySelector('.options').classList.remove('hidden');
  document.getElementById('result').classList.remove('hidden');
  document.querySelector('.progress-container').classList.remove('hidden');
  document.getElementById('score').classList.remove('hidden');

  updateScore(0);  // Iniciar puntuación en 0
  loadFlag();
}

// Función para cargar una nueva bandera
function loadFlag() {
  if (roundsPlayed >= maxRounds) {
    endGame();
    return;
  }

  const randomIndex = Math.floor(Math.random() * countries.length);
  currentFlag = countries[randomIndex];

  // Cambiar la imagen de la bandera
  document.getElementById("flagImg").src = currentFlag.flag;

  // Obtener opciones basadas en la dificultad
  const numOptions = levels[difficulty];
  let options = [currentFlag.name];

  while (options.length < numOptions) {
    const randomOption = countries[Math.floor(Math.random() * countries.length)].name;
    if (!options.includes(randomOption)) {
      options.push(randomOption);
    }
  }

  // Mezclar las opciones
  options = shuffle(options);

  // Mostrar las opciones en los botones
  const optionsContainer = document.querySelector('.options');
  optionsContainer.innerHTML = ''; // Limpiar opciones anteriores
  options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.onclick = () => checkAnswer(option);
    optionsContainer.appendChild(button);
  });

  roundsPlayed++;
  updateProgress();
}

// Función para verificar la respuesta seleccionada
function checkAnswer(selectedAnswer) {
  const result = document.getElementById("result");

  if (selectedAnswer === currentFlag.name) {
    result.textContent = "¡Correcto!";
    updateScore(10); // Aumentar puntuación por respuesta correcta
  } else {
    result.textContent = `Incorrecto. Era ${currentFlag.name}`;
  }

  setTimeout(loadFlag, 2000); // Cargar la siguiente bandera después de 2 segundos
}

// Función para actualizar la puntuación con animación
function updateScore(points) {
  const scoreDisplay = document.getElementById('score');
  const currentScore = score;
  const newScore = currentScore + points;

  // Animación fluida para la puntuación
  const animationInterval = setInterval(() => {
    if (score < newScore) {
      score++;
      scoreDisplay.textContent = `Puntuación: ${score}`;
    } else {
      clearInterval(animationInterval);
    }
  }, 20); // Velocidad de la animación
}

// Función para actualizar la barra de progreso
function updateProgress() {
  const progressBar = document.getElementById('progressBar');
  const progress = (roundsPlayed / maxRounds) * 100;
  progressBar.style.width = `${progress}%`;
}

// Función para finalizar el juego
function endGame() {
  const result = document.getElementById("result");
  result.textContent = `¡Juego terminado! Puntuación final: ${score}`;
  document.getElementById('flagImg').classList.add('hidden');
  document.querySelector('.options').classList.add('hidden');

  // Mostrar el botón de reiniciar
  document.getElementById('restartBtn').style.display = 'block';
}

// Función para reiniciar el juego
function restartGame() {
  // Esconder el botón de reinicio y mostrar el menú de dificultad
  document.getElementById('restartBtn').style.display = 'none';
  document.getElementById('menu').classList.remove('hidden');
  document.getElementById('result').classList.add('hidden');
  document.getElementById('progressBar').style.width = '0';

  // Resetear las variables y elementos del juego
  score = 0;
  roundsPlayed = 0;
  updateScore(0);
}

// Función para mezclar opciones
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Cargar los datos iniciales
window.onload = fetchCountries;

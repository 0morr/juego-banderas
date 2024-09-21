let countries = [];
let currentFlag = {};
let difficulty = 'medium'; // Nivel de dificultad por defecto
let score = 0; // Puntuación del jugador
let roundsPlayed = 0;
const maxRounds = 10; // Número de rondas por juego

const levels = { easy: 2, medium: 4, hard: 6 };

// Obtener datos de todos los países usando la API, excluyendo la bandera de Israel
async function fetchCountries() {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const data = await response.json();
  countries = data
    .filter(country => country.translations.spa?.common !== "Israel")
    .map(country => ({
      name: country.translations.spa?.common || country.name.common,
      flag: country.flags.svg,
    }));
}

// Función para iniciar el juego con la dificultad seleccionada
function startGame(selectedDifficulty) {
  difficulty = selectedDifficulty;
  score = 0;
  roundsPlayed = 0;

  document.getElementById('menu').classList.add('hidden');
  document.getElementById('gameTitle').classList.remove('hidden');
  document.getElementById('flagImg').classList.remove('hidden');
  document.querySelector('.options').classList.remove('hidden');
  document.getElementById('result').classList.remove('hidden');
  document.querySelector('.progress-container').classList.remove('hidden');
  document.getElementById('score').classList.remove('hidden');

  updateScore(0);
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

  document.getElementById("flagImg").src = currentFlag.flag;

  const numOptions = levels[difficulty];
  let options = [currentFlag.name];

  while (options.length < numOptions) {
    const randomOption = countries[Math.floor(Math.random() * countries.length)].name;
    if (!options.includes(randomOption)) {
      options.push(randomOption);
    }
  }

  options = shuffle(options);

  const optionsContainer = document.querySelector('.options');
  optionsContainer.innerHTML = '';
  options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.onclick = () => checkAnswer(button, option);
    optionsContainer.appendChild(button);
  });

  roundsPlayed++;
  updateProgress();
}

// Función para verificar la respuesta seleccionada
function checkAnswer(button, selectedAnswer) {
  const result = document.getElementById("result");

  if (selectedAnswer === currentFlag.name) {
    result.textContent = "¡Correcto!";
    button.classList.add('correct');
    updateScore(10);
  } else {
    result.textContent = `Incorrecto. Era ${currentFlag.name}`;
    button.classList.add('incorrect');
  }

  setTimeout(() => {
    button.classList.remove('correct', 'incorrect');
    loadFlag();
  }, 1500);
}

// Función para actualizar la puntuación con animación
function updateScore(points) {
  const scoreDisplay = document.getElementById('score');
  score += points;
  scoreDisplay.textContent = `Puntuación: ${score}`;
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
  document.getElementById('restartBtn').style.display = 'block';
}

// Función para reiniciar el juego
function restartGame() {
  document.getElementById('restartBtn').style.display = 'none';
  document.getElementById('menu').classList.remove('hidden');
  document.getElementById('result').classList.add('hidden');
  document.getElementById('progressBar').style.width = '0';
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

// Cargar los datos iniciales
window.onload = fetchCountries;

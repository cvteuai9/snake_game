// 定義HTML上面的元素
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

// 定義遊戲變數
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// 遊戲畫面繪製函式
function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

// 製作蛇
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// 製作食物
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// 設定蛇首或食物位置
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Testing draw function
// draw();

// Draw food function
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

// 隨機產生食物的位置
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Moving the snake
function move() {
  const head = { ...snake[0] }; // 抓取蛇首的那一個位置
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }
  snake.unshift(head); // 將新位置加入蛇首位置

  // 如果吃到食物：
  // 1.重新產生食物位置
  // 2.清除計時器(暫停自動移動一下子)
  // 3.重新設定計時器
  //   a.執行自動移動函式(蛇首的位置為移動1格後)
  //   b.執行draw() -> 畫面產生出snake和food(因為沒有執行pop，所以snake長度會+1)
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed(); // 增加貪食蛇移動速度
    clearInterval(gameInterval); // Clear past interval
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

// // Test moving
// setInterval(() => {
//   move(); // Move first
//   draw(); // Then draw again new position
// }, 200);

// Start game function
function startGame() {
  gameStarted = true; // Keep track of a running game
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  }
}

document.addEventListener("keydown", handleKeyPress);

function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

// 碰撞機制
function checkCollision() {
  const head = snake[0];
  // 邊界碰撞機制
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  // 蛇蛇本身的碰撞機制
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

// 遊戲重置
function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
}

// 分數更新
function updateScore() {
  const currentScore = snake.length - 1; // 扣掉蛇首
  score.textContent = currentScore.toString().padStart(3, "0");
}

// 遊戲結束畫面
function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}

// 最高分計算
function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}

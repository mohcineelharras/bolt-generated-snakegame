const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const startBtn = document.getElementById('startBtn');

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    let snake = [
      { x: 10, y: 10 }
    ];
    let food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
    let dx = 0;
    let dy = 0;
    let score = 0;
    let gameLoop;

    function draw() {
      // Clear canvas
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw snake
      ctx.fillStyle = '#4CAF50';
      snake.forEach(segment => {
        ctx.fillRect(
          segment.x * gridSize,
          segment.y * gridSize,
          gridSize - 2,
          gridSize - 2
        );
      });

      // Draw food
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(
        food.x * gridSize,
        food.y * gridSize,
        gridSize - 2,
        gridSize - 2
      );
    }

    function move() {
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };
      
      // Check wall collision
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
      }

      // Check self collision
      if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
      }

      snake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        spawnFood();
      } else {
        snake.pop();
      }
    }

    function spawnFood() {
      food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
      // Make sure food doesn't spawn on snake
      if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        spawnFood();
      }
    }

    function gameOver() {
      clearInterval(gameLoop);
      startBtn.textContent = 'Start New Game';
      alert(`Game Over! Score: ${score}`);
    }

    function startGame() {
      if (gameLoop) clearInterval(gameLoop);
      
      snake = [{ x: 10, y: 10 }];
      dx = 0;
      dy = 0;
      score = 0;
      scoreElement.textContent = `Score: ${score}`;
      
      gameLoop = setInterval(() => {
        move();
        draw();
      }, 100);
    }

    // Handle keyboard input
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowUp':
          if (dy !== 1) {
            dx = 0;
            dy = -1;
          }
          break;
        case 'ArrowDown':
          if (dy !== -1) {
            dx = 0;
            dy = 1;
          }
          break;
        case 'ArrowLeft':
          if (dx !== 1) {
            dx = -1;
            dy = 0;
          }
          break;
        case 'ArrowRight':
          if (dx !== -1) {
            dx = 1;
            dy = 0;
          }
          break;
      }
    });

    startBtn.addEventListener('click', startGame);

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./FlappyCats.module.css";

export default function FlappyCats() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("ready"); // ready, playing, gameOver
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("flappyCatsHighScore") || "0");
  });

  const gameDataRef = useRef({
    bird: { x: 100, y: 200, velocity: 0, radius: 15 },
    pipes: [],
    coins: [],
    frameCount: 0,
    gravity: 0.1,
    jumpStrength: -4,
    pipeWidth: 60,
    pipeGap: 150,
    pipeSpeed: 2,
    coinRadius: 12,
    coinValue: 1,
  });

  const resetGame = useCallback(() => {
    gameDataRef.current = {
      bird: { x: 100, y: 200, velocity: 0, radius: 15 },
      pipes: [],
      coins: [],
      frameCount: 0,
      gravity: 0.1,
      jumpStrength: -4,
      pipeWidth: 60,
      pipeGap: 150,
      pipeSpeed: 2,
      coinRadius: 12,
      coinValue: 1,
    };
    setScore(0);
    setGameState("ready");
  }, []);

  const jump = useCallback(() => {
    if (gameState === "ready") {
      setGameState("playing");
      // Give initial upward velocity when game starts
      gameDataRef.current.bird.velocity = gameDataRef.current.jumpStrength;
    }
    if (gameState === "playing") {
      gameDataRef.current.bird.velocity = gameDataRef.current.jumpStrength;
    }
    if (gameState === "gameOver") {
      resetGame();
    }
  }, [gameState, resetGame]);

  const checkCollision = useCallback((bird, pipe) => {
    const birdLeft = bird.x - bird.radius;
    const birdRight = bird.x + bird.radius;
    const birdTop = bird.y - bird.radius;
    const birdBottom = bird.y + bird.radius;

    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + gameDataRef.current.pipeWidth;
    const pipeTopBottom = pipe.topHeight;
    const pipeBottomTop = pipe.topHeight + gameDataRef.current.pipeGap;

    return (
      birdRight > pipeLeft &&
      birdLeft < pipeRight &&
      (birdTop < pipeTopBottom || birdBottom > pipeBottomTop)
    );
  }, []);

  const checkCoinCollection = useCallback((bird, coin) => {
    const distance = Math.sqrt(
      Math.pow(bird.x - coin.x, 2) + Math.pow(bird.y - coin.y, 2),
    );
    return distance < bird.radius + gameDataRef.current.coinRadius;
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const game = gameDataRef.current;

    // Clear canvas
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw clouds
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(100, 80, 25, 0, Math.PI * 2);
    ctx.arc(130, 80, 35, 0, Math.PI * 2);
    ctx.arc(160, 80, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(300, 120, 20, 0, Math.PI * 2);
    ctx.arc(325, 120, 30, 0, Math.PI * 2);
    ctx.arc(350, 120, 20, 0, Math.PI * 2);
    ctx.fill();

    if (gameState === "playing") {
      // Update bird
      game.bird.velocity += game.gravity;
      game.bird.y += game.bird.velocity;

      // Check boundaries
      if (
        game.bird.y - game.bird.radius < 0 ||
        game.bird.y + game.bird.radius > canvas.height
      ) {
        setGameState("gameOver");
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem("flappyCatsHighScore", score.toString());
        }
        return;
      }

      // Update pipes
      game.frameCount++;
      if (game.frameCount % 90 === 0) {
        const minHeight = 50;
        const maxHeight = canvas.height - game.pipeGap - minHeight;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

        game.pipes.push({
          x: canvas.width,
          topHeight: topHeight,
          passed: false,
        });

        // Add coin in the middle of the gap
        if (Math.random() > 0.3) {
          // 70% chance to spawn a coin
          game.coins.push({
            x: canvas.width + game.pipeWidth / 2,
            y: topHeight + game.pipeGap / 2,
            collected: false,
            rotation: 0,
          });
        }
      }

      game.pipes = game.pipes.filter((pipe) => {
        pipe.x -= game.pipeSpeed;

        // Check collision
        if (checkCollision(game.bird, pipe)) {
          setGameState("gameOver");
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("flappyCatsHighScore", score.toString());
          }
          return false;
        }

        // Update score
        if (!pipe.passed && pipe.x + game.pipeWidth < game.bird.x) {
          pipe.passed = true;
          setScore((prev) => prev + 1);
        }

        return pipe.x + game.pipeWidth > 0;
      });

      // Update coins
      game.coins = game.coins.filter((coin) => {
        coin.x -= game.pipeSpeed;
        coin.rotation += 0.05;

        // Check coin collection
        if (!coin.collected && checkCoinCollection(game.bird, coin)) {
          coin.collected = true;
          setScore((prev) => prev + game.coinValue);
          return false; // Remove collected coin
        }

        return coin.x + game.coinRadius > 0 && !coin.collected;
      });
    }

    // Draw pipes
    ctx.fillStyle = "#228B22";
    game.pipes.forEach((pipe) => {
      // Top pipe
      ctx.fillRect(pipe.x, 0, game.pipeWidth, pipe.topHeight);
      // Bottom pipe
      ctx.fillRect(
        pipe.x,
        pipe.topHeight + game.pipeGap,
        game.pipeWidth,
        canvas.height - pipe.topHeight - game.pipeGap,
      );

      // Pipe caps
      ctx.fillStyle = "#2E7D32";
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, game.pipeWidth + 10, 30);
      ctx.fillRect(
        pipe.x - 5,
        pipe.topHeight + game.pipeGap,
        game.pipeWidth + 10,
        30,
      );
      ctx.fillStyle = "#228B22";
    });

    // Draw coins
    game.coins.forEach((coin) => {
      ctx.save();
      ctx.translate(coin.x, coin.y);
      ctx.rotate(coin.rotation);

      // Coin outer circle
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(0, 0, game.coinRadius, 0, Math.PI * 2);
      ctx.fill();

      // Coin inner circle
      ctx.fillStyle = "#FFA500";
      ctx.beginPath();
      ctx.arc(0, 0, game.coinRadius * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Coin symbol (cat face)
      ctx.fillStyle = "#FFF";
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🐱", 0, 0);

      ctx.restore();
    });

    // Draw bird (cat)
    ctx.save();
    ctx.translate(game.bird.x, game.bird.y);

    // Rotate based on velocity for more realistic flight
    const rotation =
      (Math.min(Math.max(game.bird.velocity * 1.5, -20), 20) * Math.PI) / 180;
    ctx.rotate(rotation);

    // Cat body
    ctx.fillStyle = "#FFA500";
    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      game.bird.radius * 1.2,
      game.bird.radius,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.ellipse(
      0,
      0,
      game.bird.radius * 1.2,
      game.bird.radius,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    // Cat ears
    ctx.beginPath();
    ctx.moveTo(-game.bird.radius * 0.8, -game.bird.radius * 0.5);
    ctx.lineTo(-game.bird.radius * 1.2, -game.bird.radius * 1.2);
    ctx.lineTo(-game.bird.radius * 0.3, -game.bird.radius * 0.8);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(game.bird.radius * 0.8, -game.bird.radius * 0.5);
    ctx.lineTo(game.bird.radius * 1.2, -game.bird.radius * 1.2);
    ctx.lineTo(game.bird.radius * 0.3, -game.bird.radius * 0.8);
    ctx.closePath();
    ctx.fill();

    // Cat eyes
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(-5, -2, 3, 0, Math.PI * 2);
    ctx.arc(5, -2, 3, 0, Math.PI * 2);
    ctx.fill();

    // Cat nose
    ctx.fillStyle = "#FF69B4";
    ctx.beginPath();
    ctx.moveTo(0, 2);
    ctx.lineTo(-3, 5);
    ctx.lineTo(3, 5);
    ctx.closePath();
    ctx.fill();

    // Cat whiskers
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(-25, -2);
    ctx.moveTo(-15, 5);
    ctx.lineTo(-25, 5);
    ctx.moveTo(15, 0);
    ctx.lineTo(25, -2);
    ctx.moveTo(15, 5);
    ctx.lineTo(25, 5);
    ctx.stroke();

    ctx.restore();

    // Draw UI
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.font = "bold 24px Arial";
    ctx.strokeText(`Счёт: ${score}`, 20, 40);
    ctx.fillText(`Счёт: ${score}`, 20, 40);

    if (highScore > 0) {
      ctx.font = "bold 18px Arial";
      ctx.strokeText(`Рекорд: ${highScore}`, 20, 70);
      ctx.fillText(`Рекорд: ${highScore}`, 20, 70);
    }

    // Game state messages
    if (gameState === "ready") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#FFF";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 4;
      ctx.font = "bold 32px Arial";
      ctx.textAlign = "center";
      ctx.strokeText("FLAPPY CATS", canvas.width / 2, canvas.height / 2 - 40);
      ctx.fillText("FLAPPY CATS", canvas.width / 2, canvas.height / 2 - 40);

      ctx.font = "bold 20px Arial";
      ctx.strokeText(
        "Нажми чтобы начать",
        canvas.width / 2,
        canvas.height / 2 + 20,
      );
      ctx.fillText(
        "Нажми чтобы начать",
        canvas.width / 2,
        canvas.height / 2 + 20,
      );

      ctx.font = "16px Arial";
      ctx.strokeText(
        "Пробел или клик = прыжок",
        canvas.width / 2,
        canvas.height / 2 + 60,
      );
      ctx.fillText(
        "Пробел или клик = прыжок",
        canvas.width / 2,
        canvas.height / 2 + 60,
      );

      ctx.font = "16px Arial";
      ctx.strokeText(
        "Собирай монетки с котиками! 🪙",
        canvas.width / 2,
        canvas.height / 2 + 90,
      );
      ctx.fillText(
        "Собирай монетки с котиками! 🪙",
        canvas.width / 2,
        canvas.height / 2 + 90,
      );
      ctx.textAlign = "left";
    }

    if (gameState === "gameOver") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#FFF";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 4;
      ctx.font = "bold 32px Arial";
      ctx.textAlign = "center";
      ctx.strokeText("ИГРА ОКОНЧЕНА", canvas.width / 2, canvas.height / 2 - 40);
      ctx.fillText("ИГРА ОКОНЧЕНА", canvas.width / 2, canvas.height / 2 - 40);

      ctx.font = "bold 24px Arial";
      ctx.strokeText(`Счёт: ${score}`, canvas.width / 2, canvas.height / 2);
      ctx.fillText(`Счёт: ${score}`, canvas.width / 2, canvas.height / 2);

      if (score === highScore && score > 0) {
        ctx.fillStyle = "#FFD700";
        ctx.font = "bold 20px Arial";
        ctx.strokeText(
          "НОВЫЙ РЕКОРД!",
          canvas.width / 2,
          canvas.height / 2 + 40,
        );
        ctx.fillText("НОВЫЙ РЕКОРД!", canvas.width / 2, canvas.height / 2 + 40);
      }

      ctx.fillStyle = "#FFF";
      ctx.font = "bold 20px Arial";
      ctx.strokeText(
        "Нажми чтобы играть снова",
        canvas.width / 2,
        canvas.height / 2 + 80,
      );
      ctx.fillText(
        "Нажми чтобы играть снова",
        canvas.width / 2,
        canvas.height / 2 + 80,
      );
      ctx.textAlign = "left";
    }
  }, [gameState, score, highScore, checkCollision]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = 400;
      canvas.height = 300;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let animationId;

    const animate = () => {
      gameLoop();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [gameLoop]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [jump]);

  return (
    <section className={styles.flappyCats}>
      <div className={styles.header}>
        <h2 className={styles.title}>FLAPPY CATS 🐱</h2>
        <p className={styles.subtitle}>Летящий котик и монетки! 🪙</p>
      </div>
      <div className={styles.gameContainer}>
        <canvas ref={canvasRef} className={styles.canvas} onClick={jump} />
      </div>
    </section>
  );
}

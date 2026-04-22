import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 100;

const generateFood = (snake: { x: number, y: number }[]) => {
  let newFood = { x: 5, y: 5 };
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!isOnSnake) break;
  }
  return newFood;
};

export function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const lastMoveDirection = useRef(direction);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setHasStarted(true);
    setIsPaused(false);
    lastMoveDirection.current = INITIAL_DIRECTION;
  };

  useEffect(() => {
    if (!hasStarted) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      if (e.key === ' ') { setIsPaused(p => !p); return; }
      const { x, y } = lastMoveDirection.current;
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': if (y !== 1) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': case 's': case 'S': if (y !== -1) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': case 'a': case 'A': if (x !== 1) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': case 'd': case 'D': if (x !== -1) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;
    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true); setHighScore(prev => Math.max(prev, score)); return prevSnake;
        }
        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10); setFood(generateFood(newSnake));
        } else newSnake.pop();
        lastMoveDirection.current = direction;
        return newSnake;
      });
    };
    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, hasStarted, score]);

  return (
    <div className="flex flex-col items-center w-full max-w-[500px] font-glitch">
      <div className="w-full flex justify-between items-center mb-4 bg-[#000] border-4 border-[#f0f] border-dashed p-4">
        <div className="text-left">
          <p className="text-xl text-[#0ff] uppercase">&gt; SCORE_</p>
          <p className="text-4xl text-[#f0f] font-bold glitch-text" data-text={score.toString().padStart(4, '0')}>
            {score.toString().padStart(4, '0')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl text-[#f0f] uppercase">MAX_MEM // </p>
          <p className="text-4xl text-[#0ff] font-bold animate-pulse">
            {highScore.toString().padStart(4, '0')}
          </p>
        </div>
      </div>

      <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden snake-grid-glitch bg-[#000]">
        <div 
          className="w-full h-full grid relative"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = !isHead && snake.some(s => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            let cellClasses = "border-[1px] border-[#0ff]/10 ";
            if (isHead) cellClasses += "cell-head z-10";
            else if (isSnakeBody) cellClasses += "cell-snake";
            else if (isFood) cellClasses += "cell-food z-10";
            else cellClasses += "cell-empty";

            return <div key={i} className={cellClasses} />;
          })}
        </div>

        {!hasStarted && (
          <div className="absolute inset-0 bg-[#f0f]/20 flex flex-col items-center justify-center backdrop-blur-sm z-20 border-8 border-dashed border-[#0ff]">
            <h2 className="text-6xl text-[#0ff] font-black mb-8 uppercase glitch-text bg-[#000] p-4 border-4 border-[#0ff]" data-text="WORM.EXE">
              WORM.EXE
            </h2>
            <button onClick={resetGame} className="btn-glitch text-3xl">
              &gt; INITIALIZE
            </button>
          </div>
        )}

        {gameOver && hasStarted && (
          <div className="absolute inset-0 bg-[#000]/90 flex flex-col items-center justify-center z-20 border-8 border-[#f0f]">
            <h2 className="text-6xl text-[#f0f] font-black mb-4 uppercase glitch-text animate-pulse" data-text="FATAL_ERROR">
              FATAL_ERROR
            </h2>
            <p className="text-[#0ff] text-2xl mb-8 bg-[#000] p-2 border-2 border-[#0ff]">SEGMENTATION FAULT (SCORE: {score})</p>
            <button onClick={resetGame} className="btn-glitch text-3xl">
              &gt; REBOOT
            </button>
          </div>
        )}

        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-[#000]/80 flex flex-col items-center justify-center z-20">
            <h2 className="text-5xl text-[#0ff] font-black tracking-widest bg-[#f0f] text-[#000] p-4 glitch-text" data-text="EXEC_PAUSED">
              EXEC_PAUSED
            </h2>
          </div>
        )}
      </div>

      <div className="mt-8 text-2xl text-[#f0f] flex gap-8 items-center bg-[#000] border-2 border-[#0ff] p-4 w-full justify-between">
        <p>&gt; W A S D : MOVE</p>
        <p className="text-[#0ff]">&gt; [SPACE] : HALT</p>
      </div>
    </div>
  );
}

// src/games/Pong.jsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'


function Pong() {
    const canvasRef = useRef(null);

    const ballsRef = useRef([]);

    const paddlesRef = useRef({
        leftY: 0,
        rightY: 0,
    });

    const keysRef = useRef({
        up: false,
        down: false,
    });

    const scoresRef = useRef({
        left: 0,
        right: 0,
    });

    const powerUpsRef = useRef([]);           // array of active power-ups
    const nextPowerUpSpawnAtRef = useRef(0);  // when to add the next one

    const lastTimeRef = useRef(null);
    const animationFrameIdRef = useRef(null);
    const difficultyRef = useRef('medium');
    const startGameRef = useRef(() => { });

    // UI state (for rendering only)
    const [difficulty, setDifficulty] = useState('medium');
    const [hasStarted, setHasStarted] = useState(false);

    const handleDifficultyChange = (level) => {
        setDifficulty(level);
        difficultyRef.current = level;
    };

    const handleStartClick = () => {
        if (startGameRef.current) {
            startGameRef.current();
            setHasStarted(true);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        const paddleWidth = 12;
        const paddleHeight = 80;
        const paddleOffset = 40;
        const ballRadius = 8;
        // power-up timing (2–3 active)
        powerUpsRef.current = [];
        nextPowerUpSpawnAtRef.current = performance.now() + 1200; // first extra spawn soon



        // Center paddles initially
        paddlesRef.current.leftY = (height - paddleHeight) / 2;
        paddlesRef.current.rightY = (height - paddleHeight) / 2;

        function getDifficultyParams(level) {
            switch (level) {
                case 'easy':
                    return {
                        aiMaxSpeed: 140,   // slower AI
                        ballSpeed: 320,
                        aiError: 40,       // how off-target it aims
                        aiActivationX: 0.65, // only reacts when ball is close
                    };
                case 'hard':
                    return {
                        aiMaxSpeed: 320,
                        ballSpeed: 420,
                        aiError: 5,
                        aiActivationX: 0.45,
                    };
                case 'medium':
                default:
                    return {
                        aiMaxSpeed: 230,
                        ballSpeed: 400,
                        aiError: 18,
                        aiActivationX: 0.55,
                    };
            }
        }

        function resetBall(direction = 1) {
            const { ballSpeed } = getDifficultyParams(difficultyRef.current);

            const angle = Math.random() * 0.6 - 0.3; // -0.3 to +0.3 radians

            ballsRef.current = [
                {
                    x: width / 2,
                    y: height / 2,
                    vx: ballSpeed * direction * Math.cos(angle),
                    vy: ballSpeed * Math.sin(angle),
                },
            ];
        }

        function spawnPowerUp() {
            powerUpsRef.current.push({
                x: width * 0.5 + (Math.random() * 200 - 100),
                y: 80 + Math.random() * (height - 160),
                r: 12,
                type: 'multiball',
            });
        }




        function drawFrame(balls, paddles, scores) {
            // ----- Clear + background -----
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#020617';
            ctx.fillRect(0, 0, width, height);

            // ----- Center "net" -----
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
            ctx.lineWidth = 4;

            const netX = width / 2;
            const segmentHeight = 20;
            const gap = 12;

            for (let y = 0; y < height; y += segmentHeight + gap) {
                ctx.beginPath();
                ctx.moveTo(netX, y);
                ctx.lineTo(netX, y + segmentHeight);
                ctx.stroke();
            }

            // ----- Score text -----
            ctx.fillStyle = 'rgba(226, 232, 240, 0.9)';
            ctx.font =
                '32px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';

            ctx.fillText(String(scores.left), width * 0.25, 24);
            ctx.fillText(String(scores.right), width * 0.75, 24);

            // ----- Paddles -----
            ctx.fillStyle = '#e5e7eb';

            ctx.fillRect(
                paddleOffset,
                paddles.leftY,
                paddleWidth,
                paddleHeight
            );

            ctx.fillRect(
                width - paddleOffset - paddleWidth,
                paddles.rightY,
                paddleWidth,
                paddleHeight
            );

            // ----- Power-up orbs -----
            for (const p of powerUpsRef.current) {
                // outer glow
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r + 6, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(168, 85, 247, 0.18)';
                ctx.fill();

                // core
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(168, 85, 247, 0.9)';
                ctx.fill();

                // tiny highlight
                ctx.beginPath();
                ctx.arc(p.x - 4, p.y - 4, 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
                ctx.fill();
            }



            // ----- Balls -----
            for (let i = balls.length - 1; i >= 0; i--) {
                const ball = balls[i];
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
                ctx.fill();
            }
        }


        function update(deltaSeconds) {
            const balls = ballsRef.current;
            const paddles = paddlesRef.current;
            const scores = scoresRef.current;

            const paddleSpeed = 360; // player paddle speed
            const { aiMaxSpeed: aiSpeed, aiError, aiActivationX, ballSpeed } =
                getDifficultyParams(difficultyRef.current);

            // Spawn power-up if it's time and none is active
            // Keep 2–3 power-ups active so they’re hittable
            const now = performance.now();
            const minPowerUps = 2;
            const maxPowerUps = 3;

            // If we have less than 2, top up immediately
            while (powerUpsRef.current.length < minPowerUps) {
                spawnPowerUp();
            }

            // If we have 2, occasionally spawn a 3rd
            if (
                powerUpsRef.current.length < maxPowerUps &&
                now >= nextPowerUpSpawnAtRef.current
            ) {
                spawnPowerUp();
                nextPowerUpSpawnAtRef.current = now + 3500 + Math.random() * 2500; // 3.5–6s
            }


            // ----- Move left paddle from keys -----
            if (keysRef.current.up) {
                paddles.leftY -= paddleSpeed * deltaSeconds;
            }
            if (keysRef.current.down) {
                paddles.leftY += paddleSpeed * deltaSeconds;
            }

            // Clamp left paddle inside screen
            if (paddles.leftY < 0) paddles.leftY = 0;
            if (paddles.leftY + paddleHeight > height) {
                paddles.leftY = height - paddleHeight;
            }

            // AI tracks the most "dangerous" ball:
            // - ball moving right (towards AI)
            // - and closest to the AI paddle (largest x)
            let primaryBall = null;

            for (const b of balls) {
                if (b.vx > 0) {
                    if (!primaryBall || b.x > primaryBall.x) {
                        primaryBall = b;
                    }
                }
            }

            // If none are moving toward AI, track the ball closest to center-ish (or just first)
            if (!primaryBall) {
                primaryBall = balls[0] || { x: width * 0.75, y: height / 2 };
            }


            // Only really track ball when it's on the AI side of the board
            const ballOnAiSide = primaryBall.x > width * aiActivationX;

            // Default target is center of screen (drift back when ball is far)
            let targetY = (height - paddleHeight) / 2;

            if (ballOnAiSide) {
                // Aim roughly at the ball but with some vertical error
                const errorOffset = (Math.random() - 0.5) * aiError * 2; // between -aiError..+aiError
                targetY = primaryBall.y - paddleHeight / 2 + errorOffset;
            }

            let diff = targetY - paddles.rightY;

            // "Lazy" zone: if we're close enough, don't bother correcting
            if (Math.abs(diff) < 15 && difficultyRef.current === 'easy') {
                diff = 0;
            }

            // Move towards target but clamp speed
            const aiMove = Math.max(
                -aiSpeed * deltaSeconds,
                Math.min(aiSpeed * deltaSeconds, diff)
            );

            paddles.rightY += aiMove;

            // Clamp right paddle inside screen
            if (paddles.rightY < 0) paddles.rightY = 0;
            if (paddles.rightY + paddleHeight > height) {
                paddles.rightY = height - paddleHeight;
            }


            for (let i = balls.length - 1; i >= 0; i--) {
                const ball = balls[i];

                // ----- Move ball -----
                ball.x += ball.vx * deltaSeconds;
                ball.y += ball.vy * deltaSeconds;

                // ----- Bounce off top/bottom -----
                if (ball.y - ballRadius < 0) {
                    ball.y = ballRadius;
                    ball.vy *= -1;
                } else if (ball.y + ballRadius > height) {
                    ball.y = height - ballRadius;
                    ball.vy *= -1;
                }

                // ----- Paddle collision: left (angled) -----
                const leftPaddleX = paddleOffset;
                const leftPaddleRight = leftPaddleX + paddleWidth;

                if (
                    ball.vx < 0 && // moving left
                    ball.x - ballRadius <= leftPaddleRight &&
                    ball.x - ballRadius >= leftPaddleX && // overlap in X
                    ball.y >= paddles.leftY &&
                    ball.y <= paddles.leftY + paddleHeight // overlap in Y
                ) {
                    // Snap ball just outside the paddle to avoid sticking
                    ball.x = leftPaddleRight + ballRadius;

                    // Compute hit position relative to paddle center (-1 .. +1)
                    const paddleCenterY = paddles.leftY + paddleHeight / 2;
                    let relativeY =
                        (ball.y - paddleCenterY) / (paddleHeight / 2); // -1 at top, +1 at bottom
                    relativeY = Math.max(-1, Math.min(1, relativeY));

                    const maxBounceAngle = (60 * Math.PI) / 180; // 60 degrees
                    const bounceAngle = relativeY * maxBounceAngle;

                    const direction = 1; // ball goes to the right after hitting left paddle

                    ball.vx = ballSpeed * Math.cos(bounceAngle) * direction;
                    ball.vy = ballSpeed * Math.sin(bounceAngle);
                }

                // ----- Paddle collision: right (angled AI) -----
                const rightPaddleX = width - paddleOffset - paddleWidth;
                const rightPaddleLeft = rightPaddleX;

                if (
                    ball.vx > 0 && // moving right
                    ball.x + ballRadius >= rightPaddleLeft &&
                    ball.x + ballRadius <= rightPaddleLeft + paddleWidth &&
                    ball.y >= paddles.rightY &&
                    ball.y <= paddles.rightY + paddleHeight
                ) {
                    // Snap ball just outside the paddle
                    ball.x = rightPaddleLeft - ballRadius;

                    const paddleCenterY = paddles.rightY + paddleHeight / 2;
                    let relativeY =
                        (ball.y - paddleCenterY) / (paddleHeight / 2);
                    relativeY = Math.max(-1, Math.min(1, relativeY));

                    const maxBounceAngle = (60 * Math.PI) / 180;
                    const bounceAngle = relativeY * maxBounceAngle;

                    const direction = -1; // ball goes to the left after hitting right paddle

                    ball.vx = ballSpeed * Math.cos(bounceAngle) * direction;
                    ball.vy = ballSpeed * Math.sin(bounceAngle);
                }

                // ----- Power-up collision (multiball) -----
                for (let pi = powerUpsRef.current.length - 1; pi >= 0; pi--) {
                    const p = powerUpsRef.current[pi];

                    const dx = ball.x - p.x;
                    const dy = ball.y - p.y;
                    const hitDist = ballRadius + p.r;

                    if (dx * dx + dy * dy <= hitDist * hitDist) {
                        // collected: remove this orb
                        powerUpsRef.current.splice(pi, 1);

                        if (p.type === 'multiball') {
                            const baseAngle = Math.atan2(ball.vy, ball.vx);
                            const speed =
                                Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy) || ballSpeed;

                            const offsets = [-0.25, 0.25]; // ~ +/-14 degrees
                            for (const off of offsets) {
                                balls.push({
                                    x: ball.x,
                                    y: ball.y,
                                    vx: speed * Math.cos(baseAngle + off),
                                    vy: speed * Math.sin(baseAngle + off),
                                });
                            }
                        }

                        break; // don’t collect multiple orbs in one frame
                    }
                }




                // ----- Scoring: remove ONLY the ball that left the arena -----
                if (ball.x + ballRadius < 0) {
                    // exited left side -> right scores
                    scores.right += 1;
                    balls.splice(i, 1);
                    continue;
                } else if (ball.x - ballRadius > width) {
                    // exited right side -> left scores
                    scores.left += 1;
                    balls.splice(i, 1);
                    continue;
                }

            }

            // If ALL balls are gone, start a fresh rally (single ball)
            if (balls.length === 0) {
                resetBall(Math.random() < 0.5 ? -1 : 1);
            }

        }

        function loop(timestamp) {
            if (lastTimeRef.current == null) {
                lastTimeRef.current = timestamp;
            }
            const deltaMs = timestamp - lastTimeRef.current;
            lastTimeRef.current = timestamp;

            const deltaSeconds = deltaMs / 1000;

            update(deltaSeconds);
            drawFrame(ballsRef.current, paddlesRef.current, scoresRef.current);

            animationFrameIdRef.current = requestAnimationFrame(loop);
        }

        // ---- Keyboard controls ----
        function handleKeyDown(e) {
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                keysRef.current.up = true;
            }
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                keysRef.current.down = true;
            }
        }

        function handleKeyUp(e) {
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                keysRef.current.up = false;
            }
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                keysRef.current.down = false;
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Initial static draw (no movement yet)
        drawFrame(ballsRef.current, paddlesRef.current, scoresRef.current);

        // Expose a start function for the button to call
        startGameRef.current = () => {
            // Reset state
            scoresRef.current.left = 0;
            scoresRef.current.right = 0;

            paddlesRef.current.leftY = (height - paddleHeight) / 2;
            paddlesRef.current.rightY = (height - paddleHeight) / 2;

            // Start with one idle ball in the middle (no movement yet)
            ballsRef.current = [
                {
                    x: width / 2,
                    y: height / 2,
                    vx: 0,
                    vy: 0,
                },
            ];

            resetBall(Math.random() < 0.5 ? -1 : 1);
            powerUpsRef.current = [];
            nextPowerUpSpawnAtRef.current = performance.now() + 1200;


            lastTimeRef.current = null;

            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            animationFrameIdRef.current = requestAnimationFrame(loop);
        };

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, []);

    return (
        <section className="section pong-section">
            <div className="pong-header">
                <Link to="/" className="pong-back">
                    ← Back to home
                </Link>

                <p className="pong-tag">Project · Game</p>
                <h2>Pong</h2>
                <p>
                    A tiny browser game built with React and the HTML5 canvas. This page
                    is where I&apos;ll experiment with game loops, basic physics, and a
                    slightly chaotic retro aesthetic.
                </p>
            </div>

            <div className="pong-layout">
                <div className="pong-canvas-wrapper">
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={450}
                        className="pong-canvas"
                    />
                </div>

                <div className="pong-sidebar">
                    <h3 className="pong-sidebar-title">What I&apos;m building here</h3>
                    <p className="pong-sidebar-text">
                        A chaotic little Pong lab. The goal is simple: beat the bot, collect power-ups,
                        and survive the multi-ball madness.
                    </p>
                    <ul className="pong-list">
                        <li>Skill-based angled bounces (hit the paddle edges)</li>
                        <li>Difficulty-based AI with human-ish mistakes</li>
                        <li>Power-ups: multiball now, more chaos later</li>
                    </ul>

                    <div className="pong-controls">
                        <p className="pong-sidebar-text">Choose difficulty:</p>
                        <div className="pong-difficulty">
                            <button
                                type="button"
                                className={
                                    'pong-difficulty-btn' +
                                    (difficulty === 'easy' ? ' active' : '')
                                }
                                onClick={() => handleDifficultyChange('easy')}
                            >
                                Easy
                            </button>
                            <button
                                type="button"
                                className={
                                    'pong-difficulty-btn' +
                                    (difficulty === 'medium' ? ' active' : '')
                                }
                                onClick={() => handleDifficultyChange('medium')}
                            >
                                Medium
                            </button>
                            <button
                                type="button"
                                className={
                                    'pong-difficulty-btn' +
                                    (difficulty === 'hard' ? ' active' : '')
                                }
                                onClick={() => handleDifficultyChange('hard')}
                            >
                                Hard
                            </button>
                        </div>

                        <button
                            type="button"
                            className="btn primary pong-start-btn"
                            onClick={handleStartClick}
                        >
                            {hasStarted ? 'Restart game' : 'Start game'}
                        </button>

                        <p className="pong-hint">
                            Controls: <strong>W / S</strong> or <strong>↑ / ↓</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Pong;

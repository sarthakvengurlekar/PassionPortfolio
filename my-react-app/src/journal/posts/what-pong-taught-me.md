---
title: What Building Pong Taught Me About Game Loops
date: 2025-12-17
tag: Game Dev
summary: I finally understood what a game loop is.
---

## Why Pong?

Pong is fun irl but sounds boring to play on a computer system. Two paddles, a ball, and some collisions.
That's exactly why I chose it.

I wanted to build a simple game from scratch without using a framework or an engine and Pong is basically the "Hello World" of game development.

## My initial (wrong) mental model

At first, I thought of the creating the game as a normal app: User presses a key, something moves, screen updates.

This felt jittery and inconsistent.
Sometimes the ball moved too fast, sometimes it barely moved.


## What a game loop really is

Once it clicked, I started thinking in three clear steps that repeat forever:

+ **Read input**
+ **Update state**
+ **Render**

Ideally at a consistent rhythm.

The important realization for me was this:
> Input and rendering should *never* directly control game state.

State should evolve over time. Not every key press.


## Time is the real enemy

The biggest issue I ran into was time:

If you move the ball by a fixed amount per frame, then:
- Fast machines = fast game
- Slow machines = slow game

Then I read about **delta time**, everything made more sense:

- Movement becomes “units per second”
- Collisions become predictable
- Difficulty becomes tunable instead of chaotic


## Small mistakes that caused big problems

Some things that tripped me up more than expected:

- Updating state inside render logic
- Tying movement directly to keyboard events
- Not separating “game state” from “UI state”
- Forgetting to reset values between rounds

None of these are obvious when you start.
All of them matter immediately.


## What I’d do differently next time

- design the loop first
- make time a first-class concept
- isolate game logic completely from rendering
- resist the urge to “just make it work”


## Final thought

Building Pong taught me that “simple” systems teach you basic fundamentals and are the most revealing.
There’s nowhere to hide bad assumptions.

Next up, BRICKBREAKER!!! 
Or maybe Tetris.
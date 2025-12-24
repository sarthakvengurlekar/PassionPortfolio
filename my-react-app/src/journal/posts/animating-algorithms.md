---
title: Why Visualizing Algorithms Is Harder Than Writing Them
date: 2025-12-24
tag: Algorithms
summary: Writing a sorting algorithm takes minutes. Making it understandable with animation takes much longer.
cover: /journal/algorithm-visualizer/sorting.png
---

The idea was simple. I wanted to build an algorithm visualizer. While preparing for interviews I learnt these algorithms and understood how to write them as a program. It took a long time to understand the difference and remember it. This gave me the idea to create a visualizer which could easily showcase the difference between sorting algorithms using animations.

You paste an array, choose a sorting algorithm, press start and watch it sort step by step. I've seen a few of these online so I assumed this would be a straightforward project.

That assumption was wrong.

### Writing the algorithm is the easy part

A sorting algorithm is just logic. You loop over an array, make comparisions, swap values and it's done. When you write algorithms they run instantly, change the data directly and don't really care about how they are visibly.

They just finish.

That was the first problem.

### Algorithms don't have a concept of "steps".

When you call a sort function, the entire function executes instantly. There is no pause. A visualizer needs time and an ability to pause between each step. That's when I realized that to visualize an algorithm, you can't run it. You have to describe it.

Instead of just writing the algorithm, I made each output steps like:

* COMPARE i j
* SWAP i j
* MARK_SORTED i
* MARK_MIN i
* DONE

The visualizer basically becomes an interpreter.

### A tiny virtual machine

At that point, the system started to feel like a very small VM. There was a program, an interpreter and a renderer.

The algorithm was being played one instruction at a time. This made debugging easy.

### The UI was the real challenge

Most of the time that I spent was on UI and state management, not on the algorithms.

The canvas resized infinitely. The speed slider behaved backwords. A single wrong variable caused the entire screen to go blank. On different devices, the layout broke in random ways.

None of this had anything to do with sorting, it was all about managing state over time and keeping rendering predictable.

### Final thought

I’ve written sorting algorithms many times before. They never really stuck.

Watching them fail slowly, step by step, is what finally made them make sense.

Sometimes the hardest part of software isn’t making things work.
It’s making them visible.
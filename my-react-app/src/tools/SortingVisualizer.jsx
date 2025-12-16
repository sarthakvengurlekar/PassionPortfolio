// src/tools/SortingVisualizer.jsx
import { useEffect, useMemo, useRef, useState } from "react"
import Section from "../components/Section"

function parseInputToArray(text) {
    const raw = text.trim()
    if (!raw) return { ok: false, error: "Input is empty." }

    const cleaned = raw.replace(/^\[/, "").replace(/\]$/, "")
    const parts = cleaned.split(/[\s,]+/).filter(Boolean)

    const nums = parts.map((p) => Number(p))
    if (nums.some((n) => Number.isNaN(n))) {
        return { ok: false, error: "Only numbers allowed (spaces/commas/brackets are fine)." }
    }

    if (nums.length < 1) return { ok: false, error: "Please enter at least 1 number." }
    if (nums.length > 150) return { ok: false, error: "Max 150 numbers for now (keeps it smooth)." }

    const clamped = nums.map((n) => {
        const v = Math.floor(n)
        return Math.min(300, Math.max(1, v))
    })

    return { ok: true, value: clamped }
}

// ---------- Step format ----------
/**
 * Step types:
 * COMPARE { i, j }
 * SWAP    { i, j }
 * MARK_SORTED { i }
 * DONE
 */
function bubbleSortSteps(inputArr) {
    const a = inputArr.slice()
    const steps = []

    const n = a.length
    for (let end = n - 1; end > 0; end--) {
        for (let i = 0; i < end; i++) {
            steps.push({ type: "COMPARE", i, j: i + 1 })

            if (a[i] > a[i + 1]) {
                // swap in our local sim array so future comparisons are correct
                const tmp = a[i]
                a[i] = a[i + 1]
                a[i + 1] = tmp
                steps.push({ type: "SWAP", i, j: i + 1 })
            }
        }
        steps.push({ type: "MARK_SORTED", i: end })
    }
    if (n > 0) steps.push({ type: "MARK_SORTED", i: 0 })
    steps.push({ type: "DONE" })

    return steps
}

function insertionSortSteps(inputArr) {
    const a = inputArr.slice()
    const steps = []
    const n = a.length

    if (n > 0) steps.push({ type: "MARK_SORTED", i: 0 })

    for (let i = 1; i < n; i++) {
        let j = i
        // compare backwards and swap until placed
        while (j > 0) {
            steps.push({ type: "COMPARE", i: j - 1, j })

            if (a[j - 1] > a[j]) {
                const tmp = a[j - 1]
                a[j - 1] = a[j]
                a[j] = tmp
                steps.push({ type: "SWAP", i: j - 1, j })
                j--
            } else {
                break
            }
        }

        // after placing element i, mark indices 0..i as sorted-ish
        steps.push({ type: "MARK_SORTED", i })
    }

    steps.push({ type: "DONE" })
    return steps
}


function SortingVisualizer() {
    const stageRef = useRef(null)
    const canvasRef = useRef(null)

    const timerRef = useRef(null)

    const [input, setInput] = useState("5, 1, 9, 2, 7, 3, 8, 4, 6")
    const [error, setError] = useState("")

    // base array = what user set/generate
    const [baseArr, setBaseArr] = useState([5, 1, 9, 2, 7, 3, 8, 4, 6])

    // current run state
    const [arr, setArr] = useState(baseArr)
    const [steps, setSteps] = useState([])
    const [stepIndex, setStepIndex] = useState(0)
    const [isRunning, setIsRunning] = useState(false)

    // visualization state
    const [activePair, setActivePair] = useState(null) // [i, j]
    const [swapPair, setSwapPair] = useState(null)     // [i, j]
    const [sortedSet, setSortedSet] = useState(() => new Set())

    // controls
    const [speed, setSpeed] = useState(70) // 0..100 (higher=faster)

    const [algoStats, setAlgoStats] = useState({ comparisons: 0, swaps: 0 })

    const [actionText, setActionText] = useState("Ready")

    const [algorithm, setAlgorithm] = useState("bubble") // "bubble" | "insertion"


    const delayMs = useMemo(() => {
        // speed: 0..100 (higher = faster)
        const minDelay = 10   // fastest
        const maxDelay = 180  // slowest
        const t = Math.min(100, Math.max(0, speed)) / 100
        return Math.round(maxDelay - t * (maxDelay - minDelay))
    }, [speed])



    const stats = useMemo(() => {
        const max = arr.length ? Math.max(...arr) : 0
        return {
            n: arr.length,
            max,
            stepIndex,
            totalSteps: steps.length,
        }
    }, [arr, stepIndex, steps.length])

    const statusText = useMemo(() => {
        if (isRunning) return "Running…"
        if (steps.length > 0 && stepIndex >= steps.length) return "Completed ✓"
        if (steps.length > 0 && stepIndex > 0) return "Paused"
        return "Ready"
    }, [isRunning, steps.length, stepIndex])


    // ----- helpers -----
    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
    }

    const hardReset = (nextBase = baseArr) => {
        setAlgoStats({ comparisons: 0, swaps: 0 })
        stopTimer()
        setIsRunning(false)
        setSteps([])
        setStepIndex(0)
        setActivePair(null)
        setSwapPair(null)
        setSortedSet(new Set())
        setArr(nextBase.slice())
        setActionText("Ready")
    }

    const buildSteps = () => {
        let s = []
        if (algorithm === "bubble") s = bubbleSortSteps(baseArr)
        else if (algorithm === "insertion") s = insertionSortSteps(baseArr)
        else s = bubbleSortSteps(baseArr)

        setSteps(s)
        setStepIndex(0)
        setSortedSet(new Set())
        setActivePair(null)
        setSwapPair(null)
        setAlgoStats({ comparisons: 0, swaps: 0 })
        setActionText("Ready")
        setArr(baseArr.slice())
    }


    const applyOneStep = () => {
        if (stepIndex >= steps.length) return false

        const step = steps[stepIndex]
        setStepIndex((x) => x + 1)

        if (step.type === "COMPARE") {
            const a = arr[step.i]
            const b = arr[step.j]
            setActionText(`Comparing i=${step.i} (${a}) and j=${step.j} (${b})`)
            setActivePair([step.i, step.j])
            setSwapPair(null)

            // if you added counters:
            setAlgoStats((s) => ({ ...s, comparisons: s.comparisons + 1 }))

            return true
        }


        if (step.type === "SWAP") {
            setActionText(`Swapping i=${step.i} and j=${step.j}`)
            setActivePair(null)
            setSwapPair([step.i, step.j])

            // if you added counters:
            setAlgoStats((s) => ({ ...s, swaps: s.swaps + 1 }))

            setArr((prev) => {
                const next = prev.slice()
                const t = next[step.i]
                next[step.i] = next[step.j]
                next[step.j] = t
                return next
            })
            return true
        }


        if (step.type === "MARK_SORTED") {
            setActionText(`Marked sorted: index ${step.i}`)
            setActivePair(null)
            setSwapPair(null)
            setSortedSet((prev) => {
                const next = new Set(prev)
                next.add(step.i)
                return next
            })
            return true
        }


        if (step.type === "DONE") {
            setActionText("Completed ✓")
            setActivePair(null)
            setSwapPair(null)
            stopTimer()
            setIsRunning(false)
            return true
        }


        return true
    }

    const onStart = () => {
        if (isRunning) return

        // If steps aren’t built yet, build them once.
        if (steps.length === 0) buildSteps()
        setActionText("Running…")
        setIsRunning(true)
    }

    const onPause = () => {
        setIsRunning(false)
        setActionText("Paused")
    }

    const onStep = () => {
        if (steps.length === 0) buildSteps()
        applyOneStep()
    }

    const onReset = () => {
        hardReset(baseArr)
    }

    const onUseInput = () => {
        const res = parseInputToArray(input)
        if (!res.ok) {
            setError(res.error)
            return
        }
        setError("")
        setBaseArr(res.value)
        hardReset(res.value)
    }

    const onRandom = () => {
        setError("")
        const n = 60
        const next = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 240))
        setInput(next.join(", "))
        setBaseArr(next)
        hardReset(next)
    }

    useEffect(() => {
        // switching algorithms should reset the run (but keep the same base array)
        hardReset(baseArr)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [algorithm])


    // ----- run loop -----
    useEffect(() => {
        stopTimer()

        if (!isRunning) return

        timerRef.current = setInterval(() => {
            // applyOneStep uses state; safest is to use functional updates,
            // but for now we keep it simple and stop when end is reached.
            // This works fine for v1.
            const done = stepIndex >= steps.length
            if (done) {
                stopTimer()
                setIsRunning(false)
                return
            }
            // Apply next
            // eslint-disable-next-line react-hooks/exhaustive-deps
            applyOneStep()
        }, delayMs)

        return () => stopTimer()
        // We intentionally depend on isRunning + speed + stepIndex + steps length.
    }, [isRunning, delayMs, stepIndex, steps.length])

    // ----- canvas draw -----
    useEffect(() => {
        const canvas = canvasRef.current
        const stage = stageRef.current
        if (!canvas || !stage) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const dpr = window.devicePixelRatio || 1

        const draw = (w, h) => {
            ctx.clearRect(0, 0, w, h)
            ctx.fillStyle = "#020617"
            ctx.fillRect(0, 0, w, h)

            // baseline
            ctx.globalAlpha = 0.12
            ctx.strokeStyle = "#94a3b8"
            ctx.beginPath()
            ctx.moveTo(16, h - 24)
            ctx.lineTo(w - 16, h - 24)
            ctx.stroke()
            ctx.globalAlpha = 1

            const padX = 18
            const padY = 24
            const usableW = w - padX * 2
            const usableH = h - padY * 2
            const n = arr.length
            if (n === 0) return

            const maxV = Math.max(...arr)
            const gap = Math.min(6, usableW / n / 3)
            const barW = (usableW - gap * (n - 1)) / n

            for (let i = 0; i < n; i++) {
                const v = arr[i]
                const barH = (v / maxV) * usableH
                const x = padX + i * (barW + gap)
                const y = padY + (usableH - barH)

                const isActive = activePair?.includes(i)
                const isSwap = swapPair?.includes(i)
                const isSorted = sortedSet.has(i)

                // glow by state
                if (isSwap) {
                    ctx.shadowColor = "rgba(56, 189, 248, 0.95)"
                    ctx.shadowBlur = 22
                } else if (isActive) {
                    ctx.shadowColor = "rgba(99, 102, 241, 0.85)"
                    ctx.shadowBlur = 18
                } else if (isSorted) {
                    ctx.shadowColor = "rgba(34, 197, 94, 0.55)"
                    ctx.shadowBlur = 14
                } else {
                    ctx.shadowBlur = 0
                }

                // bar color by state
                let top = "rgba(99, 102, 241, 0.95)"
                let bot = "rgba(168, 85, 247, 0.75)"

                if (isSorted) {
                    top = "rgba(34, 197, 94, 0.85)"
                    bot = "rgba(16, 185, 129, 0.55)"
                }
                if (isSwap) {
                    top = "rgba(56, 189, 248, 0.95)"
                    bot = "rgba(99, 102, 241, 0.8)"
                }

                const grad = ctx.createLinearGradient(0, y, 0, y + barH)
                grad.addColorStop(0, top)
                grad.addColorStop(1, bot)
                ctx.fillStyle = grad

                ctx.fillRect(x, y, barW, barH)

                if (n <= 30) {
                    ctx.shadowBlur = 0
                    ctx.fillStyle = "rgba(226, 232, 240, 0.75)"
                    ctx.font = "12px system-ui"
                    ctx.textAlign = "center"
                    ctx.fillText(String(v), x + barW / 2, h - 8)
                }
            }

            ctx.shadowBlur = 0
        }

        const resize = () => {
            const rect = stage.getBoundingClientRect()
            const cssW = Math.max(300, Math.floor(rect.width))
            const cssH = Math.max(260, Math.floor(rect.height))

            canvas.width = Math.floor(cssW * dpr)
            canvas.height = Math.floor(cssH * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

            draw(cssW, cssH)
        }

        const ro = new ResizeObserver(() => resize())
        ro.observe(stage)

        resize()
        return () => ro.disconnect()
    }, [arr, activePair, swapPair, sortedSet])

    return (
        <Section id="sorting-visualizer" title="Sorting Visualizer">
            <p className="section-intro">
                Paste your own array or generate one, then animate the algorithm. Bubble Sort is live,  more coming next.
            </p>

            <div className="viz-layout">
                <div className="viz-canvas-wrapper">
                    <div className="viz-stage" ref={stageRef}>
                        <canvas ref={canvasRef} className="viz-canvas" />
                    </div>
                </div>

                <div className="viz-sidebar">
                    <div className="viz-tag">Tool</div>
                    <h3 className="viz-sidebar-title">Controls</h3>

                    <label className="viz-label">Algorithm</label>
                    <select
                        className="viz-select"
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value)}
                        disabled={isRunning}
                    >
                        <option value="bubble">Bubble Sort</option>
                        <option value="insertion">Insertion Sort</option>
                    </select>


                    <label className="viz-label">Input array</label>
                    <textarea
                        className="viz-input"
                        rows={4}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g. 5, 1, 9, 2, 7 or [5 1 9 2 7]"
                        disabled={isRunning}
                    />

                    {error ? <div className="viz-error">{error}</div> : null}

                    <div className="viz-btn-row">
                        <button className="btn primary" onClick={onUseInput} disabled={isRunning}>
                            Use Input
                        </button>
                        <button className="btn secondary" onClick={onRandom} disabled={isRunning}>
                            Random
                        </button>
                    </div>

                    <div className="viz-btn-row" style={{ marginTop: "1rem" }}>
                        {!isRunning ? (
                            <button className="btn primary" onClick={onStart} disabled={arr.length <= 1}>
                                Start
                            </button>
                        ) : (
                            <button className="btn secondary" onClick={onPause}>
                                Pause
                            </button>
                        )}

                        <button className="btn secondary" onClick={onStep} disabled={isRunning || arr.length <= 1}>
                            Step
                        </button>

                        <button className="btn secondary" onClick={onReset}>
                            Reset
                        </button>
                    </div>

                    <label className="viz-label" style={{ marginTop: "1rem" }}>
                        Speed
                    </label>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        style={{ width: "100%" }}
                    />
                    <div className="viz-stats" style={{ marginTop: "0.7rem" }}>
                        <div><span>Items:</span> {stats.n}</div>
                        <div><span>Step:</span> {stats.totalSteps ? `${stats.stepIndex}/${stats.totalSteps}` : "-"}</div>
                        <div><span>Delay:</span> {delayMs}ms</div>
                        <div><span>Comparisons:</span> {algoStats.comparisons}</div>
                        <div><span>Swaps:</span> {algoStats.swaps}</div>
                    </div>

                    <div className="viz-action">
                        {actionText}
                    </div>

                    <p className="viz-hint">Status: {statusText}</p>

                    <p className="viz-hint">
                        Tip: try a reversed array like <code>[9,8,7,6,5,4,3,2,1]</code>.
                    </p>
                </div>
            </div>
        </Section>
    )
}

export default SortingVisualizer

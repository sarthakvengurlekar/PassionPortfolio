import { useEffect, useMemo, useRef, useState } from 'react'

const DEFAULT_SIZE = 32 // 32x32 pixels
const DEFAULT_SCALE = 14 // each pixel is drawn as 16x16 on canvas

const DEFAULT_PALETTE = [
    '#000000',
    '#ffffff',
    '#6366f1',
    '#a855f7',
    '#22c55e',
    '#f97316',
    '#ef4444',
    '#38bdf8',
]

function PixelArtSandbox() {
    const canvasRef = useRef(null)
    const isDrawingRef = useRef(false)
    const pickerRef = useRef(null)
    const isPickingRef = useRef(false)


    const [gridSize, setGridSize] = useState(DEFAULT_SIZE)
    const [scale, setScale] = useState(DEFAULT_SCALE)

    const [color, setColor] = useState('#6366f1')
    const [showGrid, setShowGrid] = useState(true)
    const [isEraser, setIsEraser] = useState(false)

    const [hue, setHue] = useState(260)       // 0..360
    const [sat, setSat] = useState(80)   // 0..100
    const [val, setVal] = useState(90)   // 0..100  (brightness)



    // Flat array: idx = y * gridSize + x, value is color string or null
    const [pixels, setPixels] = useState(() =>
        new Array(DEFAULT_SIZE * DEFAULT_SIZE).fill(null)
    )

    // Reset pixels when gridSize changes
    useEffect(() => {
        setPixels(new Array(gridSize * gridSize).fill(null))
    }, [gridSize])

    const canvasWidth = useMemo(() => gridSize * scale, [gridSize, scale])
    const canvasHeight = useMemo(() => gridSize * scale, [gridSize, scale])

    function getCellFromEvent(e) {
        const canvas = canvasRef.current
        if (!canvas) return null

        const rect = canvas.getBoundingClientRect()

        // Convert mouse position from CSS pixels -> canvas pixels
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        const canvasX = (e.clientX - rect.left) * scaleX
        const canvasY = (e.clientY - rect.top) * scaleY

        const cellX = Math.floor(canvasX / scale)
        const cellY = Math.floor(canvasY / scale)

        if (cellX < 0 || cellX >= gridSize || cellY < 0 || cellY >= gridSize) {
            return null
        }
        return { cellX, cellY }
    }


    function paintCell(cellX, cellY) {
        const idx = cellY * gridSize + cellX
        const nextColor = isEraser ? null : color

        setPixels(prev => {
            if (prev[idx] === nextColor) return prev
            const copy = prev.slice()
            copy[idx] = nextColor
            return copy
        })
    }

    function onPointerDown(e) {
        e.preventDefault()
        isDrawingRef.current = true
        const cell = getCellFromEvent(e)
        if (cell) paintCell(cell.cellX, cell.cellY)
    }

    function onPointerMove(e) {
        if (!isDrawingRef.current) return
        const cell = getCellFromEvent(e)
        if (cell) paintCell(cell.cellX, cell.cellY)
    }

    function stopDrawing() {
        isDrawingRef.current = false
    }

    // Render pixels -> canvas whenever state changes
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.imageSmoothingEnabled = false

        // Background
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        ctx.fillStyle = '#020617'
        ctx.fillRect(0, 0, canvasWidth, canvasHeight)

        // Pixels
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const c = pixels[y * gridSize + x]
                if (!c) continue
                ctx.fillStyle = c
                ctx.fillRect(x * scale, y * scale, scale, scale)
            }
        }

        // Grid overlay
        if (showGrid) {
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)'
            ctx.lineWidth = 1

            for (let i = 0; i <= gridSize; i++) {
                // Vertical
                ctx.beginPath()
                ctx.moveTo(i * scale + 0.5, 0)
                ctx.lineTo(i * scale + 0.5, canvasHeight)
                ctx.stroke()

                // Horizontal
                ctx.beginPath()
                ctx.moveTo(0, i * scale + 0.5)
                ctx.lineTo(canvasWidth, i * scale + 0.5)
                ctx.stroke()
            }
        }
    }, [pixels, gridSize, scale, showGrid, canvasWidth, canvasHeight])

    function clearCanvas() {
        setPixels(new Array(gridSize * gridSize).fill(null))
    }

    function fillAll() {
        const value = isEraser ? null : color
        setPixels(new Array(gridSize * gridSize).fill(value))
    }

    function setSatValFromEvent(e) {
        const el = pickerRef.current
        if (!el) return

        const rect = el.getBoundingClientRect()
        const x = clamp(e.clientX - rect.left, 0, rect.width)
        const y = clamp(e.clientY - rect.top, 0, rect.height)

        const newSat = Math.round((x / rect.width) * 100)
        const newVal = Math.round(100 - (y / rect.height) * 100) // top bright, bottom dark

        setSat(newSat)
        setVal(newVal)
    }


    function onPickerDown(e) {
        e.preventDefault()
        isPickingRef.current = true
        setSatValFromEvent(e)
    }

    function onPickerMove(e) {
        if (!isPickingRef.current) return
        setSatValFromEvent(e)
    }

    function onPickerUp() {
        isPickingRef.current = false
    }


    function hsvToHex(h, s, v) {
        // h:0-360, s:0-100, v:0-100
        s /= 100
        v /= 100

        const c = v * s
        const hh = h / 60
        const x = c * (1 - Math.abs((hh % 2) - 1))
        let r = 0, g = 0, b = 0

        if (0 <= hh && hh < 1) [r, g, b] = [c, x, 0]
        else if (1 <= hh && hh < 2) [r, g, b] = [x, c, 0]
        else if (2 <= hh && hh < 3) [r, g, b] = [0, c, x]
        else if (3 <= hh && hh < 4) [r, g, b] = [0, x, c]
        else if (4 <= hh && hh < 5) [r, g, b] = [x, 0, c]
        else if (5 <= hh && hh < 6) [r, g, b] = [c, 0, x]

        const m = v - c
        r = Math.round((r + m) * 255)
        g = Math.round((g + m) * 255)
        b = Math.round((b + m) * 255)

        return (
            '#' +
            [r, g, b].map(n => n.toString(16).padStart(2, '0')).join('')
        )
    }


    function clamp(n, min, max) {
        return Math.max(min, Math.min(max, n))
    }

    useEffect(() => {
        setIsEraser(false)
        setColor(hsvToHex(hue, sat, val))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hue, sat, val])


    return (
        <section className="section pixel-section">
            <header className="pixel-header">
                <div className="pixel-tag">Tool</div>
                <h2>Pixel Art Sandbox</h2>
                <p className="section-intro">
                    Click + drag to paint. Use the palette, toggle grid, and change canvas size.
                </p>
            </header>

            <div className="pixel-layout">
                <div className="pixel-canvas-wrapper">
                    <canvas
                        ref={canvasRef}
                        className="pixel-canvas"
                        width={canvasWidth}
                        height={canvasHeight}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={stopDrawing}
                        onPointerLeave={stopDrawing}
                        onPointerCancel={stopDrawing}
                    />
                    <p className="pixel-hint">
                        Tip: turn off Grid for clean screenshots. Export button comes next.
                    </p>
                </div>

                <aside className="pixel-sidebar">
                    <h3 className="pixel-sidebar-title">Controls</h3>

                    <div className="pixel-controls">
                        {/* Color / Brush / Eraser */}
                        <div className="pixel-group">
                            <div className="pixel-label">Color (full spectrum)</div>

                            {/* Hue slider */}
                            <input
                                className="pixel-hue"
                                type="range"
                                min="0"
                                max="360"
                                value={hue}
                                onChange={e => setHue(Number(e.target.value))}
                                aria-label="Hue"
                            />

                            {/* Saturation/Lightness square */}
                            <div
                                ref={pickerRef}
                                className="pixel-picker"
                                style={{ '--picker-hue': hue }}
                                onPointerDown={onPickerDown}
                                onPointerMove={onPickerMove}
                                onPointerUp={onPickerUp}
                                onPointerLeave={onPickerUp}
                            >
                                <div className="pixel-picker-hue" />
                                <div className="pixel-picker-sat" />
                                <div className="pixel-picker-val" />

                                <div
                                    className="pixel-picker-dot"
                                    style={{
                                        left: `${sat}%`,
                                        top: `${100 - val}%`,
                                    }}
                                />
                            </div>

                            <div className="pixel-row" style={{ marginTop: '0.8rem' }}>
                                <div className="pixel-color-preview" style={{ background: color }} />
                                <div className="pixel-color-code">{color.toUpperCase()}</div>

                                <button
                                    className={`pixel-pill ${!isEraser ? 'active' : ''}`}
                                    onClick={() => setIsEraser(false)}
                                >
                                    Brush
                                </button>

                                <button
                                    className={`pixel-pill ${isEraser ? 'active' : ''}`}
                                    onClick={() => setIsEraser(true)}
                                >
                                    Eraser
                                </button>
                            </div>
                        </div>

                        {/* Grid toggle */}
                        <div className="pixel-group">
                            <div className="pixel-label">Grid</div>

                            <div className="pixel-pill-row">
                                <button
                                    className={`pixel-pill ${showGrid ? 'active' : ''}`}
                                    onClick={() => setShowGrid(v => !v)}
                                >
                                    {showGrid ? 'Grid: On' : 'Grid: Off'}
                                </button>
                            </div>
                        </div>

                        {/* Size */}
                        <div className="pixel-group">
                            <div className="pixel-label">Canvas Size</div>

                            <div className="pixel-pill-row">
                                {[16, 24, 32, 48].map(s => (
                                    <button
                                        key={s}
                                        className={`pixel-pill ${gridSize === s ? 'active' : ''}`}
                                        onClick={() => setGridSize(s)}
                                    >
                                        {s}×{s}
                                    </button>
                                ))}
                            </div>

                            <div className="pixel-label" style={{ marginTop: '0.8rem' }}>
                                Pixel Scale
                            </div>

                            <div className="pixel-pill-row">
                                {[10, 12, 16, 20].map(sc => (
                                    <button
                                        key={sc}
                                        className={`pixel-pill ${scale === sc ? 'active' : ''}`}
                                        onClick={() => setScale(sc)}
                                    >
                                        {sc}px
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pixel-actions">
                            <button className="btn secondary" onClick={clearCanvas}>
                                Clear
                            </button>

                            <button className="btn primary" onClick={fillAll}>
                                Fill
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    )
}

export default PixelArtSandbox

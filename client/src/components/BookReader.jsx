import { useState, useRef, useEffect, useCallback } from 'react';
import './BookReader.css';

// ---------------------------------------------------------------------------
// Graph SVG
// ---------------------------------------------------------------------------
const NODE_GROUPS = {
  input: {
    color: '#4f8ef7',
    glow: '#4f8ef7',
    label: 'Input',
    nodes: [
      { id: 'n1', x: 30,  y: 60,  w: 110, label: 'Floor Levels' },
      { id: 'n2', x: 30,  y: 120, w: 110, label: 'Offset Distance' },
      { id: 'n3', x: 30,  y: 180, w: 110, label: 'Direction Vector' },
    ],
    box: { x: 16, y: 44, w: 140, h: 160 },
  },
  logic: {
    color: '#fbbf24',
    glow: '#fbbf24',
    label: 'Logic',
    nodes: [
      { id: 'n4', x: 180, y: 80,  w: 100, label: 'List.Map' },
      { id: 'n5', x: 180, y: 140, w: 100, label: 'Vector.Scale' },
      { id: 'n6', x: 180, y: 200, w: 100, label: 'Flatten' },
    ],
    box: { x: 166, y: 64, w: 130, h: 160 },
  },
  output: {
    color: '#34d399',
    glow: '#34d399',
    label: 'Output',
    nodes: [
      { id: 'n7', x: 320, y: 100, w: 110, label: 'Element.Move' },
      { id: 'n8', x: 320, y: 170, w: 110, label: 'FloorType.ByLvl' },
    ],
    box: { x: 306, y: 84, w: 138, h: 110 },
  },
};

// Connector definitions: [fromGroup, fromNodeIdx, toGroup, toNodeIdx]
const CONNECTORS = [
  ['input', 0, 'logic', 0],
  ['input', 1, 'logic', 1],
  ['input', 2, 'logic', 2],
  ['logic', 0, 'output', 0],
  ['logic', 1, 'output', 0],
  ['logic', 2, 'output', 1],
];

const NODE_H = 28;
const GRID_STEP = 28;

function GraphSVG({ hl }) {
  const filterId = 'glow-filter';

  function getGroupOpacity(groupKey) {
    if (!hl) return 1;
    return hl === groupKey ? 1 : 0.2;
  }

  function getConnectorOpacity(fromGroup, toGroup) {
    if (!hl) return 0.55;
    return (hl === fromGroup || hl === toGroup) ? 0.8 : 0.1;
  }

  function nodeRight(group, idx) {
    const n = NODE_GROUPS[group].nodes[idx];
    return { x: n.x + n.w, y: n.y + NODE_H / 2 };
  }
  function nodeLeft(group, idx) {
    const n = NODE_GROUPS[group].nodes[idx];
    return { x: n.x, y: n.y + NODE_H / 2 };
  }

  return (
    <svg
      viewBox="0 0 440 280"
      className="graph-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Grid pattern */}
        <pattern id="grid" width={GRID_STEP} height={GRID_STEP} patternUnits="userSpaceOnUse">
          <path
            d={`M ${GRID_STEP} 0 L 0 0 0 ${GRID_STEP}`}
            fill="none"
            stroke="#2a2f3a"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>

      {/* Background */}
      <rect width="440" height="280" fill="#16191f" rx="6" />
      <rect width="440" height="280" fill="url(#grid)" rx="6" />

      {/* Connectors */}
      {CONNECTORS.map(([fg, fi, tg, ti], idx) => {
        const from = nodeRight(fg, fi);
        const to   = nodeLeft(tg, ti);
        const mx   = (from.x + to.x) / 2;
        return (
          <path
            key={idx}
            d={`M ${from.x} ${from.y} C ${mx} ${from.y}, ${mx} ${to.y}, ${to.x} ${to.y}`}
            fill="none"
            stroke="#6b7280"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity={getConnectorOpacity(fg, tg)}
          />
        );
      })}

      {/* Node groups */}
      {Object.entries(NODE_GROUPS).map(([key, group]) => {
        const opacity = getGroupOpacity(key);
        const active  = !hl || hl === key;
        return (
          <g key={key} opacity={opacity} filter={active && hl ? `url(#${filterId})` : undefined}>
            {/* Dashed group box */}
            <rect
              x={group.box.x}
              y={group.box.y}
              width={group.box.w}
              height={group.box.h}
              fill="none"
              stroke={group.color}
              strokeWidth="1"
              strokeDasharray="5 4"
              rx="5"
              opacity="0.55"
            />
            {/* Nodes */}
            {group.nodes.map((node) => (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height={NODE_H}
                  fill="#1e2330"
                  stroke={group.color}
                  strokeWidth="1.5"
                  rx="4"
                />
                <text
                  x={node.x + node.w / 2}
                  y={node.y + NODE_H / 2 + 1}
                  fill={group.color}
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {node.label}
                </text>
                {/* Input port dot */}
                <circle cx={node.x} cy={node.y + NODE_H / 2} r="3" fill={group.color} opacity="0.8" />
                {/* Output port dot */}
                <circle cx={node.x + node.w} cy={node.y + NODE_H / 2} r="3" fill={group.color} opacity="0.8" />
              </g>
            ))}
            {/* Group label */}
            <text
              x={group.box.x + group.box.w / 2}
              y={group.box.y - 6}
              fill={group.color}
              fontSize="9"
              fontFamily="monospace"
              textAnchor="middle"
              opacity="0.8"
              letterSpacing="2"
            >
              {group.label.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// TOC Popover
// ---------------------------------------------------------------------------
function TocPopover({ steps, currentStep, onSelect, onClose }) {
  return (
    <div className="toc-popover">
      <div className="toc-pop-header">
        <span>Contents</span>
        <button className="toc-close-btn" onClick={onClose}>x</button>
      </div>
      <div className="toc-pop-list">
        {steps.map((step, i) => {
          const done    = i < currentStep;
          const active  = i === currentStep;
          return (
            <button
              key={i}
              className={`toc-pop-row ${active ? 'active' : ''} ${done ? 'done' : ''}`}
              onClick={() => { onSelect(i); onClose(); }}
            >
              <span className="toc-row-num">{i + 1}</span>
              <span className="toc-row-label">{step.label || step.title}</span>
              {done && <span className="toc-check">&#10003;</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BookReader
// ---------------------------------------------------------------------------
function BookReader({ book, steps, currentStep, onStepChange, onBack, onFinish, onPageTurn, onNarrate }) {
  const [tocOpen, setTocOpen]           = useState(false);
  const [flipping, setFlipping]         = useState(false);
  const [flipDir, setFlipDir]           = useState('fwd');   // 'fwd' | 'bwd'
  const [capturedContent, setCaptured]  = useState(null);
  const rightPageRef                    = useRef(null);
  const totalSteps                      = steps.length;
  const step                            = steps[currentStep] || {};
  const isLast                          = currentStep === totalSteps - 1;
  const isFirst                         = currentStep === 0;

  // Capture current right-page inner HTML for flip overlay
  const captureRightPage = useCallback(() => {
    if (rightPageRef.current) {
      setCaptured(rightPageRef.current.innerHTML);
    }
  }, []);

  function navigate(newIndex, direction) {
    if (flipping) return;
    if (onPageTurn) onPageTurn();
    captureRightPage();
    setFlipDir(direction);
    setFlipping(true);
    // After animation ends, commit
    const duration = direction === 'fwd' ? 650 : 550;
    setTimeout(() => {
      setFlipping(false);
      setCaptured(null);
      onStepChange(newIndex);
      const newStep = steps[newIndex];
      if (onNarrate && newStep?.text) {
        onNarrate(newStep.text);
      }
    }, duration);
  }

  function handlePrev() {
    if (isFirst || flipping) return;
    navigate(currentStep - 1, 'bwd');
  }

  function handleNext() {
    if (flipping) return;
    if (isLast) {
      onFinish();
    } else {
      navigate(currentStep + 1, 'fwd');
    }
  }

  // Close TOC when clicking outside
  useEffect(() => {
    if (!tocOpen) return;
    function handler(e) {
      if (!e.target.closest('.toc-popover') && !e.target.closest('.toc-toggle-btn')) {
        setTocOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [tocOpen]);

  const leftPageNum  = currentStep * 2 + 1;
  const rightPageNum = currentStep * 2 + 2;

  // Pill style from step data
  const pillStyle = {
    background:   step.pillBg     || '#fff8f0',
    color:        step.pillColor  || '#b08060',
    borderColor:  step.pillBorder || '#e8d5b8',
  };

  return (
    <div className="book-reader">
      {/* Top bar */}
      <div className="reader-topbar">
        <button className="back-btn" onClick={onBack}>
          &#8592; Back
        </button>
        <span className="reader-title">{book?.title || 'Untitled'}</span>
        <span className="reader-page-indicator">Page {leftPageNum} of {totalSteps * 2}</span>
        <div className="topbar-right">
          <button
            className="toc-toggle-btn"
            onClick={() => setTocOpen((v) => !v)}
          >
            &#9776; Contents
          </button>
        </div>
        {tocOpen && (
          <TocPopover
            steps={steps}
            currentStep={currentStep}
            onSelect={(i) => { navigate(i, i > currentStep ? 'fwd' : 'bwd'); }}
            onClose={() => setTocOpen(false)}
          />
        )}
      </div>

      {/* Book stage */}
      <div className="reader-stage">
        <div className={`book-spread ${flipping ? (flipDir === 'fwd' ? 'flipping-fwd' : 'flipping-bwd') : ''}`}>

          {/* LEFT PAGE */}
          <div className="page-left">
            <div className="chapter-ornament">
              <div className="ornament-line" />
              <span className="ornament-center">Chapter {currentStep + 1}</span>
              <div className="ornament-line" />
            </div>

            <div className="graph-area">
              <GraphSVG hl={step.hl || null} />
            </div>

            <div className="page-legend">
              <span className="legend-item">
                <span className="legend-dot" style={{ background: '#4f8ef7' }} />
                Input
              </span>
              <span className="legend-item">
                <span className="legend-dot" style={{ background: '#fbbf24' }} />
                Logic
              </span>
              <span className="legend-item">
                <span className="legend-dot" style={{ background: '#34d399' }} />
                Output
              </span>
            </div>

            <div className="page-num-left">&#8212; {leftPageNum} &#8212;</div>
          </div>

          {/* SPINE / GUTTER */}
          <div className="book-gutter" />

          {/* RIGHT PAGE WRAPPER (perspective container) */}
          <div className="page-right-wrap">
            {/* Flip overlay — captures snapshot for animation */}
            {flipping && capturedContent && (
              <div
                id="flip-layer"
                className={`flip-page ${flipDir === 'fwd' ? 'flip-fwd' : 'flip-bwd'}`}
                dangerouslySetInnerHTML={{ __html: capturedContent }}
              />
            )}

            {/* Actual right page */}
            <div className="page-right" ref={rightPageRef}>
              {/* Ornament header */}
              <div className="page-ornament">
                <div className="ornament-line" />
                <span className="ornament-center">{book?.title || ''}</span>
                <div className="ornament-line" />
              </div>

              {/* Step type pill */}
              {step.pill && (
                <span className="step-type-pill" style={pillStyle}>
                  {step.pill}
                </span>
              )}

              {/* Step title */}
              <h2 className="right-page-title">{step.title}</h2>

              {/* Story text */}
              <p className="right-page-text">{step.text}</p>

              {/* Callouts */}
              {step.callouts && step.callouts.length > 0 && (
                <div className="callouts-area">
                  {step.callouts.map((c, i) => (
                    <div className="callout-item" key={i}>
                      <span className="callout-k">{c.k}</span>
                      <span className="callout-v">{c.v}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="page-footer">
                <button
                  className="pg-btn pg-btn-prev"
                  onClick={handlePrev}
                  disabled={isFirst || flipping}
                >
                  &#8592; Prev
                </button>

                <span className="pg-num">&#8212; {rightPageNum} &#8212;</span>

                <button
                  className="pg-btn pg-btn-next"
                  onClick={handleNext}
                  disabled={flipping}
                >
                  {isLast ? 'Finish &#10003;' : 'Next \u2192'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookReader;

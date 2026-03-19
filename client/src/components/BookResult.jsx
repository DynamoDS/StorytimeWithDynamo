import React from "react";
import "./BookResult.css";

/* ── Mini SVG: before/after floor slab diagram ────────────────────── */
function OutputVis() {
  const slabW = 80;
  const slabH = 12;
  const gap = 6;
  const totalSlabs = 5;

  /* Before: 5 tightly stacked blue slabs, centred at x=90 */
  const beforeSlabs = Array.from({ length: totalSlabs }, (_, i) => {
    const y = 30 + i * (slabH + gap);
    return (
      <rect
        key={i}
        x={50}
        y={y}
        width={slabW}
        height={slabH}
        rx={3}
        fill="#3b82f6"
        opacity={0.85}
      />
    );
  });

  /* After: 5 green slabs spread apart (offset increases per slab) */
  const afterSlabs = Array.from({ length: totalSlabs }, (_, i) => {
    const spread = 18; // extra vertical gap between slabs
    const y = 30 + i * (slabH + gap + spread) - (totalSlabs * spread) / 2 + 30;
    return (
      <rect
        key={i}
        x={260}
        y={y}
        width={slabW}
        height={slabH}
        rx={3}
        fill="#22c55e"
        opacity={0.85}
      />
    );
  });

  return (
    <svg
      viewBox="0 0 420 160"
      width="100%"
      style={{ maxWidth: 420, display: "block", margin: "0 auto" }}
      aria-label="Before and after diagram showing floors spread apart"
    >
      {/* ── Before label ── */}
      <text x={90} y={20} textAnchor="middle" fontSize={11} fill="#555" fontFamily="Nunito, sans-serif" fontWeight={700}>
        Before
      </text>

      {/* ── After label ── */}
      <text x={300} y={20} textAnchor="middle" fontSize={11} fill="#555" fontFamily="Nunito, sans-serif" fontWeight={700}>
        After
      </text>

      {/* ── Dashed divider ── */}
      <line x1={210} y1={10} x2={210} y2={150} stroke="#d0c0a0" strokeWidth={1} strokeDasharray="4 3" />

      {/* ── Slabs ── */}
      {beforeSlabs}
      {afterSlabs}

      {/* ── Arrow ── */}
      <defs>
        <marker id="arrowhead" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
          <polygon points="0 0, 7 2.5, 0 5" fill="#ff8e53" />
        </marker>
      </defs>
      <line
        x1={145}
        y1={80}
        x2={250}
        y2={80}
        stroke="#ff8e53"
        strokeWidth={2}
        markerEnd="url(#arrowhead)"
      />
      <text x={197} y={74} textAnchor="middle" fontSize={10} fill="#ff8e53" fontFamily="Nunito, sans-serif" fontWeight={700}>
        +600mm
      </text>
    </svg>
  );
}

/* ── Mini SVG for related-tile covers ─────────────────────────────── */
function MiniGraph({ id }) {
  if (id === "wall-height") {
    return (
      <svg viewBox="0 0 120 70" width="100%" height="70" aria-hidden="true">
        <rect width="120" height="70" fill="#1e1e2e" />
        {/* Nodes */}
        <circle cx="20" cy="35" r="6" fill="#3b82f6" />
        <circle cx="60" cy="20" r="6" fill="#8b5cf6" />
        <circle cx="60" cy="50" r="6" fill="#8b5cf6" />
        <circle cx="100" cy="35" r="6" fill="#22c55e" />
        {/* Edges */}
        <line x1="26" y1="35" x2="54" y2="22" stroke="#666" strokeWidth="1.5" />
        <line x1="26" y1="35" x2="54" y2="48" stroke="#666" strokeWidth="1.5" />
        <line x1="66" y1="22" x2="94" y2="35" stroke="#666" strokeWidth="1.5" />
        <line x1="66" y1="48" x2="94" y2="35" stroke="#666" strokeWidth="1.5" />
      </svg>
    );
  }
  /* Column Grid */
  return (
    <svg viewBox="0 0 120 70" width="100%" height="70" aria-hidden="true">
      <rect width="120" height="70" fill="#1e1e2e" />
      <circle cx="15" cy="35" r="5" fill="#f59e0b" />
      <circle cx="40" cy="35" r="5" fill="#8b5cf6" />
      <circle cx="65" cy="20" r="5" fill="#8b5cf6" />
      <circle cx="65" cy="50" r="5" fill="#8b5cf6" />
      <circle cx="90" cy="35" r="5" fill="#3b82f6" />
      <circle cx="110" cy="35" r="5" fill="#22c55e" />
      <line x1="20" y1="35" x2="35" y2="35" stroke="#666" strokeWidth="1.5" />
      <line x1="45" y1="35" x2="60" y2="22" stroke="#666" strokeWidth="1.5" />
      <line x1="45" y1="35" x2="60" y2="48" stroke="#666" strokeWidth="1.5" />
      <line x1="70" y1="22" x2="85" y2="35" stroke="#666" strokeWidth="1.5" />
      <line x1="70" y1="48" x2="85" y2="35" stroke="#666" strokeWidth="1.5" />
      <line x1="95" y1="35" x2="105" y2="35" stroke="#666" strokeWidth="1.5" />
    </svg>
  );
}

/* ── Related tile ─────────────────────────────────────────────────── */
function RelatedTile({ graphId, title, steps, author, onBackToLibrary }) {
  return (
    <div className="related-tile" onClick={onBackToLibrary} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onBackToLibrary()}>
      <div className="related-cover">
        <MiniGraph id={graphId} />
      </div>
      <div className="related-info">
        <div className="related-title">{title}</div>
        <div className="related-meta">{steps} steps &middot; {author}</div>
      </div>
    </div>
  );
}

/* ── BookResult ───────────────────────────────────────────────────── */
export default function BookResult({ book, totalSteps, onReadAgain, onBackToLibrary }) {
  const title = book?.title ?? "Untitled";

  return (
    <div className="result-stage">
      <div className="result-book">

        {/* 1. Banner */}
        <div className="result-banner">
          <span className="result-bang" role="img" aria-label="party">&#127881;</span>
          <div>
            <h3>You&rsquo;ve finished the story!</h3>
            <p>
              All {totalSteps} step{totalSteps !== 1 ? "s" : ""} complete &mdash; you understand this graph from start to finish.
            </p>
          </div>
        </div>

        {/* 2. Output visualization */}
        <div className="result-output">
          <div className="result-output-label">Output &mdash; What this graph produced</div>
          <div className="result-output-vis">
            <OutputVis />
          </div>
        </div>

        {/* 3. Action buttons */}
        <div className="result-btns">
          <button className="r-btn r-btn-ghost" onClick={onReadAgain}>
            Read again
          </button>
          <button
            className="r-btn r-btn-pri"
            onClick={() => {
              /* Placeholder: download the .dyn file */
              const fileName = title.replace(/\s+/g, "_") + ".dyn";
              const blob = new Blob(["{}"], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = fileName;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download .dyn
          </button>
        </div>

        {/* 4. Related books */}
        <div className="related-heading">You might also like</div>
        <div className="related-grid">
          <RelatedTile
            graphId="wall-height"
            title="Wall Height Adjustment"
            steps={6}
            author="Marco Ricci"
            onBackToLibrary={onBackToLibrary}
          />
          <RelatedTile
            graphId="column-grid"
            title="Column Grid Placement"
            steps={10}
            author="Zoe Han"
            onBackToLibrary={onBackToLibrary}
          />
        </div>

      </div>
    </div>
  );
}

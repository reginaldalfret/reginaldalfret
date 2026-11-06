/**
 * 20-Fish Top-Down Japanese Koi Pond SVG Generator
 * Generates an animated, responsive, self-contained SVG with 20 distinct
 * single-color language-themed Koi fish swimming with realistic S-curve
 * body undulation, fluttering fins, water ripples, and obsidian pond background.
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '..', 'assets', 'aquarium.svg');

// 20 Languages with harmonized single-color palettes
// Each koi has a base color, lighter tint for fin rays & scale highlights,
// and a darker shade for depth/shadows. No calico/multicolor patches!
const KOI_DATA = [
  { lang: "TypeScript", color: "#3178C6", light: "#70A9F5", dark: "#1A497E", pathId: "path-1", scale: 1.15, dur: 23, delay: 0, depth: "surface" },
  { lang: "Python", color: "#3572A5", light: "#68A5D8", dark: "#1E4465", pathId: "path-2", scale: 1.12, dur: 27, delay: -4, depth: "surface" },
  { lang: "JavaScript", color: "#E5C02A", light: "#FFE873", dark: "#8C7410", pathId: "path-5", scale: 1.10, dur: 21, delay: -9, depth: "surface" },
  { lang: "Go", color: "#00ADD8", light: "#62D9F7", dark: "#006882", pathId: "path-3", scale: 1.05, dur: 24, delay: -3, depth: "mid" },
  { lang: "Swift", color: "#F05138", light: "#FA8C7A", dark: "#962817", pathId: "path-4", scale: 1.05, dur: 22, delay: -13, depth: "mid" },
  { lang: "C++", color: "#F34B7D", light: "#FF8EAE", dark: "#9E2349", pathId: "path-6", scale: 1.08, dur: 26, delay: -7, depth: "surface" },
  { lang: "C", color: "#7B889B", light: "#B0BAC9", dark: "#465161", pathId: "path-7", scale: 0.88, dur: 32, delay: -15, depth: "deep" },
  { lang: "Rust", color: "#DEA584", light: "#F5CDB5", dark: "#945D40", pathId: "path-8", scale: 1.02, dur: 25, delay: -8, depth: "mid" },
  { lang: "HTML5", color: "#E34C26", light: "#F38164", dark: "#8D270C", pathId: "path-9", scale: 1.06, dur: 23, delay: -17, depth: "mid" },
  { lang: "CSS3", color: "#664994", light: "#9E82CB", dark: "#3E295E", pathId: "path-10", scale: 1.04, dur: 28, delay: -2, depth: "mid" },
  { lang: "SQL", color: "#336791", light: "#6399C5", dark: "#1B3B56", pathId: "path-1", scale: 0.88, dur: 31, delay: -11, depth: "deep" },
  { lang: "Jupyter", color: "#DA5B0B", light: "#F58B47", dark: "#853403", pathId: "path-2", scale: 0.85, dur: 29, delay: -18, depth: "deep" },
  { lang: "Shell", color: "#7CCB38", light: "#A9E874", dark: "#4B811B", pathId: "path-3", scale: 0.95, dur: 25, delay: -5, depth: "mid" },
  { lang: "Java", color: "#B07219", light: "#DDA658", dark: "#69420B", pathId: "path-4", scale: 1.02, dur: 26, delay: -14, depth: "mid" },
  { lang: "Kotlin", color: "#A97BFF", light: "#CDB3FF", dark: "#6735C9", pathId: "path-6", scale: 1.04, dur: 24, delay: -12, depth: "surface" },
  { lang: "Ruby", color: "#CC342D", light: "#EB716B", dark: "#7C1712", pathId: "path-7", scale: 0.85, dur: 33, delay: -6, depth: "deep" },
  { lang: "PHP", color: "#4F5D95", light: "#8490C4", dark: "#2C355B", pathId: "path-8", scale: 0.86, dur: 34, delay: -21, depth: "deep" },
  { lang: "Dart", color: "#00B4AB", light: "#52E5DD", dark: "#006B65", pathId: "path-9", scale: 0.98, dur: 23, delay: -16, depth: "mid" },
  { lang: "Lua", color: "#2B4C9B", light: "#6A89D6", dark: "#14295D", pathId: "path-5", scale: 0.82, dur: 35, delay: -19, depth: "deep" },
  { lang: "Markdown", color: "#1D52B8", light: "#5C8BE8", dark: "#0C2E73", pathId: "path-10", scale: 0.82, dur: 32, delay: -23, depth: "deep" },
];

function generateKoiSVG() {
  const width = 890;
  const height = 380;

  // 10 Scenic curved swimming paths across the tranquil pond
  // Paths go both Left -> Right and Right -> Left with natural curved arcs
  const paths = [
    { id: "path-1", d: "M -120,110 C 160,60 380,180 620,100 S 880,160 1020,120" },
    { id: "path-2", d: "M 1020,250 C 760,300 500,180 280,270 S 60,190 -120,230" },
    { id: "path-3", d: "M -120,290 C 140,230 360,330 600,260 S 860,180 1020,150" },
    { id: "path-4", d: "M 1020,100 C 800,150 560,70 340,160 S 80,270 -120,300" },
    { id: "path-5", d: "M -120,190 C 180,240 420,140 660,220 S 900,170 1020,200" },
    { id: "path-6", d: "M 1020,170 C 780,100 520,220 280,120 S 60,180 -120,160" },
    { id: "path-7", d: "M -120,260 C 120,320 380,220 620,310 S 880,240 1020,270" },
    { id: "path-8", d: "M 1020,310 C 800,260 560,320 340,240 S 100,140 -120,120" },
    { id: "path-9", d: "M -120,80 C 160,120 380,200 620,250 S 880,310 1020,320" },
    { id: "path-10", d: "M 1020,210 C 740,140 480,260 260,180 S 40,240 -120,210" },
  ];

  // Water ripples expanding on the surface
  const ripples = [
    { cx: 220, cy: 140, rMax: 70, dur: 6.5, delay: 0 },
    { cx: 650, cy: 220, rMax: 85, dur: 7.5, delay: 2.5 },
    { cx: 420, cy: 90,  rMax: 60, dur: 5.5, delay: 1.0 },
    { cx: 160, cy: 290, rMax: 75, dur: 7.0, delay: 4.0 },
    { cx: 780, cy: 130, rMax: 65, dur: 6.0, delay: 3.2 },
    { cx: 490, cy: 280, rMax: 80, dur: 8.0, delay: 5.0 },
  ];

  // Build fish elements
  const koiElements = KOI_DATA.map((k, i) => {
    const swimCycle = (1.1 + (i % 4) * 0.15).toFixed(2);
    const finCycle = (swimCycle * 0.7).toFixed(2);
    const opacity = k.depth === "deep" ? "0.68" : k.depth === "mid" ? "0.88" : "1.0";
    const blurFilter = k.depth === "deep" ? 'filter="url(#deep-blur)"' : '';
    const glowFilter = k.depth === "surface" ? 'filter="url(#soft-glow)"' : '';

    return `
    <!-- Koi #${i + 1}: ${k.lang} (${k.color}) -->
    <g opacity="${opacity}" ${blurFilter}>
      <!-- Cruise along spline path with automatic tangent rotation -->
      <animateMotion dur="${k.dur}s" repeatCount="indefinite" rotate="auto" begin="${k.delay}s">
        <mpath href="#${k.pathId}"/>
      </animateMotion>

      <!-- Scaled Koi Group -->
      <g transform="scale(${k.scale})">

        <!-- Pectoral Fin Left (flutters in rhythm) -->
        <g transform="translate(14, -11)">
          <animateTransform attributeName="transform" type="rotate"
            values="-14 0 0; 16 0 0; -14 0 0" dur="${finCycle}s" repeatCount="indefinite" />
          <path d="M 0,0 C 4,-12 -4,-22 -14,-20 C -19,-18 -16,-12 -8,-6 Z"
            fill="${k.color}" fill-opacity="0.45" stroke="${k.light}" stroke-width="0.8" stroke-opacity="0.7"/>
          <!-- Fin Rays -->
          <line x1="0" y1="0" x2="-10" y2="-17" stroke="${k.light}" stroke-width="0.6" stroke-opacity="0.5"/>
          <line x1="0" y1="0" x2="-6" y2="-19" stroke="${k.light}" stroke-width="0.6" stroke-opacity="0.5"/>
        </g>

        <!-- Pectoral Fin Right (flutters in rhythm) -->
        <g transform="translate(14, 11)">
          <animateTransform attributeName="transform" type="rotate"
            values="14 0 0; -16 0 0; 14 0 0" dur="${finCycle}s" repeatCount="indefinite" />
          <path d="M 0,0 C 4,12 -4,22 -14,20 C -19,18 -16,12 -8,6 Z"
            fill="${k.color}" fill-opacity="0.45" stroke="${k.light}" stroke-width="0.8" stroke-opacity="0.7"/>
          <!-- Fin Rays -->
          <line x1="0" y1="0" x2="-10" y2="17" stroke="${k.light}" stroke-width="0.6" stroke-opacity="0.5"/>
          <line x1="0" y1="0" x2="-6" y2="19" stroke="${k.light}" stroke-width="0.6" stroke-opacity="0.5"/>
        </g>

        <!-- Pelvic Fins (delicate ventral fins) -->
        <path d="M -8,-7 C -12,-15 -18,-15 -19,-12 C -18,-9 -13,-7 -8,-7 Z"
          fill="${k.color}" fill-opacity="0.38" stroke="${k.light}" stroke-width="0.6" stroke-opacity="0.6"/>
        <path d="M -8,7 C -12,15 -18,15 -19,12 C -18,9 -13,7 -8,7 Z"
          fill="${k.color}" fill-opacity="0.38" stroke="${k.light}" stroke-width="0.6" stroke-opacity="0.6"/>

        <!-- Main Torso & Head (curves gently as it propels) -->
        <g>
          <animateTransform attributeName="transform" type="rotate"
            values="-3.5 12 0; 3.5 12 0; -3.5 12 0" dur="${swimCycle}s" repeatCount="indefinite" />

          <!-- Torso Silhouette: Single solid language tone -->
          <path d="M 36,0 C 34,-6 24,-12 11,-13 C -2,-13 -10,-10 -18,-6 L -18,6 C -10,10 -2,13 11,13 C 24,12 34,6 36,0 Z"
            fill="${k.color}" stroke="${k.dark}" stroke-width="1.2"/>

          <!-- Shading overlay for biological 3D volume (darker belly sides) -->
          <path d="M 36,0 C 34,-6 24,-12 11,-13 C -2,-13 -10,-10 -18,-6 L -18,6 C -10,10 -2,13 11,13 C 24,12 34,6 36,0 Z"
            fill="url(#koi-shading)" opacity="0.65"/>

          <!-- Dorsal Spine Ridge Highlight -->
          <path d="M 26,0 C 14,-0.5 0,-0.5 -16,0" stroke="${k.light}" stroke-width="1.6" stroke-linecap="round" opacity="0.75"/>

          <!-- Delicate Scale Arcs (Single Color Highlight) -->
          <path d="M 16,-7 Q 12,0 16,7" stroke="${k.light}" stroke-width="0.7" fill="none" opacity="0.4"/>
          <path d="M 8,-8 Q 4,0 8,8" stroke="${k.light}" stroke-width="0.7" fill="none" opacity="0.4"/>
          <path d="M 0,-7 Q -4,0 0,7" stroke="${k.light}" stroke-width="0.7" fill="none" opacity="0.4"/>
          <path d="M -8,-6 Q -12,0 -8,6" stroke="${k.light}" stroke-width="0.7" fill="none" opacity="0.4"/>

          <!-- Sensory Barbels (whiskers at snout) -->
          <path d="M 34,-2 C 38,-5 42,-6 44,-8" stroke="${k.light}" stroke-width="0.9" fill="none" stroke-linecap="round" opacity="0.85"/>
          <path d="M 34,2 C 38,5 42,6 44,8" stroke="${k.light}" stroke-width="0.9" fill="none" stroke-linecap="round" opacity="0.85"/>

          <!-- Eyes -->
          <circle cx="26" cy="-7.5" r="1.6" fill="#0A0E17"/>
          <circle cx="26.3" cy="-7.8" r="0.6" fill="${k.light}"/>
          <circle cx="26" cy="7.5" r="1.6" fill="#0A0E17"/>
          <circle cx="26.3" cy="7.2" r="0.6" fill="${k.light}"/>
        </g>

        <!-- ARTICULATED TAIL SEGMENT 1 (Hinged at X = -18) -->
        <g transform="translate(-18, 0)">
          <animateTransform attributeName="transform" type="rotate"
            values="11 0 0; -11 0 0; 11 0 0" dur="${swimCycle}s" repeatCount="indefinite" />

          <!-- Tail Section 1 Flesh -->
          <path d="M 0,-6 C -5,-5 -10,-4 -15,-2.8 L -15,2.8 C -10,4 -5,5 0,6 Z"
            fill="${k.color}" stroke="${k.dark}" stroke-width="1.0"/>
          <line x1="0" y1="0" x2="-14" y2="0" stroke="${k.light}" stroke-width="1.2" opacity="0.6"/>

          <!-- ARTICULATED TAIL SEGMENT 2 (Hinged at X = -15) -->
          <g transform="translate(-15, 0)">
            <animateTransform attributeName="transform" type="rotate"
              values="-16 0 0; 16 0 0; -16 0 0" dur="${swimCycle}s" repeatCount="indefinite" />

            <!-- Tail Section 2 Flesh -->
            <path d="M 0,-2.8 L -11,-1.5 L -11,1.5 L 0,2.8 Z"
              fill="${k.color}" stroke="${k.dark}" stroke-width="0.8"/>

            <!-- CAUDAL FIN (Hinged at X = -11) - Fluid Sinuous Tail Fan -->
            <g transform="translate(-11, 0)">
              <animateTransform attributeName="transform" type="rotate"
                values="22 0 0; -22 0 0; 22 0 0" dur="${swimCycle}s" repeatCount="indefinite" />

              <!-- Translucent Bifurcated Fin Body in Single Color -->
              <path d="M 0,0 C -5,-5 -15,-13 -25,-12 C -28,-11 -26,-5 -20,0 C -26,5 -28,11 -25,12 C -15,13 -5,5 0,0 Z"
                fill="${k.color}" fill-opacity="0.55" stroke="${k.light}" stroke-width="0.9" stroke-opacity="0.85"/>

              <!-- Flowing Fin Rays -->
              <path d="M 0,0 C -8,-4 -16,-9 -24,-11" stroke="${k.light}" stroke-width="0.6" stroke-opacity="0.6" fill="none"/>
              <path d="M 0,0 C -9,-2 -17,-5 -23,-5" stroke="${k.light}" stroke-width="0.6" stroke-opacity="0.6" fill="none"/>
              <path d="M 0,0 L -19,0" stroke="${k.light}" stroke-width="0.7" stroke-opacity="0.7"/>
              <path d="M 0,0 C -9,2 -17,5 -23,5" stroke="${k.light}" stroke-width="0.6" stroke-opacity="0.6" fill="none"/>
              <path d="M 0,0 C -8,4 -16,9 -24,11" stroke="${k.light}" stroke-width="0.6" stroke-opacity="0.6" fill="none"/>
            </g> <!-- End Caudal Fin -->
          </g> <!-- End Tail Segment 2 -->
        </g> <!-- End Tail Segment 1 -->

      </g> <!-- End Scaled Koi -->
    </g>
    `;
  }).join("\n");

  // Construct Full SVG Document
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    <!-- Deep Water Background Gradient -->
    <radialGradient id="pond-center" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#0c192c"/>
      <stop offset="55%" stop-color="#07101d"/>
      <stop offset="100%" stop-color="#03070d"/>
    </radialGradient>

    <!-- Caustic Water Lighting Overlay -->
    <radialGradient id="caustic-glow" cx="45%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#00f2fe" stop-opacity="0.08"/>
      <stop offset="60%" stop-color="#3b82f6" stop-opacity="0.03"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <!-- Biological 3D Torso Shading Gradient -->
    <linearGradient id="koi-shading" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.4"/>
      <stop offset="35%" stop-color="#ffffff" stop-opacity="0.15"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="65%" stop-color="#ffffff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.4"/>
    </linearGradient>

    <!-- Deep-water Depth Blur Filter -->
    <filter id="deep-blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.6"/>
    </filter>

    <!-- Surface Soft Glow Filter -->
    <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="0.8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Scenic Spline Paths -->
    ${paths.map(p => `<path id="${p.id}" d="${p.d}" fill="none"/>`).join("\n    ")}
  </defs>

  <style>
    .pond-bg { fill: url(#pond-center); }
    .pond-border { stroke: rgba(0, 242, 254, 0.18); stroke-width: 1.5; fill: none; }
    .badge-text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif; }
  </style>

  <!-- POND BASIN & WATER -->
  <rect width="${width}" height="${height}" rx="18" class="pond-bg"/>
  <rect width="${width}" height="${height}" rx="18" fill="url(#caustic-glow)"/>

  <!-- WATER RIPPLES -->
  <g>
    ${ripples.map((r, idx) => `
    <circle cx="${r.cx}" cy="${r.cy}" r="6" fill="none" stroke="#00f2fe" stroke-width="1.2">
      <animate attributeName="r" values="6; ${r.rMax}" dur="${r.dur}s" begin="${r.delay}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.45; 0" dur="${r.dur}s" begin="${r.delay}s" repeatCount="indefinite"/>
      <animate attributeName="stroke-width" values="1.4; 0.2" dur="${r.dur}s" begin="${r.delay}s" repeatCount="indefinite"/>
    </circle>`).join("")}
  </g>

  <!-- MINIMALIST CORNER LILY PADS (Authentic Zen Pond Depth) -->
  <g opacity="0.65">
    <!-- Top-Left Lily Pad -->
    <path d="M 28,12 C 55,8 70,30 65,58 C 60,82 32,85 14,68 C -2,52 -2,22 18,12 Z" fill="#0c231c" stroke="#164e3c" stroke-width="1.2"/>
    <path d="M 38,45 L 64,56" stroke="#071712" stroke-width="1.8"/>
    <path d="M 38,45 L 20,14" stroke="#164e3c" stroke-width="0.8" opacity="0.6"/>
    <path d="M 38,45 L 68,32" stroke="#164e3c" stroke-width="0.8" opacity="0.6"/>
    <path d="M 38,45 L 24,72" stroke="#164e3c" stroke-width="0.8" opacity="0.6"/>

    <!-- Bottom-Right Lily Pad -->
    <path d="M 855,320 C 885,315 905,335 898,362 C 890,388 860,392 840,375 C 825,358 828,330 848,320 Z" fill="#0c231c" stroke="#164e3c" stroke-width="1.2"/>
    <path d="M 865,352 L 896,360" stroke="#071712" stroke-width="1.8"/>
    <path d="M 865,352 L 850,322" stroke="#164e3c" stroke-width="0.8" opacity="0.6"/>
    <path d="M 865,352 L 892,335" stroke="#164e3c" stroke-width="0.8" opacity="0.6"/>
  </g>

  <!-- SWIMMING KOI FISH (20 Languages, Single-Color Aesthetic) -->
  ${koiElements}

  <!-- POND HEADER OVERLAY -->
  <g opacity="0.92">
    <!-- Header Pill -->
    <rect x="24" y="20" width="220" height="30" rx="15" fill="#04080f" fill-opacity="0.8" stroke="rgba(0, 242, 254, 0.25)" stroke-width="1"/>
    <circle cx="39" cy="35" r="4.5" fill="#00F2FE">
      <animate attributeName="opacity" values="1; 0.35; 1" dur="2.2s" repeatCount="indefinite"/>
    </circle>
    <text x="52" y="39" fill="#E2E8F0" font-size="11" font-weight="700" letter-spacing="1" class="badge-text">20-LANG KOI POND</text>

    <!-- Active Metric Pill -->
    <rect x="${width - 150}" y="20" width="126" height="30" rx="15" fill="#04080f" fill-opacity="0.8" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1"/>
    <text x="${width - 87}" y="39" fill="#94A3B8" font-size="10.5" font-weight="600" text-anchor="middle" letter-spacing="0.5" class="badge-text">20 FISH · MONO-HUE</text>
  </g>

  <!-- POND BORDER RIM -->
  <rect width="${width - 2}" height="${height - 2}" x="1" y="1" rx="17" class="pond-border"/>
</svg>
`;

  fs.writeFileSync(OUTPUT_FILE, svg.trim(), 'utf8');
  console.log(`Successfully generated 20-Koi Top-Down Pond SVG: ${OUTPUT_FILE} (${Buffer.byteLength(svg)} bytes)`);
}

generateKoiSVG();

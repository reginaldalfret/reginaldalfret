/**
 * 20-Fish Code Aquarium SVG Generator for GitHub Profile
 * Generates an animated, responsive, self-contained SVG with 20 distinct language-themed fish.
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '..', 'assets', 'aquarium.svg');

const FISH_DATA = [
  { lang: "TypeScript", color: "#3178C6", sec: "#599FEA", y: 140, scale: 1.35, dur: 22, dir: 1, delay: 0, layer: "front" },
  { lang: "Python", color: "#3572A5", sec: "#FFD43B", y: 195, scale: 1.3, dur: 26, dir: -1, delay: -4, layer: "front" },
  { lang: "JavaScript", color: "#F1E05A", sec: "#FFF089", y: 95, scale: 1.25, dur: 20, dir: 1, delay: -8, layer: "front" },
  { lang: "Go", color: "#00ADD8", sec: "#5ED4F3", y: 240, scale: 1.05, dur: 24, dir: -1, delay: -2, layer: "mid" },
  { lang: "Swift", color: "#F05138", sec: "#FA8976", y: 120, scale: 1.05, dur: 23, dir: 1, delay: -12, layer: "mid" },
  { lang: "C++", color: "#F34B7D", sec: "#FF80A6", y: 275, scale: 1.15, dur: 28, dir: 1, delay: -6, layer: "front" },
  { lang: "C", color: "#6A737D", sec: "#959DA5", y: 70, scale: 0.85, dur: 32, dir: -1, delay: -15, layer: "back" },
  { lang: "Rust", color: "#DEA584", sec: "#F6C4A6", y: 160, scale: 1.0, dur: 25, dir: -1, delay: -9, layer: "mid" },
  { lang: "HTML5", color: "#E34C26", sec: "#F06529", y: 215, scale: 1.1, dur: 21, dir: 1, delay: -17, layer: "mid" },
  { lang: "CSS3", color: "#563D7C", sec: "#8A6BB7", y: 295, scale: 1.05, dur: 27, dir: -1, delay: -3, layer: "mid" },
  { lang: "SQL", color: "#336791", sec: "#4A8FC7", y: 310, scale: 0.85, dur: 34, dir: 1, delay: -10, layer: "back" },
  { lang: "Jupyter", color: "#DA5B0B", sec: "#F37626", y: 105, scale: 0.8, dur: 30, dir: -1, delay: -14, layer: "back" },
  { lang: "Shell", color: "#89E051", sec: "#B4F28D", y: 80, scale: 0.9, dur: 23, dir: 1, delay: -5, layer: "mid" },
  { lang: "Java", color: "#B07219", sec: "#E59833", y: 175, scale: 1.0, dur: 26, dir: 1, delay: -18, layer: "mid" },
  { lang: "Kotlin", color: "#A97BFF", sec: "#C9ACFF", y: 230, scale: 1.05, dur: 25, dir: -1, delay: -11, layer: "front" },
  { lang: "Ruby", color: "#CC342D", sec: "#F25E57", y: 135, scale: 0.75, dur: 31, dir: -1, delay: -7, layer: "back" },
  { lang: "PHP", color: "#4F5D95", sec: "#7A86B8", y: 285, scale: 0.75, dur: 35, dir: 1, delay: -21, layer: "back" },
  { lang: "Dart", color: "#00B4AB", sec: "#4DEBE3", y: 110, scale: 0.95, dur: 22, dir: -1, delay: -13, layer: "front" },
  { lang: "Lua", color: "#000080", sec: "#4169E1", y: 150, scale: 0.7, dur: 36, dir: 1, delay: -16, layer: "back" },
  { lang: "Markdown", color: "#083FA1", sec: "#366FD8", y: 260, scale: 0.7, dur: 33, dir: -1, delay: -19, layer: "back" },
];

function generateSVG() {
  const width = 850;
  const height = 440;

  // Build fish elements
  const fishMarkup = FISH_DATA.map((f, i) => {
    const isRight = f.dir === 1;
    const fromX = isRight ? -100 : width + 100;
    const toX = isRight ? width + 100 : -100;
    const flipTransform = isRight ? "" : "scale(-1, 1)";
    const tailFrequency = 0.35 + (i % 5) * 0.05;
    const waveFrequency = (f.dur / 4).toFixed(1);
    const opacity = f.layer === "back" ? "0.75" : f.layer === "mid" ? "0.9" : "1.0";
    const depthFilter = f.layer === "back" ? 'filter="url(#slight-blur)"' : '';

    return `
    <!-- Fish ${i + 1}: ${f.lang} -->
    <g opacity="${opacity}" ${depthFilter}>
      <!-- Translation across tank -->
      <animateTransform
        attributeName="transform"
        type="translate"
        values="${fromX}, ${f.y}; ${toX}, ${f.y}"
        dur="${f.dur}s"
        begin="${f.delay}s"
        repeatCount="indefinite"
      />
      <!-- Sinusoidal bobbing -->
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,-8; 0,8; 0,0"
          dur="${waveFrequency}s"
          repeatCount="indefinite"
          additive="sum"
        />
        <!-- Orientation & Scaling -->
        <g transform="${flipTransform} scale(${f.scale})">
          <!-- Caudal / Tail Fin with wiggle -->
          <g transform="translate(-24, 0)">
            <path d="M0,0 C-12,-10 -20,-14 -22,-10 C-18,-2 -15,0 -22,10 C-20,14 -12,10 0,0 Z" fill="url(#grad-${i})" opacity="0.88">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="-12 0 0; 12 0 0; -12 0 0"
                dur="${tailFrequency}s"
                repeatCount="indefinite"
              />
            </path>
          </g>
          
          <!-- Dorsal Fin -->
          <path d="M-6,-11 C2,-18 12,-16 18,-9 C10,-10 -2,-8 -6,-11 Z" fill="${f.sec}" opacity="0.85" />
          
          <!-- Ventral Fin -->
          <path d="M-4,10 C2,16 10,14 14,8 C8,9 0,8 -4,10 Z" fill="${f.sec}" opacity="0.75" />

          <!-- Streamlined Body -->
          <path d="M-24,0 C-16,-13 12,-12 24,0 C12,12 -16,13 -24,0 Z" fill="url(#grad-${i})" />
          
          <!-- Accent Stripe / Markings -->
          <path d="M-2,-10 C2,-4 2,4 -2,10 C-5,6 -5,-6 -2,-10 Z" fill="${f.sec}" opacity="0.55" />
          <path d="M8,-8 C11,-3 11,3 8,8 C6,5 6,-5 8,-8 Z" fill="${f.sec}" opacity="0.4" />

          <!-- Pectoral Fin with subtle flutter -->
          <path d="M2,2 C-2,6 -4,11 0,11 C2,10 4,6 2,2 Z" fill="${f.sec}" opacity="0.8">
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="-8 2 2; 15 2 2; -8 2 2"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </path>

          <!-- Eye with White Glint -->
          <circle cx="15" cy="-3" r="2.8" fill="#FFFFFF" />
          <circle cx="16" cy="-3.2" r="1.6" fill="#0A0E17" />
          <circle cx="16.5" cy="-3.6" r="0.7" fill="#FFFFFF" />
        </g>
      </g>
    </g>`;
  }).join("\n");

  // Build seaweed elements
  const seaweedPositions = [35, 75, 120, 280, 420, 560, 710, 790, 825];
  const seaweedMarkup = seaweedPositions.map((x, idx) => {
    const h = 120 + (idx % 4) * 35;
    const rotSpeed = 3.5 + (idx % 3) * 0.8;
    const delay = (idx * -0.7).toFixed(1);
    const color = idx % 2 === 0 ? "#0D3328" : "#134636";
    const accent = idx % 2 === 0 ? "#1B5E4B" : "#23725C";
    return `
    <g transform="translate(${x}, ${height - 40})">
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="-4 ${x} ${height - 40}; 4 ${x} ${height - 40}; -4 ${x} ${height - 40}"
        dur="${rotSpeed}s"
        begin="${delay}s"
        repeatCount="indefinite"
      />
      <path d="M0,0 Q-15,-${h * 0.3} 5,-${h * 0.6} T0,-${h}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" opacity="0.8" />
      <path d="M0,0 Q12,-${h * 0.3} -4,-${h * 0.6} T2,-${h * 0.9}" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round" opacity="0.6" />
    </g>`;
  }).join("\n");

  // Rising bubbles
  const bubbleCols = [90, 160, 240, 350, 470, 580, 680, 760];
  const bubblesMarkup = bubbleCols.map((bx, idx) => {
    const dur = 4 + (idx % 4) * 0.8;
    const bdelay = (idx * -1.2).toFixed(1);
    const r = 2.5 + (idx % 3);
    return `
    <circle cx="${bx}" cy="${height - 50}" r="${r}" fill="#00F2FE" opacity="0.35">
      <animate
        attributeName="cy"
        values="${height - 50}; 30"
        dur="${dur}s"
        begin="${bdelay}s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="cx"
        values="${bx}; ${bx + 6}; ${bx - 6}; ${bx}"
        dur="${dur}s"
        begin="${bdelay}s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0; 0.5; 0.6; 0"
        dur="${dur}s"
        begin="${bdelay}s"
        repeatCount="indefinite"
      />
    </circle>`;
  }).join("\n");

  // Gradients for 20 fish
  const gradients = FISH_DATA.map((f, i) => `
    <linearGradient id="grad-${i}" x1="100%" y1="0%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="${f.sec}" />
      <stop offset="60%" stop-color="${f.color}" />
      <stop offset="100%" stop-color="${f.color}" stop-opacity="0.85" />
    </linearGradient>`).join("");

  // Legend pills at the bottom
  const legendItems = FISH_DATA.map(f => `
    <span style="display:inline-flex;align-items:center;gap:4px;margin:2px 5px;font-size:11px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;color:#CBD5E1;">
      <span style="width:8px;height:8px;border-radius:50%;background-color:${f.color};display:inline-block;box-shadow:0 0 6px ${f.color}88;"></span>
      <span>${f.lang}</span>
    </span>`).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="auto" style="border-radius: 20px; overflow: hidden; background: #030712;">
  <defs>
    <!-- Deep Sea Obsidian Gradient -->
    <linearGradient id="water-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#020817" />
      <stop offset="35%" stop-color="#061224" />
      <stop offset="75%" stop-color="#07182E" />
      <stop offset="100%" stop-color="#020713" />
    </linearGradient>

    <!-- Caustic Light Rays from surface -->
    <linearGradient id="sun-ray" x1="0%" y1="0%" x2="30%" y2="100%">
      <stop offset="0%" stop-color="#00F2FE" stop-opacity="0.12" />
      <stop offset="50%" stop-color="#38BDF8" stop-opacity="0.04" />
      <stop offset="100%" stop-color="#020817" stop-opacity="0" />
    </linearGradient>

    <!-- Sandy Bed Gradient -->
    <linearGradient id="sand-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0B1C2D" />
      <stop offset="100%" stop-color="#02050A" />
    </linearGradient>

    <filter id="slight-blur">
      <feGaussianBlur stdDeviation="0.8" />
    </filter>

    ${gradients}
  </defs>

  <!-- Tank Glass & Water Background -->
  <rect width="${width}" height="${height}" fill="url(#water-grad)" />

  <!-- Ambient Light Rays -->
  <polygon points="40,0 160,0 240,${height} 60,${height}" fill="url(#sun-ray)" />
  <polygon points="260,0 410,0 520,${height} 320,${height}" fill="url(#sun-ray)" />
  <polygon points="540,0 670,0 790,${height} 620,${height}" fill="url(#sun-ray)" />

  <!-- Background Swaying Seaweed -->
  ${seaweedMarkup}

  <!-- Rising Air Bubbles -->
  ${bubblesMarkup}

  <!-- 20 Swimming Language Fish -->
  ${fishMarkup}

  <!-- Ocean Bed / Obsidian Sand -->
  <path d="M0,${height - 35} Q140,${height - 48} 280,${height - 36} T560,${height - 42} T${width},${height - 35} L${width},${height} L0,${height} Z" fill="url(#sand-grad)" />
  <path d="M0,${height - 32} Q210,${height - 42} 420,${height - 34} T${width},${height - 30} L${width},${height} L0,${height} Z" fill="#010408" opacity="0.6" />

  <!-- Water Surface Glimmer -->
  <line x1="0" y1="1" x2="${width}" y2="1" stroke="#00F2FE" stroke-width="1.5" opacity="0.35" />
  <line x1="0" y1="3" x2="${width}" y2="3" stroke="#38BDF8" stroke-width="0.75" opacity="0.2" />

  <!-- Tank Frame Outline -->
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="19.5" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
</svg>`;
}

// Generate SVG
const svgContent = generateSVG();
fs.writeFileSync(OUTPUT_FILE, svgContent, 'utf8');
console.log(`Successfully generated 20-fish Code Aquarium SVG: ${OUTPUT_FILE} (${svgContent.length} bytes)`);

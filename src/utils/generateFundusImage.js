/**
 * Generates data URLs for retinal fundus images and Grad-CAM heatmap overlays.
 * Custom built HTML5 Canvas renderer to ensure 100% offline reliability & crisp visuals.
 */

export function generateFundusDataUrl(severity = 'moderate') {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  // Dark background
  ctx.fillStyle = '#060a0f';
  ctx.fillRect(0, 0, 600, 600);

  // Retinal disc base (orange-red globe)
  const baseGrad = ctx.createRadialGradient(300, 300, 50, 300, 300, 270);
  baseGrad.addColorStop(0, '#d84a1b');
  baseGrad.addColorStop(0.6, '#9e2a0b');
  baseGrad.addColorStop(0.9, '#4a1003');
  baseGrad.addColorStop(1, '#1a0401');

  ctx.beginPath();
  ctx.arc(300, 300, 270, 0, Math.PI * 2);
  ctx.fillStyle = baseGrad;
  ctx.fill();

  // Optic Disc (bright yellowish circle on the left/nasal side)
  const discGrad = ctx.createRadialGradient(210, 290, 5, 210, 290, 45);
  discGrad.addColorStop(0, '#fff4cc');
  discGrad.addColorStop(0.7, '#ffcc66');
  discGrad.addColorStop(1, '#d86b1b');

  ctx.beginPath();
  ctx.arc(210, 290, 42, 0, Math.PI * 2);
  ctx.fillStyle = discGrad;
  ctx.fill();

  // Macula (darker spot on temporal side)
  const maculaGrad = ctx.createRadialGradient(370, 310, 5, 370, 310, 35);
  maculaGrad.addColorStop(0, '#2d0903');
  maculaGrad.addColorStop(1, '#7a1f0a');

  ctx.beginPath();
  ctx.arc(370, 310, 35, 0, Math.PI * 2);
  ctx.fillStyle = maculaGrad;
  ctx.fill();

  // Blood Vessels (Arcades branching out from optic disc)
  ctx.strokeStyle = '#6e0f03';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';

  // Superior arcade
  ctx.beginPath();
  ctx.moveTo(210, 290);
  ctx.bezierCurveTo(240, 210, 310, 150, 440, 140);
  ctx.stroke();

  // Inferior arcade
  ctx.beginPath();
  ctx.moveTo(210, 290);
  ctx.bezierCurveTo(250, 370, 330, 430, 450, 440);
  ctx.stroke();

  // Nasal branches
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(210, 290);
  ctx.bezierCurveTo(150, 240, 100, 220, 60, 210);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(210, 290);
  ctx.bezierCurveTo(140, 340, 90, 370, 50, 390);
  ctx.stroke();

  // Smaller vessel branches
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#821406';

  const branches = [
    { start: [280, 180], cp1: [320, 140], cp2: [360, 120], end: [410, 100] },
    { start: [310, 420], cp1: [350, 460], cp2: [400, 480], end: [460, 490] },
    { start: [350, 150], cp1: [380, 180], cp2: [400, 220], end: [420, 250] },
  ];

  branches.forEach(b => {
    ctx.beginPath();
    ctx.moveTo(b.start[0], b.start[1]);
    ctx.bezierCurveTo(b.cp1[0], b.cp1[1], b.cp2[0], b.cp2[1], b.end[0], b.end[1]);
    ctx.stroke();
  });

  // Pathology details based on severity
  if (severity !== 'none') {
    // Microaneurysms (small red dots)
    ctx.fillStyle = '#ff1a1a';
    const maCoords = [
      [340, 270, 4], [390, 260, 3], [320, 340, 4], [380, 360, 5],
      [420, 290, 3], [350, 230, 4], [400, 220, 3], [310, 260, 5],
      [440, 330, 4], [330, 380, 3], [370, 400, 4], [290, 320, 3]
    ];
    const count = severity === 'mild' ? 4 : severity === 'moderate' ? 8 : 12;
    for (let i = 0; i < count; i++) {
      const [x, y, r] = maCoords[i];
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hemorrhages (larger irregular red spots)
    if (severity === 'moderate' || severity === 'severe' || severity === 'proliferative') {
      ctx.fillStyle = '#b30000';
      const hemCoords = [
        [360, 380, 8], [420, 360, 10], [330, 190, 7], [450, 240, 12], [280, 440, 9]
      ];
      const hCount = severity === 'moderate' ? 2 : 5;
      for (let i = 0; i < hCount; i++) {
        const [x, y, r] = hemCoords[i];
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Exudates (bright yellowish-white waxy deposits)
    if (severity === 'moderate' || severity === 'severe' || severity === 'proliferative') {
      ctx.fillStyle = '#fffae6';
      const exCoords = [
        [355, 295, 5], [365, 285, 4], [380, 335, 6], [395, 340, 5], [345, 330, 4]
      ];
      exCoords.forEach(([x, y, r]) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Neovascularization / Fibrous (proliferative)
    if (severity === 'proliferative') {
      ctx.strokeStyle = '#ff9999';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(210, 290);
        ctx.lineTo(210 + Math.cos(angle) * 55, 290 + Math.sin(angle) * 55);
        ctx.stroke();
      }
    }
  }

  return canvas.toDataURL('image/jpeg', 0.9);
}

export function generateHeatmapDataUrl(severity = 'moderate') {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  // Heatmap spots over affected areas
  const heatSpots = [
    { x: 360, y: 300, radius: 100, intensity: 0.9 }, // macula region
    { x: 400, y: 260, radius: 70, intensity: 0.75 },
    { x: 340, y: 370, radius: 80, intensity: 0.8 },
    { x: 440, y: 330, radius: 60, intensity: 0.65 },
    { x: 210, y: 290, radius: 70, intensity: severity === 'proliferative' ? 0.95 : 0.4 },
  ];

  heatSpots.forEach(spot => {
    const radGrad = ctx.createRadialGradient(spot.x, spot.y, 5, spot.x, spot.y, spot.radius);
    radGrad.addColorStop(0, `rgba(255, 0, 0, ${spot.intensity})`);
    radGrad.addColorStop(0.4, `rgba(255, 165, 0, ${spot.intensity * 0.8})`);
    radGrad.addColorStop(0.7, `rgba(255, 255, 0, ${spot.intensity * 0.5})`);
    radGrad.addColorStop(1, 'rgba(0, 0, 255, 0)');

    ctx.beginPath();
    ctx.arc(spot.x, spot.y, spot.radius, 0, Math.PI * 2);
    ctx.fillStyle = radGrad;
    ctx.fill();
  });

  return canvas.toDataURL('image/png');
}

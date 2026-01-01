// Minimal particle physics worker (ESM-compatible)
let count = 0;
let width = 800;
let height = 600;
let positions: Float32Array | null = null;
let vx: Float32Array | null = null;
let vy: Float32Array | null = null;
let radii: Float32Array | null = null;
let config: any = {};
let paused = false;
let mouseX = -1000;
let mouseY = -1000;
let mouseRadius = 120;
let intervalId: number | null = null;

function rand(min = 0, max = 1) {
  return Math.random() * (max - min) + min;
}

function init(c: {count: number; width: number; height: number; config?: any}) {
  count = Math.max(0, Math.floor(c.count || 0));
  width = c.width || width;
  height = c.height || height;
  config = c.config || config;

  positions = new Float32Array(count * 2);
  vx = new Float32Array(count);
  vy = new Float32Array(count);
  radii = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[2 * i] = rand(0, width);
    positions[2 * i + 1] = rand(0, height);
    vx[i] = (Math.random() - 0.5) * (config.speed || 0.4);
    vy[i] = (Math.random() - 0.5) * (config.speed || 0.4);
    radii[i] = rand(1, 2.5);
  }

  if (intervalId) clearInterval(intervalId);
  intervalId = self.setInterval(tick, 1000 / 60);
}

function resize(w: number, h: number) {
  width = w; height = h;
}

function setCount(newCount: number) {
  init({count: newCount, width, height, config});
}

function updateConfig(cfg: any) {
  config = {...config, ...(cfg || {})};
}

function setMouse(x: number, y: number) {
  mouseX = x; mouseY = y;
}

function setPaused(p: boolean) {
  paused = !!p;
}

function tick() {
  if (!positions || !vx || !vy) return;
  const damping = 0.988;
  const jitterStrength = (config.speed || 0.4) * 0.06;

  for (let i = 0; i < count; i++) {
    if (!paused) {
      vx[i] *= damping;
      vy[i] *= damping;
      vx[i] += (Math.random() - 0.5) * jitterStrength;
      vy[i] += (Math.random() - 0.5) * jitterStrength;

      let x = positions[2 * i] + vx[i];
      let y = positions[2 * i + 1] + vy[i];

      if (x < -50) x = width + 50;
      if (x > width + 50) x = -50;
      if (y < -50) y = height + 50;
      if (y > height + 50) y = -50;

      // simple mouse attraction when within radius
      if (config.enableMouseAttract && mouseX > -999) {
        const dx = mouseX - x;
        const dy = mouseY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0 && dist < mouseRadius) {
          const strength = (1 - dist / mouseRadius) * 0.12 * (config.speed || 0.4);
          vx[i] += (dx / dist) * strength;
          vy[i] += (dy / dist) * strength;
        }
      }

      positions[2 * i] = x;
      positions[2 * i + 1] = y;
    }
  }

  // Transfer positions buffer to main thread (makes a copy for safety)
  const out = new Float32Array(positions);
  (self as any).postMessage({type: 'positions', positions: out}, [out.buffer]);
}

self.addEventListener('message', (ev) => {
  const data = ev.data;
  if (!data || !data.type) return;

  switch (data.type) {
    case 'init':
      init({count: data.count || 0, width: data.width || width, height: data.height || height, config: data.config || {}});
      break;
    case 'resize':
      resize(data.width, data.height);
      break;
    case 'setCount':
      setCount(data.count);
      break;
    case 'updateConfig':
      updateConfig(data.config);
      break;
    case 'mouse':
      setMouse(data.x, data.y);
      break;
    case 'paused':
      setPaused(!!data.paused);
      break;
  }
});

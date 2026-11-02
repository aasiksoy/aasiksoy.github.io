import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import * as GSAP from "gsap";

const gsap = GSAP.gsap || GSAP.default;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =========================================================
   CONTENT: edit your text here
   ========================================================= */

const PHOTOS = [
  { src: "images/photos/photo1.jpg", caption: "Caption one", alt: "Describe photo one" },
  { src: "images/photos/photo2.jpg", caption: "Caption two", alt: "Describe photo two" },
  { src: "images/photos/photo3.jpg", caption: "Caption three", alt: "Describe photo three" },
];

const SECTIONS = {
  experience: {
    drink: "The Experience Roast",
    title: "Experience",
    body: `
      <h3>Master Thesis Intern · IBA</h3>
      <p class="meta">Louvain-la-Neuve · Oct 2026 – present · with KU Leuven</p>
      <p>Dose tracking and accumulation in adaptive proton therapy. A patient's anatomy changes between
      treatment sessions, so the doses from each session can't simply be added together. I'm developing
      software that processes 3D medical images (CT scans and dose maps) and uses deformable image
      registration to map each session's dose back onto the planning CT. In the final stage, we'll build
      machine learning models that predict the final accumulated dose from the sessions delivered so far.</p>
      <p class="meta">Supervised by Dr. Kevin Souris (IBA) and Prof. Mihai Bâce (KU Leuven)</p>

      <h3>AI Research Intern · Brubotics-imec</h3>
      <p class="meta">Brussels · June 2026 – present</p>
      <ul>
        <li>Built a physics-based drone-battery ageing simulation with PyBaMM and liionpack to generate synthetic data.</li>
        <li>Developed a PyTorch pipeline to estimate battery state of health on real drone data.</li>
        <li>A physics-informed neural network reduced RMSE by about 40% compared with a data-driven baseline.</li>
        <li>Now working on synthetic-to-real transfer learning.</li>
      </ul>

      <h3>Student Laborant · imec</h3>
      <p class="meta">Leuven · Mar 2025 – present</p>
      <ul>
        <li>Wafer probing and electrical device characterization in the cleanroom.</li>
        <li>Helped implement the wafer job selection feature of a new measurement UI.</li>
      </ul>

      <h3 class="section-break">Student teams</h3>
      <p><strong>Software Engineer · Hydroteam.</strong> Built cloud backend services on Google Cloud
      (Pub/Sub, Protobuf, Python) to collect data from the team's hydrogen car during testing and racing.</p>
      <p><strong>Energy Engineer · Aetherspace.</strong> Designed and simulated power systems for a REXUS rocket payload.</p>
      <p><strong>Corporate Relations · Google Developer Groups KU Leuven.</strong> Coordinated partnerships for the 2025–2026 hackathon.</p>
      <p><strong>Finalist · NTXL Neurotech Hackathon 2026.</strong> Built a real-time EEG pipeline (88% accuracy) with fatigue detection.</p>`,
  },
  projects: {
    drink: "Project Frappé",
    title: "Projects",
    body: `
      <p>Things I've built, from apps to hardware.</p>

      <h3>Song recommendation app</h3>
      <p class="meta">Java · Spotify</p>
      <p>Recommends new songs based on the tracks you've liked on Spotify.</p>

      <h3>Micronutrient tracker</h3>
      <p class="meta">Website</p>
      <p>Takes your personal info and your shopping list, as a photo or as text, logs your micronutrient
      intake, and warns you when you go over the recommended limits.</p>

      <h3>Game of the Goose · bachelor thesis</h3>
      <p class="meta">PIC · nRF · ESP32</p>
      <p>A physical Game of the Goose board where you play against the computer, with automatic dice detection.</p>

      <h3>MATLAB app from a thesis</h3>
      <p class="meta">MATLAB</p>
      <p>Turned my dad's thesis into a working MATLAB app.</p>`,
  },
  publications: {
    drink: "Published Espresso",
    title: "Publications",
    body: `
      <p>Research I've published and presented, from medical imaging to probability.</p>
      <h3><a href="https://doi.org/10.1109/AAIML67890.2026.11498079" target="_blank" rel="noopener">Treating the Image as a System: A Hybrid Signal-AI Approach to Mammogram Analysis</a></h3>
      <p class="meta">AAIML 2026 · Tokyo · IEEE Xplore</p>
      <p>A hybrid model fusing Radon, Gabor and FFT features with a fine-tuned ResNet50.</p>
      <h3><a href="https://doi.org/10.1049/icp.2022.2555" target="_blank" rel="noopener">A New Mathematical Probability Based Card Counting Strategy for Blackjack Using Python</a></h3>
      <p class="meta">FoNeS 2022 · Nicosia · IET Conference Proceedings</p>
      <p>Presented as the youngest participant, while still in high school.</p>`,
  },
  photos: {
    drink: "Darkroom Mocha",
    title: "Photography",
    body: "",
  },
  about: {
    drink: "About Me Chai",
    title: "Hi, I'm Azra",
    body: `
      <p class="meta">Cyprus → Leuven → ?</p>
      <p>I'm a master's student at KU Leuven focusing on AI engineering. I love AI and mathematics, and
      especially how they apply to healthcare and sustainable energy: computer vision, deep learning
      and image processing are my favorite corners.</p>
      <p>When I'm not coding, I'm usually taking photos, bouldering, watching films, reading, or going to concerts.</p>`,
  },
  connect: {
    drink: "Connect To Go",
    title: "Let's connect",
    body: `
      <p>Feel free to reach out and connect.</p>
      <p><a href="https://www.linkedin.com/in/azra-asiksoy-624733231" target="_blank" rel="noopener">LinkedIn</a></p>
      <p><a href="https://github.com/aasiksoy" target="_blank" rel="noopener">GitHub</a></p>`,
  },
  books: {
    title: "On my bookshelf",
    label: "The bookshelf",
    body: `
      <p>A few books I'd recommend:</p>
      <ul>
        <li><span class="placeholder">Book title, author: one line on why you love it</span></li>
        <li><span class="placeholder">Book title, author: one line</span></li>
        <li><span class="placeholder">Book title, author: one line</span></li>
      </ul>`,
  },
  music: {
    title: "On the turntable",
    label: "The record player",
    body: `
      <p>Music I keep coming back to, and the best concerts I've been to:</p>
      <ul>
        <li><span class="placeholder">Artist or album</span></li>
        <li><span class="placeholder">Artist or album</span></li>
        <li><span class="placeholder">A concert you'll never forget</span></li>
      </ul>`,
  },
};

const MENU_ORDER = ["experience", "projects", "publications", "photos", "about", "connect"];


/* =========================================================
   RENDERER, SCENE, CAMERA
   ========================================================= */

const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1d1410);
scene.fog = new THREE.Fog(0x1d1410, 13, 24);

const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 60);
const camTarget = new THREE.Vector3(0, 1.75, -1.2);
const camBase = new THREE.Vector3();

function fitCamera() {
  const aspect = window.innerWidth / window.innerHeight;
  camera.aspect = aspect;
  const halfFov = THREE.MathUtils.degToRad(camera.fov) / 2;
  const sceneWidth = 10.6;
  const sceneHeight = 5.0;
  const distForWidth = sceneWidth / 2 / (Math.tan(halfFov) * aspect);
  const distForHeight = sceneHeight / 2 / Math.tan(halfFov);
  const dist = Math.max(distForWidth, distForHeight);
  camBase.set(0, 2.4, camTarget.z + dist);
  camera.position.copy(camBase);
  camera.lookAt(camTarget);
  camera.updateProjectionMatrix();
}
fitCamera();

/* =========================================================
   HELPERS
   ========================================================= */

function mat(color, options = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0, ...options });
}

function mesh(geometry, material, x = 0, y = 0, z = 0, parent = scene) {
  const m = new THREE.Mesh(geometry, material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

function roundedBox(w, h, d, r = 0.04) {
  return new RoundedBoxGeometry(w, h, d, 3, r);
}

function canvasTexture(w, h, draw, repeat) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat[0], repeat[1]);
  }
  return tex;
}

function plankTexture(hue, light, repeat) {
  return canvasTexture(512, 512, (g, w, h) => {
    const rows = 8;
    for (let r = 0; r < rows; r++) {
      const y = (r * h) / rows;
      let x = -Math.random() * 180;
      while (x < w) {
        const len = 160 + Math.random() * 200;
        const l = light + (Math.random() * 8 - 4);
        g.fillStyle = `hsl(${hue}, 42%, ${l}%)`;
        g.fillRect(x, y, len, h / rows);
        g.strokeStyle = "rgba(30, 15, 5, 0.35)";
        g.lineWidth = 2;
        g.strokeRect(x, y, len, h / rows);
        for (let i = 0; i < 4; i++) {
          g.strokeStyle = `rgba(40, 20, 8, ${0.08 + Math.random() * 0.08})`;
          g.lineWidth = 1;
          g.beginPath();
          const gy = y + 6 + Math.random() * (h / rows - 12);
          g.moveTo(x + 4, gy);
          g.bezierCurveTo(x + len * 0.3, gy + 3, x + len * 0.6, gy - 3, x + len - 4, gy);
          g.stroke();
        }
        x += len;
      }
    }
  }, repeat);
}

/* =========================================================
   LIGHTS
   ========================================================= */

scene.add(new THREE.HemisphereLight(0xffe6c7, 0x2a1a10, 0.85));

const keyLight = new THREE.DirectionalLight(0xffd2a1, 1.5);
keyLight.position.set(-4, 7, 6);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
Object.assign(keyLight.shadow.camera, { left: -8, right: 8, top: 6, bottom: -3, near: 1, far: 25 });
keyLight.shadow.bias = -0.0005;
keyLight.shadow.normalBias = 0.02;
keyLight.target.position.set(0, 1, -1);
scene.add(keyLight, keyLight.target);

/* =========================================================
   BUILD THE CAFÉ
   ========================================================= */

const clickables = [];
let menuItems = [];
let machineLight;
let disc;
const fairyBulbs = [];

function registerClickable(object, key) {
  object.traverse((child) => {
    if (child.isMesh) {
      child.userData.key = key;
      clickables.push(child);
    }
  });
  object.userData.key = key;
}

function buildRoom() {
  // Floor
  const floorMat = mat(0xffffff, { map: plankTexture(25, 32, [3, 3]), roughness: 0.7 });
  const floor = mesh(new THREE.PlaneGeometry(16, 12), floorMat, 0, 0, 0);
  floor.rotation.x = -Math.PI / 2;
  floor.castShadow = false;

  // Walls
  const plaster = canvasTexture(256, 256, (g, w, h) => {
    g.fillStyle = "#d8b38c";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1400; i++) {
      g.fillStyle = `rgba(${Math.random() < 0.5 ? "255,240,220" : "120,80,50"}, ${Math.random() * 0.06})`;
      g.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }
  }, [4, 2]);
  const wallMat = mat(0xffffff, { map: plaster, roughness: 0.95 });
  const back = mesh(new THREE.PlaneGeometry(16, 6), wallMat, 0, 3, -4);
  back.castShadow = false;
  const left = mesh(new THREE.PlaneGeometry(12, 6), wallMat, -7, 3, 1);
  left.rotation.y = Math.PI / 2;
  left.castShadow = false;
  const right = mesh(new THREE.PlaneGeometry(12, 6), wallMat, 7, 3, 1);
  right.rotation.y = -Math.PI / 2;
  right.castShadow = false;

  // Wood wainscot strip along the back wall
  mesh(roundedBox(16, 0.12, 0.08, 0.02), mat(0x5a3420), 0, 1.2, -3.95);

  // Window with a night sky
  const frameMat = mat(0x4a2c1a);
  const win = new THREE.Group();
  win.position.set(-4.7, 2.3, -3.96);
  scene.add(win);
  mesh(roundedBox(1.7, 1.7, 0.08, 0.03), frameMat, 0, 0, 0, win);
  const glass = mesh(
    new THREE.PlaneGeometry(1.45, 1.45),
    new THREE.MeshStandardMaterial({ color: 0x1b2a48, emissive: 0x2e4a7a, emissiveIntensity: 0.8 }),
    0, 0, 0.05, win
  );
  glass.castShadow = false;
  mesh(new THREE.BoxGeometry(0.06, 1.45, 0.04), frameMat, 0, 0, 0.07, win);
  mesh(new THREE.BoxGeometry(1.45, 0.06, 0.04), frameMat, 0, 0, 0.07, win);
  const moon = mesh(new THREE.CircleGeometry(0.12, 24), new THREE.MeshBasicMaterial({ color: 0xfff4d6 }), 0.38, 0.4, 0.055, win);
  moon.castShadow = false;
  mesh(roundedBox(1.9, 0.08, 0.25, 0.02), frameMat, 0, -0.9, 0.1, win);
}

function buildCounter() {
  const frontTex = plankTexture(22, 24, [1, 3]);
  frontTex.rotation = Math.PI / 2;
  mesh(roundedBox(6.2, 1.05, 0.9, 0.05), mat(0xffffff, { map: frontTex }), 0, 0.525, 0.4);
  mesh(roundedBox(6.5, 0.07, 1.05, 0.03), mat(0xb07a4e, { roughness: 0.5 }), 0, 1.085, 0.4);

  // Back bench
  mesh(roundedBox(7, 0.95, 0.6, 0.04), mat(0x6a3f26), 0, 0.475, -3.65);
  mesh(roundedBox(7.2, 0.06, 0.7, 0.02), mat(0xb98a5e, { roughness: 0.5 }), 0, 0.98, -3.62);

  // Stools
  for (const x of [-1.8, 0, 1.8]) {
    const stool = new THREE.Group();
    stool.position.set(x, 0, 1.45);
    scene.add(stool);
    mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.08, 24), mat(0x8a5534), 0, 0.76, 0, stool);
    mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.72, 12), mat(0x2b2b2b, { metalness: 0.7, roughness: 0.4 }), 0, 0.36, 0, stool);
    const ring = mesh(new THREE.TorusGeometry(0.17, 0.015, 8, 24), mat(0x2b2b2b, { metalness: 0.7, roughness: 0.4 }), 0, 0.28, 0, stool);
    ring.rotation.x = Math.PI / 2;
    mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.03, 24), mat(0x2b2b2b, { metalness: 0.7, roughness: 0.4 }), 0, 0.015, 0, stool);
  }
}

function buildMachine() {
  const m = new THREE.Group();
  m.position.set(2.1, 1.01, -3.62);
  scene.add(m);
  const steel = mat(0xc9cdd2, { metalness: 0.65, roughness: 0.3 });
  const dark = mat(0x2a2522, { metalness: 0.4, roughness: 0.5 });
  mesh(roundedBox(0.95, 0.62, 0.55, 0.06), steel, 0, 0.33, 0, m);
  mesh(roundedBox(0.95, 0.08, 0.55, 0.03), mat(0xc8702f), 0, 0.66, 0, m);
  mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.1, 20), dark, 0, 0.27, 0.3, m);
  mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.06, 12), dark, 0, 0.19, 0.3, m);
  mesh(roundedBox(0.5, 0.03, 0.18, 0.01), dark, 0, 0.02, 0.29, m);
  machineLight = mesh(new THREE.SphereGeometry(0.025, 12, 12), mat(0x113322, { emissive: 0x225533, emissiveIntensity: 1 }), 0.33, 0.5, 0.28, m);
  // cups stacked on top
  for (let i = 0; i < 3; i++) {
    mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.08, 16), mat(0xf4efe8), -0.25 + i * 0.13, 0.74, 0, m);
  }
  // grinder
  const gr = new THREE.Group();
  gr.position.set(3.0, 1.01, -3.62);
  scene.add(gr);
  mesh(roundedBox(0.3, 0.4, 0.3, 0.04), dark, 0, 0.2, 0, gr);
  mesh(new THREE.CylinderGeometry(0.1, 0.06, 0.22, 16), mat(0x6b4a33, { transparent: true, opacity: 0.85 }), 0, 0.51, 0, gr);
}

function buildPastries() {
  const d = new THREE.Group();
  d.position.set(-1.25, 1.12, 0.4);
  scene.add(d);
  mesh(roundedBox(1.0, 0.05, 0.55, 0.02), mat(0xe8dccb), 0, 0.025, 0, d);
  const glassBox = mesh(
    roundedBox(1.0, 0.42, 0.55, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.18, roughness: 0.1 }),
    0, 0.26, 0, d
  );
  glassBox.castShadow = false;
  const colors = [0xd9944f, 0x8a4f2a, 0xe7b97a, 0xc26a7a];
  for (let i = 0; i < 4; i++) {
    const donut = mesh(new THREE.TorusGeometry(0.075, 0.04, 12, 24), mat(colors[i], { roughness: 0.6 }), -0.33 + i * 0.22, 0.1, 0.05, d);
    donut.rotation.x = Math.PI / 2;
  }
}

function buildPlants() {
  const leafMat = mat(0x4f7a46, { roughness: 0.7 });
  const leafMat2 = mat(0x3f6a3a, { roughness: 0.7 });

  // small plant on the counter
  const p = new THREE.Group();
  p.position.set(2.75, 1.12, 0.45);
  scene.add(p);
  mesh(new THREE.CylinderGeometry(0.13, 0.1, 0.22, 16), mat(0xb8653f), 0, 0.11, 0, p);
  for (let i = 0; i < 7; i++) {
    const leaf = mesh(new THREE.SphereGeometry(0.1, 10, 8), i % 2 ? leafMat : leafMat2, 0, 0.3, 0, p);
    const a = (i / 7) * Math.PI * 2;
    leaf.position.set(Math.cos(a) * 0.1, 0.3 + Math.random() * 0.12, Math.sin(a) * 0.1);
    leaf.scale.set(0.7, 1.4, 0.35);
    leaf.rotation.set(Math.sin(a) * 0.5, a, Math.cos(a) * 0.5);
  }

  // big plant in the corner
  const big = new THREE.Group();
  big.position.set(-5.9, 0, -2.9);
  scene.add(big);
  mesh(new THREE.CylinderGeometry(0.35, 0.28, 0.6, 20), mat(0x9c5a3a), 0, 0.3, 0, big);
  for (let i = 0; i < 14; i++) {
    const leaf = mesh(new THREE.SphereGeometry(0.22, 10, 8), i % 2 ? leafMat : leafMat2, 0, 0, 0, big);
    const a = (i / 14) * Math.PI * 2;
    const r = 0.15 + Math.random() * 0.15;
    leaf.position.set(Math.cos(a) * r, 0.9 + Math.random() * 0.9, Math.sin(a) * r);
    leaf.scale.set(0.6, 1.6, 0.3);
    leaf.rotation.set(Math.sin(a) * 0.6, a, Math.cos(a) * 0.6);
  }
}

function buildLights() {
  for (const x of [-2, 0, 2]) {
    const g = new THREE.Group();
    g.position.set(x, 0, 0.3);
    scene.add(g);
    const cord = mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.4, 6), mat(0x1a1a1a), 0, 3.95, 0, g);
    cord.castShadow = false;
    const shade = mesh(
      new THREE.ConeGeometry(0.3, 0.28, 24, 1, true),
      mat(0x2f2a26, { metalness: 0.5, roughness: 0.4, side: THREE.DoubleSide }),
      0, 3.15, 0, g
    );
    shade.castShadow = false;
    const bulb = mesh(new THREE.SphereGeometry(0.07, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffd08a }), 0, 3.02, 0, g);
    bulb.castShadow = false;
    const light = new THREE.PointLight(0xffa65c, 7, 7, 2);
    light.position.set(0, 2.95, 0);
    g.add(light);
  }

  // fairy lights along the back wall
  const count = 34;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const x = -6.5 + t * 13;
    const y = 3.75 - Math.sin(t * Math.PI * 3) ** 2 * 0.25;
    const m = new THREE.MeshStandardMaterial({ color: 0xffd9a0, emissive: 0xffb860, emissiveIntensity: 1.2 });
    const b = mesh(new THREE.SphereGeometry(0.035, 10, 10), m, x, y, -3.9);
    b.castShadow = false;
    fairyBulbs.push(m);
  }
}

function buildBookshelf() {
  const shelf = new THREE.Group();
  shelf.position.set(4.75, 0, -3.82);
  scene.add(shelf);
  const wood = mat(0x6a3f26);
  const colors = [0x8c3b2e, 0x2f5d62, 0xd9a441, 0x5b4a7a, 0x3f6b3f, 0xc96f4a, 0xe8d8b5, 0x324a6d];
  for (const y of [1.45, 2.2, 2.95]) {
    mesh(roundedBox(2.0, 0.06, 0.32, 0.015), wood, 0, y, 0, shelf);
    let x = -0.92;
    while (x < 0.85) {
      const w = 0.07 + Math.random() * 0.06;
      const h = 0.3 + Math.random() * 0.14;
      if (Math.random() < 0.08) { x += 0.12; continue; }
      const book = mesh(roundedBox(w, h, 0.24, 0.01), mat(colors[Math.floor(Math.random() * colors.length)]), x + w / 2, y + 0.03 + h / 2, 0.02, shelf);
      if (Math.random() < 0.12) book.rotation.z = 0.12;
      x += w + 0.01;
    }
  }
  // registerClickable(shelf, "books");  // turn back on once the books content is ready
}

function buildRecordPlayer() {
  const rp = new THREE.Group();
  rp.position.set(-2.6, 1.12, 0.45);
  scene.add(rp);
  mesh(roundedBox(0.62, 0.12, 0.5, 0.03), mat(0x8a5534, { roughness: 0.5 }), 0, 0.06, 0, rp);
  disc = mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.015, 32), mat(0x161616, { roughness: 0.3 }), -0.05, 0.13, 0, rp);
  mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.017, 24), mat(0xc8702f), 0, 0.001, 0, disc);
  const arm = mesh(new THREE.BoxGeometry(0.02, 0.02, 0.3), mat(0xd0d0d0, { metalness: 0.7, roughness: 0.3 }), 0.2, 0.16, 0.02, rp);
  arm.rotation.y = 0.35;
  // a few records leaning next to it
  for (let i = 0; i < 3; i++) {
    const sleeve = mesh(new THREE.BoxGeometry(0.02, 0.32, 0.32), mat([0x2f5d62, 0xd9a441, 0x8c3b2e][i]), -0.4 - i * 0.03, 0.16, 0, rp);
    sleeve.rotation.z = 0.15;
  }
  // registerClickable(rp, "music");  // turn back on once the music content is ready
}

function buildMenuBoard() {
  const board = new THREE.Group();
  board.position.set(-1.0, 2.35, -3.94);
  scene.add(board);

  mesh(roundedBox(3.6, 2.6, 0.08, 0.04), mat(0x4a2c1a), 0, 0, 0, board);

  const boardTex = canvasTexture(1024, 740, (g, w, h) => {
    g.fillStyle = "#24302a";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 40; i++) {
      g.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.025})`;
      g.beginPath();
      g.ellipse(Math.random() * w, Math.random() * h, 40 + Math.random() * 120, 20 + Math.random() * 60, Math.random() * 3, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = "#f4efe6";
    g.textAlign = "center";
    g.font = "600 92px Fredoka";
    g.fillText("MENU", w / 2, 112);
    g.font = "600 30px Nunito";
    g.fillStyle = "#cfd8cc";
    g.fillText("click a drink to order", w / 2, 160);
  });
  const face = mesh(new THREE.PlaneGeometry(3.4, 2.4), new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.95 }), 0, 0, 0.045, board);
  face.castShadow = false;

  MENU_ORDER.forEach((key, i) => {
    const col = i < 3 ? 0 : 1;
    const row = i < 3 ? i : i - 3;
    const tex = canvasTexture(512, 128, (g, w, h) => {
      g.textAlign = "center";
      g.fillStyle = "#f4efe6";
      g.font = "600 48px Fredoka";
      g.fillText(SECTIONS[key].drink, w / 2, 66);
      g.fillStyle = "#b9c7b6";
      g.font = "600 26px Nunito";
      g.fillText(SECTIONS[key].title.toUpperCase(), w / 2, 108);
    });
    const material = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
    const item = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.375), material);
    const x = col === 0 ? -0.82 : 0.82;
    const y = 0.3 - row * 0.48;
    item.position.set(x, y, 0.06);
    item.userData.key = key;
    item.userData.isMenu = true;
    board.add(item);
    clickables.push(item);
    menuItems.push(item);
  });
}

/* =========================================================
   THE BARISTA
   ========================================================= */

function makeBarista() {
  const g = new THREE.Group();
  const skin = mat(0xe3b48d);
  const shirt = mat(0xf2e8d8);
  const apron = mat(0x3f5a45);
  const pants = mat(0x3a3330);
  const hair = mat(0x2d1d14);

  const legs = [];
  for (const side of [-0.1, 0.1]) {
    const pivot = new THREE.Group();
    pivot.position.set(side, 0.85, 0);
    g.add(pivot);
    mesh(new THREE.CapsuleGeometry(0.085, 0.6, 6, 12), pants, 0, -0.42, 0, pivot);
    legs.push(pivot);
  }

  mesh(new THREE.CapsuleGeometry(0.25, 0.4, 8, 16), shirt, 0, 1.13, 0, g);
  mesh(roundedBox(0.42, 0.62, 0.05, 0.02), apron, 0, 0.98, 0.23, g);
  mesh(new THREE.BoxGeometry(0.04, 0.3, 0.04), apron, -0.13, 1.38, 0.2, g);
  mesh(new THREE.BoxGeometry(0.04, 0.3, 0.04), apron, 0.13, 1.38, 0.2, g);

  const arms = [];
  for (const side of [-0.32, 0.32]) {
    const pivot = new THREE.Group();
    pivot.position.set(side, 1.45, 0);
    g.add(pivot);
    mesh(new THREE.CapsuleGeometry(0.07, 0.4, 6, 12), shirt, 0, -0.27, 0, pivot);
    mesh(new THREE.SphereGeometry(0.075, 12, 12), skin, 0, -0.55, 0, pivot);
    arms.push(pivot);
  }

  const head = new THREE.Group();
  head.position.set(0, 1.76, 0);
  g.add(head);
  mesh(new THREE.SphereGeometry(0.2, 24, 20), skin, 0, 0, 0, head);
  const cap = mesh(new THREE.SphereGeometry(0.215, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), hair, 0, 0.01, -0.01, head);
  cap.rotation.x = -0.25;
  mesh(new THREE.SphereGeometry(0.09, 16, 12), hair, 0, 0.17, -0.13, head);
  mesh(new THREE.SphereGeometry(0.025, 10, 10), skin, 0, -0.02, 0.2, head);

  const eyes = [];
  for (const side of [-0.07, 0.07]) {
    const eye = mesh(new THREE.SphereGeometry(0.024, 10, 10), mat(0x1a120d), side, 0.02, 0.18, head);
    eyes.push(eye);
    const cheek = mesh(new THREE.SphereGeometry(0.03, 10, 10), mat(0xe58f7f), side * 1.6, -0.05, 0.16, head);
    cheek.scale.set(1, 0.6, 0.4);
  }
  const smile = mesh(new THREE.TorusGeometry(0.045, 0.008, 8, 16, Math.PI), mat(0x5a2a1a), 0, -0.07, 0.185, head);
  smile.rotation.z = Math.PI;

  g.position.set(1.1, 0, -1.6);
  scene.add(g);
  return { group: g, legs, arms, eyes, walking: false, carrying: false, phase: 0 };
}

function makeCup() {
  const g = new THREE.Group();
  mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.02, 28), mat(0xf4efe8, { roughness: 0.4 }), 0, 0.01, 0, g);
  mesh(new THREE.CylinderGeometry(0.11, 0.085, 0.15, 28), mat(0xffffff, { roughness: 0.35 }), 0, 0.095, 0, g);
  mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.01, 28), mat(0x8a5432, { roughness: 0.4 }), 0, 0.165, 0, g);
  mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.012, 20), mat(0xf3e3c8, { roughness: 0.5 }), 0, 0.167, 0, g);
  mesh(new THREE.TorusGeometry(0.045, 0.014, 10, 20), mat(0xffffff, { roughness: 0.35 }), 0.125, 0.1, 0, g);
  g.visible = false;
  scene.add(g);
  return g;
}

/* Steam */
const steam = [];
const steamEmitter = new THREE.Vector3();
let steamOn = false;
function makeSteam() {
  for (let i = 0; i < 12; i++) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false })
    );
    m.userData.life = Math.random();
    scene.add(m);
    steam.push(m);
  }
}

/* =========================================================
   INTERACTION
   ========================================================= */

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const mouse = { x: 0, y: 0 };
const tooltip = document.getElementById("tooltip");
const hint = document.getElementById("hint");
let hovered = null;
let busy = false;
let modalOpen = false;
let timeline = null;
let barista;
let cup;

function pick(clientX, clientY) {
  pointer.x = (clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(clickables, false);
  return hits.length ? hits[0].object.userData.key : null;
}

function labelFor(key) {
  const s = SECTIONS[key];
  return s.drink ? `Order: ${s.drink}` : s.label;
}

function setHover(key) {
  if (hovered === key) return;
  hovered = key;
  menuItems.forEach((item) => {
    const on = item.userData.key === key;
    item.material.color.set(on ? 0xffd59a : 0xffffff);
    gsap.to(item.scale, { x: on ? 1.06 : 1, y: on ? 1.06 : 1, duration: 0.2 });
  });
  canvas.style.cursor = key ? "pointer" : "default";
  if (key) {
    tooltip.textContent = labelFor(key);
    tooltip.classList.add("visible");
  } else {
    tooltip.classList.remove("visible");
  }
}

window.addEventListener("pointermove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  if (modalOpen || e.pointerType === "touch") return;
  setHover(busy ? null : pick(e.clientX, e.clientY));
  tooltip.style.left = e.clientX + "px";
  tooltip.style.top = e.clientY + "px";
});

canvas.addEventListener("click", (e) => {
  if (modalOpen) return;
  if (busy) {
    if (timeline) timeline.timeScale(6);
    return;
  }
  const key = pick(e.clientX, e.clientY);
  if (key) order(key);
});

function hideHint() {
  hint.classList.add("hidden");
}

/* Pick the rotation closest to the current one, so the barista never spins the long way round */
function nearestAngle(target, from) {
  let a = target;
  while (a - from > Math.PI) a -= Math.PI * 2;
  while (a - from < -Math.PI) a += Math.PI * 2;
  return a;
}

function addWalk(tl, from, to, finalAngle, startRot) {
  const g = barista.group;
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  const heading = nearestAngle(Math.atan2(dx, dz), startRot);
  const end = nearestAngle(finalAngle, heading);
  tl.to(g.rotation, { y: heading, duration: 0.22, ease: "power1.out" });
  tl.call(() => { barista.walking = true; });
  tl.to(g.position, { x: to.x, z: to.z, duration: Math.max(0.35, Math.hypot(dx, dz) / 2.6), ease: "none" });
  tl.call(() => { barista.walking = false; });
  tl.to(g.rotation, { y: end, duration: 0.22, ease: "power1.out" });
  return end;
}

function order(key) {
  if (busy || modalOpen) return;
  hideHint();
  const section = SECTIONS[key];
  if (!section.drink || reduceMotion) {
    openModal(key);
    return;
  }

  busy = true;
  setHover(null);
  scene.attach(cup);
  cup.visible = false;
  steamOn = false;

  const g = barista.group;
  const machineSpot = new THREE.Vector3(2.1, 0, -2.55);
  const serveSpot = new THREE.Vector3(1.1, 0, -0.5);

  timeline = gsap.timeline({
    onComplete: () => {
      busy = false;
      timeline = null;
      openModal(key);
    },
  });

  let rot = addWalk(timeline, g.position.clone(), machineSpot, Math.PI, g.rotation.y);

  timeline.call(() => {
    cup.visible = true;
    cup.position.set(2.1, 1.03, -3.33);
    cup.rotation.set(0, 0, 0);
    cup.scale.setScalar(0.01);
    steamEmitter.set(2.1, 1.25, -3.33);
    steamOn = true;
    machineLight.material.emissive.set(0x5cff8a);
  });
  timeline.to(cup.scale, { x: 1, y: 1, z: 1, duration: 0.35, ease: "back.out(2)" });
  timeline.to({}, { duration: 0.6 });
  timeline.call(() => {
    steamOn = false;
    machineLight.material.emissive.set(0x225533);
    barista.carrying = true;
  });
  timeline.to(cup.position, { x: 2.1, y: 1.12, z: -2.87, duration: 0.3, ease: "power2.out" });
  timeline.call(() => g.attach(cup));

  rot = addWalk(timeline, machineSpot, serveSpot, 0, rot);

  timeline.call(() => scene.attach(cup));
  timeline.to(cup.position, { x: 1.1, y: 1.12, z: 0.2, duration: 0.3, ease: "power2.inOut" });
  timeline.call(() => { barista.carrying = false; });
  timeline.to(cup.position, { z: 0.62, duration: 0.45, ease: "power3.out" });
  timeline.call(() => {
    steamEmitter.set(1.1, 1.32, 0.62);
    steamOn = true;
  });
  timeline.to({}, { duration: 0.25 });
}

/* =========================================================
   POPUP
   ========================================================= */

const modal = document.getElementById("modal");
const modalDrink = document.getElementById("modalDrink");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const closeBtn = document.getElementById("closeModal");
let lastFocus = null;

function photoCarousel() {
  return `
    <p>A few of my favorite shots.</p>
    <div class="carousel">
      <div class="carousel-frame">
        <img id="carouselImg" alt="">
        <div class="carousel-caption" id="carouselCaption"></div>
      </div>
      <div class="carousel-controls">
        <button id="prevPhoto" aria-label="Previous photo">‹</button>
        <span class="carousel-count" id="carouselCount"></span>
        <button id="nextPhoto" aria-label="Next photo">›</button>
      </div>
    </div>`;
}

function setupCarousel() {
  let index = 0;
  const img = document.getElementById("carouselImg");
  const caption = document.getElementById("carouselCaption");
  const count = document.getElementById("carouselCount");
  function show(i) {
    index = (i + PHOTOS.length) % PHOTOS.length;
    img.src = PHOTOS[index].src;
    img.alt = PHOTOS[index].alt;
    caption.textContent = PHOTOS[index].caption;
    count.textContent = `${index + 1} / ${PHOTOS.length}`;
  }
  img.addEventListener("error", () => {
    caption.textContent = "Add your photos to images/photos/";
  });
  document.getElementById("prevPhoto").addEventListener("click", () => show(index - 1));
  document.getElementById("nextPhoto").addEventListener("click", () => show(index + 1));
  show(0);
}

function openModal(key) {
  const s = SECTIONS[key];
  modalDrink.textContent = `1 × ${s.drink || s.label}`;
  const now = new Date();
  document.getElementById("orderNo").textContent = `Order #${String(Math.floor(Math.random() * 900) + 100)}`;
  document.getElementById("orderTime").textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  modalTitle.textContent = s.title;
  modalBody.innerHTML = key === "photos" ? photoCarousel() : s.body;
  if (key === "photos") setupCarousel();


  lastFocus = document.activeElement;
  modal.hidden = false;
  modalOpen = true;
  setHover(null);
  requestAnimationFrame(() => modal.classList.add("open"));
  closeBtn.focus();
}

function closeModal() {
  if (!modalOpen) return;
  modal.classList.remove("open");
  modalOpen = false;
  setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 300);
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* Keyboard and mobile menu */
const orderList = document.getElementById("orderList");
MENU_ORDER.forEach((key) => {
  const btn = document.createElement("button");
  btn.textContent = SECTIONS[key].drink || SECTIONS[key].label;
  btn.addEventListener("click", () => order(key));
  orderList.appendChild(btn);
});

/* =========================================================
   ANIMATION LOOP
   ========================================================= */

const clock = new THREE.Clock();

function updateBarista(dt, t) {
  const b = barista;
  if (b.walking) {
    b.phase += dt * 11;
    const s = Math.sin(b.phase);
    b.legs[0].rotation.x = s * 0.55;
    b.legs[1].rotation.x = -s * 0.55;
    if (!b.carrying) {
      b.arms[0].rotation.x = -s * 0.45;
      b.arms[1].rotation.x = s * 0.45;
    }
    b.group.position.y = Math.abs(Math.cos(b.phase)) * 0.03;
  } else {
    b.legs.forEach((l) => { l.rotation.x *= 0.8; });
    if (!b.carrying) {
      b.arms[0].rotation.x += (Math.sin(t * 1.6) * 0.06 - b.arms[0].rotation.x) * 0.15;
      b.arms[1].rotation.x += (-Math.sin(t * 1.6) * 0.06 - b.arms[1].rotation.x) * 0.15;
    }
    b.group.position.y = Math.sin(t * 2) * 0.006;
  }
  if (b.carrying) {
    b.arms.forEach((a) => { a.rotation.x += (-1.1 - a.rotation.x) * 0.25; });
  }
  const blink = t % 3.7 < 0.12 ? 0.1 : 1;
  b.eyes.forEach((e) => { e.scale.y = blink; });
}

function updateSteam(dt) {
  steam.forEach((p, i) => {
    p.userData.life += dt * 0.6;
    if (p.userData.life > 1) {
      p.userData.life = 0;
      p.position.set(
        steamEmitter.x + (Math.random() - 0.5) * 0.06,
        steamEmitter.y,
        steamEmitter.z + (Math.random() - 0.5) * 0.06
      );
    }
    const life = p.userData.life;
    p.position.y += dt * 0.35;
    p.position.x += Math.sin(life * 6 + i) * dt * 0.05;
    p.scale.setScalar(0.6 + life * 1.6);
    const target = steamOn ? Math.sin(life * Math.PI) * 0.35 : 0;
    p.material.opacity += (target - p.material.opacity) * 0.2;
  });
}

function tick() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  updateBarista(dt, t);
  updateSteam(dt);
  if (disc) disc.rotation.y += dt * 1.4;
  fairyBulbs.forEach((m, i) => { m.emissiveIntensity = 1.1 + Math.sin(t * 2 + i * 1.7) * 0.35; });

  const px = reduceMotion ? 0 : mouse.x * 0.35;
  const py = reduceMotion ? 0 : mouse.y * 0.15;
  camera.position.x += (camBase.x + px - camera.position.x) * 0.05;
  camera.position.y += (camBase.y + py - camera.position.y) * 0.05;
  camera.position.z = camBase.z;
  camera.lookAt(camTarget);

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  fitCamera();
});

/* =========================================================
   START
   ========================================================= */

async function init() {
  try {
    await Promise.race([
      Promise.all([document.fonts.load("600 48px Fredoka"), document.fonts.load("600 26px Nunito")]),
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]);
  } catch (err) {
    /* fonts are optional; continue with fallbacks */
  }

  buildRoom();
  buildCounter();
  buildMachine();
  buildPastries();
  buildPlants();
  buildLights();
  buildBookshelf();
  buildRecordPlayer();
  buildMenuBoard();
  barista = makeBarista();
  cup = makeCup();
  makeSteam();

  renderer.setAnimationLoop(tick);
  setTimeout(() => document.getElementById("loader").classList.add("done"), 300);
}

init();

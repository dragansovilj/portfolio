// --------------------------------------------- //
// Hero Glass Logo — WebGL 3D prismatic logo scene
// --------------------------------------------- //
// Loads img/logo/xxlogo.svg, extrudes it into a beveled 3D object,
// renders it as dark optical glass (transmission/dispersion/Fresnel rim)
// floating in a black scene with light beams, a caustic-style rainbow
// patch behind it, bloom and particles.
//
// Tunable parameters live in the CONFIG object below.

import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const CONFIG = {
  // "logo" = exact SVG geometry, "triangle" = temporary test prism used
  // earlier to compare how much shape affects the glass/dispersion look
  testShape: "logo",
  svgPath: "img/logo/xxlogo.svg",
  logoSize: 3.2, // world-unit height the logo is scaled to
  extrudeDepth: 40, // extrude depth in SVG units (pre-normalize)
  bevelThickness: 10,
  bevelSize: 7,
  bevelSegments: 6,
  glass: {
    color: 0x14141a, // dark but not pure-black, so transmission can show through
    transmission: 1,
    thickness: 0.7, // thinner = clearer/brighter transmission, less internal absorption
    roughness: 0.05,
    ior: 1.6,
    // real per-channel chromatic dispersion, built into MeshPhysicalMaterial's
    // transmission pass (same idea as vgpu's spectral_weight() in glass.wgsl) —
    // replaces the earlier full-screen chromatic-aberration hack
    dispersion: 1,
    iridescence: 0.6,
    iridescenceIOR: 1.3,
    iridescenceRange: [100, 400],
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    envMapIntensity: 1.6,
  },
  // additive rim-light shell that traces the logo silhouette — this is
  // what actually reads as "light bending along the edges", independent
  // of environment reflections
  rim: { color: 0x9fd8ff, power: 2.4, intensity: 0.9 },
  // soft rainbow patch behind the logo, standing in for the reference's
  // prism-cast-caustic-on-a-wall look without a full light-transport sim
  caustic: { size: 4, opacity: 0.22, speed: 0.08 },
  bloom: { strength: 0.45, radius: 0.4, threshold: 0.55 },
  rotationSpeed: 0.06, // rad/sec
  floatAmplitude: 0.12,
  floatSpeed: 0.5,
  parallaxStrength: 0.35,
  particleCount: 220,
};

function mxdHeroGlassLogo(containerSelector = "[data-hero-glass-logo]") {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  if (!window.WebGLRenderingContext) return; // no WebGL, leave fallback poster visible

  const canvas = document.createElement("canvas");
  canvas.className = "mxd-hero-glass-logo__canvas";
  container.appendChild(canvas);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) {
    canvas.remove();
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = null; // page background stays black behind the canvas

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  // ---- Environment (for glass Fresnel/reflections) ----
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  // ---- Lights ----
  scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  const keyLight = new THREE.PointLight(0xffffff, 1.8, 20, 2);
  keyLight.position.set(3, 3, 6);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(0x6ea8ff, 1.2, 20, 2);
  rimLight.position.set(-4, -2, 4);
  scene.add(rimLight);

  // ---- Logo group (populated once shapes are ready) ----
  const logoGroup = new THREE.Group();
  scene.add(logoGroup);
  let rimMaterialRef = null;

  function triangleShape(size) {
    const h = (size * Math.sqrt(3)) / 2;
    const shape = new THREE.Shape();
    shape.moveTo(0, (h * 2) / 3);
    shape.lineTo(-size / 2, -h / 3);
    shape.lineTo(size / 2, -h / 3);
    shape.lineTo(0, (h * 2) / 3);
    return shape;
  }

  function buildFromShapes(shapes) {
    const geometries = shapes.map(
      (shape) =>
        new THREE.ExtrudeGeometry(shape, {
          depth: CONFIG.extrudeDepth,
          bevelEnabled: true,
          bevelThickness: CONFIG.bevelThickness,
          bevelSize: CONFIG.bevelSize,
          bevelSegments: CONFIG.bevelSegments,
          curveSegments: 24,
        })
    );

    const material = new THREE.MeshPhysicalMaterial({
      color: CONFIG.glass.color,
      metalness: 0,
      roughness: CONFIG.glass.roughness,
      transmission: CONFIG.glass.transmission,
      thickness: CONFIG.glass.thickness,
      ior: CONFIG.glass.ior,
      dispersion: CONFIG.glass.dispersion,
      iridescence: CONFIG.glass.iridescence,
      iridescenceIOR: CONFIG.glass.iridescenceIOR,
      iridescenceThicknessRange: CONFIG.glass.iridescenceRange,
      clearcoat: CONFIG.glass.clearcoat,
      clearcoatRoughness: CONFIG.glass.clearcoatRoughness,
      envMapIntensity: CONFIG.glass.envMapIntensity,
    });

    // additive fresnel shell — traces the silhouette with a bright,
    // prismatic (rainbow-shifting) rim regardless of environment map
    // quality, giving a reliable "light bending/dispersing along the
    // edges" look instead of relying on subtle physical transmission
    const rimMaterial = new THREE.ShaderMaterial({
      uniforms: {
        power: { value: CONFIG.rim.power },
        intensity: { value: CONFIG.rim.intensity },
        time: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        uniform float power;
        uniform float intensity;
        uniform float time;
        vec3 hue(float h) {
          vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return rgb;
        }
        void main() {
          vec3 N = normalize(vNormal);
          vec3 V = normalize(vViewDir);
          float facing = clamp(dot(N, V), 0.0, 1.0);
          float fresnel = pow(1.0 - facing, power);
          // hue keyed off the edge normal direction + facing angle so
          // different parts of the silhouette split into different
          // colors, like a prism separating wavelengths
          float h = atan(N.y, N.x) / 6.28318 + facing * 0.6 + time * 0.03;
          vec3 rainbow = hue(fract(h));
          gl_FragColor = vec4(rainbow * fresnel * intensity, fresnel * intensity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.FrontSide,
    });
    rimMaterialRef = rimMaterial;

    const meshGroup = new THREE.Group();
    geometries.forEach((geometry) => {
      geometry.computeVertexNormals();
      meshGroup.add(new THREE.Mesh(geometry, material));
      meshGroup.add(new THREE.Mesh(geometry, rimMaterial));
    });

    // SVG space is Y-down; flip to match Three's Y-up before centering
    meshGroup.scale.y = -1;

    const box = new THREE.Box3().setFromObject(meshGroup);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    meshGroup.position.sub(center);

    const scale = CONFIG.logoSize / Math.max(size.x, size.y);
    logoGroup.scale.setScalar(scale);
    logoGroup.add(meshGroup);
  }

  if (CONFIG.testShape === "triangle") {
    buildFromShapes([triangleShape(500)]);
  } else {
    new SVGLoader().load(CONFIG.svgPath, (data) => {
      const shapes = [];
      data.paths.forEach((path) => {
        path.toShapes(true).forEach((shape) => shapes.push(shape));
      });
      buildFromShapes(shapes);
    });
  }

  // ---- Light beams (additive gradient planes) ----
  function gradientTexture(stops, w = 256, h = 256) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    stops.forEach(([offset, color]) => grad.addColorStop(offset, color));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function makeBeam({ width, height, stops, position, rotationZ, opacity }) {
    const tex = gradientTexture(stops);
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
    mesh.position.set(...position);
    mesh.rotation.z = rotationZ;
    scene.add(mesh);
    return mesh;
  }

  const beams = [
    makeBeam({
      width: 16,
      height: 0.7,
      stops: [
        [0, "rgba(255,255,255,0)"],
        [0.5, "rgba(255,255,255,0.55)"],
        [1, "rgba(255,255,255,0)"],
      ],
      position: [0, 0.1, -3],
      rotationZ: 0,
      opacity: 0.18,
    }),
    makeBeam({
      width: 14,
      height: 0.9,
      stops: [
        [0, "rgba(255,0,120,0)"],
        [0.2, "rgba(255,80,80,0.6)"],
        [0.4, "rgba(255,210,80,0.6)"],
        [0.6, "rgba(90,255,140,0.6)"],
        [0.8, "rgba(80,150,255,0.6)"],
        [1, "rgba(180,90,255,0)"],
      ],
      position: [0, -0.6, -3.5],
      rotationZ: 0.03,
      opacity: 0.1,
    }),
    makeBeam({
      width: 18,
      height: 1.1,
      stops: [
        [0, "rgba(90,60,255,0)"],
        [0.5, "rgba(120,90,255,0.5)"],
        [1, "rgba(60,180,255,0)"],
      ],
      position: [0, 0, -4],
      rotationZ: 0.5,
      opacity: 0.08,
    }),
  ];

  // ---- Caustic patch ----
  // Stand-in for the reference's "prism casts a rainbow on the wall behind
  // it" look: a soft, slowly drifting rainbow blob projected on a plane
  // behind the logo, rather than a real light-transport simulation.
  const causticMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      opacity: { value: CONFIG.caustic.opacity },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float time;
      uniform float opacity;
      vec3 hue(float h) {
        vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return rgb;
      }
      void main() {
        vec2 p = vUv - 0.5;
        float dist = length(p);
        float angle = atan(p.y, p.x);
        float band = fract(angle / 6.28318 + time * 0.015);
        vec3 color = hue(band);
        // single soft radial falloff — no inner ring, just a gentle glow
        // that fades out, standing in for a diffuse cast-light patch
        float falloff = smoothstep(0.45, 0.0, dist);
        gl_FragColor = vec4(color, falloff * falloff * opacity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const causticMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(CONFIG.caustic.size, CONFIG.caustic.size),
    causticMaterial
  );
  causticMesh.position.set(0, 0, -2.2);
  scene.add(causticMesh);

  // ---- Particles ----
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(CONFIG.particleCount * 3);
  for (let i = 0; i < CONFIG.particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 14;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 9;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
  }
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  scene.add(particles);

  // ---- Post-processing (bloom) ----
  // Chromatic dispersion now comes from the glass material's own
  // `dispersion` property (real per-object refraction), so no separate
  // full-screen aberration pass is needed here.
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), CONFIG.bloom.strength, CONFIG.bloom.radius, CONFIG.bloom.threshold);
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  // ---- Resize handling ----
  function resize() {
    const rect = container.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
  }
  window.addEventListener("resize", resize);
  resize();

  // ---- Mouse parallax ----
  const mouse = { x: 0, y: 0 };
  const targetMouse = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  // ---- Animation loop ----
  const clock = new THREE.Clock();
  function animate() {
    const t = clock.getElapsedTime();

    mouse.x += (targetMouse.x - mouse.x) * 0.04;
    mouse.y += (targetMouse.y - mouse.y) * 0.04;

    logoGroup.rotation.y = t * CONFIG.rotationSpeed + mouse.x * CONFIG.parallaxStrength * 0.4;
    logoGroup.rotation.x = mouse.y * CONFIG.parallaxStrength * 0.2;
    logoGroup.position.y = Math.sin(t * CONFIG.floatSpeed) * CONFIG.floatAmplitude;

    camera.position.x += (mouse.x * CONFIG.parallaxStrength - camera.position.x) * 0.05;
    camera.position.y += (-mouse.y * CONFIG.parallaxStrength - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    beams[2].rotation.z = 0.5 + Math.sin(t * 0.15) * 0.05;

    if (rimMaterialRef) rimMaterialRef.uniforms.time.value = t;

    // drift the caustic patch with the logo's rotation so it reads as
    // "cast by" the object rather than a disconnected background layer
    causticMaterial.uniforms.time.value = t * CONFIG.caustic.speed * 10;
    causticMesh.position.x = Math.sin(logoGroup.rotation.y) * 0.6;
    causticMesh.position.y = logoGroup.position.y * 0.5;

    particles.rotation.y = t * 0.01;

    composer.render();
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", () => mxdHeroGlassLogo());

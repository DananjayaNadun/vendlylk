import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// @ts-ignore — see QRCode.tsx: no type declarations shipped for this entry.
import qrcodeFactory from 'qrcode-generator';

/**
 * A QR code that IS a tree, not a tree next to a QR code.
 *
 * Every leaf block is one of the QR's real dark modules — same row/column,
 * same colour, the whole time. In the "tree" pose each module is lofted
 * upward by how close it sits to the centre of the grid, which domes them
 * into a canopy; tapping animates every module straight down onto its exact
 * grid position, and the canopy IS the flat, scannable code, because it was
 * always built from those positions. Nothing swaps or fades between two
 * different shapes — it's one set of instances moving.
 *
 * Web only, by extension `.web.tsx` — three and @react-three/fiber need a
 * DOM canvas, so the sibling MagicTreeQR.tsx renders nothing on native.
 */

const UNIT = 0.24;
const PLATE_LIGHT = '#F1F0EC';
const PLATE_DARK = '#E3E1DA';
const GRASS = '#5FAE4A';
const TRUNK = '#6B4A33';

/** Lightens (positive) or darkens (negative) a hex color by `percent` [-1, 1]. */
function shade(hex: string, percent: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  const mix = (c: number) => Math.round(percent < 0 ? c * (1 + percent) : c + (255 - c) * percent);
  const clamp = (c: number) => Math.max(0, Math.min(255, c));
  return `#${[mix(r), mix(g), mix(b)].map((c) => clamp(c).toString(16).padStart(2, '0')).join('')}`;
}

type Modules = { count: number; dark: [number, number][] };

function encode(value: string): Modules {
  const qr = qrcodeFactory(0, 'M');
  qr.addData(value);
  qr.make();
  const count = qr.getModuleCount();
  const dark: [number, number][] = [];
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (qr.isDark(row, col)) dark.push([row, col]);
    }
  }
  return { count, dark };
}

/** Deterministic pseudo-random floats in [0,1) — stable across renders
    without threading a seed through every call site. */
function makeRng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

/**
 * The one thing on screen: an instance per dark module, each carrying its
 * flat grid position (the real QR) and its domed tree position, lerped by
 * `t`. `t` lives in a ref rather than state — it's re-read every frame while
 * animating, and state would mean 60 re-renders/sec for a value nothing
 * else needs to know about.
 */
function Canopy({
  modules,
  trunkHeight,
  canopyHeight,
  revealed,
  onSettled,
  leafColor,
}: {
  modules: Modules;
  trunkHeight: number;
  canopyHeight: number;
  revealed: boolean;
  onSettled: (flat: boolean) => void;
  leafColor: string;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const t = useRef(revealed ? 0 : 1);
  const offset = (modules.count - 1) / 2;
  const maxRadius = Math.hypot(offset, offset) * UNIT;

  const instances = useMemo(() => {
    const rng = makeRng(2024);
    return modules.dark.map(([row, col]) => {
      const x = (col - offset) * UNIT;
      const z = (row - offset) * UNIT;
      const d = Math.hypot(x, z) / maxRadius; // 0 at centre, ~1 at the corner
      const dome = Math.sqrt(Math.max(0, 1 - d * d));
      const jitter = (rng() - 0.5) * UNIT * 0.5;
      const treeY = trunkHeight + dome * canopyHeight + (rng() - 0.5) * canopyHeight * 0.18;
      // A little horizontal drift in the tree pose only, so the canopy reads
      // as foliage rather than a rigid grid floating in the air.
      return { x, z, treeY, jx: jitter, jz: (rng() - 0.5) * UNIT * 0.5, dark: rng() > 0.5 };
    });
  }, [modules, offset, maxRadius, trunkHeight, canopyHeight]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dark = shade(leafColor, -0.18);
    for (let i = 0; i < instances.length; i++) {
      const c = new THREE.Color(instances[i].dark ? dark : leafColor);
      mesh.setColorAt(i, c);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [instances, leafColor]);

  const apply = (v: number) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    for (let i = 0; i < instances.length; i++) {
      const it = instances[i];
      const x = it.x + it.jx * v;
      const z = it.z + it.jz * v;
      const y = 0.13 + (it.treeY - 0.13) * v;
      const scale = 1 + v * 0.55;
      m.makeScale(scale, scale, scale);
      m.setPosition(x, y, z);
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  };

  // Applied once synchronously so the first frame already shows the right
  // pose, rather than every instance starting at the origin.
  useEffect(() => {
    apply(t.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instances]);

  useFrame((_, dt) => {
    const target = revealed ? 0 : 1;
    const before = t.current;
    t.current += (target - t.current) * Math.min(1, dt * 3.2);
    if (Math.abs(t.current - target) < 0.002) t.current = target;
    apply(instances.length ? t.current : 0);
    if (before !== t.current && (t.current === 0 || t.current === 1)) onSettled(t.current === 0);
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, modules.dark.length]}>
      <boxGeometry args={[UNIT * 0.8, UNIT * 0.8, UNIT * 0.8]} />
      <meshStandardMaterial roughness={0.55} />
    </instancedMesh>
  );
}

/** The trunk — full height in the tree pose, sunk away when flat so the
    code isn't left with a post sticking out of the middle of it. */
function Trunk({ height, revealed }: { height: number; revealed: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(revealed ? 0 : 1);

  useFrame((_, dt) => {
    const target = revealed ? 0 : 1;
    t.current += (target - t.current) * Math.min(1, dt * 3.2);
    if (ref.current) {
      const h = Math.max(0.001, height * t.current);
      ref.current.scale.set(1, h / height, 1);
      ref.current.position.y = h / 2;
    }
  });

  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[height * 0.045, height * 0.075, height, 8]} />
      <meshStandardMaterial color={TRUNK} roughness={0.85} />
    </mesh>
  );
}

/** The ground — a checkerboard plate with grass tufts in the tree pose.
    Tapping doesn't just flatten the canopy: the foundation folds into the
    code too, fading to a single flat plate (the QR's light quiet zone) and
    losing its grass, so the whole base reads as part of the scannable code
    rather than a decoration sitting under it. */
function Ground({ radius, revealed }: { radius: number; revealed: boolean }) {
  const tiles = useMemo(() => {
    const size = radius * 2.3;
    const cells = 10;
    const cell = size / cells;
    const out: { x: number; z: number; dark: boolean }[] = [];
    for (let i = 0; i < cells; i++) {
      for (let j = 0; j < cells; j++) {
        out.push({ x: (i - (cells - 1) / 2) * cell, z: (j - (cells - 1) / 2) * cell, dark: (i + j) % 2 === 0 });
      }
    }
    return { out, cell, size };
  }, [radius]);

  const grassTufts = useMemo(() => {
    const rng = makeRng(7);
    const pts: { x: number; z: number; rot: number; scale: number }[] = [];
    const half = tiles.size / 2;
    for (let i = 0; i < 26; i++) {
      const edge = Math.floor(rng() * 4);
      const along = (rng() - 0.5) * tiles.size * 0.96;
      const out = half * (0.94 + rng() * 0.14);
      const [x, z] = edge === 0 ? [along, -out] : edge === 1 ? [along, out] : edge === 2 ? [-out, along] : [out, along];
      pts.push({ x, z, rot: rng() * Math.PI, scale: 0.6 + rng() * 0.5 });
    }
    return pts;
  }, [tiles.size]);

  const tileRefs = useRef<(THREE.Mesh | null)[]>([]);
  const grassRefs = useRef<(THREE.Mesh | null)[]>([]);
  const t = useRef(revealed ? 1 : 0);
  const from = useMemo(() => ({ light: new THREE.Color(PLATE_LIGHT), dark: new THREE.Color(PLATE_DARK) }), []);
  const to = useMemo(() => new THREE.Color(PLATE_LIGHT), []);

  useFrame((_, dt) => {
    const target = revealed ? 1 : 0;
    t.current += (target - t.current) * Math.min(1, dt * 3.2);
    if (Math.abs(t.current - target) < 0.002) t.current = target;

    tiles.out.forEach((tile, i) => {
      const mesh = tileRefs.current[i];
      const mat = mesh?.material as THREE.MeshStandardMaterial | undefined;
      if (!mat) return;
      mat.color.copy(tile.dark ? from.dark : from.light).lerp(to, t.current);
    });
    grassRefs.current.forEach((mesh) => {
      const mat = mesh?.material as THREE.MeshStandardMaterial | undefined;
      if (mat) mat.opacity = 1 - t.current;
    });
  });

  return (
    <group>
      {tiles.out.map((tile, i) => (
        <mesh
          key={i}
          ref={(m) => {
            tileRefs.current[i] = m;
          }}
          position={[tile.x, 0, tile.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[tiles.cell * 0.96, tiles.cell * 0.96]} />
          <meshStandardMaterial color={tile.dark ? PLATE_DARK : PLATE_LIGHT} roughness={0.9} />
        </mesh>
      ))}
      {grassTufts.map((g, i) => (
        <mesh
          key={i}
          ref={(m) => {
            grassRefs.current[i] = m;
          }}
          position={[g.x, 0.05, g.z]}
          rotation={[0, g.rot, 0]}
          scale={g.scale}
        >
          <coneGeometry args={[0.05, 0.22, 4]} />
          <meshStandardMaterial color={GRASS} roughness={0.8} transparent />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Swings the camera from the isometric tree view up to a straight top-down
 * view of the flat grid as `revealed` toggles — the tap doesn't just morph
 * the tree, it rotates the whole shot overhead so the code reads flat and
 * legible, then swings back down for the tree.
 */
function FitCamera({ treeRadius, flatRadius, revealed }: { treeRadius: number; flatRadius: number; revealed: boolean }) {
  const { camera, size } = useThree();
  const t = useRef(revealed ? 1 : 0);
  const pos = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());

  useFrame((_, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    const vFov = (cam.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (size.width / size.height));
    const minFov = Math.min(vFov, hFov);
    const distTree = (treeRadius * 1.08) / Math.sin(minFov / 2);
    const distFlat = (flatRadius * 1.4) / Math.sin(minFov / 2);

    const target = revealed ? 1 : 0;
    t.current += (target - t.current) * Math.min(1, dt * 3.2);
    if (Math.abs(t.current - target) < 0.002) t.current = target;
    const v = t.current;

    pos.current.set(0, distTree * 0.6, distTree * 0.82).lerp(new THREE.Vector3(0, distFlat, distFlat * 0.04), v);
    look.current.set(0, treeRadius * 0.45, 0).lerp(new THREE.Vector3(0, 0.13, 0), v);

    cam.position.copy(pos.current);
    cam.near = 0.1;
    cam.far = Math.max(distTree, distFlat) * 4;
    cam.updateProjectionMatrix();
    cam.lookAt(look.current);
  });

  return null;
}

function Controls() {
  const { camera, gl } = useThree();
  const controls = useRef<OrbitControls | null>(null);

  useEffect(() => {
    const instance = new OrbitControls(camera, gl.domElement);
    instance.enablePan = false;
    instance.enableZoom = false;
    instance.enableRotate = false;
    instance.autoRotate = false;
    controls.current = instance;
    return () => {
      instance.dispose();
      controls.current = null;
    };
  }, [camera, gl]);

  useFrame(() => {
    controls.current?.update();
  });

  return null;
}

function Scene({
  modules,
  revealed,
  onSettled,
  leafColor,
}: {
  modules: Modules;
  revealed: boolean;
  onSettled: (flat: boolean) => void;
  leafColor: string;
}) {
  const span = modules.count * UNIT;
  const radius = span * 0.5;
  const trunkHeight = radius * 0.55;
  const canopyHeight = radius * 1.65;

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} />
      <hemisphereLight args={['#ffffff', '#dcd8cf', 0.4]} />

      <Ground radius={radius} revealed={revealed} />
      <Trunk height={trunkHeight} revealed={revealed} />
      <Canopy
        modules={modules}
        trunkHeight={trunkHeight}
        canopyHeight={canopyHeight}
        revealed={revealed}
        onSettled={onSettled}
        leafColor={leafColor}
      />

      <FitCamera treeRadius={trunkHeight + canopyHeight + radius * 0.3} flatRadius={radius} revealed={revealed} />
      <Controls />
    </>
  );
}

export type MagicTreeQRProps = {
  value: string;
  width: number;
  height: number;
  leafColor?: string;
  hint?: boolean;
  hintColor?: string;
  onToggle?: (revealed: boolean) => void;
};

export function MagicTreeQR({
  value,
  width,
  height,
  leafColor = '#4CAF50',
  hint = true,
  hintColor,
  onToggle,
}: MagicTreeQRProps) {
  const modules = useMemo(() => encode(value), [value]);
  const [revealed, setRevealed] = useState(false);
  const [settled, setSettled] = useState(false);

  const toggle = () => {
    const next = !revealed;
    setRevealed(next);
    onToggle?.(next);
  };

  return (
    <div style={{ width, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{ width, height, cursor: 'pointer' }}
        onClick={toggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
        aria-label={revealed ? 'Show the tree' : 'Show the QR code'}
      >
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 3, 4], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Scene modules={modules} revealed={revealed} onSettled={setSettled} leafColor={leafColor} />
        </Canvas>
      </div>
      {hint && (
        <span
          style={{
            marginTop: 6,
            fontFamily: 'IBMPlexMono_400Regular, ui-monospace, monospace',
            fontSize: 9.5,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: hintColor ?? 'rgba(255,255,255,0.5)',
          }}
        >
          {revealed && settled ? 'Tap to see the tree' : 'Tap the tree to see the QR code'}
        </span>
      )}
    </div>
  );
}

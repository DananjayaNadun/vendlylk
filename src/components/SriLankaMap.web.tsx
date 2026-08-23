import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import {
  DISTRICTS,
  District,
  ROUTES,
  SRI_LANKA_BBOX,
  SRI_LANKA_OUTLINE,
} from './sriLankaData';

/**
 * Sri Lanka as a lit, rotating relief.
 *
 * The shape is the real coastline (see ./sriLankaData.ts), triangulated and
 * extruded, not a drawn silhouette. Districts sit at their true coordinates,
 * and the routes between them are quadratic Beziers lifted off the surface,
 * each carrying a travelling light so they read as traffic rather than
 * decoration.
 *
 * Built on three directly rather than @react-three/drei, to keep bundle size
 * down: drei would supply OrbitControls, fat dashed lines and an Html
 * tooltip for free, but at real cost in JS shipped to the page. Controls are
 * driven imperatively, the tooltip is a plain DOM node positioned by
 * projecting the marker itself, and the arcs are ordinary three lines.
 *
 * Web only, by extension `.web.tsx`: this is plain-DOM React (three, R3F and
 * a real <div> tooltip), so it cannot run under React Native. The sibling
 * SriLankaMap.tsx renders nothing on iOS/Android, keeping native builds
 * compiling the way the rest of this codebase does.
 */

/* Retargeted from the source project's teal to this site's indigo accent —
   the handoff notes call these out as expected-to-change, not fixed assets. */
const LAND_TOP = '#24347F';
const LAND_SIDE = '#0E1436';
const MARKER = '#6E85FF';
const ARC = '#9DB2FF';

/** World units per degree of longitude — sets the island's on-screen size. */
const SCALE = 3.4;
const THICKNESS = 0.22;

const CENTRE_LON = (SRI_LANKA_BBOX.minLon + SRI_LANKA_BBOX.maxLon) / 2;
const CENTRE_LAT = (SRI_LANKA_BBOX.minLat + SRI_LANKA_BBOX.maxLat) / 2;
/** Longitude degrees narrow away from the equator; without this the island is fat. */
const LON_SQUEEZE = Math.cos((CENTRE_LAT * Math.PI) / 180);

/**
 * Radius of the sphere that contains the island from any angle.
 *
 * The scene turns about its vertical axis, so the camera has to clear the
 * island's longest reach from centre, not merely its width — fitting the
 * facing view would clip the coast every time it swings side-on. Measured
 * off the real coastline rather than the bounding box, since Sri Lanka
 * tapers and never reaches the box's corners: worth ~7% more island on
 * screen for one pass over 253 points at module load. The allowance covers
 * the extrude bevel and the marker glows, which bloom past the shore.
 */
const FIT_RADIUS =
  SRI_LANKA_OUTLINE.reduce((max, [lon, lat]) => {
    const [x, z] = project(lon, lat);
    return Math.max(max, Math.hypot(x, z));
  }, 0) + 0.6;

/**
 * Whether the OS asks for reduced motion — the plain-web equivalent of React
 * Native's `AccessibilityInfo`. When true, auto-rotate is switched off.
 */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/** Longitude/latitude to world space, with the island lying in the XZ plane. */
function project(lon: number, lat: number): [number, number] {
  return [(lon - CENTRE_LON) * LON_SQUEEZE * SCALE, -(lat - CENTRE_LAT) * SCALE];
}

function districtPoint(district: District, y = THICKNESS): THREE.Vector3 {
  const [x, z] = project(district.at[0], district.at[1]);
  return new THREE.Vector3(x, y, z);
}

function routeCurve(from: District, to: District): THREE.QuadraticBezierCurve3 {
  const a = districtPoint(from);
  const b = districtPoint(to);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  // Longer hops arch higher.
  mid.y += 0.5 + a.distanceTo(b) * 0.42;
  return new THREE.QuadraticBezierCurve3(a, mid, b);
}

/** One soft radial dot, drawn once and shared by every glow in the scene. */
function useGlowTexture(): THREE.Texture {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.25, 'rgba(160,225,255,0.55)');
      g.addColorStop(1, 'rgba(80,190,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

function Island() {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    SRI_LANKA_OUTLINE.forEach(([lon, lat], index) => {
      const [x, z] = project(lon, lat);
      // Built in the shape's own XY and laid flat by the mesh rotation below, so
      // the extrusion depth becomes the island's height.
      if (index === 0) shape.moveTo(x, -z);
      else shape.lineTo(x, -z);
    });
    shape.closePath();

    const extruded = new THREE.ExtrudeGeometry(shape, {
      depth: THICKNESS,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 2,
    });
    extruded.computeVertexNormals();
    return extruded;
  }, []);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <meshStandardMaterial
        color={LAND_TOP}
        roughness={0.55}
        metalness={0.15}
        emissive={LAND_SIDE}
        emissiveIntensity={0.35}
      />
    </mesh>
  );
}

/**
 * A route: the whole arc drawn faintly, plus a light running along it. The
 * runner is what carries the motion — a static dashed line would sit still.
 */
function Arc({
  from,
  to,
  index,
  glow,
}: {
  from: District;
  to: District;
  index: number;
  glow: THREE.Texture;
}) {
  const runner = useRef<THREE.Sprite>(null);
  const curve = useMemo(() => routeCurve(from, to), [from, to]);
  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(curve.getPoints(72)),
    [curve],
  );

  useFrame(({ clock }) => {
    if (!runner.current) return;
    // Staggered so the routes do not all set off together.
    const t = (clock.elapsedTime * 0.22 + index * 0.17) % 1;
    runner.current.position.copy(curve.getPointAt(t));
    // Fade in and out at the ends so it appears to leave and arrive.
    const fade = Math.sin(t * Math.PI);
    runner.current.scale.setScalar(0.18 + fade * 0.22);
    const material = runner.current.material as THREE.SpriteMaterial;
    material.opacity = fade;
  });

  return (
    <group>
      <line>
        <primitive object={geometry} attach="geometry" />
        <lineBasicMaterial color={ARC} transparent opacity={0.28} toneMapped={false} />
      </line>
      <sprite ref={runner}>
        <spriteMaterial
          map={glow}
          color={ARC}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}

function Marker({
  district,
  glow,
  hovered,
  onHover,
}: {
  district: District;
  glow: THREE.Texture;
  hovered: boolean;
  onHover: (d: District | null) => void;
}) {
  const position = useMemo(() => districtPoint(district), [district]);
  const halo = useRef<THREE.Sprite>(null);
  const radius = 0.055 + district.weight * 0.05;

  useFrame(({ clock }) => {
    if (!halo.current) return;
    // Each marker breathes on its own phase, so the island does not blink in unison.
    const t = clock.elapsedTime * 1.6 + district.at[0];
    const base = 0.5 + district.weight * 0.45;
    halo.current.scale.setScalar(base * (1 + Math.sin(t) * 0.12) * (hovered ? 1.45 : 1));
  });

  return (
    <group position={position}>
      <sprite ref={halo}>
        <spriteMaterial
          map={glow}
          color={MARKER}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <mesh
        onPointerOver={event => {
          event.stopPropagation();
          onHover(district);
        }}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[radius, 20, 20]} />
        <meshStandardMaterial
          color={MARKER}
          emissive={MARKER}
          emissiveIntensity={hovered ? 2.6 : 1.4}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

/** Drives the tooltip's screen position from the marker's world position. */
function TooltipAnchor({
  district,
  node,
}: {
  district: District | null;
  node: React.RefObject<HTMLDivElement | null>;
}) {
  const { camera, size } = useThree();
  const world = useMemo(() => (district ? districtPoint(district, THICKNESS + 0.28) : null), [
    district,
  ]);

  useFrame(() => {
    if (!world || !node.current) return;
    const projected = world.clone().project(camera);
    const x = (projected.x * 0.5 + 0.5) * size.width;
    const y = (-projected.y * 0.5 + 0.5) * size.height;
    node.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%)`;
  });

  return null;
}

/**
 * Frames the whole island, whatever box the parent gives it.
 *
 * The camera position in the source project was hand-placed for a wide,
 * near-square panel and left the coast cropped. In a narrow column the
 * horizontal field of view is much tighter than the vertical one, so the
 * distance is derived from whichever is smaller against the live viewport —
 * the island then stays fully in frame at any container size.
 */
function FitCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const vFov = (cam.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (size.width / size.height));
    const distance = (FIT_RADIUS * 1.06) / Math.sin(Math.min(vFov, hFov) / 2);

    // Direction is whatever the viewer has orbited to; only distance changes.
    cam.position.setLength(distance);
    cam.near = Math.max(0.1, distance - FIT_RADIUS * 2);
    cam.far = distance + FIT_RADIUS * 4;
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

/** OrbitControls driven imperatively, so drei is not needed for it. */
function Controls({ autoRotate }: { autoRotate: boolean }) {
  const { camera, gl } = useThree();
  const controls = useRef<OrbitControls | null>(null);

  useEffect(() => {
    const instance = new OrbitControls(camera, gl.domElement);
    instance.enablePan = false;
    instance.enableZoom = false;
    instance.enableDamping = true;
    instance.dampingFactor = 0.06;
    instance.minPolarAngle = Math.PI / 6;
    instance.maxPolarAngle = Math.PI / 2.15;
    controls.current = instance;
    return () => {
      instance.dispose();
      controls.current = null;
    };
    // The frameloop runs continuously, so `update()` in useFrame below is what
    // advances damping and auto-rotation — no invalidate wiring needed.
  }, [camera, gl]);

  useFrame(() => {
    const instance = controls.current;
    if (!instance) return;
    instance.autoRotate = autoRotate;
    instance.autoRotateSpeed = 0.6;
    instance.update();
  });

  return null;
}

function Scene({
  reducedMotion,
  onHover,
  tooltipNode,
  hovered,
}: {
  reducedMotion: boolean;
  onHover: (d: District | null) => void;
  tooltipNode: React.RefObject<HTMLDivElement | null>;
  hovered: District | null;
}) {
  const glow = useGlowTexture();
  const { gl } = useThree();

  useEffect(() => {
    gl.domElement.style.cursor = hovered ? 'pointer' : 'grab';
  }, [gl, hovered]);

  const byName = useMemo(() => {
    const map: Record<string, District> = {};
    DISTRICTS.forEach(d => {
      map[d.name] = d;
    });
    return map;
  }, []);

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 9, 4]} intensity={1.5} castShadow />
      {/* A cool kicker from behind, which is what gives the coast its rim. */}
      <pointLight position={[-6, 3, -6]} intensity={40} color={MARKER} distance={22} />

      <Island />

      {ROUTES.map(([a, b], index) =>
        byName[a] && byName[b] ? (
          <Arc key={a + '-' + b} from={byName[a]} to={byName[b]} index={index} glow={glow} />
        ) : null,
      )}

      {DISTRICTS.map(district => (
        <Marker
          key={district.name}
          district={district}
          glow={glow}
          hovered={hovered ? hovered.name === district.name : false}
          onHover={onHover}
        />
      ))}

      <TooltipAnchor district={hovered} node={tooltipNode} />
      {/* Before Controls, so OrbitControls initialises at the fitted distance. */}
      <FitCamera />
      <Controls autoRotate={!reducedMotion} />
    </>
  );
}

export type SriLankaMapProps = { width: number; height: number };

export function SriLankaMap({ width, height }: SriLankaMapProps) {
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState<District | null>(null);
  const tooltipNode = useRef<HTMLDivElement | null>(null);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
      }}
    >
      <Canvas
        // "percentage" rather than the default: three deprecated PCFSoftShadowMap,
        // and R3F's bare `shadows` still asks for it.
        shadows="percentage"
        dpr={[1, 2]}
        camera={{ position: [0, 7.5, 8.5], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene
          reducedMotion={reducedMotion}
          onHover={setHovered}
          tooltipNode={tooltipNode}
          hovered={hovered}
        />
      </Canvas>

      {/* Outside the canvas, so it is real text a reader can select and a screen
       *  reader can reach, rather than something painted into the scene. */}
      <div
        ref={tooltipNode}
        style={{ ...tooltipStyle, opacity: hovered ? 1 : 0 }}
        aria-live="polite"
      >
        <span style={tooltipNameStyle}>{hovered ? hovered.name : ''}</span>
        <span style={tooltipNoteStyle}>One system, island-wide</span>
      </div>
    </div>
  );
}

const tooltipStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid rgba(110,133,255,0.5)',
  background: 'rgba(18,21,29,0.94)',
  boxShadow: '0 18px 40px rgba(0,0,0,0.55)',
  color: '#FFFFFF',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  transition: 'opacity 140ms ease',
  willChange: 'transform',
};

const tooltipNameStyle: React.CSSProperties = {
  fontFamily: 'IBMPlexSans_600SemiBold, system-ui, sans-serif',
  fontSize: 14.5,
};

const tooltipNoteStyle: React.CSSProperties = {
  fontFamily: 'IBMPlexMono_400Regular, ui-monospace, monospace',
  fontSize: 9.5,
  letterSpacing: 1.2,
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.5)',
};

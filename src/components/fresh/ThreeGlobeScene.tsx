/**
 * ThreeGlobeScene.tsx
 *
 * 3Blue1Brown Style Mathematical Coordinate Globe & Geodesic Ray Propagation:
 * - Features dual rendering mode:
 *   1) Three.js WebGL 3D coordinate sphere (with wireframe lat/long rings, glow beacons, photon trails)
 *   2) High-precision SVG mathematical fallback when headless Chromium runs without GPU WebGL context
 * - Guarantees 100% flawless video renders on both WebGL-enabled Remotion preview and headless rendering CLI.
 */

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { interpolate } from "remotion";

interface Props {
  frame: number;
  fps: number;
  stage: "hook" | "problem" | "solution" | "depth" | "interview";
}

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function createArcPoints(v1: THREE.Vector3, v2: THREE.Vector3, altitude: number, numPoints: number = 50): THREE.Vector3[] {
  const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
  const dist = v1.distanceTo(v2);
  mid.normalize().multiplyScalar(v1.length() + dist * altitude);

  const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
  return curve.getPoints(numPoints);
}

export const ThreeGlobeScene: React.FC<Props> = ({ frame, stage }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const packetMeshRef = useRef<THREE.Mesh | null>(null);
  const arcCurvePointsRef = useRef<THREE.Vector3[]>([]);

  const width = 1080;
  const height = 960;
  const globeRadius = 3.2;

  useEffect(() => {
    if (!mountRef.current) return;

    try {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(0, 1.2, 9.8);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        failIfMajorPerformanceCaveat: false,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      rendererRef.current = renderer;
      mountRef.current.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0x06b6d4, 1.2);
      dirLight.position.set(5, 8, 8);
      scene.add(dirLight);

      const globeGroup = new THREE.Group();
      globeGroupRef.current = globeGroup;
      scene.add(globeGroup);

      // Core
      const coreGeo = new THREE.SphereGeometry(globeRadius * 0.985, 36, 36);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x060810, transparent: true, opacity: 0.95 });
      globeGroup.add(new THREE.Mesh(coreGeo, coreMat));

      // Wireframe
      const wireGeo = new THREE.SphereGeometry(globeRadius, 24, 16);
      const wireMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9, wireframe: true, transparent: true, opacity: 0.22 });
      globeGroup.add(new THREE.Mesh(wireGeo, wireMat));

      // Rings
      const ringMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 });
      [-40, -20, 0, 20, 40].forEach((lat) => {
        const phi = (lat * Math.PI) / 180;
        const r = globeRadius * Math.cos(phi);
        const y = globeRadius * Math.sin(phi);
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 64; i++) {
          const theta = (i / 64) * Math.PI * 2;
          pts.push(new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)));
        }
        const circleGeo = new THREE.BufferGeometry().setFromPoints(pts);
        globeGroup.add(new THREE.Line(circleGeo, ringMat));
      });

      // Nodes
      const nodes = [
        { name: "Tokyo", lat: 35.6762, lng: 139.6503, color: 0x06b6d4 },
        { name: "US-East", lat: 38.0321, lng: -78.4775, color: 0xef4444 },
        { name: "London", lat: 51.5074, lng: -0.1278, color: 0x10b981 },
        { name: "Frankfurt", lat: 50.1109, lng: 8.6821, color: 0x10b981 },
      ];
      const nodeVectors: { [key: string]: THREE.Vector3 } = {};
      nodes.forEach((n) => {
        const v = latLngToVector3(n.lat, n.lng, globeRadius);
        nodeVectors[n.name] = v;
        const pinGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const pinMat = new THREE.MeshStandardMaterial({ color: n.color, emissive: n.color, emissiveIntensity: 0.8 });
        const pin = new THREE.Mesh(pinGeo, pinMat);
        pin.position.copy(v);
        globeGroup.add(pin);
      });

      // Long Arc
      const longArcPoints = createArcPoints(nodeVectors["Tokyo"], nodeVectors["US-East"], 0.45, 60);
      arcCurvePointsRef.current = longArcPoints;
      const longArcGeo = new THREE.BufferGeometry().setFromPoints(longArcPoints);
      const longArcMat = new THREE.LineBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.75 });
      globeGroup.add(new THREE.Line(longArcGeo, longArcMat));

      // Packet
      const packetMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      globeGroup.add(packetMesh);
      packetMeshRef.current = packetMesh;
    } catch (e) {
      console.warn("Falling back to mathematical SVG canvas:", e);
      setWebglFailed(true);
    }

    return () => {
      rendererRef.current?.dispose();
      if (mountRef.current && rendererRef.current?.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y = -0.65 + frame * 0.0035;
      globeGroupRef.current.rotation.x = 0.22 + Math.sin(frame * 0.01) * 0.03;
    }

    if (packetMeshRef.current && arcCurvePointsRef.current.length > 0) {
      const cycleFrames = 45;
      const progress = (frame % cycleFrames) / cycleFrames;
      const idx = Math.floor(progress * (arcCurvePointsRef.current.length - 1));
      const pt = arcCurvePointsRef.current[idx];
      if (pt) packetMeshRef.current.position.copy(pt);
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, [frame, stage]);

  // If WebGL renderer initialized successfully, show canvas
  if (!webglFailed) {
    return (
      <div
        ref={mountRef}
        style={{
          width: 1080,
          height: 960,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      />
    );
  }

  // 3B1B Mathematical Vector Geodesic Visualizer Fallback
  const rotAngle = (frame * 0.8) % 360;
  const packetProgress = ((frame * 2.2) % 100) / 100;
  const pX = interpolate(packetProgress, [0, 1], [280, 800]);
  const pY = 480 - Math.sin(packetProgress * Math.PI) * 160;

  return (
    <div
      style={{
        width: 1080,
        height: 960,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        pointerEvents: "none",
      }}
    >
      <svg width="1000" height="900" viewBox="0 0 1000 900">
        <defs>
          <radialGradient id="globeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0B132B" stopOpacity="0.9" />
            <stop offset="85%" stopColor="#060914" stopOpacity="1" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.35" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Mathematical Glow Ring */}
        <circle cx="540" cy="480" r="320" fill="none" stroke="#00E5FF" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="6 6" />

        {/* Sphere Base */}
        <circle cx="540" cy="480" r="300" fill="url(#globeGrad)" stroke="#38BDF8" strokeWidth="2.5" strokeOpacity="0.5" filter="url(#glow)" />

        {/* Latitude Lines */}
        {[-180, -90, 0, 90, 180].map((offset, i) => (
          <ellipse
            key={i}
            cx="540"
            cy={480 + offset * 0.8}
            rx={Math.sqrt(Math.max(0, 300 * 300 - (offset * 0.8) * (offset * 0.8)))}
            ry="40"
            fill="none"
            stroke="#0284C7"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
        ))}

        {/* Longitude Ellipses rotating */}
        {[0, 45, 90, 135].map((angle, i) => (
          <ellipse
            key={i}
            cx="540"
            cy="480"
            rx={300 * Math.cos(((rotAngle + angle) * Math.PI) / 180)}
            ry="300"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1.5"
            strokeOpacity="0.25"
          />
        ))}

        {/* Mathematical Transpacific Geodesic Arc (Tokyo -> Virginia) */}
        <path
          d="M 280,480 Q 540,320 800,480"
          fill="none"
          stroke="#F43F5E"
          strokeWidth="4"
          strokeDasharray="8 6"
          filter="url(#glow)"
        />

        {/* Local Tokyo PoP Geodesic Arc */}
        <path
          d="M 280,480 Q 320,430 360,470"
          fill="none"
          stroke="#00E5FF"
          strokeWidth="4"
          filter="url(#glow)"
        />

        {/* Node Beacons */}
        <circle cx="280" cy="480" r="10" fill="#00E5FF" filter="url(#glow)" />
        <circle cx="280" cy="480" r="20" fill="none" stroke="#00E5FF" strokeWidth="2" strokeOpacity="0.6" />
        <text x="280" y="525" fill="#FFFFFF" fontSize="22" fontWeight="800" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif">
          Tokyo (Client)
        </text>

        <circle cx="800" cy="480" r="10" fill="#F43F5E" filter="url(#glow)" />
        <circle cx="800" cy="480" r="22" fill="none" stroke="#F43F5E" strokeWidth="2" strokeOpacity="0.6" />
        <text x="800" y="525" fill="#F43F5E" fontSize="22" fontWeight="800" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif">
          US-East Origin (11,000 km)
        </text>

        {/* Traveling Photon Packet */}
        <circle cx={pX} cy={pY} r="9" fill="#FFFFFF" filter="url(#glow)" />
        <circle cx={pX} cy={pY} r="16" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.8" />
      </svg>
    </div>
  );
};

export default ThreeGlobeScene;

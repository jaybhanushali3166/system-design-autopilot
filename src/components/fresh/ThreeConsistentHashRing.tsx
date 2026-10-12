/**
 * ThreeConsistentHashRing.tsx
 *
 * Professional 3D Consistent Hashing Torus Ring.
 * Engineered for clean, subtle presentation:
 * - Steady, minimal perspective depth
 * - Solid matte/metallic PBR finish, no aggressive wobbles or bouncy shakes
 * - Precise alignment with 2D technical overlays
 */

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
  frame: number;
  fps: number;
  stage: "empty" | "servers" | "keys" | "add_server";
}

export const ThreeConsistentHashRing: React.FC<Props> = ({ frame, stage }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const ringGroupRef = useRef<THREE.Group | null>(null);
  const serverMeshesRef = useRef<THREE.Mesh[]>([]);

  const width = 1080;
  const height = 1000;
  const radius = 1.95; // Exact radius match to the 280px radius in SVG

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera - Top-down with gentle technical angle
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 10.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. WebGLRenderer
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;
      mountRef.current.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGL initialization skipped or failed:", e);
      return;
    }

    // 4. Subtle Architectural Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x06b6d4, 1.2);
    dirLight.position.set(0, 5, 8);
    scene.add(dirLight);

    // 5. Hash Ring Group
    const ringGroup = new THREE.Group();
    // Center at y = -1.60 to match cy = 720 in SVG container
    ringGroup.position.set(0, -1.60, 0);
    ringGroupRef.current = ringGroup;
    scene.add(ringGroup);

    // Precision engineered Torus
    const ringGeo = new THREE.TorusGeometry(radius, 0.025, 24, 120);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.4,
      metalness: 0.8,
      roughness: 0.2,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringGroup.add(ringMesh);

    // 6. Technical Server Markers on Ring (Slim cylindrical discs)
    const serverDefs = [
      { id: "A", angle: (-30 * Math.PI) / 180, color: 0x10b981 },
      { id: "B", angle: (-150 * Math.PI) / 180, color: 0x3b82f6 },
      { id: "C", angle: (-270 * Math.PI) / 180, color: 0x8b5cf6 },
      { id: "D", angle: (-210 * Math.PI) / 180, color: 0x06b6d4 },
    ];

    const sMeshes: THREE.Mesh[] = [];
    serverDefs.forEach((s) => {
      const sGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.08, 32);
      const sMat = new THREE.MeshStandardMaterial({
        color: s.color,
        emissive: s.color,
        emissiveIntensity: 0.3,
        metalness: 0.9,
        roughness: 0.2,
      });
      const sMesh = new THREE.Mesh(sGeo, sMat);
      sMesh.rotation.x = Math.PI / 2;
      sMesh.position.set(radius * Math.cos(s.angle), radius * Math.sin(s.angle), 0.06);
      ringGroup.add(sMesh);
      sMeshes.push(sMesh);
    });
    serverMeshesRef.current = sMeshes;

    return () => {
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update scene deterministically with Remotion frame clock — strictly smooth, no cartoon shake
  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    if (ringGroupRef.current) {
      // Extremely subtle, premium continuous rotation (0.001 rad/frame)
      ringGroupRef.current.rotation.z = frame * 0.002;
    }

    // Toggle 4th node visibility based on stage
    if (serverMeshesRef.current[3]) {
      serverMeshesRef.current[3].visible = stage === "add_server";
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, [frame, stage]);

  return (
    <div
      ref={mountRef}
      style={{
        width: 1080,
        height: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    />
  );
};

export default ThreeConsistentHashRing;

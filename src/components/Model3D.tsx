import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface Model3DProps {
  modelType?: 'box' | 'sphere' | 'torus' | 'cone' | 'cylinder';
  color?: string;
  autoRotate?: boolean;
  modelUrl?: string;
}

// Componente de geometría básica rotando
function RotatingGeometry({ modelType = 'box', color = '#6366f1', autoRotate = true }: Model3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  const getGeometry = () => {
    switch (modelType) {
      case 'sphere':
        return <sphereGeometry args={[1, 32, 32]} />;
      case 'torus':
        return <torusGeometry args={[1, 0.4, 16, 100]} />;
      case 'cone':
        return <coneGeometry args={[1, 2, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[1, 1, 2, 32]} />;
      default:
        return <boxGeometry args={[1.5, 1.5, 1.5]} />;
    }
  };

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      {getGeometry()}
      <meshStandardMaterial 
        color={color} 
        metalness={0.6}
        roughness={0.4}
      />
    </mesh>
  );
}

// Componente de carga para modelos externos
function ModelLoader({ url }: { url: string }) {
  // Aquí puedes cargar modelos GLTF/GLB usando useGLTF de drei
  // Por ahora retornamos una geometría básica
  return <RotatingGeometry modelType="box" color="#8b5cf6" />;
}

export const Model3D: React.FC<Model3DProps & { className?: string }> = ({ 
  modelType = 'box',
  color = '#6366f1',
  autoRotate = true,
  modelUrl,
  className = ''
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          
          {modelUrl ? (
            <ModelLoader url={modelUrl} />
          ) : (
            <RotatingGeometry 
              modelType={modelType} 
              color={color} 
              autoRotate={autoRotate}
            />
          )}
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

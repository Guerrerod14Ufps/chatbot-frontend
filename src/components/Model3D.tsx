import React, { useRef, Suspense, memo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html, ContactShadows, Grid } from '@react-three/drei';
import * as THREE from 'three';

type EnvironmentPreset = 'sunset' | 'city' | 'park' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio';

interface Model3DProps {
  modelType?: 'box' | 'sphere' | 'torus' | 'cone' | 'cylinder';
  color?: string;
  autoRotate?: boolean;
  modelUrl?: string;
  rotationSpeed?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
  environment?: EnvironmentPreset;
  wireframe?: boolean;
  showGrid?: boolean;
  className?: string;
}

// Componente de carga con spinner
function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin" />
        <span className="text-xs text-gray-600">Cargando modelo...</span>
      </div>
    </Html>
  );
}

// Componente de error
function ErrorDisplay({ message }: { message: string }) {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 p-4 bg-red-50 rounded-lg border border-red-200">
        <span className="text-sm text-red-600 font-medium">Error</span>
        <span className="text-xs text-red-500">{message}</span>
      </div>
    </Html>
  );
}

// Hook para auto-ajustar la cámara al modelo
function AutoCamera({ target }: { target: THREE.Box3 }) {
  const { camera } = useThree();
  
  useEffect(() => {
    const size = target.getSize(new THREE.Vector3());
    const center = target.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 2.5;
    
    camera.position.set(center.x, center.y + distance * 0.3, center.z + distance);
    camera.lookAt(center);
  }, [camera, target]);

  return null;
}

// Componente de geometría básica rotando (optimizado con memo)
const RotatingGeometry = memo(({ 
  modelType = 'box', 
  color = '#6366f1', 
  autoRotate = true,
  rotationSpeed = 0.5,
  wireframe = false
}: Model3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (meshRef.current && autoRotate) {
      // Rotación más natural solo en Y
      meshRef.current.rotation.y += delta * rotationSpeed;
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
        metalness={0.7}
        roughness={0.3}
        envMapIntensity={1}
        wireframe={wireframe}
      />
    </mesh>
  );
});

RotatingGeometry.displayName = 'RotatingGeometry';

// Componente de carga para modelos externos GLTF/GLB
function ModelLoader({ 
  url, 
  autoRotate = true,
  rotationSpeed = 0.5,
  wireframe = false
}: { 
  url: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  wireframe?: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const meshRef = useRef<THREE.Group>(null);
  const boxRef = useRef<THREE.Box3 | null>(null);

  try {
    // Cargar modelo GLTF/GLB
    const { scene } = useGLTF(url);
    
    // Calcular bounding box para auto-ajuste
    useEffect(() => {
      if (scene) {
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.wireframe = wireframe;
            }
          }
        });
        
        const box = new THREE.Box3().setFromObject(scene);
        boxRef.current = box;
      }
    }, [scene, wireframe]);

    useFrame((_state, delta) => {
      if (meshRef.current && autoRotate) {
        meshRef.current.rotation.y += delta * rotationSpeed;
      }
    });

    if (error) {
      return <ErrorDisplay message={error} />;
    }

    return (
      <>
        <primitive 
          object={scene} 
          ref={meshRef}
          scale={1}
        />
        {boxRef.current && <AutoCamera target={boxRef.current} />}
      </>
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error al cargar el modelo';
    setError(errorMessage);
    return <ErrorDisplay message={errorMessage} />;
  }
}

// Pre-cargar modelos comunes (opcional, para mejor rendimiento)
// useGLTF.preload('/models/example.glb');

export interface Model3DRef {
  resetCamera: () => void;
}

// Componente interno para manejar controles y reset
const ControlsWithReset = React.forwardRef<Model3DRef, { controlsRef: React.MutableRefObject<any> }>(
  ({ controlsRef }, forwardRef) => {
    const { camera } = useThree();

    React.useImperativeHandle(forwardRef, () => ({
      resetCamera: () => {
        if (controlsRef.current) {
          controlsRef.current.reset();
        }
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);
      }
    }));

    return null;
  }
);

ControlsWithReset.displayName = 'ControlsWithReset';

export const Model3D = React.forwardRef<Model3DRef, Model3DProps>(({ 
  modelType = 'box',
  color = '#6366f1',
  autoRotate = true,
  modelUrl,
  rotationSpeed = 0.5,
  enableZoom = false,
  enablePan = false,
  environment = 'sunset',
  wireframe = false,
  showGrid = false,
  className = ''
}, ref) => {
  const controlsRef = useRef<any>(null);

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]} // Pixel ratio adaptativo
        performance={{ min: 0.5 }} // Reducir calidad si FPS baja
      >
        <Suspense fallback={<LoadingSpinner />}>
          {/* Grid opcional */}
          {showGrid && (
            <Grid
              args={[10, 10]}
              cellColor="#6b7280"
              sectionColor="#9ca3af"
              cellThickness={1}
              sectionThickness={1}
              fadeDistance={30}
              fadeStrength={1}
            />
          )}

          {/* Iluminación mejorada */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1.2} 
            castShadow 
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <directionalLight position={[-5, 3, -5]} intensity={0.5} />
          <pointLight position={[0, -5, 0]} intensity={0.3} />
          
          {/* Modelo */}
          {modelUrl ? (
            <ModelLoader 
              url={modelUrl} 
              autoRotate={autoRotate}
              rotationSpeed={rotationSpeed}
              wireframe={wireframe}
            />
          ) : (
            <RotatingGeometry 
              modelType={modelType} 
              color={color} 
              autoRotate={autoRotate}
              rotationSpeed={rotationSpeed}
              wireframe={wireframe}
            />
          )}
          
          {/* Controles de órbita mejorados */}
          <OrbitControls 
            ref={controlsRef}
            enableZoom={enableZoom}
            enablePan={enablePan}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            enableDamping
            dampingFactor={0.05}
            autoRotate={false}
          />
          <ControlsWithReset controlsRef={controlsRef} ref={ref} />
          
          {/* Ambiente y sombras */}
          <Environment preset={environment} />
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4.5} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
});

Model3D.displayName = 'Model3D';

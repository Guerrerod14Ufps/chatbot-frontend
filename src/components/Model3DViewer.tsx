import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ZoomIn, ZoomOut, Home, 
  Sun, Palette,
  Play, Pause, Settings, Grid3x3
} from 'lucide-react';
import { Model3D } from './Model3D';
import type { Model3DRef } from './Model3D';

interface Model3DViewerProps {
  isOpen: boolean;
  onClose: () => void;
  modelType?: 'box' | 'sphere' | 'torus' | 'cone' | 'cylinder';
  color?: string;
  modelUrl?: string;
  title?: string;
}

type EnvironmentPreset = 'sunset' | 'city' | 'park' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio';

const colorPresets = [
  { name: 'Rojo', value: '#ef4444' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Verde', value: '#10b981' },
  { name: 'Amarillo', value: '#f59e0b' },
  { name: 'Púrpura', value: '#8b5cf6' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Cian', value: '#06b6d4' },
  { name: 'Naranja', value: '#f97316' },
];

const environmentPresets: EnvironmentPreset[] = [
  'sunset', 'city', 'park', 'night', 'warehouse', 'forest', 'apartment', 'studio'
];

export const Model3DViewer: React.FC<Model3DViewerProps> = ({
  isOpen,
  onClose,
  modelType = 'box',
  color = '#6366f1',
  modelUrl,
  title = 'Visor 3D'
}) => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [enableZoom, setEnableZoom] = useState(true);
  const [enablePan] = useState(true);
  const [currentColor, setCurrentColor] = useState(color);
  const [showControls, setShowControls] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [environment, setEnvironment] = useState<EnvironmentPreset>('sunset');
  const [wireframe, setWireframe] = useState(false);
  const [showGrid] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const model3DRef = useRef<Model3DRef>(null);

  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleReset = () => {
    if (model3DRef.current) {
      model3DRef.current.resetCamera();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          ref={viewerRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="absolute inset-4 md:inset-8 lg:inset-16 bg-gray-900 rounded-lg shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gray-800/50 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              {!modelUrl && (
                <div className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                  {modelType}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowControls(!showControls)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Toggle controles"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Cerrar (ESC)"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Área del modelo 3D */}
          <div className="flex-1 relative bg-gray-950">
            <Model3D
              ref={model3DRef}
              modelType={modelType}
              color={currentColor}
              modelUrl={modelUrl}
              autoRotate={autoRotate}
              rotationSpeed={rotationSpeed}
              enableZoom={enableZoom}
              enablePan={enablePan}
              environment={environment}
              wireframe={wireframe}
              showGrid={showGrid}
              className="w-full h-full"
            />
          </div>

          {/* Panel de controles */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="bg-gray-800/90 backdrop-blur-lg border-t border-gray-700 p-4"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {/* Auto Rotate */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                      autoRotate
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-gray-700/50 text-gray-300 border border-gray-600'
                    }`}
                    title="Auto rotación"
                  >
                    {autoRotate ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    <span className="text-xs">Rotación</span>
                  </motion.button>

                  {/* Reset */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-700/50 text-gray-300 border border-gray-600 hover:bg-gray-700 transition-colors"
                    title="Reset cámara"
                  >
                    <Home className="w-5 h-5" />
                    <span className="text-xs">Reset</span>
                  </motion.button>

                  {/* Zoom Toggle */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEnableZoom(!enableZoom)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                      enableZoom
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-gray-700/50 text-gray-300 border border-gray-600'
                    }`}
                    title="Toggle zoom"
                  >
                    {enableZoom ? <ZoomIn className="w-5 h-5" /> : <ZoomOut className="w-5 h-5" />}
                    <span className="text-xs">Zoom</span>
                  </motion.button>

                  {/* Color Picker */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-700/50 text-gray-300 border border-gray-600 hover:bg-gray-700 transition-colors w-full"
                      title="Cambiar color"
                    >
                      <Palette className="w-5 h-5" />
                      <span className="text-xs">Color</span>
                    </motion.button>
                    {showColorPicker && (
                      <div className="absolute bottom-full left-0 mb-2 p-3 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-10">
                        <div className="grid grid-cols-4 gap-2">
                          {colorPresets.map((preset) => (
                            <button
                              key={preset.value}
                              onClick={() => {
                                setCurrentColor(preset.value);
                                setShowColorPicker(false);
                              }}
                              className="w-8 h-8 rounded-full border-2 border-gray-600 hover:border-white transition-colors"
                              style={{ backgroundColor: preset.value }}
                              title={preset.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Environment */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const currentIndex = environmentPresets.indexOf(environment);
                      const nextIndex = (currentIndex + 1) % environmentPresets.length;
                      setEnvironment(environmentPresets[nextIndex]);
                    }}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-700/50 text-gray-300 border border-gray-600 hover:bg-gray-700 transition-colors"
                    title="Cambiar ambiente"
                  >
                    <Sun className="w-5 h-5" />
                    <span className="text-xs">Ambiente</span>
                  </motion.button>

                  {/* Wireframe */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setWireframe(!wireframe)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                      wireframe
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-gray-700/50 text-gray-300 border border-gray-600'
                    }`}
                    title="Toggle wireframe"
                  >
                    <Grid3x3 className="w-5 h-5" />
                    <span className="text-xs">Wireframe</span>
                  </motion.button>
                </div>

                {/* Slider de velocidad */}
                <div className="mt-4">
                  <label className="flex items-center gap-3 text-sm text-gray-300">
                    <span>Velocidad de rotación:</span>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={rotationSpeed}
                      onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-400 w-12">{rotationSpeed.toFixed(1)}x</span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


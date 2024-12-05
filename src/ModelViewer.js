import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { Box3, Vector3 } from 'three';

// Inner component for rendering the 3D model
const ModelMesh = ({ geometry, scale, autoRotate, incorrectGuesses }) => {
  const [rotation, setRotation] = useState([5, 0, 0]); // Initial rotation upwards

  useFrame(() => {
    if (autoRotate && incorrectGuesses.length > 0) {
      setRotation([rotation[0], rotation[1], rotation[2] + 0.001]);
    }
  });

  return (
    <mesh geometry={geometry} scale={[scale, scale, scale]} rotation={rotation}>
      <meshStandardMaterial color="gray" metalness={0.5} roughness={0.5} />
    </mesh>
  );
};

const ModelViewer = ({
  url,
  lightingConfig,
  enableControls,
  autoRotate,
  onManualCameraMove,
  incorrectGuesses,
}) => {
  const [geometry, setGeometry] = useState(null);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const loader = new STLLoader();
    loader.load(
      url,
      (loadedGeometry) => {
        loadedGeometry.center();

        const boundingBox = new Box3().setFromBufferAttribute(loadedGeometry.attributes.position);
        const size = new Vector3();
        boundingBox.getSize(size);

        const maxDimension = Math.max(size.x, size.y, size.z);
        const scaleFactor = 90 / maxDimension;

        setGeometry(loadedGeometry);
        setScale(scaleFactor);
        setError(null);
      },
      undefined,
      (err) => {
        setError(err.message || 'Error loading STL file');
      }
    );
  }, [url]);

  if (error) {
    return <p>Error loading 3D model: {error}</p>;
  }

  return (
    <Canvas style={{ height: '400px', width: '90%' }} camera={{ position: [0, 0, 100], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={lightingConfig?.directionalLight1 || 1}
      />
      <directionalLight
        position={[-10, -10, -10]}
        intensity={lightingConfig?.directionalLight2 || 0.5}
      />
      {enableControls && (
        <OrbitControls
          onStart={() => onManualCameraMove()}
          enableZoom={true}
          enablePan={true}
        />
      )}
      {geometry && (
        <ModelMesh
          geometry={geometry}
          scale={scale}
          autoRotate={autoRotate}
          incorrectGuesses={incorrectGuesses}
        />
      )}
    </Canvas>
  );
};

// Set default props to prevent runtime errors
ModelViewer.defaultProps = {
  lightingConfig: {
    directionalLight1: 1,
    directionalLight2: 0.5,
  },
  enableControls: true,
  autoRotate: false,
  onManualCameraMove: () => {},
  incorrectGuesses: [],
};

export default ModelViewer;

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'

function Rig({ children }) {
  const g = useRef()
  useFrame(({ pointer }) => {
    g.current.rotation.y += (pointer.x * 0.45 - g.current.rotation.y) * 0.05
    g.current.rotation.x += (-pointer.y * 0.25 - g.current.rotation.x) * 0.05
  })
  return <group ref={g}>{children}</group>
}
function Card({ position, color, size = [1.3, 0.9, 0.08], speed = 1 }) {
  return (
    <Float speed={speed} floatIntensity={0.6} rotationIntensity={0.3}>
      <RoundedBox args={size} radius={0.08} position={position}>
        <meshPhysicalMaterial color={color} roughness={0.25} metalness={0.1} transparent opacity={0.92} clearcoat={1} />
      </RoundedBox>
    </Float>
  )
}
function Core() {
  const m = useRef()
  useFrame((_, d) => { m.current.rotation.y += d * 0.5; m.current.rotation.x += d * 0.2 })
  return (
    <mesh ref={m}>
      <icosahedronGeometry args={[0.65, 1]} />
      <meshPhysicalMaterial color="#7c6cff" emissive="#4b3fd6" emissiveIntensity={0.6} roughness={0.15} metalness={0.4} />
    </mesh>
  )
}
export default function Scene3D() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 40 }} aria-hidden="true">
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 5]} intensity={40} color="#9db4ff" />
      <pointLight position={[-4, -2, 3]} intensity={25} color="#b78cff" />
      <Rig>
        <Card position={[-2.4, 0, 0]} color="#2a2d44" size={[1.5, 1.1, 0.08]} />
        <Core />
        <Card position={[2.3, 1.1, 0]} color="#3b5bdb" speed={1.4} />
        <Card position={[2.6, 0, 0.3]} color="#7c3aed" speed={1.1} />
        <Card position={[2.3, -1.1, 0]} color="#22a78a" speed={1.6} />
      </Rig>
    </Canvas>
  )
}

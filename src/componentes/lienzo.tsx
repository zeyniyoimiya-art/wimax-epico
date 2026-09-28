import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { prefiereMenosMovimiento } from '../lib/plataforma'

/* ═══════════ SHADERS (GLSL escrito a mano) ═══════════ */

const VERTICE_TERRENO = /* glsl */ `
  uniform float uTiempo;
  varying vec2 vUv;
  varying float vAltura;

  void main() {
    vUv = uv;
    vec3 posicion = position;
    float distancia = length(posicion.xy);
    // ondas concéntricas que viajan desde la torre
    float onda = sin(distancia * 1.6 - uTiempo * 2.2) * 0.26;
    float atenuacion = exp(-distancia * 0.075);
    vAltura = onda * atenuacion;
    posicion.z += vAltura;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(posicion, 1.0);
  }
`

const FRAGMENTO_TERRENO = /* glsl */ `
  uniform float uTiempo;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;
  varying float vAltura;

  void main() {
    // rejilla técnica
    vec2 celda = abs(fract(vUv * 60.0) - 0.5) / fwidth(vUv * 60.0);
    float linea = 1.0 - min(min(celda.x, celda.y), 1.0);

    float brillo = smoothstep(-0.25, 0.35, vAltura);
    vec3 color = mix(uColorA, uColorB, brillo);
    color += linea * 0.22 * (0.5 + brillo);
    color += vAltura * 0.35;

    // se desvanece en los bordes
    float borde = 1.0 - smoothstep(0.14, 0.4, distance(vUv, vec2(0.5)));
    float brilloPulso = 0.85 + 0.15 * sin(uTiempo * 1.7);
    gl_FragColor = vec4(color * brilloPulso, borde * 0.9);
  }
`

/* ═══════════ PIEZAS DE LA ESCENA ═══════════ */

function Terreno() {
  const material = useRef<THREE.ShaderMaterial>(null)
  const uniformes = useMemo(
    () => ({
      uTiempo: { value: 0 },
      uColorA: { value: new THREE.Color('#05070d') },
      uColorB: { value: new THREE.Color('#35e6ff') }
    }),
    []
  )
  useFrame((_, delta) => {
    if (material.current) material.current.uniforms.uTiempo.value += delta
  })
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]}>
      <planeGeometry args={[46, 46, 140, 140]} />
      <shaderMaterial
        ref={material}
        vertexShader={VERTICE_TERRENO}
        fragmentShader={FRAGMENTO_TERRENO}
        uniforms={uniformes}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function Anillos({ color = '#35e6ff', retraso = 0 }: { color?: string; retraso?: number }) {
  const grupo = useRef<THREE.Group>(null)
  const anillos = useMemo(() => [0, 1, 2, 3], [])
  useFrame(({ clock }) => {
    if (!grupo.current) return
    const t = clock.getElapsedTime() + retraso
    grupo.current.children.forEach((hijo, i) => {
      const fase = (t * 0.55 + i * 0.25) % 1
      const escala = 0.5 + fase * 9
      hijo.scale.setScalar(escala)
      const material = (hijo as THREE.Mesh).material as THREE.MeshBasicMaterial
      material.opacity = Math.max(0, 0.5 * (1 - fase) * (1 - fase))
    })
  })
  return (
    <group ref={grupo} position={[0, -1.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {anillos.map((i) => (
        <mesh key={i}>
          <ringGeometry args={[0.9, 1, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  )
}

function Torre() {
  const baliza = useRef<THREE.Mesh>(null)
  const luz = useRef<THREE.PointLight>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulso = 0.5 + 0.5 * Math.sin(t * 2.4)
    if (baliza.current) {
      const material = baliza.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.35 + pulso * 0.65
      baliza.current.scale.setScalar(0.8 + pulso * 0.6)
    }
    if (luz.current) luz.current.intensity = 3 + pulso * 9
  })
  return (
    <group position={[0, -1.3, 0]}>
      {/* base */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.62, 0.95, 0.3, 24]} />
        <meshStandardMaterial color="#122032" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* mástil */}
      <mesh position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.055, 0.13, 4.5, 16]} />
        <meshStandardMaterial color="#2f5674" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* plataformas de antenas */}
      {[2.3, 3.4, 4.3].map((y, i) => (
        <group key={y} position={[0, y, 0]} rotation={[0, (i * Math.PI) / 3, 0]}>
          <mesh>
            <boxGeometry args={[1.7, 0.07, 0.07]} />
            <meshStandardMaterial color="#24425c" metalness={0.8} roughness={0.4} />
          </mesh>
          {[-0.85, 0.85].map((x) => (
            <mesh key={x} position={[x, 0.2, 0]}>
              <boxGeometry args={[0.16, 0.42, 0.1]} />
              <meshStandardMaterial color="#7ff2ff" emissive="#35e6ff" emissiveIntensity={0.7} metalness={0.6} roughness={0.3} />
            </mesh>
          ))}
        </group>
      ))}
      {/* baliza superior */}
      <mesh ref={baliza} position={[0, 4.72, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial color="#ff4d6d" transparent opacity={0.9} />
      </mesh>
      <pointLight ref={luz} position={[0, 4.7, 0]} color="#ff4d6d" intensity={6} distance={9} />
    </group>
  )
}
function Particulas({ cantidad = 700 }: { cantidad?: number }) {
  const puntos = useRef<THREE.Points>(null)
  const geometria = useMemo(() => {
    const posiciones = new Float32Array(cantidad * 3)
    const colores = new Float32Array(cantidad * 3)
    const paleta = [new THREE.Color('#35e6ff'), new THREE.Color('#7c5cff'), new THREE.Color('#ffffff')]
    for (let i = 0; i < cantidad; i++) {
      const radio = 3 + Math.random() * 13
      const angulo = Math.random() * Math.PI * 2
      posiciones[i * 3] = Math.cos(angulo) * radio
      posiciones[i * 3 + 1] = Math.random() * 9 - 1.4
      posiciones[i * 3 + 2] = Math.sin(angulo) * radio
      const color = paleta[i % paleta.length]
      colores[i * 3] = color.r
      colores[i * 3 + 1] = color.g
      colores[i * 3 + 2] = color.b
    }
    return { posiciones, colores }
  }, [cantidad])

  useFrame(({ clock }) => {
    if (!puntos.current) return
    const t = clock.getElapsedTime()
    puntos.current.rotation.y = t * 0.045
    puntos.current.position.y = Math.sin(t * 0.4) * 0.12
  })

  return (
    <points ref={puntos}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geometria.posiciones, 3]} />
        <bufferAttribute attach="attributes-color" args={[geometria.colores, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function Camara({ centrado = false }: { centrado?: boolean }) {
  useFrame(({ camera, clock, pointer }) => {
    const t = clock.getElapsedTime()
    // En escritorio la escena vive a la derecha (el texto respira a la izquierda);
    // en móvil, donde el encuadre es estrecho, se centra.
    const foco = centrado ? 4.6 : 2.6
    const desplazamiento = centrado ? 0 : 0.4
    camera.position.x = (centrado ? 4.6 : 1.35) + Math.sin(t * 0.12) * desplazamiento + pointer.x * (centrado ? 0.3 : 0.55)
    camera.position.y = 3.45 + Math.sin(t * 0.19) * 0.2 + pointer.y * 0.5
    camera.position.z = 11.4 + Math.sin(t * 0.09) * 0.28
    camera.lookAt(foco, 0.85, 0)
  })
  return null
}

function Escena({ densidad, compacto }: { densidad: number; compacto: boolean }) {
  return (
    <>
      <fog attach="fog" args={['#05070d', 13, 36]} />
      <ambientLight intensity={0.5} color="#a5c8ff" />
      <directionalLight position={[6, 9, 4]} intensity={1.15} color="#7ff2ff" />
      <pointLight position={[-6, 3, -5]} intensity={20} color="#7c5cff" distance={28} />
      <group position={[4.6, 0, 0]}>
        <Torre />
        <Anillos color="#35e6ff" />
        <Anillos color="#7c5cff" retraso={1.5} />
        <Terreno />
        <Particulas cantidad={densidad} />
      </group>
      <Camara centrado={compacto} />
    </>
  )
}

function soportaWebGL(): boolean {
  try {
    const prueba = document.createElement('canvas')
    return Boolean(prueba.getContext('webgl2') ?? prueba.getContext('webgl'))
  } catch {
    return false
  }
}

export default function Lienzo({ compacto = false, className = '' }: { compacto?: boolean; className?: string }) {
  const reducido = prefiereMenosMovimiento()
  const nucleos = typeof navigator === 'undefined' ? 4 : (navigator.hardwareConcurrency ?? 4)
  const densidad = nucleos <= 4 ? 300 : 820
  const tieneWebGL = useMemo(() => soportaWebGL(), [])

  if (!tieneWebGL) {
    return (
      <div
        className={'lienzo lienzo-respaldo ' + className}
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(60% 55% at 50% 42%, rgba(53,230,255,.28), transparent 70%), radial-gradient(45% 40% at 70% 70%, rgba(124,92,255,.3), transparent 72%)'
        }}
      />
    )
  }

  return (
    <div className={'lienzo ' + className} aria-hidden="true">
      <Canvas
        camera={{ position: [1.35, 3.45, 11.4], fov: compacto ? 40 : 34, near: 0.1, far: 90 }}
        dpr={[1, compacto ? 1.35 : 1.9]}
        frameloop={reducido ? 'demand' : 'always'}
        gl={{ antialias: !compacto, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Escena densidad={densidad} compacto={compacto} />
        </Suspense>
      </Canvas>
    </div>
  )
}


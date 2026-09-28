// Construye a mano un modulo WebAssembly (sin Rust ni emscripten).
// Exporta: fresnel(d1, d2, f) -> zona de Fresnel [m]
//          atenuacion(pr, dist, alpha) -> potencia recibida
//          simular(iteraciones) -> benchmark (suma de raices)
import fs from "node:fs"
import path from "node:path"

const u32 = (n) => { const b = []; let v = n >>> 0; do { let x = v & 0x7f; v >>>= 7; if (v) x |= 0x80; b.push(x) } while (v); return b }
const f64 = (x) => { const buf = Buffer.alloc(8); buf.writeDoubleLE(x); return [...buf] }
const vec = (items) => [...u32(items.length), ...items.flat()]
const entry = (bytes) => [...u32(bytes.length), ...bytes]
const sec = (id, payload) => [id, ...u32(payload.length), ...payload]
const nom = (s) => { const b = [...Buffer.from(s, "utf8")]; return [...u32(b.length), ...b] }
const cuerpo = (locales, codigo) => [...u32(locales.length), ...locales.flat(), ...codigo, 0x0b]

const tipoA = [0x60, 3, 0x7c, 0x7c, 0x7c, 1, 0x7c]
const tipoB = [0x60, 1, 0x7f, 1, 0x7c]

const fresnel = cuerpo([], [0x20, 0x00, 0x20, 0x01, 0xa2, 0x44, ...f64(299792458), 0xa2, 0x20, 0x00, 0x20, 0x01, 0xa0, 0x20, 0x02, 0xa2, 0xa3, 0x9f])
const atenuacion = cuerpo([], [0x20, 0x00, 0x44, ...f64(1), 0x20, 0x02, 0x20, 0x01, 0xa2, 0x20, 0x01, 0xa2, 0xa0, 0xa3])
const simular = cuerpo([[1, 0x7f], [1, 0x7c]], [0x41, 0x00, 0x21, 0x01, 0x44, ...f64(0), 0x21, 0x02, 0x02, 0x40, 0x03, 0x40, 0x20, 0x01, 0x20, 0x00, 0x4e, 0x0d, 0x01, 0x20, 0x02, 0x20, 0x01, 0xb7, 0x9f, 0xa0, 0x21, 0x02, 0x20, 0x01, 0x41, 0x01, 0x6a, 0x21, 0x01, 0x0c, 0x00, 0x0b, 0x0b, 0x20, 0x02])

const modulo = [0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, ...sec(1, vec([tipoA, tipoB])), ...sec(3, vec([[0], [0], [1]])), ...sec(7, vec([[...nom("fresnel"), 0x00, 0x00], [...nom("atenuacion"), 0x00, 0x01], [...nom("simular"), 0x00, 0x02]])), ...sec(10, vec([entry(fresnel), entry(atenuacion), entry(simular)]))]

const bytes = Uint8Array.from(modulo)
const b64 = Buffer.from(bytes).toString("base64")
const destino = path.join(process.cwd(), "src", "lib", "wasm-base64.ts")
fs.mkdirSync(path.dirname(destino), { recursive: true })
fs.writeFileSync(destino, "// ARCHIVO GENERADO por scripts/construir_wasm.mjs - no editar a mano\n// Modulo WebAssembly minimo escrito byte a byte (sin Rust): fresnel / atenuacion / simular\nexport const WASM_BASE64 =\n  \x27" + b64 + "\x27\n")

const { instance } = await WebAssembly.instantiate(bytes, {})
const w = instance.exports
const ref = (d1, d2, f) => Math.sqrt((299792458 * d1 * d2) / ((d1 + d2) * f))
console.log("modulo wasm: " + bytes.length + " bytes | base64 " + b64.length + " chars")
console.log("exports: " + Object.keys(w).join(", "))
console.log("fresnel(10,10,2.5e9) -> wasm=" + w.fresnel(10, 10, 2.5e9).toFixed(6) + "  js=" + ref(10, 10, 2.5e9).toFixed(6))
console.log("atenuacion(100,1,0.05) -> wasm=" + w.atenuacion(100, 1, 0.05).toFixed(6) + "  js=" + (100 / (1 + 0.05)).toFixed(6))
const t0 = performance.now(); const s = w.simular(2000000); const t1 = performance.now()
let js2 = 0; for (let i = 0; i < 2000000; i++) js2 += Math.sqrt(i)
const t2 = performance.now()
console.log("simular(2e6) -> wasm=" + s.toFixed(2) + " en " + (t1 - t0).toFixed(1) + " ms | js=" + js2.toFixed(2) + " en " + (t2 - t1).toFixed(1) + " ms")
console.log("wasm es " + ((t2 - t1) / Math.max(t1 - t0, 0.001)).toFixed(2) + "x mas rapido")

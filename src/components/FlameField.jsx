import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/gsap.js";

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

// Slow drifting smoke lit from below by a crimson glow, with a few rising sparks.
// The pointer adds a soft pool of heat where it rests.
const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uIntensity;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.05;

  // Domain-warped fbm gives the smoke its curling shape.
  vec2 q = vec2(fbm(p * 1.3 + vec2(0.0, -t * 2.0)),
                fbm(p * 1.3 + vec2(5.2, 1.3 - t * 2.0)));
  float smoke = fbm(p * 1.7 + q * 1.8 + vec2(t * 0.6, -t * 3.0));

  float base = smoothstep(1.05, -0.15, uv.y);
  vec2 m = (uMouse - 0.5 * uRes) / uRes.y;
  float heatFromPointer = exp(-pow(length(p - m), 2.0) * 5.0) * 0.45;

  vec3 ink = vec3(0.039, 0.035, 0.031);
  vec3 ash = vec3(0.15, 0.12, 0.11);
  vec3 crimson = vec3(0.60, 0.09, 0.08);
  vec3 ember = vec3(0.96, 0.42, 0.17);

  vec3 col = ink;
  col = mix(col, ash, smoothstep(0.4, 0.95, smoke) * 0.5);

  float heat = (base + heatFromPointer) * smoothstep(0.28, 0.9, smoke + base * 0.25);
  col += crimson * heat * 0.6 * uIntensity;
  col += ember * pow(heat, 3.0) * 0.4 * uIntensity;

  // Sparks: one candidate per grid cell, drifting upward.
  vec2 g = p * 9.0;
  g.y -= uTime * 0.55;
  g.x += sin(g.y * 0.6 + uTime * 0.4) * 0.35;
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  float h = hash(id);
  if (h > 0.86) {
    vec2 o = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
    float d = length(f - o * 0.7);
    float flicker = 0.6 + 0.4 * sin(uTime * 3.0 + h * 40.0);
    col += ember * smoothstep(0.055, 0.0, d) * (h - 0.86) * 7.0 * base * flicker * uIntensity;
  }

  float vignette = smoothstep(1.35, 0.25, length(p * vec2(0.85, 1.0)));
  col *= mix(0.55, 1.0, vignette);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Full-bleed WebGL background. The wrapper carries a CSS gradient, so the
 * section still looks right when WebGL is unavailable.
 */
export default function FlameField({ intensity = 1, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) {
      canvas.hidden = true;
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vs || !fs) {
      canvas.hidden = true;
      return;
    }
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // One triangle that covers the whole viewport.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uIntensity = gl.getUniformLocation(program, "uIntensity");
    gl.uniform1f(uIntensity, intensity);

    const reduce = prefersReducedMotion();
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let dpr = 1;
    let frame = 0;
    let visible = true;
    const start = performance.now();
    // A fixed start offset so the first frame already shows developed smoke.
    const timeOffset = 40;

    const render = (now) => {
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      gl.uniform1f(uTime, timeOffset + (now - start) / 1000);
      gl.uniform2f(uMouse, pointer.x * dpr, pointer.y * dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now) => {
      if (visible) render(now);
      frame = requestAnimationFrame(loop);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      if (!pointer.tx && !pointer.ty) {
        pointer.x = pointer.tx = width * 0.7;
        pointer.y = pointer.ty = height * 0.25;
      }
      if (reduce) render(start);
    };

    const onPointer = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - r.left;
      pointer.ty = r.height - (e.clientY - r.top); // GL's y axis points up
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    resize();
    if (!reduce) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, [intensity]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_70%_at_50%_110%,rgb(180_35_42/0.35),transparent_60%)] ${className}`}
    >
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  );
}

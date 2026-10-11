"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

type Spot = "tl" | "tr" | "bl" | "br";

// What Pip says for each part of the page, and which screen corners he may perch in there.
// `spots` are corners that are empty in that section. Edit freely: tl = top-left, tr = top-right, bl, br.
const CHAPTERS: { id: string; t: string; d: string; tip: string; spots: Spot[] }[] = [
  { id: "top", t: "Aryan Sagar", d: "AI engineer, software engineer, filmmaker.", tip: "Move your mouse over the big letters. They like attention.", spots: ["tr"] },
  { id: "do", t: "What I do", d: "Build, think, create, explore.", tip: "Drag the cube to spin it, or pick a face below.", spots: ["tl", "tr"] },
  { id: "build", t: "What I build", d: "Intelligent systems, software and products.", tip: "Hover a row to light it up.", spots: ["tr", "bl", "br"] },
  { id: "work", t: "Selected work", d: "Projects, one at a time.", tip: "Click a project to open its case study.", spots: ["tr", "bl", "br"] },
  { id: "film", t: "Filmmaking", d: "Engineer by profession, filmmaker whenever I can.", tip: "Keep scrolling. The film strip moves sideways.", spots: ["bl", "br"] },
  { id: "side", t: "Side quests", d: "Things I'm learning because I find them interesting.", tip: "Scroll slowly. Each interest gets its own scene.", spots: ["tl", "tr"] },
  { id: "watch", t: "Watch", d: "The films, worlds and stories I keep coming back to.", tip: "Drag the posters, or click one to open it.", spots: ["tr", "bl", "br"] },
  { id: "about", t: "About", d: "Who is behind this.", tip: "Psst, he signs his name in cursive.", spots: ["tr", "bl"] },
  { id: "contact", t: "Contact", d: "Have something interesting in mind?", tip: "Click the orange circle to say hello.", spots: ["tl", "tr"] },
];
const QUIPS = ["Boop!", "Hi again!", "Keep scrolling, there is more.", "I only know this page, but I know it well.", "Careful, I bounce."];

const SIZE = 112;
const MARGIN = 14;

const spotXY = (s: Spot) => {
  const W = document.documentElement.clientWidth, H = window.innerHeight;
  return { x: s[1] === "l" ? MARGIN : W - SIZE - MARGIN, y: s[0] === "t" ? MARGIN : H - SIZE - MARGIN };
};

// Pip: a small original 3D guide. He hops to a new corner as you move through the page,
// says what the section is about, then shrinks back so he stays out of the way.
export default function Pip() {
  const wrap = useRef<HTMLDivElement>(null);
  const bub = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(max-width: 1100px)").matches) return; // hidden on small screens, so don't draw it
    const host = wrap.current!, bubble = bub.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // no WebGL: skip the guide quietly
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(SIZE, SIZE);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    cam.position.set(0, 0.45, 7.4);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x4a3a2a, 1.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(2.5, 4, 5); scene.add(key);
    const rim = new THREE.PointLight(0xffa94d, 30, 16); rim.position.set(-3, 1.5, -2); scene.add(rim);

    const mat = (c: number, r = 0.55) => new THREE.MeshStandardMaterial({ color: c, roughness: r });
    const cream = mat(0xf2efe8), white = mat(0xffffff, 0.2), dark = mat(0x151412, 0.25), orange = mat(0xffa94d);
    const glow = new THREE.MeshStandardMaterial({ color: 0xffa94d, emissive: 0xffa94d, emissiveIntensity: 0.6, roughness: 0.3 });

    const pip = new THREE.Group();
    scene.add(pip);
    const add = (g: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = pip) => {
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(x, y, z);
      parent.add(mesh);
      return mesh;
    };

    const body = add(new THREE.SphereGeometry(1, 40, 40), cream, 0, 0, 0);
    body.scale.set(1, 1.1, 0.94);
    const eyes: THREE.Mesh[] = [], pupils: THREE.Mesh[] = [];
    ([-1, 1] as const).forEach((s) => {
      const e = add(new THREE.SphereGeometry(0.3, 28, 28), white, s * 0.4, 0.3, 0.78); e.scale.set(1, 1.1, 0.6); eyes.push(e);
      const p = add(new THREE.SphereGeometry(0.15, 20, 20), dark, s * 0.4, 0.3, 0.93); p.scale.set(1, 1, 0.5); pupils.push(p);
      add(new THREE.SphereGeometry(0.05, 10, 10), white, s * 0.4 + 0.05, 0.38, 1.0);
      const ch = add(new THREE.SphereGeometry(0.17, 16, 16), orange, s * 0.66, -0.1, 0.72); ch.scale.set(1, 0.6, 0.35);
      const foot = add(new THREE.SphereGeometry(0.28, 20, 20), cream, s * 0.4, -1.1, 0.15); foot.scale.set(1, 0.6, 1.25);
    });
    const mouth = add(new THREE.TorusGeometry(0.13, 0.03, 8, 20, Math.PI), dark, 0, -0.22, 0.92);
    mouth.rotation.z = Math.PI;

    const ant = new THREE.Group();
    ant.position.set(0, 1.02, 0);
    pip.add(ant);
    add(new THREE.CylinderGeometry(0.035, 0.05, 0.55, 10), dark, 0, 0.27, 0, ant);
    add(new THREE.SphereGeometry(0.15, 20, 20), glow, 0, 0.62, 0, ant);

    const arms = ([-1, 1] as const).map((s) => {
      const g = new THREE.Group();
      g.position.set(s * 0.92, -0.1, 0.05);
      pip.add(g);
      const a = add(new THREE.CapsuleGeometry(0.12, 0.28, 6, 12), cream, s * 0.14, -0.14, 0, g);
      a.rotation.z = s * 0.55;
      add(new THREE.SphereGeometry(0.15, 16, 16), cream, s * 0.28, -0.3, 0, g);
      return { g, s };
    });

    // ---- behaviour
    const state = { mx: 0, my: 0, hover: false, talk: 0 };
    const hop = { y: 0, sq: 0, lean: 0 };
    const doHop = () => {
      if (reduce) return;
      gsap.timeline()
        .to(hop, { sq: -0.18, duration: 0.12 })
        .to(hop, { y: 0.7, sq: 0.12, duration: 0.28, ease: "power2.out" })
        .to(hop, { y: 0, sq: -0.15, duration: 0.26, ease: "power2.in" })
        .to(hop, { sq: 0, duration: 0.35, ease: "elastic.out(1,.4)" });
    };

    // Where Pip is on screen, and how he gets to a new corner
    let spot: Spot = "tr";
    const pos = spotXY(spot);
    gsap.set(host, { x: pos.x, y: pos.y });
    const fly = { p: 0 };
    let flight: gsap.core.Animation | undefined;

    const wake = () => { gsap.to(host, { scale: 1, opacity: 1, duration: 0.3, overwrite: "auto" }); };
    const rest = () => { gsap.to(host, { scale: 0.72, opacity: 0.7, duration: 0.6, ease: "power2.out", overwrite: "auto" }); };

    const moveTo = (name: Spot, done?: () => void) => {
      flight?.kill();
      gsap.killTweensOf(hop);
      if (name === spot) {
        doHop();
        flight = gsap.delayedCall(0.45, () => done?.());
        return;
      }
      spot = name;
      const to = spotXY(name);
      if (reduce) { pos.x = to.x; pos.y = to.y; gsap.set(host, { x: to.x, y: to.y }); done?.(); return; }
      const from = { x: pos.x, y: pos.y };
      const dist = Math.hypot(to.x - from.x, to.y - from.y);
      const arc = Math.min(220, dist * 0.22);
      const dur = 0.55 + Math.min(0.6, dist / 2200);
      fly.p = 0;
      const tl = gsap.timeline();
      tl.to(hop, { sq: -0.2, duration: 0.14 })
        .addLabel("go")
        .to(fly, {
          p: 1, duration: dur, ease: "power2.inOut",
          onUpdate: () => {
            const p = fly.p;
            pos.x = from.x + (to.x - from.x) * p;
            pos.y = from.y + (to.y - from.y) * p - Math.sin(Math.PI * p) * arc;
            gsap.set(host, { x: pos.x, y: pos.y });
            hop.lean = Math.sin(Math.PI * p) * Math.sign(to.x - from.x || 1) * -0.45;
          },
        }, "go")
        .to(hop, { sq: 0.12, duration: 0.2, ease: "power2.out" }, "go")
        .to(hop, { sq: -0.18, duration: 0.12, ease: "power2.in" }, `go+=${dur - 0.12}`)
        .call(() => { hop.lean = 0; done?.(); }, [], `go+=${dur}`)
        .to(hop, { sq: 0, duration: 0.5, ease: "elastic.out(1,.4)" }, `go+=${dur}`);
      flight = tl;
    };

    // The speech bubble: always on the side of Pip that has room
    const q = (c: string) => bubble.querySelector<HTMLElement>(c)!;
    const [bt, bd, bp] = [q(".pt"), q(".pd"), q(".ptip")];
    let timer: ReturnType<typeof setTimeout> | undefined;
    const placeBubble = () => {
      const w = bubble.offsetWidth, h = bubble.offsetHeight;
      const W = document.documentElement.clientWidth, H = window.innerHeight;
      const onLeft = pos.x < W / 2, onTop = pos.y < H / 2;
      const x = onLeft ? pos.x + SIZE - 10 : pos.x - w + 10;
      const y = onTop ? Math.max(pos.y + 20, 78) : pos.y + SIZE - h - 20; // top spots stay under the nav pill
      bubble.style.left = Math.max(8, Math.min(x, W - w - 8)) + "px";
      bubble.style.top = Math.max(8, Math.min(y, H - h - 8)) + "px";
      bubble.dataset.side = onLeft ? "r" : "l";
    };
    const hideLater = (ms: number) => {
      clearTimeout(timer);
      timer = setTimeout(() => { bubble.classList.remove("show"); rest(); }, ms);
    };
    const say = (t: string, d: string, tip = "", ms = 6500) => {
      bt.textContent = t; bd.textContent = d; bp.textContent = tip;
      bp.style.display = tip ? "block" : "none";
      wake();
      placeBubble();
      bubble.classList.add("show");
      state.talk = 1;
      hideLater(ms);
    };

    let cur = 0, ready = false, quip = 0;
    let pend: ReturnType<typeof setTimeout> | undefined;
    const pick = (idx: number): Spot => {
      const all = CHAPTERS[idx].spots;
      const others = all.filter((s) => s !== spot);
      const pool = others.length ? others : all;
      return pool[Math.floor(Math.random() * pool.length)];
    };
    const arrive = (idx: number) => {
      clearTimeout(timer);
      bubble.classList.remove("show");
      wake();
      moveTo(pick(idx), () => say(CHAPTERS[idx].t, CHAPTERS[idx].d));
    };

    const seen = (() => { try { return sessionStorage.getItem("aryan-intro") === "1"; } catch { return false; } })();
    const delay = seen ? 0.6 : 5.4;
    gsap.fromTo(host, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: "elastic.out(1,.5)", delay, transformOrigin: "50% 50%" });
    const startCall = gsap.delayedCall(delay + 0.5, () => {
      ready = true;
      if (cur) { arrive(cur); return; }
      doHop();
      say("Hi, I'm Pip", "I'll hop around and tell you where you are.", "Click me for a tip.");
    });

    const update = () => {
      let idx = 0;
      CHAPTERS.forEach((c, i) => {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) idx = i;
      });
      if (idx === cur) return;
      cur = idx;
      if (!ready) return;
      clearTimeout(pend);
      pend = setTimeout(() => arrive(idx), 300); // wait until the scroll settles
    };
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: update });

    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      state.mx = gsap.utils.clamp(-1, 1, (e.clientX - cx) / 420);
      state.my = gsap.utils.clamp(-1, 1, -(e.clientY - cy) / 320);
    };
    window.addEventListener("mousemove", onMove);
    const onEnter = () => { state.hover = true; if (ready) say(CHAPTERS[cur].t, CHAPTERS[cur].d, CHAPTERS[cur].tip); };
    const onLeave = () => { state.hover = false; hideLater(1800); };
    const onClick = () => {
      doHop();
      quip = (quip + 1) % 3;
      if (quip === 0) say(QUIPS[Math.floor(Math.random() * QUIPS.length)], "", CHAPTERS[cur].tip, 5000);
      else say(CHAPTERS[cur].t, CHAPTERS[cur].d, CHAPTERS[cur].tip);
    };
    const onResize = () => {
      if (flight && flight.isActive()) return;
      const p = spotXY(spot);
      pos.x = p.x; pos.y = p.y;
      gsap.set(host, { x: p.x, y: p.y });
    };
    host.addEventListener("mouseenter", onEnter);
    host.addEventListener("mouseleave", onLeave);
    host.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    const tick = () => {
      if (document.hidden) return;
      const t = clock.getElapsedTime();
      const m = reduce ? 0 : 1;
      pip.position.y = Math.sin(t * 2) * 0.04 * m + hop.y;
      pip.scale.set(1 - hop.sq * 0.5, 1 + hop.sq, 1 - hop.sq * 0.5);
      pip.rotation.y += (state.mx * 0.5 - pip.rotation.y) * 0.1;
      pip.rotation.x += (-state.my * 0.28 - pip.rotation.x) * 0.1;
      pip.rotation.z += (hop.lean - pip.rotation.z) * 0.2;
      pupils.forEach((p, i) => {
        p.position.x = (i ? 0.4 : -0.4) + state.mx * 0.08;
        p.position.y = 0.3 + state.my * 0.07;
      });
      const bl = t % 3.4 < 0.12 ? 0.1 : 1;
      eyes.forEach((e) => (e.scale.y = 1.1 * bl));
      pupils.forEach((p) => (p.scale.y = bl));
      ant.rotation.z = Math.sin(t * 2.4) * 0.12 * m - state.mx * 0.15;
      state.talk *= 0.97;
      glow.emissiveIntensity = 0.5 + 0.25 * Math.sin(t * 3) + state.talk * 1.1;
      arms.forEach(({ g, s }) => {
        const target = state.hover && s > 0 ? -0.9 + Math.sin(t * 10) * 0.5 : 0;
        g.rotation.z += (s * target * -1 - g.rotation.z) * 0.15;
      });
      renderer.render(scene, cam);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      startCall.kill();
      flight?.kill();
      gsap.killTweensOf([host, hop, fly]);
      clearTimeout(timer);
      clearTimeout(pend);
      st.kill();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      host.removeEventListener("mouseenter", onEnter);
      host.removeEventListener("mouseleave", onLeave);
      host.removeEventListener("click", onClick);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <>
      <div ref={wrap} className="pip" data-cursor="Say hi" aria-hidden="true" />
      <div ref={bub} className="pipbubble" aria-live="polite">
        <strong className="pt" />
        <span className="pd" />
        <em className="ptip" />
      </div>
    </>
  );
}
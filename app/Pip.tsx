"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

type Spot = "tl" | "tr" | "bl" | "br";

// What Pip says for each part of the page, and which screen corners he may perch in there.
// `spots` are corners that are empty in that section. Edit freely: tl = top-left, tr = top-right, bl, br.
// Keep this list in the same order as the sections appear on the page.
const CHAPTERS: { id: string; t: string; d: string; tip: string; spots: Spot[] }[] = [
  { id: "top", t: "That's Aryan. I'm the unpaid tour guide.", d: "AI engineer by trade, software engineer by practice, filmmaker by obsession. Apparently, one personality wasn't enough.", tip: "Go on, hover over the giant letters. They didn't get this big to be ignored.", spots: ["tr"] },
  { id: "do", t: "One brain. Several open tabs.", d: "Engineering, filmmaking, ideas, and an unreasonable number of things he wants to learn. Sleep is somewhere on the roadmap.", tip: "Drag the cube. Four sides, zero idea what he's doing with his life.", spots: ["tl", "tr"] },
  { id: "build", t: "Less buzzword bingo. More building.", d: "AI systems, backend infrastructure, and products that do more than look impressive in a demo.", tip: "Hover over a skill. The engineer made the interface hover over things too. Very on-brand.", spots: ["tr", "bl", "br"] },
  { id: "work", t: "Proof that he actually builds things.", d: "Five projects, real engineering decisions, and the occasional bug that builds character. Click a case study to see what's under the hood.", tip: "Scroll, or use the tabs up top. Every project opens into a full write-up. Go on, investigate.", spots: ["tr", "bl", "br"] },
  { id: "beyond", t: "The part where he gets philosophical.", d: "Anyone can follow a spec. The harder question is what deserves to exist in the first place.", tip: "Scroll slowly. The words are timed. He is very proud of that.", spots: ["tr", "br"] },
  { id: "film", t: "From debugging to directing.", d: "iPhone footage, DaVinci timelines, cinematic ambitions. Turns out, not every frame needs a stack trace.", tip: "Swipe sideways. Cinema has always been dramatic about its entrances.", spots: ["bl", "br"] },
  { id: "side", t: "Curiosity has terrible time management.", d: "Philosophy, history, travel, chess, and books. No certificates, no productivity hack. Just learning things because they're interesting.", tip: "Take your time. Unlike his browser, this section has no 47 open tabs.", spots: ["tl", "tr"] },
  { id: "watch", t: "Strong opinions. Questionable sleep schedule.", d: "Films and anime worth revisiting. Nolan-level mind games optional; excellent storytelling mandatory.", tip: "Drag a poster or open one. My film criticism is free. The director's cut is extra.", spots: ["tr", "bl", "br"] },
  { id: "about", t: "Plot twist: he's a person.", d: "A little about the human behind the projects, the curiosity, and the suspiciously ambitious to-do list.", tip: "Stay for the signature. Apparently, signing your name in cursive is still a personality trait.", spots: ["tr", "bl"] },
  { id: "contact", t: "Your turn. Make it interesting.", d: "Have a cool idea, an interesting opportunity, or something worth building together? Aryan's inbox is open.", tip: "Click the orange circle. It's a button, not a tiny sun having an identity crisis.", spots: ["tl", "tr"] },
];

// Pip puts on sunglasses in these sections.
const COOL = ["film", "watch"];

const QUIPS = [
  "Boop. Professional interaction complete.",
  "Ow. Kidding, I'm a sphere.",
  "Still here? Excellent taste.",
  "My entire world is this website. It's a nice website.",
  "Wheee! Okay, back to the portfolio.",
  "I'd ask for a salary, but I don't have a bank account.",
  "That click had excellent character development.",
  "The developer says this is intentional.",
  "No bugs here. Only undocumented features.",
  "You scroll. I roll. We all have our roles.",
  "Fun fact: Aryan made me work for free.",
  "This portfolio has more personality than his terminal.",
  "You're exploring. I'm pretending to be in control.",
  "I'm the emotional support animal for this codebase.",
  "Achievement unlocked: you found a tiny orange guy.",
  "I would explain the code, but I wasn't invited to the stand-up.",
  "Somewhere, a semicolon just saved a life.",
  "Please admire the website. My rent depends on it.",
  "This is what happens when engineers discover CSS.",
  "Don't mind me. Just orbiting my career prospects.",
  "I do my own stunts. Mostly hopping.",
  "I have feet, but no shoes. Aryan says it's a budget thing.",
  "Click me four times fast. I dare you. I've been practicing.",
  "I've been told I'm 'a lot of sphere'.",
];
const SIZE = 112;
const MARGIN = 14;

const spotXY = (s: Spot) => {
  const W = document.documentElement.clientWidth, H = window.innerHeight;
  return { x: s[1] === "l" ? MARGIN : W - SIZE - MARGIN, y: s[0] === "t" ? MARGIN : H - SIZE - MARGIN };
};

// Pip: a small original 3D guide. He hops to a new corner as you move through the page,
// says what the section is about, then shrinks back so he stays out of the way.
// Little extras: sunglasses in the film sections, a nap when you go quiet, dizziness if you scroll like a maniac,
// a backflip if you click him four times fast, and a time-of-day hello.
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
    const lens = new THREE.MeshStandardMaterial({ color: 0x0c0b0a, roughness: 0.12, metalness: 0.35 });
    const glint = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.6 });

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

    // Sunglasses: hidden until a "cool" section
    const shades = new THREE.Group();
    shades.visible = false;
    shades.scale.setScalar(0.0001);
    pip.add(shades);
    ([-1, 1] as const).forEach((s) => {
      const l = add(new THREE.SphereGeometry(0.36, 28, 28), lens, s * 0.4, 0.3, 1.0, shades);
      l.scale.set(1.05, 0.85, 0.35);
      const g = add(new THREE.SphereGeometry(0.045, 10, 10), glint, s * 0.4 - 0.12, 0.42, 1.12, shades);
      g.scale.set(1, 1, 0.5);
    });
    add(new THREE.BoxGeometry(0.2, 0.06, 0.06), lens, 0, 0.34, 1.0, shades);

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
    const state = { mx: 0, my: 0, hover: false, talk: 0, dizzy: 0 };
    const hop = { y: 0, sq: 0, lean: 0, flip: 0 };
    const shade = { s: 0 };
    const sleepy = { v: 0 };
    const rot = { x: 0, y: 0, z: 0 };
    const doHop = () => {
      if (reduce) return;
      gsap.timeline()
        .to(hop, { sq: -0.18, duration: 0.12 })
        .to(hop, { y: 0.7, sq: 0.12, duration: 0.28, ease: "power2.out" })
        .to(hop, { y: 0, sq: -0.15, duration: 0.26, ease: "power2.in" })
        .to(hop, { sq: 0, duration: 0.35, ease: "elastic.out(1,.4)" });
    };
    const backflip = () => {
      gsap.killTweensOf(hop);
      gsap.timeline()
        .to(hop, { sq: -0.2, duration: 0.12 })
        .to(hop, { y: 0.35, sq: 0.15, duration: 0.35, ease: "power2.out" })
        .to(hop, { flip: Math.PI * 2, duration: 0.75, ease: "power1.inOut" }, "<")
        .to(hop, { y: 0, sq: -0.2, duration: 0.3, ease: "power2.in" })
        .set(hop, { flip: 0 })
        .to(hop, { sq: 0, duration: 0.5, ease: "elastic.out(1,.4)" });
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
    let dizzyNext = false, lastDizzy = 0;
    let clicks: number[] = [];
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
      const cool = COOL.includes(CHAPTERS[idx].id);
      gsap.to(shade, { s: cool ? 1 : 0, duration: cool ? 0.6 : 0.3, ease: cool ? "back.out(2.2)" : "power2.in", overwrite: true });
      moveTo(pick(idx), () => {
        const c = CHAPTERS[idx];
        if (dizzyNext) {
          dizzyNext = false;
          say("Whoa. I need a minute.", `${c.t} ${c.d}`);
        } else {
          say(c.t, c.d);
        }
      });
    };

    // Nap when nothing has happened for a while, wake on any activity
    let lastActive = performance.now(), asleep = false;
    const poke = () => {
      lastActive = performance.now();
      if (!asleep) return;
      asleep = false;
      gsap.to(sleepy, { v: 0, duration: 0.4, overwrite: true });
      if (ready) { doHop(); say("Oh. I was just resting my eyes.", "", CHAPTERS[cur].tip, 4000); }
    };

    const seen = (() => { try { return sessionStorage.getItem("aryan-intro") === "1"; } catch { return false; } })();
    const delay = seen ? 0.6 : 5.4;
    gsap.fromTo(host, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: "elastic.out(1,.5)", delay, transformOrigin: "50% 50%" });
    const startCall = gsap.delayedCall(delay + 0.5, () => {
      ready = true;
      if (cur) { arrive(cur); return; }
      doHop();
      const hr = new Date().getHours();
      const hello = hr < 5 ? "Still up? Respect." : hr < 12 ? "Good morning." : hr < 18 ? "Good afternoon." : "Good evening.";
      say("Hi, I'm Pip", `${hello} Page guide and professional hopper. I'll tell you where you are.`, "Click me for a tip.");
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
    const st = ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: (self) => {
        poke();
        update();
        // Scroll like a maniac and Pip gets dizzy (at most once every 12 seconds)
        if (!reduce && ready && Math.abs(self.getVelocity()) > 5000 && performance.now() - lastDizzy > 12000) {
          lastDizzy = performance.now();
          state.dizzy = 1;
          dizzyNext = true;
        }
      },
    });

    const onMove = (e: MouseEvent) => {
      poke();
      const r = host.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      state.mx = gsap.utils.clamp(-1, 1, (e.clientX - cx) / 420);
      state.my = gsap.utils.clamp(-1, 1, -(e.clientY - cy) / 320);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("keydown", poke);
    const onVis = () => { if (!document.hidden) lastActive = performance.now(); };
    document.addEventListener("visibilitychange", onVis);
    const onEnter = () => { poke(); state.hover = true; if (ready) say(CHAPTERS[cur].t, CHAPTERS[cur].d, CHAPTERS[cur].tip); };
    const onLeave = () => { state.hover = false; hideLater(1800); };
    const onClick = () => {
      poke();
      const now = performance.now();
      clicks = clicks.filter((c) => now - c < 1400);
      clicks.push(now);
      if (!reduce && clicks.length >= 4) {
        clicks = [];
        backflip();
        say("Ta-da. Four clicks, one backflip.", "I'm contractually obligated to be dizzy now.", "", 4500);
        return;
      }
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

      if (ready && !asleep && performance.now() - lastActive > 30000) {
        asleep = true;
        gsap.to(sleepy, { v: 1, duration: 1.2, overwrite: true });
        say("Zzz…", "Nobody's scrolling, so I'm resting my eyes.", "", 5000);
      }
      const sl = sleepy.v, dz = state.dizzy;
      state.dizzy *= 0.985;

      pip.position.y = Math.sin(t * 2) * 0.04 * m + hop.y;
      pip.scale.set(1 - hop.sq * 0.5, 1 + hop.sq, 1 - hop.sq * 0.5);
      rot.y += (state.mx * 0.5 - rot.y) * 0.1;
      rot.x += (-state.my * 0.28 + sl * 0.35 - rot.x) * 0.1;
      rot.z += (hop.lean + Math.sin(t * 9) * 0.18 * dz - rot.z) * 0.2;
      pip.rotation.set(rot.x - hop.flip, rot.y, rot.z);

      pupils.forEach((p, i) => {
        p.position.x = (i ? 0.4 : -0.4) + state.mx * 0.08 + Math.cos(t * 14 + i) * 0.07 * dz;
        p.position.y = 0.3 + state.my * 0.07 + Math.sin(t * 14 + i) * 0.07 * dz;
      });
      const bl = (t % 3.4 < 0.12 ? 0.1 : 1) * (1 - 0.92 * sl);
      eyes.forEach((e) => (e.scale.y = 1.1 * bl));
      pupils.forEach((p) => (p.scale.y = bl));
      ant.rotation.z = Math.sin(t * 2.4) * 0.12 * m - state.mx * 0.15 + Math.sin(t * 12) * 0.3 * dz;
      state.talk *= 0.97;
      glow.emissiveIntensity = (0.5 + 0.25 * Math.sin(t * 3) + state.talk * 1.1) * (1 - 0.6 * sl);
      arms.forEach(({ g, s }) => {
        const target = state.hover && s > 0 ? -0.9 + Math.sin(t * 10) * 0.5 : 0;
        g.rotation.z += (s * target * -1 - g.rotation.z) * 0.15;
      });

      shades.visible = shade.s > 0.01;
      shades.scale.setScalar(Math.max(0.0001, shade.s));
      renderer.render(scene, cam);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      startCall.kill();
      flight?.kill();
      gsap.killTweensOf([host, hop, fly, shade, sleepy]);
      clearTimeout(timer);
      clearTimeout(pend);
      st.kill();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", poke);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
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
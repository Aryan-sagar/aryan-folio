"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FRAMES, WATCH, SIDE, ABOUT, ABOUT_ROTATE, type Pick } from "./content";
import Pip from "../app/Pip";
import Link from "next/link";
import { slugFor, STUDIES } from "./work-data";
gsap.registerPlugin(ScrollTrigger);

// Quiet "film stock" colours for the project preview cards. Swap for real stills later.
// Edit freely. `stack` and `year` are shown only when filled. Add `href` to make "View case study" a real link.
type Proj = { id: string; title: string; tags: string; line: string; points: string[]; stats?: [string, string][]; stack: string[]; year?: string; repo?: string; demo?: string; glow: string };
const WORK: Proj[] = [
  { id: "fraud", points: ["Transactions stream in through Kafka", "Features are computed and cached in Redis", "A CatBoost model scores every transaction", "SHAP explains each decision"], title: "Real-Time Fraud Engine", tags: "AI · Fintech · Distributed systems", line: "Real-time transaction risk scoring with Kafka, Redis and CatBoost, with SHAP explaining every decision.", stack: ["Kafka", "Redis", "CatBoost", "SHAP"], year: "2026", repo: "https://github.com/Aryan-sagar/Real-Time-Risk-Fraud-Scoring-Engine", glow: "#ffa94d" },
  { id: "book", points: ["Matching engine written in C++", "Includes a backtester to test strategies"], title: "Limit Order Book", tags: "Systems · Finance · C++", line: "A limit order book matching engine and backtester built in C++.", stack: ["C++"], year: "2026", repo: "https://github.com/Aryan-sagar/Limit-Order-Book-Matching-Engine-Backtester", glow: "#4fb3a5" },
  { id: "crdt", points: ["Custom RGA CRDT at its core", "Several people can edit the same text in real time"], title: "CRDT Collaborative Editor", tags: "Distributed systems · Real-time collaboration", line: "Real-time collaborative text editing built on a custom RGA CRDT.", stack: [], year: "2026", repo: "https://github.com/Aryan-sagar/Real-Time-Collaborative-Text-Editor-CRDT-based-", glow: "#e0654a" },
  { id: "queue", points: ["A distributed task queue for running work across workers"], title: "Distributed Task Queue", tags: "Distributed systems", line: "A distributed task queue.", stack: [], repo: "https://github.com/Aryan-sagar/Distributed-Task-Queue", glow: "#ffa94d" },
  { id: "lake", points: ["Lakehouse-style analytical storage system"], title: "Mini Lakehouse", tags: "Data engineering · Storage systems", line: "A small lakehouse-style analytical storage system.", stack: [], repo: "https://github.com/Aryan-sagar/Mini_Lakehouse", glow: "#8b8cf0" },
];

const INK = "#f2efe8", MUTE = "#6f6c66", AMBER = "#ffa94d";
// Illustrative diagrams. Put real screenshots in /public/work/<id>.png to replace them.
function Viz({ id }: { id: string }) {
  if (id === "fraud") {
    const nodes = ["Kafka", "Features", "Redis", "CatBoost", "SHAP", "Decision"];
    return (
      <svg viewBox="0 0 560 200">
        <text x="14" y="52" fontSize="11" fill={MUTE}>transaction in</text>
        <text x="546" y="52" textAnchor="end" fontSize="11" fill={AMBER}>score and reason out</text>
        {nodes.map((t, i) => {
          const x = 14 + i * 90, last = i === 5;
          return (
            <g key={t}>
              <rect x={x} y={80} width={74} height={44} rx={8} fill={last ? AMBER : "#151412"} stroke={last ? AMBER : "#3a3834"} />
              <text x={x + 37} y={107} textAnchor="middle" fontSize="12" fontWeight="700" fill={last ? "#000" : INK}>{t}</text>
              {i < 5 && <path d={`M${x + 74} 102H${x + 90}`} stroke={MUTE} strokeWidth="1.5" />}
            </g>
          );
        })}
        <path d="M14 150H546" stroke="#2a2927" /><circle cx="140" cy="150" r="4" fill={INK} /><circle cx="300" cy="150" r="4" fill={INK} /><circle cx="420" cy="150" r="5" fill={AMBER} />
      </svg>
    );
  }
  if (id === "book") {
    const bids = [30, 62, 90, 124, 150, 176], asks = [26, 54, 96, 118, 154, 182];
    return (
      <svg viewBox="0 0 560 200">
        <text x="270" y="16" textAnchor="end" fontSize="11" fill={MUTE}>bids</text>
        <text x="290" y="16" fontSize="11" fill={MUTE}>asks</text>
        {bids.map((w, i) => <rect key={"b" + i} x={274 - w * 1.4} y={26 + i * 28} width={w * 1.4} height={20} rx={2} fill={i === 0 ? AMBER : "#34322e"} />)}
        {asks.map((w, i) => <rect key={"a" + i} x={286} y={26 + i * 28} width={w * 1.4} height={20} rx={2} fill={i === 0 ? AMBER : "#4a4741"} />)}
        <path d="M280 20V196" stroke={INK} strokeWidth="1" strokeDasharray="3 4" />
      </svg>
    );
  }
  if (id === "lake") {
    const L = [["Query layer", 360, 40], ["Table format", 410, 94], ["Object storage", 460, 148]] as const;
    return (
      <svg viewBox="0 0 560 200">
        {L.map(([t, w, y], i) => (
          <g key={t}>
            <rect x={280 - w / 2} y={y} width={w} height={42} rx={8} fill={i === 0 ? AMBER : "#151412"} stroke={i === 0 ? AMBER : "#3a3834"} />
            <text x="280" y={y + 26} textAnchor="middle" fontSize="13" fontWeight="700" fill={i === 0 ? "#000" : INK}>{t}</text>
          </g>
        ))}
      </svg>
    );
  }
  if (id === "crdt") {
    const win = (x: number, caret: string, rows: number[]) => (
      <g>
        <rect x={x} y={34} width={190} height={130} rx={8} fill="#151412" stroke="#3a3834" />
        {rows.map((w, i) => <rect key={i} x={x + 16} y={56 + i * 22} width={w} height={8} rx={4} fill="#34322e" />)}
        <rect x={x + 16 + rows[1]} y={76} width={2} height={16} fill={caret} />
      </g>
    );
    return (
      <svg viewBox="0 0 560 200">
        {win(30, AMBER, [130, 90, 150, 70])}
        {win(340, INK, [120, 110, 140, 80])}
        <path d="M232 99H328M318 92L328 99L318 106M242 92L232 99L242 106" fill="none" stroke={MUTE} strokeWidth="1.5" />
        <text x="280" y="124" textAnchor="middle" fontSize="11" fill={MUTE}>merge</text>
      </svg>
    );
  }
  if (id === "queue") {
    return (
      <svg viewBox="0 0 560 200">
        {[40, 90, 140].map((y) => (
          <g key={"p" + y}>
            <rect x={20} y={y - 14} width={110} height={30} rx={6} fill="#151412" stroke="#3a3834" />
            <text x={75} y={y + 5} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK}>Producer</text>
            <path d={`M130 ${y}H205`} stroke={MUTE} strokeWidth="1.5" />
          </g>
        ))}
        <rect x={205} y={55} width={150} height={90} rx={10} fill="#0f0e0d" stroke="#3a3834" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={217 + i * 33} y={80} width={26} height={40} rx={4} fill={i === 0 ? AMBER : "#34322e"} />)}
        {[40, 90, 140].map((y) => (
          <g key={"w" + y}>
            <path d={`M355 100L430 ${y}`} stroke={MUTE} strokeWidth="1.5" />
            <rect x={430} y={y - 14} width={110} height={30} rx={6} fill="#151412" stroke="#3a3834" />
            <text x={485} y={y + 5} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK}>Worker</text>
          </g>
        ))}
      </svg>
    );
  }
  const up = [96, 62, 36], down = [74, 46, 24];
  return (
    <svg viewBox="0 0 560 200">
      <path d="M280 24V176" stroke={INK} strokeWidth="1" />
      {up.map((w, i) => <rect key={"u" + i} x={284} y={40 + i * 44} width={w * 2} height={26} rx={3} fill={AMBER} opacity={1 - i * 0.2} />)}
      {down.map((w, i) => <rect key={"d" + i} x={276 - w * 2} y={52 + i * 44} width={w * 2} height={26} rx={3} fill="#4a4741" />)}
      <text x="270" y="190" textAnchor="end" fontSize="11" fill={MUTE}>lowers risk</text>
      <text x="290" y="190" fontSize="11" fill={AMBER}>raises risk</text>
    </svg>
  );
}

let lenisRef: Lenis | null = null;

const BUILD = [
  { h: "Intelligent systems.", k: "AI / ML", p: "Machine learning systems, intelligent applications, explainable AI and applied AI.", t: ["Python", "PyTorch", "CatBoost"], c: "#ffa94d" },
  { h: "Software that lasts.", k: "Software & systems", p: "Distributed systems, backend infrastructure, real-time systems and developer tools.", t: ["C++", "Kafka", "Redis", "PostgreSQL"], c: "#ffa94d" },
  { h: "Products people use.", k: "Products", p: "Turning technical ideas into usable products with polished interfaces.", t: ["React", "Next.js", "Docker"], c: "#ffa94d" },
];

const D = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";
type Tech = { n: string; i?: string; inv?: boolean };
const ROW1: Tech[] = [
  { n: "Python", i: `${D}/python/python-original.svg` },
  { n: "C++", i: `${D}/cplusplus/cplusplus-original.svg` },
  { n: "PyTorch", i: `${D}/pytorch/pytorch-original.svg` },
  { n: "CatBoost" },
  { n: "FastAPI", i: `${D}/fastapi/fastapi-original.svg` },
  { n: "Kafka", i: `${D}/apachekafka/apachekafka-original.svg`, inv: true },
];
const ROW2: Tech[] = [
  { n: "Redis", i: `${D}/redis/redis-original.svg` },
  { n: "PostgreSQL", i: `${D}/postgresql/postgresql-original.svg` },
  { n: "Docker", i: `${D}/docker/docker-original.svg` },
  { n: "React", i: `${D}/react/react-original.svg` },
  { n: "Next.js", i: `${D}/nextjs/nextjs-original.svg`, inv: true },
];
const WORDS = ["Build", "Think", "Create", "Explore", "Watch"];
const BEYOND = ["Anyone can build what they’re told.".split(" "), "I want to know what’s worth building.".split(" ")];

// Faces use your own photos: /public/cube/build.jpg, think.jpg, create.jpg, explore.jpg (+ optional top.jpg, bottom.jpg).
const FACES = [
  { k: "Build", t: "Intelligent systems", p: "AI, distributed systems and fintech infrastructure, built from scratch.", img: "/cube/build.jpg", bg: "#efe9dc", fg: "#0b0b0a" },
  { k: "Think", t: "Philosophy, psychology, history", p: "Trying to understand the questions underneath everything.", img: "/cube/think.jpg", bg: "#0b0b0a", fg: "#f2efe8" },
  { k: "Create", t: "Film and photography", p: "Engineer by profession. Filmmaker whenever I can.", img: "/cube/create.jpg", bg: "#ffa94d", fg: "#0b0b0a" },
  { k: "Explore", t: "Places and perspectives", p: "The world is too big to stay in one place.", img: "/cube/explore.jpg", bg: "#1c1a17", fg: "#f2efe8" },
];

// Centerline of the word "welcome", ordered along the stroke so it can be revealed like handwriting
const PEN = "M30.2 135.0l.4 0M30.2 136.0l.4 0M30.5 133.2l.4 0M30.5 137.8l.4 0M30.5 131.5l.4 0M30.8 139.5l.4 0M30.8 129.8l.4 0M31.0 141.2l.4 0M31.2 128.0l.4 0M31.8 143.0l.4 0M31.5 126.2l.4 0M32.8 144.8l.4 0M32.0 124.5l.4 0M34.5 146.2l.4 0M32.8 122.8l.4 0M36.2 147.2l.4 0M33.5 121.0l.4 0M38.0 147.5l.4 0M34.5 119.2l.4 0M39.8 147.8l.4 0M35.8 117.5l.4 0M42.0 147.2l.4 0M43.8 146.8l.4 0M45.5 146.0l.4 0M47.2 144.5l.4 0M49.0 142.8l.4 0M50.2 141.0l.4 0M51.8 139.5l.4 0M53.2 138.5l.4 0M54.2 139.8l.4 0M53.2 136.8l.4 0M55.2 141.2l.4 0M53.5 135.0l.4 0M56.0 143.0l.4 0M53.5 133.2l.4 0M57.2 144.8l.4 0M53.5 131.5l.4 0M58.8 146.2l.4 0M53.8 129.8l.4 0M60.5 147.2l.4 0M53.8 128.0l.4 0M62.2 147.8l.4 0M54.0 126.2l.4 0M64.0 148.0l.4 0M54.0 124.5l.4 0M65.8 148.0l.4 0M54.2 122.8l.4 0M67.5 147.8l.4 0M54.2 121.0l.4 0M69.2 147.0l.4 0M54.5 119.2l.4 0M71.8 145.2l.4 0M73.0 143.5l.4 0M74.0 141.8l.4 0M74.8 140.0l.4 0M75.2 138.2l.4 0M75.8 136.5l.4 0M76.0 134.8l.4 0M76.2 133.0l.4 0M76.5 131.2l.4 0M76.8 129.5l.4 0M76.8 127.8l.4 0M77.8 126.0l.4 0M78.5 126.5l.4 0M77.5 124.2l.4 0M80.2 127.2l.4 0M77.0 122.5l.4 0M82.0 128.5l.4 0M76.8 120.8l.4 0M83.8 130.2l.4 0M76.5 119.0l.4 0M85.5 131.8l.4 0M76.2 117.2l.4 0M87.2 132.8l.4 0M75.8 115.5l.4 0M89.0 133.5l.4 0M90.2 133.8l.4 0M92.0 134.0l.4 0M93.8 133.8l.4 0M95.5 133.2l.4 0M97.2 133.0l.4 0M99.0 132.5l.4 0M100.2 131.5l.4 0M100.8 133.2l.4 0M100.5 129.8l.4 0M101.0 135.0l.4 0M100.8 128.0l.4 0M101.2 136.8l.4 0M101.2 126.2l.4 0M101.8 138.5l.4 0M101.5 124.5l.4 0M103.2 139.8l.4 0M102.2 123.0l.4 0M104.5 139.2l.4 0M104.0 141.5l.4 0M103.0 121.2l.4 0M106.2 138.8l.4 0M104.5 143.2l.4 0M104.2 119.5l.4 0M108.0 138.0l.4 0M105.5 145.0l.4 0M106.0 118.0l.4 0M109.8 136.8l.4 0M107.2 146.5l.4 0M107.8 117.2l.4 0M111.5 135.2l.4 0M109.0 147.5l.4 0M109.5 116.8l.4 0M113.2 133.5l.4 0M110.8 148.2l.4 0M111.2 116.8l.4 0M114.5 131.8l.4 0M112.5 148.8l.4 0M113.0 117.2l.4 0M115.5 130.0l.4 0M114.2 149.0l.4 0M114.8 118.2l.4 0M116.2 128.2l.4 0M116.0 149.2l.4 0M116.0 120.0l.4 0M116.8 126.5l.4 0M117.8 149.0l.4 0M116.8 121.8l.4 0M117.0 124.8l.4 0M119.5 148.8l.4 0M117.0 123.5l.4 0M121.8 148.2l.4 0M123.5 147.5l.4 0M125.2 146.5l.4 0M127.0 145.2l.4 0M128.8 143.5l.4 0M130.5 141.8l.4 0M131.8 140.0l.4 0M133.0 138.2l.4 0M134.2 136.5l.4 0M135.0 134.8l.4 0M136.0 133.0l.4 0M137.2 131.5l.4 0M139.0 130.8l.4 0M140.0 130.8l.4 0M140.0 128.8l.4 0M141.2 132.0l.4 0M140.2 127.0l.4 0M141.8 133.8l.4 0M140.2 125.2l.4 0M142.5 135.5l.4 0M140.2 123.5l.4 0M143.0 137.2l.4 0M140.5 121.8l.4 0M143.8 139.0l.4 0M140.2 120.5l.4 0M141.8 120.0l.4 0M144.5 140.8l.4 0M139.0 118.8l.4 0M143.5 119.2l.4 0M145.5 142.5l.4 0M138.8 117.0l.4 0M144.5 117.5l.4 0M146.5 144.2l.4 0M138.8 115.2l.4 0M145.5 115.8l.4 0M148.0 146.0l.4 0M138.5 113.5l.4 0M146.2 114.0l.4 0M149.8 147.5l.4 0M138.5 111.8l.4 0M147.2 112.2l.4 0M151.5 148.5l.4 0M138.5 110.0l.4 0M148.0 110.5l.4 0M153.2 149.0l.4 0M138.2 108.2l.4 0M148.8 108.8l.4 0M155.0 149.2l.4 0M138.2 106.5l.4 0M149.5 107.0l.4 0M156.8 149.0l.4 0M138.0 104.8l.4 0M150.2 105.2l.4 0M158.5 148.5l.4 0M138.0 103.0l.4 0M151.0 103.5l.4 0M160.2 147.8l.4 0M138.0 101.2l.4 0M151.8 101.8l.4 0M162.0 146.8l.4 0M138.0 99.5l.4 0M152.2 100.0l.4 0M163.8 145.2l.4 0M138.0 97.8l.4 0M153.0 98.2l.4 0M165.5 143.8l.4 0M138.0 96.0l.4 0M153.5 96.5l.4 0M166.8 142.0l.4 0M138.2 94.2l.4 0M154.2 94.8l.4 0M168.2 140.2l.4 0M138.2 92.5l.4 0M154.8 93.0l.4 0M169.5 138.5l.4 0M138.2 90.8l.4 0M155.2 91.2l.4 0M170.5 136.8l.4 0M138.5 89.0l.4 0M155.8 89.5l.4 0M172.2 135.8l.4 0M138.5 87.2l.4 0M156.2 87.8l.4 0M174.0 134.8l.4 0M138.8 85.5l.4 0M175.0 135.0l.4 0M174.8 133.5l.4 0M157.0 85.2l.4 0M138.8 83.8l.4 0M175.8 136.8l.4 0M175.0 131.8l.4 0M157.5 83.5l.4 0M139.0 82.0l.4 0M176.2 138.5l.4 0M175.5 130.0l.4 0M157.8 81.8l.4 0M139.0 80.2l.4 0M176.5 140.2l.4 0M176.0 128.2l.4 0M158.2 80.0l.4 0M139.2 78.5l.4 0M177.2 142.0l.4 0M176.2 126.5l.4 0M158.5 78.2l.4 0M139.5 76.8l.4 0M178.0 143.8l.4 0M177.0 124.8l.4 0M158.8 76.5l.4 0M139.8 75.0l.4 0M179.2 145.5l.4 0M177.8 123.0l.4 0M159.0 74.8l.4 0M140.0 73.2l.4 0M181.0 147.2l.4 0M178.8 121.2l.4 0M159.2 73.0l.4 0M140.2 71.5l.4 0M182.8 148.8l.4 0M179.8 119.5l.4 0M159.5 71.2l.4 0M140.5 69.8l.4 0M184.5 149.5l.4 0M181.5 117.8l.4 0M159.8 69.5l.4 0M140.8 68.0l.4 0M186.2 150.0l.4 0M183.2 116.5l.4 0M159.8 67.8l.4 0M141.0 66.2l.4 0M188.0 150.5l.4 0M185.0 115.5l.4 0M159.8 66.0l.4 0M141.5 64.5l.4 0M189.8 150.8l.4 0M186.8 115.0l.4 0M159.8 64.2l.4 0M141.8 62.8l.4 0M191.5 150.8l.4 0M188.5 115.0l.4 0M159.8 62.5l.4 0M142.2 61.0l.4 0M193.2 150.5l.4 0M190.2 115.0l.4 0M159.8 60.8l.4 0M142.8 59.2l.4 0M195.0 150.2l.4 0M192.0 115.5l.4 0M159.5 59.0l.4 0M143.2 57.5l.4 0M196.8 149.8l.4 0M193.8 116.5l.4 0M159.5 57.2l.4 0M143.8 55.8l.4 0M198.5 149.2l.4 0M195.2 118.2l.4 0M159.2 55.5l.4 0M144.5 54.0l.4 0M200.2 148.5l.4 0M195.8 120.0l.4 0M158.8 53.8l.4 0M145.2 52.2l.4 0M202.0 147.5l.4 0M196.2 121.8l.4 0M158.5 52.0l.4 0M146.2 50.5l.4 0M203.8 146.5l.4 0M196.0 123.5l.4 0M157.8 50.2l.4 0M147.2 48.8l.4 0M205.5 145.2l.4 0M195.5 125.2l.4 0M156.8 48.5l.4 0M149.0 47.0l.4 0M149.5 46.8l.4 0M155.5 47.0l.4 0M208.5 142.5l.4 0M151.2 46.2l.4 0M153.8 46.2l.4 0M210.0 140.8l.4 0M211.0 139.8l.4 0M212.2 138.0l.4 0M214.0 137.0l.4 0M215.8 136.2l.4 0M216.5 135.2l.4 0M217.2 137.5l.4 0M216.8 133.5l.4 0M217.5 139.2l.4 0M217.2 131.8l.4 0M218.0 141.0l.4 0M217.8 130.0l.4 0M218.8 142.8l.4 0M218.5 128.2l.4 0M220.0 144.5l.4 0M219.5 126.5l.4 0M221.8 146.2l.4 0M220.5 124.8l.4 0M223.5 147.5l.4 0M222.0 123.0l.4 0M225.2 148.2l.4 0M223.8 121.5l.4 0M227.0 148.8l.4 0M225.5 120.2l.4 0M228.8 149.0l.4 0M227.2 119.2l.4 0M231.0 149.0l.4 0M232.8 148.8l.4 0M234.5 148.5l.4 0M236.2 148.0l.4 0M238.0 147.2l.4 0M239.8 146.0l.4 0M241.5 144.2l.4 0M242.8 142.5l.4 0M243.5 140.8l.4 0M243.8 139.0l.4 0M245.0 138.5l.4 0M244.0 137.0l.4 0M245.5 136.5l.4 0M246.8 139.0l.4 0M242.2 136.5l.4 0M245.5 134.8l.4 0M248.5 139.0l.4 0M240.5 136.0l.4 0M245.5 133.0l.4 0M250.2 139.0l.4 0M238.8 134.5l.4 0M245.8 131.2l.4 0M252.0 138.8l.4 0M237.2 132.8l.4 0M245.8 129.5l.4 0M253.8 138.5l.4 0M236.0 131.0l.4 0M245.5 127.8l.4 0M255.5 138.2l.4 0M235.2 129.2l.4 0M245.5 126.0l.4 0M257.2 137.5l.4 0M234.8 127.5l.4 0M245.0 124.2l.4 0M259.0 136.5l.4 0M234.5 125.8l.4 0M244.5 122.5l.4 0M260.8 135.0l.4 0M234.2 124.0l.4 0M243.8 120.8l.4 0M262.2 133.5l.4 0M234.5 122.2l.4 0M242.8 119.0l.4 0M263.5 131.8l.4 0M234.8 120.5l.4 0M241.0 117.8l.4 0M264.8 130.0l.4 0M235.5 118.8l.4 0M239.2 117.5l.4 0M265.5 128.2l.4 0M237.2 117.8l.4 0M266.0 126.8l.4 0M266.8 125.0l.4 0M267.8 123.2l.4 0M268.5 121.5l.4 0M269.5 119.8l.4 0M270.8 118.0l.4 0M272.2 116.2l.4 0M274.0 115.5l.4 0M275.8 115.5l.4 0M277.2 116.5l.4 0M277.8 118.2l.4 0M278.0 120.0l.4 0M278.0 121.8l.4 0M278.0 123.5l.4 0M278.0 125.2l.4 0M278.0 127.0l.4 0M277.8 128.8l.4 0M277.8 130.5l.4 0M277.8 132.2l.4 0M277.5 134.0l.4 0M277.5 135.8l.4 0M277.5 137.5l.4 0M277.2 139.2l.4 0M277.2 141.0l.4 0M277.2 142.8l.4 0M277.2 144.5l.4 0M278.0 146.0l.4 0M279.8 146.0l.4 0M281.5 145.2l.4 0M282.8 143.5l.4 0M283.5 141.8l.4 0M284.5 140.0l.4 0M285.5 138.2l.4 0M286.2 136.5l.4 0M287.2 134.8l.4 0M288.2 133.0l.4 0M289.2 131.2l.4 0M290.2 129.5l.4 0M291.5 127.8l.4 0M292.5 126.0l.4 0M293.5 124.2l.4 0M294.8 122.5l.4 0M296.2 120.8l.4 0M298.0 119.8l.4 0M299.8 119.0l.4 0M301.5 118.8l.4 0M303.2 119.2l.4 0M305.0 120.8l.4 0M305.5 122.5l.4 0M305.8 124.2l.4 0M306.0 126.0l.4 0M306.0 127.8l.4 0M305.8 129.5l.4 0M305.8 131.2l.4 0M305.8 133.0l.4 0M305.5 134.8l.4 0M305.5 136.5l.4 0M305.5 138.2l.4 0M305.2 140.0l.4 0M305.2 141.8l.4 0M305.2 143.5l.4 0M306.2 145.2l.4 0M307.2 145.0l.4 0M306.2 147.0l.4 0M309.5 144.0l.4 0M310.8 142.5l.4 0M311.8 140.8l.4 0M312.5 139.0l.4 0M313.5 137.2l.4 0M314.5 135.5l.4 0M315.2 133.8l.4 0M316.2 132.0l.4 0M317.2 130.2l.4 0M318.2 128.5l.4 0M319.5 126.8l.4 0M320.5 125.0l.4 0M322.0 123.2l.4 0M323.5 121.5l.4 0M325.2 120.0l.4 0M327.0 119.2l.4 0M328.8 118.8l.4 0M330.5 119.0l.4 0M332.2 119.2l.4 0M333.8 121.0l.4 0M334.2 122.8l.4 0M334.5 124.5l.4 0M334.8 126.2l.4 0M334.5 128.0l.4 0M334.5 129.8l.4 0M334.2 131.5l.4 0M334.2 133.2l.4 0M334.2 135.0l.4 0M334.0 136.8l.4 0M334.2 138.5l.4 0M334.2 140.2l.4 0M334.5 142.0l.4 0M335.0 143.8l.4 0M335.8 145.5l.4 0M337.5 147.2l.4 0M339.2 147.8l.4 0M341.0 148.0l.4 0M342.8 148.0l.4 0M344.5 147.8l.4 0M346.2 147.2l.4 0M348.0 146.2l.4 0M349.8 145.0l.4 0M351.5 143.2l.4 0M353.2 141.5l.4 0M354.5 139.8l.4 0M355.8 138.0l.4 0M357.0 136.2l.4 0M358.5 135.0l.4 0M360.2 134.0l.4 0M361.0 133.0l.4 0M362.2 135.0l.4 0M361.5 131.2l.4 0M362.5 136.8l.4 0M361.8 129.5l.4 0M363.0 138.5l.4 0M362.0 127.8l.4 0M364.5 139.8l.4 0M362.5 126.2l.4 0M365.8 139.2l.4 0M365.2 141.5l.4 0M362.8 124.5l.4 0M367.5 138.8l.4 0M365.8 143.2l.4 0M363.5 122.8l.4 0M369.2 138.0l.4 0M366.8 145.0l.4 0M364.2 121.0l.4 0M371.0 136.8l.4 0M368.5 146.5l.4 0M365.8 119.2l.4 0M372.8 135.2l.4 0M370.2 147.5l.4 0M367.5 117.8l.4 0M374.5 133.5l.4 0M372.0 148.2l.4 0M369.2 117.2l.4 0M375.8 131.8l.4 0M373.8 148.8l.4 0M371.0 116.8l.4 0M376.8 130.0l.4 0M375.5 149.0l.4 0M372.8 117.0l.4 0M377.5 128.2l.4 0M377.2 149.2l.4 0M374.5 117.2l.4 0M378.0 126.5l.4 0M379.0 149.0l.4 0M376.2 118.5l.4 0M378.2 124.8l.4 0M380.8 148.8l.4 0M377.5 120.2l.4 0M378.0 123.0l.4 0M382.5 148.2l.4 0M383.2 148.2l.4 0M385.0 147.2l.4 0M386.8 146.2l.4 0M388.5 145.0l.4 0M390.2 143.2l.4 0M392.0 141.5l.4 0M393.2 139.8l.4 0M394.5 138.0l.4 0M395.5 136.2l.4 0M396.5 134.5l.4 0M397.5 132.8l.4 0M398.5 131.0l.4 0M399.2 129.2l.4 0";
const SEGS = PEN.match(/M[^M]+/g) as string[];

const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
// Looks for /public/posters/<title-slug>.jpg|png|webp (or the pick's own `poster`), falling back to a colour gradient.
const art = (p: Pick, overlay = true) => {
  const urls = p.poster ? [p.poster] : ["jpg", "png", "webp"].map((e) => `/posters/${slug(p.t)}.${e}`);
  return [
    overlay ? "linear-gradient(to top, rgba(0,0,0,.8), rgba(0,0,0,0) 55%)" : "",
    ...urls.map((u) => `url("${u}") center/cover no-repeat`),
    `linear-gradient(165deg, ${p.color}, #0a0a0a 140%)`,
  ].filter(Boolean).join(", ");
};
// A short line from each title. Change any line, or leave a title out to show its description instead.
const QUOTES: Record<string, { q: string; who: string }> = {
  "The Dark Knight": { q: "Some men just want to watch the world burn.", who: "Alfred" },
  "Good Will Hunting": { q: "It's not your fault.", who: "Sean" },
  "Interstellar": { q: "Love is the one thing that transcends time and space.", who: "Brand" },
  "Inception": { q: "You mustn't be afraid to dream a little bigger, darling.", who: "Eames" },
  "Fight Club": { q: "The first rule of Fight Club is: you do not talk about Fight Club.", who: "Tyler Durden" },
  "Attack on Titan": { q: "If you don't fight, you can't win!", who: "Eren Yeager" },
  "Bleach": { q: "Admiration is the emotion furthest from understanding.", who: "Aizen" },
  "Naruto": { q: "I never go back on my word! That's my ninja way!", who: "Naruto Uzumaki" },
  "Death Note": { q: "I am justice!", who: "Light Yagami" },
  "Steins;Gate": { q: "El Psy Kongroo.", who: "Okabe" },
  "Black Clover": { q: "Surpass your limits! Right here, right now!", who: "Asta" },
};

const CHAPTERS = [
  { id: "top", t: "Aryan Sagar", d: "AI engineer, software engineer, filmmaker" },
  { id: "build", t: "What I build", d: "Intelligent systems, software and products" },
  { id: "work", t: "Selected work", d: "Projects, one at a time" },
  { id: "film", t: "Filmmaking", d: "Engineer by profession, filmmaker whenever I can" },
  { id: "side", t: "Side quests", d: "Things I'm learning because I find them interesting" },
  { id: "watch", t: "Watch", d: "The films, worlds and stories I keep coming back to" },
  { id: "about", t: "About", d: "Who is behind this" },
  { id: "contact", t: "Contact", d: "Have something interesting in mind?" },
];

// Fixed chapter indicator: always says where you are.


function FaceIcon({ k }: { k: string }) {
  const p: Record<string, React.ReactNode> = {
    Build: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 5l-4 14" />,
    Think: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />,
    Create: <><rect x="2.5" y="7" width="13" height="10" rx="2" /><path d="M15.5 11l6-3.5v9l-6-3.5z" /></>,
    Explore: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{p[k]}</svg>;
}

// Quiet "up next" strip: says what is coming, and is a link to it.
const NEXT_ID: Record<string, string> = { "02": "build", "03": "work", "04": "film", "05": "side", "06": "watch" };
function Chapter({ n, title, sub }: { n: string; title: string; sub: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 88%", toggleActions: "play none none reverse" } });
      tl.from(".nx-t span", { yPercent: 110, duration: 0.9, ease: "power4.out" }, 0)
        .from(".nx-k, .nx-s", { opacity: 0, y: 12, duration: 0.7, stagger: 0.08 }, 0.15)
        .from(".nx-line", { scaleX: 0, duration: 1.1, ease: "power3.inOut" }, 0.1);
    }, ref);
    return () => ctx.revert();
  }, []);
  const go = () => {
    const el = document.getElementById(NEXT_ID[n]);
    if (el && lenisRef) lenisRef.scrollTo(el, { duration: 1.4 });
    else el?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div ref={ref} className="nx">
      <p className="nx-k">Up next · <b>{n}</b></p>
      <div>
        <h3 className="nx-t"><span>{title}</span></h3>
        <p className="nx-s">{sub}</p>
      </div>
      <button className="nx-b" onClick={go} aria-label={`Go to ${title}`} data-cursor="Go"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg></button>
      <i className="nx-line" />
    </div>
  );
}

// Portrait behind the headline. Save your photo as public/hero.jpg (or .jpeg/.png/.webp).
function HeroBg() {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const list = ["jpg", "jpeg", "png", "webp"].map((e) => `/hero.${e}`);
    let dead = false;
    const probe = (i: number) => {
      if (i >= list.length || dead) return;
      const im = new Image();
      im.onload = () => { if (!dead) setUrl(list[i]); };
      im.onerror = () => probe(i + 1);
      im.src = list[i];
    };
    probe(0);
    return () => { dead = true; };
  }, []);
  return (
    <div className="hero-bg" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {url && <img src={url} alt="" onLoad={(e) => e.currentTarget.classList.add("in")} />}
    </div>
  );
}

function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour12: false }));
    f();
    const i = setInterval(f, 1000);
    return () => clearInterval(i);
  }, []);
  return <span className="clock">{t || "--:--:--"} IST</span>;
}


function Work() {
  const ref = useRef<HTMLElement>(null);
  const trig = useRef<ScrollTrigger | null>(null);
  const n = WORK.length;
  const [act, setAct] = useState(0);
  const actRef = useRef(0);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mm = gsap.matchMedia();
    // Pinned one-project-at-a-time stage on desktop. On phones the projects simply stack.
    mm.add("(min-width: 821px)", () => {
      const t = ScrollTrigger.create({
        trigger: ref.current, start: "top top", end: `+=${n * 80}%`, pin: true,
        onUpdate: (self) => {
          const i = Math.min(n - 1, Math.floor(self.progress * n));
          if (i !== actRef.current) { actRef.current = i; setAct(i); }
        },
      });
      trig.current = t;
      return () => { t.kill(); trig.current = null; };
    });
    return () => mm.revert();
  }, [n]);

  const jump = (i: number) => {
    const t = trig.current;
    if (!t) { actRef.current = i; setAct(i); return; }
    const y = t.start + ((i + 0.5) / n) * (t.end - t.start);
    if (lenisRef) lenisRef.scrollTo(y, { duration: 1.3 }); else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section id="work" ref={ref} className="wk">
      {WORK.map((p, i) => (
        <div key={p.id} className={`wk-glow${i === act ? " on" : ""}`} aria-hidden="true"
          style={{ background: `radial-gradient(55% 65% at 72% 55%, ${p.glow}33, transparent 70%)` }} />
      ))}
      <div className="wk-tabs">
        {WORK.map((p, i) => (
          <button key={p.id} type="button" className={i === act ? "on" : ""} aria-current={i === act} onClick={() => jump(i)}>
            <b>{String(i + 1).padStart(2, "0")}</b> {p.title}
          </button>
        ))}
      </div>
      <div className="wk-stage">
        {WORK.map((p, i) => {
          const st = STUDIES.find((s) => s.id === p.id);
          const href = `/work/${slugFor(p.id)}`;
          const stat = st?.numbers[0];
          return (
            <article key={p.id} className={`wk-slide${i === act ? " on" : ""}`}>
              <div className="wk-text">
                <h3><Link href={href}>{p.title}</Link></h3>
                <p className="wk-tags">{p.tags}</p>
                <p className="wk-line">{st?.intro ?? p.line}</p>
                <p className="wk-stack">{(st?.stack ?? p.stack).slice(0, 6).join(", ")}</p>
                <div className="wk-cta">
                  <Link className="btn solid" href={href}>Read the case study</Link>
                  {p.repo && <a className="btn" href={p.repo} target="_blank" rel="noreferrer">View code</a>}
                </div>
              </div>
              <div className="wk-vis">
                <Link className="wk-panel" href={href} data-cursor="Open →" aria-label={`${p.title} case study`}><Viz id={p.id} /></Link>
                {stat && <p className="wk-stat"><b>{stat[0]}</b>{stat[1]}</p>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
// Tries the given file, then the same name with .jpg/.jpeg/.png/.webp. Shows the shot number until one loads.
function FrameImg({ src, n }: { src: string; n: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!src) return;
    const base = src.replace(/\.\w+$/, "");
    const list = [src, ...["jpg", "jpeg", "png", "webp"].map((e) => `${base}.${e}`)];
    let dead = false;
    const probe = (i: number) => {
      if (i >= list.length || dead) return;
      const im = new Image();
      im.onload = () => { if (!dead) setUrl(list[i]); };
      im.onerror = () => probe(i + 1);
      im.src = list[i];
    };
    probe(0);
    return () => { dead = true; };
  }, [src]);
  // eslint-disable-next-line @next/next/no-img-element
  return url ? <img src={url} alt="" onLoad={() => ScrollTrigger.refresh()} /> : <span>{n}</span>;
}

// Showreel: drop a video at public/film/reel.mp4, or set a YouTube video id below. It appears at the end of the film strip.
const REEL = { mp4: "/film/reel.mp4", youtube: "" };
function Reel() {
  const [has, setHas] = useState(false);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (REEL.youtube) { setHas(true); return; }
    let dead = false;
    fetch(REEL.mp4, { method: "HEAD" })
      .then((r) => { if (!dead && r.ok && (r.headers.get("content-type") || "").includes("video")) setHas(true); })
      .catch(() => {});
    return () => { dead = true; };
  }, []);
  useEffect(() => { if (has) setTimeout(() => ScrollTrigger.refresh(), 60); }, [has]);
  useEffect(() => {
    if (!on) return;
    lenisRef?.stop();
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOn(false); };
    window.addEventListener("keydown", k);
    return () => { lenisRef?.start(); window.removeEventListener("keydown", k); };
  }, [on]);
  if (!has) return null;
  return (
    <>
      <figure className="frame">
        <button type="button" className="shot reelbtn" onClick={() => setOn(true)} data-cursor="Play">
          <span className="play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg></span>
          <em>Showreel</em>
        </button>
        <figcaption>Showreel · Edited in DaVinci</figcaption>
      </figure>
      {on && typeof document !== "undefined" && createPortal(
        <div className="modal" data-lenis-prevent onClick={() => setOn(false)}>
          <div className="rv" onClick={(e) => e.stopPropagation()}>
            {REEL.youtube
              ? <iframe src={`https://www.youtube-nocookie.com/embed/${REEL.youtube}?autoplay=1&rel=0`} allow="autoplay; encrypted-media; fullscreen" allowFullScreen title="Showreel" />
              : <video src={REEL.mp4} controls autoPlay playsInline />}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function Film() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const track = ref.current!.querySelector<HTMLElement>(".ftrack")!;
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth), ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: () => "+=" + (track.scrollWidth - window.innerWidth), pin: true, scrub: 0.5, invalidateOnRefresh: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section id="film" ref={ref} className="film">
      <div className="fhead">
        <h2>Engineer by profession.<br />Filmmaker whenever I can.</h2>
        <p>Cinematography, storytelling, editing and colour grading. Shot on iPhone, cut in DaVinci Resolve.</p>
      </div>
      <div className="ftrack">
        {FRAMES.map((f) => (
          <figure className="frame" key={f.shot}>
            <div className="shot">
              <FrameImg src={f.src} n={f.shot} />
            </div>
            <figcaption>Shot {f.shot} · {f.loc} · {f.cam} · Edited in DaVinci</figcaption>
          </figure>
        ))}
        <Reel />
      </div>
    </section>
  );
}

function Watch() {
  const [kind, setKind] = useState<"all" | "movie" | "anime">("all");
  const [open, setOpen] = useState<Pick | null>(null);
  const [act, setAct] = useState(0);
  const list = WATCH.filter((p) => kind === "all" || p.kind === kind);
  const varied = new Set(WATCH.map((q) => q.stars)).size > 1; // stars only show once your ratings actually differ
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const sec = useRef<HTMLElement>(null);
  const moved = useRef(0);
  const hov = useRef(-1);
  const tilt = useRef({ x: 0, y: 0 });
  const nav = useRef({ go: (_d: number) => {}, to: (_i: number) => {} });

  useEffect(() => {
    const st = stage.current!, el = ring.current!;
    const cards = Array.from(el.children) as HTMLElement[];
    const n = cards.length;
    if (!n) return;
    const step = 360 / n;
    const cw = cards[0].offsetWidth || 200;
    const r = Math.round((cw / 2 + 18) / Math.tan(Math.PI / Math.max(n, 3)));
    cards.forEach((c, i) => { c.style.transform = `rotateY(${i * step}deg) translateZ(${r}px)`; });
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const norm = (a: number) => ((a % 360) + 360) % 360;
    const hv = cards.map(() => 0);
    let rot = 0, target = 0, down = false, lx = 0, hover = false, cur = -1, vis = false;
    const io = new IntersectionObserver(([en]) => { vis = en.isIntersecting; }, { rootMargin: "120px" });
    io.observe(st);
    nav.current = {
      go: (d) => { target -= d * step; },
      to: (i) => { target += norm(-i * step - target + 180) - 180; },
    };
    const tick = () => {
      if (!vis) return;
      rot += (target - rot) * (down ? 0.35 : 0.09);
      gsap.set(el, { z: -r, rotationY: rot });
      let best = 0, bestA = 999;
      cards.forEach((c, i) => {
        const a = norm(i * step + rot + 180) - 180;
        const cs = Math.max(0, Math.cos((a * Math.PI) / 180));
        if (Math.abs(a) < bestA) { bestA = Math.abs(a); best = i; }
        hv[i] += ((hov.current === i ? 1 : 0) - hv[i]) * 0.14;
        const h = hv[i];
        (c.firstElementChild as HTMLElement).style.filter = `brightness(${0.3 + 0.7 * Math.max(cs, h)})`;
        (c.firstElementChild as HTMLElement).style.transform =
          `translateZ(${(h * 110).toFixed(1)}px) rotateY(${(-a * h * 0.75 + tilt.current.x * 16 * h).toFixed(2)}deg) rotateX(${(-tilt.current.y * 14 * h).toFixed(2)}deg) scale(${(1 + 0.16 * cs ** 3 + h * 0.16).toFixed(3)})`;
      });
      if (best !== cur) { cur = best; setAct(best); sec.current?.style.setProperty("--glow", list[best].color); }
    };
    gsap.ticker.add(tick);
    const pd = (e: PointerEvent) => { down = true; lx = e.clientX; moved.current = 0; };
    const pm = (e: PointerEvent) => { if (!down) return; const dx = e.clientX - lx; lx = e.clientX; moved.current += Math.abs(dx); target += dx * 0.35; };
    const pu = () => { if (!down) return; down = false; target = Math.round(target / step) * step; };
    const enter = () => { hover = true; }, leave = () => { hover = false; };
    st.addEventListener("pointerdown", pd);
    st.addEventListener("mouseenter", enter);
    st.addEventListener("mouseleave", leave);
    window.addEventListener("pointermove", pm);
    window.addEventListener("pointerup", pu);
    const iv = setInterval(() => { if (vis && !down && !hover && !reduce && !document.hidden) target -= step; }, 4200);
    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      clearInterval(iv);
      st.removeEventListener("pointerdown", pd);
      st.removeEventListener("mouseenter", enter);
      st.removeEventListener("mouseleave", leave);
      window.removeEventListener("pointermove", pm);
      window.removeEventListener("pointerup", pu);
    };
  }, [kind]);

  const p = list[act] ?? list[0];
  const qt = p ? QUOTES[p.t] : undefined;
  const label = (k: Pick["kind"]) => (k === "movie" ? "Film" : "Anime");
  return (
    <section id="watch" ref={sec} className="plain wsec">
      <div className="wglow" />
      <h2 className="wh">Your next obsession.</h2>
      <p className="wsub">The films, worlds and stories I keep coming back to. Start anywhere.</p>
      <div className="filters">
        {(["all", "movie", "anime"] as const).map((k) => (
          <button key={k} className={kind === k ? "on" : ""} onClick={() => { setKind(k); setAct(0); }}>{k === "all" ? "All" : k === "movie" ? "Films" : "Anime"}</button>
        ))}
      </div>
      <div className="stage3d" ref={stage}>
        <div className="wfloor" />
        <div className="ring" ref={ring}>
          {list.map((q, i) => (
            <div className="rc" key={q.t} data-cursor={i === act ? "Open →" : "Bring forward"}
              onMouseEnter={() => { hov.current = i; }}
              onMouseLeave={() => { hov.current = -1; }}
              onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); tilt.current = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 }; }}
              onClick={() => { if (moved.current >= 6) return; if (i === act) setOpen(q); else nav.current.to(i); }}>
              <div className="rcard" style={{ background: art(q) }}>
                <span className="rk">{label(q.kind)}</span>
                <div className="hq"><span>{q.genre}</span><b>{"★".repeat(q.stars)}</b><p>{q.note}</p></div>
                <strong>{q.t}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
      {p && (
        <div className="winfo">
          <button className="arrow" onClick={() => nav.current.go(-1)} aria-label="Previous">←</button>
          <div key={p.t}>
            <span className="wkind">{label(p.kind)}</span>
            <h3>{p.t}</h3>
            <p className="wby">{p.by} · {p.year}</p>
            {varied && <p className="wr"><span>Aryan&apos;s rating</span><b>{"★".repeat(p.stars)}</b></p>}
            {qt ? (<><p className="wn">&ldquo;{qt.q}&rdquo;</p><p className="wq">{qt.who}</p></>) : <p className="wn">&ldquo;{p.note}&rdquo;</p>}
            <button className="wgo" onClick={() => setOpen(p)}>Watch →</button>
          </div>
          <button className="arrow" onClick={() => nav.current.go(1)} aria-label="Next">→</button>
        </div>
      )}
      {open && (
        <div className="modal" data-lenis-prevent onClick={() => setOpen(null)}>
          <div className="mcard" onClick={(e) => e.stopPropagation()}>
            <div className="mpos" style={{ background: art(open, false) }} />
            <div className="mtxt">
              <p>{label(open.kind)} · {open.genre}</p>
              <h3>{open.t}</h3>
              <p>{open.by} · {open.year}</p>
              {varied && <p className="stars">{"★".repeat(open.stars)}</p>}
              {QUOTES[open.t] ? (<><p className="wn">&ldquo;{QUOTES[open.t].q}&rdquo;</p><p className="wq">{QUOTES[open.t].who}</p></>) : <p className="wn">&ldquo;{open.note}&rdquo;</p> }
              <button onClick={() => setOpen(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// Replaces the whole `function Side() { ... }` in components/Portfolio.tsx.
// Delete from `function Side() {` down to the line just before
// `// Looks for /public/about.jpg (or .jpeg/.png/.webp); shows a monogram until it exists.`
// then paste this in its place. Nothing else in Portfolio.tsx changes.

// Replaces the whole `function Side() { ... }` in components/Portfolio.tsx.
// Delete from `function Side() {` down to the line just before
// `// Looks for /public/about.jpg (or .jpeg/.png/.webp); shows a monogram until it exists.`
// then paste this in its place. Nothing else in Portfolio.tsx changes.

function Side() {
  const ref = useRef<HTMLElement>(null);
  const trig = useRef<ScrollTrigger | null>(null);
  const n = SIDE.length;
  const pad = (k: number) => String(k).padStart(2, "0");

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; // CSS shows a plain stack instead
    const root = ref.current!;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 821px)", () => {
      const cam = root.querySelector<HTMLElement>(".sqg-cam")!;
      const hall = root.querySelector<HTMLElement>(".sqg-hall")!;
      const frames = gsap.utils.toArray<HTMLElement>(".sqg-frame", root);
      const shades = frames.map((f) => f.querySelector<HTMLElement>(".sqg-shade")!);
      const glows = gsap.utils.toArray<HTMLElement>(".sqg-glow", root);
      const dots = gsap.utils.toArray<HTMLElement>(".sqg-prog button", root);
      const hint = root.querySelector<HTMLElement>(".sqg-hint");
      const GAP = 1000; // distance between frames along the hall, in px
      const clamp = gsap.utils.clamp;
      let near = -1;

      // p = scroll progress 0..1. The camera dwells on each frame, then glides to the next.
      const render = (p: number) => {
        const W = window.innerWidth;
        const f = p * (n - 1);
        const a = Math.min(n - 2, Math.floor(f));
        const t = clamp(0, 1, (f - a - 0.2) / 0.6);
        const s = t * t * (3 - 2 * t);
        const g = a + s;
        const fx = (i: number) => (i % 2 ? 1 : -1) * W * 0.27; // must match 27vw in the CSS
        const camX = fx(a) + (fx(a + 1) - fx(a)) * s;
        gsap.set(hall, { x: -camX, z: g * GAP });
        frames.forEach((fr, i) => {
          const rel = g - i; // < 0: still ahead of the camera, > 0: already passed
          const focus = 1 - clamp(0, 1, Math.abs(rel) * 1.6);
          const op = rel > 0 ? clamp(0, 1, 1 - rel / 0.45) : 1;
          shades[i].style.opacity = String(rel < 0 ? Math.min(0.88, -rel * 0.38) : 0);
          fr.style.opacity = String(op);
          fr.style.visibility = op <= 0.01 ? "hidden" : "visible";
          fr.style.pointerEvents = rel > 0.3 ? "none" : "auto";
          fr.style.setProperty("--focus", focus.toFixed(3));
          fr.style.setProperty("--tilt", clamp(0, 1, Math.abs(rel) * 1.2).toFixed(3));
          if (Math.abs(rel) < 0.5) delete fr.dataset.cursor; else fr.dataset.cursor = "Step in";
        });
        const nr = Math.round(g);
        if (nr !== near) {
          near = nr;
          glows.forEach((el, i) => el.classList.toggle("on", i === nr));
          dots.forEach((el, i) => el.classList.toggle("on", i === nr));
        }
        hint?.classList.toggle("gone", p > 0.03);
      };

      const t = ScrollTrigger.create({
        trigger: root, start: "top top", end: `+=${(n - 1) * 75}%`, pin: true,
        onUpdate: (self) => render(self.progress),
        onRefresh: (self) => render(self.progress),
      });
      trig.current = t;
      render(0);

      // The whole hall leans slightly toward the cursor
      let off = () => {};
      if (matchMedia("(pointer: fine)").matches) {
        const rx = gsap.quickTo(cam, "rotationX", { duration: 0.9, ease: "power3" });
        const ry = gsap.quickTo(cam, "rotationY", { duration: 0.9, ease: "power3" });
        const mv = (e: MouseEvent) => {
          ry((e.clientX / window.innerWidth - 0.5) * 6);
          rx(-(e.clientY / window.innerHeight - 0.5) * 4);
        };
        const lv = () => { ry(0); rx(0); };
        root.addEventListener("mousemove", mv);
        root.addEventListener("mouseleave", lv);
        off = () => { root.removeEventListener("mousemove", mv); root.removeEventListener("mouseleave", lv); };
      }
      return () => { off(); t.kill(); trig.current = null; };
    });
    return () => mm.revert();
  }, [n]);

  const jump = (i: number) => {
    const t = trig.current;
    if (!t) return;
    const y = t.start + (i / (n - 1)) * (t.end - t.start);
    if (lenisRef) lenisRef.scrollTo(y, { duration: 1.5 }); else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section id="side" ref={ref} className="sqg">
      {SIDE.map((q, i) => (
        <div key={q.t} className={`sqg-glow${i === 0 ? " on" : ""}`} aria-hidden="true"
          style={{ background: `radial-gradient(60% 60% at 50% 55%, ${q.c}40, transparent 72%)` }} />
      ))}
      <div className="sqg-scene">
        <div className="sqg-cam">
          <div className="sqg-hall">
            {SIDE.map((q, i) => (
              <figure key={q.t} className="sqg-frame" onClick={() => jump(i)}
                style={{ "--i": i, "--sx": i % 2 ? 1 : -1, "--c": q.c } as React.CSSProperties}>
                <div className="sqg-photo" style={{ backgroundImage: `url(${q.img}), linear-gradient(135deg, ${q.c}, #050505 72%)` }}>
                  <i className="sqg-shade" />
                </div>
                <figcaption className="sqg-txt">
                  <span className="sqg-n" style={{ color: q.c }}>{pad(i + 1)} / {pad(n)}</span>
                  <h2 className="sqg-t">{q.t}</h2>
                  <p className="sqg-d">{q.d}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
      <div className="sqg-vig" aria-hidden="true" />
      <div className="sqg-prog">
        {SIDE.map((q, i) => (
          <button key={q.t} type="button" className={i === 0 ? "on" : ""} aria-label={q.t} onClick={() => jump(i)}>{pad(i + 1)}</button>
        ))}
      </div>
      <p className="sqg-hint">Scroll to walk through</p>
    </section>
  );
}
// Looks for /public/about.jpg (or .jpeg/.png/.webp); shows a monogram until it exists.
function AboutPhoto() {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const list = ["jpg", "jpeg", "png", "webp"].map((e) => `/about.${e}`);
    let dead = false;
    const probe = (i: number) => {
      if (i >= list.length || dead) return;
      const im = new Image();
      im.onload = () => { if (!dead) setUrl(list[i]); };
      im.onerror = () => probe(i + 1);
      im.src = list[i];
    };
    probe(0);
    return () => { dead = true; };
  }, []);
  return (
    <div
      className={`ab-photo ${ABOUT_ROTATE === 90 || ABOUT_ROTATE === 270 ? "swap" : ABOUT_ROTATE === 180 ? "flip" : ""}`}
      style={{ "--rot": `${ABOUT_ROTATE}deg` } as React.CSSProperties}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {url ? <img src={url} alt="Aryan Sagar" /> : <span>AS</span>}
      <small className="ab-cap">Aryan Sagar · IIT Ropar</small>
    </div>
  );
}

function Now() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const st = { trigger: ".ab-grid", start: "top 72%" };
      gsap.from(".ab-photo", { clipPath: "inset(100% 0% 0% 0%)", duration: 1.3, ease: "power4.inOut", scrollTrigger: st });
      gsap.from(".ab-text > *", { opacity: 0, y: 36, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.25, scrollTrigger: st });
    }, ref);
    return () => ctx.revert();
  }, []);
  const key = "actually useful";
  const k = ABOUT[0].indexOf(key);
  return (
    <section id="about" ref={ref} className="plain">
      <div className="ab-grid">
        <AboutPhoto />
        <div className="ab-text">
          <p className="ab-lead">
            {k >= 0 ? <>{ABOUT[0].slice(0, k)}<em>{key}</em>{ABOUT[0].slice(k + key.length)}</> : ABOUT[0]}
          </p>
          {ABOUT.slice(1).map((t, i) => <p className="ab-p" key={i}>{t}</p>)}
          <p className="ab-sign">Aryan</p>
          <div className="ab-cta">
            <a className="btn solid" href="#work">See my work</a>
            <a className="btn" href="#contact">Say hello</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function CopyEmail() {
  const [done, setDone] = useState(false);
  const mail = "aryansagar.workspace@gmail.com";
  return (
    <button className="copy" data-cursor="Copy" onClick={() => { navigator.clipboard?.writeText(mail); setDone(true); setTimeout(() => setDone(false), 1800); }}>
      {done ? "Copied" : mail}
    </button>
  );
}

export default function Portfolio() {
  const root = useRef<HTMLElement>(null);
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(pointer: fine)").matches;
    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      if (reduce) return;

      // Smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync
      const lenis = new Lenis({ lerp: 0.085, anchors: true });
      lenisRef = lenis;
      lenis.on("scroll", () => ScrollTrigger.update());
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanups.push(() => { gsap.ticker.remove(tick); lenis.destroy(); lenisRef = null; });

      // Marquee leans into the direction you scroll
      const marquee = root.current!.querySelector(".marquee");
      const skew = gsap.quickTo(marquee, "skewX", { duration: 0.5, ease: "power3" });
      lenis.on("scroll", (l: Lenis) => skew(gsap.utils.clamp(-10, 10, -l.velocity * 0.6)));

      // The one page-load moment: the name rises letter by letter
      // The welcome intro plays once per browser session; returning visitors go straight in.
      const seen = (() => { try { return sessionStorage.getItem("aryan-intro") === "1"; } catch { return false; } })();
      if (seen) {
        gsap.set(".intro", { display: "none" });
        gsap.from(".hl", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.05, delay: 0.1 });
      } else {
        lenis.stop();
        const pen = { n: 0 };
        const penEl = root.current!.querySelector(".pen") as SVGPathElement;
        gsap.timeline({ onComplete: () => { lenis.start(); try { sessionStorage.setItem("aryan-intro", "1"); } catch {} } })
          .to(pen, { n: SEGS.length, duration: 2.8, delay: 0.3, ease: "sine.inOut",
            onUpdate: () => penEl.setAttribute("d", SEGS.slice(0, Math.round(pen.n)).join("")) })
          .to(".intro", { yPercent: -100, duration: 1, ease: "power4.inOut" }, "+=0.7")
          .from(".hl", { yPercent: 110, duration: 1.2, ease: "power4.out", stagger: 0.05 }, "-=0.35")
          .set(".intro", { display: "none" });
      }

      // Hero drifts away and shrinks as you leave it
      gsap.to(".title", { yPercent: -16, scale: 0.88, opacity: 0.25, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

      // Pinned cube: scroll steps through the faces, dragging spins it, the tabs jump to a face
      const stageEl = document.querySelector<HTMLElement>(".stage")!;
      const cubeEl = stageEl.querySelector<HTMLElement>(".cube")!;
      const scene = stageEl.querySelector<HTMLElement>(".scene")!;
      const caps = gsap.utils.toArray<HTMLElement>(".cap");
      const tabs = gsap.utils.toArray<HTMLElement>(".ctabs button");
      const sideFaces = gsap.utils.toArray<HTMLElement>(".face:not(.ftop):not(.fbot)");
      FACES.forEach((f, i) => { const im = new Image(); im.onload = () => sideFaces[i]?.classList.add("photo"); im.src = f.img; });
      gsap.to(".cfloat", { y: -16, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
      const norm = (a: number) => ((a % 360) + 360) % 360;
      const BIAS = -18;
      let ry = BIAS, rx = -14, ty = BIAS, tx = -14, face = 0, vis = false, down = false, px = 0, py = 0;
      gsap.set(cubeEl, { rotationY: ry, rotationX: rx });
      const show = (i: number) => {
        if (i === face) return;
        face = i;
        caps.forEach((c, k) => k === i
          ? gsap.fromTo(c, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.55, delay: 0.2, overwrite: true })
          : gsap.to(c, { opacity: 0, y: -30, duration: 0.25, overwrite: true }));
        tabs.forEach((t, k) => t.classList.toggle("on", k === i));
      };
      const go = (i: number) => { ty += norm(-i * 90 + BIAS - ty + 180) - 180; show(i); };
      tabs.forEach((t, i) => t.addEventListener("click", () => go(i)));
      const pd = (e: PointerEvent) => { down = true; px = e.clientX; py = e.clientY; };
      const pm = (e: PointerEvent) => {
        if (!down) return;
        ty += (e.clientX - px) * 0.5;
        tx = gsap.utils.clamp(-55, 25, tx - (e.clientY - py) * 0.35);
        px = e.clientX; py = e.clientY;
      };
      const pu = () => {
        if (!down) return;
        down = false;
        const k = Math.round((ty - BIAS) / 90);
        ty = k * 90 + BIAS; tx = -14;
        show((((-k) % FACES.length) + FACES.length) % FACES.length);
      };
      const io = new IntersectionObserver(([en]) => { vis = en.isIntersecting; });
      io.observe(stageEl);
      const spin = () => {
        if (!vis) return;
        ry += (ty - ry) * (down ? 0.35 : 0.1);
        rx += (tx - rx) * 0.1;
        gsap.set(cubeEl, { rotationY: ry, rotationX: rx });
        sideFaces.forEach((f, i) => {
          f.style.filter = `brightness(${(0.5 + 0.55 * Math.max(0, Math.cos((norm(i * 90 + ry) * Math.PI) / 180))).toFixed(2)})`;
        });
      };
      gsap.ticker.add(spin);
      scene.addEventListener("pointerdown", pd);
      window.addEventListener("pointermove", pm);
      window.addEventListener("pointerup", pu);
      cleanups.push(() => {
        gsap.ticker.remove(spin); io.disconnect();
        scene.removeEventListener("pointerdown", pd);
        window.removeEventListener("pointermove", pm);
        window.removeEventListener("pointerup", pu);
      });
      let stepped = 0;
      ScrollTrigger.create({
        trigger: stageEl, start: "top top", end: "+=130%", pin: true,
        onUpdate: (self) => {
          const i = Math.min(FACES.length - 1, Math.round(self.progress * (FACES.length - 1)));
          if (i !== stepped) { stepped = i; go(i); }
        },
      });

      // The statement lights up word by word as you scroll through it
      gsap.fromTo(".bw", { yPercent: 115 }, {
        yPercent: 0, ease: "none", stagger: 0.12,
        scrollTrigger: { trigger: ".beyond", start: "top 60%", end: "center 45%", scrub: true },
      });

      // Page transitions: each section is pinned while the next slides over it,
      // and it zooms out / swings sideways / dims as it gets covered.
      const stack = gsap.utils.toArray<HTMLElement>(".panel, .cover");
      const looks = [
        { scale: 0.84 },
        { scale: 0.86, xPercent: -9, rotate: -2.5 },
        { scale: 0.86, xPercent: 9, rotate: 2.5 },
      ];
      stack.slice(0, -1).forEach((p, i) => {
        const start = p.offsetHeight > window.innerHeight + 4 ? "bottom bottom" : "top top";
        gsap.to(p, {
          ...looks[i % 3], opacity: 0.3, borderRadius: 56, ease: "none",
          scrollTrigger: { trigger: p, start, end: () => "+=" + window.innerHeight, scrub: true, pin: true, pinSpacing: false, invalidateOnRefresh: true },
        });
      });
      // Section arrivals, like cuts in an edit: wipe from the right, wipe from the left, iris, split, push-in
      const arrive: [string, gsap.TweenVars, gsap.TweenVars][] = [
        ["work", { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)" }],
        ["film", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)" }],
        ["side", { clipPath: "circle(0% at 50% 62%)" }, { clipPath: "circle(120% at 50% 62%)" }],
        ["watch", { clipPath: "inset(0% 50% 0% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)" }],
        ["about", { scale: 0.86, opacity: 0.2, transformOrigin: "50% 0%" }, { scale: 1, opacity: 1 }],
      ];
      arrive.forEach(([id, from, to]) => {
        const el = document.getElementById(id);
        if (!el) return;
        gsap.fromTo(el, from, { ...to, ease: "none", scrollTrigger: { trigger: el, start: "top 98%", end: "top 30%", scrub: true } });
      });
      ScrollTrigger.sort();
      ScrollTrigger.refresh();

      gsap.utils.toArray<HTMLElement>(".brow").forEach((r) => {
        const st = { trigger: r, start: "top 85%" };
        gsap.from(r.querySelector(".bh span"), { yPercent: 115, duration: 1, ease: "power4.out", scrollTrigger: st });
        gsap.from(r.querySelector(".bside"), { opacity: 0, y: 24, duration: 0.9, delay: 0.2, scrollTrigger: st });
      });

      if (!fine) return;

      // Cursor follower + the name's letters swell toward the pointer
      const c = cursor.current!;
      gsap.set(c, { xPercent: -50, yPercent: -50 });
      const cx = gsap.quickTo(c, "x", { duration: 0.3, ease: "power3" });
      const cy = gsap.quickTo(c, "y", { duration: 0.3, ease: "power3" });
      // The name's letters swell toward the pointer. Eased per frame, measured once, only while the hero is on screen.
      const letters = gsap.utils.toArray<HTMLElement>(".hl:not(.ic)");
      const cur = letters.map(() => ({ w: 800, d: 100 }));
      let centers: { x: number; y: number }[] = [];
      const mouse = { x: 0, y: 0, on: false, t: 0 };
      const measure = () => {
        centers = letters.map((l) => {
          const r = l.getBoundingClientRect();
          return { x: r.left + r.width / 2 + window.scrollX, y: r.top + r.height / 2 + window.scrollY };
        });
      };
      window.addEventListener("resize", () => { centers = []; });
      const heroTick = () => {
        if (!mouse.on || window.scrollY > window.innerHeight * 0.6 || performance.now() < (seen ? 1500 : 4800)) return;
        if (!centers.length) measure();
        const idle = performance.now() - mouse.t > 1800;
        letters.forEach((l, i) => {
          const d = Math.hypot(mouse.x - centers[i].x, mouse.y - centers[i].y);
          // Rest state is heavy. Near the pointer letters swell; far letters only relax a little, never go thin.
          const f = idle ? 0 : Math.max(0, 1 - d / 650);
          const tw = idle ? 800 : 560 + 340 * f;
          const td = idle ? 100 : 96 + 29 * f;
          const s = cur[i];
          const nw = s.w + (tw - s.w) * 0.16, nd = s.d + (td - s.d) * 0.16;
          if (Math.abs(nw - s.w) < 0.4 && Math.abs(nd - s.d) < 0.3) return;
          s.w = nw; s.d = nd;
          l.style.fontVariationSettings = `'wght' ${nw.toFixed(0)}, 'wdth' ${nd.toFixed(0)}`;
        });
      };
      gsap.ticker.add(heroTick);
      const move = (e: MouseEvent) => {
        cx(e.clientX); cy(e.clientY);
        mouse.x = e.clientX + window.scrollX; mouse.y = e.clientY + window.scrollY; mouse.on = true; mouse.t = performance.now();
      };
      const over = (e: MouseEvent) => {
        const t = e.target as HTMLElement;
        const lab = t.closest("[data-cursor]") as HTMLElement | null;
        c.dataset.label = lab?.dataset.cursor ?? "";
        c.classList.toggle("label", !!lab);
        c.classList.toggle("big", !lab && !!t.closest("a,button,[data-big]"));
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseover", over);
      cleanups.push(() => { gsap.ticker.remove(heroTick); window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); });

      // Magnetic buttons
      gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
        const mx = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1,.4)" });
        const my = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1,.4)" });
        el.addEventListener("mousemove", (e) => {
          const r = el.getBoundingClientRect();
          mx((e.clientX - r.left - r.width / 2) * 0.35);
          my((e.clientY - r.top - r.height / 2) * 0.35);
        });
        el.addEventListener("mouseleave", () => { mx(0); my(0); });
      });
    }, root);

    return () => { cleanups.forEach((f) => f()); ctx.revert(); };
  }, []);

  return (
    <main ref={root}>
      <div className="intro" aria-hidden="true">
        <svg className="word" viewBox="0 0 420 200">
          <defs>
            <mask id="mWelcome" maskUnits="userSpaceOnUse" x="0" y="0" width="420" height="200"><path className="pen" /></mask>
          </defs>
          <text className="w" x="210" y="150" textAnchor="middle" fontSize="150" mask="url(#mWelcome)">welcome</text>
        </svg>
      </div>
      <Pip />
      <div ref={cursor} className="cursor" />
      <div className="grain" />

      <nav className="nav">
        <Clock />
        <a href="#work">Work</a>
        <a href="#film">Film</a>
        <a href="#watch">Watch</a>
        <a href="#contact">Contact</a>
      </nav>

      <header id="top" className="hero panel">
        <HeroBg />
        <div className="meta">
          <span className="avail"><i />Open to opportunities</span>
          <a className="mail" href="mailto:aryansagar.workspace@gmail.com">aryansagar.workspace@gmail.com</a>
        </div>

        <h1 className="title" aria-label="Aryan Sagar">
          {[["A", "R", "Y", "A", "N", "bolt"], ["S", "A", "G", "A", "R", "cam"]].map((tokens, li) => (
            <div className="line" key={li} aria-hidden="true">
              {tokens.map((t, i) =>
                t === "bolt" ? <span className="hl ic" key={i}><svg viewBox="0 0 24 24" fill="none" stroke="#ffa94d" strokeWidth="2" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg></span>
                : t === "cam" ? <a className="hl ic" href="#film" aria-label="Filmmaking" data-cursor="Film" tabIndex={-1} key={i}><svg viewBox="0 0 24 24" fill="#2bb3ff"><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M17 10l5-3v10l-5-3z" /></svg></a>
                : <span className="hl" key={i}>{t}</span>)}
            </div>
          ))}
        </h1>

        <div className="hero-foot">
          <p className="lede">Engineer by profession. <em>Filmmaker by obsession.</em></p>
          <div className="hero-right">
            <p className="hello">I build intelligent systems and create films that make people feel something.</p>
            <div className="ctas">
              <a className="btn solid" data-magnetic href="#work">View my work</a>
              <a className="btn" data-magnetic href="/resume.pdf">Resume</a>
            </div>
          </div>
        </div>
        <div className="cue" aria-hidden="true"><span>Scroll</span><i /></div>
      </header>

      <div className="marquee panel" aria-hidden="true">
        <div className="track">
          {[0, 1].map((g) => (
            <div className="grp" key={g}>
              {WORDS.map((w) => <span key={w}>{w}.<i className="badge"><svg viewBox="0 0 24 24"><path d="M12 2c1 6 4 9 10 10-6 1-9 4-10 10-1-6-4-9-10-10 6-1 9-4 10-10z" /></svg></i></span>)}
            </div>
          ))}
        </div>
      </div>

      <section id="do" className="stage" aria-label="What I do">
        <div className="stglow" />
        <div className="caps">
          {FACES.map((f, i) => (
            <div className={`cap cap-${i}`} key={f.k}>
              <h2>{f.k}.</h2>
              <h3>{f.t}</h3>
              <p>{f.p}</p>
            </div>
          ))}
        </div>
        <div className="scene" data-cursor="Drag">
          <div className="cring"><i /></div>
          <div className="cshadow" />
          <div className="cfloat">
            <div className="cube">
              {FACES.map((f, i) => (
                <div className={`face f${i}`} key={f.k} style={{ backgroundColor: f.bg, backgroundImage: `url(${f.img})`, "--ff": f.fg } as React.CSSProperties}><FaceIcon k={f.k} /><span>{f.k}</span></div>
              ))}
              <div className="face ftop" style={{ backgroundImage: "url(/cube/top.jpg), linear-gradient(150deg, #e9e3d3, #b9b2a0)" }} />
              <div className="face fbot" style={{ backgroundImage: "url(/cube/bottom.jpg), linear-gradient(150deg, #1a1816, #0b0b0a)" }} />
            </div>
          </div>
        </div>
        <div className="ctabs">{FACES.map((f, i) => <button key={f.k} className={i === 0 ? "on" : ""}>{f.k}</button>)}</div>
        <p className="chint">Drag the cube, or pick a face.</p>
      </section>

      <Chapter n="02" title="What I build" sub="Intelligent systems, software and products." />

      <section id="build" className="panel">
        <div className="brows">
          {BUILD.map((b) => (
            <div className="brow" key={b.h} data-big style={{ "--c": b.c } as React.CSSProperties}>
              <h3 className="bh"><span>{b.h}</span></h3>
              <div className="bside">
                <small>{b.k}</small>
                <p>{b.p}</p>
                <div className="btags">{b.t.map((t) => <span key={t}>{t}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="tech" aria-label="Technologies">
          {[ROW1, ROW2].map((row, r) => (
            <div className={`trow ${r ? "rev" : ""}`} key={r}>
              <div className="ttrack">
                {[0, 1, 2, 3].map((g) => (
                  <div className="tgrp" key={g}>
                    {row.map((t) => (
                      <span className="tchip" key={t.n}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {t.i && <img src={t.i} alt="" className={t.inv ? "inv" : ""} loading="lazy" />}
                        {t.n}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Chapter n="03" title="Selected work" sub={`${WORK.length} projects, one at a time.`} />
      <Work />

      <section id="beyond" className="beyond panel">
        <div>
          {BEYOND.map((line, li) => (
            <p key={li} className={li ? "bb" : "ba"}>
              {line.map((w, i) => <span className="bwm" key={i}><span className="bw">{w}</span></span>)}
            </p>
          ))}
        </div>
      </section>

      <Chapter n="04" title="Filmmaking" sub="Engineer by profession. Filmmaker whenever I can." />
      <Film />
      <Chapter n="05" title="Side quests" sub="Things I’m learning simply because I find them interesting." />
      <Side />
      <Chapter n="06" title="Watch" sub="The films, worlds and stories I keep coming back to." />
      <Watch />
      <Now />

      <section id="contact" className="contact cover">
        <p className="label">Contact</p>
        <h2>Have something interesting in mind?</h2>
        <div className="ct-actions">
          <a className="big" data-magnetic href="mailto:aryansagar.workspace@gmail.com">Let’s talk</a>
          <CopyEmail />
        </div>
        <div className="ct-links">
          <a href="https://github.com/Aryan-sagar" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/aryan-sagar-755947254" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="/resume.pdf">Resume</a>
        </div>
        <footer className="foot">
          <span>© 2026 Aryan Sagar · Kanpur <Clock /></span>
          <button className="totop" onClick={() => (lenisRef ? lenisRef.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}>Back to top</button>
        </footer>
      </section>
    </main>
  );
}
"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  memo,
} from "react";
import { toPng } from "html-to-image";

/* ================================================================
   THEME SYSTEM -- 10 Professional Themes
   ================================================================ */
interface Theme {
  name: string;
  tag: string;
  bg: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  inputBg: string;
  inputBorder: string;
  inputFocus: string;
  tabBg: string;
  tabActive: string;
  tabActiveText: string;
  tabInactiveText: string;
  warn: string;
  danger: string;
  success: string;
  primary: string;
  glow: string;
}

const THEMES: Theme[] = [
  { name: "Midnight Blue", tag: "Default", bg: "#0f172a", card: "#1e293b", border: "#334155", text: "#f1f5f9", muted: "#94a3b8", accent: "#3b82f6", inputBg: "#0f172a", inputBorder: "#334155", inputFocus: "#3b82f6", tabBg: "#1e293b", tabActive: "#3b82f6", tabActiveText: "#fff", tabInactiveText: "#94a3b8", warn: "#f59e0b", danger: "#ef4444", success: "#22c55e", primary: "#3b82f6", glow: "0 0 60px rgba(59,130,246,0.12)" },
  { name: "Obsidian", tag: "Dark", bg: "#09090b", card: "#18181b", border: "#27272a", text: "#fafafa", muted: "#a1a1aa", accent: "#a855f7", inputBg: "#09090b", inputBorder: "#27272a", inputFocus: "#a855f7", tabBg: "#18181b", tabActive: "#a855f7", tabActiveText: "#fff", tabInactiveText: "#71717a", warn: "#eab308", danger: "#f43f5e", success: "#10b981", primary: "#a855f7", glow: "0 0 60px rgba(168,85,247,0.1)" },
  { name: "Emerald Night", tag: "Nature", bg: "#022c22", card: "#064e3b", border: "#065f46", text: "#ecfdf5", muted: "#6ee7b7", accent: "#34d399", inputBg: "#022c22", inputBorder: "#065f46", inputFocus: "#34d399", tabBg: "#064e3b", tabActive: "#34d399", tabActiveText: "#022c22", tabInactiveText: "#6ee7b7", warn: "#fbbf24", danger: "#f87171", success: "#34d399", primary: "#2dd4bf", glow: "0 0 60px rgba(52,211,153,0.1)" },
  { name: "Crimson Forge", tag: "Bold", bg: "#1a0a0a", card: "#2a1515", border: "#4a2020", text: "#fef2f2", muted: "#fca5a5", accent: "#ef4444", inputBg: "#1a0a0a", inputBorder: "#4a2020", inputFocus: "#ef4444", tabBg: "#2a1515", tabActive: "#ef4444", tabActiveText: "#fff", tabInactiveText: "#f87171", warn: "#fb923c", danger: "#ef4444", success: "#4ade80", primary: "#f87171", glow: "0 0 60px rgba(239,68,68,0.1)" },
  { name: "Arctic Frost", tag: "Light", bg: "#f0f4f8", card: "#ffffff", border: "#cbd5e1", text: "#1e293b", muted: "#64748b", accent: "#0ea5e9", inputBg: "#f8fafc", inputBorder: "#cbd5e1", inputFocus: "#0ea5e9", tabBg: "#e2e8f0", tabActive: "#0ea5e9", tabActiveText: "#fff", tabInactiveText: "#475569", warn: "#f59e0b", danger: "#ef4444", success: "#22c55e", primary: "#0ea5e9", glow: "0 0 60px rgba(14,165,233,0.06)" },
  { name: "Golden Sand", tag: "Warm", bg: "#1c1917", card: "#292524", border: "#44403c", text: "#fef3c7", muted: "#d6d3d1", accent: "#f59e0b", inputBg: "#1c1917", inputBorder: "#44403c", inputFocus: "#f59e0b", tabBg: "#292524", tabActive: "#f59e0b", tabActiveText: "#1c1917", tabInactiveText: "#a8a29e", warn: "#f59e0b", danger: "#ef4444", success: "#84cc16", primary: "#f59e0b", glow: "0 0 60px rgba(245,158,11,0.1)" },
  { name: "Ocean Depth", tag: "Cool", bg: "#0c1222", card: "#172033", border: "#1e3a5f", text: "#e0f2fe", muted: "#7dd3fc", accent: "#0ea5e9", inputBg: "#0c1222", inputBorder: "#1e3a5f", inputFocus: "#0ea5e9", tabBg: "#172033", tabActive: "#0ea5e9", tabActiveText: "#fff", tabInactiveText: "#7dd3fc", warn: "#fbbf24", danger: "#fb7185", success: "#34d399", primary: "#38bdf8", glow: "0 0 60px rgba(14,165,233,0.1)" },
  { name: "Cyber Neon", tag: "Vibrant", bg: "#0a0a0f", card: "#13131f", border: "#2d2d44", text: "#e2e8f0", muted: "#818cf8", accent: "#06b6d4", inputBg: "#0a0a0f", inputBorder: "#2d2d44", inputFocus: "#06b6d4", tabBg: "#13131f", tabActive: "#06b6d4", tabActiveText: "#fff", tabInactiveText: "#818cf8", warn: "#facc15", danger: "#f472b6", success: "#4ade80", primary: "#06b6d4", glow: "0 0 60px rgba(6,182,212,0.12)" },
  { name: "Rose Quartz", tag: "Elegant", bg: "#1a0f1e", card: "#2d1f33", border: "#4a2d55", text: "#fdf2f8", muted: "#f9a8d4", accent: "#ec4899", inputBg: "#1a0f1e", inputBorder: "#4a2d55", inputFocus: "#ec4899", tabBg: "#2d1f33", tabActive: "#ec4899", tabActiveText: "#fff", tabInactiveText: "#f9a8d4", warn: "#fbbf24", danger: "#f43f5e", success: "#34d399", primary: "#ec4899", glow: "0 0 60px rgba(236,72,153,0.1)" },
  { name: "Slate Pro", tag: "Minimal", bg: "#161b22", card: "#21262d", border: "#30363d", text: "#e6edf3", muted: "#8b949e", accent: "#58a6ff", inputBg: "#0d1117", inputBorder: "#30363d", inputFocus: "#58a6ff", tabBg: "#21262d", tabActive: "#58a6ff", tabActiveText: "#fff", tabInactiveText: "#8b949e", warn: "#d29922", danger: "#f85149", success: "#3fb950", primary: "#58a6ff", glow: "0 0 60px rgba(88,166,255,0.08)" },
];

/* ================================================================
   INLINE SVG ICON SYSTEM
   ================================================================ */
const I = {
  main: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="2" fill="#2b5797" />
      <rect x="2" y="2" width="12" height="12" rx="1" fill="#3b7dd8" />
      <path d="M5 4h3.5c2.5 0 4 1.5 4 4s-1.5 4-4 4H5V4z" fill="none" stroke="#fff" strokeWidth="1.5" />
      <path d="M10.5 6.5L12.5 4.5M10.5 9.5L12.5 11.5" stroke="#ffd700" strokeWidth="0.8" />
    </svg>
  ),
  newFile: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M3 1h6l4 4v10H3V1z" fill="#fff" stroke="#666" />
      <path d="M9 1v4h4" fill="#ddd" stroke="#666" strokeLinejoin="round" />
    </svg>
  ),
  open: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M1 4h5l1.5-2H14v2h-1l-2 10H1V4z" fill="#f5d67b" stroke="#b8860b" strokeWidth="0.8" />
      <path d="M1 6l2-2h10l-2 10H1V6z" fill="#fce9a0" stroke="#b8860b" strokeWidth="0.8" />
    </svg>
  ),
  save: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="1" fill="#4688c8" stroke="#2a5a8a" strokeWidth="0.8" />
      <rect x="3" y="1" width="8" height="5" rx="0.5" fill="#fff" stroke="#2a5a8a" strokeWidth="0.5" />
      <rect x="4" y="9" width="8" height="5" rx="0.5" fill="#1a3f66" />
      <rect x="8" y="2" width="2" height="3" fill="#4688c8" />
    </svg>
  ),
  saveAll: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <rect x="3" y="3" width="12" height="12" rx="1" fill="#4688c8" stroke="#2a5a8a" strokeWidth="0.7" />
      <rect x="5" y="3" width="6" height="4" rx="0.5" fill="#fff" />
      <rect x="5" y="10" width="7" height="4" rx="0.5" fill="#1a3f66" />
      <rect x="1" y="1" width="12" height="12" rx="1" fill="none" stroke="#2a5a8a" strokeWidth="0.7" strokeDasharray="2 1" />
    </svg>
  ),
  close: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M3 1h6l4 4v10H3V1z" fill="#fff" stroke="#999" />
      <path d="M9 1v4h4" fill="#ddd" stroke="#999" />
      <path d="M6 7l4 4M10 7l-4 4" stroke="#c33" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  print: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="5" width="14" height="7" rx="1" fill="#888" stroke="#555" strokeWidth="0.7" />
      <rect x="3" y="1" width="10" height="5" fill="#fff" stroke="#888" strokeWidth="0.7" />
      <rect x="3" y="10" width="10" height="5" fill="#fff" stroke="#888" strokeWidth="0.7" />
      <circle cx="12" cy="8" r="1" fill="#4c4" />
    </svg>
  ),
  undo: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M4 4L2 6.5L4 9" stroke="#36c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 6.5h8c2.5 0 4 1.5 4 3.5s-1.5 3-4 3H7" stroke="#36c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  ),
  redo: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M12 4l2 2.5-2 2.5" stroke="#36c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 6.5H6c-2.5 0-4 1.5-4 3.5s1.5 3 4 3h3" stroke="#36c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  ),
  cut: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <circle cx="5" cy="12" r="2.5" fill="none" stroke="#555" strokeWidth="1.2" />
      <circle cx="11" cy="12" r="2.5" fill="none" stroke="#555" strokeWidth="1.2" />
      <line x1="5" y1="10" x2="11" y2="3" stroke="#555" strokeWidth="1.2" />
      <line x1="11" y1="10" x2="5" y2="3" stroke="#555" strokeWidth="1.2" />
    </svg>
  ),
  copy: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <rect x="4" y="4" width="10" height="11" rx="1" fill="#fff" stroke="#666" />
      <rect x="2" y="1" width="10" height="11" rx="1" fill="#fff" stroke="#666" />
    </svg>
  ),
  paste: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <rect x="3" y="3" width="11" height="12" rx="1" fill="#f5e6b8" stroke="#b8860b" strokeWidth="0.8" />
      <rect x="5" y="1" width="6" height="3" rx="1" fill="#c0a050" stroke="#8b7335" strokeWidth="0.7" />
      <rect x="5" y="7" width="7" height="6" fill="#fff" stroke="#999" strokeWidth="0.7" />
    </svg>
  ),
  selAll: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="1" fill="none" stroke="#36c" strokeDasharray="2 1" />
      <rect x="3" y="4" width="10" height="2" rx="0.5" fill="#cce0ff" stroke="#36c" strokeWidth="0.5" />
      <rect x="3" y="7" width="10" height="2" rx="0.5" fill="#cce0ff" stroke="#36c" strokeWidth="0.5" />
      <rect x="3" y="10" width="7" height="2" rx="0.5" fill="#cce0ff" stroke="#36c" strokeWidth="0.5" />
    </svg>
  ),
  find: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" fill="none" stroke="#555" strokeWidth="1.5" />
      <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#555" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  replace: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="6" r="3.5" fill="none" stroke="#555" strokeWidth="1.2" />
      <line x1="9" y1="9" x2="12" y2="12" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 8h4v4" stroke="#c63" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  compile: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="2" width="10" height="12" rx="1" fill="#fff" stroke="#666" strokeWidth="0.8" />
      <line x1="3" y1="5" x2="9" y2="5" stroke="#569cd6" strokeWidth="0.8" />
      <line x1="3" y1="7" x2="8" y2="7" stroke="#4ec9b0" strokeWidth="0.8" />
      <line x1="3" y1="9" x2="9" y2="9" stroke="#569cd6" strokeWidth="0.8" />
      <path d="M11 6l4 2.5L11 11V6z" fill="#4c88c8" stroke="#2a5a8a" strokeWidth="0.7" />
    </svg>
  ),
  run: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M3 2l11 6-11 6V2z" fill="#22a352" stroke="#177a3a" strokeWidth="0.8" />
    </svg>
  ),
  compileRun: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <rect x="0.5" y="2" width="8" height="10" rx="0.5" fill="#fff" stroke="#666" strokeWidth="0.7" />
      <line x1="2" y1="4.5" x2="7" y2="4.5" stroke="#569cd6" strokeWidth="0.6" />
      <line x1="2" y1="6.5" x2="6" y2="6.5" stroke="#4ec9b0" strokeWidth="0.6" />
      <line x1="2" y1="8.5" x2="7" y2="8.5" stroke="#569cd6" strokeWidth="0.6" />
      <path d="M10 4l5 4-5 4V4z" fill="#22a352" stroke="#177a3a" strokeWidth="0.6" />
    </svg>
  ),
  rebuild: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="0.5" fill="#4688c8" stroke="#2a5a8a" strokeWidth="0.6" />
      <rect x="9" y="1" width="6" height="6" rx="0.5" fill="#4688c8" stroke="#2a5a8a" strokeWidth="0.6" />
      <rect x="1" y="9" width="6" height="6" rx="0.5" fill="#4688c8" stroke="#2a5a8a" strokeWidth="0.6" />
      <rect x="9" y="9" width="6" height="6" rx="0.5" fill="#4688c8" stroke="#2a5a8a" strokeWidth="0.6" />
      <path d="M4 3l2 1-2 1z" fill="#fff" /><path d="M12 3l2 1-2 1z" fill="#fff" />
      <path d="M4 11l2 1-2 1z" fill="#fff" /><path d="M12 11l2 1-2 1z" fill="#fff" />
    </svg>
  ),
  stop: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <rect x="3" y="3" width="10" height="10" rx="1" fill="#c33" stroke="#922" strokeWidth="0.8" />
    </svg>
  ),
  debug: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" fill="none" stroke="#c63" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="2" fill="#c63" />
      <line x1="8" y1="1" x2="8" y2="3.5" stroke="#c63" /><line x1="8" y1="12.5" x2="8" y2="15" stroke="#c63" />
      <line x1="1" y1="8" x2="3.5" y2="8" stroke="#c63" /><line x1="12.5" y1="8" x2="15" y2="8" stroke="#c63" />
    </svg>
  ),
  syntax: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="2" width="10" height="12" rx="1" fill="#fff" stroke="#666" strokeWidth="0.8" />
      <line x1="3" y1="5" x2="9" y2="5" stroke="#569cd6" strokeWidth="0.7" />
      <line x1="3" y1="7" x2="8" y2="7" stroke="#569cd6" strokeWidth="0.7" />
      <path d="M10 10l2 2 4-5" stroke="#22a352" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  clean: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M4 3l2-2h4l2 2v1H4V3z" fill="#888" stroke="#555" strokeWidth="0.7" />
      <rect x="3" y="4" width="10" height="10" rx="1" fill="#aaa" stroke="#666" strokeWidth="0.7" />
      <line x1="6" y1="6" x2="6" y2="12" stroke="#777" strokeWidth="0.8" />
      <line x1="8" y1="6" x2="8" y2="12" stroke="#777" strokeWidth="0.8" />
      <line x1="10" y1="6" x2="10" y2="12" stroke="#777" strokeWidth="0.8" />
    </svg>
  ),
  cpp: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M3 1h6l4 4v10H3V1z" fill="#fff" stroke="#4688c8" />
      <path d="M9 1v4h4" fill="#d4e6f9" stroke="#4688c8" strokeLinejoin="round" />
      <text x="4" y="12.5" fill="#4688c8" fontSize="6" fontWeight="bold" fontFamily="Arial">{"C++"}</text>
    </svg>
  ),
  folder: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
      <path d="M1 3h5l2-2h7v1H8.5L6.5 4H1V3z" fill="#e8b73a" />
      <rect x="1" y="4" width="14" height="10" rx="1" fill="#f5d67b" stroke="#c9a227" strokeWidth="0.7" />
    </svg>
  ),
};

/* ================================================================
   PROGRAM TEMPLATES
   ================================================================ */
const PROGRAMS = [
  {
    label: "Area",
    filename: "Area",
    code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double height, width, area;\n    cout << "height=";\n    cin >> height;\n    cout << "width=";\n    cin >> width;\n    area = height * width;\n    cout << "area=" << area << endl;\n    return 0;\n}',
    output: 'Name: {NAME}\nID: {ID}\nheight=6\nwidth=7\narea=42\n\n--------------------------------\nProcess exited after 2.14 seconds with return value 0\nPress any key to continue . . .',
  },
  {
    label: "Temperature",
    filename: "Temperature",
    code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double Celsius, Fahrenheit;\n    cout << "Celsius=";\n    cin >> Celsius;\n    Fahrenheit = 9.0 / 5.0 * Celsius + 32;\n    cout << "Fahrenheit=" << Fahrenheit << endl;\n    return 0;\n}',
    output: 'Name: {NAME}\nID: {ID}\nCelsius=25\nFahrenheit=77\n\n--------------------------------\nProcess exited after 3.01 seconds with return value 0\nPress any key to continue . . .',
  },
  {
    label: "Math",
    filename: "Math",
    code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double x, y;\n    cout << "X=";\n    cin >> x;\n    cout << "Y=";\n    cin >> y;\n    cout << "addition=" << x + y << endl;\n    cout << "subtraction=" << x - y << endl;\n    cout << "multiplication=" << x * y << endl;\n    cout << "division=" << x / y << endl;\n    return 0;\n}',
    output: 'Name: {NAME}\nID: {ID}\nX=12\nY=2\naddition=14\nsubtraction=10\nmultiplication=24\ndivision=6\n\n--------------------------------\nProcess exited after 4.52 seconds with return value 0\nPress any key to continue . . .',
  },
  {
    label: "Currency",
    filename: "Currency",
    code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double EgyptianPound, AmericanDollar, BritishPound, EuropeanEuro;\n    cout << "Egyptian pound=";\n    cin >> EgyptianPound;\n    AmericanDollar = 0.0567 * EgyptianPound;\n    BritishPound = 0.0405 * EgyptianPound;\n    EuropeanEuro = 0.0458 * EgyptianPound;\n    cout << "American dollar=" << AmericanDollar << endl;\n    cout << "British pound=" << BritishPound << endl;\n    cout << "European euro=" << EuropeanEuro << endl;\n    return 0;\n}',
    output: 'Name: {NAME}\nID: {ID}\nEgyptian pound=685\nAmerican dollar=38.8395\nBritish pound=27.7425\nEuropean euro=31.373\n\n--------------------------------\nProcess exited after 2.88 seconds with return value 0\nPress any key to continue . . .',
  },
];

/* ================================================================
   CODE DATABASE — 10 VARIATIONS PER QUESTION
   ================================================================ */
const Q1_OUT = 'Name: {NAME}\nID: {ID}\nheight=6\nwidth=7\narea=42\n\n--------------------------------\nProcess exited after 2.14 seconds with return value 0\nPress any key to continue . . .';
const Q2_OUT = 'Name: {NAME}\nID: {ID}\nCelsius=25\nFahrenheit=77\n\n--------------------------------\nProcess exited after 3.01 seconds with return value 0\nPress any key to continue . . .';
const Q3_OUT = 'Name: {NAME}\nID: {ID}\nX=12\nY=2\naddition=14\nsubtraction=10\nmultiplication=24\ndivision=6\n\n--------------------------------\nProcess exited after 4.52 seconds with return value 0\nPress any key to continue . . .';
const Q4_OUT = 'Name: {NAME}\nID: {ID}\nEgyptian pound=685\nAmerican dollar=38.8395\nBritish pound=27.7425\nEuropean euro=31.373\n\n--------------------------------\nProcess exited after 2.88 seconds with return value 0\nPress any key to continue . . .';

const CodeDatabase = [
  // Q1 — Rectangle Area
  [
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double height, width, area;\n    cout << "height="; cin >> height;\n    cout << "width="; cin >> width;\n    area = height * width;\n    cout << "area=" << area << endl;\n    return 0;\n}', out: Q1_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\nID: {ID}\\n";\n    double h, w, a;\n    cout << "height="; cin >> h;\n    cout << "width="; cin >> w;\n    a = h * w;\n    cout << "area=" << a << "\\n";\n    return 0;\n}', out: Q1_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double height; double width;\n    cout << "height="; cin >> height;\n    cout << "width="; cin >> width;\n    cout << "area=" << (height * width) << endl;\n    return 0;\n}', out: Q1_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    float height, width, area;\n    cout << "height="; cin >> height;\n    cout << "width="; cin >> width;\n    area = width * height;\n    cout << "area=" << area << endl;\n    return 0;\n}', out: Q1_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double height, width;\n    cout << "height="; cin >> height;\n    cout << "width="; cin >> width;\n    double area = height * width;\n    cout << "area=" << area << endl;\n    return 0;\n}', out: Q1_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout<<"Name: {NAME}\\n"<<"ID: {ID}\\n";\n    double height,width,area;\n    cout<<"height="; cin>>height;\n    cout<<"width="; cin>>width;\n    area=height*width;\n    cout<<"area="<<area<<endl;\n    return 0;\n}', out: Q1_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\nID: {ID}\\n";\n    double H, W, AREA;\n    cout << "height="; cin >> H;\n    cout << "width="; cin >> W;\n    AREA = W * H;\n    cout << "area=" << AREA << endl;\n    return 0;\n}', out: Q1_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double length, width, result;\n    cout << "height="; cin >> length;\n    cout << "width="; cin >> width;\n    result = length * width;\n    cout << "area=" << result << endl;\n    return 0;\n}', out: Q1_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}" << endl << "ID: {ID}" << endl;\n    double height, width, area;\n    cout << "height="; cin >> height;\n    cout << "width="; cin >> width;\n    area = height * width;\n    cout << "area=" << area << endl;\n    return 0;\n}', out: Q1_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double height; cout << "height="; cin >> height;\n    double width;  cout << "width="; cin >> width;\n    double area = height * width;\n    cout << "area=" << area << "\\n";\n    return 0;\n}', out: Q1_OUT },
  ],
  // Q2 — Temperature
  [
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double Celsius, Fahrenheit;\n    cout << "Celsius="; cin >> Celsius;\n    Fahrenheit = 9.0 / 5.0 * Celsius + 32;\n    cout << "Fahrenheit=" << Fahrenheit << endl;\n    return 0;\n}', out: Q2_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double C, F;\n    cout << "Celsius="; cin >> C;\n    F = (1.8 * C) + 32;\n    cout << "Fahrenheit=" << F << "\\n";\n    return 0;\n}', out: Q2_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double Celsius;\n    cout << "Celsius="; cin >> Celsius;\n    cout << "Fahrenheit=" << (9.0 / 5.0 * Celsius + 32) << endl;\n    return 0;\n}', out: Q2_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\nID: {ID}\\n";\n    double cels, fahr;\n    cout << "Celsius="; cin >> cels;\n    fahr = (cels * 9.0 / 5.0) + 32;\n    cout << "Fahrenheit=" << fahr << endl;\n    return 0;\n}', out: Q2_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    float Celsius, Fahrenheit;\n    cout << "Celsius="; cin >> Celsius;\n    Fahrenheit = (9.0f / 5.0f) * Celsius + 32;\n    cout << "Fahrenheit=" << Fahrenheit << endl;\n    return 0;\n}', out: Q2_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double Celsius, Fahrenheit;\n    cout << "Celsius="; cin >> Celsius;\n    Fahrenheit = ((9.0 * Celsius) / 5.0) + 32;\n    cout << "Fahrenheit=" << Fahrenheit << endl;\n    return 0;\n}', out: Q2_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout<<"Name: {NAME}\\n"<<"ID: {ID}\\n";\n    double Celsius,Fahrenheit;\n    cout<<"Celsius=";cin>>Celsius;\n    Fahrenheit=9.0/5.0*Celsius+32;\n    cout<<"Fahrenheit="<<Fahrenheit<<endl;\n    return 0;\n}', out: Q2_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double Celsius;\n    cout << "Celsius="; cin >> Celsius;\n    double Fahrenheit = 32 + (Celsius * 1.8);\n    cout << "Fahrenheit=" << Fahrenheit << "\\n";\n    return 0;\n}', out: Q2_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double c, f;\n    cout << "Celsius="; cin >> c;\n    f = 32.0 + (9.0 / 5.0 * c);\n    cout << "Fahrenheit=" << f << endl;\n    return 0;\n}', out: Q2_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}" << endl << "ID: {ID}" << endl;\n    double Celsius;\n    double Fahrenheit;\n    cout << "Celsius="; cin >> Celsius;\n    Fahrenheit = 9.0 / 5.0 * Celsius + 32.0;\n    cout << "Fahrenheit=" << Fahrenheit << endl;\n    return 0;\n}', out: Q2_OUT },
  ],
  // Q3 — Math Operations
  [
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double x, y;\n    cout << "X="; cin >> x;\n    cout << "Y="; cin >> y;\n    cout << "addition=" << x + y << endl;\n    cout << "subtraction=" << x - y << endl;\n    cout << "multiplication=" << x * y << endl;\n    cout << "division=" << x / y << endl;\n    return 0;\n}', out: Q3_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double x, y;\n    cout << "X="; cin >> x;\n    cout << "Y="; cin >> y;\n    double add = x + y, sub = x - y, mul = x * y, div = x / y;\n    cout << "addition=" << add << endl;\n    cout << "subtraction=" << sub << endl;\n    cout << "multiplication=" << mul << endl;\n    cout << "division=" << div << endl;\n    return 0;\n}', out: Q3_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\nID: {ID}\\n";\n    double num1, num2;\n    cout << "X="; cin >> num1;\n    cout << "Y="; cin >> num2;\n    cout << "addition=" << num1 + num2 << "\\n";\n    cout << "subtraction=" << num1 - num2 << "\\n";\n    cout << "multiplication=" << num1 * num2 << "\\n";\n    cout << "division=" << num1 / num2 << "\\n";\n    return 0;\n}', out: Q3_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    float x, y;\n    cout << "X="; cin >> x;\n    cout << "Y="; cin >> y;\n    cout << "addition=" << x+y << endl << "subtraction=" << x-y << endl;\n    cout << "multiplication=" << x*y << endl << "division=" << x/y << endl;\n    return 0;\n}', out: Q3_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double A, B;\n    cout << "X="; cin >> A;\n    cout << "Y="; cin >> B;\n    cout << "addition=" << A + B << endl;\n    cout << "subtraction=" << A - B << endl;\n    cout << "multiplication=" << A * B << endl;\n    cout << "division=" << A / B << endl;\n    return 0;\n}', out: Q3_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout<<"Name: {NAME}\\n"<<"ID: {ID}\\n";\n    double x,y;\n    cout<<"X=";cin>>x;\n    cout<<"Y=";cin>>y;\n    cout<<"addition="<<x+y<<endl;\n    cout<<"subtraction="<<x-y<<endl;\n    cout<<"multiplication="<<x*y<<endl;\n    cout<<"division="<<x/y<<endl;\n    return 0;\n}', out: Q3_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double x, y;\n    cout << "X="; cin >> x; cout << "Y="; cin >> y;\n    double add = x+y;\n    double sub = x-y;\n    double mul = x*y;\n    double div = x/y;\n    cout << "addition=" << add << "\\n";\n    cout << "subtraction=" << sub << "\\n";\n    cout << "multiplication=" << mul << "\\n";\n    cout << "division=" << div << "\\n";\n    return 0;\n}', out: Q3_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double x, y, res;\n    cout << "X="; cin >> x; cout << "Y="; cin >> y;\n    res = x + y; cout << "addition=" << res << endl;\n    res = x - y; cout << "subtraction=" << res << endl;\n    res = x * y; cout << "multiplication=" << res << endl;\n    res = x / y; cout << "division=" << res << endl;\n    return 0;\n}', out: Q3_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double x, y;\n    cout << "X="; cin >> x;\n    cout << "Y="; cin >> y;\n    cout << "addition=" << (x + y) << endl;\n    cout << "subtraction=" << (x - y) << endl;\n    cout << "multiplication=" << (x * y) << endl;\n    cout << "division=" << (x / y) << endl;\n    return 0;\n}', out: Q3_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double x, y;\n    cout << "X="; cin >> x;\n    cout << "Y="; cin >> y;\n    cout << "addition=" << x+y << "\\n" << "subtraction=" << x-y << "\\n" << "multiplication=" << x*y << "\\n" << "division=" << x/y << "\\n";\n    return 0;\n}', out: Q3_OUT },
  ],
  // Q4 — Currency
  [
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double EgyptianPound, AmericanDollar, BritishPound, EuropeanEuro;\n    cout << "Egyptian pound="; cin >> EgyptianPound;\n    AmericanDollar = 0.0567 * EgyptianPound;\n    BritishPound = 0.0405 * EgyptianPound;\n    EuropeanEuro = 0.0458 * EgyptianPound;\n    cout << "American dollar=" << AmericanDollar << endl;\n    cout << "British pound=" << BritishPound << endl;\n    cout << "European euro=" << EuropeanEuro << endl;\n    return 0;\n}', out: Q4_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double egp, usd, gbp, eur;\n    cout << "Egyptian pound="; cin >> egp;\n    usd = egp * 0.0567;\n    gbp = egp * 0.0405;\n    eur = egp * 0.0458;\n    cout << "American dollar=" << usd << endl;\n    cout << "British pound=" << gbp << endl;\n    cout << "European euro=" << eur << endl;\n    return 0;\n}', out: Q4_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double EgyptianPound;\n    cout << "Egyptian pound="; cin >> EgyptianPound;\n    cout << "American dollar=" << (EgyptianPound * 0.0567) << endl;\n    cout << "British pound=" << (EgyptianPound * 0.0405) << endl;\n    cout << "European euro=" << (EgyptianPound * 0.0458) << endl;\n    return 0;\n}', out: Q4_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double EgyptianPound, AmericanDollar, BritishPound, EuropeanEuro;\n    const double usd_rate = 0.0567, gbp_rate = 0.0405, eur_rate = 0.0458;\n    cout << "Egyptian pound="; cin >> EgyptianPound;\n    AmericanDollar = EgyptianPound * usd_rate;\n    BritishPound = EgyptianPound * gbp_rate;\n    EuropeanEuro = EgyptianPound * eur_rate;\n    cout << "American dollar=" << AmericanDollar << "\\n";\n    cout << "British pound=" << BritishPound << "\\n";\n    cout << "European euro=" << EuropeanEuro << "\\n";\n    return 0;\n}', out: Q4_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    float EgyptianPound, AmericanDollar, BritishPound, EuropeanEuro;\n    cout << "Egyptian pound="; cin >> EgyptianPound;\n    AmericanDollar = 0.0567f * EgyptianPound;\n    BritishPound = 0.0405f * EgyptianPound;\n    EuropeanEuro = 0.0458f * EgyptianPound;\n    cout << "American dollar=" << AmericanDollar << endl;\n    cout << "British pound=" << BritishPound << endl;\n    cout << "European euro=" << EuropeanEuro << endl;\n    return 0;\n}', out: Q4_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double EgyptianPound;\n    cout << "Egyptian pound="; cin >> EgyptianPound;\n    double AmericanDollar = EgyptianPound * 0.0567;\n    double BritishPound = EgyptianPound * 0.0405;\n    double EuropeanEuro = EgyptianPound * 0.0458;\n    cout << "American dollar=" << AmericanDollar << endl;\n    cout << "British pound=" << BritishPound << endl;\n    cout << "European euro=" << EuropeanEuro << endl;\n    return 0;\n}', out: Q4_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout<<"Name: {NAME}\\n"<<"ID: {ID}\\n";\n    double EgyptianPound,AmericanDollar,BritishPound,EuropeanEuro;\n    cout<<"Egyptian pound=";cin>>EgyptianPound;\n    AmericanDollar=0.0567*EgyptianPound;\n    BritishPound=0.0405*EgyptianPound;\n    EuropeanEuro=0.0458*EgyptianPound;\n    cout<<"American dollar="<<AmericanDollar<<"\\n";\n    cout<<"British pound="<<BritishPound<<"\\n";\n    cout<<"European euro="<<EuropeanEuro<<"\\n";\n    return 0;\n}', out: Q4_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\nID: {ID}\\n";\n    double EGP, USD, GBP, EUR;\n    cout << "Egyptian pound="; cin >> EGP;\n    USD = 0.0567 * EGP;\n    GBP = 0.0405 * EGP;\n    EUR = 0.0458 * EGP;\n    cout << "American dollar=" << USD << endl;\n    cout << "British pound=" << GBP << endl;\n    cout << "European euro=" << EUR << endl;\n    return 0;\n}', out: Q4_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double EgyptianPound;\n    double AmericanDollar;\n    double BritishPound;\n    double EuropeanEuro;\n    cout << "Egyptian pound="; cin >> EgyptianPound;\n    AmericanDollar = EgyptianPound * 0.0567;\n    BritishPound = EgyptianPound * 0.0405;\n    EuropeanEuro = EgyptianPound * 0.0458;\n    cout << "American dollar=" << AmericanDollar << endl;\n    cout << "British pound=" << BritishPound << endl;\n    cout << "European euro=" << EuropeanEuro << endl;\n    return 0;\n}', out: Q4_OUT },
    { code: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Name: {NAME}\\n" << "ID: {ID}\\n";\n    double EgyptianPound, AmericanDollar, BritishPound, EuropeanEuro;\n    cout << "Egyptian pound="; cin >> EgyptianPound;\n    AmericanDollar = 0.0567 * EgyptianPound;\n    BritishPound = 0.0405 * EgyptianPound;\n    EuropeanEuro = 0.0458 * EgyptianPound;\n    cout << "American dollar=" << AmericanDollar << "\\n"\n         << "British pound=" << BritishPound << "\\n"\n         << "European euro=" << EuropeanEuro << "\\n";\n    return 0;\n}', out: Q4_OUT },
  ],
];

/* ================================================================
   SYNTAX HIGHLIGHTER
   ================================================================ */
const KW = new Set(["int","double","float","char","void","bool","return","if","else","for","while","do","switch","case","break","continue","const","static","class","struct","namespace","using","public","private","protected","virtual","template","typename","typedef","enum","sizeof","new","delete","true","false","try","catch","throw","auto","register","volatile","extern","inline"]);
const STD = new Set(["cout","cin","endl","string","vector","map","set","pair","queue","stack","deque","list","array","bitset","tuple","cerr","clog"]);

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlight(code: string): string {
  return code
    .split("\n")
    .map((line) => {
      if (/^\s*#/.test(line))
        return `<span style="color:#c586c0">${esc(line)}</span>`;
      let r = "",
        i = 0;
      while (i < line.length) {
        if (line[i] === '"') {
          let e = i + 1;
          while (e < line.length && line[e] !== '"') {
            if (line[e] === "\\") e++;
            e++;
          }
          e = Math.min(e + 1, line.length);
          r += `<span style="color:#ce9178">${esc(line.slice(i, e))}</span>`;
          i = e;
        } else if (line[i] === "/" && line[i + 1] === "/") {
          r += `<span style="color:#6a9955">${esc(line.slice(i))}</span>`;
          i = line.length;
        } else if (/[a-zA-Z_]/.test(line[i])) {
          let e = i;
          while (e < line.length && /\w/.test(line[e])) e++;
          const w = line.slice(i, e);
          if (KW.has(w))
            r += `<span style="color:#569cd6;font-weight:700">${esc(w)}</span>`;
          else if (STD.has(w))
            r += `<span style="color:#4ec9b0">${esc(w)}</span>`;
          else if (w === "main" || w === "std")
            r += `<span style="color:#dcdcaa">${esc(w)}</span>`;
          else r += `<span style="color:#9cdcfe">${esc(w)}</span>`;
          i = e;
        } else if (/[0-9]/.test(line[i])) {
          let e = i;
          while (e < line.length && /[0-9.]/.test(line[e])) e++;
          r += `<span style="color:#b5cea8">${esc(line.slice(i, e))}</span>`;
          i = e;
        } else if ("{}()[];,".includes(line[i])) {
          r += `<span style="color:#ffd700">${esc(line[i])}</span>`;
          i++;
        } else if ("<<>>+-*/=%!&|^~?:".includes(line[i])) {
          r += `<span style="color:#d4d4d4">${esc(line[i])}</span>`;
          i++;
        } else {
          r += esc(line[i]);
          i++;
        }
      }
      return r;
    })
    .join("\n");
}

/* ================================================================
   MEMOIZED SUB-COMPONENTS
   ================================================================ */
const TbBtn = memo(function TbBtn({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div
      className="tb-icon"
      title={title}
      style={{
        width: 22,
        height: 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "default",
        borderRadius: 2,
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
});

const Sep = memo(function Sep() {
  return (
    <div
      style={{
        width: 1,
        height: 18,
        background: "#c0c0c0",
        margin: "0 3px",
        flexShrink: 0,
      }}
    />
  );
});

/* ================================================================
   MAIN APPLICATION
   ================================================================ */
export default function DevCppSimulator() {
  const [themeIdx, setThemeIdx] = useState(0);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [pcName, setPcName] = useState("Student");
  const [filename, setFilename] = useState("Untitled1");
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [liveCodes, setLiveCodes] = useState(() => PROGRAMS.map((p) => p.code));
  const [liveOutputs, setLiveOutputs] = useState(() => PROGRAMS.map((p) => p.output));
  const [consolePos, setConsolePos] = useState({ x: 180, y: 60 });
  const [consoleSize, setConsoleSize] = useState({ w: 620, h: 280 });
  const [showConsole, setShowConsole] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [batchProgress, setBatchProgress] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(
    null
  );
  const [themeOpen, setThemeOpen] = useState(false);

  const captureRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ on: false, ox: 0, oy: 0 });
  const resRef = useRef({ on: false, sx: 0, sy: 0, sw: 0, sh: 0 });
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const th = THEMES[themeIdx];
  const dn = studentName || "{NAME}";
  const di = studentId || "{ID}";

  const resolvedCode = useMemo(
    () => liveCodes[activeTab].replace(/\{NAME\}/g, dn).replace(/\{ID\}/g, di),
    [liveCodes, activeTab, dn, di]
  );

  const resolvedOutput = useMemo(
    () =>
      liveOutputs[activeTab]
        .replace(/\{NAME\}/g, dn)
        .replace(/\{ID\}/g, di),
    [liveOutputs, activeTab, dn, di]
  );

  const highlighted = useMemo(() => highlight(resolvedCode), [resolvedCode]);
  const lineCount = useMemo(
    () => resolvedCode.split("\n").length,
    [resolvedCode]
  );

  const cppFile = `${filename}.cpp`;
  const devFile = `${filename}.dev`;

  /* --- Toast --- */
  const showToast = useCallback((msg: string, type = "info") => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  /* --- Code update --- */
  const updateCode = useCallback((i: number, v: string) => {
    setLiveCodes((p) => {
      const n = [...p];
      n[i] = v;
      return n;
    });
  }, []);

  /* --- Hard Reset --- */
  const hardReset = useCallback(() => {
    setLiveCodes(PROGRAMS.map((p) => p.code));
    setLiveOutputs(PROGRAMS.map((p) => p.output));
    setStudentName("");
    setStudentId("");
    setPcName("Student");
    setFilename("Untitled1");
    setActiveTab(0);
    setEditMode(false);
    setConsolePos({ x: 180, y: 60 });
    setConsoleSize({ w: 620, h: 280 });
    setShowConsole(true);
    showToast("Reset to defaults", "danger");
  }, [showToast]);

  /* --- Randomize Solutions --- */
  const randomizeSolutions = useCallback(() => {
    const newCodes = CodeDatabase.map((variants) => {
      const v = variants[Math.floor(Math.random() * variants.length)];
      return v.code;
    });
    const newOutputs = CodeDatabase.map((variants) => {
      const v = variants[Math.floor(Math.random() * variants.length)];
      return v.out;
    });
    setLiveCodes(newCodes);
    setLiveOutputs(newOutputs);
    showToast("🎲 New code variations applied!", "success");
  }, [showToast]);

  /* --- Console drag (mouse+touch) --- */
  const startDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!captureRef.current) return;
      const r = captureRef.current.getBoundingClientRect();
      dragRef.current = {
        on: true,
        ox: clientX - r.left - consolePos.x,
        oy: clientY - r.top - consolePos.y,
      };
    },
    [consolePos]
  );

  const onDragMouseDown = useCallback(
    (e: React.MouseEvent) => {
      startDrag(e.clientX, e.clientY);
      e.preventDefault();
    },
    [startDrag]
  );

  const onDragTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
    },
    [startDrag]
  );

  /* --- Console resize (mouse+touch) --- */
  const startResize = useCallback(
    (clientX: number, clientY: number) => {
      resRef.current = {
        on: true,
        sx: clientX,
        sy: clientY,
        sw: consoleSize.w,
        sh: consoleSize.h,
      };
    },
    [consoleSize]
  );

  const onResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      startResize(e.clientX, e.clientY);
      e.preventDefault();
      e.stopPropagation();
    },
    [startResize]
  );

  const onResizeTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      startResize(touch.clientX, touch.clientY);
      e.stopPropagation();
    },
    [startResize]
  );

  useEffect(() => {
    const move = (cx: number, cy: number) => {
      if (dragRef.current.on && captureRef.current) {
        const r = captureRef.current.getBoundingClientRect();
        setConsolePos({
          x: Math.max(
            0,
            Math.min(r.width - 80, cx - r.left - dragRef.current.ox)
          ),
          y: Math.max(
            0,
            Math.min(r.height - 30, cy - r.top - dragRef.current.oy)
          ),
        });
      }
      if (resRef.current.on) {
        setConsoleSize({
          w: Math.max(280, resRef.current.sw + (cx - resRef.current.sx)),
          h: Math.max(120, resRef.current.sh + (cy - resRef.current.sy)),
        });
      }
    };
    const end = () => {
      dragRef.current.on = false;
      resRef.current.on = false;
    };
    const onMM = (e: MouseEvent) => move(e.clientX, e.clientY);
    const onTM = (e: TouchEvent) => {
      if (dragRef.current.on || resRef.current.on) {
        e.preventDefault();
        move(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onMU = () => end();
    const onTE = () => end();
    window.addEventListener("mousemove", onMM);
    window.addEventListener("mouseup", onMU);
    window.addEventListener("touchmove", onTM, { passive: false });
    window.addEventListener("touchend", onTE);
    return () => {
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("mouseup", onMU);
      window.removeEventListener("touchmove", onTM);
      window.removeEventListener("touchend", onTE);
    };
  }, []);

  /* --- Screenshot --- */
  const captureShot = useCallback(
    async (tabIdx?: number) => {
      if (!captureRef.current) return;
      setIsCapturing(true);
      await new Promise((r) => setTimeout(r, 150));
      try {
        const url = await toPng(captureRef.current, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: "#f0f0f0",
        });
        const a = document.createElement("a");
        const idx = tabIdx ?? activeTab;
        a.download = `${studentName || "Student"}_${studentId || "ID"}_${PROGRAMS[idx].filename}.png`;
        a.href = url;
        a.click();
        showToast(`Captured: ${PROGRAMS[idx].label}`, "success");
      } catch {
        showToast("Capture failed -- try again", "danger");
      } finally {
        setIsCapturing(false);
      }
    },
    [activeTab, studentName, studentId, showToast]
  );

  const batchCapture = useCallback(async () => {
    if (!captureRef.current) return;
    for (let i = 0; i < PROGRAMS.length; i++) {
      setBatchProgress(
        `Capturing ${PROGRAMS[i].label} (${i + 1}/${PROGRAMS.length})`
      );
      setActiveTab(i);
      const randomDelay = Math.floor(Math.random() * (2000 - 600 + 1)) + 600;
      await new Promise((r) => setTimeout(r, randomDelay));
      setIsCapturing(true);
      await new Promise((r) => setTimeout(r, 150));
      try {
        const url = await toPng(captureRef.current, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: "#f0f0f0",
        });
        const a = document.createElement("a");
        a.download = `${studentName || "Student"}_${studentId || "ID"}_${PROGRAMS[i].filename}.png`;
        a.href = url;
        a.click();
      } catch {
        /* skip */
      } finally {
        setIsCapturing(false);
      }
      await new Promise((r) => setTimeout(r, 400));
    }
    setBatchProgress(null);
    showToast("All 4 screenshots captured!", "success");
  }, [studentName, studentId, showToast]);

  /* Toast colors */
  const toastColor =
    toast?.type === "success"
      ? th.success
      : toast?.type === "danger"
        ? th.danger
        : toast?.type === "warn"
          ? th.warn
          : th.accent;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: th.bg,
        fontFamily:
          "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
        color: th.text,
        transition: "background 0.3s",
      }}
    >
      {/* ====== TOAST ====== */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 9999,
            padding: "10px 18px",
            borderRadius: 10,
            background: th.card,
            border: `1px solid ${toastColor}55`,
            color: th.text,
            fontSize: 13,
            fontWeight: 500,
            boxShadow: `0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px ${toastColor}22`,
            animation: "toastIn 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: 8,
            maxWidth: "calc(100vw - 32px)",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: toastColor,
              flexShrink: 0,
            }}
          />
          {toast.msg}
        </div>
      )}

      {/* ====== DASHBOARD ====== */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "16px 16px 10px",
        }}
      >
        {/* Header Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 9,
              background: th.card,
              border: `1px solid ${th.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: th.glow,
            }}
          >
            {I.main(24)}
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <h1
              style={{
                fontSize: 17,
                fontWeight: 700,
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                color: th.text,
              }}
            >
              Dev-C++ 5.11 Simulator
            </h1>
            <p
              style={{
                fontSize: 11,
                margin: "1px 0 0",
                color: th.muted,
              }}
            >
              Auto-Capture Engine
            </p>
          </div>

          {batchProgress && (
            <div
              style={{
                padding: "5px 12px",
                borderRadius: 7,
                fontSize: 11,
                fontWeight: 600,
                background: `${th.accent}18`,
                color: th.accent,
                border: `1px solid ${th.accent}33`,
                animation: "pulse 1.5s infinite",
                whiteSpace: "nowrap",
              }}
            >
              {batchProgress}
            </div>
          )}

          {/* Theme Selector */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              style={{
                padding: "7px 12px",
                borderRadius: 7,
                border: `1px solid ${th.border}`,
                background: th.card,
                color: th.muted,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: th.accent,
                  flexShrink: 0,
                }}
              />
              <span className="theme-name-text">{th.name}</span>
              <span style={{ fontSize: 8, opacity: 0.6 }}>
                {themeOpen ? "\u25B2" : "\u25BC"}
              </span>
            </button>
            {themeOpen && (
              <>
                <div
                  style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 98,
                  }}
                  onClick={() => setThemeOpen(false)}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: 4,
                    zIndex: 100,
                    background: th.card,
                    border: `1px solid ${th.border}`,
                    borderRadius: 10,
                    padding: 4,
                    minWidth: 200,
                    maxWidth: "calc(100vw - 32px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
                  }}
                >
                  {THEMES.map((t2, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setThemeIdx(i);
                        setThemeOpen(false);
                        showToast(`Theme: ${t2.name}`, "info");
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                        padding: "7px 8px",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        background:
                          i === themeIdx
                            ? `${t2.tabActive}22`
                            : "transparent",
                        color: th.text,
                        fontSize: 12,
                        fontWeight: i === themeIdx ? 600 : 400,
                        transition: "background 0.1s",
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: t2.tabActive,
                          border: `2px solid ${i === themeIdx ? t2.tabActive : "transparent"}`,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ flex: 1 }}>{t2.name}</span>
                      <span
                        style={{
                          fontSize: 9,
                          color: th.muted,
                          background: th.border,
                          padding: "1px 5px",
                          borderRadius: 3,
                        }}
                      >
                        {t2.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Inputs */}
        <div className="inputs-grid" style={{ marginBottom: 10 }}>
          {(
            [
              ["Student Name", studentName, setStudentName, "Enter full name"],
              ["Student ID", studentId, setStudentId, "Enter student ID"],
              ["PC Name", pcName, setPcName, "PC name"],
              ["Filename", filename, setFilename, "File prefix"],
            ] as [string, string, (v: string) => void, string][]
          ).map(([label, val, set, ph]) => (
            <div key={label}>
              <label
                style={{
                  display: "block",
                  fontSize: 9,
                  fontWeight: 700,
                  color: th.muted,
                  marginBottom: 4,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </label>
              <input
                className="dash-input"
                value={val}
                onChange={(e) => set(e.target.value)}
                placeholder={ph}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  background: th.inputBg,
                  border: `1px solid ${th.inputBorder}`,
                  borderRadius: 6,
                  color: th.text,
                  fontSize: 13,
                  outline: "none",
                  transition: "all 0.15s",
                }}
              />
            </div>
          ))}
        </div>

        {/* Tabs + Buttons */}
        <div className="controls-row">
          <div
            className="tabs-bar"
            style={{
              display: "flex",
              background: th.tabBg,
              borderRadius: 8,
              padding: 3,
              gap: 2,
              flexShrink: 0,
            }}
          >
            {PROGRAMS.map((p, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 5,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 600,
                  transition: "all 0.15s",
                  background:
                    activeTab === i ? th.tabActive : "transparent",
                  color:
                    activeTab === i
                      ? th.tabActiveText
                      : th.tabInactiveText,
                  whiteSpace: "nowrap",
                }}
              >
                <span className="tab-full">{`P${i}: ${p.label}`}</span>
                <span className="tab-short">{`${p.label}`}</span>
              </button>
            ))}
          </div>

          <div style={{ flex: 1, minWidth: 4 }} />

          <div className="action-btns">
            <button
              className="dash-btn dash-btn-randomize"
              onClick={randomizeSolutions}
              style={{
                padding: "7px 13px",
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                border: "none",
                borderRadius: 6,
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              🎲 Randomize
            </button>

            <button
              className="dash-btn"
              onClick={() => {
                setShowConsole((v) => !v);
                showToast(
                  showConsole ? "Console hidden" : "Console shown",
                  "info"
                );
              }}
              style={{
                padding: "7px 12px",
                background: th.card,
                border: `1px solid ${th.border}`,
                borderRadius: 6,
                color: th.muted,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {showConsole ? "Hide Console" : "Show Console"}
            </button>

            <button
              className="dash-btn dash-btn-warn"
              onClick={() => {
                setEditMode((v) => !v);
                showToast(
                  editMode ? "Editor locked" : "Edit mode ON",
                  "warn"
                );
              }}
              style={{
                padding: "7px 12px",
                background: th.warn,
                border: "none",
                borderRadius: 6,
                color: "#000",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {editMode ? "Lock" : "Edit"}
            </button>

            <button
              className="dash-btn dash-btn-danger"
              onClick={hardReset}
              style={{
                padding: "7px 12px",
                background: th.danger,
                border: "none",
                borderRadius: 6,
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reset
            </button>

            <button
              className="dash-btn dash-btn-success"
              onClick={() => captureShot()}
              style={{
                padding: "7px 12px",
                background: th.success,
                border: "none",
                borderRadius: 6,
                color: "#000",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Capture
            </button>

            <button
              className="dash-btn dash-btn-primary"
              onClick={batchCapture}
              style={{
                padding: "7px 12px",
                background: th.primary,
                border: "none",
                borderRadius: 6,
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Batch All
            </button>
          </div>
        </div>
      </div>

      {/* ====== DEV-C++ IDE ====== */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 16px 40px",
        }}
      >
        <div
          ref={captureRef}
          className="dev-cpp"
          style={{
            position: "relative",
            background: "#f0f0f0",
            border: "1px solid #888",
            overflow: "hidden",
            fontFamily: "'Segoe UI',Tahoma,Geneva,Verdana,sans-serif",
            fontSize: 12,
            color: "#000",
            minHeight: 540,
          }}
        >
          {/* Title Bar */}
          <div
            style={{
              height: 28,
              background:
                "linear-gradient(180deg,#4a90d9 0%,#2b6cb0 50%,#1e5799 100%)",
              display: "flex",
              alignItems: "center",
              padding: "0 3px 0 8px",
              gap: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                flex: 1,
                minWidth: 0,
              }}
            >
              {I.main(14)}
              <span
                style={{
                  color: "#fff",
                  fontSize: 11,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {`Dev-C++ 5.11 - [${devFile}] - ${cppFile}`}
              </span>
            </div>
            <div style={{ display: "flex" }}>
              {[
                { s: "\u2500", cls: "wctl-min" },
                { s: "\u25a1", cls: "wctl-max" },
                { s: "\u2715", cls: "wctl-close" },
              ].map((b, i) => (
                <div
                  key={i}
                  className={`wctl ${b.cls}`}
                  style={{
                    width: 28,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: "#fff",
                    cursor: "default",
                  }}
                >
                  {b.s}
                </div>
              ))}
            </div>
          </div>

          {/* Menu Bar */}
          <div
            style={{
              height: 22,
              background: "#f0f0f0",
              borderBottom: "1px solid #c0c0c0",
              display: "flex",
              alignItems: "center",
              padding: "0 2px",
              overflowX: "auto",
            }}
          >
            {[
              "File",
              "Edit",
              "Search",
              "View",
              "Project",
              "Execute",
              "Tools",
              "AStyle",
              "Window",
              "Help",
            ].map((m) => (
              <span
                key={m}
                className="mitem"
                style={{
                  padding: "2px 7px",
                  fontSize: 11,
                  cursor: "default",
                  borderRadius: 2,
                  whiteSpace: "nowrap",
                }}
              >
                {m}
              </span>
            ))}
          </div>

          {/* Toolbar */}
          <div
            className="toolbar-row"
            style={{
              height: 28,
              background:
                "linear-gradient(180deg,#fafafa 0%,#e8e8e8 100%)",
              borderBottom: "1px solid #bbb",
              display: "flex",
              alignItems: "center",
              padding: "0 4px",
              gap: 1,
              overflowX: "auto",
            }}
          >
            <TbBtn title="New">{I.newFile()}</TbBtn>
            <TbBtn title="Open">{I.open()}</TbBtn>
            <TbBtn title="Save">{I.save()}</TbBtn>
            <TbBtn title="Save All">{I.saveAll()}</TbBtn>
            <TbBtn title="Close">{I.close()}</TbBtn>
            <Sep />
            <TbBtn title="Print">{I.print()}</TbBtn>
            <Sep />
            <TbBtn title="Undo">{I.undo()}</TbBtn>
            <TbBtn title="Redo">{I.redo()}</TbBtn>
            <TbBtn title="Cut">{I.cut()}</TbBtn>
            <TbBtn title="Copy">{I.copy()}</TbBtn>
            <TbBtn title="Paste">{I.paste()}</TbBtn>
            <TbBtn title="Select All">{I.selAll()}</TbBtn>
            <Sep />
            <TbBtn title="Find">{I.find()}</TbBtn>
            <TbBtn title="Replace">{I.replace()}</TbBtn>
            <Sep />
            <TbBtn title="Compile">{I.compile()}</TbBtn>
            <TbBtn title="Run">{I.run()}</TbBtn>
            <TbBtn title="Compile &amp; Run">{I.compileRun()}</TbBtn>
            <TbBtn title="Rebuild All">{I.rebuild()}</TbBtn>
            <TbBtn title="Stop">{I.stop()}</TbBtn>
            <TbBtn title="Debug">{I.debug()}</TbBtn>
            <TbBtn title="Syntax Check">{I.syntax()}</TbBtn>
            <TbBtn title="Clean">{I.clean()}</TbBtn>
          </div>

          {/* Body */}
          <div className="ide-body" style={{ display: "flex", minHeight: 420 }}>
            {/* Sidebar */}
            <div
              className="ide-sidebar"
              style={{
                width: 170,
                borderRight: "1px solid #c0c0c0",
                background: "#fff",
                fontSize: 11,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  height: 22,
                  background:
                    "linear-gradient(180deg,#f0f0f0 0%,#e0e0e0 100%)",
                  borderBottom: "1px solid #c0c0c0",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 6px",
                  fontWeight: 600,
                }}
              >
                Project
              </div>
              <div style={{ padding: "3px 2px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "2px 4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 8,
                      color: "#888",
                      width: 10,
                      textAlign: "center",
                    }}
                  >
                    {"\u25BC"}
                  </span>
                  {I.folder(13)}
                  <span style={{ fontWeight: 600, fontSize: 11 }}>
                    {devFile}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "2px 4px 2px 22px",
                    background: "#e8f0fe",
                    borderRadius: 2,
                    margin: "1px 2px",
                  }}
                >
                  {I.cpp(13)}
                  <span style={{ fontSize: 11 }}>{cppFile}</span>
                </div>
              </div>
            </div>

            {/* Editor */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
              }}
            >
              {/* Editor Tab */}
              <div
                style={{
                  height: 24,
                  background: "#e8e8e8",
                  borderBottom: "1px solid #c0c0c0",
                  display: "flex",
                  alignItems: "stretch",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "0 10px 0 7px",
                    background: "#fff",
                    borderRight: "1px solid #c0c0c0",
                    borderTop: "2px solid #3b82f6",
                    fontSize: 11,
                  }}
                >
                  {I.cpp(12)}
                  <span>{cppFile}</span>
                  <span
                    style={{
                      fontSize: 10,
                      color: "#aaa",
                      marginLeft: 4,
                      cursor: "pointer",
                    }}
                  >
                    {"\u2715"}
                  </span>
                </div>
              </div>

              {/* Code area */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  background: "#1e1e1e",
                  position: "relative",
                  overflow: "auto",
                }}
              >
                {/* Gutter */}
                <div
                  style={{
                    width: 44,
                    background: "#252526",
                    borderRight: "1px solid #333",
                    textAlign: "right",
                    padding: "6px 6px 6px 0",
                    fontFamily: "'Consolas','Courier New',monospace",
                    fontSize: 13,
                    lineHeight: "20px",
                    color: "#858585",
                    userSelect: "none",
                    flexShrink: 0,
                  }}
                >
                  {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Code */}
                <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
                  <pre
                    style={{
                      margin: 0,
                      padding: "6px 10px",
                      fontFamily: "'Consolas','Courier New',monospace",
                      fontSize: 13,
                      lineHeight: "20px",
                      whiteSpace: "pre",
                      background: "transparent",
                      minHeight: "100%",
                    }}
                    dangerouslySetInnerHTML={{ __html: highlighted }}
                  />
                  {editMode && !isCapturing && (
                    <textarea
                      value={liveCodes[activeTab]}
                      onChange={(e) => updateCode(activeTab, e.target.value)}
                      spellCheck={false}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        padding: "6px 10px",
                        fontFamily: "'Consolas','Courier New',monospace",
                        fontSize: 13,
                        lineHeight: "20px",
                        background: "rgba(30,30,30,0.01)",
                        color: "transparent",
                        caretColor: "#fff",
                        border: "none",
                        outline: "none",
                        resize: "none",
                        overflow: "hidden",
                        whiteSpace: "pre",
                        zIndex: 2,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div
            style={{
              height: 20,
              background:
                "linear-gradient(180deg,#e8e8e8 0%,#d8d8d8 100%)",
              borderTop: "1px solid #bbb",
              display: "flex",
              alignItems: "center",
              padding: "0 8px",
              fontSize: 10,
              color: "#555",
              gap: 12,
            }}
          >
            <span>{"Line: 1  Col: 1"}</span>
            <span
              style={{ width: 1, height: 12, background: "#bbb" }}
            />
            <span>{"File: "}{cppFile}</span>
            <span style={{ flex: 1 }} />
            {editMode && (
              <span style={{ color: "#e8a020", fontWeight: 700 }}>
                EDIT MODE
              </span>
            )}
            <span>Insert</span>
          </div>

          {/* ====== CONSOLE ====== */}
          {showConsole && (
            <div
              className="console-window"
              style={{
                position: "absolute",
                left: consolePos.x,
                top: consolePos.y,
                width: consoleSize.w,
                height: consoleSize.h,
                zIndex: 50,
                display: "flex",
                flexDirection: "column",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.35)",
                border: "1px solid #555",
                maxWidth: "calc(100% - 20px)",
              }}
            >
              {/* Console Title */}
              <div
                onMouseDown={onDragMouseDown}
                onTouchStart={onDragTouchStart}
                style={{
                  height: 28,
                  minHeight: 28,
                  background:
                    "linear-gradient(180deg,#3a3a3a 0%,#2a2a2a 50%,#1a1a1a 100%)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 4px 0 8px",
                  gap: 6,
                  cursor: "move",
                  flexShrink: 0,
                  userSelect: "none",
                  touchAction: "none",
                }}
              >
                {I.main(13)}
                <span
                  style={{
                    color: "#ccc",
                    fontSize: 11,
                    flex: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {`C:\\Users\\${pcName}\\Desktop\\${cppFile}`}
                </span>
                <div style={{ display: "flex" }}>
                  {["\u2500", "\u25a1"].map((s, i) => (
                    <div
                      key={i}
                      className="cctl"
                      style={{
                        width: 24,
                        height: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 9,
                        color: "#888",
                        cursor: "pointer",
                      }}
                    >
                      {s}
                    </div>
                  ))}
                  <div
                    className="cctl cclose"
                    onClick={() => setShowConsole(false)}
                    style={{
                      width: 24,
                      height: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      color: "#888",
                      cursor: "pointer",
                    }}
                  >
                    {"\u2715"}
                  </div>
                </div>
              </div>

              {/* Console Body */}
              <div
                style={{
                  flex: 1,
                  background: "#0c0c0c",
                  padding: "8px 10px",
                  fontFamily:
                    "'Consolas','Lucida Console','Courier New',monospace",
                  fontSize: 13,
                  lineHeight: "20px",
                  color: "#cccccc",
                  whiteSpace: "pre-wrap",
                  overflow: "auto",
                  wordBreak: "break-word",
                }}
              >
                {resolvedOutput}
                {!isCapturing && (
                  <span
                    className="blinker"
                    style={{
                      display: "inline-block",
                      width: 7,
                      height: 15,
                      background: "#ccc",
                      verticalAlign: "text-bottom",
                      marginLeft: 2,
                    }}
                  />
                )}
              </div>

              {/* Resize Grip */}
              <div
                onMouseDown={onResizeMouseDown}
                onTouchStart={onResizeTouchStart}
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  width: 20,
                  height: 20,
                  cursor: "nwse-resize",
                  zIndex: 2,
                  touchAction: "none",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  style={{
                    position: "absolute",
                    right: 2,
                    bottom: 2,
                    opacity: 0.45,
                  }}
                >
                  <line
                    x1="12"
                    y1="2"
                    x2="2"
                    y2="12"
                    stroke="#888"
                    strokeWidth="1"
                  />
                  <line
                    x1="12"
                    y1="6"
                    x2="6"
                    y2="12"
                    stroke="#888"
                    strokeWidth="1"
                  />
                  <line
                    x1="12"
                    y1="10"
                    x2="10"
                    y2="12"
                    stroke="#888"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====== GLOBAL STYLES ====== */}
      <style>{`
        @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
        @keyframes toastIn { from { transform:translateX(30px) scale(0.95); opacity:0 } to { transform:translateX(0) scale(1); opacity:1 } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.55 } }

        *, *::before, *::after { box-sizing:border-box }
        body { margin:0; padding:0 }

        .blinker { animation: blink 1s step-end infinite }

        /* Scrollbars */
        .dev-cpp ::-webkit-scrollbar { width:12px; height:12px }
        .dev-cpp ::-webkit-scrollbar-track { background:#e8e8e8 }
        .dev-cpp ::-webkit-scrollbar-thumb { background:#b0b0b0; border:2px solid #e8e8e8; border-radius:2px }
        .dev-cpp ::-webkit-scrollbar-thumb:hover { background:#909090 }
        .dev-cpp ::-webkit-scrollbar-corner { background:#e8e8e8 }

        /* Dashboard Inputs */
        .dash-input:focus { border-color: ${th.inputFocus} !important; box-shadow: 0 0 0 3px ${th.inputFocus}22 !important }
        .dash-input:hover { border-color: ${th.muted}44 !important }
        .dash-input::placeholder { color: ${th.muted}66 }

        /* Dashboard Buttons */
        .dash-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(0) scale(1);
          box-shadow: 0 2px 6px rgba(0,0,0,0.22);
          -webkit-tap-highlight-color: transparent;
          position: relative;
          overflow: hidden;
        }
        .dash-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0);
          transition: background 0.2s;
          border-radius: inherit;
        }
        .dash-btn:hover::after { background: rgba(255,255,255,0.08) }
        .dash-btn:hover { transform: translateY(-2px) scale(1.01); box-shadow: 0 6px 20px rgba(0,0,0,0.32) }
        .dash-btn:active { transform: scale(0.95) !important; box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important; filter: brightness(0.92) }
        .dash-btn:disabled { filter: grayscale(1) !important; opacity: 0.5 !important; cursor: not-allowed !important; transform: none !important; box-shadow: none !important }
        /* Per-intent hover glows */
        .dash-btn-primary:hover { box-shadow: 0 6px 20px rgba(59,130,246,0.45) }
        .dash-btn-success:hover { box-shadow: 0 6px 20px rgba(34,197,94,0.45) }
        .dash-btn-warn:hover { box-shadow: 0 6px 20px rgba(234,179,8,0.45) }
        .dash-btn-danger:hover { box-shadow: 0 6px 20px rgba(239,68,68,0.45) }
        .dash-btn-randomize:hover { box-shadow: 0 6px 20px rgba(168,85,247,0.5) }

        /* Toolbar icons */
        .tb-icon { transition:background 0.1s } .tb-icon:hover { background:#d0d0d0 }
        .mitem { transition:background 0.1s } .mitem:hover { background:#cde4f7 }

        /* Window controls */
        .wctl { transition:background 0.1s }
        .wctl-min:hover, .wctl-max:hover { background:rgba(255,255,255,0.15) }
        .wctl-close:hover { background:#e81123 !important }

        /* Console controls */
        .cctl { transition:background 0.1s; border-radius:2px } .cctl:hover { background:rgba(255,255,255,0.12) }
        .cclose:hover { background:#c42b1c !important; color:#fff !important }

        /* Responsive inputs grid */
        .inputs-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px }

        /* Controls row */
        .controls-row { display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:10px }
        .action-btns { display:flex; gap:5px; flex-wrap:wrap }

        /* Tab labels */
        .tab-short { display:none }

        /* Console smooth movement */
        .console-window {
          will-change: left, top, width, height;
        }

        /* Hide sidebar label on small screens for IDE */
        @media (max-width: 900px) {
          .ide-sidebar { width:120px !important }
        }

        @media (max-width: 700px) {
          .inputs-grid { grid-template-columns:1fr 1fr !important }
          .controls-row { gap:4px }
          .tab-full { display:none !important }
          .tab-short { display:inline !important }
          .action-btns { width:100%; justify-content:stretch }
          .action-btns .dash-btn { flex:1; text-align:center; min-width:0; padding:8px 6px !important }
          .ide-sidebar { width:90px !important; font-size:10px !important }
          .ide-body { min-height:350px !important }
          .theme-name-text { max-width:80px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:inline-block; vertical-align:middle }
        }

        @media (max-width: 480px) {
          .inputs-grid { grid-template-columns:1fr !important; gap:6px !important }
          .tabs-bar { overflow-x:auto; -webkit-overflow-scrolling:touch; flex-shrink:1 !important; min-width:0 }
          .tabs-bar button { padding:6px 8px !important; font-size:10px !important }
          .ide-sidebar { display:none !important }
          .ide-body { min-height:300px !important }
        }

        /* Touch: increase hit target sizes on mobile */
        @media (pointer:coarse) {
          .dash-btn { min-height:40px; min-width:40px }
          .dash-input { min-height:42px; font-size:14px !important }
          .tabs-bar button { min-height:36px }
        }
      `}</style>
    </div>
  );
}

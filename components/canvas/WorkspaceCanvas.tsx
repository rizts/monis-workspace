"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkspaceStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

// SVG-based isometric workspace renderer
// Each item is drawn as a layered composition

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="text-6xl"
      >
        🏝️
      </motion.div>
      <div>
        <p className="font-display text-xl text-charcoal-400 font-semibold">
          Your Bali workspace awaits
        </p>
        <p className="text-sm text-charcoal-300 mt-1">
          Start by picking a desk to bring it to life
        </p>
      </div>
    </div>
  );
}

// Isometric desk SVG renderers
function DeskSVG({ type }: { type: string }) {
  const isElectric = type.includes("electric");
  const isCompact = type.includes("compact");
  const w = isCompact ? 340 : 420;

  return (
    <g>
      {/* Desk top surface */}
      <path
        d={`M${(500 - w) / 2} 260 L${(500 + w) / 2} 260 L${(500 + w) / 2 + 60} 320 L${(500 - w) / 2 - 60} 320 Z`}
        fill={isElectric ? "#e8d4b8" : "#d4b896"}
        stroke="#c4a47a"
        strokeWidth="1.5"
      />
      {/* Desk top highlight */}
      <path
        d={`M${(500 - w) / 2 + 8} 265 L${(500 + w) / 2 - 8} 265 L${(500 + w) / 2 + 52} 320 L${(500 - w) / 2 - 52} 320 Z`}
        fill="white"
        fillOpacity="0.15"
      />
      {/* Desk front panel */}
      <path
        d={`M${(500 - w) / 2 - 60} 320 L${(500 + w) / 2 + 60} 320 L${(500 + w) / 2 + 60} 370 L${(500 - w) / 2 - 60} 370 Z`}
        fill={isElectric ? "#c8a87a" : "#b8946a"}
        stroke="#a8845a"
        strokeWidth="1"
      />
      {/* Desk drawers */}
      <rect x={560} y={328} width={85} height={34} rx={3} fill="#b8906a" stroke="#a07850" strokeWidth="1" />
      <rect x={560} y={342} width={85} height={2} fill="#9a7040" />
      <circle cx={602} cy={345} r={3} fill="#c8a870" />

      {/* Left drawers */}
      <rect x={360} y={328} width={85} height={34} rx={3} fill="#b8906a" stroke="#a07850" strokeWidth="1" />
      <rect x={360} y={342} width={85} height={2} fill="#9a7040" />
      <circle cx={402} cy={345} r={3} fill="#c8a870" />

      {/* Legs */}
      {isElectric ? (
        <>
          {/* Electric legs (thinner, metallic) */}
          <rect x={390} y={370} width={12} height={70} rx={2} fill="#d0c8b8" stroke="#b8b0a0" strokeWidth="1" />
          <rect x={600} y={370} width={12} height={70} rx={2} fill="#d0c8b8" stroke="#b8b0a0" strokeWidth="1" />
          <rect x={375} y={430} width={42} height={6} rx={2} fill="#c0b8a8" />
          <rect x={585} y={430} width={42} height={6} rx={2} fill="#c0b8a8" />
        </>
      ) : (
        <>
          {/* Wood legs */}
          <rect x={388} y={370} width={16} height={68} rx={3} fill="#a8804a" />
          <rect x={598} y={370} width={16} height={68} rx={3} fill="#a8804a" />
          <rect x={370} y={432} width={50} height={6} rx={2} fill="#906a38" />
          <rect x={580} y={432} width={50} height={6} rx={2} fill="#906a38" />
        </>
      )}

      {/* Cable management (electric only) */}
      {isElectric && (
        <path
          d="M 500 370 Q 480 390 490 410 Q 500 420 510 400 Q 520 385 500 370"
          fill="none"
          stroke="#8a8070"
          strokeWidth="2"
          strokeDasharray="4,3"
        />
      )}
    </g>
  );
}

function ChairSVG({ type }: { type: string }) {
  const isGaming = type.includes("gaming");
  const isExec = type.includes("executive");
  const seatColor = isGaming ? "#c44a3a" : isExec ? "#3a3028" : "#5a8a5a";
  const backColor = isGaming ? "#2a2a2a" : isExec ? "#2a2020" : "#4a7a4a";

  return (
    <g transform="translate(490, 290)">
      {/* Wheels */}
      {[-25, -8, 0, 8, 25].map((angle, i) => (
        <ellipse
          key={i}
          cx={Math.sin((angle * Math.PI) / 180) * 28}
          cy={135 + Math.abs(Math.cos((angle * Math.PI) / 180)) * 5}
          rx={6}
          ry={4}
          fill="#4a4038"
        />
      ))}
      {/* Base star */}
      {[-72, -36, 0, 36, 72].map((angle, i) => (
        <line
          key={i}
          x1={0} y1={128}
          x2={Math.sin((angle * Math.PI) / 180) * 30}
          y2={128 + Math.cos((angle * Math.PI) / 180) * 4}
          stroke="#5a5048"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
      {/* Gas lift */}
      <rect x={-5} y={90} width={10} height={40} rx={3} fill="#888070" />

      {/* Seat */}
      <ellipse cx={0} cy={90} rx={48} ry={20} fill={seatColor} stroke={backColor} strokeWidth="1" />
      <path d="M -48 90 Q -48 110 0 114 Q 48 110 48 90 Z" fill={seatColor} />
      {!isExec && (
        <ellipse cx={0} cy={90} rx={44} ry={16} fill={seatColor} fillOpacity="0.6" />
      )}

      {/* Back support */}
      <path
        d="M -38 90 L -32 20 L 32 20 L 38 90 Z"
        fill={backColor}
        stroke={backColor}
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Backrest */}
      {isGaming ? (
        <>
          <rect x={-32} y={18} width={64} height={75} rx={8} fill={backColor} />
          <rect x={-18} y={24} width={36} height={55} rx={4} fill={seatColor} fillOpacity="0.6" />
          {/* Gaming stripe */}
          <rect x={-6} y={24} width={12} height={55} rx={2} fill="#e85a3a" fillOpacity="0.8" />
          {/* Headrest wings */}
          <path d="M -32 20 Q -46 10 -40 -5 L -26 5 Z" fill={seatColor} />
          <path d="M 32 20 Q 46 10 40 -5 L 26 5 Z" fill={seatColor} />
          <rect x={-26} y={-8} width={52} height={28} rx={6} fill={backColor} />
        </>
      ) : isExec ? (
        <>
          <rect x={-34} y={16} width={68} height={78} rx={10} fill={backColor} />
          <rect x={-22} y={22} width={44} height={60} rx={5} fill="#5a5050" />
          {/* Tufted pattern */}
          {[28, 48, 68].map((y, i) =>
            [-14, 0, 14].map((x, j) => (
              <circle key={`${i}-${j}`} cx={x} cy={y} r={2} fill="#3a3030" />
            ))
          )}
          <rect x={-28} y={-6} width={56} height={24} rx={8} fill={backColor} />
        </>
      ) : (
        <>
          {/* Mesh back */}
          <rect x={-33} y={16} width={66} height={76} rx={8} fill={backColor} />
          {/* Mesh pattern */}
          {Array.from({ length: 8 }, (_, i) =>
            Array.from({ length: 5 }, (_, j) => (
              <rect
                key={`${i}-${j}`}
                x={-27 + j * 13}
                y={22 + i * 9}
                width={11}
                height={7}
                rx={2}
                fill="transparent"
                stroke="#6aaa6a"
                strokeWidth="0.5"
                strokeOpacity="0.6"
              />
            ))
          )}
          {/* Lumbar */}
          <rect x={-28} y={60} width={56} height={16} rx={4} fill="#3a6a3a" />
          {/* Headrest */}
          <rect x={-22} y={10} width={44} height={8} rx={4} fill={backColor} />
          <rect x={-18} y={4} width={36} height={8} rx={5} fill={backColor} />
        </>
      )}

      {/* Armrests */}
      <rect x={-54} y={62} width={22} height={6} rx={2} fill="#6a6058" />
      <rect x={32} y={62} width={22} height={6} rx={2} fill="#6a6058" />
      <rect x={-56} y={42} width={6} height={24} rx={2} fill="#5a5048" />
      <rect x={50} y={42} width={6} height={24} rx={2} fill="#5a5048" />
    </g>
  );
}

function MonitorSVG({ product, offsetX = 0, idx = 0 }: { product: any; offsetX?: number; idx?: number }) {
  const isUltrawide = product.id.includes("ultrawide");
  const is4K = product.id.includes("4k") || product.id.includes("studio");
  const w = isUltrawide ? 160 : is4K ? 120 : 100;
  const h = isUltrawide ? 70 : is4K ? 85 : 70;
  const cx = 500 + offsetX;

  return (
    <g>
      {/* Stand */}
      <rect x={cx - 5} y={240 - h} width={10} height={35} rx={2} fill="#a0a090" />
      <ellipse cx={cx} cy={275} rx={25} ry={6} fill="#909080" />

      {/* Screen body */}
      <rect x={cx - w / 2 - 8} y={240 - h - 55} width={w + 16} height={h + 10} rx={5} fill="#2a2825" stroke="#3a3830" strokeWidth="1" />

      {/* Screen */}
      <rect x={cx - w / 2} y={240 - h - 48} width={w} height={h - 4} rx={2} fill={is4K ? "#0a1a2a" : "#0a1520"} />

      {/* Screen content glow */}
      <rect x={cx - w / 2} y={240 - h - 48} width={w} height={h - 4} rx={2}
        fill="url(#screenGlow)" fillOpacity="0.9" />

      {/* Power LED */}
      <circle cx={cx} cy={244 - h + h - 8} r={2} fill="#4aff8a" fillOpacity="0.8" />
    </g>
  );
}

function PlantSVG({ large = false, x = 0, y = 0 }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Pot */}
      <ellipse cx={0} cy={0} rx={large ? 22 : 16} ry={large ? 10 : 7} fill="#c87850" />
      <path d={`M ${large ? -22 : -16} 0 Q ${large ? -22 : -16} ${large ? 28 : 20} 0 ${large ? 30 : 22} Q ${large ? 22 : 16} ${large ? 28 : 20} ${large ? 22 : 16} 0 Z`} fill="#b86840" />

      {/* Soil */}
      <ellipse cx={0} cy={0} rx={large ? 20 : 14} ry={large ? 8 : 5} fill="#5a3820" />

      {/* Leaves */}
      {large ? (
        <>
          <path d="M 0 -8 Q -25 -50 -15 -80 Q 5 -45 0 -8" fill="#4a9040" />
          <path d="M 0 -8 Q 25 -45 20 -75 Q -5 -42 0 -8" fill="#5aaa50" />
          <path d="M 0 -5 Q -30 -30 -35 -55 Q -8 -35 0 -5" fill="#3a8030" />
          <path d="M 0 -10 Q 5 -60 -8 -82 Q -15 -52 0 -10" fill="#4a9840" />
        </>
      ) : (
        <>
          <path d="M 0 -5 Q -14 -28 -8 -45 Q 3 -25 0 -5" fill="#4a9040" />
          <path d="M 0 -5 Q 14 -25 12 -42 Q -2 -22 0 -5" fill="#5aaa50" />
          <path d="M 0 -5 Q -18 -18 -20 -32 Q -5 -20 0 -5" fill="#3a8030" />
        </>
      )}
    </g>
  );
}

function LampSVG({ x = 0, y = 0, floor = false }) {
  if (floor) {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <line x1={0} y1={0} x2={-15} y2={-120} stroke="#c0b090" strokeWidth="4" strokeLinecap="round" />
        <path d="M -15 -120 Q -20 -100 -5 -100" stroke="#c0b090" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx={-5} cy={-100} rx={18} ry={10} fill="#f5e8a0" fillOpacity="0.9" />
        <ellipse cx={-5} cy={-100} rx={18} ry={10} fill="#f0d860" fillOpacity="0.4" />
        <circle cx={0} cy={4} r={8} fill="#a0906a" />
      </g>
    );
  }
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-3} y={0} width={6} height={30} rx={2} fill="#c0b090" />
      <path d="M -3 30 Q -20 15 -15 0 Q 5 8 3 30 Z" fill="#d0c0a0" />
      <ellipse cx={-8} cy={15} rx={14} ry={8} fill="#f5e8a0" fillOpacity="0.7" />
      <circle cx={-3} cy={5} r={4} fill="#e8d880" fillOpacity="0.8" />
    </g>
  );
}

function KeyboardSVG({ x = 0, y = 0 }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-55} y={-12} width={110} height={24} rx={4} fill="#2a2825" />
      {Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: 12 }, (_, col) => (
          <rect
            key={`${row}-${col}`}
            x={-50 + col * 9}
            y={-9 + row * 6}
            width={7}
            height={4}
            rx={1}
            fill="#3a3830"
          />
        ))
      )}
    </g>
  );
}

export default function WorkspaceCanvas() {
  const { config, currentStep, nextStep } = useWorkspaceStore();
  const { desk, chair, accessories } = config;

  const monitors = accessories.filter((a) => a.product.category === "monitor");
  const lamps = accessories.filter((a) => a.product.category === "lamp");
  const plants = accessories.filter((a) => a.product.category === "plant");
  const keyboards = accessories.filter((a) => a.product.category === "keyboard");
  const hasFloorLamp = lamps.some((l) => l.product.id === "lamp-floor");
  const hasDeskLamp = lamps.some((l) => l.product.id === "lamp-desk");
  const hasSmallPlant = plants.some((p) => p.product.id === "plant-small");
  const hasLargePlant = plants.some((p) => p.product.id === "plant-large");
  const hasKeyboard = keyboards.length > 0;

  const monitorCount = monitors.reduce((sum, m) => sum + m.quantity, 0);

  if (!desk) {
    return (
      <div className="h-full min-h-[320px] flex items-center justify-center">
        <EmptyState />
      </div>
    );
  }

  // Monitor positions for up to 3 monitors
  const monitorOffsets = monitorCount === 1 ? [0]
    : monitorCount === 2 ? [-70, 70]
    : [-130, 0, 130];

  return (
    <div className="h-full min-h-[380px] lg:min-h-0 flex flex-col items-center justify-center relative pt-4 pb-2 lg:pt-8">
      {/* Background ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Warm glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-terra-100/40 rounded-full blur-3xl" />
        {hasFloorLamp && (
          <div className="absolute top-1/3 right-1/4 w-[200px] h-[200px] bg-yellow-100/40 rounded-full blur-2xl" />
        )}
        {/* Subtle grid */}
        <div className="absolute inset-0 iso-grid opacity-30" />
      </div>

      {/* Main SVG canvas */}
      <div className="relative w-full max-w-[620px] mx-auto">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-auto"
          style={{ filter: "drop-shadow(0 20px 40px rgba(42,37,32,0.15))" }}
        >
          <defs>
            <linearGradient id="screenGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a3a5a" />
              <stop offset="30%" stopColor="#0d2535" />
              <stop offset="60%" stopColor="#1a3050" />
              <stop offset="100%" stopColor="#0a1828" />
            </linearGradient>
            <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8d8b8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#d0c098" stopOpacity="0.2" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#2a2520" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Floor ellipse */}
          <ellipse cx={500} cy={490} rx={420} ry={80} fill="url(#floorGrad)" />

          {/* === FLOOR LAMP (behind desk) === */}
          <AnimatePresence>
            {hasFloorLamp && (
              <motion.g
                key="floor-lamp"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <LampSVG x={730} y={390} floor={true} />
              </motion.g>
            )}
          </AnimatePresence>

          {/* === LARGE PLANT (left of desk) === */}
          <AnimatePresence>
            {hasLargePlant && (
              <motion.g
                key="large-plant"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <PlantSVG large={true} x={260} y={380} />
              </motion.g>
            )}
          </AnimatePresence>

          {/* === DESK === */}
          <motion.g
            key={desk.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <DeskSVG type={desk.id} />
          </motion.g>

          {/* === MONITORS === */}
          <AnimatePresence>
            {monitors.slice(0, 3).flatMap((item, itemIdx) =>
              Array.from({ length: Math.min(item.quantity, 3) }, (_, qIdx) => {
                const totalIdx = itemIdx + qIdx;
                const offset = monitorOffsets[Math.min(totalIdx, monitorOffsets.length - 1)] || 0;
                return (
                  <motion.g
                    key={`${item.product.id}-${qIdx}`}
                    initial={{ opacity: 0, y: -20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: qIdx * 0.1 }}
                  >
                    <MonitorSVG product={item.product} offsetX={offset} idx={totalIdx} />
                  </motion.g>
                );
              })
            )}
          </AnimatePresence>

          {/* === DESK LAMP === */}
          <AnimatePresence>
            {hasDeskLamp && (
              <motion.g
                key="desk-lamp"
                initial={{ opacity: 0, scale: 0.5, originX: "660px", originY: "270px" }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <LampSVG x={670} y={235} />
              </motion.g>
            )}
          </AnimatePresence>

          {/* === SMALL PLANT (on desk) === */}
          <AnimatePresence>
            {hasSmallPlant && (
              <motion.g
                key="small-plant"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <PlantSVG x={335} y={235} />
              </motion.g>
            )}
          </AnimatePresence>

          {/* === KEYBOARD (on desk surface) === */}
          <AnimatePresence>
            {hasKeyboard && (
              <motion.g
                key="keyboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <KeyboardSVG x={500} y={290} />
              </motion.g>
            )}
          </AnimatePresence>

          {/* === CHAIR === */}
          <AnimatePresence>
            {chair && (
              <motion.g
                key={chair.id}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
              >
                <ChairSVG type={chair.id} />
              </motion.g>
            )}
          </AnimatePresence>

          {/* === SHADOW under desk === */}
          <ellipse cx={500} cy={450} rx={200} ry={25} fill="#2a2520" fillOpacity="0.08" />
          {chair && (
            <ellipse cx={490} cy={470} rx={80} ry={12} fill="#2a2520" fillOpacity="0.1" />
          )}
        </svg>

        {/* Item count badge */}
        {(monitors.length > 0 || lamps.length > 0 || plants.length > 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-charcoal-500/90 text-cream-100 text-xs rounded-full px-3 py-1.5 font-medium backdrop-blur-sm"
          >
            {accessories.reduce((s, a) => s + a.quantity, 0)} add-on{accessories.reduce((s, a) => s + a.quantity, 0) !== 1 ? "s" : ""}
          </motion.div>
        )}
      </div>

      {/* Bottom labels */}
      <div className="flex items-center gap-4 mt-2 flex-wrap justify-center">
        <AnimatePresence>
          {desk && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium text-charcoal-500 shadow-warm"
            >
              <span>🗂</span>
              <span>{desk.name}</span>
            </motion.div>
          )}
          {chair && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium text-charcoal-500 shadow-warm"
            >
              <span>🪑</span>
              <span>{chair.name}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Next step nudge */}
      {desk && !chair && currentStep === 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={nextStep}
          className="mt-3 text-xs text-charcoal-300 hover:text-charcoal-500 transition-colors flex items-center gap-1"
        >
          Great choice! Now pick a chair →
        </motion.button>
      )}
    </div>
  );
}

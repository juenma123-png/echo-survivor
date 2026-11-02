/**
 * Echo Survivor — sistema de equipo por calidad.
 * Cada objeto tiene una ranura, una calidad (común → legendario) y una lista de efectos.
 * Más calidad = más efectos y valores más altos. Todo es lógica pura (sin Canvas ni React)
 * para poder probarla y ajustar el balance en un solo lugar.
 */

/* ------------------------------------------------------------------ */
/*  Ranuras y calidades                                                 */
/* ------------------------------------------------------------------ */

export type GearSlotId = "arma" | "casco" | "armadura" | "botas" | "reliquia";
export type Rarity = "comun" | "raro" | "epico" | "legendario";

export const GEAR_SLOTS: { id: GearSlotId; name: string; hint: string }[] = [
  { id: "arma", name: "Arma", hint: "Daño, cadencia y proyectiles" },
  { id: "casco", name: "Casco", hint: "Vida, regeneración y armadura" },
  { id: "armadura", name: "Armadura", hint: "Vida, armadura y cordura" },
  { id: "botas", name: "Botas", hint: "Velocidad, imán y cadencia" },
  { id: "reliquia", name: "Reliquia", hint: "Efectos mixtos" },
];

export const RARITIES: Record<
  Rarity,
  { name: string; color: string; affixes: number; mult: number; weight: { chest: number; boss: number; elite: number } }
> = {
  comun: { name: "Común", color: "#9aa3b8", affixes: 1, mult: 1, weight: { chest: 62, boss: 0, elite: 72 } },
  raro: { name: "Raro", color: "#5ce8ff", affixes: 2, mult: 1.4, weight: { chest: 28, boss: 38, elite: 24 } },
  epico: { name: "Épico", color: "#e84dff", affixes: 3, mult: 1.9, weight: { chest: 9, boss: 45, elite: 4 } },
  legendario: { name: "Legendario", color: "#e8c36a", affixes: 4, mult: 2.6, weight: { chest: 1, boss: 17, elite: 0 } },
};

const RARITY_ORDER: Rarity[] = ["comun", "raro", "epico", "legendario"];

/* ------------------------------------------------------------------ */
/*  Efectos (affixes)                                                   */
/* ------------------------------------------------------------------ */

/**
 * Efectos posibles. `min`/`max` son el rango base antes de multiplicar por calidad y nivel.
 * `pct` indica si el valor es un porcentaje (se suma como fracción: 0.08 = +8%).
 */
export type StatKey =
  | "dmg"
  | "hp"
  | "speed"
  | "area"
  | "crit"
  | "regen"
  | "fireRate"
  | "magnet"
  | "armor"
  | "calm"
  | "proj";

export const STAT_INFO: Record<StatKey, { label: string; min: number; max: number; pct: boolean; unit: string }> = {
  dmg: { label: "Daño", min: 0.05, max: 0.1, pct: true, unit: "%" },
  hp: { label: "Vida máxima", min: 0.05, max: 0.1, pct: true, unit: "%" },
  speed: { label: "Velocidad", min: 0.03, max: 0.06, pct: true, unit: "%" },
  area: { label: "Área", min: 0.05, max: 0.1, pct: true, unit: "%" },
  crit: { label: "Crítico", min: 0.01, max: 0.03, pct: false, unit: "%" },
  regen: { label: "Regeneración", min: 0.2, max: 0.5, pct: false, unit: " vida/s" },
  fireRate: { label: "Cadencia", min: 0.04, max: 0.08, pct: true, unit: "%" },
  magnet: { label: "Imán", min: 0.1, max: 0.2, pct: true, unit: "%" },
  armor: { label: "Armadura", min: 0.03, max: 0.06, pct: true, unit: "%" },
  calm: { label: "Cordura de Ecos", min: 0.05, max: 0.1, pct: true, unit: "% menos" },
  proj: { label: "Proyectil extra", min: 1, max: 1, pct: false, unit: "" },
};

/** Qué efectos puede traer cada ranura. Las reliquias pueden traer cualquiera. */
const SLOT_POOL: Record<GearSlotId, StatKey[]> = {
  arma: ["dmg", "fireRate", "area", "crit", "proj"],
  casco: ["hp", "regen", "armor"],
  armadura: ["hp", "armor", "calm"],
  botas: ["speed", "magnet", "fireRate"],
  reliquia: ["dmg", "hp", "crit", "magnet", "regen", "calm", "speed"],
};

/** Nombres base por ranura. Son propios del juego (no de otros títulos). */
const BASE_NAMES: Record<GearSlotId, string[]> = {
  arma: ["Filo de eco", "Arco de niebla", "Vara de ceniza", "Guadaña de vidrio"],
  casco: ["Capucha cosida", "Diadema de escarcha", "Yelmo hueco"],
  armadura: ["Coraza hueca", "Manto de hielo", "Sudario de musgo"],
  botas: ["Pasos de musgo", "Grebas de brasa", "Sandalias de ceniza"],
  reliquia: ["Amuleto de hilo", "Brújula muda", "Velo quieto", "Cristal rememorado"],
};

/* ------------------------------------------------------------------ */
/*  Objetos                                                             */
/* ------------------------------------------------------------------ */

export interface GearAffix {
  stat: StatKey;
  /** Valor ya calculado (fracción si pct, número plano si no). */
  value: number;
}

export interface GearItem {
  uid: string;
  slot: GearSlotId;
  base: string;
  rarity: Rarity;
  /** Nivel del objeto: sube con la dificultad de la run en la que se obtiene. */
  level: number;
  affixes: GearAffix[];
}

/** Estadísticas agregadas de todo lo equipado. Valores neutros = 0. */
export type GearTotals = Record<StatKey, number>;

export function emptyTotals(): GearTotals {
  return { dmg: 0, hp: 0, speed: 0, area: 0, crit: 0, regen: 0, fireRate: 0, magnet: 0, armor: 0, calm: 0, proj: 0 };
}

let uidCounter = 0;
function newUid() {
  uidCounter += 1;
  return `g${Date.now().toString(36)}${uidCounter.toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
}

function randBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function pickWeighted(weights: Record<Rarity, number>): Rarity {
  const total = RARITY_ORDER.reduce((s, r) => s + weights[r], 0);
  if (total <= 0) return "comun";
  let roll = Math.random() * total;
  for (const r of RARITY_ORDER) {
    roll -= weights[r];
    if (roll <= 0 && weights[r] > 0) return r;
  }
  return "comun";
}

/** Genera un objeto aleatorio para una ranura, calidad y nivel dados. */
export function rollGear(slot: GearSlotId, rarity: Rarity, level: number): GearItem {
  const info = RARITIES[rarity];
  const pool = [...SLOT_POOL[slot]];
  const base = BASE_NAMES[slot][Math.floor(Math.random() * BASE_NAMES[slot].length)] ?? "Objeto";
  const count = Math.min(info.affixes, pool.length);
  const affixes: GearAffix[] = [];
  // Elegimos efectos distintos al azar de la ranura.
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const stat = pool.splice(idx, 1)[0]!;
    const meta = STAT_INFO[stat];
    // Escala: calidad (mult) y nivel del objeto (+10% por nivel por encima de 1).
    const raw = randBetween(meta.min, meta.max) * info.mult * (1 + (level - 1) * 0.1);
    // Los planos (crítico, regeneración) se redondean a 2 decimales; los porcentajes a 3.
    const value = stat === "proj" ? 1 : meta.pct ? Math.round(raw * 1000) / 1000 : Math.round(raw * 100) / 100;
    affixes.push({ stat, value });
  }
  return { uid: newUid(), slot, base, rarity, level, affixes };
}

/**
 * Tirada de cofre/jefe/élite. `minutes` sube un poco la probabilidad de calidad alta
 * para que las runs largas den mejor botín.
 */
export function rollDrop(source: "chest" | "boss" | "elite", minutes: number, level = 1): GearItem {
  const weights = weightsFor(source);
  // Cada minuto mueve un 4% del peso de común hacia raro/épico (tope de 30%).
  const shift = Math.min(30, minutes * 4);
  const moved = Math.min(weights.comun, shift);
  weights.comun -= moved;
  weights.raro += moved * 0.6;
  weights.epico += moved * 0.4;
  const rarity = pickWeighted(weights);
  const slot = GEAR_SLOTS[Math.floor(Math.random() * GEAR_SLOTS.length)]!.id;
  return rollGear(slot, rarity, level);
}

function weightsFor(source: "chest" | "boss" | "elite"): Record<Rarity, number> {
  return {
    comun: RARITIES.comun.weight[source],
    raro: RARITIES.raro.weight[source],
    epico: RARITIES.epico.weight[source],
    legendario: RARITIES.legendario.weight[source],
  };
}

/** Suma los efectos de todos los objetos equipados. */
export function totalsOf(equipped: GearItem[]): GearTotals {
  const t = emptyTotals();
  for (const item of equipped) {
    for (const a of item.affixes) t[a.stat] += a.value;
  }
  return t;
}

/** Valor de desmontar un objeto (fragmentos). Crece con la calidad y el nivel. */
export function dissolveValue(item: GearItem) {
  const base = { comun: 6, raro: 16, epico: 40, legendario: 110 }[item.rarity];
  return Math.round(base * (1 + (item.level - 1) * 0.15));
}

export function rarityColor(r: Rarity) {
  return RARITIES[r].color;
}

export function rarityName(r: Rarity) {
  return RARITIES[r].name;
}

/** Texto legible de un efecto, p. ej. "+8% Daño". */
export function describeAffix(a: GearAffix) {
  const info = STAT_INFO[a.stat];
  if (a.stat === "proj") return `+${a.value} proyectil`;
  if (a.stat === "calm") return `−${Math.round(a.value * 100)}% ${info.label}`;
  if (a.stat === "regen") return `+${a.value} vida/s`;
  return `+${Math.round(a.value * 100)}% ${info.label}`;
}

export function isRarityAtLeast(r: Rarity, min: Rarity) {
  return RARITY_ORDER.indexOf(r) >= RARITY_ORDER.indexOf(min);
}

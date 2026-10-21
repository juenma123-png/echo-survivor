/** Echo Survivor — datos de diseño y balance inicial. */

export const WORLD = 4200;
export const TILE = 256;
export const MAX_ECOS = 3;
export const RUN_LENGTH = 900;
export const BOSS_AT = 480;
export const ELITE_EVERY = 45;
export const CORDURA_MAX = 100;

/** Resolución lógica fija (horizontal 16:9). El lienzo se escala a la pantalla con barras si hace falta. */
export const VIEW_W = 1024;
export const VIEW_H = 576;

export const CONFIG = {
  /** Qué tan rápido el jugador alcanza su velocidad al moverse (mayor = más ágil). */
  moveAccel: 17,
  /** Qué tan rápido frena al soltar las teclas (mayor = frena antes). */
  moveFriction: 13,
  /** Alcance máximo del autoataque; no dispara a enemigos más lejos que esto. */
  autoFireRange: 480,
  /** Segundos que tarda en desvanecerse un enemigo al morir. */
  deathAnim: 0.45,
  bossDeathAnim: 0.9,
  /** Duración del evento "Resonancia" (enemigos con más vida) en segundos. */
  resonanceTime: 45,
  spawnInterval0: 1.45,
  spawnIntervalMin: 0.32,
  rampEvery: 25,
  enemyScalePerRamp: 0.09,
  corduraPerEco: 3.2,
  corduraDecay: 1.4,
  collapseDuration: 8,
  magnetBase: 78,
  playerSpeed: 168,
  playerHp: 100,
  playerDmg: 16,
  playerRadius: 14,
  fireInterval: 0.55,
  dashSpeed: 420,
  dashTime: 0.22,
  dashCooldown: 1.35,
  maxEnemies: 86,
  maxProjectiles: 90,
  maxParticles: 160,
  maxGems: 80,
};

export type EnemyKind = "slime" | "bat" | "skeleton" | "spider" | "specter" | "elite" | "boss";

export interface EnemyDef {
  kind: EnemyKind;
  name: string;
  hp: number;
  speed: number;
  dmg: number;
  xp: number;
  r: number;
  draw: number;
  sheet: string;
  ranged?: boolean;
  elite?: boolean;
  boss?: boolean;
}

export const ENEMIES: Record<EnemyKind, EnemyDef> = {
  slime: { kind: "slime", name: "Slime", hp: 20, speed: 58, dmg: 5, xp: 5, r: 13, draw: 38, sheet: "slime" },
  bat: { kind: "bat", name: "Murciélago", hp: 12, speed: 148, dmg: 4, xp: 4, r: 10, draw: 36, sheet: "bat" },
  skeleton: { kind: "skeleton", name: "Esqueleto", hp: 70, speed: 42, dmg: 9, xp: 10, r: 15, draw: 48, sheet: "skeleton" },
  spider: { kind: "spider", name: "Araña", hp: 18, speed: 55, dmg: 6, xp: 8, r: 12, draw: 40, sheet: "spider", ranged: true },
  specter: { kind: "specter", name: "Espectro", hp: 28, speed: 72, dmg: 7, xp: 9, r: 13, draw: 42, sheet: "specter" },
  elite: {
    kind: "elite",
    name: "Élite del Vacío",
    hp: 190,
    speed: 66,
    dmg: 15,
    xp: 50,
    r: 22,
    draw: 68,
    sheet: "elite",
    elite: true,
  },
  boss: {
    kind: "boss",
    name: "Corrupto del Vacío",
    hp: 1500,
    speed: 44,
    dmg: 24,
    xp: 600,
    r: 46,
    draw: 118,
    sheet: "boss",
    boss: true,
  },
};

export type EcoKind = "guerrero" | "arquero" | "sanador" | "fusion";

export interface EcoDef {
  id: EcoKind;
  name: string;
  phrase: string;
  color: string;
  cordura: number;
  cooldown: number;
  range: number;
  dmg: number;
  sheet: string;
  style: "melee" | "ranged" | "heal" | "hybrid";
}

export const ECOS: Record<EcoKind, EcoDef> = {
  guerrero: {
    id: "guerrero",
    name: "Eco del Guerrero",
    phrase: "No recuerdo mi nombre, solo el filo de mi espada.",
    color: "#60a5fa",
    cordura: 20,
    cooldown: 1.05,
    range: 86,
    dmg: 9,
    sheet: "eco_guerrero",
    style: "melee",
  },
  arquero: {
    id: "arquero",
    name: "Eco del Arquero",
    phrase: "Cada flecha que disparo es un recuerdo que se aleja.",
    color: "#34d399",
    cordura: 25,
    cooldown: 0.85,
    range: 260,
    dmg: 11,
    sheet: "eco_arquero",
    style: "ranged",
  },
  sanador: {
    id: "sanador",
    name: "Eco del Sanador",
    phrase: "Curé a otros hasta olvidar cómo curarme a mí mismo.",
    color: "#fbbf24",
    cordura: 15,
    cooldown: 2.4,
    range: 0,
    dmg: 0,
    sheet: "eco_sanador",
    style: "heal",
  },
  fusion: {
    id: "fusion",
    name: "Resonancia",
    phrase: "Dos voces, un solo eco.",
    color: "#e879f9",
    cordura: 28,
    cooldown: 0.7,
    range: 110,
    dmg: 14,
    sheet: "eco_fusion",
    style: "hybrid",
  },
};

export const ECO_POOL: EcoKind[] = ["guerrero", "arquero", "sanador"];

export interface UpgradeDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

export const UPGRADES: UpgradeDef[] = [
  { id: "dmg", name: "Filo Espectral", desc: "+20% daño de ataque", icon: "sword" },
  { id: "spd", name: "Paso Ligero", desc: "+15% velocidad de movimiento", icon: "wind" },
  { id: "proj", name: "Eco Múltiple", desc: "+1 proyectil por disparo", icon: "layers" },
  { id: "area", name: "Onda Expansiva", desc: "+25% área de impacto", icon: "maximize" },
  { id: "hp", name: "Vestigio de Vida", desc: "+20% vida máxima y cura", icon: "heart" },
  { id: "aspd", name: "Furia Silenciosa", desc: "+15% velocidad de ataque", icon: "zap" },
  { id: "crit", name: "Golpe del Olvido", desc: "+10% crítico (x1.8 daño)", icon: "target" },
  { id: "magnet", name: "Llamado de Almas", desc: "+30% radio de recolección", icon: "magnet" },
  { id: "regen", name: "Aliento Persistente", desc: "+1.5 vida por segundo", icon: "sparkles" },
  { id: "solo", name: "Camino Solitario", desc: "Sin Ecos: +25% daño y +10% vel.", icon: "user" },
  { id: "bond", name: "Vínculo espectral", desc: "Ecos +25% daño y −25% cordura", icon: "ghost" },
];

export const META_SHOP = [
  { id: "damage", name: "Núcleo permanente", desc: "+5% daño por rango", cost: 40 },
  { id: "hp", name: "Costura vital", desc: "+10 vida máxima por rango", cost: 35 },
  { id: "speed", name: "Paso fantasma", desc: "+4% velocidad por rango", cost: 45 },
  { id: "magnet", name: "Imán de recuerdos", desc: "+6% imán por rango", cost: 30 },
] as const;

export const SPRITE_URLS: Record<string, string> = {
  player_idle: "/sprites/player_idle.png",
  player_walk: "/sprites/player_walk.png",
  player_attack: "/sprites/player_attack.png",
  slime: "/sprites/slime.png",
  bat: "/sprites/bat.png",
  skeleton: "/sprites/skeleton.png",
  spider: "/sprites/spider.png",
  specter: "/sprites/specter.png",
  elite: "/sprites/elite.png",
  boss: "/sprites/boss.png",
  eco_guerrero: "/sprites/eco_guerrero.png",
  eco_arquero: "/sprites/eco_arquero.png",
  eco_sanador: "/sprites/eco_sanador.png",
  eco_fusion: "/sprites/eco_fusion.png",
  xp_gem: "/sprites/xp_gem.png",
  bolt: "/sprites/bolt.png",
  bolt_enemy: "/sprites/bolt_enemy.png",
  bolt_echo: "/sprites/bolt_echo.png",
  prop_rock: "/sprites/prop_rock.png",
  prop_crystal: "/sprites/prop_crystal.png",
  prop_tree: "/sprites/prop_tree.png",
  prop_pillar: "/sprites/prop_pillar.png",
  prop_chest: "/sprites/prop_chest.png",
  prop_altar: "/sprites/prop_altar.png",
  ground: "/maps/ground.png",
  menuBg: "/maps/menu-bg.jpg",
};

export const GDD_TEXT = {
  pitch:
    "Estás solo. Cada élite caído deja un Eco: un aliado espectral con un recuerdo. Invócalos y ganas poder, pero tu Cordura se resquebraja. ¿Te rodeas de fantasmas o caminas el sendero solitario?",
  loop: [
    "Apareces en un claro nocturno infinito.",
    "Muévete en 8 direcciones. El ataque es automático.",
    "Recoge fragmentos de XP y elige 1 de 3 mejoras al subir de nivel.",
    "Oleadas, élites y un jefe a los 8:00.",
    "Invoca hasta 3 Ecos. Fusionarlos los borra para siempre.",
    "Si la Cordura llega a 100, Colapso: más daño, menos control.",
    "Sobrevive 15 minutos o cae. Las monedas persisten entre runs.",
  ],
};

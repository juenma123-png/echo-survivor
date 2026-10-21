/**
 * Echo Survivor — motor Canvas 2D.
 * Comentarios de sección en español. Movimiento en 8 direcciones, autoataque,
 * oleadas, Ecos, Cordura y meta-progresión en localStorage.
 */
import {
  BOSSES,
  CONFIG,
  CORDURA_MAX,
  ECO_POOL,
  ECOS,
  ELITE_EVERY,
  ENEMIES,
  MAX_ECOS,
  META_SHOP,
  RUN_LENGTH,
  SPRITE_URLS,
  TILE,
  UPGRADES,
  VIEW_H,
  VIEW_W,
  WORLD,
  type EcoDef,
  type EcoKind,
  type EnemyDef,
  type EnemyKind,
} from "./config";

export type Screen =
  | "boot"
  | "menu"
  | "playing"
  | "paused"
  | "levelup"
  | "echo"
  | "dead"
  | "win"
  | "meta"
  | "codex"
  | "settings";

export interface EcoHud {
  id: EcoKind;
  name: string;
  color: string;
}
export interface ChoiceHud {
  id: string;
  name: string;
  desc: string;
  icon: string;
}
export interface MetaState {
  coins: number;
  damage: number;
  hp: number;
  speed: number;
  magnet: number;
  best: number;
  runs: number;
  shake: boolean;
  music: boolean;
  sfx: boolean;
}
export interface HudState {
  screen: Screen;
  hp: number;
  maxHp: number;
  xp: number;
  nextXp: number;
  level: number;
  time: number;
  kills: number;
  coins: number;
  cordura: number;
  wave: number;
  collapse: boolean;
  ecos: EcoHud[];
  choices: ChoiceHud[];
  pendingEco: EcoDef | null;
  message: string;
  meta: MetaState;
  dashCd: number;
  dashMax: number;
  damageDealt: number;
  eventText: string;
  interact: string;
  ready: boolean;
}

export type UiListener = (h: HudState) => void;

type SpriteMap = Record<string, HTMLImageElement>;

interface Player {
  x: number;
  y: number;
  r: number;
  hp: number;
  maxHp: number;
  speed: number;
  xp: number;
  nextXp: number;
  level: number;
  dmg: number;
  projectiles: number;
  area: number;
  fireCd: number;
  fireRate: number;
  magnet: number;
  crit: number;
  regen: number;
  armor: number;
  solitude: boolean;
  bond: number;
  vx: number;
  vy: number;
  facing: number;
  flip: boolean;
  anim: "idle" | "walk" | "attack";
  animT: number;
  dashT: number;
  dashCd: number;
  iframe: number;
  cordura: number;
  hurtT: number;
  slowT: number;
}

interface Enemy {
  alive: boolean;
  def: EnemyDef;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  r: number;
  speed: number;
  dmg: number;
  xp: number;
  shoot: number;
  phase: number;
  hit: number;
  animT: number;
  flip: boolean;
  hostileEco?: boolean;
}

interface Corpse {
  x: number;
  y: number;
  def: EnemyDef;
  flip: boolean;
  t: number;
  dur: number;
}

interface Proj {
  alive: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  dmg: number;
  life: number;
  friendly: boolean;
  pierce: number;
  kind: "bolt" | "echo" | "enemy" | "boomerang";
  color: string;
  age: number;
  slow?: boolean;
}

interface Gem {
  alive: boolean;
  x: number;
  y: number;
  v: number;
  t: number;
}
interface Particle {
  alive: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  s: number;
  color: string;
}
interface Floater {
  alive: boolean;
  x: number;
  y: number;
  text: string;
  life: number;
  color: string;
}
interface EcoAlly {
  def: EcoDef;
  x: number;
  y: number;
  cd: number;
  t: number;
  hostile: boolean;
}
interface Prop {
  x: number;
  y: number;
  kind: "rock" | "crystal" | "tree" | "pillar";
  s: number;
  hp: number;
  maxHp: number;
  cd: number;
  broken: boolean;
}
interface Pickup {
  kind: "chest" | "altar" | "echoOrb" | "ghost";
  x: number;
  y: number;
  used: boolean;
  ecoId?: EcoKind;
  /** Si es true, solo se activa con E / botón Eco (no al rozarlo). */
  manual?: boolean;
}

const SAVE_KEY = "echo_survivor_meta_v1";
const TAU = Math.PI * 2;

function clamp(v: number, a: number, b: number) {
  return v < a ? a : v > b ? b : v;
}
function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}
function pick<T>(arr: T[]): T {
  return arr[(Math.random() * arr.length) | 0]!;
}
function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    const done = (ok: boolean) => {
      clearTimeout(tm);
      if (ok) resolve(im);
      else reject(new Error(src));
    };
    const tm = setTimeout(() => done(false), 4000);
    im.onload = () => done(true);
    im.onerror = () => done(false);
    im.src = src;
  });
}

function defaultMeta(): MetaState {
  return {
    coins: 0,
    damage: 0,
    hp: 0,
    speed: 0,
    magnet: 0,
    best: 0,
    runs: 0,
    shake: true,
    music: true,
    sfx: true,
  };
}

function readMeta(): MetaState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultMeta();
    return { ...defaultMeta(), ...(JSON.parse(raw) as MetaState) };
  } catch {
    return defaultMeta();
  }
}

function writeMeta(m: MetaState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(m));
  } catch {
    /* ignore quota */
  }
}

/* ------------------------------------------------------------------ */
/*  Audio sintético (drones + SFX). Se desbloquea en el primer gesto. */
/* ------------------------------------------------------------------ */
class Synth {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  music: GainNode | null = null;
  sfx: GainNode | null = null;
  drone: OscillatorNode | null = null;
  heart: number | null = null;
  enabled = true;
  musicOn = true;

  unlock() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC({ latencyHint: "interactive" });
    this.master = this.ctx.createGain();
    this.music = this.ctx.createGain();
    this.sfx = this.ctx.createGain();
    this.master.gain.value = 0.7;
    this.music.gain.value = 0.18;
    this.sfx.gain.value = 0.45;
    this.music.connect(this.master);
    this.sfx.connect(this.master);
    this.master.connect(this.ctx.destination);
    this.startDrone();
  }

  startDrone() {
    if (!this.ctx || !this.music || this.drone) return;
    const o1 = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o1.type = "sine";
    o2.type = "triangle";
    o1.frequency.value = 55;
    o2.frequency.value = 82.4;
    g.gain.value = 0.35;
    o1.connect(g);
    o2.connect(g);
    g.connect(this.music);
    o1.start();
    o2.start();
    this.drone = o1;
  }

  beep(freq: number, dur: number, type: OscillatorType = "square", vol = 0.12) {
    if (!this.enabled || !this.ctx || !this.sfx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = freq * (0.96 + Math.random() * 0.08);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(this.sfx);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  hit() {
    this.beep(180 + Math.random() * 80, 0.08, "square", 0.08);
  }
  crit() {
    this.beep(520, 0.12, "sawtooth", 0.1);
  }
  pickup() {
    this.beep(740, 0.09, "sine", 0.08);
  }
  level() {
    this.beep(392, 0.12, "triangle", 0.12);
    this.beep(523, 0.18, "triangle", 0.1);
  }
  dash() {
    this.beep(140, 0.14, "sawtooth", 0.07);
  }
  collapse() {
    this.beep(70, 0.4, "sawtooth", 0.16);
  }
  death() {
    this.beep(110, 0.5, "triangle", 0.14);
  }

  setMusic(on: boolean) {
    this.musicOn = on;
    if (this.music) this.music.gain.setTargetAtTime(on ? 0.18 : 0, this.ctx!.currentTime, 0.05);
  }
  setSfx(on: boolean) {
    this.enabled = on;
  }
  setCordura(n: number) {
    if (!this.music) return;
    const extra = (n / 100) * 0.08;
    this.music.gain.setTargetAtTime(this.musicOn ? 0.18 + extra : 0, this.ctx!.currentTime, 0.2);
  }
}

/* ------------------------------------------------------------------ */
/*  Motor principal                                                    */
/* ------------------------------------------------------------------ */
export class EchoGame {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  onUi: UiListener;
  sprites: SpriteMap = {};
  ready = false;
  screen: Screen = "boot";
  meta: MetaState = defaultMeta();
  input = {
    keys: new Set<string>(),
    injected: null as string[] | null,
    stickX: 0,
    stickY: 0,
    dashQueued: false,
    ecoQueued: false,
  };
  audio = new Synth();
  /** Tamaño lógico del mundo visible (fijo, horizontal 16:9). */
  w = VIEW_W;
  h = VIEW_H;
  dpr = 1;
  /** Escala entre la resolución lógica y los píxeles CSS del lienzo. */
  scale = 1;
  last = 0;
  /** Deriva aleatoria suave que se aplica al movimiento durante el Colapso. */
  driftX = 0;
  driftY = 0;
  driftT = 0;
  /** Segundos restantes del evento Resonancia (enemigos con +vida). */
  resonT = 0;
  /** Cadáveres en animación de muerte (solo visuales). */
  corpses: Corpse[] = [];
  raf = 0;
  camX = 0;
  camY = 0;
  trauma = 0;
  hitstop = 0;
  player!: Player;
  enemies: Enemy[] = [];
  projs: Proj[] = [];
  gems: Gem[] = [];
  parts: Particle[] = [];
  floats: Floater[] = [];
  ecos: EcoAlly[] = [];
  props: Prop[] = [];
  pickups: Pickup[] = [];
  time = 0;
  kills = 0;
  coins = 0;
  damageDealt = 0;
  collapseT = 0;
  spawnCd = 0;
  eliteCd = ELITE_EVERY;
  seenBoss = new Set<EnemyKind>();
  eventText = "";
  fogT = 0;
  hint = "";
  message = "";
  msgT = 0;
  choices: ChoiceHud[] = [];
  pendingEco: EcoDef | null = null;
  hudDirty = true;
  reducedMotion = false;
  destroyed = false;
  bound: Array<[string, EventListenerOrEventListenerObject, boolean?]> = [];

  constructor(canvas: HTMLCanvasElement, onUi: UiListener) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D no disponible");
    this.ctx = ctx;
    this.onUi = onUi;
    this.meta = readMeta();
    this.reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    this.attachInput();
    this.resize();
    this.boot();
  }

  private listen(target: EventTarget, type: string, fn: EventListener, capture = false) {
    target.addEventListener(type, fn, capture);
    this.bound.push([type, fn, capture]);
  }

  private attachInput() {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) e.preventDefault();
      if (e.type === "keydown") {
        this.input.keys.add(e.code);
        if (e.code === "Escape") this.togglePause();
        if (e.code === "KeyE" || e.code === "KeyF") this.input.ecoQueued = true;
        if (e.code === "Space" || e.code === "ShiftLeft") this.input.dashQueued = true;
      } else {
        this.input.keys.delete(e.code);
      }
    };
    this.listen(window, "keydown", onKey as EventListener);
    this.listen(window, "keyup", onKey as EventListener);
    this.listen(window, "blur", () => this.input.keys.clear());
    this.listen(document, "visibilitychange", () => {
      if (document.hidden) this.input.keys.clear();
      else if (this.audio.ctx?.state === "suspended") void this.audio.ctx.resume();
    });
    this.listen(window, "resize", () => this.resize());
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    for (const [type, fn, cap] of this.bound) {
      window.removeEventListener(type, fn, cap);
      document.removeEventListener(type, fn, cap);
    }
    this.bound = [];
    try {
      void this.audio.ctx?.close();
    } catch {
      /* noop */
    }
  }

  /**
   * Ajusta el lienzo a su contenedor manteniendo una vista horizontal fija (VIEW_W x VIEW_H).
   * El juego siempre dibuja en coordenadas lógicas; aquí solo se calcula la escala.
   */
  resize() {
    const parent = this.canvas.parentElement ?? this.canvas;
    const rect = parent.getBoundingClientRect();
    const cw = Math.max(1, rect.width || window.innerWidth);
    const ch = Math.max(1, rect.height || window.innerHeight);
    this.w = VIEW_W;
    this.h = VIEW_H;
    this.scale = Math.min(cw / VIEW_W, ch / VIEW_H);
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const k = this.scale * this.dpr;
    this.canvas.width = Math.max(1, Math.floor(VIEW_W * k));
    this.canvas.height = Math.max(1, Math.floor(VIEW_H * k));
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.ctx.setTransform(k, 0, 0, k, 0, 0);
  }

  private async boot() {
    this.screen = "menu";
    this.resetWorld(false);
    this.wireControlsTest();
    this.ready = true;
    this.emit();
    this.last = performance.now();
    const loop = (t: number) => {
      if (this.destroyed) return;
      this.frame(t);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
    const entries = Object.entries(SPRITE_URLS);
    await Promise.all(
      entries.map(async ([k, url]) => {
        try {
          this.sprites[k] = await loadImg(url);
        } catch {
          /* fallback vectorial */
        }
      }),
    );
    this.emit();
  }

  private wireControlsTest() {
    const self = this;
    (window as unknown as { __controlsTest: unknown }).__controlsTest = {
      getYaw: () => self.player?.facing ?? 0,
      getSpeed: () => Math.hypot(self.player?.vx ?? 0, self.player?.vy ?? 0),
      setKeys: (codes: string[]) => {
        self.input.injected = codes;
      },
      setSteer: (v: number) => {
        self.input.stickX = -v;
      },
    };
  }

  /* ---------------- UI pública ---------------- */
  startRun() {
    this.audio.unlock();
    this.meta.runs += 1;
    writeMeta(this.meta);
    this.resetWorld(true);
    this.screen = "playing";
    this.flash("Sobrevive. Escucha a los que dejaste atrás.");
    this.emit();
  }

  togglePause() {
    if (this.screen === "playing") this.screen = "paused";
    else if (this.screen === "paused") this.screen = "playing";
    this.emit();
  }

  resume() {
    if (this.screen === "paused") this.screen = "playing";
    this.emit();
  }

  toMenu() {
    this.screen = "menu";
    this.resetWorld(false);
    this.emit();
  }

  open(screen: Screen) {
    this.screen = screen;
    this.emit();
  }

  setStick(x: number, y: number) {
    this.input.stickX = x;
    this.input.stickY = y;
  }
  queueDash() {
    this.input.dashQueued = true;
  }
  queueEco() {
    this.input.ecoQueued = true;
  }

  chooseUpgrade(id: string) {
    const p = this.player;
    switch (id) {
      case "dmg":
        p.dmg *= 1.2;
        break;
      case "spd":
        p.speed *= 1.15;
        break;
      case "proj":
        p.projectiles += 1;
        break;
      case "area":
        p.area *= 1.25;
        break;
      case "hp": {
        const inc = p.maxHp * 0.2;
        p.maxHp += inc;
        p.hp = Math.min(p.maxHp, p.hp + inc);
        break;
      }
      case "aspd":
        p.fireRate *= 1.15;
        break;
      case "crit":
        p.crit = Math.min(0.7, p.crit + 0.1);
        break;
      case "magnet":
        p.magnet *= 1.3;
        break;
      case "regen":
        p.regen += 1.5;
        break;
      case "solo":
        p.solitude = true;
        break;
      case "bond":
        p.bond = Math.min(0.75, p.bond + 0.25);
        break;
      default:
        break;
    }
    this.choices = [];
    this.screen = "playing";
    const u = UPGRADES.find((x) => x.id === id);
    this.flash(u?.name ?? "Mejora");
    this.audio.level();
    this.emit();
  }

  invokePending() {
    if (!this.pendingEco) return;
    if (this.ecos.length >= MAX_ECOS) {
      this.flash("Ya sostienes 3 Ecos. Fusiónalos o suelta uno.");
      return;
    }
    this.addEco(this.pendingEco.id);
    this.pendingEco = null;
    this.screen = "playing";
    this.emit();
  }

  discardPending() {
    this.pendingEco = null;
    this.screen = "playing";
    this.flash("El Eco se disuelve en la niebla.");
    this.emit();
  }

  fusePending() {
    if (!this.pendingEco || this.ecos.length < 1) return;
    this.ecos.shift();
    this.addEco("fusion");
    this.player.dmg *= 1.12;
    this.player.cordura = Math.max(0, this.player.cordura - 22);
    this.pendingEco = null;
    this.screen = "playing";
    this.flash("Fusión: el eco nuevo y el más antiguo se vuelven Resonancia.");
    this.emit();
  }

  dismissEco(index = 0) {
    if (index < 0 || index >= this.ecos.length) return;
    const gone = this.ecos.splice(index, 1)[0];
    this.flash(`Liberaste a ${gone?.def.name ?? "un Eco"}.`);
    this.emit();
  }

  buyMeta(id: string) {
    const item = META_SHOP.find((x) => x.id === id);
    if (!item) return;
    if (this.meta.coins < item.cost) {
      this.flash("No tienes suficientes fragmentos.");
      this.emit();
      return;
    }
    this.meta.coins -= item.cost;
    if (id === "damage") this.meta.damage += 1;
    if (id === "hp") this.meta.hp += 1;
    if (id === "speed") this.meta.speed += 1;
    if (id === "magnet") this.meta.magnet += 1;
    writeMeta(this.meta);
    this.flash("Mejora permanente grabada.");
    this.emit();
  }

  setSetting(k: "shake" | "music" | "sfx", v: boolean) {
    this.meta[k] = v;
    if (k === "music") this.audio.setMusic(v);
    if (k === "sfx") this.audio.setSfx(v);
    writeMeta(this.meta);
    this.emit();
  }

  /* ---------------- mundo ---------------- */
  private resetWorld(play: boolean) {
    const m = this.meta;
    const hp = CONFIG.playerHp + m.hp * 10;
    this.player = {
      x: WORLD / 2,
      y: WORLD / 2,
      r: CONFIG.playerRadius,
      hp,
      maxHp: hp,
      speed: CONFIG.playerSpeed * (1 + m.speed * 0.04),
      xp: 0,
      nextXp: 18,
      level: 1,
      dmg: CONFIG.playerDmg * (1 + m.damage * 0.05),
      projectiles: 1,
      area: 1,
      fireCd: 0,
      fireRate: 1,
      magnet: CONFIG.magnetBase * (1 + m.magnet * 0.06),
      crit: 0.06,
      regen: 0.15,
      armor: 0,
      solitude: false,
      bond: 0,
      vx: 0,
      vy: 0,
      facing: 0,
      flip: false,
      anim: "idle",
      animT: 0,
      dashT: 0,
      dashCd: 0,
      iframe: 0,
      cordura: 0,
      hurtT: 0,
      slowT: 0,
    };
    this.enemies = [];
    this.projs = [];
    this.gems = [];
    this.parts = [];
    this.floats = [];
    this.ecos = [];
    this.pickups = [];
    this.time = 0;
    this.kills = 0;
    this.coins = 0;
    this.damageDealt = 0;
    this.collapseT = 0;
    this.spawnCd = 0.4;
    this.eliteCd = ELITE_EVERY;
    this.seenBoss.clear();
    this.eventText = "";
    this.fogT = 0;
    this.resonT = 0;
    this.corpses = [];
    this.driftT = 0;
    this.camX = this.player.x - this.w / 2;
    this.camY = this.player.y - this.h / 2;
    this.trauma = 0;
    this.pendingEco = null;
    this.choices = [];
    this.seedProps();
    this.seedSites();
    if (play) {
      for (let i = 0; i < 6; i++) this.spawnEnemy(this.rollBasic(), true);
    }
  }

  private seedProps() {
    this.props = [];
    const kinds: Prop["kind"][] = ["rock", "crystal", "tree", "pillar"];
    for (let i = 0; i < 64; i++) {
      for (let t = 0; t < 14; t++) {
        const x = rand(90, WORLD - 90);
        const y = rand(90, WORLD - 90);
        if (this.blockedSpot(x, y, 70)) continue;
        this.props.push({
          x,
          y,
          kind: pick(kinds),
          s: rand(0.9, 1.25),
          hp: 0,
          maxHp: 0,
          cd: 0,
          broken: false,
        });
        const pr = this.props[this.props.length - 1]!;
        if (pr.kind === "rock") {
          pr.maxHp = 46;
          pr.hp = 46;
        }
        break;
      }
    }
  }

  /** Altares, cofres y fantasmas que sí se pueden usar. */
  private seedSites() {
    const fixed: Pickup[] = [
      { kind: "ghost", x: WORLD / 2 + 240, y: WORLD / 2 - 30, used: false },
      { kind: "chest", x: WORLD / 2 - 200, y: WORLD / 2 + 170, used: false },
      { kind: "altar", x: WORLD / 2 + 60, y: WORLD / 2 + 280, used: false },
    ];
    for (const s of fixed) this.pickups.push(s);
    const extra: Pickup["kind"][] = ["ghost", "ghost", "ghost", "chest", "chest", "chest", "chest", "altar", "altar"];
    for (const kind of extra) {
      for (let t = 0; t < 18; t++) {
        const x = rand(120, WORLD - 120);
        const y = rand(120, WORLD - 120);
        if (this.blockedSpot(x, y, 90)) continue;
        this.pickups.push({ kind, x, y, used: false });
        break;
      }
    }
  }

  private blockedSpot(x: number, y: number, pad: number) {
    if (Math.hypot(x - WORLD / 2, y - WORLD / 2) < 320) return true;
    for (const pr of this.props) {
      const c = this.propCollider(pr);
      if (Math.hypot(c.x - x, c.y - y) < c.r + pad) return true;
    }
    for (const k of this.pickups) {
      if (Math.hypot(k.x - x, k.y - y) < pad + 40) return true;
    }
    return false;
  }

  private propCollider(pr: Prop) {
    const im = this.sprites[`prop_${pr.kind}`];
    const w = (im?.width || 56) * pr.s;
    const h = (im?.height || 72) * pr.s;
    const frac = pr.kind === "rock" ? 0.4 : pr.kind === "crystal" ? 0.26 : 0.32;
    const lift = pr.kind === "tree" || pr.kind === "pillar" ? h * 0.34 : h * 0.42;
    return { x: pr.x, y: pr.y - lift, r: Math.max(16, w * frac) };
  }

  private solidAt(x: number, y: number, r: number, vx: number, vy: number) {
    const circles: { x: number; y: number; r: number }[] = [];
    for (const pr of this.props) {
      if (pr.broken) continue;
      circles.push(this.propCollider(pr));
    }
    for (const k of this.pickups) {
      if (k.used || (k.kind !== "chest" && k.kind !== "altar")) continue;
      const lift = k.kind === "altar" ? 30 : 18;
      circles.push({ x: k.x, y: k.y - lift, r: k.kind === "altar" ? 26 : 20 });
    }
    for (let pass = 0; pass < 2; pass++) {
      for (const c of circles) {
        let dx = x - c.x;
        let dy = y - c.y;
        const min = r + c.r;
        let d2 = dx * dx + dy * dy;
        if (d2 >= min * min) continue;
        let d = Math.sqrt(d2);
        if (d < 0.001) {
          dx = 1;
          dy = 0;
          d = 1;
        }
        const nx = dx / d;
        const ny = dy / d;
        x += nx * (min - d + 0.6);
        y += ny * (min - d + 0.6);
        const vn = vx * nx + vy * ny;
        if (vn < 0) {
          vx -= vn * nx;
          vy -= vn * ny;
        }
      }
    }
    return { x, y, vx, vy };
  }

  private addEco(id: EcoKind) {
    const def = ECOS[id];
    this.ecos.push({ def, x: this.player.x, y: this.player.y, cd: 0.3, t: 0, hostile: false });
    this.flash(`Eco invocado: ${def.name}`);
    this.audio.pickup();
  }

  private flash(text: string) {
    this.message = text;
    this.msgT = 2.4;
  }

  /* ---------------- bucle ---------------- */
  private frame(t: number) {
    const raw = Math.min(0.1, (t - this.last) / 1000 || 0.016);
    this.last = t;
    /*
     * Paso variable: se actualiza una vez por cuadro con el dt real (en pantallas de 120/144 Hz
     * el movimiento queda fluido). Si un cuadro tarda mucho se divide en subpasos de ~1/60 s
     * para no atravesar paredes ni perder colisiones.
     */
    const n = Math.max(1, Math.ceil(raw * 60 - 0.001));
    const step = raw / n;
    for (let i = 0; i < n; i++) {
      if (this.hitstop > 0) this.hitstop -= step;
      else if (this.screen === "playing") this.update(step);
    }
    this.draw();
    if (this.hudDirty) {
      this.emit();
      this.hudDirty = false;
    }
  }

  private keys(): Set<string> {
    if (this.input.injected) return new Set(this.input.injected);
    return this.input.keys;
  }

  private update(dt: number) {
    const p = this.player;
    this.time += dt;
    if (this.msgT > 0) this.msgT -= dt;
    this.trauma = Math.max(0, this.trauma - dt * 1.8);
    p.hurtT = Math.max(0, p.hurtT - dt);
    p.slowT = Math.max(0, p.slowT - dt);
    p.iframe = Math.max(0, p.iframe - dt);
    p.dashCd = Math.max(0, p.dashCd - dt);
    p.dashT = Math.max(0, p.dashT - dt);
    p.animT += dt;
    p.fireCd -= dt;
    if (p.regen) p.hp = clamp(p.hp + p.regen * dt, 0, p.maxHp);

    this.movePlayer(dt);
    this.updateEcos(dt);
    this.updateProps(dt);
    this.spawnLoop(dt);
    this.autoFire();
    this.updateEnemies(dt);
    this.updateProjs(dt);
    this.updateGems(dt);
    this.updatePickups();
    this.updateFx(dt);
    this.audio.setCordura(p.cordura);

    const minute = Math.floor(this.time / 60);
    if (minute > 0 && minute % 5 === 0 && this.eventText.indexOf(String(minute)) < 0) {
      if (minute % 10 === 5) {
        this.fogT = 18;
        this.eventText = `Niebla ${minute}`;
        this.flash("EVENTO — Niebla de los recuerdos");
      } else {
        this.eventText = `Resonancia ${minute}`;
        this.resonT = CONFIG.resonanceTime;
        this.flash("EVENTO — Resonancia hostil (+vida enemiga)");
      }
    }
    if (this.fogT > 0) this.fogT -= dt;
    /* La Resonancia dura un tiempo limitado; antes se quedaba activa para siempre. */
    if (this.resonT > 0) this.resonT -= dt;

    if (this.time >= RUN_LENGTH) {
      this.endRun(true);
      return;
    }
    if (p.hp <= 0) {
      this.endRun(false);
      return;
    }
    this.hudDirty = true;
  }

  private movePlayer(dt: number) {
    const p = this.player;
    const keys = this.keys();
    let mx = 0;
    let my = 0;
    if (keys.has("KeyW") || keys.has("ArrowUp")) my -= 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) my += 1;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) mx -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) mx += 1;
    if (this.input.injected === null) {
      mx += this.input.stickX;
      my += this.input.stickY;
    }
    const mag = Math.hypot(mx, my);
    if (mag > 1) {
      mx /= mag;
      my /= mag;
    } else if (mag > 0.12) {
      /* already ok */
    } else {
      mx = 0;
      my = 0;
    }

    if (this.input.dashQueued) {
      this.input.dashQueued = false;
      if (p.dashCd <= 0 && (mx || my || mag)) {
        const dx = mx || (p.flip ? -1 : 1);
        const dy = my;
        const n = Math.hypot(dx, dy) || 1;
        p.dashT = CONFIG.dashTime;
        p.dashCd = CONFIG.dashCooldown;
        p.iframe = 0.22;
        p.vx = (dx / n) * CONFIG.dashSpeed;
        p.vy = (dy / n) * CONFIG.dashSpeed;
        this.audio.dash();
        this.burst(p.x, p.y, 8, "#5ce8ff");
      }
    }

    const solo = p.solitude && this.ecos.length === 0;
    const spd = p.speed * (solo ? 1.1 : 1) * (p.slowT > 0 ? 0.55 : 1);
    if (this.collapseT > 0) {
      /*
       * Colapso: pierdes el control. Una deriva que cambia cada ~0.3 s empuja tu dirección,
       * pero solo si te estás moviendo (quieto no te arrastra a toda velocidad).
       */
      this.driftT -= dt;
      if (this.driftT <= 0) {
        this.driftT = rand(0.2, 0.4);
        this.driftX = rand(-0.7, 0.7);
        this.driftY = rand(-0.7, 0.7);
      }
      if (mx || my) {
        mx += this.driftX;
        my += this.driftY;
        const m2 = Math.hypot(mx, my);
        if (m2 > 1) {
          mx /= m2;
          my /= m2;
        }
      }
    }

    if (p.dashT > 0) {
      /* inercia del dash */
    } else {
      /*
       * Aceleración y fricción exponenciales (independientes de los FPS):
       * arrancas y frenas con una pequeña inercia en vez de cambiar de golpe.
       */
      const rate = mx || my ? CONFIG.moveAccel : CONFIG.moveFriction;
      const kv = 1 - Math.exp(-rate * dt);
      p.vx += (mx * spd - p.vx) * kv;
      p.vy += (my * spd - p.vy) * kv;
      if (!mx && !my && Math.abs(p.vx) < 4 && Math.abs(p.vy) < 4) {
        p.vx = 0;
        p.vy = 0;
      }
    }
    p.x = clamp(p.x + p.vx * dt, 40, WORLD - 40);
    p.y = clamp(p.y + p.vy * dt, 40, WORLD - 40);
    const hit = this.solidAt(p.x, p.y, p.r, p.vx, p.vy);
    p.x = clamp(hit.x, 40, WORLD - 40);
    p.y = clamp(hit.y, 40, WORLD - 40);
    p.vx = hit.vx;
    p.vy = hit.vy;

    const moving = Math.hypot(p.vx, p.vy) > 12;
    if (moving) {
      p.facing = Math.atan2(-p.vx, -p.vy);
      if (p.vx < -8) p.flip = true;
      if (p.vx > 8) p.flip = false;
    }
    if (p.anim !== "attack" || p.animT > 0.28) p.anim = moving ? "walk" : "idle";

    const k = 1 - Math.exp(-5.5 * dt);
    const lookX = p.vx * 0.12;
    const lookY = p.vy * 0.12;
    this.camX += (p.x - this.w / 2 + lookX - this.camX) * k;
    this.camY += (p.y - this.h / 2 + lookY - this.camY) * k;
    this.camX = clamp(this.camX, 0, WORLD - this.w);
    this.camY = clamp(this.camY, 0, WORLD - this.h);
  }

  private autoFire() {
    const p = this.player;
    if (p.fireCd > 0) return;
    /* Solo dispara si hay un enemigo al alcance del proyectil (no desperdicia tiros lejanos). */
    const t = this.nearest(p.x, p.y, undefined, CONFIG.autoFireRange);
    if (!t) return;
    p.fireCd = CONFIG.fireInterval / p.fireRate;
    p.anim = "attack";
    p.animT = 0;
    const base = Math.atan2(t.y - p.y, t.x - p.x);
    const n = p.projectiles;
    const solo = p.solitude && this.ecos.length === 0 ? 1.25 : 1;
    const col = this.collapseT > 0 ? 1.5 : 1;
    for (let i = 0; i < n; i++) {
      const off = (i - (n - 1) / 2) * 0.14;
      const a = base + off;
      this.spawnProj({
        x: p.x,
        y: p.y,
        vx: Math.cos(a) * 430,
        vy: Math.sin(a) * 430,
        r: 4 + p.area * 1.2,
        dmg: p.dmg * solo * col * this.critMul(),
        life: 1.15,
        friendly: true,
        pierce: p.area > 1.4 ? 1 : 0,
        kind: "bolt",
        color: "#5ce8ff",
      });
    }
  }

  private critMul() {
    if (Math.random() < this.player.crit) {
      this.audio.crit();
      return 1.8;
    }
    return 1;
  }

  private spawnLoop(dt: number) {
    this.spawnCd -= dt;
    this.eliteCd -= dt;
    const interval = Math.max(
      CONFIG.spawnIntervalMin,
      CONFIG.spawnInterval0 - this.time * 0.0032,
    );
    if (this.spawnCd <= 0 && this.aliveEnemies() < CONFIG.maxEnemies) {
      const n = Math.min(6, 1 + (this.time / 40) | 0);
      for (let i = 0; i < n; i++) this.spawnEnemy(this.rollBasic());
      this.spawnCd = interval;
    }
    if (this.eliteCd <= 0) {
      this.spawnEnemy("elite");
      this.eliteCd = ELITE_EVERY;
      this.flash("Un Eco mayor ha despertado.");
    }
    for (const b of BOSSES) {
      if (this.time >= b.at && !this.seenBoss.has(b.kind)) {
        this.seenBoss.add(b.kind);
        this.spawnEnemy(b.kind);
        this.flash(b.banner);
        this.addTrauma(0.7);
      }
    }
  }

  private rollBasic(): EnemyKind {
    const t = this.time;
    const pool: EnemyKind[] = ["slime", "slime", "bat", "spider"];
    if (t > 45) pool.push("skeleton", "brasa");
    if (t > 100) pool.push("luz", "bat");
    if (t > 160) pool.push("armadura", "espora");
    if (t > 220) pool.push("specter", "sanguijuela", "espora");
    if (t > 340) pool.push("armadura", "brasa", "luz");
    return pick(pool);
  }

  private spawnEnemy(kind: EnemyKind, near = false, at?: { x: number; y: number }) {
    const def = ENEMIES[kind];
    const ramp = 1 + Math.floor(this.time / CONFIG.rampEvery) * CONFIG.enemyScalePerRamp;
    const reson = this.resonT > 0 ? 1.25 : 1;
    let x: number;
    let y: number;
    if (at) {
      const a = Math.random() * TAU;
      x = at.x + Math.cos(a) * 80;
      y = at.y + Math.sin(a) * 80;
    } else if (near) {
      const a = Math.random() * TAU;
      x = this.player.x + Math.cos(a) * 280;
      y = this.player.y + Math.sin(a) * 280;
    } else {
      const a = Math.random() * TAU;
      const dist = Math.max(this.w, this.h) * 0.58;
      x = this.player.x + Math.cos(a) * dist;
      y = this.player.y + Math.sin(a) * dist;
    }
    x = clamp(x, 30, WORLD - 30);
    y = clamp(y, 30, WORLD - 30);
    if (kind !== "specter") {
      const pushed = this.solidAt(x, y, def.r, 0, 0);
      x = clamp(pushed.x, 30, WORLD - 30);
      y = clamp(pushed.y, 30, WORLD - 30);
    }
    this.enemies.push({
      alive: true,
      def,
      x,
      y,
      hp: def.hp * ramp * reson,
      maxHp: def.hp * ramp * reson,
      r: def.r,
      speed: def.speed * (1 + this.time / 1400),
      dmg: def.dmg * ramp,
      xp: def.xp,
      shoot: rand(0.4, 1.6),
      phase: 0,
      hit: 0,
      animT: rand(0, 2),
      flip: false,
    });
  }

  private aliveEnemies() {
    let n = 0;
    for (const e of this.enemies) if (e.alive) n++;
    return n;
  }

  private nearest(x: number, y: number, ignore?: Enemy, maxDist?: number): Enemy | null {
    let best: Enemy | null = null;
    let bd = maxDist ? maxDist * maxDist : 1e12;
    for (const e of this.enemies) {
      if (!e.alive || e === ignore) continue;
      const d = (e.x - x) * (e.x - x) + (e.y - y) * (e.y - y);
      if (d < bd) {
        bd = d;
        best = e;
      }
    }
    return best;
  }

  private spawnProj(p: Omit<Proj, "alive" | "age"> & { age?: number }) {
    if (this.projs.filter((x) => x.alive).length >= CONFIG.maxProjectiles) {
      const old = this.projs.find((x) => x.alive);
      if (old) old.alive = false;
    }
    this.projs.push({ ...p, alive: true, age: p.age ?? 0 });
  }

  private moveLuz(e: Enemy, dt: number, dx: number, dy: number, dist: number) {
    e.phase += dt;
    if (e.phase < 0.65) {
      e.x += (dx / dist) * e.speed * 0.25 * dt;
      e.y += (dy / dist) * e.speed * 0.25 * dt;
    } else if (e.phase < 0.92) {
      e.x += (dx / dist) * 340 * dt;
      e.y += (dy / dist) * 340 * dt;
    } else e.phase = 0;
  }

  private moveLeech(e: Enemy, dt: number, dx: number, dy: number, dist: number) {
    let ally: Enemy | null = null;
    let best = 170 * 170;
    for (const o of this.enemies) {
      if (!o.alive || o === e || o.def.boss || o.hp > o.maxHp * 0.82) continue;
      const d2 = (o.x - e.x) * (o.x - e.x) + (o.y - e.y) * (o.y - e.y);
      if (d2 < best) {
        best = d2;
        ally = o;
      }
    }
    if (ally) {
      const ox = ally.x - e.x;
      const oy = ally.y - e.y;
      const d = Math.hypot(ox, oy) || 1;
      if (d > 34) {
        e.x += (ox / d) * e.speed * dt;
        e.y += (oy / d) * e.speed * dt;
      } else {
        e.shoot -= dt;
        if (e.shoot <= 0) {
          e.shoot = 1.25;
          ally.hp = Math.min(ally.maxHp, ally.hp + 10);
          this.burst(ally.x, ally.y, 4, "#ff5a7a");
        }
      }
      return;
    }
    e.x += (dx / dist) * e.speed * dt;
    e.y += (dy / dist) * e.speed * dt;
  }

  private ring(e: Enemy, n: number, speed: number, color: string) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + this.time * 0.4;
      this.spawnProj({
        x: e.x,
        y: e.y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        r: 6,
        dmg: e.dmg * 0.65,
        life: 3.4,
        friendly: false,
        pierce: 0,
        kind: "enemy",
        color,
      });
    }
  }

  private bossTick(e: Enemy, dt: number) {
    if (e.def.kind === "boss") {
      e.phase += dt;
      if (e.hp < e.maxHp * 0.5 && e.phase > 2.4) {
        e.phase = 0;
        this.ring(e, 8, 130, "#e84dff");
      }
    } else if (e.def.kind === "custodio") {
      e.shoot -= dt;
      e.phase += dt;
      if (e.shoot <= 0) {
        e.shoot = 5.5;
        this.spawnEnemy("specter", false, e);
        this.spawnEnemy("luz", false, e);
      }
      if (e.phase > 8) {
        e.phase = 0;
        this.fogT = Math.max(this.fogT, 7);
        this.flash("El Custodio suelta niebla.");
      }
    } else if (e.def.kind === "reina") {
      e.shoot -= dt;
      e.phase += dt;
      if (e.shoot <= 0) {
        e.shoot = 2.2;
        this.ring(e, 10, 125, "#e879f9");
      }
      if (e.phase > 6.5) {
        e.phase = 0;
        this.spawnEnemy("brasa", false, e);
        this.spawnEnemy("brasa", false, e);
      }
    }
  }

  private updateEnemies(dt: number) {
    const p = this.player;
    for (const e of this.enemies) {
      if (!e.alive) continue;
      e.animT += dt;
      e.hit = Math.max(0, e.hit - dt);
      const dx = p.x - e.x;
      const dy = p.y - e.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (e.def.kind === "luz") {
        this.moveLuz(e, dt, dx, dy, dist);
      } else if (e.def.kind === "sanguijuela") {
        this.moveLeech(e, dt, dx, dy, dist);
      } else if (e.def.ranged && dist < 420) {
        e.shoot -= dt;
        if (e.shoot <= 0 && dist > 90) {
          e.shoot = e.def.boss ? 1.1 : e.def.kind === "espora" ? 2.1 : 1.8;
          const a = Math.atan2(dy, dx);
          const slow = e.def.kind === "espora";
          this.spawnProj({
            x: e.x,
            y: e.y,
            vx: Math.cos(a) * (slow ? 120 : e.def.boss ? 160 : 170),
            vy: Math.sin(a) * (slow ? 120 : e.def.boss ? 160 : 170),
            r: e.def.boss ? 7 : 5,
            dmg: e.dmg,
            life: 3.2,
            friendly: false,
            pierce: 0,
            kind: "enemy",
            color: slow ? "#b6ff6a" : "#ff6b9d",
            slow,
          });
        }
        if (dist < 160) {
          e.x -= (dx / dist) * e.speed * 0.6 * dt;
          e.y -= (dy / dist) * e.speed * 0.6 * dt;
        } else if (dist > 240) {
          e.x += (dx / dist) * e.speed * dt;
          e.y += (dy / dist) * e.speed * dt;
        }
      } else {
        const mul = e.def.kind === "brasa" && dist < 120 ? 1.7 : e.def.kind === "armadura" ? 0.85 : 1;
        e.x += (dx / dist) * e.speed * mul * dt;
        e.y += (dy / dist) * e.speed * mul * dt;
      }
      if (e.def.kind === "armadura") e.phase += dt;
      this.bossTick(e, dt);
      e.flip = dx < 0;
      if (e.def.kind !== "specter") {
        const pushed = this.solidAt(e.x, e.y, e.r * 0.72, 0, 0);
        e.x = pushed.x;
        e.y = pushed.y;
      }

      // separación ligera
      for (const o of this.enemies) {
        if (!o.alive || o === e) continue;
        const ox = o.x - e.x;
        const oy = o.y - e.y;
        const d2 = ox * ox + oy * oy;
        const min = (e.r + o.r) * 0.85;
        if (d2 > 0 && d2 < min * min) {
          const d = Math.sqrt(d2);
          e.x -= (ox / d) * 18 * dt;
          e.y -= (oy / d) * 18 * dt;
        }
      }

      if (dist < e.r + p.r && p.iframe <= 0) {
        const dmg = e.dmg * dt * 2.4 * (1 - p.armor);
        p.hp -= dmg;
        p.hurtT = 0.18;
        this.trauma = Math.min(1, this.trauma + dt * 2);
      }
    }
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      if (!this.enemies[i]!.alive) this.enemies.splice(i, 1);
    }
  }

  private updateProjs(dt: number) {
    const p = this.player;
    for (const pr of this.projs) {
      if (!pr.alive) continue;
      pr.age += dt;
      pr.life -= dt;
      if (pr.kind === "boomerang" && pr.age > 0.45) {
        pr.vx *= -1;
        pr.vy *= -1;
        pr.kind = "bolt";
      }
      pr.x += pr.vx * dt;
      pr.y += pr.vy * dt;
      if (pr.life <= 0) {
        pr.alive = false;
        continue;
      }
      const cover = this.coverHit(pr.x, pr.y, pr.r);
      if (cover) {
        if (pr.friendly && cover.kind === "rock" && !cover.broken) {
          cover.hp -= pr.dmg * 0.45;
          this.burst(pr.x, pr.y, 2, "#dbe4ee");
          if (cover.hp <= 0) this.breakRock(cover);
        }
        pr.alive = false;
        continue;
      }
      if (pr.friendly) {
        for (const e of this.enemies) {
          if (!e.alive) continue;
          if (Math.hypot(e.x - pr.x, e.y - pr.y) < e.r + pr.r) {
            this.hurtEnemy(e, pr.dmg, pr.x, pr.y);
            if (pr.pierce > 0) pr.pierce--;
            else {
              pr.alive = false;
              break;
            }
          }
        }
      } else if (p.iframe <= 0 && Math.hypot(p.x - pr.x, p.y - pr.y) < p.r + pr.r + 4) {
        p.hp -= pr.dmg * (1 - p.armor);
        p.hurtT = 0.2;
        p.iframe = 0.15;
        if (pr.slow) p.slowT = 1.5;
        pr.alive = false;
        this.addTrauma(0.25);
      }
    }
    this.projs = this.projs.filter((x) => x.alive);
  }

  private hurtEnemy(e: Enemy, dmg: number, x: number, y: number) {
    let hit = dmg;
    if (e.def.kind === "armadura" && e.phase % 4 < 1.25) hit *= 0.4;
    e.hp -= hit;
    e.hit = 0.1;
    this.damageDealt += dmg;
    this.audio.hit();
    this.burst(x, y, 3, "#9ff6ff");
    this.float(e.x, e.y - 18, `${Math.round(hit)}`, hit > this.player.dmg * 1.5 ? "#ffd36a" : "#e8f4ff");
    if (e.hp <= 0) this.killEnemy(e);
  }

  private killEnemy(e: Enemy) {
    e.alive = false;
    this.kills += 1;
    /* Deja un cadáver visual que se aplasta y desvanece (animación de muerte). */
    if (this.corpses.length >= 40) this.corpses.shift();
    this.corpses.push({
      x: e.x,
      y: e.y,
      def: e.def,
      flip: e.flip,
      t: 0,
      dur: e.def.boss ? CONFIG.bossDeathAnim : CONFIG.deathAnim,
    });
    this.spawnGem(e.x, e.y, e.xp);
    if (e.def.kind === "brasa") {
      const p = this.player;
      if (p.iframe <= 0 && Math.hypot(p.x - e.x, p.y - e.y) < 74) {
        p.hp -= 22 * (1 - p.armor);
        p.hurtT = 0.2;
        p.iframe = 0.25;
        this.addTrauma(0.35);
      }
      for (const o of this.enemies) {
        if (!o.alive || o === e) continue;
        if (Math.hypot(o.x - e.x, o.y - e.y) < 66) this.hurtEnemy(o, 10, o.x, o.y);
      }
      this.burst(e.x, e.y, 16, "#ff8a3d");
    }
    this.burst(e.x, e.y, e.def.boss ? 22 : e.def.elite ? 12 : 6, e.def.elite ? "#e84dff" : "#7dffb0");
    this.addTrauma(e.def.boss ? 0.8 : e.def.elite ? 0.35 : 0.12);
    this.hitstop = e.def.boss ? 0.08 : 0.03;
    if (e.def.elite || e.def.boss) {
      const purse = e.def.kind === "reina" ? 180 : e.def.kind === "custodio" ? 90 : e.def.boss ? 120 : 35;
      this.coins += purse;
      const id = pick(ECO_POOL);
      this.pickups.push({ kind: "echoOrb", x: e.x, y: e.y, used: false, ecoId: id });
      if (e.def.boss) this.pickups.push({ kind: "altar", x: e.x + 70, y: e.y, used: false });
      this.flash(
        e.def.boss ? `${e.def.name} cae. Un altar y un Eco despiertan.` : "Un Eco yace en el suelo. Acércate.",
      );
    } else if (e.def.kind === "specter") {
      const id = pick(ECO_POOL);
      this.pickups.push({ kind: "echoOrb", x: e.x, y: e.y, used: false, ecoId: id, manual: true });
      this.float(e.x, e.y - 28, "ECO", "#c4b5fd");
    } else if (Math.random() < 0.045) {
      this.pickups.push({ kind: "chest", x: e.x, y: e.y, used: false });
    }
  }

  private spawnGem(x: number, y: number, v: number) {
    if (this.gems.filter((g) => g.alive).length >= CONFIG.maxGems) {
      const g = this.gems.find((x) => x.alive);
      if (g) g.alive = false;
    }
    this.gems.push({ alive: true, x, y, v, t: Math.random() * TAU });
  }

  private updateGems(dt: number) {
    const p = this.player;
    for (const g of this.gems) {
      if (!g.alive) continue;
      g.t += dt;
      const d = Math.hypot(p.x - g.x, p.y - g.y);
      if (d < p.magnet) {
        const a = Math.atan2(p.y - g.y, p.x - g.x);
        const sp = d < 70 ? 280 : 110;
        g.x += Math.cos(a) * sp * dt;
        g.y += Math.sin(a) * sp * dt;
      }
      if (d < 16) {
        g.alive = false;
        this.addXp(g.v);
        this.audio.pickup();
      }
    }
    this.gems = this.gems.filter((g) => g.alive);
  }

  private addXp(v: number) {
    const p = this.player;
    p.xp += v;
    while (p.xp >= p.nextXp) {
      p.xp -= p.nextXp;
      p.level += 1;
      p.nextXp = Math.floor(p.nextXp * 1.22 + 8);
      this.openLevelUp();
    }
  }

  private openLevelUp() {
    const pool = [...UPGRADES].sort(() => Math.random() - 0.5).slice(0, 3);
    this.choices = pool.map((u) => ({ id: u.id, name: u.name, desc: u.desc, icon: u.icon }));
    this.screen = "levelup";
    this.audio.level();
    this.burst(this.player.x, this.player.y, 16, "#5ce8ff");
    this.emit();
  }

  private updatePickups() {
    const p = this.player;
    let best: Pickup | null = null;
    let bestD = 140;
    for (const k of this.pickups) {
      if (k.used) continue;
      const d = Math.hypot(k.x - p.x, k.y - p.y);
      if (d < bestD) {
        best = k;
        bestD = d;
      }
    }
    this.hint = best ? `E · ${this.pickupLabel(best)}` : "";
    const nearProp = this.nearestProp(110);
    if (!best && nearProp) this.hint = `E · ${this.propLabel(nearProp.pr)}`;
    const pressed = this.input.ecoQueued;
    this.input.ecoQueued = false;
    if (pressed) {
      if (best && (!nearProp || bestD <= nearProp.d)) this.usePickup(best);
      else if (nearProp) this.useProp(nearProp.pr);
      else {
        this.flash(
          this.ecos.length
            ? "Nada cerca. Toca un eco del medidor para soltarlo."
            : "Acércate a un cristal, árbol, pilar, roca, cofre o fantasma.",
        );
      }
      this.hint = "";
    } else if (best && !best.manual && bestD < this.autoRange(best)) {
      this.usePickup(best);
      this.hint = "";
    }
    this.pickups = this.pickups.filter((k) => !k.used);
  }

  private nearestProp(max: number) {
    const p = this.player;
    let best: Prop | null = null;
    let bestD = max;
    for (const pr of this.props) {
      if (pr.broken) continue;
      const d = Math.hypot(pr.x - p.x, pr.y - p.y);
      if (d < bestD) {
        best = pr;
        bestD = d;
      }
    }
    return best ? { pr: best, d: bestD } : null;
  }

  private propLabel(pr: Prop) {
    if (pr.cd > 0) return "En reposo";
    if (pr.kind === "crystal") return "Beber cristal";
    if (pr.kind === "tree") return "Sacudir árbol";
    if (pr.kind === "pillar") return "Pulso del pilar";
    return "Romper roca";
  }

  private useProp(pr: Prop) {
    if (pr.broken) return;
    const p = this.player;
    if (pr.cd > 0) {
      this.flash("Todavía resuena. Espera un momento.");
      return;
    }
    if (pr.kind === "crystal") {
      p.hp = Math.min(p.maxHp, p.hp + 24);
      p.cordura = Math.max(0, p.cordura - 16);
      pr.cd = 16;
      this.flash("Cristal — la luz te cose y aclara la mente.");
      this.burst(pr.x, pr.y - 20, 12, "#5ce8ff");
      this.audio.pickup();
    } else if (pr.kind === "tree") {
      this.spawnGem(pr.x + rand(-8, 8), pr.y - 12, 16);
      pr.cd = 14;
      this.flash("Árbol — cae un recuerdo.");
      this.audio.pickup();
    } else if (pr.kind === "pillar") {
      pr.cd = 8;
      p.cordura = clamp(p.cordura + 10, 0, CORDURA_MAX);
      let n = 0;
      for (const e of this.enemies) {
        if (!e.alive) continue;
        if (Math.hypot(e.x - pr.x, e.y - pr.y) < 140) {
          const a = Math.atan2(e.y - pr.y, e.x - pr.x);
          e.x += Math.cos(a) * 22;
          e.y += Math.sin(a) * 22;
          this.hurtEnemy(e, 26 + p.dmg * 0.4, e.x, e.y);
          n++;
        }
      }
      this.flash(n ? `Pilar — pulso. Alcanzó a ${n}.` : "Pilar — el pulso no encontró a nadie. Sube un poco la cordura.");
      this.burst(pr.x, pr.y - 24, 16, "#e879f9");
      this.addTrauma(0.25);
      this.audio.level();
    } else {
      this.breakRock(pr);
    }
    this.hudDirty = true;
  }

  private breakRock(pr: Prop) {
    if (pr.kind !== "rock" || pr.broken) return;
    pr.broken = true;
    pr.hp = 0;
    this.spawnGem(pr.x, pr.y, 12);
    this.coins += 4;
    this.burst(pr.x, pr.y - 8, 14, "#e2e8f0");
    for (const e of this.enemies) {
      if (!e.alive) continue;
      if (Math.hypot(e.x - pr.x, e.y - pr.y) < 78) this.hurtEnemy(e, 14, e.x, e.y);
    }
    this.flash("Roca hecha añicos. El camino queda libre.");
    this.audio.hit();
    this.hudDirty = true;
  }

  private coverHit(x: number, y: number, r: number) {
    for (const pr of this.props) {
      if (pr.broken) continue;
      const c = this.propCollider(pr);
      const dx = x - c.x;
      const dy = y - c.y;
      const min = r + c.r * 0.85;
      if (dx * dx + dy * dy < min * min) return pr;
    }
    return null;
  }

  private updateProps(dt: number) {
    for (const pr of this.props) {
      if (pr.cd > 0) pr.cd = Math.max(0, pr.cd - dt);
    }
  }

  private autoRange(k: Pickup) {
    if (k.kind === "echoOrb" || k.kind === "ghost") return 48;
    if (k.kind === "altar") return 78;
    return 70;
  }

  private pickupLabel(k: Pickup) {
    if (k.kind === "ghost") return "Despertar fantasma";
    if (k.kind === "echoOrb") return "Recoger Eco";
    if (k.kind === "chest") return "Abrir cofre";
    return "Tocar altar";
  }

  private usePickup(k: Pickup) {
    if (k.used) return;
    k.used = true;
    const p = this.player;
    if ((k.kind === "echoOrb" || k.kind === "ghost") && (k.ecoId || k.kind === "ghost")) {
      this.offerEco(k.ecoId ?? pick(ECO_POOL));
      return;
    }
    if (k.kind === "chest") {
      this.coins += 18;
      p.hp = Math.min(p.maxHp, p.hp + 16);
      this.flash("Cofre — fragmentos y un respiro.");
      this.audio.pickup();
      this.hudDirty = true;
      return;
    }
    if (k.kind === "altar") {
      p.maxHp += 18;
      p.hp = p.maxHp;
      p.dmg *= 1.08;
      p.cordura = Math.max(0, p.cordura - 28);
      this.flash("Altar — el recuerdo se vuelve poder. Cordura baja.");
      this.audio.level();
      this.hudDirty = true;
    }
  }

  private offerEco(id: EcoKind) {
    this.pendingEco = ECOS[id];
    this.screen = "echo";
    this.emit();
  }

  private updateEcos(dt: number) {
    const p = this.player;
    const n = this.ecos.length;
    for (let i = 0; i < this.ecos.length; i++) {
      const ec = this.ecos[i]!;
      ec.t += dt;
      const a = this.time * 0.9 + (i * TAU) / Math.max(1, n);
      const rad = 42 + 12 * i;
      const tx = p.x + Math.cos(a) * rad;
      const ty = p.y + Math.sin(a) * rad;
      ec.x += (tx - ec.x) * Math.min(1, dt * 6);
      ec.y += (ty - ec.y) * Math.min(1, dt * 6);
      const cost = ec.def.cordura * (1 - Math.min(0.75, p.bond)) * (dt / 6.5);
      p.cordura = clamp(p.cordura + cost, 0, CORDURA_MAX);
      ec.cd -= dt;
      if (ec.hostile) {
        const ang = Math.atan2(p.y - ec.y, p.x - ec.x);
        ec.x += Math.cos(ang) * 70 * dt;
        ec.y += Math.sin(ang) * 70 * dt;
        if (Math.hypot(ec.x - p.x, ec.y - p.y) < 22 && p.iframe <= 0) {
          p.hp -= 8 * dt;
        }
        continue;
      }
      if (ec.cd > 0) continue;
      const d = ec.def;
      if (d.style === "melee" || d.style === "hybrid") {
        let hit = false;
        for (const e of this.enemies) {
          if (!e.alive) continue;
          if (Math.hypot(e.x - ec.x, e.y - ec.y) < d.range) {
            this.hurtEnemy(e, d.dmg * (1 + p.bond), e.x, e.y);
            hit = true;
          }
        }
        if (hit) ec.cd = d.cooldown;
      }
      if (d.style === "ranged" || d.style === "hybrid") {
        const t = this.nearest(ec.x, ec.y);
        if (t && Math.hypot(t.x - ec.x, t.y - ec.y) < d.range) {
          const ang = Math.atan2(t.y - ec.y, t.x - ec.x);
          this.spawnProj({
            x: ec.x,
            y: ec.y,
            vx: Math.cos(ang) * 320,
            vy: Math.sin(ang) * 320,
            r: 3.5,
            dmg: d.dmg * (1 + p.bond),
            life: 1.1,
            friendly: true,
            pierce: 0,
            kind: "echo",
            color: d.color,
          });
          ec.cd = d.cooldown;
        }
      }
      if (d.style === "heal") {
        p.hp = Math.min(p.maxHp, p.hp + p.maxHp * 0.04);
        this.burst(ec.x, ec.y, 6, "#7dffb0");
        ec.cd = d.cooldown;
      }
    }
    if (n === 0) p.cordura = Math.max(0, p.cordura - CONFIG.corduraDecay * dt);
    if (p.cordura >= CORDURA_MAX && this.collapseT <= 0) this.triggerCollapse();
    if (this.collapseT > 0) {
      this.collapseT -= dt;
      p.hp -= 0.55 * dt;
      if (this.collapseT <= 0) {
        this.ecos = [];
        p.cordura = 32;
        this.flash("La realidad vuelve a encajar. Los Ecos se han ido.");
      }
    }
  }

  private triggerCollapse() {
    this.collapseT = CONFIG.collapseDuration;
    for (const e of this.ecos) e.hostile = true;
    this.audio.collapse();
    this.addTrauma(0.9);
    this.flash("COLAPSO — tus Ecos ya no te obedecen.");
  }

  private updateFx(dt: number) {
    for (const pt of this.parts) {
      if (!pt.alive) continue;
      pt.life -= dt;
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      if (pt.life <= 0) pt.alive = false;
    }
    this.parts = this.parts.filter((p) => p.alive);
    for (const f of this.floats) {
      f.life -= dt;
      f.y -= 28 * dt;
    }
    this.floats = this.floats.filter((f) => f.life > 0);
    for (const c of this.corpses) c.t += dt;
    this.corpses = this.corpses.filter((c) => c.t < c.dur);
  }

  private burst(x: number, y: number, n: number, color: string) {
    const cap = CONFIG.maxParticles - this.parts.length;
    const c = Math.min(n, Math.max(0, cap));
    for (let i = 0; i < c; i++) {
      this.parts.push({
        alive: true,
        x,
        y,
        vx: rand(-90, 90),
        vy: rand(-90, 90),
        life: rand(0.2, 0.55),
        max: 0.55,
        s: rand(1.5, 3.4),
        color,
      });
    }
  }

  private float(x: number, y: number, text: string, color: string) {
    if (this.floats.length > 24) this.floats.shift();
    this.floats.push({ alive: true, x, y, text, life: 0.7, color });
  }

  private addTrauma(v: number) {
    if (!this.meta.shake || this.reducedMotion) return;
    this.trauma = Math.min(1, this.trauma + v);
  }

  private endRun(win: boolean) {
    const gained = Math.floor(this.time / 8) + this.coins;
    this.meta.coins += gained;
    this.meta.best = Math.max(this.meta.best, this.time);
    writeMeta(this.meta);
    this.coins = gained;
    this.screen = win ? "win" : "dead";
    if (!win) this.audio.death();
    this.emit();
  }

  /* ---------------- dibujo ---------------- */
  private draw() {
    const ctx = this.ctx;
    const { w, h } = this;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, w, h);

    const shake = this.trauma * this.trauma;
    const sx = this.meta.shake && !this.reducedMotion ? (Math.random() * 2 - 1) * shake * 10 : 0;
    const sy = this.meta.shake && !this.reducedMotion ? (Math.random() * 2 - 1) * shake * 10 : 0;
    const camX = Math.round(this.camX + sx);
    const camY = Math.round(this.camY + sy);

    this.drawGround(camX, camY);

    const sprites: { y: number; draw: () => void }[] = [];
    for (const pr of this.props) {
      const x = pr.x - camX;
      const y = pr.y - camY;
      if (x < -140 || y < -160 || x > w + 140 || y > h + 40) continue;
      sprites.push({ y: pr.y, draw: () => this.drawProp(pr, camX, camY) });
    }
    for (const k of this.pickups) {
      if (k.used) continue;
      sprites.push({ y: k.y, draw: () => this.drawPickup(k, camX, camY) });
    }
    for (const g of this.gems) {
      if (!g.alive) continue;
      sprites.push({ y: g.y, draw: () => this.drawGem(g, camX, camY) });
    }
    for (const c of this.corpses) {
      sprites.push({ y: c.y - 1, draw: () => this.drawCorpse(c, camX, camY) });
    }
    for (const e of this.enemies) {
      if (!e.alive) continue;
      if (this.fogT > 0 && Math.hypot(e.x - this.player.x, e.y - this.player.y) > 190) continue;
      sprites.push({ y: e.y, draw: () => this.drawEnemy(e, camX, camY) });
    }
    for (const ec of this.ecos) {
      sprites.push({ y: ec.y, draw: () => this.drawEco(ec, camX, camY) });
    }
    sprites.push({ y: this.player.y, draw: () => this.drawPlayer(camX, camY) });
    sprites.sort((a, b) => a.y - b.y);
    for (const s of sprites) s.draw();

    for (const pr of this.projs) this.drawBolt(pr, camX, camY);
    for (const pt of this.parts) this.drawPart(pt, camX, camY);
    for (const f of this.floats) this.drawFloat(f, camX, camY);

    this.drawVignette();
    if (this.screen !== "playing" && this.screen !== "paused" && this.screen !== "levelup" && this.screen !== "echo") {
      this.drawMenuBackdrop();
      return;
    }
  }

  private drawGround(camX: number, camY: number) {
    const ctx = this.ctx;
    const g = this.sprites.ground;
    const { w, h } = this;
    if (g) {
      const x0 = Math.floor(camX / TILE) * TILE;
      const y0 = Math.floor(camY / TILE) * TILE;
      for (let y = y0; y < camY + h + TILE; y += TILE) {
        for (let x = x0; x < camX + w + TILE; x += TILE) {
          ctx.drawImage(g, x - camX, y - camY, TILE, TILE);
        }
      }
    } else {
      ctx.fillStyle = "#0c1220";
      ctx.fillRect(0, 0, w, h);
    }
  }

  private drawProp(pr: Prop, camX: number, camY: number) {
    const im = this.sprites[`prop_${pr.kind}`];
    if (!im || pr.broken) return;
    const ctx = this.ctx;
    const dw = im.width * pr.s;
    const dh = im.height * pr.s;
    const x = pr.x - camX;
    const y = pr.y - camY;
    ctx.save();
    if (pr.cd > 0) ctx.globalAlpha = 0.45;
    ctx.drawImage(im, x - dw / 2, y - dh, dw, dh);
    ctx.restore();
    if (pr.kind === "rock" && pr.hp < pr.maxHp) {
      const w = 22;
      ctx.fillStyle = "#1a1a28";
      ctx.fillRect(x - w / 2, y - dh - 6, w, 3);
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(x - w / 2, y - dh - 6, w * clamp(pr.hp / pr.maxHp, 0, 1), 3);
    }
    if (Math.hypot(pr.x - this.player.x, pr.y - this.player.y) < 150) {
      const tag =
        pr.cd > 0
          ? "En reposo"
          : pr.kind === "crystal"
            ? "E  Luz"
            : pr.kind === "tree"
              ? "E  Recuerdo"
              : pr.kind === "pillar"
                ? "E  Pulso"
                : "E  Romper";
      this.drawTag(x, y - dh - 8, tag);
    }
  }

  private drawSheet(
    img: HTMLImageElement | undefined,
    frame: number,
    x: number,
    y: number,
    size: number,
    flip: boolean,
    flash = false,
    cols = 2,
    rows = 2,
  ) {
    const ctx = this.ctx;
    if (!img || !img.width) {
      ctx.fillStyle = flash ? "#fff" : "#5ce8ff";
      ctx.beginPath();
      ctx.arc(x, y, size * 0.35, 0, TAU);
      ctx.fill();
      return;
    }
    const fw = img.width / cols;
    const fh = img.height / rows;
    const col = frame % cols;
    const row = Math.floor(frame / cols) % rows;
    ctx.save();
    ctx.translate(x, y);
    if (flip) ctx.scale(-1, 1);
    ctx.drawImage(img, col * fw, row * fh, fw, fh, -size / 2, -size / 2, size, size);
    if (flash) {
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  private drawPlayer(camX: number, camY: number) {
    const p = this.player;
    const x = p.x - camX;
    const y = p.y - camY;
    const sheet =
      p.anim === "attack"
        ? this.sprites.player_attack
        : p.anim === "walk"
          ? this.sprites.player_walk
          : this.sprites.player_idle;
    const fps = p.anim === "walk" ? 10 : p.anim === "attack" ? 12 : 4;
    const frame = Math.floor(p.animT * fps) % 4;
    if (this.collapseT > 0) {
      this.ctx.save();
      this.ctx.globalAlpha = 0.35;
      this.ctx.fillStyle = "#e84dff";
      this.ctx.beginPath();
      this.ctx.arc(x, y, 28 + Math.sin(this.time * 8) * 4, 0, TAU);
      this.ctx.fill();
      this.ctx.restore();
    }
    this.drawSheet(sheet, frame, x, y, 56, p.flip, p.hurtT > 0);
  }

  private drawEnemy(e: Enemy, camX: number, camY: number) {
    const x = e.x - camX;
    const y = e.y - camY;
    const frame = Math.floor(e.animT * (e.def.kind === "bat" ? 10 : 6)) % 4;
    this.drawSheet(this.sprites[e.def.sheet], frame, x, y, e.def.draw, e.flip, e.hit > 0);
    const ctx = this.ctx;
    if (e.def.kind === "luz" && e.phase > 0.5 && e.phase < 0.92) {
      ctx.strokeStyle = "#e8fbff";
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(x, y, e.def.draw * 0.45, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    if (e.def.kind === "armadura" && e.phase % 4 < 1.25) {
      ctx.strokeStyle = "#9ff6ff";
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(x, y, e.def.draw * 0.42, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    if (e.def.elite || e.def.boss) {
      const ctx = this.ctx;
      const w = e.def.draw * 0.7;
      ctx.fillStyle = "#1a1a28";
      ctx.fillRect(x - w / 2, y - e.def.draw * 0.55, w, 4);
      ctx.fillStyle = "#ff4d6a";
      ctx.fillRect(x - w / 2, y - e.def.draw * 0.55, w * clamp(e.hp / e.maxHp, 0, 1), 4);
    }
  }

  /** Animación de muerte: destello blanco, se aplasta hacia el suelo y se desvanece. */
  private drawCorpse(c: Corpse, camX: number, camY: number) {
    const k = clamp(c.t / c.dur, 0, 1);
    const size = c.def.draw;
    const ctx = this.ctx;
    const death = c.def.death ? this.sprites[c.def.death] : undefined;
    const frame = death && death.width ? Math.min(3, Math.floor(k * 4)) : 0;
    ctx.save();
    ctx.globalAlpha = 1 - k * k;
    ctx.translate(c.x - camX, c.y - camY + size * 0.5);
    ctx.scale(1 + (death ? 0.08 : 0.3) * k, 1 - (death ? 0.2 : 0.75) * k);
    ctx.translate(0, -size * 0.5);
    this.drawSheet(death && death.width ? death : this.sprites[c.def.sheet], frame, 0, 0, size, c.flip, !death && k < 0.25);
    ctx.restore();
  }

  private drawEco(ec: EcoAlly, camX: number, camY: number) {
    const x = ec.x - camX;
    const y = ec.y - camY + Math.sin(ec.t * 3) * 3;
    const frame = Math.floor(ec.t * 4) % 4;
    this.ctx.save();
    this.ctx.globalAlpha = ec.hostile ? 0.95 : 0.85;
    this.drawSheet(this.sprites[ec.def.sheet], frame, x, y, 44, false, ec.hostile);
    this.ctx.restore();
    this.ctx.strokeStyle = ec.hostile ? "#ff4d6a" : ec.def.color;
    this.ctx.globalAlpha = 0.4;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 16 + Math.sin(ec.t * 5) * 2, 0, TAU);
    this.ctx.stroke();
    this.ctx.globalAlpha = 1;
  }

  private drawBolt(pr: Proj, camX: number, camY: number) {
    const ctx = this.ctx;
    const x = pr.x - camX;
    const y = pr.y - camY;
    const key = pr.kind === "enemy" ? "bolt_enemy" : pr.kind === "echo" ? "bolt_echo" : "bolt";
    const im = this.sprites[key];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.atan2(pr.vy, pr.vx));
    if (im && im.width) {
      const fw = im.width / 2;
      const fh = im.height / 2;
      const frame = Math.floor(pr.age * 10) % 4;
      const col = frame % 2;
      const row = Math.floor(frame / 2) % 2;
      const size = pr.kind === "enemy" ? 36 : pr.kind === "echo" ? 32 : 34;
      ctx.drawImage(im, col * fw, row * fh, fw, fh, -size * 0.55, -size * 0.38, size, size * 0.75);
    } else {
      ctx.fillStyle = pr.color;
      ctx.shadowColor = pr.color;
      ctx.shadowBlur = 8;
      ctx.fillRect(-10, -pr.r, 16, pr.r * 2);
    }
    ctx.restore();
  }

  private drawGem(g: Gem, camX: number, camY: number) {
    const x = g.x - camX;
    const y = g.y - camY + Math.sin(g.t * 5) * 2;
    const im = this.sprites.xp_gem;
    const frame = Math.floor(g.t * 6) % 4;
    this.drawSheet(im, frame, x, y, 26, false, false, 2, 2);
  }

  private drawPickup(k: Pickup, camX: number, camY: number) {
    const x = k.x - camX;
    const y = k.y - camY;
    const near = Math.hypot(k.x - this.player.x, k.y - this.player.y) < 170;
    if (k.kind === "echoOrb" || k.kind === "ghost") {
      const sheet =
        k.kind === "ghost"
          ? this.sprites.specter
          : this.sprites[k.ecoId ? `eco_${k.ecoId}` : "eco_guerrero"];
      const frame = Math.floor(this.time * 4) % 4;
      this.ctx.save();
      this.ctx.globalAlpha = 0.88;
      this.drawSheet(sheet, frame, x, y - 8, k.kind === "ghost" ? 54 : 42, false);
      this.ctx.restore();
      this.ctx.save();
      this.ctx.strokeStyle = k.kind === "ghost" ? "#c4b5fd" : "#5ce8ff";
      this.ctx.globalAlpha = 0.75;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 20 + Math.sin(this.time * 3) * 2, 0, TAU);
      this.ctx.stroke();
      this.ctx.restore();
      if (near) this.drawTag(x, y - 40, k.kind === "ghost" ? "E  Fantasma" : "E  Eco");
      return;
    }
    const key = k.kind === "chest" ? "prop_chest" : "prop_altar";
    const im = this.sprites[key];
    if (im) this.ctx.drawImage(im, x - im.width / 2, y - im.height, im.width, im.height);
    if (near) this.drawTag(x, y - (im?.height ?? 48) - 6, k.kind === "chest" ? "E  Cofre" : "E  Altar");
  }

  private drawTag(x: number, y: number, text: string) {
    const ctx = this.ctx;
    ctx.save();
    ctx.font = "700 11px Nunito, sans-serif";
    ctx.textAlign = "center";
    const w = ctx.measureText(text).width + 14;
    ctx.fillStyle = "rgba(7,11,22,0.82)";
    ctx.fillRect(x - w / 2, y - 12, w, 16);
    ctx.fillStyle = "#d7fbff";
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  private drawPart(pt: Particle, camX: number, camY: number) {
    const ctx = this.ctx;
    ctx.globalAlpha = clamp(pt.life / pt.max, 0, 1);
    ctx.fillStyle = pt.color;
    ctx.fillRect(pt.x - camX, pt.y - camY, pt.s, pt.s);
    ctx.globalAlpha = 1;
  }

  private drawFloat(f: Floater, camX: number, camY: number) {
    const ctx = this.ctx;
    ctx.globalAlpha = clamp(f.life / 0.7, 0, 1);
    ctx.fillStyle = f.color;
    ctx.font = "700 12px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(f.text, f.x - camX, f.y - camY);
    ctx.globalAlpha = 1;
    ctx.textAlign = "start";
  }

  private drawVignette() {
    const ctx = this.ctx;
    const { w, h } = this;
    const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.72);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, this.collapseT > 0 ? "rgba(80,0,40,0.55)" : "rgba(0,0,0,0.45)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    if (this.player.hp / this.player.maxHp < 0.25 && this.screen === "playing") {
      ctx.fillStyle = `rgba(255,50,80,${0.06 + 0.05 * Math.sin(this.time * 7)})`;
      ctx.fillRect(0, 0, w, h);
    }
    if (this.fogT > 0 && (this.screen === "playing" || this.screen === "paused")) {
      const a = Math.min(0.45, this.fogT / 18) * 0.55;
      ctx.fillStyle = `rgba(186, 198, 220, ${a})`;
      ctx.fillRect(0, 0, w, h);
    }
  }

  private drawMenuBackdrop() {
    const bg = this.sprites.menuBg;
    const ctx = this.ctx;
    if (bg) ctx.drawImage(bg, 0, 0, this.w, this.h);
    else {
      ctx.fillStyle = "#070b16";
      ctx.fillRect(0, 0, this.w, this.h);
    }
    const p = this.sprites.player_idle;
    if (p) this.drawSheet(p, 0, this.w * 0.2, this.h * 0.62, Math.min(240, this.h * 0.42), false);
  }

  emit() {
    const p = this.player;
    this.onUi({
      screen: this.screen,
      hp: p?.hp ?? 0,
      maxHp: p?.maxHp ?? 1,
      xp: p?.xp ?? 0,
      nextXp: p?.nextXp ?? 1,
      level: p?.level ?? 1,
      time: this.time,
      kills: this.kills,
      coins: this.screen === "dead" || this.screen === "win" ? this.coins : this.meta.coins + this.coins,
      cordura: p?.cordura ?? 0,
      wave: Math.floor(this.time / 30) + 1,
      collapse: this.collapseT > 0,
      ecos: this.ecos.map((e) => ({ id: e.def.id, name: e.def.name, color: e.def.color })),
      choices: this.choices,
      pendingEco: this.pendingEco,
      message: this.msgT > 0 ? this.message : "",
      meta: this.meta,
      dashCd: p?.dashCd ?? 0,
      dashMax: CONFIG.dashCooldown,
      damageDealt: Math.floor(this.damageDealt),
      eventText: this.eventText,
      interact: this.screen === "playing" ? this.hint : "",
      ready: this.ready,
    });
  }
}

export function formatTime(t: number) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

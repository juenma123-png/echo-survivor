import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Ghost, a as User, c as Sword, d as Shield, f as Pause, g as Heart, h as Layers, i as Volume2, l as Sparkles, m as Magnet, n as Wind, p as Maximize2, r as VolumeX, s as Target, t as Zap, u as Skull, v as Coins } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B-riOO8x.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Echo Survivor — datos de diseño y balance inicial. */
var WORLD = 4200;
var CONFIG = {
	spawnInterval0: 1.45,
	spawnIntervalMin: .32,
	rampEvery: 25,
	enemyScalePerRamp: .09,
	corduraPerEco: 3.2,
	corduraDecay: 1.4,
	collapseDuration: 8,
	magnetBase: 78,
	playerSpeed: 168,
	playerHp: 100,
	playerDmg: 16,
	playerRadius: 14,
	fireInterval: .55,
	dashSpeed: 420,
	dashTime: .22,
	dashCooldown: 1.35,
	maxEnemies: 86,
	maxProjectiles: 90,
	maxParticles: 160,
	maxGems: 80
};
var ENEMIES = {
	slime: {
		kind: "slime",
		name: "Slime",
		hp: 20,
		speed: 58,
		dmg: 5,
		xp: 5,
		r: 13,
		draw: 38,
		sheet: "slime"
	},
	bat: {
		kind: "bat",
		name: "Murciélago",
		hp: 12,
		speed: 148,
		dmg: 4,
		xp: 4,
		r: 10,
		draw: 36,
		sheet: "bat"
	},
	skeleton: {
		kind: "skeleton",
		name: "Esqueleto",
		hp: 70,
		speed: 42,
		dmg: 9,
		xp: 10,
		r: 15,
		draw: 48,
		sheet: "skeleton"
	},
	spider: {
		kind: "spider",
		name: "Araña",
		hp: 18,
		speed: 55,
		dmg: 6,
		xp: 8,
		r: 12,
		draw: 40,
		sheet: "spider",
		ranged: true
	},
	specter: {
		kind: "specter",
		name: "Espectro",
		hp: 28,
		speed: 72,
		dmg: 7,
		xp: 9,
		r: 13,
		draw: 42,
		sheet: "specter"
	},
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
		elite: true
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
		boss: true
	}
};
var ECOS = {
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
		style: "melee"
	},
	arquero: {
		id: "arquero",
		name: "Eco del Arquero",
		phrase: "Cada flecha que disparo es un recuerdo que se aleja.",
		color: "#34d399",
		cordura: 25,
		cooldown: .85,
		range: 260,
		dmg: 11,
		sheet: "eco_arquero",
		style: "ranged"
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
		style: "heal"
	},
	fusion: {
		id: "fusion",
		name: "Resonancia",
		phrase: "Dos voces, un solo eco.",
		color: "#e879f9",
		cordura: 28,
		cooldown: .7,
		range: 110,
		dmg: 14,
		sheet: "eco_fusion",
		style: "hybrid"
	}
};
var ECO_POOL = [
	"guerrero",
	"arquero",
	"sanador"
];
var UPGRADES = [
	{
		id: "dmg",
		name: "Filo Espectral",
		desc: "+20% daño de ataque",
		icon: "sword"
	},
	{
		id: "spd",
		name: "Paso Ligero",
		desc: "+15% velocidad de movimiento",
		icon: "wind"
	},
	{
		id: "proj",
		name: "Eco Múltiple",
		desc: "+1 proyectil por disparo",
		icon: "layers"
	},
	{
		id: "area",
		name: "Onda Expansiva",
		desc: "+25% área de impacto",
		icon: "maximize"
	},
	{
		id: "hp",
		name: "Vestigio de Vida",
		desc: "+20% vida máxima y cura",
		icon: "heart"
	},
	{
		id: "aspd",
		name: "Furia Silenciosa",
		desc: "+15% velocidad de ataque",
		icon: "zap"
	},
	{
		id: "crit",
		name: "Golpe del Olvido",
		desc: "+10% crítico (x1.8 daño)",
		icon: "target"
	},
	{
		id: "magnet",
		name: "Llamado de Almas",
		desc: "+30% radio de recolección",
		icon: "magnet"
	},
	{
		id: "regen",
		name: "Aliento Persistente",
		desc: "+1.5 vida por segundo",
		icon: "sparkles"
	},
	{
		id: "solo",
		name: "Camino Solitario",
		desc: "Sin Ecos: +25% daño y +10% vel.",
		icon: "user"
	}
];
var META_SHOP = [
	{
		id: "damage",
		name: "Núcleo permanente",
		desc: "+5% daño por rango",
		cost: 40
	},
	{
		id: "hp",
		name: "Costura vital",
		desc: "+10 vida máxima por rango",
		cost: 35
	},
	{
		id: "speed",
		name: "Paso fantasma",
		desc: "+4% velocidad por rango",
		cost: 45
	},
	{
		id: "magnet",
		name: "Imán de recuerdos",
		desc: "+6% imán por rango",
		cost: 30
	}
];
var SPRITE_URLS = {
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
	prop_rock: "/sprites/prop_rock.png",
	prop_crystal: "/sprites/prop_crystal.png",
	prop_tree: "/sprites/prop_tree.png",
	prop_pillar: "/sprites/prop_pillar.png",
	prop_chest: "/sprites/prop_chest.png",
	prop_altar: "/sprites/prop_altar.png",
	ground: "/maps/ground.png",
	menuBg: "/maps/menu-bg.jpg"
};
var GDD_TEXT = {
	pitch: "Estás solo. Cada élite caído deja un Eco: un aliado espectral con un recuerdo. Invócalos y ganas poder, pero tu Cordura se resquebraja. ¿Te rodeas de fantasmas o caminas el sendero solitario?",
	loop: [
		"Apareces en un claro nocturno infinito.",
		"Muévete en 8 direcciones. El ataque es automático.",
		"Recoge fragmentos de XP y elige 1 de 3 mejoras al subir de nivel.",
		"Oleadas, élites y un jefe a los 8:00.",
		"Invoca hasta 3 Ecos. Fusionarlos los borra para siempre.",
		"Si la Cordura llega a 100, Colapso: más daño, menos control.",
		"Sobrevive 15 minutos o cae. Las monedas persisten entre runs."
	]
};
/**
* Echo Survivor — motor Canvas 2D.
* Comentarios de sección en español. Movimiento en 8 direcciones, autoataque,
* oleadas, Ecos, Cordura y meta-progresión en localStorage.
*/
var SAVE_KEY = "echo_survivor_meta_v1";
var TAU = Math.PI * 2;
function clamp(v, a, b) {
	return v < a ? a : v > b ? b : v;
}
function rand(a, b) {
	return a + Math.random() * (b - a);
}
function pick(arr) {
	return arr[Math.random() * arr.length | 0];
}
function loadImg(src) {
	return new Promise((resolve, reject) => {
		const im = new Image();
		im.crossOrigin = "anonymous";
		im.onload = () => resolve(im);
		im.onerror = () => reject(new Error(src));
		im.src = src;
	});
}
function defaultMeta() {
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
		sfx: true
	};
}
function readMeta() {
	try {
		const raw = localStorage.getItem(SAVE_KEY);
		if (!raw) return defaultMeta();
		return {
			...defaultMeta(),
			...JSON.parse(raw)
		};
	} catch {
		return defaultMeta();
	}
}
function writeMeta(m) {
	try {
		localStorage.setItem(SAVE_KEY, JSON.stringify(m));
	} catch {}
}
var Synth = class {
	ctx = null;
	master = null;
	music = null;
	sfx = null;
	drone = null;
	heart = null;
	enabled = true;
	musicOn = true;
	unlock() {
		if (this.ctx) {
			if (this.ctx.state === "suspended") this.ctx.resume();
			return;
		}
		const AC = window.AudioContext || window.webkitAudioContext;
		this.ctx = new AC({ latencyHint: "interactive" });
		this.master = this.ctx.createGain();
		this.music = this.ctx.createGain();
		this.sfx = this.ctx.createGain();
		this.master.gain.value = .7;
		this.music.gain.value = .18;
		this.sfx.gain.value = .45;
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
		g.gain.value = .35;
		o1.connect(g);
		o2.connect(g);
		g.connect(this.music);
		o1.start();
		o2.start();
		this.drone = o1;
	}
	beep(freq, dur, type = "square", vol = .12) {
		if (!this.enabled || !this.ctx || !this.sfx) return;
		const t = this.ctx.currentTime;
		const o = this.ctx.createOscillator();
		const g = this.ctx.createGain();
		o.type = type;
		o.frequency.value = freq * (.96 + Math.random() * .08);
		g.gain.setValueAtTime(vol, t);
		g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
		o.connect(g);
		g.connect(this.sfx);
		o.start(t);
		o.stop(t + dur + .02);
	}
	hit() {
		this.beep(180 + Math.random() * 80, .08, "square", .08);
	}
	crit() {
		this.beep(520, .12, "sawtooth", .1);
	}
	pickup() {
		this.beep(740, .09, "sine", .08);
	}
	level() {
		this.beep(392, .12, "triangle", .12);
		this.beep(523, .18, "triangle", .1);
	}
	dash() {
		this.beep(140, .14, "sawtooth", .07);
	}
	collapse() {
		this.beep(70, .4, "sawtooth", .16);
	}
	death() {
		this.beep(110, .5, "triangle", .14);
	}
	setMusic(on) {
		this.musicOn = on;
		if (this.music) this.music.gain.setTargetAtTime(on ? .18 : 0, this.ctx.currentTime, .05);
	}
	setSfx(on) {
		this.enabled = on;
	}
	setCordura(n) {
		if (!this.music) return;
		const extra = n / 100 * .08;
		this.music.gain.setTargetAtTime(this.musicOn ? .18 + extra : 0, this.ctx.currentTime, .2);
	}
};
var EchoGame = class {
	canvas;
	ctx;
	onUi;
	sprites = {};
	ready = false;
	screen = "boot";
	meta = defaultMeta();
	input = {
		keys: /* @__PURE__ */ new Set(),
		injected: null,
		stickX: 0,
		stickY: 0,
		dashQueued: false,
		ecoQueued: false
	};
	audio = new Synth();
	w = 1280;
	h = 720;
	dpr = 1;
	acc = 0;
	last = 0;
	raf = 0;
	camX = 0;
	camY = 0;
	trauma = 0;
	hitstop = 0;
	player;
	enemies = [];
	projs = [];
	gems = [];
	parts = [];
	floats = [];
	ecos = [];
	props = [];
	pickups = [];
	time = 0;
	kills = 0;
	coins = 0;
	damageDealt = 0;
	collapseT = 0;
	spawnCd = 0;
	eliteCd = 45;
	bossSpawned = false;
	eventText = "";
	fogT = 0;
	message = "";
	msgT = 0;
	choices = [];
	pendingEco = null;
	hudDirty = true;
	reducedMotion = false;
	destroyed = false;
	bound = [];
	constructor(canvas, onUi) {
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
	listen(target, type, fn, capture = false) {
		target.addEventListener(type, fn, capture);
		this.bound.push([
			type,
			fn,
			capture
		]);
	}
	attachInput() {
		const onKey = (e) => {
			if (e.repeat) return;
			if ([
				"ArrowUp",
				"ArrowDown",
				"ArrowLeft",
				"ArrowRight",
				"Space"
			].includes(e.code)) e.preventDefault();
			if (e.type === "keydown") {
				this.input.keys.add(e.code);
				if (e.code === "Escape") this.togglePause();
				if (e.code === "KeyE" || e.code === "KeyF") this.input.ecoQueued = true;
				if (e.code === "Space" || e.code === "ShiftLeft") this.input.dashQueued = true;
			} else this.input.keys.delete(e.code);
		};
		this.listen(window, "keydown", onKey);
		this.listen(window, "keyup", onKey);
		this.listen(window, "blur", () => this.input.keys.clear());
		this.listen(document, "visibilitychange", () => {
			if (document.hidden) this.input.keys.clear();
			else if (this.audio.ctx?.state === "suspended") this.audio.ctx.resume();
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
			this.audio.ctx?.close();
		} catch {}
	}
	resize() {
		const rect = (this.canvas.parentElement ?? this.canvas).getBoundingClientRect();
		this.w = Math.max(320, rect.width || window.innerWidth);
		this.h = Math.max(240, rect.height || window.innerHeight);
		this.dpr = Math.min(window.devicePixelRatio || 1, 2);
		this.canvas.width = Math.floor(this.w * this.dpr);
		this.canvas.height = Math.floor(this.h * this.dpr);
		this.canvas.style.width = `${this.w}px`;
		this.canvas.style.height = `${this.h}px`;
		this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
	}
	async boot() {
		const entries = Object.entries(SPRITE_URLS);
		await Promise.all(entries.map(async ([k, url]) => {
			try {
				this.sprites[k] = await loadImg(url);
			} catch {}
		}));
		this.ready = true;
		this.screen = "menu";
		this.resetWorld(false);
		this.wireControlsTest();
		this.emit();
		this.last = performance.now();
		const loop = (t) => {
			if (this.destroyed) return;
			this.frame(t);
			this.raf = requestAnimationFrame(loop);
		};
		this.raf = requestAnimationFrame(loop);
	}
	wireControlsTest() {
		const self = this;
		window.__controlsTest = {
			getYaw: () => self.player?.facing ?? 0,
			getSpeed: () => Math.hypot(self.player?.vx ?? 0, self.player?.vy ?? 0),
			setKeys: (codes) => {
				self.input.injected = codes;
			},
			setSteer: (v) => {
				self.input.stickX = -v;
			}
		};
	}
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
	open(screen) {
		this.screen = screen;
		this.emit();
	}
	setStick(x, y) {
		this.input.stickX = x;
		this.input.stickY = y;
	}
	queueDash() {
		this.input.dashQueued = true;
	}
	queueEco() {
		this.input.ecoQueued = true;
	}
	chooseUpgrade(id) {
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
				const inc = p.maxHp * .2;
				p.maxHp += inc;
				p.hp = Math.min(p.maxHp, p.hp + inc);
				break;
			}
			case "aspd":
				p.fireRate *= 1.15;
				break;
			case "crit":
				p.crit = Math.min(.7, p.crit + .1);
				break;
			case "magnet":
				p.magnet *= 1.3;
				break;
			case "regen":
				p.regen += 1.5;
				break;
			case "solo": p.solitude = true;
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
		if (this.ecos.length >= 3) {
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
		if (!this.pendingEco || this.ecos.length < 2) return;
		this.ecos.splice(0, 2);
		this.addEco("fusion");
		this.player.dmg *= 1.12;
		this.player.cordura = Math.max(0, this.player.cordura - 22);
		this.pendingEco = null;
		this.screen = "playing";
		this.flash("Fusión: dos voces, un solo eco. Los originales se borran.");
		this.emit();
	}
	dismissEco() {
		this.ecos.shift();
		this.flash("Liberaste un Eco.");
		this.emit();
	}
	buyMeta(id) {
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
	setSetting(k, v) {
		this.meta[k] = v;
		if (k === "music") this.audio.setMusic(v);
		if (k === "sfx") this.audio.setSfx(v);
		writeMeta(this.meta);
		this.emit();
	}
	resetWorld(play) {
		const m = this.meta;
		const hp = CONFIG.playerHp + m.hp * 10;
		this.player = {
			x: WORLD / 2,
			y: WORLD / 2,
			r: CONFIG.playerRadius,
			hp,
			maxHp: hp,
			speed: CONFIG.playerSpeed * (1 + m.speed * .04),
			xp: 0,
			nextXp: 18,
			level: 1,
			dmg: CONFIG.playerDmg * (1 + m.damage * .05),
			projectiles: 1,
			area: 1,
			fireCd: 0,
			fireRate: 1,
			magnet: CONFIG.magnetBase * (1 + m.magnet * .06),
			crit: .06,
			regen: .15,
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
			hurtT: 0
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
		this.spawnCd = .4;
		this.eliteCd = 45;
		this.bossSpawned = false;
		this.eventText = "";
		this.fogT = 0;
		this.camX = this.player.x - this.w / 2;
		this.camY = this.player.y - this.h / 2;
		this.trauma = 0;
		this.pendingEco = null;
		this.choices = [];
		this.seedProps();
		if (play) for (let i = 0; i < 6; i++) this.spawnEnemy(this.rollBasic(), true);
	}
	seedProps() {
		this.props = [];
		const kinds = [
			"rock",
			"crystal",
			"tree",
			"pillar"
		];
		for (let i = 0; i < 70; i++) this.props.push({
			x: rand(80, WORLD - 80),
			y: rand(80, WORLD - 80),
			kind: pick(kinds),
			s: rand(.85, 1.35)
		});
	}
	addEco(id) {
		const def = ECOS[id];
		this.ecos.push({
			def,
			x: this.player.x,
			y: this.player.y,
			cd: .3,
			t: 0,
			hostile: false
		});
		this.flash(`Eco invocado: ${def.name}`);
		this.audio.pickup();
	}
	flash(text) {
		this.message = text;
		this.msgT = 2.4;
	}
	frame(t) {
		const raw = Math.min(.1, (t - this.last) / 1e3 || .016);
		this.last = t;
		this.acc += raw;
		const step = 1 / 60;
		while (this.acc >= step) {
			if (this.hitstop > 0) this.hitstop -= step;
			else if (this.screen === "playing") this.update(step);
			this.acc -= step;
		}
		this.draw();
		if (this.hudDirty) {
			this.emit();
			this.hudDirty = false;
		}
	}
	keys() {
		if (this.input.injected) return new Set(this.input.injected);
		return this.input.keys;
	}
	update(dt) {
		const p = this.player;
		this.time += dt;
		if (this.msgT > 0) this.msgT -= dt;
		this.trauma = Math.max(0, this.trauma - dt * 1.8);
		p.hurtT = Math.max(0, p.hurtT - dt);
		p.iframe = Math.max(0, p.iframe - dt);
		p.dashCd = Math.max(0, p.dashCd - dt);
		p.dashT = Math.max(0, p.dashT - dt);
		p.animT += dt;
		p.fireCd -= dt;
		if (p.regen) p.hp = clamp(p.hp + p.regen * dt, 0, p.maxHp);
		this.movePlayer(dt);
		this.updateEcos(dt);
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
				this.flash("EVENTO — Resonancia hostil (+vida enemiga)");
			}
		}
		if (this.fogT > 0) this.fogT -= dt;
		if (this.time >= 900) {
			this.endRun(true);
			return;
		}
		if (p.hp <= 0) {
			this.endRun(false);
			return;
		}
		this.hudDirty = true;
	}
	movePlayer(dt) {
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
		} else if (mag > .12) {} else {
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
				p.iframe = .22;
				p.vx = dx / n * CONFIG.dashSpeed;
				p.vy = dy / n * CONFIG.dashSpeed;
				this.audio.dash();
				this.burst(p.x, p.y, 8, "#5ce8ff");
			}
		}
		const solo = p.solitude && this.ecos.length === 0;
		let spd = p.speed * (solo ? 1.1 : 1);
		if (this.collapseT > 0) {
			mx += rand(-.45, .45);
			my += rand(-.45, .45);
			const m2 = Math.hypot(mx, my) || 1;
			mx /= m2;
			my /= m2;
		}
		if (p.dashT > 0) {} else {
			p.vx = mx * spd;
			p.vy = my * spd;
		}
		p.x = clamp(p.x + p.vx * dt, 40, WORLD - 40);
		p.y = clamp(p.y + p.vy * dt, 40, WORLD - 40);
		const moving = Math.hypot(p.vx, p.vy) > 12;
		if (moving) {
			p.facing = Math.atan2(-p.vx, -p.vy);
			if (p.vx < -8) p.flip = true;
			if (p.vx > 8) p.flip = false;
		}
		if (p.anim !== "attack" || p.animT > .28) p.anim = moving ? "walk" : "idle";
		const k = 1 - Math.exp(-5.5 * dt);
		const lookX = p.vx * .12;
		const lookY = p.vy * .12;
		this.camX += (p.x - this.w / 2 + lookX - this.camX) * k;
		this.camY += (p.y - this.h / 2 + lookY - this.camY) * k;
		this.camX = clamp(this.camX, 0, WORLD - this.w);
		this.camY = clamp(this.camY, 0, WORLD - this.h);
	}
	autoFire() {
		const p = this.player;
		if (p.fireCd > 0) return;
		const t = this.nearest(p.x, p.y);
		if (!t) return;
		p.fireCd = CONFIG.fireInterval / p.fireRate;
		p.anim = "attack";
		p.animT = 0;
		const base = Math.atan2(t.y - p.y, t.x - p.x);
		const n = p.projectiles;
		const solo = p.solitude && this.ecos.length === 0 ? 1.25 : 1;
		const col = this.collapseT > 0 ? 1.5 : 1;
		for (let i = 0; i < n; i++) {
			const a = base + (i - (n - 1) / 2) * .14;
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
				color: "#5ce8ff"
			});
		}
	}
	critMul() {
		if (Math.random() < this.player.crit) {
			this.audio.crit();
			return 1.8;
		}
		return 1;
	}
	spawnLoop(dt) {
		this.spawnCd -= dt;
		this.eliteCd -= dt;
		const interval = Math.max(CONFIG.spawnIntervalMin, CONFIG.spawnInterval0 - this.time * .0032);
		if (this.spawnCd <= 0 && this.aliveEnemies() < CONFIG.maxEnemies) {
			const n = Math.min(6, 1 + this.time / 40 | 0);
			for (let i = 0; i < n; i++) this.spawnEnemy(this.rollBasic());
			this.spawnCd = interval;
		}
		if (this.eliteCd <= 0) {
			this.spawnEnemy("elite");
			this.eliteCd = 45;
			this.flash("Un Eco mayor ha despertado.");
		}
		if (!this.bossSpawned && this.time >= 480) {
			this.spawnEnemy("boss");
			this.bossSpawned = true;
			this.flash("JEFE — Corrupto del Vacío");
			this.addTrauma(.7);
		}
	}
	rollBasic() {
		const t = this.time;
		const r = Math.random();
		if (t > 240 && r < .12) return "specter";
		if (r < .34) return "slime";
		if (r < .52) return "bat";
		if (r < .68) return "spider";
		if (r < .86) return "skeleton";
		return "specter";
	}
	spawnEnemy(kind, near = false) {
		const def = ENEMIES[kind];
		const ramp = 1 + Math.floor(this.time / CONFIG.rampEvery) * CONFIG.enemyScalePerRamp;
		const reson = this.eventText.startsWith("Resonancia") ? 1.25 : 1;
		let x;
		let y;
		if (near) {
			const a = Math.random() * TAU;
			x = this.player.x + Math.cos(a) * 280;
			y = this.player.y + Math.sin(a) * 280;
		} else {
			const a = Math.random() * TAU;
			const dist = Math.max(this.w, this.h) * .58;
			x = this.player.x + Math.cos(a) * dist;
			y = this.player.y + Math.sin(a) * dist;
		}
		x = clamp(x, 30, WORLD - 30);
		y = clamp(y, 30, WORLD - 30);
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
			shoot: rand(.4, 1.6),
			phase: 0,
			hit: 0,
			animT: rand(0, 2),
			flip: false
		});
	}
	aliveEnemies() {
		let n = 0;
		for (const e of this.enemies) if (e.alive) n++;
		return n;
	}
	nearest(x, y, ignore) {
		let best = null;
		let bd = 0xe8d4a51000;
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
	spawnProj(p) {
		if (this.projs.filter((x) => x.alive).length >= CONFIG.maxProjectiles) {
			const old = this.projs.find((x) => x.alive);
			if (old) old.alive = false;
		}
		this.projs.push({
			...p,
			alive: true,
			age: p.age ?? 0
		});
	}
	updateEnemies(dt) {
		const p = this.player;
		for (const e of this.enemies) {
			if (!e.alive) continue;
			e.animT += dt;
			e.hit = Math.max(0, e.hit - dt);
			const dx = p.x - e.x;
			const dy = p.y - e.y;
			const dist = Math.hypot(dx, dy) || 1;
			if (e.def.ranged && dist < 420) {
				e.shoot -= dt;
				if (e.shoot <= 0 && dist > 90) {
					e.shoot = e.def.boss ? 1.1 : 1.8;
					const a = Math.atan2(dy, dx);
					this.spawnProj({
						x: e.x,
						y: e.y,
						vx: Math.cos(a) * (e.def.boss ? 160 : 170),
						vy: Math.sin(a) * (e.def.boss ? 160 : 170),
						r: e.def.boss ? 7 : 5,
						dmg: e.dmg,
						life: 3.2,
						friendly: false,
						pierce: 0,
						kind: "enemy",
						color: "#ff6b9d"
					});
				}
				if (dist < 160) {
					e.x -= dx / dist * e.speed * .6 * dt;
					e.y -= dy / dist * e.speed * .6 * dt;
				} else if (dist > 240) {
					e.x += dx / dist * e.speed * dt;
					e.y += dy / dist * e.speed * dt;
				}
			} else {
				e.x += dx / dist * e.speed * dt;
				e.y += dy / dist * e.speed * dt;
			}
			if (e.def.boss) {
				e.phase += dt;
				if (e.hp < e.maxHp * .5 && e.phase > 2.4) {
					e.phase = 0;
					for (let i = 0; i < 8; i++) {
						const a = i / 8 * TAU;
						this.spawnProj({
							x: e.x,
							y: e.y,
							vx: Math.cos(a) * 130,
							vy: Math.sin(a) * 130,
							r: 6,
							dmg: e.dmg * .7,
							life: 3.6,
							friendly: false,
							pierce: 0,
							kind: "enemy",
							color: "#e84dff"
						});
					}
				}
			}
			e.flip = dx < 0;
			for (const o of this.enemies) {
				if (!o.alive || o === e) continue;
				const ox = o.x - e.x;
				const oy = o.y - e.y;
				const d2 = ox * ox + oy * oy;
				const min = (e.r + o.r) * .85;
				if (d2 > 0 && d2 < min * min) {
					const d = Math.sqrt(d2);
					e.x -= ox / d * 18 * dt;
					e.y -= oy / d * 18 * dt;
				}
			}
			if (dist < e.r + p.r && p.iframe <= 0) {
				const dmg = e.dmg * dt * 2.4 * (1 - p.armor);
				p.hp -= dmg;
				p.hurtT = .18;
				this.trauma = Math.min(1, this.trauma + dt * 2);
			}
		}
		for (let i = this.enemies.length - 1; i >= 0; i--) if (!this.enemies[i].alive) this.enemies.splice(i, 1);
	}
	updateProjs(dt) {
		const p = this.player;
		for (const pr of this.projs) {
			if (!pr.alive) continue;
			pr.age += dt;
			pr.life -= dt;
			if (pr.kind === "boomerang" && pr.age > .45) {
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
			if (pr.friendly) for (const e of this.enemies) {
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
			else if (p.iframe <= 0 && Math.hypot(p.x - pr.x, p.y - pr.y) < p.r + pr.r + 4) {
				p.hp -= pr.dmg * (1 - p.armor);
				p.hurtT = .2;
				p.iframe = .15;
				pr.alive = false;
				this.addTrauma(.25);
			}
		}
		this.projs = this.projs.filter((x) => x.alive);
	}
	hurtEnemy(e, dmg, x, y) {
		e.hp -= dmg;
		e.hit = .1;
		this.damageDealt += dmg;
		this.audio.hit();
		this.burst(x, y, 3, "#9ff6ff");
		this.float(e.x, e.y - 18, `${Math.round(dmg)}`, dmg > this.player.dmg * 1.5 ? "#ffd36a" : "#e8f4ff");
		if (e.hp <= 0) this.killEnemy(e);
	}
	killEnemy(e) {
		e.alive = false;
		this.kills += 1;
		this.spawnGem(e.x, e.y, e.xp);
		this.burst(e.x, e.y, e.def.boss ? 22 : e.def.elite ? 12 : 6, e.def.elite ? "#e84dff" : "#7dffb0");
		this.addTrauma(e.def.boss ? .8 : e.def.elite ? .35 : .12);
		this.hitstop = e.def.boss ? .08 : .03;
		if (e.def.elite || e.def.boss) {
			this.coins += e.def.boss ? 120 : 35;
			const id = pick(ECO_POOL);
			this.pickups.push({
				kind: "echoOrb",
				x: e.x,
				y: e.y,
				used: false,
				ecoId: id
			});
			if (e.def.boss) this.pickups.push({
				kind: "altar",
				x: e.x + 40,
				y: e.y,
				used: false
			});
			this.flash(e.def.boss ? "El Corrupto cae. Un altar despierta." : "Un Eco yace en el suelo.");
		} else if (Math.random() < .035) this.pickups.push({
			kind: "chest",
			x: e.x,
			y: e.y,
			used: false
		});
	}
	spawnGem(x, y, v) {
		if (this.gems.filter((g) => g.alive).length >= CONFIG.maxGems) {
			const g = this.gems.find((x) => x.alive);
			if (g) g.alive = false;
		}
		this.gems.push({
			alive: true,
			x,
			y,
			v,
			t: Math.random() * TAU
		});
	}
	updateGems(dt) {
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
	addXp(v) {
		const p = this.player;
		p.xp += v;
		while (p.xp >= p.nextXp) {
			p.xp -= p.nextXp;
			p.level += 1;
			p.nextXp = Math.floor(p.nextXp * 1.22 + 8);
			this.openLevelUp();
		}
	}
	openLevelUp() {
		const pool = [...UPGRADES].sort(() => Math.random() - .5).slice(0, 3);
		this.choices = pool.map((u) => ({
			id: u.id,
			name: u.name,
			desc: u.desc,
			icon: u.icon
		}));
		this.screen = "levelup";
		this.audio.level();
		this.burst(this.player.x, this.player.y, 16, "#5ce8ff");
		this.emit();
	}
	updatePickups() {
		const p = this.player;
		if (this.input.ecoQueued) {
			this.input.ecoQueued = false;
			const orb = this.pickups.find((k) => k.kind === "echoOrb" && !k.used && Math.hypot(k.x - p.x, k.y - p.y) < 90);
			if (orb && orb.ecoId) {
				orb.used = true;
				this.offerEco(orb.ecoId);
			} else if (this.pendingEco) this.invokePending();
			else if (this.ecos.length) this.dismissEco();
		}
		for (const k of this.pickups) {
			if (k.used) continue;
			if (Math.hypot(k.x - p.x, k.y - p.y) > 28) continue;
			if (k.kind === "echoOrb" && k.ecoId) {
				k.used = true;
				this.offerEco(k.ecoId);
			} else if (k.kind === "chest") {
				k.used = true;
				this.coins += 18;
				p.hp = Math.min(p.maxHp, p.hp + 12);
				this.flash("Cofre — fragmentos y un respiro.");
				this.audio.pickup();
			} else if (k.kind === "altar") {
				k.used = true;
				p.maxHp += 18;
				p.hp = p.maxHp;
				p.dmg *= 1.1;
				p.cordura = Math.max(0, p.cordura - 28);
				this.flash("Altar — el recuerdo se vuelve poder.");
				this.audio.level();
			}
		}
	}
	offerEco(id) {
		this.pendingEco = ECOS[id];
		this.screen = "echo";
		this.emit();
	}
	updateEcos(dt) {
		const p = this.player;
		const n = this.ecos.length;
		for (let i = 0; i < this.ecos.length; i++) {
			const ec = this.ecos[i];
			ec.t += dt;
			const a = this.time * .9 + i * TAU / Math.max(1, n);
			const rad = 42 + 12 * i;
			const tx = p.x + Math.cos(a) * rad;
			const ty = p.y + Math.sin(a) * rad;
			ec.x += (tx - ec.x) * Math.min(1, dt * 6);
			ec.y += (ty - ec.y) * Math.min(1, dt * 6);
			const cost = ec.def.cordura * (1 - p.bond * .4) * (dt / 6.5);
			p.cordura = clamp(p.cordura + cost, 0, 100);
			ec.cd -= dt;
			if (ec.hostile) {
				const ang = Math.atan2(p.y - ec.y, p.x - ec.x);
				ec.x += Math.cos(ang) * 70 * dt;
				ec.y += Math.sin(ang) * 70 * dt;
				if (Math.hypot(ec.x - p.x, ec.y - p.y) < 22 && p.iframe <= 0) p.hp -= 8 * dt;
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
						color: d.color
					});
					ec.cd = d.cooldown;
				}
			}
			if (d.style === "heal") {
				p.hp = Math.min(p.maxHp, p.hp + p.maxHp * .04);
				this.burst(ec.x, ec.y, 6, "#7dffb0");
				ec.cd = d.cooldown;
			}
		}
		if (n === 0) p.cordura = Math.max(0, p.cordura - CONFIG.corduraDecay * dt);
		if (p.cordura >= 100 && this.collapseT <= 0) this.triggerCollapse();
		if (this.collapseT > 0) {
			this.collapseT -= dt;
			p.hp -= .55 * dt;
			if (this.collapseT <= 0) {
				this.ecos = [];
				p.cordura = 32;
				this.flash("La realidad vuelve a encajar. Los Ecos se han ido.");
			}
		}
	}
	triggerCollapse() {
		this.collapseT = CONFIG.collapseDuration;
		for (const e of this.ecos) e.hostile = true;
		this.audio.collapse();
		this.addTrauma(.9);
		this.flash("COLAPSO — tus Ecos ya no te obedecen.");
	}
	updateFx(dt) {
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
	}
	burst(x, y, n, color) {
		const cap = CONFIG.maxParticles - this.parts.length;
		const c = Math.min(n, Math.max(0, cap));
		for (let i = 0; i < c; i++) this.parts.push({
			alive: true,
			x,
			y,
			vx: rand(-90, 90),
			vy: rand(-90, 90),
			life: rand(.2, .55),
			max: .55,
			s: rand(1.5, 3.4),
			color
		});
	}
	float(x, y, text, color) {
		if (this.floats.length > 24) this.floats.shift();
		this.floats.push({
			alive: true,
			x,
			y,
			text,
			life: .7,
			color
		});
	}
	addTrauma(v) {
		if (!this.meta.shake || this.reducedMotion) return;
		this.trauma = Math.min(1, this.trauma + v);
	}
	endRun(win) {
		const gained = Math.floor(this.time / 8) + this.coins;
		this.meta.coins += gained;
		this.meta.best = Math.max(this.meta.best, this.time);
		writeMeta(this.meta);
		this.coins = gained;
		this.screen = win ? "win" : "dead";
		if (!win) this.audio.death();
		this.emit();
	}
	draw() {
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
		this.drawProps(camX, camY);
		const sprites = [];
		for (const pr of this.props);
		for (const k of this.pickups) {
			if (k.used) continue;
			sprites.push({
				y: k.y,
				draw: () => this.drawPickup(k, camX, camY)
			});
		}
		for (const g of this.gems) {
			if (!g.alive) continue;
			sprites.push({
				y: g.y,
				draw: () => this.drawGem(g, camX, camY)
			});
		}
		for (const e of this.enemies) {
			if (!e.alive) continue;
			if (this.fogT > 0 && Math.hypot(e.x - this.player.x, e.y - this.player.y) > 190) continue;
			sprites.push({
				y: e.y,
				draw: () => this.drawEnemy(e, camX, camY)
			});
		}
		for (const ec of this.ecos) sprites.push({
			y: ec.y,
			draw: () => this.drawEco(ec, camX, camY)
		});
		sprites.push({
			y: this.player.y,
			draw: () => this.drawPlayer(camX, camY)
		});
		sprites.sort((a, b) => a.y - b.y);
		for (const s of sprites) s.draw();
		for (const pr of this.projs) this.drawBolt(pr, camX, camY);
		for (const pt of this.parts) this.drawPart(pt, camX, camY);
		for (const f of this.floats) this.drawFloat(f, camX, camY);
		this.drawVignette();
		if (this.screen === "menu" || this.screen === "boot") this.drawMenuBackdrop();
	}
	drawGround(camX, camY) {
		const ctx = this.ctx;
		const g = this.sprites.ground;
		const { w, h } = this;
		if (g) {
			const x0 = Math.floor(camX / 256) * 256;
			const y0 = Math.floor(camY / 256) * 256;
			for (let y = y0; y < camY + h + 256; y += 256) for (let x = x0; x < camX + w + 256; x += 256) ctx.drawImage(g, x - camX, y - camY, 256, 256);
		} else {
			ctx.fillStyle = "#0c1220";
			ctx.fillRect(0, 0, w, h);
		}
	}
	drawProps(camX, camY) {
		const ctx = this.ctx;
		for (const pr of this.props) {
			const x = pr.x - camX;
			const y = pr.y - camY;
			if (x < -80 || y < -80 || x > this.w + 80 || y > this.h + 80) continue;
			const key = `prop_${pr.kind}`;
			const im = this.sprites[key];
			if (im) {
				const dw = im.width * pr.s;
				const dh = im.height * pr.s;
				ctx.drawImage(im, x - dw / 2, y - dh, dw, dh);
			}
		}
	}
	drawSheet(img, frame, x, y, size, flip, flash = false, cols = 2, rows = 2) {
		const ctx = this.ctx;
		if (!img || !img.width) {
			ctx.fillStyle = flash ? "#fff" : "#5ce8ff";
			ctx.beginPath();
			ctx.arc(x, y, size * .35, 0, TAU);
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
			ctx.globalAlpha = .55;
			ctx.fillStyle = "#ffffff";
			ctx.beginPath();
			ctx.arc(0, 0, size * .28, 0, Math.PI * 2);
			ctx.fill();
			ctx.globalAlpha = 1;
		}
		ctx.restore();
	}
	drawPlayer(camX, camY) {
		const p = this.player;
		const x = p.x - camX;
		const y = p.y - camY;
		const sheet = p.anim === "attack" ? this.sprites.player_attack : p.anim === "walk" ? this.sprites.player_walk : this.sprites.player_idle;
		const fps = p.anim === "walk" ? 10 : p.anim === "attack" ? 12 : 4;
		const frame = Math.floor(p.animT * fps) % 4;
		if (this.collapseT > 0) {
			this.ctx.save();
			this.ctx.globalAlpha = .35;
			this.ctx.fillStyle = "#e84dff";
			this.ctx.beginPath();
			this.ctx.arc(x, y, 28 + Math.sin(this.time * 8) * 4, 0, TAU);
			this.ctx.fill();
			this.ctx.restore();
		}
		this.drawSheet(sheet, frame, x, y, 56, p.flip, p.hurtT > 0);
	}
	drawEnemy(e, camX, camY) {
		const x = e.x - camX;
		const y = e.y - camY;
		const frame = Math.floor(e.animT * (e.def.kind === "bat" ? 10 : 6)) % 4;
		this.drawSheet(this.sprites[e.def.sheet], frame, x, y, e.def.draw, e.flip, e.hit > 0);
		if (e.def.elite || e.def.boss) {
			const ctx = this.ctx;
			const w = e.def.draw * .7;
			ctx.fillStyle = "#1a1a28";
			ctx.fillRect(x - w / 2, y - e.def.draw * .55, w, 4);
			ctx.fillStyle = "#ff4d6a";
			ctx.fillRect(x - w / 2, y - e.def.draw * .55, w * clamp(e.hp / e.maxHp, 0, 1), 4);
		}
	}
	drawEco(ec, camX, camY) {
		const x = ec.x - camX;
		const y = ec.y - camY + Math.sin(ec.t * 3) * 3;
		const frame = Math.floor(ec.t * 4) % 4;
		this.ctx.save();
		this.ctx.globalAlpha = ec.hostile ? .95 : .85;
		this.drawSheet(this.sprites[ec.def.sheet], frame, x, y, 44, false, ec.hostile);
		this.ctx.restore();
		this.ctx.strokeStyle = ec.hostile ? "#ff4d6a" : ec.def.color;
		this.ctx.globalAlpha = .4;
		this.ctx.beginPath();
		this.ctx.arc(x, y, 16 + Math.sin(ec.t * 5) * 2, 0, TAU);
		this.ctx.stroke();
		this.ctx.globalAlpha = 1;
	}
	drawBolt(pr, camX, camY) {
		const ctx = this.ctx;
		const x = pr.x - camX;
		const y = pr.y - camY;
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(Math.atan2(pr.vy, pr.vx));
		ctx.fillStyle = pr.color;
		ctx.shadowColor = pr.color;
		ctx.shadowBlur = 8;
		ctx.fillRect(-10, -pr.r, 16, pr.r * 2);
		ctx.restore();
	}
	drawGem(g, camX, camY) {
		const x = g.x - camX;
		const y = g.y - camY + Math.sin(g.t * 5) * 2;
		const im = this.sprites.xp_gem;
		const frame = Math.floor(g.t * 6) % 4;
		this.drawSheet(im, frame, x, y, 18, false, false, 2, 2);
	}
	drawPickup(k, camX, camY) {
		const x = k.x - camX;
		const y = k.y - camY;
		const key = k.kind === "chest" ? "prop_chest" : k.kind === "altar" ? "prop_altar" : "eco_guerrero";
		const im = this.sprites[key];
		if (k.kind === "echoOrb") {
			this.ctx.save();
			this.ctx.globalAlpha = .5 + Math.sin(this.time * 4) * .2;
			this.drawSheet(im, 0, x, y, 36, false);
			this.ctx.restore();
			return;
		}
		if (im) this.ctx.drawImage(im, x - im.width / 2, y - im.height, im.width, im.height);
	}
	drawPart(pt, camX, camY) {
		const ctx = this.ctx;
		ctx.globalAlpha = clamp(pt.life / pt.max, 0, 1);
		ctx.fillStyle = pt.color;
		ctx.fillRect(pt.x - camX, pt.y - camY, pt.s, pt.s);
		ctx.globalAlpha = 1;
	}
	drawFloat(f, camX, camY) {
		const ctx = this.ctx;
		ctx.globalAlpha = clamp(f.life / .7, 0, 1);
		ctx.fillStyle = f.color;
		ctx.font = "700 12px Nunito, sans-serif";
		ctx.textAlign = "center";
		ctx.fillText(f.text, f.x - camX, f.y - camY);
		ctx.globalAlpha = 1;
		ctx.textAlign = "start";
	}
	drawVignette() {
		const ctx = this.ctx;
		const { w, h } = this;
		const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .35, w / 2, h / 2, Math.max(w, h) * .72);
		g.addColorStop(0, "rgba(0,0,0,0)");
		g.addColorStop(1, this.collapseT > 0 ? "rgba(80,0,40,0.55)" : "rgba(0,0,0,0.45)");
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, w, h);
		if (this.player.hp / this.player.maxHp < .25 && this.screen === "playing") {
			ctx.fillStyle = `rgba(255,50,80,${.06 + .05 * Math.sin(this.time * 7)})`;
			ctx.fillRect(0, 0, w, h);
		}
	}
	drawMenuBackdrop() {
		const bg = this.sprites.menuBg;
		if (!bg) return;
		const ctx = this.ctx;
		ctx.globalAlpha = .55;
		ctx.drawImage(bg, 0, 0, this.w, this.h);
		ctx.globalAlpha = 1;
		const p = this.sprites.player_idle;
		if (p) {
			const s = Math.min(220, this.h * .38);
			ctx.drawImage(p, 0, 0, 128, 128, this.w * .08, this.h * .42, s, s);
		}
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
			ecos: this.ecos.map((e) => ({
				id: e.def.id,
				name: e.def.name,
				color: e.def.color
			})),
			choices: this.choices,
			pendingEco: this.pendingEco,
			message: this.msgT > 0 ? this.message : "",
			meta: this.meta,
			dashCd: p?.dashCd ?? 0,
			dashMax: CONFIG.dashCooldown,
			damageDealt: Math.floor(this.damageDealt),
			eventText: this.eventText,
			ready: this.ready
		});
	}
};
function formatTime(t) {
	const m = Math.floor(t / 60);
	const s = Math.floor(t % 60);
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
var ICONS = {
	sword: Sword,
	wind: Wind,
	layers: Layers,
	maximize: Maximize2,
	heart: Heart,
	zap: Zap,
	target: Target,
	magnet: Magnet,
	sparkles: Sparkles,
	user: User
};
var emptyHud = () => ({
	screen: "boot",
	hp: 100,
	maxHp: 100,
	xp: 0,
	nextXp: 18,
	level: 1,
	time: 0,
	kills: 0,
	coins: 0,
	cordura: 0,
	wave: 1,
	collapse: false,
	ecos: [],
	choices: [],
	pendingEco: null,
	message: "",
	meta: {
		coins: 0,
		damage: 0,
		hp: 0,
		speed: 0,
		magnet: 0,
		best: 0,
		runs: 0,
		shake: true,
		music: true,
		sfx: true
	},
	dashCd: 0,
	dashMax: 1.35,
	damageDealt: 0,
	eventText: "",
	ready: false
});
function EchoApp() {
	const canvasRef = (0, import_react.useRef)(null);
	const wrapRef = (0, import_react.useRef)(null);
	const gameRef = (0, import_react.useRef)(null);
	const stickId = (0, import_react.useRef)(null);
	const [hud, setHud] = (0, import_react.useState)(emptyHud);
	const [stick, setStick] = (0, import_react.useState)({
		x: 0,
		y: 0,
		on: false
	});
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const game = new EchoGame(canvas, (next) => setHud(next));
		gameRef.current = game;
		const onResize = () => game.resize();
		window.addEventListener("resize", onResize);
		return () => {
			window.removeEventListener("resize", onResize);
			game.destroy();
			gameRef.current = null;
		};
	}, []);
	const g = () => gameRef.current;
	const playing = hud.screen === "playing";
	const onStick = (0, import_react.useCallback)((clientX, clientY, origin) => {
		const cx = origin.left + origin.width / 2;
		const cy = origin.top + origin.height / 2;
		let dx = (clientX - cx) / (origin.width / 2);
		let dy = (clientY - cy) / (origin.height / 2);
		const m = Math.hypot(dx, dy);
		if (m > 1) {
			dx /= m;
			dy /= m;
		}
		if (m < .18) {
			dx = 0;
			dy = 0;
		}
		setStick({
			x: dx,
			y: dy,
			on: true
		});
		g()?.setStick(dx, dy);
	}, []);
	const endStick = (0, import_react.useCallback)(() => {
		stickId.current = null;
		setStick({
			x: 0,
			y: 0,
			on: false
		});
		g()?.setStick(0, 0);
	}, []);
	const overlay = hud.screen !== "playing" && hud.screen !== "boot";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: "relative h-dvh w-full overflow-hidden bg-void text-ice select-none",
		style: { touchAction: "none" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "absolute inset-0 h-full w-full"
			}),
			playing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {
				hud,
				onPause: () => g()?.togglePause()
			}),
			playing && hud.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute top-[18%] left-1/2 z-20 w-[min(90%,36rem)] -translate-x-1/2 text-center text-sm font-semibold tracking-wide text-cyan drop-shadow-[0_2px_8px_#070b16]",
				children: hud.message
			}) : null,
			playing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileControls, {
				stick,
				dashCd: hud.dashCd,
				dashMax: hud.dashMax,
				onStickDown: (e, el) => {
					stickId.current = e.pointerId;
					el.setPointerCapture(e.pointerId);
					onStick(e.clientX, e.clientY, el.getBoundingClientRect());
				},
				onStickMove: (e, el) => {
					if (stickId.current !== e.pointerId) return;
					onStick(e.clientX, e.clientY, el.getBoundingClientRect());
				},
				onStickUp: endStick,
				onDash: () => g()?.queueDash(),
				onEco: () => g()?.queueEco(),
				onPause: () => g()?.togglePause()
			}),
			hud.screen === "boot" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-sm tracking-[0.4em] text-muted",
				children: "CARGANDO EL CICLO…"
			}) }),
			hud.screen === "menu" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
				hud,
				go: (s) => g()?.open(s),
				start: () => g()?.startRun()
			}),
			hud.screen === "paused" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PauseMenu, {
				resume: () => g()?.resume(),
				menu: () => g()?.toMenu(),
				settings: () => g()?.open("settings")
			}),
			hud.screen === "levelup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelUp, {
				choices: hud.choices,
				onPick: (id) => g()?.chooseUpgrade(id)
			}),
			hud.screen === "echo" && hud.pendingEco && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EchoChoice, {
				eco: hud.pendingEco,
				ecos: hud.ecos.length,
				onInvoke: () => g()?.invokePending(),
				onDiscard: () => g()?.discardPending(),
				onFuse: () => g()?.fusePending()
			}),
			hud.screen === "dead" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Death, {
				hud,
				retry: () => g()?.startRun(),
				menu: () => g()?.toMenu()
			}),
			hud.screen === "win" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Victory, {
				hud,
				next: () => g()?.toMenu()
			}),
			hud.screen === "meta" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaShop, {
				hud,
				buy: (id) => g()?.buyMeta(id),
				back: () => g()?.open("menu")
			}),
			hud.screen === "codex" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Codex, { back: () => g()?.open("menu") }),
			hud.screen === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsScreen, {
				hud,
				set: (k, v) => g()?.setSetting(k, v),
				back: () => g()?.open(overlay && hud.time > 0 ? "paused" : "menu")
			})
		]
	});
}
function Hud({ hud, onPause }) {
	const hp = hud.hp / Math.max(1, hud.maxHp);
	const xp = hud.xp / Math.max(1, hud.nextXp);
	const hearts = 3;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-10 p-3 sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-start gap-2 rounded-[20px] border border-line bg-panel/80 p-2 pr-3 backdrop-blur-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/sprites/player_idle.png",
						alt: "",
						className: "size-12 rounded-[14px] border border-line bg-abyss object-cover object-top",
						style: { imageRendering: "pixelated" }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 pt-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-1 flex gap-0.5",
								children: Array.from({ length: hearts }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `size-3.5 ${hp > (i + .15) / hearts ? "fill-danger text-danger" : "text-line"}` }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								value: hp,
								color: "bg-hp"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								value: xp,
								color: "bg-cyan",
								className: "mt-1"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[10px] font-bold tracking-wide text-muted",
								children: ["Nv. ", hud.level]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-bold tabular-nums tracking-widest text-ice sm:text-xl",
						children: formatTime(hud.time)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[10px] font-semibold uppercase tracking-[0.25em] text-muted",
						children: ["Oleada ", hud.wave]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skull, { className: "size-3.5 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: hud.kills
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "size-3.5 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: hud.meta.coins
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "pointer-events-auto flex size-11 items-center justify-center rounded-full border border-line bg-panel/90 text-ice",
							onClick: onPause,
							"aria-label": "Pausa",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" })
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute top-24 right-3 hidden w-36 sm:block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 text-[10px] font-bold uppercase tracking-widest text-muted",
					children: "Cordura"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2 overflow-hidden rounded-full bg-abyss",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `h-full ${hud.collapse ? "bg-danger" : "bg-magenta"}`,
						style: { width: `${Math.min(100, hud.cordura)}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[10px] text-muted",
					children: hud.collapse ? "COLAPSO" : hud.cordura > 70 ? "Frágil" : "Estable"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-col gap-1",
					children: hud.ecos.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg border border-line bg-panel-2 px-2 py-1 text-[11px] font-semibold",
						style: { color: e.color },
						children: e.name.replace("Eco del ", "")
					}, e.id + e.name))
				})
			]
		})]
	});
}
function Bar({ value, color, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `h-1.5 w-28 overflow-hidden rounded-full bg-abyss sm:w-36 ${className}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `h-full ${color}`,
			style: { width: `${clamp01(value) * 100}%` }
		})
	});
}
function Chip({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center gap-1.5 rounded-full border border-line bg-panel/80 px-2.5 py-1.5 text-xs font-bold tabular-nums backdrop-blur-sm",
		children
	});
}
function MobileControls({ stick, dashCd, dashMax, onStickDown, onStickMove, onStickUp, onDash, onEco, onPause }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-20 sm:pointer-events-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-auto absolute bottom-6 left-5 size-[132px] rounded-full border border-line bg-panel/40 backdrop-blur-sm md:bottom-8 md:left-8",
			onPointerDown: (e) => onStickDown(e, e.currentTarget),
			onPointerMove: (e) => onStickMove(e, e.currentTarget),
			onPointerUp: onStickUp,
			onPointerCancel: onStickUp,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute size-12 rounded-full border border-cyan bg-cyan/30",
				style: {
					left: `calc(50% + ${stick.x * 36}px - 24px)`,
					top: `calc(50% + ${stick.y * 36}px - 24px)`
				}
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto absolute right-5 bottom-6 flex flex-col items-end gap-3 md:right-8 md:bottom-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundBtn, {
						label: "Eco",
						onClick: onEco,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ghost, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundBtn, {
						label: "Dash",
						onClick: onDash,
						dim: dashCd > 0,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundBtn, {
						label: "Pausa",
						onClick: onPause,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-5" })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "hidden text-[10px] text-muted sm:block",
				children: "WASD mover · autoataque · E eco · Espacio dash"
			})]
		})]
	});
}
function RoundBtn({ children, label, onClick, dim }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		"aria-label": label,
		className: `flex size-[58px] flex-col items-center justify-center rounded-full border border-line bg-panel/80 text-ice ${dim ? "opacity-40" : ""}`,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[9px] font-bold uppercase tracking-wider text-muted",
			children: label
		})]
	});
}
function FullCard({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 flex flex-col items-center justify-center bg-void/80 px-4 backdrop-blur-[2px]",
		children
	});
}
function Menu({ hud, go, start }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-30 flex flex-col justify-end bg-gradient-to-t from-void via-void/80 to-transparent px-6 pb-10 pt-16 sm:justify-center sm:px-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-bold uppercase tracking-[0.35em] text-cyan",
				children: "Sobrevive · Mejora · Rompe el ciclo"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display text-5xl font-bold leading-[0.9] sm:text-7xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-ice",
					children: "ECHO"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-magenta",
					children: "SURVIVOR"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-md text-sm leading-relaxed text-muted",
				children: GDD_TEXT.pitch
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primary, {
						onClick: start,
						children: "Start — Jugar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
						onClick: () => go("meta"),
						children: "Fragmentos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
						onClick: () => go("codex"),
						children: "Códice"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
						onClick: () => go("settings"),
						children: "Ajustes"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-xs text-muted",
				children: [
					"Mejor run ",
					formatTime(hud.meta.best),
					" · ",
					hud.meta.coins,
					" fragmentos · ",
					hud.meta.runs,
					" ciclos"
				]
			})
		]
	});
}
function PauseMenu({ resume, menu, settings }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl",
			children: "Pausa"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "El ciclo espera."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-col gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primary, {
					onClick: resume,
					children: "Reanudar"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
					onClick: settings,
					children: "Ajustes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
					onClick: menu,
					children: "Menú principal"
				})
			]
		})
	] }) });
}
function LevelUp({ choices, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FullCard, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-center text-2xl text-gold sm:text-3xl",
			children: "¡Subiste de nivel!"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 mb-6 text-sm text-muted",
			children: "Elige una mejora"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3",
			children: choices.map((c) => {
				const Icon = ICONS[c.icon] ?? Sparkles;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onPick(c.id),
					className: "rounded-[22px] border border-line bg-panel p-5 text-left transition hover:border-cyan",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mb-3 size-6 text-cyan" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg",
							children: c.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: c.desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-4 inline-flex rounded-full bg-cyan px-3 py-1 text-xs font-bold text-void",
							children: "Elegir"
						})
					]
				}, c.id);
			})
		})
	] });
}
function EchoChoice({ eco, ecos, onInvoke, onDiscard, onFuse }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] font-bold uppercase tracking-[0.3em] text-cyan",
			children: "Un Eco te observa"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-2 font-display text-2xl",
			style: { color: eco.color },
			children: eco.name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-sm italic text-muted",
			children: [
				"“",
				eco.phrase,
				"”"
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-xs text-muted",
			children: [
				"Cordura +",
				eco.cordura,
				" mientras esté activo. Máximo 3 Ecos."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-col gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primary, {
					onClick: onInvoke,
					disabled: ecos >= 3,
					children: "Invocar"
				}),
				ecos >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
					onClick: onFuse,
					children: "Fusionar (borra dos ecos para siempre)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
					onClick: onDiscard,
					children: "Dejarlo ir"
				})
			]
		})
	] }) });
}
function Death({ hud, retry, menu }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-center text-3xl text-magenta",
			children: "Has caído"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-center text-sm text-muted",
			children: "El ciclo continúa…"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stats, { hud }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primary, {
				onClick: retry,
				children: "Reintentar"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
				onClick: menu,
				children: "Menú principal"
			})]
		})
	] }) });
}
function Victory({ hud, next }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-center text-3xl text-cyan",
			children: "¡Run completada!"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stats, { hud }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primary, {
			onClick: next,
			className: "mt-6",
			children: "Siguiente"
		})
	] }) });
}
function Stats({ hud }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
		className: "mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-muted",
				children: "Tiempo"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "text-right tabular-nums",
				children: formatTime(hud.time)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-muted",
				children: "Oleadas"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "text-right tabular-nums",
				children: hud.wave
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-muted",
				children: "Bajas"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "text-right tabular-nums",
				children: hud.kills
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-muted",
				children: "Daño total"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "text-right tabular-nums",
				children: hud.damageDealt
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-muted",
				children: "Nivel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "text-right tabular-nums",
				children: hud.level
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-muted",
				children: "Fragmentos"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
				className: "text-right tabular-nums text-gold",
				children: ["+", hud.coins]
			})
		]
	});
}
function MetaShop({ hud, buy, back }) {
	const ranks = {
		damage: hud.meta.damage,
		hp: hud.meta.hp,
		speed: hud.meta.speed,
		magnet: hud.meta.magnet
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Fragmentos"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [hud.meta.coins, " fragmentos · las mejoras sobreviven a la muerte"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-3 sm:grid-cols-2",
				children: META_SHOP.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => buy(it.id),
					className: "rounded-2xl border border-line bg-panel-2 p-4 text-left hover:border-gold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: it.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: it.desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-gold",
							children: [
								"Rango ",
								ranks[it.id] ?? 0,
								" · ",
								it.cost,
								" fragmentos"
							]
						})
					]
				}, it.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
				onClick: back,
				className: "mt-5",
				children: "Volver"
			})
		]
	}) });
}
function Codex({ back }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Códice"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-muted",
				children: GDD_TEXT.pitch
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-4 list-decimal space-y-1 pl-5 text-sm text-ice",
				children: GDD_TEXT.loop.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: l }, l))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-6 font-display text-lg",
				children: "Mejoras"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-1 text-sm text-muted",
				children: UPGRADES.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-ice",
						children: [u.name, "."]
					}),
					" ",
					u.desc
				] }, u.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-xs text-muted",
				children: "PC: WASD o flechas, autoataque, E ecos, Espacio dash, Esc pausa. Móvil: joystick y botones."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
				onClick: back,
				className: "mt-5",
				children: "Volver"
			})
		]
	}) });
}
function SettingsScreen({ hud, set, back }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl",
			children: "Ajustes"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
			label: "Música",
			on: hud.meta.music,
			toggle: () => set("music", !hud.meta.music),
			icon: hud.meta.music ? Volume2 : VolumeX
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
			label: "Efectos",
			on: hud.meta.sfx,
			toggle: () => set("sfx", !hud.meta.sfx),
			icon: hud.meta.sfx ? Zap : VolumeX
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
			label: "Temblor de cámara",
			on: hud.meta.shake,
			toggle: () => set("shake", !hud.meta.shake),
			icon: Shield
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostBtn, {
			onClick: back,
			className: "mt-5",
			children: "Volver"
		})
	] }) });
}
function Toggle({ label, on, toggle, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: toggle,
		className: "mt-3 flex w-full items-center justify-between rounded-2xl border border-line bg-panel-2 px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center gap-2 text-sm font-semibold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-cyan" }), label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `text-xs font-bold ${on ? "text-hp" : "text-muted"}`,
			children: on ? "ON" : "OFF"
		})]
	});
}
function Panel({ children, wide }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `w-full rounded-[28px] border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] ${wide ? "max-w-2xl" : "max-w-md"}`,
		children
	});
}
function Primary({ children, onClick, disabled, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		disabled,
		onClick,
		className: `rounded-full bg-ice px-6 py-3 text-sm font-bold text-void disabled:opacity-40 ${className}`,
		children
	});
}
function GhostBtn({ children, onClick, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: `rounded-full border border-line bg-transparent px-6 py-3 text-sm font-semibold text-ice ${className}`,
		children
	});
}
function clamp01(v) {
	return v < 0 ? 0 : v > 1 ? 1 : v;
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EchoApp, {});
}
//#endregion
export { Home as component };

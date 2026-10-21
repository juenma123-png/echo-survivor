"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import {
  Coins,
  Ghost,
  Heart,
  Layers,
  Magnet,
  Maximize2,
  Pause,
  RotateCw,
  Shield,
  Skull,
  Sparkles,
  Sword,
  Target,
  User,
  Volume2,
  VolumeX,
  Wind,
  Zap,
} from "lucide-react";
import { EchoGame, formatTime, type HudState, type Screen } from "@/game/engine";
import { GDD_TEXT, META_SHOP, UPGRADES } from "@/game/config";

const ICONS: Record<string, typeof Sword> = {
  sword: Sword,
  wind: Wind,
  layers: Layers,
  maximize: Maximize2,
  heart: Heart,
  zap: Zap,
  target: Target,
  magnet: Magnet,
  sparkles: Sparkles,
  user: User,
  ghost: Ghost,
};

const emptyHud = (): HudState => ({
  screen: "menu",
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
    sfx: true,
  },
  dashCd: 0,
  dashMax: 1.35,
  damageDealt: 0,
  eventText: "",
  interact: "",
  ready: false,
});

export function EchoApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<EchoGame | null>(null);
  const stickId = useRef<number | null>(null);
  const [hud, setHud] = useState<HudState>(emptyHud);
  const [stick, setStick] = useState({ x: 0, y: 0, on: false });
  /** true en móvil/tablet con la pantalla en vertical: pedimos girar el dispositivo. */
  const [needsRotate, setNeedsRotate] = useState(false);

  /* Detecta orientación vertical en dispositivos táctiles (en PC solo se ponen barras laterales). */
  useEffect(() => {
    const portrait = window.matchMedia("(orientation: portrait)");
    const touch = window.matchMedia("(pointer: coarse)");
    const update = () => setNeedsRotate(portrait.matches && touch.matches);
    update();
    portrait.addEventListener("change", update);
    return () => portrait.removeEventListener("change", update);
  }, []);

  /* Si giran el móvil a vertical en plena partida, se pausa para no perder la run. */
  useEffect(() => {
    if (needsRotate && hud.screen === "playing") gameRef.current?.togglePause();
  }, [needsRotate, hud.screen]);

  /** Intenta pantalla completa + bloqueo horizontal (solo funciona en algunos móviles, tras un toque). */
  const enterLandscape = useCallback(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    try {
      void document.documentElement.requestFullscreen?.()?.catch(() => undefined);
      const so = screen.orientation as unknown as { lock?: (o: string) => Promise<void> };
      void so.lock?.("landscape")?.catch(() => undefined);
    } catch {
      /* el navegador no lo permite: queda el aviso de girar */
    }
  }, []);

  useEffect(() => {
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

  const onStick = useCallback((clientX: number, clientY: number, origin: DOMRect) => {
    const cx = origin.left + origin.width / 2;
    const cy = origin.top + origin.height / 2;
    let dx = (clientX - cx) / (origin.width / 2);
    let dy = (clientY - cy) / (origin.height / 2);
    const m = Math.hypot(dx, dy);
    if (m > 1) {
      dx /= m;
      dy /= m;
    }
    if (m < 0.18) {
      dx = 0;
      dy = 0;
    }
    setStick({ x: dx, y: dy, on: true });
    g()?.setStick(dx, dy);
  }, []);

  const endStick = useCallback(() => {
    stickId.current = null;
    setStick({ x: 0, y: 0, on: false });
    g()?.setStick(0, 0);
  }, []);

  const overlay = hud.screen !== "playing" && hud.screen !== "boot";

  return (
    <div
      className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-void text-ice select-none"
      style={{ touchAction: "none" }}
    >
      {/* Escenario horizontal 16:9: lienzo, HUD y menús viven dentro y se escalan juntos. */}
      <div
        ref={wrapRef}
        className="relative overflow-hidden bg-void"
        style={{ width: "min(100vw, calc(100dvh * 16 / 9))", aspectRatio: "16 / 9", touchAction: "none" }}
      >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {playing && <Hud hud={hud} onPause={() => g()?.togglePause()} onDismiss={(i) => g()?.dismissEco(i)} />}

      {playing && hud.interact ? (
        <p className="pointer-events-none absolute bottom-28 left-1/2 z-20 -translate-x-1/2 rounded-full border border-cyan/40 bg-void/80 px-3 py-1 text-xs font-bold tracking-wide text-cyan">
          {hud.interact}
        </p>
      ) : null}

      {playing && hud.message ? (
        <p className="pointer-events-none absolute top-[18%] left-1/2 z-20 w-[min(90%,36rem)] -translate-x-1/2 text-center text-sm font-semibold tracking-wide text-cyan drop-shadow-[0_2px_8px_#070b16]">
          {hud.message}
        </p>
      ) : null}

      {playing && (
        <MobileControls
          stick={stick}
          dashCd={hud.dashCd}
          dashMax={hud.dashMax}
          onStickDown={(e, el) => {
            stickId.current = e.pointerId;
            el.setPointerCapture(e.pointerId);
            onStick(e.clientX, e.clientY, el.getBoundingClientRect());
          }}
          onStickMove={(e, el) => {
            if (stickId.current !== e.pointerId) return;
            onStick(e.clientX, e.clientY, el.getBoundingClientRect());
          }}
          onStickUp={endStick}
          onDash={() => g()?.queueDash()}
          onEco={() => g()?.queueEco()}
          onPause={() => g()?.togglePause()}
        />
      )}

      {hud.screen === "menu" && (
        <Menu
          hud={hud}
          go={(s) => g()?.open(s)}
          start={() => {
            enterLandscape();
            g()?.startRun();
          }}
        />
      )}
      {hud.screen === "paused" && (
        <PauseMenu
          resume={() => g()?.resume()}
          menu={() => g()?.toMenu()}
          settings={() => g()?.open("settings")}
        />
      )}
      {hud.screen === "levelup" && (
        <LevelUp choices={hud.choices} onPick={(id) => g()?.chooseUpgrade(id)} />
      )}
      {hud.screen === "echo" && hud.pendingEco && (
        <EchoChoice
          eco={hud.pendingEco}
          ecos={hud.ecos.length}
          onInvoke={() => g()?.invokePending()}
          onDiscard={() => g()?.discardPending()}
          onFuse={() => g()?.fusePending()}
          onRelease={() => g()?.dismissEco(0)}
        />
      )}
      {hud.screen === "dead" && <Death hud={hud} retry={() => g()?.startRun()} menu={() => g()?.toMenu()} />}
      {hud.screen === "win" && <Victory hud={hud} next={() => g()?.toMenu()} />}
      {hud.screen === "meta" && (
        <MetaShop hud={hud} buy={(id) => g()?.buyMeta(id)} back={() => g()?.open("menu")} />
      )}
      {hud.screen === "codex" && <Codex back={() => g()?.open("menu")} />}
      {hud.screen === "settings" && (
        <SettingsScreen
          hud={hud}
          set={(k, v) => g()?.setSetting(k, v)}
          back={() => g()?.open(overlay && hud.time > 0 ? "paused" : "menu")}
        />
      )}
      </div>

      {needsRotate && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-void px-8 text-center">
          <RotateCw className="size-12 text-cyan" />
          <p className="font-display text-2xl font-bold">Gira tu dispositivo</p>
          <p className="max-w-xs text-sm text-muted">Echo Survivor se juega en horizontal. Gíralo para continuar.</p>
        </div>
      )}
    </div>
  );
}

function Hud({ hud, onPause, onDismiss }: { hud: HudState; onPause: () => void; onDismiss: (i: number) => void }) {
  const hp = hud.hp / Math.max(1, hud.maxHp);
  const xp = hud.xp / Math.max(1, hud.nextXp);
  const hearts = 3;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2 rounded-[20px] border border-line bg-panel/80 p-2 pr-3 backdrop-blur-sm">
          <img
            src="/sprites/player_idle.png"
            alt=""
            className="size-12 rounded-[14px] border border-line bg-abyss object-cover object-top"
            style={{ imageRendering: "pixelated" }}
          />
          <div className="min-w-0 pt-0.5">
            <div className="mb-1 flex gap-0.5">
              {Array.from({ length: hearts }).map((_, i) => (
                <Heart
                  key={i}
                  className={`size-3.5 ${hp > (i + 0.15) / hearts ? "fill-danger text-danger" : "text-line"}`}
                />
              ))}
            </div>
            <Bar value={hp} color="bg-hp" />
            <Bar value={xp} color="bg-cyan" className="mt-1" />
            <p className="mt-1 text-[10px] font-bold tracking-wide text-muted">Nv. {hud.level}</p>
          </div>
        </div>

        <div className="text-center">
          <p className="font-display text-lg font-bold tabular-nums tracking-widest text-ice sm:text-xl">
            {formatTime(hud.time)}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">Oleada {hud.wave}</p>
          <div className="mx-auto mt-1 w-28 sm:w-36">
            <div className="mb-0.5 flex justify-between text-[9px] font-bold uppercase tracking-widest text-muted">
              <span>Cordura</span>
              <span>{hud.collapse ? "COLAPSO" : Math.round(hud.cordura)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-abyss">
              <div
                className={`h-full ${hud.collapse ? "bg-danger" : "bg-magenta"}`}
                style={{ width: `${Math.min(100, hud.cordura)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Chip>
            <Skull className="size-3.5 text-muted" />
            <span className="tabular-nums">{hud.kills}</span>
          </Chip>
          <Chip>
            <Coins className="size-3.5 text-gold" />
            <span className="tabular-nums">{hud.coins}</span>
          </Chip>
          <button
            type="button"
            className="pointer-events-auto flex size-11 items-center justify-center rounded-full border border-line bg-panel/90 text-ice"
            onClick={onPause}
            aria-label="Pausa"
          >
            <Pause className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap justify-end gap-1">
        {hud.ecos.map((e, i) => (
          <button
            key={`${e.id}-${i}`}
            type="button"
            className="pointer-events-auto rounded-lg border border-line bg-panel/90 px-2 py-1 text-[11px] font-semibold"
            style={{ color: e.color }}
            onClick={() => onDismiss(i)}
            title="Soltar este eco"
          >
            {e.name.replace("Eco del ", "")} ×
          </button>
        ))}
      </div>
    </div>
  );
}

function Bar({ value, color, className = "" }: { value: number; color: string; className?: string }) {
  return (
    <div className={`h-1.5 w-28 overflow-hidden rounded-full bg-abyss sm:w-36 ${className}`}>
      <div className={`h-full ${color}`} style={{ width: `${clamp01(value) * 100}%` }} />
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-line bg-panel/80 px-2.5 py-1.5 text-xs font-bold tabular-nums backdrop-blur-sm">
      {children}
    </div>
  );
}

function MobileControls({
  stick,
  dashCd,
  dashMax,
  onStickDown,
  onStickMove,
  onStickUp,
  onDash,
  onEco,
  onPause,
}: {
  stick: { x: number; y: number; on: boolean };
  dashCd: number;
  dashMax: number;
  onStickDown: (e: PointerEvent<HTMLDivElement>, el: HTMLDivElement) => void;
  onStickMove: (e: PointerEvent<HTMLDivElement>, el: HTMLDivElement) => void;
  onStickUp: () => void;
  onDash: () => void;
  onEco: () => void;
  onPause: () => void;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 sm:pointer-events-none">
      <div
        className="pointer-events-auto absolute bottom-6 left-5 size-[132px] rounded-full border border-line bg-panel/40 backdrop-blur-sm md:bottom-8 md:left-8"
        onPointerDown={(e) => onStickDown(e, e.currentTarget)}
        onPointerMove={(e) => onStickMove(e, e.currentTarget)}
        onPointerUp={onStickUp}
        onPointerCancel={onStickUp}
      >
        <div
          className="absolute size-12 rounded-full border border-cyan bg-cyan/30"
          style={{
            left: `calc(50% + ${stick.x * 36}px - 24px)`,
            top: `calc(50% + ${stick.y * 36}px - 24px)`,
          }}
        />
      </div>
      <div className="pointer-events-auto absolute right-5 bottom-6 flex flex-col items-end gap-3 md:right-8 md:bottom-8">
        <div className="flex gap-3">
          <RoundBtn label="Eco" onClick={onEco}>
            <Ghost className="size-5" />
          </RoundBtn>
          <RoundBtn label="Dash" onClick={onDash} dim={dashCd > 0}>
            <Wind className="size-5" />
          </RoundBtn>
          <RoundBtn label="Pausa" onClick={onPause}>
            <Pause className="size-5" />
          </RoundBtn>
        </div>
        <p className="hidden text-[10px] text-muted sm:block">WASD · E usa lo que tengas cerca · Espacio dash</p>
      </div>
    </div>
  );
}

function RoundBtn({
  children,
  label,
  onClick,
  dim,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  dim?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex size-[58px] flex-col items-center justify-center rounded-full border border-line bg-panel/80 text-ice ${dim ? "opacity-40" : ""}`}
    >
      {children}
      <span className="text-[9px] font-bold uppercase tracking-wider text-muted">{label}</span>
    </button>
  );
}

function FullCard({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center overflow-y-auto bg-void/80 px-4 py-2 backdrop-blur-[2px]">
      {children}
    </div>
  );
}

function Menu({
  hud,
  go,
  start,
}: {
  hud: HudState;
  go: (s: Screen) => void;
  start: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-center overflow-y-auto bg-gradient-to-t from-void via-void/80 to-transparent px-6 py-4 sm:px-16 sm:py-8">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-cyan">Sobrevive · Mejora · Rompe el ciclo</p>
      <h1 className="font-display text-4xl font-bold leading-[0.9] sm:text-5xl md:text-7xl">
        <span className="block text-ice">ECHO</span>
        <span className="block text-magenta">SURVIVOR</span>
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{GDD_TEXT.pitch}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Primary onClick={start}>Start — Jugar</Primary>
        <GhostBtn onClick={() => go("meta")}>Fragmentos</GhostBtn>
        <GhostBtn onClick={() => go("codex")}>Códice</GhostBtn>
        <GhostBtn onClick={() => go("settings")}>Ajustes</GhostBtn>
      </div>
      <p className="mt-4 text-xs text-muted">
        Mejor run {formatTime(hud.meta.best)} · {hud.meta.coins} fragmentos · {hud.meta.runs} ciclos
      </p>
    </div>
  );
}

function PauseMenu({ resume, menu, settings }: { resume: () => void; menu: () => void; settings: () => void }) {
  return (
    <FullCard>
      <Panel>
        <h2 className="font-display text-2xl">Pausa</h2>
        <p className="mt-1 text-sm text-muted">El ciclo espera.</p>
        <div className="mt-6 flex flex-col gap-2">
          <Primary onClick={resume}>Reanudar</Primary>
          <GhostBtn onClick={settings}>Ajustes</GhostBtn>
          <GhostBtn onClick={menu}>Menú principal</GhostBtn>
        </div>
      </Panel>
    </FullCard>
  );
}

function LevelUp({ choices, onPick }: { choices: HudState["choices"]; onPick: (id: string) => void }) {
  return (
    <FullCard>
      <h2 className="font-display text-center text-2xl text-gold sm:text-3xl">¡Subiste de nivel!</h2>
      <p className="mt-1 mb-6 text-sm text-muted">Elige una mejora</p>
      <div className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
        {choices.map((c) => {
          const Icon = ICONS[c.icon] ?? Sparkles;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onPick(c.id)}
              className="rounded-[22px] border border-line bg-panel p-5 text-left transition hover:border-cyan"
            >
              <Icon className="mb-3 size-6 text-cyan" />
              <h3 className="font-display text-lg">{c.name}</h3>
              <p className="mt-1 text-sm text-muted">{c.desc}</p>
              <span className="mt-4 inline-flex rounded-full bg-cyan px-3 py-1 text-xs font-bold text-void">Elegir</span>
            </button>
          );
        })}
      </div>
    </FullCard>
  );
}

function EchoChoice({
  eco,
  ecos,
  onInvoke,
  onDiscard,
  onFuse,
  onRelease,
}: {
  eco: NonNullable<HudState["pendingEco"]>;
  ecos: number;
  onInvoke: () => void;
  onDiscard: () => void;
  onFuse: () => void;
  onRelease: () => void;
}) {
  return (
    <FullCard>
      <Panel>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan">Un Eco te observa</p>
        <h2 className="mt-2 font-display text-2xl" style={{ color: eco.color }}>
          {eco.name}
        </h2>
        <p className="mt-3 text-sm italic text-muted">“{eco.phrase}”</p>
        <p className="mt-3 text-xs text-muted">Cordura +{eco.cordura} mientras esté activo. Máximo 3 Ecos.</p>
        <div className="mt-6 flex flex-col gap-2">
          <Primary onClick={onInvoke} disabled={ecos >= 3}>
            Invocar
          </Primary>
          {ecos >= 1 && <GhostBtn onClick={onFuse}>Fusionar con el más antiguo</GhostBtn>}
          {ecos >= 3 && <GhostBtn onClick={onRelease}>Soltar el más antiguo y hacer sitio</GhostBtn>}
          <GhostBtn onClick={onDiscard}>Dejarlo ir</GhostBtn>
        </div>
      </Panel>
    </FullCard>
  );
}

function Death({ hud, retry, menu }: { hud: HudState; retry: () => void; menu: () => void }) {
  return (
    <FullCard>
      <Panel>
        <h2 className="font-display text-center text-3xl text-magenta">Has caído</h2>
        <p className="mt-1 text-center text-sm text-muted">El ciclo continúa…</p>
        <Stats hud={hud} />
        <div className="mt-6 flex flex-col gap-2">
          <Primary onClick={retry}>Reintentar</Primary>
          <GhostBtn onClick={menu}>Menú principal</GhostBtn>
        </div>
      </Panel>
    </FullCard>
  );
}

function Victory({ hud, next }: { hud: HudState; next: () => void }) {
  return (
    <FullCard>
      <Panel>
        <h2 className="font-display text-center text-3xl text-cyan">¡Run completada!</h2>
        <Stats hud={hud} />
        <Primary onClick={next} className="mt-6">
          Siguiente
        </Primary>
      </Panel>
    </FullCard>
  );
}

function Stats({ hud }: { hud: HudState }) {
  return (
    <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
      <dt className="text-muted">Tiempo</dt>
      <dd className="text-right tabular-nums">{formatTime(hud.time)}</dd>
      <dt className="text-muted">Oleadas</dt>
      <dd className="text-right tabular-nums">{hud.wave}</dd>
      <dt className="text-muted">Bajas</dt>
      <dd className="text-right tabular-nums">{hud.kills}</dd>
      <dt className="text-muted">Daño total</dt>
      <dd className="text-right tabular-nums">{hud.damageDealt}</dd>
      <dt className="text-muted">Nivel</dt>
      <dd className="text-right tabular-nums">{hud.level}</dd>
      <dt className="text-muted">Fragmentos</dt>
      <dd className="text-right tabular-nums text-gold">+{hud.coins}</dd>
    </dl>
  );
}

function MetaShop({ hud, buy, back }: { hud: HudState; buy: (id: string) => void; back: () => void }) {
  const ranks: Record<string, number> = {
    damage: hud.meta.damage,
    hp: hud.meta.hp,
    speed: hud.meta.speed,
    magnet: hud.meta.magnet,
  };
  return (
    <FullCard>
      <Panel wide>
        <h2 className="font-display text-2xl">Fragmentos</h2>
        <p className="mt-1 text-sm text-muted">
          {hud.meta.coins} fragmentos · las mejoras sobreviven a la muerte
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {META_SHOP.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => buy(it.id)}
              className="rounded-2xl border border-line bg-panel-2 p-4 text-left hover:border-gold"
            >
              <h3 className="font-semibold">{it.name}</h3>
              <p className="mt-1 text-xs text-muted">{it.desc}</p>
              <p className="mt-2 text-xs text-gold">
                Rango {ranks[it.id] ?? 0} · {it.cost} fragmentos
              </p>
            </button>
          ))}
        </div>
        <GhostBtn onClick={back} className="mt-5">
          Volver
        </GhostBtn>
      </Panel>
    </FullCard>
  );
}

function Codex({ back }: { back: () => void }) {
  return (
    <FullCard>
      <Panel wide>
        <h2 className="font-display text-2xl">Códice</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{GDD_TEXT.pitch}</p>
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-ice">
          {GDD_TEXT.loop.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ol>
        <h3 className="mt-6 font-display text-lg">Mejoras</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          {UPGRADES.map((u) => (
            <li key={u.id}>
              <span className="text-ice">{u.name}.</span> {u.desc}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-muted">
          PC: WASD o flechas, autoataque, E para ecos, cristales, árboles, pilares, rocas, cofres y altares. Espacio dash, Esc pausa. Móvil: joystick y botón Eco.
        </p>
        <GhostBtn onClick={back} className="mt-5">
          Volver
        </GhostBtn>
      </Panel>
    </FullCard>
  );
}

function SettingsScreen({
  hud,
  set,
  back,
}: {
  hud: HudState;
  set: (k: "shake" | "music" | "sfx", v: boolean) => void;
  back: () => void;
}) {
  return (
    <FullCard>
      <Panel>
        <h2 className="font-display text-2xl">Ajustes</h2>
        <Toggle label="Música" on={hud.meta.music} toggle={() => set("music", !hud.meta.music)} icon={hud.meta.music ? Volume2 : VolumeX} />
        <Toggle label="Efectos" on={hud.meta.sfx} toggle={() => set("sfx", !hud.meta.sfx)} icon={hud.meta.sfx ? Zap : VolumeX} />
        <Toggle label="Temblor de cámara" on={hud.meta.shake} toggle={() => set("shake", !hud.meta.shake)} icon={Shield} />
        <GhostBtn onClick={back} className="mt-5">
          Volver
        </GhostBtn>
      </Panel>
    </FullCard>
  );
}

function Toggle({
  label,
  on,
  toggle,
  icon: Icon,
}: {
  label: string;
  on: boolean;
  toggle: () => void;
  icon: typeof Volume2;
}) {
  return (
    <button
      type="button"
      onClick={toggle}
      className="mt-3 flex w-full items-center justify-between rounded-2xl border border-line bg-panel-2 px-4 py-3"
    >
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-cyan" />
        {label}
      </span>
      <span className={`text-xs font-bold ${on ? "text-hp" : "text-muted"}`}>{on ? "ON" : "OFF"}</span>
    </button>
  );
}

function Panel({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <div
      className={`w-full rounded-[28px] border border-line bg-panel p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] ${wide ? "max-w-2xl" : "max-w-md"}`}
    >
      {children}
    </div>
  );
}

function Primary({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full bg-ice px-6 py-3 text-sm font-bold text-void disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

function GhostBtn({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border border-line bg-transparent px-6 py-3 text-sm font-semibold text-ice ${className}`}
    >
      {children}
    </button>
  );
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

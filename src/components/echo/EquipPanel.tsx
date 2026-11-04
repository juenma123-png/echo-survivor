"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Coins } from "lucide-react";
import type { HudState } from "@/game/engine";
import {
  GEAR_SLOTS,
  describeAffix,
  dissolveValue,
  emptyTotals,
  gearIcon,
  rarityColor,
  rarityName,
  totalsOf,
  type GearItem,
  type GearSlotId,
  type GearTotals,
  type Rarity,
} from "@/game/gear";

const RARITY_RANK: Record<Rarity, number> = { comun: 0, raro: 1, epico: 2, legendario: 3 };

/**
 * Panel de equipo por calidad. Arriba, las cinco ranuras equipadas; abajo, el inventario
 * (cofres, élites y jefes) filtrable por ranura. Tocar un objeto abre su detalle y acciones.
 */
export function EquipPanel({
  hud,
  onEquip,
  onUnequip,
  onDissolve,
}: {
  hud: HudState;
  onEquip: (uid: string) => void;
  onUnequip: (slot: GearSlotId) => void;
  onDissolve: (uid: string) => void;
}) {
  const [filter, setFilter] = useState<GearSlotId | "todo">("todo");
  const [selected, setSelected] = useState<string | null>(null);

  const inventory = hud.meta.inventory ?? [];
  const equipped = hud.meta.equipped ?? { arma: "", casco: "", armadura: "", botas: "", reliquia: "" };

  const worn = useMemo(
    () =>
      (Object.values(equipped) as string[])
        .map((uid) => inventory.find((it) => it.uid === uid))
        .filter((it): it is GearItem => !!it),
    [equipped, inventory],
  );
  const totals = useMemo(() => (worn.length ? totalsOf(worn) : emptyTotals()), [worn]);

  const shown = useMemo(
    () =>
      inventory
        .filter((it) => filter === "todo" || it.slot === filter)
        .sort((a, b) => RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity] || b.level - a.level),
    [inventory, filter],
  );

  const chosen = inventory.find((it) => it.uid === selected) ?? null;
  const chosenIsWorn = chosen ? (Object.values(equipped) as string[]).includes(chosen.uid) : false;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto pb-2">
      {/* Ranuras equipadas */}
      <div className="grid grid-cols-5 gap-2">
        {GEAR_SLOTS.map((s) => {
          const item = inventory.find((it) => it.uid === equipped[s.id]);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => (item ? setSelected(item.uid) : setFilter(s.id))}
              className="flex min-h-[108px] flex-col items-center gap-1 rounded-2xl border bg-panel/80 p-2 text-center"
              style={{ borderColor: item ? rarityColor(item.rarity) : undefined, boxShadow: item ? `0 0 16px ${rarityColor(item.rarity)}33` : undefined }}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{s.name}</span>
              {item ? (
                <>
                  <img src={gearIcon(item.base)} alt="" className="size-12 object-contain" style={{ imageRendering: "pixelated" }} />
                  <span className="line-clamp-2 text-[11px] font-bold leading-tight" style={{ color: rarityColor(item.rarity) }}>
                    {item.base}
                  </span>
                </>
              ) : (
                <span className="mt-3 text-[11px] text-muted">Vacío</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Resumen de efectos totales */}
      <div className="rounded-2xl border border-line bg-panel/60 p-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Efectos equipados</p>
        <TotalsList totals={totals} />
      </div>

      {/* Filtro por ranura */}
      <div className="flex flex-wrap gap-1.5">
        <FilterChip active={filter === "todo"} onClick={() => setFilter("todo")}>
          Todo
        </FilterChip>
        {GEAR_SLOTS.map((s) => (
          <FilterChip key={s.id} active={filter === s.id} onClick={() => setFilter(s.id)}>
            {s.name}
          </FilterChip>
        ))}
      </div>

      {/* Inventario */}
      {inventory.length === 0 ? (
        <p className="text-sm text-muted">
          Aún no tienes equipo. Abre cofres y derrota élites o jefes en una run: ahí cae el botín.
        </p>
      ) : shown.length === 0 ? (
        <p className="text-sm text-muted">No hay objetos de esta ranura todavía.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {shown.map((it) => {
            const on = (Object.values(equipped) as string[]).includes(it.uid);
            return (
              <button
                key={it.uid}
                type="button"
                onClick={() => setSelected(it.uid)}
                className={`flex flex-col items-center gap-1 rounded-xl border bg-panel/80 p-2 text-center ${selected === it.uid ? "ring-2 ring-cyan" : ""}`}
                style={{ borderColor: rarityColor(it.rarity) }}
              >
                <img src={gearIcon(it.base)} alt="" className="size-10 object-contain" style={{ imageRendering: "pixelated" }} />
                <span className="line-clamp-2 text-[10px] font-bold leading-tight" style={{ color: rarityColor(it.rarity) }}>
                  {it.base}
                </span>
                <span className="text-[10px] text-muted">{on ? "Equipado" : `Nv.${it.level}`}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Detalle del objeto seleccionado */}
      {chosen && (
        <div className="rounded-2xl border bg-panel p-3" style={{ borderColor: rarityColor(chosen.rarity) }}>
          <div className="flex items-center gap-3">
            <img src={gearIcon(chosen.base)} alt="" className="size-14 object-contain" style={{ imageRendering: "pixelated" }} />
            <div>
            <p className="font-display text-lg" style={{ color: rarityColor(chosen.rarity) }}>
              {chosen.base}
            </p>
            <p className="text-xs text-muted">
              {rarityName(chosen.rarity)} · Nv. {chosen.level} · {GEAR_SLOTS.find((s) => s.id === chosen.slot)?.name}
            </p>
            </div>
          </div>
          <ul className="mt-2 flex flex-col gap-0.5 text-sm">
            {chosen.affixes.map((a, i) => (
              <li key={`${a.stat}-${i}`} className="text-ice">
                {describeAffix(a)}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            {chosenIsWorn ? (
              <Btn onClick={() => onUnequip(chosen.slot)}>Quitar</Btn>
            ) : (
              <Btn primary onClick={() => onEquip(chosen.uid)}>
                Equipar
              </Btn>
            )}
            {!chosenIsWorn && (
              <Btn onClick={() => { onDissolve(chosen.uid); setSelected(null); }}>
                <Coins className="size-3.5 text-gold" /> Desmontar +{dissolveValue(chosen)}
              </Btn>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Lista los efectos totales que no son cero. */
function TotalsList({ totals }: { totals: GearTotals }) {
  const lines = (Object.keys(totals) as (keyof GearTotals)[])
    .filter((k) => totals[k] > 0)
    .map((k) => describeAffix({ stat: k, value: totals[k] }));
  if (lines.length === 0) {
    return <p className="mt-1 text-sm text-muted">Sin efectos. Equipa algo para ver aquí su suma.</p>;
  }
  return (
    <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-ice">
      {lines.map((l) => (
        <li key={l}>{l}</li>
      ))}
    </ul>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-bold ${active ? "border-cyan bg-cyan/15 text-cyan" : "border-line bg-panel/70 text-muted"}`}
    >
      {children}
    </button>
  );
}

function Btn({ children, onClick, primary }: { children: ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ${primary ? "bg-ice text-void" : "border border-line text-ice"}`}
    >
      {children}
    </button>
  );
}

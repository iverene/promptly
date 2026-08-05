import { Check, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { folderColors } from '../lib/folderColors';

const validHex = /^#[0-9A-F]{6}$/;

function hueToHex(hue, saturation = 55, lightness = 72) {
  const s = saturation / 100;
  const l = lightness / 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const segment = hue / 60;
  const secondary = chroma * (1 - Math.abs((segment % 2) - 1));
  const [red, green, blue] = segment < 1 ? [chroma, secondary, 0]
    : segment < 2 ? [secondary, chroma, 0]
      : segment < 3 ? [0, chroma, secondary]
        : segment < 4 ? [0, secondary, chroma]
          : segment < 5 ? [secondary, 0, chroma]
            : [chroma, 0, secondary];
  const match = l - chroma / 2;
  return `#${[red, green, blue].map((channel) => Math.round((channel + match) * 255).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

function hexToHue(hex) {
  if (!validHex.test(hex.toUpperCase())) return 40;
  const [red, green, blue] = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  if (!delta) return 0;
  const hue = max === red ? ((green - blue) / delta) % 6 : max === green ? (blue - red) / delta + 2 : (red - green) / delta + 4;
  return Math.round((hue * 60 + 360) % 360);
}

export function FolderColorSelector({ value, onChange, error }) {
  const [customOpen, setCustomOpen] = useState(false);
  const [draft, setDraft] = useState(value.toUpperCase());
  const [hue, setHue] = useState(() => hexToHue(value));
  const presetSelected = folderColors.some((color) => color.value.toUpperCase() === value.toUpperCase());

  useEffect(() => {
    setDraft(value.toUpperCase());
    setHue(hexToHue(value));
  }, [value]);

  const selectPreset = (color) => {
    onChange(color);
    setCustomOpen(false);
  };
  const updateDraft = (event) => {
    let next = event.target.value.toUpperCase();
    if (!next.startsWith('#')) next = `#${next}`;
    if (/^#[0-9A-F]{0,6}$/.test(next)) {
      setDraft(next);
      if (validHex.test(next)) setHue(hexToHue(next));
    }
  };
  const updateHue = (event) => {
    const nextHue = Number(event.target.value);
    setHue(nextHue);
    setDraft(hueToHex(nextHue));
  };
  const applyCustomColor = () => {
    if (!validHex.test(draft)) return;
    onChange(draft);
    setCustomOpen(false);
  };

  return <fieldset>
    <legend className="mb-2 text-xs font-medium uppercase tracking-[.12em] text-secondary">Folder color</legend>
    <div className="flex flex-wrap gap-2.5">
      {folderColors.map((color) => <button
        type="button"
        key={color.value}
        onClick={() => selectPreset(color.value)}
        aria-label={color.name}
        title={color.name}
        aria-pressed={value.toUpperCase() === color.value.toUpperCase()}
        className="focus-ring relative size-10 shrink-0 rounded-full border border-black/15 transition duration-200 hover:-translate-y-0.5 sm:size-11"
        style={{ background: color.value }}
      >
        {value.toUpperCase() === color.value.toUpperCase() && <Check className="absolute inset-0 m-auto" size={16} strokeWidth={2} />}
      </button>)}
      <button
        type="button"
        onClick={() => setCustomOpen((open) => !open)}
        aria-label="Choose a custom color"
        aria-expanded={customOpen}
        className="focus-ring relative grid size-10 shrink-0 place-items-center rounded-full border border-dashed border-black/25 bg-white/70 sm:size-11"
        style={!presetSelected ? { background: value } : undefined}
      >
        {!presetSelected ? <Check size={16} /> : customOpen ? <X size={16} /> : <Plus size={16} />}
      </button>
    </div>
    {customOpen && <div className="soft-enter mt-3 grid grid-cols-[40px_1fr] items-end gap-3 border border-black/20 bg-white/70 p-3 sm:grid-cols-[44px_1fr_auto]">
      <span className="size-10 border border-black/20 sm:size-11" style={{ background: validHex.test(draft) ? draft : value }} aria-hidden="true" />
      <label className="min-w-0">
        <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[.12em] text-secondary">Hex color</span>
        <input value={draft} onChange={updateDraft} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); applyCustomColor(); } }} maxLength={7} inputMode="text" autoComplete="off" spellCheck="false" aria-label="Custom hex color" className="focus-ring h-10 w-full rounded-none border border-black/25 bg-white px-3 font-mono text-sm uppercase" placeholder="#D9CBA0" />
      </label>
      <button type="button" disabled={!validHex.test(draft)} onClick={applyCustomColor} className="focus-ring col-span-2 min-h-10 bg-black px-4 text-sm font-medium text-white disabled:opacity-35 sm:col-span-1">Apply</button>
      <label className="col-span-2 block sm:col-span-3">
        <span className="mb-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-[.12em] text-secondary"><span>Adjust color</span><span>{hue}°</span></span>
        <input
          type="range"
          min="0"
          max="359"
          value={hue}
          onChange={updateHue}
          aria-label="Adjust custom color hue"
          className="focus-ring h-2 w-full cursor-pointer appearance-none border-0 bg-[linear-gradient(90deg,#ef9a9a,#efd89a,#b7df9a,#9adfce,#9ab7ef,#c29aef,#ef9ad8,#ef9a9a)] p-0 [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-white"
        />
      </label>
    </div>}
    {error && <p className="mt-2 text-xs text-danger">{error}</p>}
  </fieldset>;
}

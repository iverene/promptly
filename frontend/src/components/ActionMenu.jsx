import { IconButton } from './ui';

export function ActionMenu({ triggerIcon, label, open, onToggle, options }) {
  return <div className="relative">
    <IconButton icon={triggerIcon} label={label} onClick={onToggle} />
    {open && <div className="absolute right-0 top-14 z-40 grid w-[200px] gap-[6px]">
      {options.map(({ label: optionLabel, icon: Icon, onClick, disabled, danger }) => <button
        key={optionLabel}
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`focus-ring flex min-h-[46px] items-center justify-between gap-3 rounded-bl-[14px] rounded-br-[14px] rounded-tl-[14px] rounded-tr-[14px] border-[1.5px] border-[rgba(17,17,17,.72)] bg-white px-[14px] text-left text-sm transition hover:bg-[#f5f5f2] disabled:opacity-50 ${danger ? 'text-danger hover:bg-[#fff1f0]' : ''}`}
      >
        <span>{optionLabel}</span>
        <Icon size={17} />
      </button>)}
    </div>}
  </div>;
}

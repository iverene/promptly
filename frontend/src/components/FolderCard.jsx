import { defaultFolderColor } from '../lib/folderColors';

export function FolderCard({ folder, onClick, preview = false }) {
  const color = folder.color || defaultFolderColor;
  return <button
    type="button"
    onClick={onClick}
    disabled={preview}
    aria-label={preview ? undefined : `Open ${folder.name}`}
    className="focus-ring group relative block w-full pt-[14px] text-left transition-[transform,filter] duration-[220ms] enabled:hover:-translate-y-[3px] enabled:hover:saturate-[1.05] enabled:active:-translate-y-px disabled:cursor-default max-sm:max-w-[160px] max-sm:justify-self-center lg:max-w-[220px]"
  >
    <span
      aria-hidden="true"
      className="absolute left-0 top-0 h-[26px] w-[43%] rounded-tl-[9px] rounded-tr-[10px] border border-b-0 border-black/50"
      style={{ background: `color-mix(in srgb, ${color} 82%, transparent)`, backdropFilter: 'blur(24px)' }}
    />
    <span
      className="relative z-10 flex min-h-[112px] flex-col justify-between rounded-bl-[12px] rounded-br-[12px] rounded-tr-[12px] border border-black/50 px-[10px] pb-[12px] pt-[16px] shadow-[0_16px_38px_rgba(17,17,17,.07),inset_0_1px_rgba(255,255,255,.62)] group-disabled:min-h-[100px] group-disabled:px-[12px] group-disabled:pb-[12px] group-disabled:pt-[15px] lg:min-h-[122px] lg:px-[15px] lg:pb-[13px] lg:pt-[17px] lg:group-disabled:min-h-[118px] lg:group-disabled:px-[16px] lg:group-disabled:pb-[14px] lg:group-disabled:pt-[18px]"
      style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${color} 88%, white 12%), color-mix(in srgb, ${color} 72%, transparent))`, backdropFilter: 'blur(24px) saturate(130%)' }}
    >
      <span className="flex items-start justify-between gap-2 sm:gap-4">
        <span className="min-w-0">
          <span className="block truncate text-[.95rem] font-medium tracking-[-.035em] text-ink sm:text-[1.15rem]">{folder.name || 'Untitled folder'}</span>
          {folder.description && <span className="mt-2 hidden text-sm leading-6 text-secondary sm:line-clamp-2">{folder.description}</span>}
        </span>
      </span>
    </span>
  </button>;
}

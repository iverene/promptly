import { ArrowUpRight } from 'lucide-react';
import { formatDate, promptCount } from '../lib/format';
import { defaultFolderColor } from '../lib/folderColors';

export function FolderCard({ folder, onClick, preview = false }) {
  const count = promptCount(folder);
  return <button type="button" onClick={onClick} disabled={preview} aria-label={preview ? undefined : `Open ${folder.name}`} className="folder-card focus-ring group w-full text-left disabled:cursor-default" style={{ '--folder-color': folder.color || defaultFolderColor }}>
    <span className="folder-card__tab" aria-hidden="true" />
    <span className="folder-card__body">
      <span className="flex items-start justify-between gap-4">
        <span className="min-w-0">
          <span className="block truncate text-[1.35rem] font-medium tracking-[-.045em] text-ink">{folder.name || 'Untitled folder'}</span>
          {folder.description && <span className="mt-2 line-clamp-2 block text-sm leading-6 text-secondary">{folder.description}</span>}
        </span>
        {!preview && <span className="grid size-9 shrink-0 place-items-center rounded-full border border-black/10 bg-white/35 transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"><ArrowUpRight size={17} /></span>}
      </span>
      <span className="mt-8 flex items-end justify-between gap-3 text-[11px] uppercase tracking-[.12em] text-secondary">
        <span>{count} {count === 1 ? 'prompt' : 'prompts'}</span>
        <span>{preview ? 'Preview' : formatDate(folder.updatedAt)}</span>
      </span>
    </span>
  </button>;
}

import { ArrowUpRight } from 'lucide-react';
import { formatDate, promptCount } from '../lib/format';
import { defaultFolderColor } from '../lib/folderColors';

export function FolderCard({ folder, onClick, preview = false }) {
  const count = promptCount(folder);
  return <button type="button" onClick={onClick} disabled={preview} aria-label={preview ? undefined : `Open ${folder.name}`} className="folder-card focus-ring group w-full text-left disabled:cursor-default" style={{ '--folder-color': folder.color || defaultFolderColor }}>
    <span className="folder-card__tab" aria-hidden="true" />
    <span className="folder-card__body">
      <span className="flex items-start justify-between gap-2 sm:gap-4">
        <span className="min-w-0">
          <span className="block truncate text-[.95rem] font-medium tracking-[-.035em] text-ink sm:text-[1.15rem]">{folder.name || 'Untitled folder'}</span>
          {folder.description && <span className="mt-2 hidden text-sm leading-6 text-secondary sm:line-clamp-2">{folder.description}</span>}
        </span>
        {!preview }
      </span>

    </span>
  </button>;
}

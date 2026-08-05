import { Check, LoaderCircle, Plus } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export function CategoryPicker({ open, onClose, categories = [], loading, selected, categoryName, onNameChange, onSelect, onCreate, creating, error }) {
  useEffect(() => {
    if (!open) return undefined;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    };
  }, [open]);

  if (!open) return null;
  const canCreate = Boolean(categoryName.trim()) && !creating;

  return createPortal(<div className="fixed inset-0 z-[60] flex items-end justify-center overflow-hidden overscroll-none bg-black/30 p-3 backdrop-blur-sm sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !creating) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="category-picker-title" className="glass-strong soft-enter flex max-h-[80vh] w-full max-w-md flex-col rounded-[28px] p-5 sm:p-6">
      <header className="flex items-center justify-between gap-4 border-b border-black/20 pb-4">
        <h2 id="category-picker-title" className="text-xl">Categories</h2>
        <button type="button" disabled={creating} onClick={onClose} className="focus-ring min-h-10 rounded-full border border-black/30 bg-white/75 px-4 text-sm font-medium hover:bg-white disabled:opacity-50">Confirm</button>
      </header>
      <form className="mt-5 flex gap-2" onSubmit={(event) => { event.preventDefault(); if (canCreate) onCreate(); }}>
        <input value={categoryName} onChange={(event) => onNameChange(event.target.value)} autoComplete="off" data-form-type="other" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" placeholder="New category name" aria-label="New category name" className="focus-ring h-12 min-w-0 flex-1 rounded-none border border-black/30 bg-white/80 px-4 text-sm placeholder:text-muted" />
        <button type="submit" aria-label="Add new category" disabled={!canCreate} className="focus-ring grid size-12 shrink-0 place-items-center rounded-full border border-black/30 bg-white/80 disabled:cursor-not-allowed disabled:opacity-35">{creating ? <LoaderCircle className="animate-spin" size={18} /> : <Plus size={19} />}</button>
      </form>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      <div className="mt-5 max-h-72 overflow-y-auto overscroll-contain pr-1">
        {loading
          ? <p className="py-6 text-center text-sm text-muted">Loading categories…</p>
          : categories.length
            ? categories.map((item) => <button key={item.id} type="button" onClick={() => onSelect(item.id)} className={`focus-ring flex min-h-12 w-full items-center justify-between gap-4 border-b border-dashed border-black/20 px-2 text-left text-sm transition hover:bg-white/45 ${selected === item.id ? 'font-semibold text-ink' : 'text-secondary'}`}><span className="truncate">{item.name}</span>{selected === item.id && <Check size={17} />}</button>)
            : <p className="py-6 text-center text-sm text-muted">No categories yet.</p>}
      </div>
    </section>
  </div>, document.body);
}

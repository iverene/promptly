import { Copy } from 'lucide-react';
import { IconButton } from './ui';

export function PromptContentCard({ content, onCopy }) {
  return <article className="mt-8 rounded-[30px] border border-black/20 bg-white/90 p-4 shadow-[0_18px_48px_rgba(17,17,17,.055)]">
    <div className="flex items-center justify-between gap-4">
      <p className="text-[10px] font-medium uppercase tracking-[.2em] text-muted">Full prompt</p>
      <IconButton icon={Copy} label="Copy prompt" onClick={onCopy} className="size-10 bg-white" />
    </div>
    <p className="mt-[10px] whitespace-pre-wrap text-[clamp(1.05rem,2vw,1.25rem)] leading-[1.55] text-ink">{content}</p>
  </article>;
}

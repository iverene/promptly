export function ProfileButton({ displayName, onClick }) {
  return <button
    type="button"
    onClick={onClick}
    aria-label={`Open ${displayName}'s profile`}
    className="focus-ring glass flex size-12 shrink-0 items-center justify-center rounded-full p-2 text-sm font-medium sm:h-auto sm:w-auto sm:gap-2 sm:py-2 sm:pl-2 sm:pr-4 lg:fixed lg:right-7 lg:top-6 lg:z-[35]"
  >
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-black text-xs uppercase text-white">{displayName.charAt(0)}</span>
    <span className="hidden max-w-32 truncate sm:block">{displayName}</span>
  </button>;
}

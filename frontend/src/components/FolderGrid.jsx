export function FolderGrid({ children }) {
  return <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-7 lg:grid-cols-[repeat(auto-fill,minmax(180px,220px))] lg:gap-5">{children}</div>;
}

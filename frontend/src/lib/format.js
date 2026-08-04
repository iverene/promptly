export const formatDate = (value) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(value));
export const promptCount = (folder) => folder.categories?.reduce((sum, category) => sum + (category._count?.prompts ?? 0), 0) ?? 0;


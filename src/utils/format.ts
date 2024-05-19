export const formatSize = (size: number) => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let cur = 0;
  while (size > 1024 && cur + 1 < units.length) {
    cur++;
    size /= 1024;
  }
  return `${Math.round(size * 10) / 10} ${units[cur]}`;
};

export const toTimestamp = (ISOstring: string) => {
  return new Date(ISOstring).getTime();
};

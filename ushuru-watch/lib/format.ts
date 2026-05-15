export const KES = (n: number): string => {
  if (!Number.isFinite(n)) n = 0;
  return Math.round(n).toLocaleString("en-US");
};

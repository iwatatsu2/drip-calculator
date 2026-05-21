export type DripType = 20 | 60;

export function calcFlowRate(volumeMl: number, timeH: number): number {
  if (timeH <= 0) return 0;
  return volumeMl / timeH;
}

export function calcDripsPerMin(volumeMl: number, timeH: number, dripFactor: DripType): number {
  if (timeH <= 0) return 0;
  return (volumeMl * dripFactor) / (timeH * 60);
}

export function calcDripInterval(dripsPerMin: number): number {
  if (dripsPerMin <= 0) return 0;
  return 60 / dripsPerMin;
}

export interface BagInfo {
  id: string;
  name: string;
  volumeMl: number;
  timeH: number;
  startTime: string; // HH:MM
}

export function calcEndTime(startTime: string, timeH: number): string {
  const [h, m] = startTime.split(':').map(Number);
  const totalMin = h * 60 + m + timeH * 60;
  const endH = Math.floor(totalMin / 60) % 24;
  const endM = Math.round(totalMin % 60);
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

export function calcRemainingMin(endTime: string, now: Date): number {
  const [h, m] = endTime.split(':').map(Number);
  const endMin = h * 60 + m;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let diff = endMin - nowMin;
  if (diff < 0) diff += 24 * 60;
  return diff;
}

export const QUICK_REF = [
  { volume: 500, hours: [3, 4, 6, 8, 12, 24] },
  { volume: 250, hours: [1, 2, 3, 4, 6] },
  { volume: 100, hours: [0.5, 1, 2, 3] },
  { volume: 1000, hours: [6, 8, 12, 24] },
];

import { WorkoutSet } from '../types/database';

/**
 * Format meters with commas and unit: 1750 -> "1,750m"
 */
export function formatDistance(meters: number): string {
  if (meters === undefined || meters === null || isNaN(meters)) return '0m';
  return `${meters.toLocaleString()}m`;
}

/**
 * Format meters into km with 1 or 2 decimals if large: 18500 -> "18.5km"
 */
export function formatKm(meters: number): string {
  if (!meters) return '0km';
  const km = meters / 1000;
  return `${km.toFixed(1)}km`;
}

/**
 * Format minutes into readable Korean string: 60 -> "60분", 90 -> "1시간 30분"
 */
export function formatDuration(minutes: number): string {
  if (!minutes) return '0분';
  if (minutes < 60) return `${minutes}분`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}시간 ${mins}분` : `${hrs}시간`;
}

/**
 * Calculate total distance by summing all workout sets
 */
export function calculateTotalDistance(sets: Pick<WorkoutSet, 'distance'>[]): number {
  return sets.reduce((sum, set) => sum + (Number(set.distance) || 0), 0);
}


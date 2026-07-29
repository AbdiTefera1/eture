// Fixed vocabulary of "what do you want to do" tags for destinations.
// Kept as a fixed list (rather than free text) so filtering stays reliable.
export const ACTIVITY_TAGS = [
  { key: "hiking", label: "Hiking & trekking", icon: "mountain" },
  { key: "wildlife", label: "Wildlife & animals", icon: "paw" },
  { key: "water", label: "Lakes & water", icon: "wave" },
  { key: "jungle", label: "Forest & jungle", icon: "leaf" },
  { key: "desert", label: "Desert & extreme landscape", icon: "sun" },
  { key: "cultural", label: "Culture & history", icon: "church" },
  { key: "adventure", label: "Adventure & expedition", icon: "tent" },
  { key: "city", label: "City & markets", icon: "market" },
] as const;

export type ActivityTagKey = (typeof ACTIVITY_TAGS)[number]["key"];

export function activityLabel(key: string): string {
  return ACTIVITY_TAGS.find((t) => t.key === key)?.label || key;
}

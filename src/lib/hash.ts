export function shortHash(input: string): string {
  // Simple deterministic hash for demo purposes
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit int
  }
  return Math.abs(hash).toString(16).padStart(8, '0').slice(0, 16);
}

export function chainHash(prevHash: string, payload: unknown): string {
  return shortHash(prevHash + JSON.stringify(payload));
}

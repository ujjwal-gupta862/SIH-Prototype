export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} ${formatTime(iso)}`;
}

export function slaColor(hoursRemaining: number): 'green' | 'amber' | 'red' {
  if (hoursRemaining > 24) return 'green';
  if (hoursRemaining > 6) return 'amber';
  return 'red';
}

export function slaText(hoursRemaining: number): string {
  if (hoursRemaining < 0) return `SLA breached by ${Math.abs(Math.round(hoursRemaining))}h`;
  if (hoursRemaining < 1) return `${Math.round(hoursRemaining * 60)}m remaining`;
  if (hoursRemaining < 24) return `${Math.round(hoursRemaining)}h remaining`;
  return `${Math.round(hoursRemaining / 24)}d remaining`;
}

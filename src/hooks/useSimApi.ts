/** Simulated API call with deterministic latency (300-900ms range, fixed seeds) */
export async function simDelay(ms = 600): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchVerifiedFacts() {
  await simDelay(700);
  return { success: true };
}

export async function submitApplication() {
  await simDelay(500);
  return { success: true, caseId: 'SUT-2026-004821' };
}

export async function simulateSoapTimeout() {
  // Simulate SOAP timeout then retry success
  await simDelay(800);
  return { attempt: 1, result: 'timeout' };
}

export async function simulateSoapRetry() {
  await simDelay(900);
  return { attempt: 2, result: 'recovered' };
}

export async function officerApprove() {
  await simDelay(400);
  return { success: true, referralTriggered: true };
}

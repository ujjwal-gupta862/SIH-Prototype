import type { SimState, EngineAction, AuditEvent, Notification } from './types';
import { chainHash } from '../lib/hash';

export class SimEngine extends EventTarget {
  private state: SimState;
  private timer: ReturnType<typeof setInterval> | null = null;
  private realTimeMsPerSimHour = 1000;

  constructor(initialState: SimState) {
    super();
    this.state = JSON.parse(JSON.stringify(initialState));
  }

  public getState(): SimState {
    return this.state;
  }

  public setSpeed(speed: 0.5 | 1 | 2 | 4) {
    this.state.speed = speed;
    if (!this.state.paused) {
      this.pause();
      this.resume();
    }
    this.emitChange();
  }

  public pause() {
    this.state.paused = true;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.emitChange();
  }

  public resume() {
    this.state.paused = false;
    this.timer = setInterval(() => {
      this.tick();
    }, this.realTimeMsPerSimHour / this.state.speed);
    this.emitChange();
  }

  public step() {
    this.tick();
  }

  public reset(newState: SimState) {
    this.pause();
    this.state = JSON.parse(JSON.stringify(newState));
    this.emitChange();
  }

  private tick() {
    const currentSimTime = new Date(this.state.simTime).getTime();
    this.state.simTime = new Date(currentSimTime + 60 * 60 * 1000).toISOString(); // advance 1 hr
    // Background processing could happen here
    this.emitChange();
  }

  public dispatch(action: EngineAction, payload?: Record<string, unknown>) {
    this.processAction(action, payload || {});
    this.appendAudit(action, payload || {});
    this.emitChange();
  }

  private processAction(action: EngineAction, payload: Record<string, unknown>) {
    const caseId = payload.caseId as string | undefined;
    const caseItem = caseId ? this.state.cases.find(c => c.id === caseId) : undefined;
    const now = this.state.simTime;

    switch (action) {
      case 'submitApplication':
        if (caseItem) {
          caseItem.status = 'routing';
          if (caseItem.steps[0]) {
            caseItem.steps[0].state = 'done';
            caseItem.steps[0].completedAt = now;
          }
          if (caseItem.steps[1]) {
            caseItem.steps[1].state = 'processing';
            caseItem.steps[1].startedAt = now;
          }
          this.addNotification({
            title: 'Application Submitted',
            message: `Your application ${caseId} has been successfully submitted.`,
            type: 'sms',
            caseId
          });
        }
        break;
      
      case 'routeCase':
      case 'departmentProcess':
        if (caseItem) {
          const stepId = payload.stepId as string;
          const step = caseItem.steps.find(s => s.id === stepId);
          if (step) {
            step.state = 'done';
            step.completedAt = now;
            const nextStep = caseItem.steps.find(s => s.state === 'idle');
            if (nextStep) {
              nextStep.state = 'processing';
              nextStep.startedAt = now;
            } else {
              caseItem.status = 'approved';
            }
          }
        }
        break;
      
      case 'requestConsent':
        if (caseItem) {
          caseItem.status = 'awaiting-consent';
          this.addNotification({
            title: 'Consent Required',
            message: `Action required: Please provide consent for data access on application ${caseId}.`,
            type: 'portal',
            caseId
          });
        }
        break;

      case 'dispatchPayment':
        if (caseItem) {
          caseItem.status = 'paid';
          caseItem.amount = '₹ 12,000';
          caseItem.referenceNumber = `TXN-${Math.floor(Math.random()*1000000)}`;
          this.addNotification({
            title: 'Payment Processed',
            message: `DBT Payment of ${caseItem.amount} processed for ${caseId}. Ref: ${caseItem.referenceNumber}`,
            type: 'sms',
            caseId
          });
        }
        break;

      case 'raiseException':
        this.state.exceptions.push({
          id: `EXC-${Math.floor(Math.random() * 10000)}`,
          adapterId: (payload.adapterId as string) || 'adpt-rev',
          caseId: caseId || '',
          attempts: 1,
          maxAttempts: 3,
          lastError: (payload.error as string) || 'Connection Timeout',
          state: 'retrying',
          createdAt: now
        });
        const adapter = this.state.adapters.find(a => a.id === payload.adapterId);
        if (adapter) {
          adapter.status = 'degraded';
        }
        break;
    }
  }

  private appendAudit(action: EngineAction, payload: Record<string, unknown>) {
    const prevHash = this.state.auditLog.length > 0 ? this.state.auditLog[this.state.auditLog.length - 1].hash : '0000000000000000';
    const audit: AuditEvent = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      caseId: payload.caseId as string | undefined,
      actor: this.state.currentRole,
      actorRole: this.state.currentRole,
      action,
      detail: JSON.stringify(payload),
      payload,
      at: this.state.simTime,
      prevHash,
      hash: ''
    };
    audit.hash = chainHash(prevHash, audit);
    this.state.auditLog.push(audit);
  }

  private addNotification(notif: Omit<Notification, 'id' | 'at' | 'read'>) {
    this.state.notifications.push({
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      at: this.state.simTime,
      read: false,
      ...notif
    });
  }

  private emitChange() {
    this.dispatchEvent(new Event('change'));
  }
}

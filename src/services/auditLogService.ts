import { AuditLog } from '../models/AuditLog';

const STORAGE_KEY = 'frontend_audit_logs';

class AuditLogService {
  getLogs(): AuditLog[] {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]',
    );
  }

  createLog(log: AuditLog): AuditLog {
    const logs = this.getLogs();

    const newLog: AuditLog = {
      ...log,
      id: crypto.randomUUID(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([newLog, ...logs]),
    );

    return newLog;
  }

  clearLogs() {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const auditLogService = new AuditLogService();
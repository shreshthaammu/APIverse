import { ApiChange } from '../models/ApiChange.js';
import { demoState, getDemoChangeById, getDemoChangeList, isDemoMode, type DemoChange } from '../config/demoData.js';

export const listChanges = (projectId: string, filter: Record<string, unknown>) => isDemoMode() ? getDemoChangeList(projectId).filter((item) => {
  return (!filter.type || item.changeType === filter.type) && (!filter.severity || item.severity === filter.severity) && (filter.breaking === undefined || item.breaking === filter.breaking);
}) : ApiChange.find({ projectId, ...filter }).sort({ detectedAt: -1 }).lean();
export const getChange = (projectId: string, id: string) => isDemoMode() ? getDemoChangeById(projectId, id) : ApiChange.findOne({ _id: id, projectId }).lean();
export const createChange = (projectId: string, input: Record<string, unknown>) => {
  if (isDemoMode()) {
    const change: DemoChange = {
      _id: `demo-change-${Date.now()}`,
      projectId,
      endpoint: String(input.endpoint || '/demo'),
      method: String(input.method || 'GET'),
      changeType: String(input.changeType || 'modified'),
      severity: String(input.severity || 'MEDIUM'),
      breaking: Boolean(input.breaking),
      oldSchema: input.oldSchema ?? null,
      newSchema: input.newSchema ?? null,
      description: String(input.description || ''),
      commit: (input.commit as DemoChange['commit']) || { hash: 'demo', message: 'Demo change', author: 'system', timestamp: new Date().toISOString() },
      detectedAt: new Date().toISOString(),
      status: String(input.status || 'pending_approval'),
      diffFields: Array.isArray(input.diffFields) ? input.diffFields : [],
    };
    demoState.changes.unshift(change as any);
    return change;
  }
  return ApiChange.create({ ...input, projectId });
};
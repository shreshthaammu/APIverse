import { ApiEndpoint } from '../models/ApiEndpoint.js';
import { Project } from '../models/Project.js';
import { demoState, getDemoApiById, getDemoApiList, isDemoMode, type DemoApi } from '../config/demoData.js';

export const listApis = (projectId: string) => isDemoMode() ? getDemoApiList(projectId) : ApiEndpoint.find({ projectId }).sort({ path: 1, method: 1 }).lean();
export const getApi = (projectId: string, id: string) => isDemoMode() ? getDemoApiById(projectId, id) : ApiEndpoint.findOne({ _id: id, projectId }).lean();
export const createApi = async (projectId: string, input: Record<string, unknown>) => {
  if (isDemoMode()) {
    const api: DemoApi = {
      _id: `demo-api-${Date.now()}`,
      projectId,
      method: String(input.method || 'GET'),
      path: String(input.path || '/demo'),
      group: String(input.group || 'API'),
      summary: String(input.summary || 'Demo endpoint'),
      description: String(input.description || ''),
      controller: String(input.controller || 'DemoController'),
      sourceFile: String(input.sourceFile || 'src/routes/demo.ts'),
      lineNumber: Number(input.lineNumber || 0),
      authentication: (input.authentication && typeof input.authentication === 'object' ? input.authentication : 'None') as DemoApi['authentication'],
      parameters: Array.isArray(input.parameters) ? input.parameters : [],
      requestSchema: input.requestSchema ?? null,
      responses: Array.isArray(input.responses) ? input.responses : [],
      hash: String(input.hash || `demo-${Date.now()}`),
      discoveredAt: new Date().toISOString(),
      status: String(input.status || 'documented'),
      sourceSnippet: String(input.sourceSnippet || ''),
    };
    demoState.apis.unshift(api as any);
    return api;
  }

  const api = await ApiEndpoint.create({ ...input, projectId });
  await Project.findByIdAndUpdate(projectId, { $inc: { apiCount: 1 } });
  return api.toObject();
};
export const updateApi = (projectId: string, id: string, input: Record<string, unknown>) => {
  if (isDemoMode()) {
    const api = getDemoApiById(projectId, id);
    if (!api) return null;
    Object.assign(api, input, { updatedAt: new Date().toISOString() });
    return api;
  }
  return ApiEndpoint.findOneAndUpdate({ _id: id, projectId }, input, { new: true, runValidators: true }).lean();
};
export async function deleteApi(projectId: string, id: string) {
  if (isDemoMode()) {
    const index = demoState.apis.findIndex((item) => item.projectId === projectId && item._id === id);
    if (index < 0) return null;
    const [removed] = demoState.apis.splice(index, 1);
    return removed;
  }

  const api = await ApiEndpoint.findOneAndDelete({ _id: id, projectId });
  if (api) await Project.findByIdAndUpdate(projectId, { $inc: { apiCount: -1 } });
  return api;
}
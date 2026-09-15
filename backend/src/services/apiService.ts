import { ApiEndpoint } from '../models/ApiEndpoint.js';
import { Project } from '../models/Project.js';
export const listApis = (projectId: string) => ApiEndpoint.find({ projectId }).sort({ path: 1, method: 1 }).lean();
export const getApi = (projectId: string, id: string) => ApiEndpoint.findOne({ _id: id, projectId }).lean();
export const createApi = async (projectId: string, input: Record<string, unknown>) => {
  const api = await ApiEndpoint.create({ ...input, projectId });
  await Project.findByIdAndUpdate(projectId, { $inc: { apiCount: 1 } });
  return api.toObject();
};
export const updateApi = (projectId: string, id: string, input: Record<string, unknown>) => ApiEndpoint.findOneAndUpdate({ _id: id, projectId }, input, { new: true, runValidators: true }).lean();
export async function deleteApi(projectId: string, id: string) {
  const api = await ApiEndpoint.findOneAndDelete({ _id: id, projectId });
  if (api) await Project.findByIdAndUpdate(projectId, { $inc: { apiCount: -1 } });
  return api;
}
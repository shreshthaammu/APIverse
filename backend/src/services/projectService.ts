import { Project } from '../models/Project.js';

export async function createProject(input: Record<string, unknown>) {
  return Project.create({ ...input, apiCount: 0, documentationStatus: 'synchronized' });
}
export const listProjects = () => Project.find().sort({ updatedAt: -1 }).lean();
export const getProject = (id: string) => Project.findById(id).lean();
export const updateProject = (id: string, input: Record<string, unknown>) => Project.findByIdAndUpdate(id, input, { new: true, runValidators: true }).lean();
export const deleteProject = (id: string) => Project.findByIdAndDelete(id);
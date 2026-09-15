import { Project } from '../models/Project.js';
import { demoState, getDemoProjectById, isDemoMode, type DemoProject } from '../config/demoData.js';

export async function createProject(input: Record<string, unknown>) {
  if (isDemoMode()) {
    const project: DemoProject = {
      _id: `demo-project-${Date.now()}`,
      name: String(input.name || 'New Demo Project'),
      repositoryUrl: String(input.repositoryUrl || 'https://github.com/demo/project'),
      branch: String(input.branch || 'main'),
      framework: String(input.framework || 'Express'),
      language: String(input.language || 'TypeScript'),
      apiCount: 0,
      documentedCount: 0,
      changesCount: 0,
      breakingCount: 0,
      documentationStatus: 'synchronized',
      lastScan: 'just now',
      lastDeployment: { status: 'pending', version: 'unreleased', timestamp: new Date().toISOString() },
      lastCommit: { hash: 'demo', message: 'Demo project created', author: 'system', timestamp: new Date().toISOString() },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    demoState.projects.unshift(project as any);
    return project;
  }

  return Project.create({ ...input, apiCount: 0, documentationStatus: 'synchronized' });
}

export const listProjects = () => isDemoMode() ? demoState.projects : Project.find().sort({ updatedAt: -1 }).lean();
export const getProject = (id: string) => isDemoMode() ? getDemoProjectById(id) : Project.findById(id).lean();
export const updateProject = (id: string, input: Record<string, unknown>) => {
  if (isDemoMode()) {
    const project = getDemoProjectById(id);
    if (!project) return null;
    Object.assign(project, input, { updatedAt: new Date().toISOString() });
    return project;
  }
  return Project.findByIdAndUpdate(id, input, { new: true, runValidators: true }).lean();
};
export const deleteProject = (id: string) => {
  if (isDemoMode()) {
    const index = demoState.projects.findIndex((project) => project._id === id);
    if (index < 0) return null;
    const [removed] = demoState.projects.splice(index, 1);
    return removed;
  }
  return Project.findByIdAndDelete(id);
};
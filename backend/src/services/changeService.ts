import { ApiChange } from '../models/ApiChange.js';
export const listChanges = (projectId: string, filter: Record<string, unknown>) => ApiChange.find({ projectId, ...filter }).sort({ detectedAt: -1 }).lean();
export const getChange = (projectId: string, id: string) => ApiChange.findOne({ _id: id, projectId }).lean();
export const createChange = (projectId: string, input: Record<string, unknown>) => ApiChange.create({ ...input, projectId });
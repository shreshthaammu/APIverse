import { Schema, model } from 'mongoose';

const projectSchema = new Schema({
  name: { type: String, required: true, trim: true },
  repositoryUrl: { type: String, required: true, trim: true, index: true },
  branch: { type: String, required: true, default: 'main' },
  framework: { type: String, required: true },
  language: { type: String, required: true },
  lastCommit: { type: Schema.Types.Mixed, default: null },
  apiCount: { type: Number, default: 0 },
  documentationStatus: { type: String, enum: ['synchronized', 'changes_detected', 'out_of_sync', 'error'], default: 'synchronized' },
}, { timestamps: true });

export const Project = model('Project', projectSchema);
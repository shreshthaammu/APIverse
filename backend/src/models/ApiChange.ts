import { Schema, model } from 'mongoose';

const schema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  endpoint: { type: String, required: true }, changeType: { type: String, enum: ['added', 'modified', 'deleted', 'breaking'], required: true },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
  breaking: { type: Boolean, default: false }, oldSchema: Schema.Types.Mixed, newSchema: Schema.Types.Mixed,
  description: String, commit: Schema.Types.Mixed, detectedAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });
export const ApiChange = model('ApiChange', schema);
import { Schema, model } from 'mongoose';
const schema = new Schema({ projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true }, commit: String, version: String, status: { type: String, enum: ['pending', 'running', 'successful', 'failed'], default: 'pending' }, documentationUrl: String, changes: { type: Schema.Types.Mixed, default: [] } }, { timestamps: true });
schema.index({ projectId: 1, createdAt: -1 });
export const Deployment = model('Deployment', schema);
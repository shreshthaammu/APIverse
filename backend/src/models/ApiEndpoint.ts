import { Schema, model } from 'mongoose';

const apiEndpointSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  method: { type: String, required: true, uppercase: true }, path: { type: String, required: true },
  controller: String, sourceFile: String, lineNumber: Number,
  parameters: { type: Schema.Types.Mixed, default: [] }, requestSchema: Schema.Types.Mixed,
  responseSchema: Schema.Types.Mixed, authentication: Schema.Types.Mixed, hash: String,
  discoveredAt: { type: Date, default: Date.now },
}, { timestamps: true });
apiEndpointSchema.index({ projectId: 1, path: 1, method: 1 }, { unique: true });
export const ApiEndpoint = model('ApiEndpoint', apiEndpointSchema);
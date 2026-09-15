import { Schema, model } from 'mongoose';
const schema = new Schema({ projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true }, version: { type: String, required: true }, openapiDocument: { type: Schema.Types.Mixed, required: true }, commit: String }, { timestamps: true });
export const ApiVersion = model('ApiVersion', schema);
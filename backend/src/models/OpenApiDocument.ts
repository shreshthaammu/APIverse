import { Schema, model } from 'mongoose';
const schema = new Schema({ projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, unique: true }, document: { type: Schema.Types.Mixed, required: true } }, { timestamps: true });
export const OpenApiDocument = model('OpenApiDocument', schema);
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, text: true },
  description: { type: String, required: true, text: true },
  projectUrl: { type: String },
  repoUrl: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  comments: [commentSchema],
}, { timestamps: true });

// Add text index for searching
projectSchema.index({ title: 'text', description: 'text' });

const Project = mongoose.model('Project', projectSchema);
export default Project;
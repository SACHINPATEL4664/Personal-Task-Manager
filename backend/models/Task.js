import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: [120, 'Title cannot exceed 120 characters'] },
  description: { type: String, trim: true, maxlength: [1000, 'Description cannot exceed 1000 characters'], default: '' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
  dueDate: { type: Date, default: null }
}, { timestamps: { createdAt: true, updatedAt: true } });

export default mongoose.model('Task', taskSchema);

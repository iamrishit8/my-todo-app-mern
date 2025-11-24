import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  priority: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'], 
    default: 'Low' // Changed default to Low
  },
  dueDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Todo', TodoSchema);
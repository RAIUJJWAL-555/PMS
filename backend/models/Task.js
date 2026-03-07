const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a task title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a task description'],
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  deadline: {
    type: Date,
    required: [true, 'Please add a deadline'],
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  exp_points: {
    type: Number,
    default: 50,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);

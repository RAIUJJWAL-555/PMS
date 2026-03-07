const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  project_name: {
    type: String,
    required: [true, 'Please add a project name'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a project description'],
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  project_leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);

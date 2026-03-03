const mongoose = require('mongoose');

// Task Schema Definition
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a task title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    deadline: {
        type: Date,
        required: [true, 'Please add a deadline']
    }
}, {
    timestamps: true // Automatically create createdAt and updatedAt fields
});

module.exports = mongoose.model('Task', taskSchema);
